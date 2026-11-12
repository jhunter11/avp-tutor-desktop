import copy,json,os,unittest
from unittest.mock import patch
from backend.test_tutor import example
from backend.test_tutor import Response
from backend.tutor import reply,build_messages
from backend.grounding import OfflineRagProvider,lookup
from backend.errors import TutorError


GROUNDING={'mode':'offline_source_extract','answer':'[avp-syntax.for-loop]\nUse end for.','citations':['avp-syntax.for-loop'],
 'matches':[{'id':'avp-syntax.for-loop','text':'Use end for.','source_path':'sources/avp-syntax.json','human_review':'pending'}]}


class GroundingTests(unittest.TestCase):
    def test_same_frontend_envelope_and_input_unchanged(self):
        d=example();original=copy.deepcopy(d)
        with patch.dict(os.environ,{'TUTOR_RAG_URL':'http://127.0.0.1:8783/api/rag/query'}),patch('backend.grounding.lookup',return_value=GROUNDING):
            result=reply(d,OfflineRagProvider())
        self.assertEqual(set(result),{'schema_version','request_id','answer','error'})
        self.assertEqual(d,original)
        self.assertIn('Offline RAG preview',result['answer'])
        self.assertIn('avp-syntax.for-loop',result['answer'])
    def test_grounding_reaches_provider_while_images_are_preserved(self):
        class Provider:
            messages=None
            def complete(self,messages):self.messages=messages;return 'Consider where this block ends.'
        provider=Provider()
        with patch.dict(os.environ,{'TUTOR_RAG_URL':'http://127.0.0.1:8783/api/rag/query'}),patch('backend.grounding.lookup',return_value=GROUNDING):
            result=reply(example(),provider)
        content=provider.messages[-1]['content']
        self.assertIn('reference_grounding',content[0]['text'])
        self.assertIn('Use end for.',content[0]['text'])
        self.assertTrue(any(x['type']=='image_url' for x in content))
        self.assertIn('References supplied',result['answer'])
    def test_lookup_failure_does_not_silently_produce_an_answer(self):
        with patch.dict(os.environ,{'TUTOR_RAG_URL':'http://127.0.0.1:8783/api/rag/query'}),patch('backend.grounding.lookup',side_effect=TutorError('RAG unavailable',503,'rag_unavailable')):
            with self.assertRaisesRegex(TutorError,'unavailable'):reply(example(),OfflineRagProvider())
    def test_nonlocal_retrieval_destination_rejected(self):
        with patch.dict(os.environ,{'TUTOR_RAG_URL':'https://example.org/api/rag/query'}):
            with self.assertRaisesRegex(TutorError,'loopback'):lookup('AVP syntax?')

    def test_unknown_citations_from_retriever_rejected(self):
        invalid={**GROUNDING,'citations':['missing-source']}
        with patch.dict(os.environ,{'TUTOR_RAG_URL':'http://127.0.0.1:8783/api/rag/query'}),patch('urllib.request.urlopen',return_value=Response(invalid)):
            with self.assertRaisesRegex(TutorError,'unavailable'):lookup('AVP syntax?')

    def test_reference_footer_keeps_public_reply_size_bound(self):
        class LongProvider:
            def complete(self,messages):return 'x'*16000
        with patch.dict(os.environ,{'TUTOR_RAG_URL':'http://127.0.0.1:8783/api/rag/query'}),patch('backend.grounding.lookup',return_value=GROUNDING):
            with self.assertRaisesRegex(TutorError,'invalid text'):reply(example(),LongProvider())
