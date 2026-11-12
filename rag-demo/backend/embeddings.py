"""Offline MiniLM inference following the publisher's masked mean-pooling recipe."""
import os
from functools import lru_cache
from threading import Lock

MODEL_ID = 'sentence-transformers/all-MiniLM-L6-v2'
MODEL_REVISION = '1110a243fdf4706b3f48f1d95db1a4f5529b4d41'
DIMENSIONS = 384
MAX_TOKENS = 256
LOCK = Lock()


@lru_cache(maxsize=1)
def encoder():
    os.environ['HF_HUB_OFFLINE'] = '1'
    os.environ['TRANSFORMERS_OFFLINE'] = '1'
    os.environ['USE_TF'] = '0'
    os.environ['USE_FLAX'] = '0'
    os.environ['TOKENIZERS_PARALLELISM'] = 'false'
    import torch
    from transformers import AutoModel, AutoTokenizer
    torch.set_num_threads(2)
    options = dict(revision=MODEL_REVISION, local_files_only=True, trust_remote_code=False)
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, clean_up_tokenization_spaces=False, **options)
    model = AutoModel.from_pretrained(MODEL_ID, use_safetensors=True, **options).to('cpu').eval()
    return torch, tokenizer, model


def embed(texts):
    torch, tokenizer, model = encoder()
    vectors = []
    with LOCK, torch.inference_mode():
        if any(len(tokenizer.encode(text,add_special_tokens=True,truncation=False))>MAX_TOKENS for text in texts):
            from .errors import TutorError
            raise TutorError('Text exceeds the encoder token limit. Split the passage or shorten the question.')
        for offset in range(0, len(texts), 16):
            tokens = tokenizer(texts[offset:offset+16], padding=True, truncation=False, return_tensors='pt')
            outputs = model(**tokens)[0]
            mask = tokens['attention_mask'].unsqueeze(-1).expand(outputs.size()).float()
            pooled = (outputs * mask).sum(1) / mask.sum(1).clamp(min=1e-9)
            vectors.extend(torch.nn.functional.normalize(pooled, p=2, dim=1).tolist())
    return vectors


def token_count(text):
    _,tokenizer,_=encoder()
    with LOCK:return len(tokenizer.encode(text,add_special_tokens=True,truncation=False,verbose=False))


def token_offsets(text):
    _,tokenizer,_=encoder()
    with LOCK:return tokenizer(text,add_special_tokens=False,truncation=False,return_offsets_mapping=True,verbose=False)['offset_mapping']
