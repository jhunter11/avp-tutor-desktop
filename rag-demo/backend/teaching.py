"""A bounded question ladder; attempt count is not a mastery or correctness score."""
import re
def plan_turn(data):
 count=sum(t['role']=='assistant' for t in data['history'])
 level=min(4,count+1)
 if re.search(r'walk.?through|show.*step|explain.*step|give.*example',data['question'],re.I):level=max(level,3)
 style='walkthrough' if data['mode']=='explain' else 'pointed_question'
 return {'level':level,'style':style,'attempts_in_recent_history':count,'instruction':[
  'Identify the goal and ask one focused prediction question.',
  'Use the student reply to ask a narrower question about the relevant condition or invariant.',
  'Point to the exact supplied line or value; ask the student to evaluate one operation.',
  'Explain one concrete step when stuck, then ask for the next decision or a new-input prediction.'
 ][level-1]}
def public_references(found):
 return '\n\nReferences supplied: '+', '.join(x['id'] for x in found) if found else '\n\nNo matching checked reference was supplied.'
