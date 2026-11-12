import unittest
from backend.teaching import plan_turn, public_references
class TeachingTests(unittest.TestCase):
 def test_progressively_pointed(self):
  history=[]
  levels=[]
  for n in range(4):
   plan=plan_turn({'mode':'hint','question':'I am still stuck','history':history})
   levels.append(plan['level'])
   history += [{'role':'user','content':'I am still stuck'},{'role':'assistant','content':'Which position is next?'}]
  self.assertEqual(levels,[1,2,3,4])
 def test_explain_is_direct(self):
  self.assertEqual(plan_turn({'mode':'explain','question':'Explain this step','history':[]})['style'],'walkthrough')
 def test_help_request_can_escalate(self):
  self.assertGreaterEqual(plan_turn({'mode':'hint','question':'please walk through one step','history':[]})['level'],3)
 def test_no_mastery_inference(self):
  p=plan_turn({'mode':'hint','question':'yes','history':[]})
  self.assertNotIn('mastery',p)
 def test_references_not_claimed_as_answer_proof(self):
  self.assertIn('References supplied',public_references([{'id':'linear_search.note.1'}]))
