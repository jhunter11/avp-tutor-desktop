import unittest
from backend.retrieval import retrieve, load_corpus
class RetrievalTests(unittest.TestCase):
 def test_every_algorithm_has_checked_sources(self):
  import json
  from pathlib import Path
  for a in json.loads(Path('public/library.json').read_text()):
   with self.subTest(a=a['id']):
    found=retrieve(a['id'],'walk me through this algorithm')
    self.assertTrue(found)
    self.assertTrue(all(x['algorithm']==a['id'] for x in found))
    self.assertTrue(all(x['validation_status']=='machine-validated' for x in found))
 def test_unknown_algorithm(self):self.assertEqual(retrieve('unknown','bounds'),[])
 def test_unrelated_question(self):self.assertEqual(retrieve('linear_search','quantum entanglement'),[])
 def test_no_complete_solution_in_hint_context(self):
  for x in retrieve('linear_search','loop bounds last index'):
   self.assertNotEqual(x['kind'],'reference_program')
   self.assertNotIn('end fun',x['text'])
 def test_counting_output_rule(self):
  self.assertTrue(any('output' in x['text'] for x in retrieve('comparison_counting_sort','output source overwritten')))
 def test_empty_search_knowledge(self):
  self.assertTrue(any('index' in x['text'].lower() or 'return' in x['text'].lower() for x in retrieve('linear_search','last index return')))

 def test_student_wording_about_last_value(self):
  self.assertTrue(any(x['id']=='linear_search.note.2' for x in retrieve('linear_search','Why does this miss the last value?')))
