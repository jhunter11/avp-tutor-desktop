"""Build local dense vectors. Does not download a model or call a paid provider."""
import hashlib
import json
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from backend.embeddings import MODEL_ID, MODEL_REVISION, DIMENSIONS, embed, token_offsets, token_count
from backend.retrieval import ROOT, load_corpus
from backend.ingestion import assemble_corpus, embedding_text, EMBEDDING_RECIPE

corpus = assemble_corpus(load_corpus(base=True),ROOT,token_offsets,token_count)
raw_corpus=json.dumps(corpus,indent=2)+'\n'
texts = [embedding_text(c) for c in corpus['chunks']]
vectors = embed(texts)
index = {'model':MODEL_ID, 'revision':MODEL_REVISION, 'dimensions':DIMENSIONS,
         'embedding_recipe':EMBEDDING_RECIPE,
         'corpus_sha256':hashlib.sha256(raw_corpus.encode()).hexdigest(),
         'ids':[c['id'] for c in corpus['chunks']], 'vectors':vectors}
for name,text in [('data/corpus.json',raw_corpus),('data/vectors.json',json.dumps(index,separators=(',',':'))+'\n')]:
    path=ROOT/name;temporary=path.with_suffix('.tmp');temporary.write_text(text);temporary.replace(path)
print(f'Embedded {len(vectors)} source chunks into {DIMENSIONS}-dimensional unit vectors on CPU.')
