"""Integration checks with the real cached encoder and temporary authored fixtures."""
import json
import tempfile
import threading
import unittest
import urllib.request
from pathlib import Path
from unittest.mock import patch
from backend.embeddings import MODEL_ID,MODEL_REVISION,DIMENSIONS,embed,token_count,token_offsets
from backend.ingestion import EMBEDDING_RECIPE,assemble_corpus,chunk_text,embedding_text
from backend.errors import TutorError
from backend.vector_rag import ask,rank_vectors
from backend.rag_server import make_server


class SemanticPipelineTests(unittest.TestCase):
    def test_real_tokenizer_never_loses_tail_or_truncates(self):
        text=('An array position identifies a stored integer; check both interval bounds.\n\n'*65)+'Final marker: the last candidate remains eligible.'
        prefix='Interval explanation. teaching note. '
        for maximum in [64,128,224]:
            parts=chunk_text(text,prefix,maximum,8,token_offsets,token_count)
            self.assertGreater(len(parts),1)
            self.assertIn('last candidate remains eligible.',parts[-1]['text'])
            self.assertTrue(all(token_count(prefix+d['text'])<=maximum for d in parts))
            vectors=embed([prefix+d['text'] for d in parts])
            self.assertEqual(len(vectors),len(parts))
            self.assertTrue(all(len(v)==384 for v in vectors))
            query=embed(['What does the final marker say about the last candidate?'])[0]
            docs=[{'id':str(i),'text':part['text'],'tutor_visible':True} for i,part in enumerate(parts)]
            found=rank_vectors(query,vectors,docs,threshold=0,limit=3)
            self.assertTrue(any('last candidate remains eligible.' in doc['text'] for doc in found))
            covered=set()
            for d in parts:
                self.assertEqual(d['text'],text[d['start']:d['end']])
                covered.update(range(d['start'],d['end']))
            self.assertTrue(all(i in covered for i,c in enumerate(text) if not c.isspace()))

    def test_encoder_refuses_oversize_instead_of_silent_truncation(self):
        with self.assertRaisesRegex(TutorError,'token limit'):embed(['word '*300])

    def test_add_edit_delete_corpus_through_real_query_api(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);(root/'sources').mkdir();(root/'data').mkdir()
            config={'chunking':{'max_tokens':128,'overlap_tokens':8},'retrieval':{'top_k':3,'min_score':.35},'answer':{'max_passages':3,'max_characters':6000}}
            (root/'data/rag-config.json').write_text(json.dumps(config))
            source={'id':'fixture','title':'Practice attempt limit','algorithm':'general','kind':'teaching_note','path':'sources/practice.json','chunking':'manual','tutor_visible':True,'revision':'test','license':'Local test fixture','review_status':'test fixture only'}
            manifest=root/'sources/manifest.json';manifest.write_text(json.dumps({'sources':[source]}))
            path=root/'sources/practice.json'
            server=make_server(0);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
            try:
                for value in ['six','nine',None]:
                    if value:
                        passage={'id':'limit','locator':'Practice policy','text':f'This practice fixture allows exactly {value} attempts before it requests a teacher review.'}
                        path.write_text(json.dumps({'passages':[passage]}))
                    else:manifest.write_text('{"sources":[]}')
                    corpus=assemble_corpus({'chunks':[]},root,token_offsets,token_count)
                    vectors=embed([embedding_text(d) for d in corpus['chunks']])
                    index={'model':MODEL_ID,'revision':MODEL_REVISION,'dimensions':DIMENSIONS,'embedding_recipe':EMBEDDING_RECIPE,'vectors':vectors,'corpus_sha256':'temporary-fixture'}
                    req=urllib.request.Request(f'http://127.0.0.1:{server.server_port}/api/rag/query',data=json.dumps({'question':'How many attempts does the practice fixture allow before teacher review?'}).encode(),headers={'Content-Type':'application/json','X-RAG-Client':'demo-v1'})
                    with patch('backend.vector_rag.load_index',return_value=(corpus,index)):
                        with urllib.request.urlopen(req,timeout=30) as response:
                            result=json.load(response);self.assertEqual(response.status,200)
                    self.assertEqual(len(result['retrieval']['query_vector']),384)
                    self.assertAlmostEqual(result['retrieval']['query_norm'],1.,places=5)
                    if value:
                        self.assertIn('exactly '+value,result['answer'])
                        self.assertEqual(result['citations'],['fixture.limit'])
                    else:
                        self.assertEqual(result['citations'],[]);self.assertIn('not enough',result['answer'])
            finally:server.shutdown();server.server_close()


if __name__=='__main__':unittest.main()
