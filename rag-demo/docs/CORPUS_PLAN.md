# Growing the AVP corpus

The current library is small. It contains 27 original teaching notes, nine partial AVP excerpts and six added explanation/syntax passages that can support replies. Another 89 records hold full reference programs and checked input configurations; those have vectors but remain outside the student answer view. The source text needs human review even though its related programs passed execution checks.

## Start with course fit

Ask the frontend team and professor for the course topic list, approved notes and solution-disclosure policy. Course notes require permission; access alone does not establish reuse rights. Keep learner conversations out of the corpus. For each algorithm, write a short explanation of its goal, preconditions, invariant and common failure modes, with a source reference. More copies of nearly identical code will not fill gaps such as why ordering permits binary search to discard half an interval.

Use the checked AVP programs to author explained traces and error examples. Mark faulty examples as faulty and keep them separate from correct references. Execution checks cover the chosen cases. A reviewer must check the explanation and whether a hint reveals too much.

## Candidate external sources

These are proposals; none has been ingested into this demonstration.

| Source | Useful material | Reuse step |
|---|---|---|
| [Open Data Structures](https://opendatastructures.org/) | Data structures, implementations, analysis and a pseudocode edition | Its publisher states a Creative Commons Attribution license. Preserve attribution and check the selected file. |
| [Jeff Erickson's Algorithms](https://jeffe.cs.illinois.edu/teaching/algorithms/) | Recursion, dynamic programming, greedy methods and graphs | The textbook uses CC BY 4.0. The author's other lecture notes use different, more restrictive terms. Record which source is used. |
| [MIT 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/) | Course notes and practice topics | Check each item and the [OCW terms](https://ocw.mit.edu/pages/privacy-and-terms-of-use/), including attribution, noncommercial and share-alike conditions. Keep answer keys separate. |
| [OpenDSA](https://opendsa.readthedocs.io/en/latest/Introduction.html) | Modules, exercises and visualization explanations | Select course-relevant modules and verify their actual source licenses before import. |

Do not index an entire textbook first. Select sections that answer the course's actual questions, retain headings and page/section IDs, and split at explanation boundaries. Keep chunks under the encoder's 256-wordpiece limit, or record and test an explicit alternative. The builder now enforces the full encoder budget and splits oversized automatic passages. Manual chunks must fit or fail the build; it never silently truncates text. Full programs remain excluded from answer retrieval.

## Proposed next increment

A reasonable next increment is 50 reviewed answer passages plus 30 independently written evaluation questions. This is a proposed target; contributor capacity and source access remain unconfirmed. Contributors can split four unassigned work items:

- Select topics and approve source permissions; record source revision, attribution and prose review.
- Add explanations and checked AVP cases for observed gaps.
- Build ingestion with deduplication, token-aware chunks, source hashes and solution visibility rules.
- Write evaluation questions without copying index text, then compare retrieval and answer quality.

Measure whether the expected source appears in the top three, whether all parts of a comparison question receive evidence, whether unrelated questions abstain, and whether generated claims cite supporting text. Keep the evaluation questions out of the vector index. Report failures as well as hits. The current authored smoke set is not held out and does not measure learning gains.

## Retrieval choices

Keep normalized dense vectors and exact cosine search for the small corpus. Compare a keyword baseline and hybrid search when exact AVP identifiers or syntax cause misses. Add a reranker only if a saved evaluation shows a useful gain. Consider multi-step or graph retrieval when questions need several linked facts and the simpler approach misses them; first collect those failing questions. A GPU is optional for larger embedding batches or local generation. Core retrieval needs no GPU, routing model or weight training.

The production frontend can keep its fixed tutor request and text-response envelope. Source selection and answer generation belong behind that API. The separate inspection endpoint exposes scores and vectors for this demonstration only.
