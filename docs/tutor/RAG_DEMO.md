# Local RAG integration

The existing frontend can use a local retrieval service behind its fixed tutor API. No frontend provider selection or new tutor request fields are needed.

Set up and start the RAG presentation from `rag-demo/` using [the desktop instructions](../../rag-demo/DESKTOP.md). It runs the retrieval API on port 8783 and the inspection page on 5192. Keep that process running.

Alternatively, start only the RAG service from `rag-demo/` after setup (Windows uses `.venv\\Scripts\\python.exe`):

```sh
.venv/bin/python -m backend.rag_server --port 8783
```

Start this repo's backend in a clearly labelled offline mode:

```sh
TUTOR_REPLY_MODE=offline_rag TUTOR_RAG_URL=http://127.0.0.1:8783/api/rag/query python3 -m backend.server --port 8781
```

Windows PowerShell, from the repository root:

```powershell
$env:TUTOR_REPLY_MODE = 'offline_rag'
$env:TUTOR_RAG_URL = 'http://127.0.0.1:8783/api/rag/query'
py -3.11 -m backend.server --port 8781
```

Then run the existing frontend with Node 22 and open:

http://127.0.0.1:5173/MiamiOH-AVP-Demo/run?algorithm=linear_search

Ask the tutor “How do I write an AVP for loop that visits every array element?” or “How do I define a function and return a value in AVP?” The backend retrieves sources and returns exact extracts in the existing text answer field. Code fences render as inert code examples. The tutor has no editor setter or replacement action.

The offline response states that it has not analyzed the submitted code, screenshots or execution. It does not call a model. Hint/Explain still travel in the existing request; the offline extractor does not simulate those teaching modes.

For live generation later, leave `TUTOR_REPLY_MODE` unset and configure an authorized provider as before, together with `TUTOR_RAG_URL`. The backend includes source passages with the original student context for either existing provider adapter. Live generation has not been verified for this change; no paid provider was enabled.

Only the question goes to the loopback retrieval service. The original request still carries current and executed code, screenshots, viewed state, history and mode to this tutor backend. Reference text is data, not instructions, and cannot override the no-replacement-solution policy. The local lookup currently accepts questions of up to 1,000 characters; longer retrieval questions return an actionable error through the existing envelope.

A retrieval outage or stale index returns an error instead of silently claiming a grounded answer. The RAG service must run for this local setup; deployment packaging remains separate work.

The separate inspection page is http://127.0.0.1:5192/. It shows the actual query vector, matching sources and review metadata. Source authoring, chunk settings, checks and meeting decisions are documented in [ADDING_SOURCES.md](../../rag-demo/docs/ADDING_SOURCES.md) and [MEETING_NOTES.md](../../rag-demo/docs/MEETING_NOTES.md).

Checks for the frontend repo:

```sh
python3 -m unittest discover -s backend -p 'test_*.py' -v
npx vitest run --project node tests/tutor-answer.node.test.tsx tests/tutor.node.test.ts
npm run build
```

These checks cover the fixed envelope, unchanged request data, reference injection, preserved images, visible offline labels, provider-independent message construction and inert code rendering. A real synthetic HTTP check through the frontend proxy also covers the tutor-to-RAG connection. Browser rendering still needs a visual check when desktop access is available.
