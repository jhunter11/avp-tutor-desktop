import copy
import unittest
from backend.vector_rag import rank_vectors, extract_answer, validate_question, check_index
from backend.errors import TutorError


class VectorTests(unittest.TestCase):
    def test_cosine_ranking_and_solution_filter(self):
        docs = [
            {'id':'allowed', 'tutor_visible':True, 'text':'Checked source.', 'title':'Search'},
            {'id':'hidden', 'tutor_visible':False, 'text':'Complete answer.', 'title':'Search'},
            {'id':'other', 'tutor_visible':True, 'text':'Other source.', 'title':'Sort'}]
        found = rank_vectors([1.,0.], [[.8,.6],[1.,0.],[0.,1.]], docs, .3)
        self.assertEqual([d['id'] for d in found], ['allowed'])
        self.assertAlmostEqual(found[0]['score'], .8)

    def test_unmatched_query_abstains(self):
        self.assertIn('not enough', extract_answer([])['answer'])
        self.assertEqual(extract_answer([])['citations'], [])

    def test_offline_answer_uses_actual_retrieved_text(self):
        first = {'id':'a', 'text':'Stop at the final valid index.', 'kind':'teaching_note'}
        changed = {**first, 'text':'Search requires a sorted array.'}
        a = extract_answer([first]); b = extract_answer([changed])
        self.assertIn(first['text'], a['answer'])
        self.assertNotEqual(a['answer'], b['answer'])
        self.assertEqual(a['mode'], 'offline_source_extract')
        self.assertEqual(a['citations'], ['a'])

    def test_all_retrieved_support_can_reach_offline_answer(self):
        docs=[{'id':str(i),'text':f'Passage {i}.','kind':'teaching_note'} for i in range(3)]
        self.assertEqual(extract_answer(docs)['citations'],['0','1','2'])

    def test_answer_budget_keeps_quotes_whole(self):
        docs=[{'id':'large','text':'x'*150,'kind':'teaching_note'},
              {'id':'short','text':'A small source.','kind':'teaching_note'}]
        result=extract_answer(docs,max_characters=100)
        self.assertEqual(result['citations'],['short'])
        self.assertIn('A small source.',result['answer'])

    def test_weak_related_match_does_not_become_an_answer(self):
        docs=[{'id':'related','text':'A related sorting rule.','score':.46,'kind':'teaching_note'}]
        result=extract_answer(docs,min_score=.5)
        self.assertEqual(result['citations'],[])
        self.assertIn('answer cutoff',result['answer'])

    def test_each_quote_must_clear_answer_cutoff_even_after_a_strong_match(self):
        docs=[{'id':'strong','text':'A supported passage.','score':.8,'kind':'teaching_note'},
              {'id':'weak','text':'A weakly related passage.','score':.4,'kind':'teaching_note'}]
        result=extract_answer(docs,min_score=.5)
        self.assertEqual(result['citations'],['strong'])
        self.assertNotIn('A weakly related passage.',result['answer'])

    def test_answer_eligibility_does_not_depend_on_input_order(self):
        docs=[{'id':'weak','text':'A weak passage.','score':.4,'kind':'teaching_note'},
              {'id':'strong','text':'A supported passage.','score':.8,'kind':'teaching_note'}]
        self.assertEqual(extract_answer(docs,min_score=.5)['citations'],['strong'])

    def test_question_bounds(self):
        for question in ['', ' '*8, None, ['hi'], 'x'*1001]:
            with self.assertRaises(TutorError):validate_question(question)
        self.assertEqual(validate_question('  Why sorted?  '),'Why sorted?')

    def test_stale_or_malformed_index_rejected(self):
        from backend.embeddings import MODEL_ID, MODEL_REVISION
        corpus = {'chunks':[{'id':'a'}]}
        from backend.ingestion import EMBEDDING_RECIPE
        index = {'corpus_sha256':'current', 'model':MODEL_ID, 'revision':MODEL_REVISION,'embedding_recipe':EMBEDDING_RECIPE,
                 'dimensions':384, 'ids':['a'], 'vectors':[[1.]+[0.]*383]}
        check_index(index, corpus, 'current')
        for field,value in [('corpus_sha256','old'), ('revision','other'), ('ids',['bad']),
                            ('vectors',[[float('nan')]+[0.]*383]), ('vectors',[[0.]*384]), ('embedding_recipe','old')]:
            invalid = copy.deepcopy(index); invalid[field]=value
            with self.assertRaises(TutorError):check_index(invalid, corpus, 'current')

        for invalid in [None,[],{}, {'vectors':None}]:
            with self.assertRaises(TutorError):check_index(invalid,corpus,'current')


if __name__ == '__main__':unittest.main()
