"""Index executable references only after the validation report matches their hashes."""
import hashlib,json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
h=lambda s:hashlib.sha256(s.encode()).hexdigest()
library=json.loads((R/'public/library.json').read_text());report=json.loads((R/'reports/validation.json').read_text())
validated={a['id']:a for a in report['algorithms']};chunks=[]
for a in library:
 program=(R/'public'/a['reference_path']).read_text();v=validated[a['id']]
 if v['status']!='machine-validated' or v['program_sha256']!=h(program) or v['configuration_sha256']!=h(json.dumps(a,separators=(',',':'),ensure_ascii=False)):
  # JS JSON.stringify has compact punctuation and preserves Unicode.
  raise SystemExit('Stale or failed validation for '+a['id'])
 common={'algorithm':a['id'],'title':a['title'],'validation_status':v['status'],'program_sha256':v['program_sha256'],'configuration_sha256':v['configuration_sha256'],'source_path':a['reference_path'],'human_review':'pending','source_revision':report['upstream_revision']}
 for index,note in enumerate(a['notes'],1):
  chunks.append({**common,'source_path':f"library.json#/{library.index(a)}/notes/{index-1}",'id':f"{a['id']}.note.{index}",'kind':'teaching_note','tutor_visible':True,'text':note+' Preconditions: '+a['precondition']})
 lines=program.splitlines()
 start=next(i for i,line in enumerate(lines) if line.strip().startswith('fun '))+1
 excerpt='\n'.join(lines[start:start+3])
 chunks.append({**common,'id':a['id']+'.excerpt','kind':'avp_excerpt','tutor_visible':True,'text':'AVP reference excerpt (not a complete solution):\n'+excerpt})
 # Full correct programs and configurations are indexed for presenter inspection only.
 # Student tutoring receives bounded teaching notes, never a complete replacement program.
 chunks.append({**common,'id':a['id']+'.program','kind':'reference_program','tutor_visible':False,'text':program})
 for c in a['cases']:
  result=next(x for x in v['results'] if x['suite']=='explicit-config' and x['id']==c['id'])
  chunks.append({**common,'source_path':f"library.json#/{library.index(a)}/cases/{a['cases'].index(c)}",'id':f"{a['id']}.config.{c['id']}",'kind':'validated_configuration','tutor_visible':False,'text':json.dumps({'input':c,'expected':result['expected'],'observed':result['actual']})})
corpus={'format_version':1,'interpreter_files':report['interpreter_files'],'validation_report_sha256':hashlib.sha256((R/'reports/validation.json').read_bytes()).hexdigest(),'human_review':'pending; execution checks do not validate every teaching statement','chunks':chunks}
(R/'data/corpus-base.json').write_text(json.dumps(corpus,indent=2)+'\n')
# The vector builder publishes the derived corpus after ingestion/chunking succeeds.
if not (R/'data/corpus.json').exists():(R/'data/corpus.json').write_text(json.dumps(corpus,indent=2)+'\n')
(R/'public/teaching-notes.json').write_text(json.dumps([c for c in chunks if c['tutor_visible']],indent=2)+'\n')
print('Indexed',len(chunks),'chunks;',sum(c['tutor_visible'] for c in chunks),'bounded teaching notes.')
