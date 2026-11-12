"""Report fresh developer-authored challenge cases without tuning to their scores."""
import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from backend.vector_rag import ask, ROOT


def evaluate():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',default='reports/rag-challenge.json')
    args=parser.parse_args()
    fixtures=ROOT/'tests/fixtures/retrieval-challenge.json'
    cases=json.loads(fixtures.read_text()); results=[]
    for case in cases:
        response=ask(case['question'])
        expected=case['expected_any']; retrieved=[m['id'] for m in response['matches']]
        citations=response['citations']
        passed=bool(set(expected)&set(citations)) if expected else not citations
        results.append({**case,'retrieved':retrieved,'scores':[m['score'] for m in response['matches']],
            'citations':citations,'expected_source_retrieved':bool(set(expected)&set(retrieved)) if expected else None,
            'passed':passed,'answer_is_exact_source_text':all(m['text'] in response['answer'] for m in response['matches'] if m['id'] in citations)})
    positives=[r for r in results if r['expected_any']]; negatives=[r for r in results if not r['expected_any']]
    report={'recorded_at':datetime.now(timezone.utc).isoformat(),
        'scope':'Developer-authored challenge set. First measured before repairs; not an independent or human-learning benchmark. Corpus and cutoffs were not tuned to this set.',
        'corpus_sha256':hashlib.sha256((ROOT/'data/corpus.json').read_bytes()).hexdigest(),
        'fixture_sha256':hashlib.sha256(fixtures.read_bytes()).hexdigest(),
        'supported_source_retrieved':sum(r['expected_source_retrieved'] for r in positives),
        'supported_answer_coverage':sum(r['passed'] for r in positives),'supported_questions':len(positives),
        'unsupported_abstentions':sum(r['passed'] for r in negatives),'unsupported_questions':len(negatives),
        'all_quotes_exact':all(r['answer_is_exact_source_text'] for r in results),'results':results}
    (ROOT/args.output).write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({k:v for k,v in report.items() if k!='results'},indent=2))
    print('Cases requiring review: '+', '.join(r['id'] for r in results if not r['passed']))


if __name__=='__main__':evaluate()
