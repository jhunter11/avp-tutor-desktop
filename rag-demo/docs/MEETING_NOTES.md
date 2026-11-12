# RAG meeting notes

We now have two local demonstrations. The old frontend sends its existing tutoring request to a backend that retrieves source passages. The separate RAG page makes retrieval visible without requiring algorithm execution. Both use offline source extracts today. Live generated-answer quality remains unverified.

## What I would say

“I built the small system now so we can test the full path before expanding the corpus. We can add a source, choose manual or automatic chunks, rebuild the vectors and check whether the expected passage appears. We also test source edits and removal, token limits and unsupported questions. That gives us a repeatable way to judge whether a corpus change helps.”

The current corpus includes AVP syntax, algorithm notes, bounded code excerpts and checked reference configurations. Full programs and configuration answers have vectors but cannot enter the student answer view. The AVP syntax snippets execute under the actual inherited grammar. Human prose review is still pending.

The separate page shows the question vector, cosine matches, exact source text and citations. Prepared syntax buttons contain questions and expected source IDs, not saved answers. Source selection still runs through the backend.

## The API agreement

The frontend continues to send one versioned tutoring request. It includes the question, Hint/Explain mode, recent history, algorithm name, current student code, last executed code, viewed step, highlighted lines, variables, last trace actions and PNG screenshots. The response still contains a text answer or error in the fixed envelope. No patch or code-edit action was added.

Only the question goes to the local RAG lookup service. The corpus contains reference material, not student conversations. A live provider would receive the original student context plus bounded retrieved sources through the existing provider adapter. The offline preview has not analyzed the student's code or images.

Code blocks remain display content. The frontend renders fenced snippets as inert code and has no editor setter in the tutor path. A future “show saved solution” action remains a separate reviewed, deterministic control.

## Decisions to discuss

| Question | Working proposal | Evidence or decision needed |
|---|---|---|
| What does “model interaction protocol” mean for us? | Keep the frontend REST contract fixed. Put provider message formatting and retrieval inside the backend. | Agree on error handling, latency and whether streaming is needed later. Distinguish this from protocols for model tools. |
| Which model should answer? | Compare candidates on the same course questions, context and source passages before choosing. | Measure source support, teaching policy, latency and cost. Current offline checks cannot decide this. |
| What belongs in RAG? | Course-aligned explanations, AVP syntax, common mistakes and reviewed short examples, with source versions. | Professor/client approval of scope, source permissions and solution disclosure. |
| Do we need multiple RAG systems? | Start with one store and metadata filters for syntax, algorithm concepts and example type. | Separate indexes when access rules, embedding models or evaluation needs differ. Demonstrate a failure before adding routing. |
| Where do teaching skills belong? | Keep the teaching policy versioned in backend instructions. Retrieve approved examples separately if useful. | Review the policy and evaluate candidate changes; retrieved text must not override it. |
| How do we chunk? | Manually preserve syntax/code examples and explanation units. Use token-bounded automatic chunks for longer notes. | Compare expected-source recall and answer support across chunk settings using independent questions. |

We do not need a GPU to run this small CPU embedding/index demonstration. Larger batches or local model inference can justify one later. Weight training is a separate proposal and has not been enabled.

## What progress can we measure next?

Contributors can split source review, example checks, ingestion/chunking and evaluation. No names are assigned. A proposed increment is 50 reviewed answer passages and 30 independently written questions; capacity and source access still need agreement.

Measure whether the right sources appear, whether comparison questions receive all required sources, whether unsupported questions abstain, and whether live generated claims cite supporting text. Keep evaluation questions outside the index. The current authored checks establish local behavior on their cases, not general accuracy or human learning gains.

Source expansion and chunk tuning now have a tested workflow. Live answer generation, broader independent evaluation and team deployment review remain separate gates. The existing Gantt and Chevron charts stay with the teammates who maintain them.

## New accuracy evidence

The 24-case developer-authored challenge retrieves expected sources for 15/15 supported questions, but quotes them for 12/15. It abstains on 5/9 unsupported questions. Related syntax can still be returned for a missing topic, such as while loops. We fixed the per-passage answer cutoff, but that does not establish semantic support. See `ACCURACY.md` for failures and the proposed next coding target. The Manim walkthrough shows this limit using recorded output.
