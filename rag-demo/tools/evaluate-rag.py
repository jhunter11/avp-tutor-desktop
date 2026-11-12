"""Small authored retrieval smoke set, not a held-out benchmark or learner study."""
import hashlib
import json
import sys
from datetime import datetime,timezone
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from backend.vector_rag import ask,ROOT

CASES=json.loads((ROOT/'tests/fixtures/retrieval-cases.json').read_text())
results=[]
for case in CASES:
    question=case['question'];expected=case['expected_sources']
    response=ask(question)
    ids=[d['id'] for d in response['matches']]
    hit=all(s in ids for s in expected) if expected else not response['citations']
    results.append({'question':question,'expected_source':expected,'returned_sources':ids,
        'scores':[d['score'] for d in response['matches']], 'expected_source_in_top_3_or_abstention':hit,
        'answer_citations':response['citations'],'expected_source_in_answer':all(s in response['citations'] for s in expected) if expected else not response['citations'],
        'answer_exactly_from_cited_sources':all(d['text'] in response['answer'] for d in response['matches'] if d['id'] in response['citations']),
        'elapsed_ms':response['retrieval']['elapsed_ms']})
matched=[r for r in results if r['expected_source']]
unmatched=[r for r in results if not r['expected_source']]
report={'recorded_at':datetime.now(timezone.utc).isoformat(),'scope':'Authored smoke questions; seen during development. Not a held-out benchmark, teaching evaluation or human-learning evidence.',
    'mode':'offline_source_extract','corpus_sha256':hashlib.sha256((ROOT/'data/corpus.json').read_bytes()).hexdigest(),
    'retrieval_hits_at_3':sum(r['expected_source_in_top_3_or_abstention'] for r in matched),'retrieval_questions':len(matched),
    'abstentions':sum(r['expected_source_in_top_3_or_abstention'] for r in unmatched),'unsupported_questions':len(unmatched),
    'expected_source_in_offline_answer':sum(r['expected_source_in_answer'] for r in matched),
    'limitation':'Exact extraction quotes up to three passages; including the expected source does not establish answer quality. Cutoffs are not calibrated. The authored set is not held out.',
    'results':results}
(ROOT/'reports/rag-evaluation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='results'},indent=2))
raise SystemExit(0 if all(r['expected_source_in_top_3_or_abstention'] and r['expected_source_in_answer'] and r['answer_exactly_from_cited_sources'] for r in results) else 1)
