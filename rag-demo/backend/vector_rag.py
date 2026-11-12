"""Real dense retrieval with exact source extraction, without an answer-model call."""
import hashlib
import json
import math
import time
from .embeddings import MODEL_ID, MODEL_REVISION, DIMENSIONS, embed
from .errors import TutorError
from .retrieval import ROOT, load_corpus
from .ingestion import EMBEDDING_RECIPE

THRESHOLD = .35  # Demonstration cutoff; not calibrated confidence.


def validate_question(question):
    if not isinstance(question, str) or not 1 <= len(question.strip()) <= 1000:
        raise TutorError('Enter a question of 1 to 1,000 characters.')
    return question.strip()


def check_index(index, corpus, corpus_hash):
    if not isinstance(index,dict):
        raise TutorError('The vector index is stale or invalid. Rebuild the index.',503,'configuration_error')
    valid = (index.get('corpus_sha256') == corpus_hash
             and index.get('model') == MODEL_ID and index.get('revision') == MODEL_REVISION
             and index.get('embedding_recipe') == EMBEDDING_RECIPE
             and index.get('dimensions') == DIMENSIONS
             and index.get('ids') == [c['id'] for c in corpus['chunks']])
    vectors = index.get('vectors', [])
    valid = valid and isinstance(vectors,list) and len(vectors) == len(corpus['chunks'])
    if not isinstance(vectors,list):vectors=[]
    for vector in vectors:
        valid = valid and isinstance(vector, list) and len(vector) == DIMENSIONS
        if not valid:break
        valid = all(isinstance(x, (int,float)) and not isinstance(x,bool) and math.isfinite(x) for x in vector)
        if not valid:break
        valid = abs(sum(x*x for x in vector)-1) < .001
        if not valid:break
    if not valid:
        raise TutorError('The vector index is stale or invalid. Rebuild the index.', 503, 'configuration_error')


def load_index():
    corpus = load_corpus()
    try:
        index = json.loads((ROOT/'data/vectors.json').read_text())
    except (OSError, ValueError):
        raise TutorError('Build the local vector index before asking a question.',503,'configuration_error')
    check_index(index, corpus, hashlib.sha256((ROOT/'data/corpus.json').read_bytes()).hexdigest())
    return corpus, index


def rank_vectors(query, vectors, docs, threshold=THRESHOLD, limit=3):
    ranked = []
    for vector, doc in zip(vectors, docs):
        if not doc['tutor_visible']:continue
        score = sum(a*b for a,b in zip(query,vector))
        if score >= threshold:
            ranked.append({**doc, 'score': round(score,6)})
    return sorted(ranked, key=lambda d:(-d['score'],d['id']))[:limit]


def extract_answer(matches,max_passages=3,max_characters=6000,min_score=0):
    # This uses retrieved text, not a canned question/answer script or LLM completion.
    eligible = [doc for doc in matches if doc.get('score',1)>=min_score]
    if matches and not eligible:
        return {'mode':'offline_source_extract','answer':'No passage clears the current answer cutoff. Related passages appear below, but they are not enough evidence for an answer.','citations':[]}
    selected=[];used=0
    for doc in eligible:
        size=len(doc['id'])+len(doc['text'])+5
        if len(selected)<max_passages and used+size<=max_characters:
            selected.append(doc);used+=size
    if not selected:
        return {'mode':'offline_source_extract', 'answer':'There is not enough matching evidence in the current corpus to answer this question. Try an algorithms question or add a reviewed source.', 'citations':[]}
    return {'mode':'offline_source_extract',
            'answer':'\n\n'.join(f"[{d['id']}]\n{d['text']}" for d in selected),
            'citations':[d['id'] for d in selected]}


def metadata(corpus, index):
    config=corpus['rag_config']
    return {'model':MODEL_ID, 'revision':MODEL_REVISION, 'dimensions':DIMENSIONS,
            'indexed_chunks':len(index['vectors']),
            'answer_passages':sum(d['tutor_visible'] for d in corpus['chunks']),
            'algorithms':len(set(d['algorithm'] for d in corpus['chunks'] if d['algorithm']!='general')),
            'metric':'cosine similarity (dot product of unit vectors)',
            'threshold':config['retrieval']['min_score'], 'top_k':config['retrieval']['top_k'],
            'chunking':config['chunking'],'answer_limits':config['answer'],
            'mode':'offline_source_extract','embedding_recipe':EMBEDDING_RECIPE,
            'human_review':'pending; execution checks do not review prose',
            'corpus_sha256':index['corpus_sha256']}


def status():
    corpus,index = load_index()
    return metadata(corpus,index)


def ask(question):
    question = validate_question(question)
    start = time.perf_counter()
    corpus,index = load_index()
    config=corpus['rag_config']
    query = embed([question])[0]
    matches = rank_vectors(query,index['vectors'],corpus['chunks'],threshold=config['retrieval']['min_score'],limit=config['retrieval']['top_k'])
    by_id = {doc['id']:vector for doc,vector in zip(corpus['chunks'],index['vectors'])}
    comparisons = [{'id':doc['id'],'vector':by_id[doc['id']],
                    'norm':math.sqrt(sum(x*x for x in by_id[doc['id']]))} for doc in matches]
    return {'question':question, **extract_answer(matches,**config['answer']), 'matches':matches,
            'retrieval':{**metadata(corpus,index), 'query_vector':query,'vector_comparisons':comparisons,
                         'query_norm':math.sqrt(sum(x*x for x in query)),
                         'elapsed_ms':round((time.perf_counter()-start)*1000,1)}}
