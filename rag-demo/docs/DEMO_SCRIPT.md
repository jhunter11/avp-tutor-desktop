# Two RAG demonstrations

Use the separate RAG page at http://127.0.0.1:5192/ and the old frontend at http://127.0.0.1:5173/MiamiOH-AVP-Demo/run?algorithm=linear_search.

Both currently use a labelled offline preview. Embedding and retrieval run for real; answers quote the corpus. No live answer-model call or student-learning result is claimed.

## Separate retrieval demo

Click **For-loop syntax**. The page sends the question to the RAG API, embeds it and searches the stored vectors. Show the retrieved `avp-syntax.for-loop` passage, its code block, score and source record. The intended passage appears in the top three; it need not rank first. The frontend does not hold the answer for this button.

Click **Function and return**. Show the different source passage and its `fun` / `return` / `end fun` example. These snippets come from a manual chunk file and execute against the pinned interpreter. Explain that program checks and prose review are separate.

Then click **Outside the corpus**. This question should quote no answer. Similarity cutoffs are settings, not calibrated confidence. An unsupported question can still retrieve related passages below the answer cutoff.

Keep the chat on the left. Use the right-pane selector to switch between Sources, Vector, Corpus and Discussion without leaving the conversation. Choose Vector to see the actual 384-number question vector. Scores show closeness to source vectors, not a probability that a statement is correct. Search finds the original source text; it does not decode the vector into an answer.

## Old frontend integration

Open the Linear Search route and the existing tutor panel. Ask: “How do I write an AVP for loop that visits every array element?”

The frontend still makes one fixed `POST /api/tutor` request with the question, code, screenshots, viewed state and recent history. The tutor backend asks the local RAG service for sources. Its offline response quotes those sources through the existing text answer field, which displays fenced examples as inert code. It does not insert them into the editor.

The offline label states that code, screenshots and execution were not analyzed. When a live provider is available, the same backend adapter includes the references with the supplied student context for generation. That live behavior still needs verification.

## Explain the timing

“We built a small complete path first so we can test source ingestion, chunk boundaries, vector retrieval and frontend delivery before importing a larger corpus. If a source changes or disappears, we can check that the index updates correctly. More documents won't fix a broken retrieval path.”

Then use `MEETING_NOTES.md` for open decisions. A useful next target is reviewed course sources plus independently authored questions, rather than a large untested upload.

## Vector comparison and directed video

In Vector, select `avp-syntax.for-loop`. The inspector shows both 384-dimensional vectors and recomputes cosine similarity from all components. The 24 contribution bars each sum 16 products; their total matches the backend score within rounding.

Choose Walkthrough to play the 134-second captioned Manim video. It shows the real ranking, the saved AVP snippet and the question-only retrieval call behind the fixed tutor API. Its while-loop example shows an actual unsupported-question failure. Use `animation/DIRECTOR_SCRIPT.md` as the presenter script.

Read `ACCURACY.md` for the new 24-case challenge results. The corpus needs support and coverage checks as well as more material. These developer-authored diagnostics are not an independent benchmark.
