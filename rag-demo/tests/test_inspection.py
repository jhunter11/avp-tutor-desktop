import math
import unittest
from unittest.mock import patch
from backend.vector_rag import ask


class InspectionTests(unittest.TestCase):
    def test_displayed_comparison_uses_the_exact_search_vectors_and_only_retrieved_sources(self):
        query=[1.]+[0.]*383
        source=[.8,.6]+[0.]*382
        docs=[{'id':'visible','title':'Visible','text':'A source.','tutor_visible':True,'algorithm':'general'},
              {'id':'hidden','title':'Hidden','text':'A saved solution.','tutor_visible':False,'algorithm':'general'}]
        corpus={'chunks':docs,'rag_config':{'retrieval':{'min_score':.35,'top_k':3},'chunking':{},'answer':{'min_score':.5}}}
        index={'vectors':[source,query],'corpus_sha256':'fixture'}
        with patch('backend.vector_rag.load_index',return_value=(corpus,index)),patch('backend.vector_rag.embed',return_value=[query]):
            result=ask('What is the rule?')
        compared=result['retrieval']['vector_comparisons']
        self.assertEqual([r['id'] for r in compared],['visible'])
        self.assertEqual(compared[0]['vector'],source)
        exact=sum(a*b for a,b in zip(result['retrieval']['query_vector'],compared[0]['vector']))
        self.assertAlmostEqual(exact,result['matches'][0]['score'],places=6)
        self.assertAlmostEqual(compared[0]['norm'],1,places=6)
        self.assertTrue(all(math.isfinite(v) for v in compared[0]['vector']))


if __name__=='__main__':unittest.main()
