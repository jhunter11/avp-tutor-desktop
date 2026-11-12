# AVP RAG Lab

Ask a question, inspect semantic search results, then read an answer extracted from a cited passage. Open the local page at http://127.0.0.1:5192/.

For the presentation download and Windows setup, start with [DESKTOP.md](DESKTOP.md). The release ZIP includes a built page and video, so presenting it needs Python 3.11 but no Node or Manim.

The default page has no algorithm frontend. It uses real MiniLM query embeddings and stored source vectors. The user selected offline operation after the existing provider key failed. Answer display therefore uses exact source text, with a visible label; it makes no answer-model call. This is a retrieval demonstration, not a verified live generative RAG tutor.

The page has two panes: chat on the left and a selectable inspector on the right. Choose Sources, Vector, Corpus or Discussion. Chat stays visible when the inspector changes. Each offline question searches independently; chat history does not change retrieval.

The Vector view now compares the actual question and selected source vectors. It shows the sum of all 384 component products and checks it against the backend score. Choose **Walkthrough** for a captioned Manim example using a saved AVP query. See [animation setup and script](animation/README.md).

## Run

Use Node 22 and Python 3.11. The current machine has a local `.venv` and cached model. From this directory, start each process in its own terminal:

```sh
.venv/bin/python -m backend.rag_server --port 8783
```

```sh
PATH=/Users/jackhunter/.nvm/versions/node/v22.22.3/bin:$PATH npm run dev
```

No API key is needed. The backend binds to localhost and does not log questions. It runs embeddings on CPU and refuses model downloads during inference. The first question can take a few seconds while the model loads.

For a fresh machine, create an isolated Python 3.11 environment and install the pinned requirements:

```sh
python3.11 -m venv .venv
.venv/bin/python -m pip install -r requirements-rag.txt
npm ci --ignore-scripts
```

The model `sentence-transformers/all-MiniLM-L6-v2`, revision `1110a243fdf4706b3f48f1d95db1a4f5529b4d41`, must already exist in the Hugging Face cache. On a new machine, download that revision deliberately before the offline run. Model weights are not in this directory. The present local environment reuses the existing system Torch installation; NumPy and Transformers overrides are local to `.venv`.

## Check the saved result

```sh
npm run verify
```

This executes reference checks, builds the source corpus, runs Python tests, rebuilds vectors, runs the authored retrieval smoke set and builds the page. A change to reference code, source configuration, interpreter or validation report invalidates the dependent index until these steps run again. The embedding model uses masked mean pooling and unit normalization from the [publisher's model card](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2).

The initial corpus has 131 records: 27 original teaching notes, nine original AVP excerpts, nine full programs, 80 input configurations and six added explanation/syntax passages. All 131 have vectors. Retrieval for this answer view searches only the 42 notes/excerpts; full programs and configuration answers stay outside student-facing retrieval. Every result includes source and review metadata. Human review of prose is pending.

The supporting programs cover nine algorithms and passed 440 finite execution cases, five guard checks and detection of nine deliberately faulty practice programs. Those checks do not prove universal correctness or teaching effectiveness. `reports/rag-evaluation.json` records retrieval checks separately, including expected-source coverage and abstentions. Offline answers can quote up to three complete retrieved passages.

## API boundary

The demo-only endpoint is `POST /api/rag/query` with `{"question":"..."}` and `X-RAG-Client: demo-v1`. Its response exposes the query vector, ranked source text, scores and extractive answer for inspection. `GET /api/rag/status` describes the index.

This inspection endpoint is not a change to the team's frozen tutor contract. The existing fixed `POST /api/tutor` candidate and its tests remain in `backend/tutor.py`; that endpoint is not served by the RAG inspection process. A later integration can call retrieval inside the tutor backend while the frontend still sends its fixed context and receives a text answer. The old GitLab frontend now has a narrow, optional local RAG bridge. Its public tutor request/response remains fixed; the new code is local and uncommitted.

Read [the meeting script](docs/DEMO_SCRIPT.md) and [the corpus expansion plan](docs/CORPUS_PLAN.md). No issue, MR, deployment, schedule or team chart was changed by this experiment. The older walkthrough UI code is retained as supporting work but is not the demonstration page.

## Prepared demos and corpus updates

Use the syntax buttons on the RAG page, then ask the same question in the old frontend tutor. See [meeting notes](docs/MEETING_NOTES.md), [source authoring](docs/ADDING_SOURCES.md) and [the demonstration script](docs/DEMO_SCRIPT.md). Source additions and chunk settings require no frontend code change. Both previews stay offline until live generation is explicitly configured and verified.

Read [the accuracy notes](docs/ACCURACY.md) before presenting results. Fresh developer-authored diagnostics found expected sources for 15/15 supported questions, with 12/15 in replies, and abstentions on 5/9 unsupported questions. Remaining failures require support/coverage checks; expanding the corpus is not the only work left. `npm run evaluate:challenge` records these failures without changing cutoffs.
