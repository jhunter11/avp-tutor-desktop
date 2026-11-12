"""Optional local RAG bridge. No student code or screenshots leave this backend."""
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from .errors import TutorError


def enabled():return bool(os.environ.get('TUTOR_RAG_URL'))


def lookup(question):
    url=os.environ.get('TUTOR_RAG_URL','')
    parsed=urllib.parse.urlparse(url)
    if parsed.scheme!='http' or parsed.hostname not in {'127.0.0.1','localhost','::1'} or parsed.username or parsed.password:
        raise TutorError('The demo RAG URL must use an HTTP loopback service.',503,'configuration_error')
    if len(question)>1000:
        raise TutorError('Shorten this retrieval question to 1,000 characters or fewer.')
    request=urllib.request.Request(url,data=json.dumps({'question':question}).encode(),headers={'Content-Type':'application/json','X-RAG-Client':'demo-v1'})
    try:
        with urllib.request.urlopen(request,timeout=15) as response:
            raw=response.read(256_001)
        if len(raw)>256_000:raise ValueError()
        result=json.loads(raw)
        if (result['mode']!='offline_source_extract' or not isinstance(result['answer'],str)
            or not result['answer'].strip() or len(result['answer'])>14000 or not isinstance(result['matches'],list) or len(result['matches'])>8
            or not isinstance(result['citations'],list)):
            raise ValueError()
        matches=[]
        for item in result['matches']:
            if not isinstance(item.get('id'),str) or not 1<=len(item['id'])<=200 or not isinstance(item.get('text'),str) or len(item['text'])>6000:
                raise ValueError()
            matches.append({k:item[k] for k in ['id','title','text','source_path','source_revision','human_review','score'] if k in item})
        ids={item['id'] for item in matches}
        if any(not isinstance(c,str) or c not in ids for c in result['citations']):raise ValueError()
        return {'mode':result['mode'],'answer':result['answer'],'citations':result['citations'],'matches':matches}
    except (OSError,ValueError,TypeError,KeyError):
        raise TutorError('The local RAG service is unavailable or needs its index rebuilt.',503,'rag_unavailable') from None


class OfflineRagProvider:
    def complete(self,messages):
        payload=json.loads(messages[-1]['content'][0]['text'])
        grounding=payload.get('reference_grounding')
        if not grounding:raise TutorError('Configure the local RAG URL for the offline preview.',503,'configuration_error')
        return ('[Offline RAG preview; no model call]\n\n'+grounding['answer']+
                '\n\nReference extracts only. This preview has not analyzed your code, screenshots or viewed execution.')
