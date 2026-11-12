import json
import hashlib
import re
import tempfile
import unittest
from pathlib import Path
from backend.ingestion import assemble_corpus, chunk_text, embedding_text, validate_source_inputs
from backend.errors import TutorError


def offsets(text):
    return [(m.start(),m.end()) for m in re.finditer(r'\S+',text)]


def count(text):
    return len(offsets(text))+2


CONFIG={'chunking':{'max_tokens':32,'overlap_tokens':4},'retrieval':{'top_k':3,'min_score':.35},'answer':{'max_passages':3,'max_characters':6000}}


class IngestionTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name)
        (self.root/'sources').mkdir();(self.root/'data').mkdir()
        (self.root/'data/rag-config.json').write_text(json.dumps(CONFIG))
        self.base={'chunks':[{'id':'base','algorithm':'search','title':'Search','kind':'teaching_note','tutor_visible':True,'text':'Base passage.'}]}
    def tearDown(self):self.tmp.cleanup()
    def manifest(self,mode='auto',path='sources/note.md',visible=True):
        d={'sources':[{'id':'new','title':'New note','algorithm':'search','kind':'teaching_note','path':path,'chunking':mode,'tutor_visible':visible,'revision':'fixture-1','license':'Local fixture','review_status':'pending'}]}
        (self.root/'sources/manifest.json').write_text(json.dumps(d))
    def build(self):return assemble_corpus(self.base,self.root,offsets,count)
    def test_add_edit_remove_source_without_code_change(self):
        self.manifest();p=self.root/'sources/note.md';p.write_text('A newly added explanation.')
        first=self.build();self.assertIn('A newly added explanation.',[d['text'] for d in first['chunks']])
        p.write_text('A revised explanation.');second=self.build()
        self.assertNotEqual(first['source_inputs'],second['source_inputs'])
        self.assertNotIn('A newly added explanation.',[d['text'] for d in second['chunks']])
        (self.root/'sources/manifest.json').write_text('{"sources":[]}')
        self.assertEqual([d['id'] for d in self.build()['chunks']],['base'])
    def test_auto_chunks_cover_end_and_obey_budget(self):
        text=' '.join(f'word{i}' for i in range(100))
        parts=chunk_text(text,'Title. ',32,4,offsets,count)
        self.assertTrue(any('word99' in p['text'] for p in parts))
        self.assertTrue(all(count('Title. '+p['text'])<=32 for p in parts))
        covered=set()
        for p in parts:
            self.assertEqual(p['text'],text[p['start']:p['end']])
            covered.update(p['text'].split())
        self.assertEqual(covered,set(text.split()))
        self.assertTrue(set(parts[0]['text'].split()) & set(parts[1]['text'].split()))
    def test_manual_chunks_keep_text_and_ids(self):
        self.manifest('manual','sources/manual.json')
        (self.root/'sources/manual.json').write_text(json.dumps({'passages':[{'id':'why','locator':'Section 2','text':'  Exact authored words.  '}]}))
        d=self.build()['chunks'][-1]
        self.assertEqual(d['id'],'new.why');self.assertEqual(d['text'],'  Exact authored words.  ')
        self.assertEqual(d['locator'],'Section 2')
    def test_oversized_manual_passage_requires_manual_split(self):
        self.manifest('manual','sources/manual.json')
        (self.root/'sources/manual.json').write_text(json.dumps({'passages':[{'id':'long','locator':'p1','text':'word '*80}]}))
        with self.assertRaisesRegex(TutorError,'manual'):self.build()
    def test_hidden_source_stays_hidden(self):
        self.manifest(visible=False);(self.root/'sources/note.md').write_text('A complete saved answer.')
        self.assertFalse(self.build()['chunks'][-1]['tutor_visible'])
    def test_duplicate_passage_ids_rejected(self):
        self.manifest('manual','sources/manual.json')
        passage={'id':'same','locator':'p1','text':'Repeated text.'}
        (self.root/'sources/manual.json').write_text(json.dumps({'passages':[passage,passage]}))
        with self.assertRaisesRegex(TutorError,'Duplicate'):self.build()
    def test_source_path_cannot_leave_sources(self):
        self.manifest(path='../outside.txt')
        with self.assertRaisesRegex(TutorError,'sources'):self.build()
    def test_config_limits_rejected(self):
        self.manifest();(self.root/'sources/note.md').write_text('Text.')
        invalid=json.loads(json.dumps(CONFIG));invalid['chunking']['max_tokens']=300
        (self.root/'data/rag-config.json').write_text(json.dumps(invalid))
        with self.assertRaises(TutorError):self.build()
    def test_empty_source_rejected(self):
        self.manifest();(self.root/'sources/note.md').write_text('  ')
        with self.assertRaisesRegex(TutorError,'empty'):self.build()

    def test_changed_source_or_config_rejected_until_rebuild(self):
        self.manifest();p=self.root/'sources/note.md';p.write_text('Original text.')
        corpus=self.build();validate_source_inputs(corpus,self.root)
        for relative in ['sources/note.md','sources/manifest.json','data/rag-config.json']:
            path=self.root/relative;original=path.read_bytes()
            path.write_bytes(original+b' ')
            with self.assertRaisesRegex(TutorError,'rebuild'):validate_source_inputs(corpus,self.root)
            path.write_bytes(original)
        p.unlink()
        with self.assertRaisesRegex(TutorError,'rebuild'):validate_source_inputs(corpus,self.root)

    def test_full_solution_cannot_be_made_visible(self):
        self.manifest();p=self.root/'sources/manifest.json';data=json.loads(p.read_text())
        data['sources'][0]['kind']='reference_program';p.write_text(json.dumps(data))
        with self.assertRaisesRegex(TutorError,'cannot be tutor-visible'):self.build()

    def test_symlink_to_outside_source_directory_rejected(self):
        self.manifest();outside=self.root/'outside.md';outside.write_text('Must not be read.')
        (self.root/'sources/note.md').symlink_to(outside)
        with self.assertRaisesRegex(TutorError,'sources'):self.build()

    def test_syntax_report_must_cover_current_source(self):
        self.manifest('manual','sources/manual.json');manifest=self.root/'sources/manifest.json'
        source=json.loads(manifest.read_text());source['sources'][0]['validation_report']='reports/syntax.json';manifest.write_text(json.dumps(source))
        raw=json.dumps({'passages':[{'id':'why','locator':'p1','text':'Checked tiny snippet.'}]})
        path=self.root/'sources/manual.json';path.write_text(raw);(self.root/'reports').mkdir()
        report={'source_path':'sources/manual.json','source_sha256':hashlib.sha256(raw.encode()).hexdigest(),'passed':1,'total':1,'results':[{'id':'new.why','passed':True}]}
        (self.root/'reports/syntax.json').write_text(json.dumps(report))
        self.assertIn('syntax-snippets-tested',self.build()['chunks'][-1]['validation_status'])
        path.write_text(raw+' ')
        with self.assertRaisesRegex(TutorError,'stale'):self.build()

    def test_syntax_report_cannot_omit_a_passage(self):
        self.manifest('manual','sources/manual.json');manifest=self.root/'sources/manifest.json'
        source=json.loads(manifest.read_text());source['sources'][0]['validation_report']='reports/syntax.json';manifest.write_text(json.dumps(source))
        raw=json.dumps({'passages':[{'id':'one','locator':'p1','text':'One.'},{'id':'two','locator':'p2','text':'Two.'}]})
        (self.root/'sources/manual.json').write_text(raw);(self.root/'reports').mkdir()
        report={'source_path':'sources/manual.json','source_sha256':hashlib.sha256(raw.encode()).hexdigest(),'passed':1,'total':1,'results':[{'id':'new.one','passed':True}]}
        (self.root/'reports/syntax.json').write_text(json.dumps(report))
        with self.assertRaisesRegex(TutorError,'incomplete'):self.build()


if __name__=='__main__':unittest.main()
