"""Export real AVP retrieval output, source hashes and directed captions for Manim."""
import hashlib
import json
import re
import sys
from datetime import datetime,timezone
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from backend.vector_rag import ask,ROOT
from animation.evidence import validate_snapshot


def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()


def timestamp(seconds,separator='.'):
    millis=round(seconds*1000)
    hours,rem=divmod(millis,3600000);minutes,rem=divmod(rem,60000);secs,ms=divmod(rem,1000)
    return f'{hours:02}:{minutes:02}:{secs:02}{separator}{ms:03}'


def main():
    demo=ask('How do I write an AVP for loop that visits every array element?')
    limit=ask('What is the exact AVP while-loop syntax?')
    selected=next(m for m in demo['matches'] if m['id']=='avp-syntax.for-loop')
    if selected['id'] not in demo['citations']:raise ValueError('The animation source was not quoted by retrieval.')
    code=re.search(r'```avp\n(.*?)```',selected['text'],re.S).group(1).rstrip()
    validation=json.loads((ROOT/'reports/syntax-validation.json').read_text())
    checked=next(r for r in validation['results'] if r['id']==selected['id'])
    if not checked['passed'] or checked['code_sha256']!=hashlib.sha256(code.encode()).hexdigest():
        # The syntax validator preserves the fenced block trailing newline.
        if not checked['passed'] or checked['code_sha256']!=hashlib.sha256((code+'\n').encode()).hexdigest():
            raise ValueError('The displayed code does not match the executed syntax check.')
    if validation['source_sha256']!=sha(ROOT/'sources/avp-syntax.json'):raise ValueError('Syntax validation is stale.')
    challenge=json.loads((ROOT/'reports/rag-challenge.json').read_text())
    if challenge['corpus_sha256']!=demo['retrieval']['corpus_sha256']:raise ValueError('Challenge evaluation is stale.')
    storyboard=json.loads((ROOT/'animation/storyboard.json').read_text())
    context={**demo['retrieval'],**challenge,'source_rank':next(i+1 for i,m in enumerate(demo['matches']) if m['id']==selected['id'])}
    chapters=[];position=0
    for cue in storyboard:
        chapters.append({**cue,'narration':cue['narration'].format(**context),'start':position,'end':position+cue['seconds']});position+=cue['seconds']
    snapshot={'recorded_at':datetime.now(timezone.utc).isoformat(),'scope':'Recorded real offline retrieval, not live animation inference or generated tutoring.',
        'demo':demo,'unsupported':limit,'selected_source_id':selected['id'],'code':code,'syntax_check':checked,
        'challenge':{k:v for k,v in challenge.items() if k!='results'},'chapters':chapters,'duration_seconds':position,
        'source_sha256':{p:sha(ROOT/p) for p in ['data/corpus.json','data/vectors.json','sources/avp-syntax.json','backend/vector_rag.py','animation/storyboard.json','reports/rag-challenge.json']}}
    validate_snapshot(snapshot,ROOT)
    public=ROOT/'public/animation';public.mkdir(parents=True,exist_ok=True)
    (public/'snapshot.json').write_text(json.dumps(snapshot,indent=2)+'\n')
    # Split long chapter narration into short, timed captions. Both tracks derive from the same script.
    captions=[]
    for chapter in chapters:
        sentences=re.split(r'(?<=[.!?])\s+',chapter['narration'])
        words=sum(len(s.split()) for s in sentences);start=chapter['start']
        for sentence in sentences:
            end=start+chapter['seconds']*len(sentence.split())/words
            captions.append((start,end,sentence));start=end
    vtt='WEBVTT\n\n'+'\n\n'.join(f'{timestamp(a)} --> {timestamp(b)}\n{text}' for a,b,text in captions)+'\n'
    srt='\n\n'.join(f'{i+1}\n{timestamp(a,",")} --> {timestamp(b,",")}\n{text}' for i,(a,b,text) in enumerate(captions))+'\n'
    (public/'captions.vtt').write_text(vtt);(ROOT/'animation/captions.srt').write_text(srt)
    script=f'# AVP RAG: director and presenter script\n\n{position}-second silent animation with captions. Read the narration aloud if presenting. All retrieval values come from `public/animation/snapshot.json`.\n\n'
    for c in chapters:script+=f'## {timestamp(c["start"])} – {timestamp(c["end"])}: {c["title"]}\n\nDirection: {c["direction"]}\n\nNarration: {c["narration"]}\n\n'
    script+='The challenge cases are developer-authored diagnostics, not a held-out benchmark. The animation makes no live answer-model call and proves no learning outcome.\n'
    (ROOT/'animation/DIRECTOR_SCRIPT.md').write_text(script)
    (public/'presenter-script.txt').write_text(script)
    print(json.dumps({'snapshot':'public/animation/snapshot.json','seconds':position,'for_loop_rank':next(i+1 for i,m in enumerate(demo['matches']) if m['id']==selected['id']),'limit_sources':[m['id'] for m in limit['matches']]},indent=2))


if __name__=='__main__':main()
