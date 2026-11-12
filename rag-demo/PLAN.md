# AVP RAG demonstration plan

## Problem and scope
The team needs to inspect question-to-source retrieval without an algorithm frontend. The demo must distinguish real vector search from offline answer display. Technical work covers local embeddings and source integrity; the presentation covers retrieval limits, source permissions and corpus growth. The old frontend receives an optional local RAG bridge; the public API stays fixed. Shared charts stay outside this change.

## Proposed result
A question enters a local embedding model. The backend compares its vector with stored source vectors and retrieves passages. A separate page shows the query vector, similarity scores, source text and citations. With the user's offline selection, the answer contains exact source extracts. It makes no LLM answer call. An unmatched question receives an insufficient-evidence response.

## Assumptions and alternatives
The cached MiniLM model can run on CPU. Semantic ranking needs task-specific evaluation; similarity is not a probability or proof. The checked AVP corpus provides a small initial source set. Program execution checks do not review prose or establish learning outcomes. Keyword search remains a historical baseline. A hosted vector database is unnecessary at this size; graph retrieval needs a concrete question set before adding complexity.

## Dependencies and alignment
Use a local Python environment, pinned cached model revision, normalized embeddings, cosine similarity and the existing checked corpus. Follow the official model's pooling procedure. No provider credentials, paid calls or weight training are required. The team must agree on permitted course sources and solution-disclosure rules before expansion. Contributors can split source review, ingestion and evaluation without automatic assignments.

## Deliverables and understanding
Write vector retrieval and integrity tests before implementation. Produce an inspectable page, repeatable commands, a saved retrieval evaluation and a short corpus expansion plan. Keep proposed work distinct from executed checks. Reference examples remain supporting corpus artifacts, not the presentation interface.

## Sequence
V1: vector index, actual query embeddings, ranked passages, labelled extractive answers and evaluation. V2: reviewed course material, held-out questions and live provider generation with citation checks when available. The old frontend bridge remains local for review. No chart refresh or remote publication.

## Corpus expansion check
Add an explicit source manifest with editable chunk settings and manual passage files. Preserve source offsets, enforce the encoder token budget, and reject stale source/index pairs. Test additions, edits, removal, visibility and retrieval with temporary fixtures; keep evaluation questions outside the index. Make rebuild and evaluation repeatable without changing frontend code. Live generation remains a separate unverified step.
