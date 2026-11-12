"""Small lexical retrieval over hash-checked AVP references; no learner-data index."""
import hashlib,json,math,re
from pathlib import Path
from collections import Counter
from .errors import TutorError
ROOT=Path(__file__).resolve().parents[1]
def load_corpus(base=False):
 corpus=json.loads((ROOT/('data/corpus-base.json' if base else 'data/corpus.json')).read_text())
 report=(ROOT/'reports/validation.json').read_bytes()
 if hashlib.sha256(report).hexdigest()!=corpus['validation_report_sha256']:
  raise TutorError('Reference validation changed; rebuild the corpus.',503,'configuration_error')
 for name,expected in corpus.get('interpreter_files',{}).items():
  if hashlib.sha256((ROOT/name).read_bytes()).hexdigest()!=expected:
   raise TutorError('The interpreter changed; rerun validation and rebuild references.',503,'configuration_error')
 catalog=json.loads((ROOT/'public/library.json').read_text())
 for a in catalog:
  docs=[c for c in corpus['chunks'] if c['algorithm']==a['id'] and c.get('source_group')!='external']
  if not docs or any(c['validation_status']!='machine-validated' for c in docs):raise TutorError('An unvalidated source was rejected.',503,'configuration_error')
  if hashlib.sha256((ROOT/'public'/a['reference_path']).read_bytes()).hexdigest()!=docs[0]['program_sha256']:
   raise TutorError('Reference code changed; rerun validation.',503,'configuration_error')
  canonical=json.dumps(a,separators=(',',':'),ensure_ascii=False).encode()
  if hashlib.sha256(canonical).hexdigest()!=docs[0]['configuration_sha256']:
   raise TutorError('Reference configuration changed; rerun validation.',503,'configuration_error')
 from .ingestion import validate_source_inputs
 validate_source_inputs(corpus,ROOT)
 return corpus
STOP={'a','an','the','is','it','i','to','of','my','me','this','that','and','or','in','on','for','what','why','how','does','do','can','you','please','with','be','at','not','still','am'}
NORMAL={'indexes':'index','indices':'index','indexing':'index','bounds':'bound','boundary':'bound','elements':'element','values':'value','positions':'index','position':'index','returns':'return'}
def terms(text):return [NORMAL.get(x,x) for x in re.findall(r'[a-z0-9]+',text.lower()) if x not in STOP]
def retrieve(algorithm,question,limit=3):
 corpus=load_corpus();key=re.sub(r'[^a-z0-9]+','_',algorithm.lower()).strip('_')
 docs=[c for c in corpus['chunks'] if c['algorithm']==key and c['tutor_visible']]
 if not docs:return []
 query=Counter(terms(question));ranked=[]
 if any(x in query for x in ['last','final','miss','misses','skip','skips']):query['index']+=1
 if any(x in query for x in ['stop','stops','exit','exits']):query['return']+=1
 if any(x in query for x in ['overwrite','overwritten','overwrites']):query['source']+=1
 for d in docs:
  words=Counter(terms(d['text']));score=0.0
  for token,freq in query.items():
   if token in words:
    df=sum(token in terms(x['text']) for x in docs)
    score+=freq*(1+math.log((len(docs)+1)/(df+1)))*words[token]/(words[token]+1)
  if score:ranked.append((score,d['id'],d))
 if not ranked and re.search(r'walk|hint|help|stuck|explain|algorithm|next|step',question,re.I):return docs[:max(0,min(limit,3))]
 return [d for _,_,d in sorted(ranked,key=lambda x:(-x[0],x[1]))[:max(0,min(limit,3))]]
