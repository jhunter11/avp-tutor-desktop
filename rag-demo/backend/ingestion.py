"""Explicit local sources, exact manual passages and token-bounded automatic chunks."""
import hashlib
import json
import re
from pathlib import Path
from .errors import TutorError

EMBEDDING_RECIPE = 'title-kind-text-v2-no-truncation'


def embedding_text(doc):
    return f"{doc['title']}. {doc['kind'].replace('_',' ')}. {doc['text']}"


def read_config(root):
    try:
        config=json.loads((root/'data/rag-config.json').read_text())
        chunk=config['chunking'];retrieval=config['retrieval'];answer=config['answer']
        answer.setdefault('min_score',.5)
        maximum=chunk['max_tokens'];overlap=chunk['overlap_tokens']
        valid=(type(maximum) is int and 16<=maximum<=256 and type(overlap) is int
               and 0<=overlap<maximum//2 and type(retrieval['top_k']) is int
               and 1<=retrieval['top_k']<=8 and type(retrieval['min_score']) in (int,float)
               and 0<=retrieval['min_score']<=1 and type(answer['max_passages']) is int
               and 1<=answer['max_passages']<=8 and type(answer['max_characters']) is int
               and 100<=answer['max_characters']<=12000 and type(answer['min_score']) in (int,float)
               and retrieval['min_score']<=answer['min_score']<=1)
        if not valid:raise ValueError()
        return config
    except (OSError,ValueError,TypeError,KeyError):
        raise TutorError('Invalid RAG configuration. Check token, overlap and retrieval limits.',503,'configuration_error')


