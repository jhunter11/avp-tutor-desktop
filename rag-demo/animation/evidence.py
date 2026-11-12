"""Reject an illustration whose recorded numbers or source files have drifted."""
import hashlib
import math
import re


def validate_numeric_snapshot(snapshot):
    for key in ['demo','unsupported']:
        result=snapshot[key];query=result['retrieval']['query_vector']
        if len(query)!=384 or any(not math.isfinite(x) for x in query):raise ValueError('Invalid query vector.')
        if abs(math.hypot(*query)-1)>.001:raise ValueError('Query vector is not normalized.')
        comparisons={row['id']:row for row in result['retrieval']['vector_comparisons']}
        if set(comparisons)!={m['id'] for m in result['matches']}:raise ValueError('Comparison IDs differ from retrieval.')
        for match in result['matches']:
            source=comparisons[match['id']]['vector']
            if not match['tutor_visible'] or len(source)!=384 or any(not math.isfinite(x) for x in source):raise ValueError('Invalid source comparison.')
            if abs(math.hypot(*source)-1)>.001:raise ValueError('Source vector is not normalized.')
            cosine=sum(q*s for q,s in zip(query,source))
            if abs(cosine-match['score'])>.000001:raise ValueError('Displayed score differs from vector search.')
        quoted=[m for m in result['matches'] if m['id'] in result['citations']]
        if len(quoted)!=len(result['citations']):raise ValueError('Citation points outside retrieval.')
        cutoff=result['retrieval']['answer_limits']['min_score']
        if any(m['score']<cutoff or m['text'] not in result['answer'] for m in quoted):raise ValueError('Quoted text is ineligible or not exact.')
    selected=next(m for m in snapshot['demo']['matches'] if m['id']==snapshot['selected_source_id'])
    snippets=re.findall(r'```avp\n(.*?)```',selected['text'],re.S)
    if len(snippets)!=1 or snippets[0].rstrip()!=snapshot['code']:raise ValueError('Animation code differs from the source.')
    check=snapshot['syntax_check']
    if not check['passed'] or check['code_sha256']!=hashlib.sha256(snippets[0].encode()).hexdigest():raise ValueError('Animation code differs from the checked snippet.')
    chapters=snapshot['chapters']
    if chapters[0]['start']!=0 or any(c['end']-c['start']!=c['seconds'] for c in chapters):raise ValueError('Invalid chapter timing.')
    if any(a['end']!=b['start'] for a,b in zip(chapters,chapters[1:])) or chapters[-1]['end']!=snapshot['duration_seconds']:raise ValueError('Chapter timing has a gap.')


def validate_snapshot(snapshot,root):
    validate_numeric_snapshot(snapshot)
    for relative,digest in snapshot['source_sha256'].items():
        path=root/relative
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest()!=digest:raise ValueError(f'Animation input changed: {relative}. Re-export before rendering.')
