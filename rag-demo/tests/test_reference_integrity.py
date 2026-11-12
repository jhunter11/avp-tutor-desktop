import unittest
from pathlib import Path
from unittest.mock import patch
from backend.retrieval import load_corpus
from backend.errors import TutorError
class IntegrityTests(unittest.TestCase):
 def test_stale_reference_is_not_retrieved(self):
  original=Path.read_bytes
  def changed(path):
   return b'changed AVP source' if str(path).endswith('examples/linear_search.avp') else original(path)
  with patch.object(Path,'read_bytes',changed):
   with self.assertRaisesRegex(TutorError,'changed'):load_corpus()
 def test_stale_report_is_not_retrieved(self):
  original=Path.read_bytes
  def changed(path):
   return b'changed validation report' if str(path).endswith('reports/validation.json') else original(path)
  with patch.object(Path,'read_bytes',changed):
   with self.assertRaisesRegex(TutorError,'validation changed'):load_corpus()
 def test_stale_interpreter_is_not_retrieved(self):
  original=Path.read_bytes
  def changed(path):
   return b'changed interpreter' if str(path).endswith('vendor/avp/TraceInterpreterVisitor.ts') else original(path)
  with patch.object(Path,'read_bytes',changed):
   with self.assertRaisesRegex(TutorError,'interpreter changed'):load_corpus()