def chunk_text(text,prefix,maximum,overlap,offsets,count):
    """Preserve source characters; prefer paragraph ends and include bounded token overlap."""
    positions=offsets(text)
    if not positions:raise TutorError('A source passage is empty.',503,'configuration_error')
    budget=maximum-count(prefix)-2
    if budget<=overlap:raise TutorError('Title leaves no usable chunk token budget.',503,'configuration_error')
    if count(prefix+text)<=maximum:
        return [{'text':text,'start':0,'end':len(text)}]
    parts=[];start=0
    while start<len(positions):
        end=min(len(positions),start+budget)
        first=positions[start][0];last=positions[end-1][1]
        # Prefer a paragraph boundary in the latter half of this token window.
        boundary=text.rfind('\n\n',first,last)
        if boundary>positions[start+(end-start)//2][0]:
            candidates=[i for i in range(start+1,end+1) if positions[i-1][1]<=boundary]
            if candidates:end=candidates[-1]
        while end>start and count(prefix+text[first:positions[end-1][1]])>maximum:end-=1
        if end<=start:raise TutorError('A source token cannot fit the configured chunk size.',503,'configuration_error')
        last=positions[end-1][1]
        parts.append({'text':text[first:last],'start':first,'end':last})
        if end==len(positions):break
        start=max(start+1,end-overlap)
    return parts


def source_path(root,name):
    candidate=(root/name).resolve();directory=(root/'sources').resolve()
    if not candidate.is_relative_to(directory) or candidate.suffix not in {'.md','.txt','.json'}:
        raise TutorError('Source files must stay inside sources/ and use .md, .txt or .json.',503,'configuration_error')
    return candidate


def validate_source_inputs(corpus,root):
    root=Path(root)
    for name,expected in corpus.get('source_inputs',{}).items():
        path=tracked_input_path(root,name)
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest()!=expected:
            raise TutorError('A source or chunk configuration changed; rebuild the vector index.',503,'configuration_error')


def tracked_input_path(root,name):
    if name in {'data/rag-config.json','sources/manifest.json','data/corpus-base.json'}:return root/name
    path=(root/name).resolve()
    if path.is_relative_to((root/'reports').resolve()) and path.suffix=='.json':return path
    return source_path(root,name)


def assemble_corpus(base,root,offsets,count):
    root=Path(root);config=read_config(root);chunking=config['chunking'];maximum=chunking['max_tokens'];overlap=chunking['overlap_tokens']
    manifest_path=root/'sources/manifest.json'
    try:manifest=json.loads(manifest_path.read_text())
    except (OSError,ValueError):raise TutorError('Read sources/manifest.json before building the corpus.',503,'configuration_error')
    if not isinstance(manifest,dict) or not isinstance(manifest.get('sources'),list):
        raise TutorError('The source manifest must contain a sources list.',503,'configuration_error')
    inputs={name:hashlib.sha256((root/name).read_bytes()).hexdigest() for name in ['data/rag-config.json','sources/manifest.json']}
    if (root/'data/corpus-base.json').exists():inputs['data/corpus-base.json']=hashlib.sha256((root/'data/corpus-base.json').read_bytes()).hexdigest()
    documents=[];source_ids=set()
    for source in manifest['sources']:
        required={'id','title','algorithm','kind','path','chunking','tutor_visible','revision','license','review_status'}
        if (not isinstance(source,dict) or not required.issubset(source)
            or any(not isinstance(source[k],str) or not source[k].strip() for k in required-{'tutor_visible'})
            or not re.fullmatch(r'[a-z0-9][a-z0-9_-]*',source['id'])
            or source['kind'] not in {'teaching_note','avp_excerpt','reference_program','validated_configuration'}
            or type(source['tutor_visible']) is not bool or source['chunking'] not in {'auto','manual'}):
            raise TutorError('Invalid source metadata in the manifest.',503,'configuration_error')
        if source['id'] in source_ids:raise TutorError('Duplicate source ID.',503,'configuration_error')
        source_ids.add(source['id'])
        if source['kind'] in {'reference_program','validated_configuration'} and source['tutor_visible']:
            raise TutorError('Full programs and answer configurations cannot be tutor-visible.',503,'configuration_error')
        path=source_path(root,source['path'])
        try:
            raw=path.read_bytes()
            if len(raw)>2_000_000:raise TutorError('A source exceeds the local ingestion size limit.',503,'configuration_error')
            text=raw.decode('utf-8')
        except (OSError,UnicodeError):raise TutorError('A listed source is missing or is not UTF-8.',503,'configuration_error')
        digest=hashlib.sha256(raw).hexdigest();inputs[source['path']]=digest
        common={'algorithm':source['algorithm'],'title':source['title'],'kind':source['kind'],
                'tutor_visible':source['tutor_visible'],'source_group':'external',
                'source_path':source['path'],'source_revision':source['revision'],'source_sha256':digest,
                'human_review':source['review_status'],'license':source['license'],
                'validation_status':'source-text-only; prose review separate'}
        if source.get('validation_report'):
            report_path=tracked_input_path(root,source['validation_report'])
            if not report_path.is_relative_to((root/'reports').resolve()):
                raise TutorError('Validation reports must stay inside reports/.',503,'configuration_error')
            try:
                report_raw=report_path.read_bytes();report=json.loads(report_raw)
                expected_ids={source['id']+'.'+p['id'] for p in json.loads(text)['passages']}
                observed_ids={r['id'] for r in report['results'] if r['passed'] is True}
                grammar=base.get('interpreter_files',{}).get('vendor/avp/Pseudocode.g4')
                valid=(report['source_path']==source['path'] and report['source_sha256']==digest
                       and type(report['passed']) is int and report['passed']==report['total']>0
                       and observed_ids==expected_ids and (not grammar or report.get('grammar_sha256')==grammar))
                if not valid:raise ValueError()
            except (OSError,ValueError,TypeError,KeyError):
                raise TutorError('A source syntax validation report is stale or incomplete. Rerun its checks.',503,'configuration_error')
            inputs[source['validation_report']]=hashlib.sha256(report_raw).hexdigest()
            common['validation_status']='syntax-snippets-tested; prose review separate'
            common['validation_report']=source['validation_report']
        prefix=embedding_text({**common,'text':''})
        if source['chunking']=='manual':
            try:passages=json.loads(text)['passages']
            except (ValueError,KeyError,TypeError):raise TutorError('Manual sources need a passages list.',503,'configuration_error')
            if not isinstance(passages,list) or not passages:raise TutorError('A manual source is empty.',503,'configuration_error')
            for passage in passages:
                if (not isinstance(passage,dict) or any(not isinstance(passage.get(k),str) or not passage[k].strip() for k in ['id','text','locator'])
                    or not re.fullmatch(r'[a-z0-9][a-z0-9_.-]*',passage['id'])):
                    raise TutorError('Invalid manual passage metadata.',503,'configuration_error')
                if count(prefix+passage['text'])>maximum:
                    raise TutorError('Split the oversized manual passage before rebuilding.',503,'configuration_error')
                documents.append({**common,'id':source['id']+'.'+passage['id'],'text':passage['text'],'locator':passage['locator'],'chunking':'manual'})
        else:
            for i,part in enumerate(chunk_text(text,prefix,maximum,overlap,offsets,count),1):
                documents.append({**common,'id':f"{source['id']}.chunk.{i}",'text':part['text'],
                                  'locator':f"characters {part['start']}:{part['end']}",
                                  'source_range':[part['start'],part['end']],'chunking':'auto'})
    chunks=[]
    for doc in base['chunks']:
        prefix=embedding_text({**doc,'text':''})
        parts=chunk_text(doc['text'],prefix,maximum,overlap,offsets,count)
        for i,part in enumerate(parts,1):
            chunks.append({**doc,'id':doc['id'] if len(parts)==1 else doc['id']+f'.part.{i}',
                           'parent_id':doc['id'],'text':part['text'],'source_range':[part['start'],part['end']],
                           'chunking':'auto' if len(parts)>1 else 'original'})
    chunks.extend(documents);seen=set()
    for doc in chunks:
        if doc['id'] in seen:raise TutorError('Duplicate passage ID.',503,'configuration_error')
        seen.add(doc['id']);doc['encoded_tokens']=count(embedding_text(doc))
        if doc['encoded_tokens']>maximum:raise TutorError('Chunk exceeds the token budget.',503,'configuration_error')
    return {**base,'format_version':2,'chunks':chunks,'source_inputs':inputs,'rag_config':config,
            'embedding_recipe':EMBEDDING_RECIPE}
