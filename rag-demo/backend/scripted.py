"""Clearly labelled pacing preview; this is not LLM inference or answer grading."""
import json
from pathlib import Path
class ScriptedProvider:
 def complete(self,messages):
  payload=json.loads(messages[-1]['content'][0]['text'])
  algorithm=payload['supplied_context']['algorithm']
  entries=json.loads((Path(__file__).resolve().parents[1]/'public/library.json').read_text())
  a=next((x for x in entries if x['id']==algorithm or x['title']==algorithm),None)
  if not a or not payload['reference_notes']:return '[Scripted preview; no model call]\nNo matching reference is available. Which algorithm or rule should we inspect?'
  level=payload['teaching_plan']['level']
  clue=a['question_ladder'][level-1]
  if payload['help_mode']=='explain':clue=a['notes'][0]+' '+clue
  stale=not payload['supplied_context']['viewed_state']['code_matches_execution']
  prefix='Your editor differs from the executed source. The displayed trace describes the earlier run.\n\n' if stale else ''
  return '[Scripted preview; no model call]\n'+prefix+clue
