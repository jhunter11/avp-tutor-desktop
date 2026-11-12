# Retrieval accuracy: current limits

The offline reply quotes source text exactly. That checks provenance; it does not establish that the text answers the question.

The original 18 smoke cases remain regression checks. The new 24 developer-authored challenge cases include paraphrases, missing syntax topics and misleading keyword overlap. Neither set is an independent benchmark or a learning study. We did not change the corpus or similarity cutoffs to fit the challenge cases.

## Observed results

The new questions retrieve an expected source for 15 of 15 supported questions. Only 12 receive that source in the reply because three fall below the answer cutoff. The remaining failures involve binary-search reasoning, function returns and linear-search failure results. Review these false abstentions before selecting a lower cutoff.

Five of nine unsupported questions receive no quote. The other four receive related text for while-loop syntax, recursive-function rules, a complete quicksort request and an instruction to make a false indexing claim. The last case returns correct indexing text but still fails this test's abstention policy. These are relevance/policy failures, not evidence that the source text changed or that every quote contains a false statement.

Reports preserve the scores and source IDs in `reports/rag-challenge-before.json` and `reports/rag-challenge.json`. The diagnostic command writes failures without changing thresholds or presenting a passing test gate.

## Defect fixed

Previously, the first strong match allowed other passages below the answer cutoff into the reply. Regression tests reproduced that behavior. Each quoted passage must now clear the cutoff independently, and input order cannot suppress an eligible passage. This repair does not solve semantic support checking. The challenge counts remain unchanged.

## Next coding target

Keep this under the existing retrieval work in GitLab #19 until the team agrees on a separate issue. A proposed, unassigned work item is **Check source support before returning tutor help**:

- Agree whether to reject out-of-scope questions or return related passages with an explicit limitation.
- Add reviewed coverage metadata for syntax topics and algorithms; separate a complete solution request from a syntax example.
- Compare an evidence-support check with the current baseline on questions written by another teammate.
- Measure supported answer coverage and unsupported answers together; do not tune a cutoff for one metric alone.

Live generation needs its own citation-support checks. Program execution verifies the saved examples only; human review of explanations remains pending. No issue was published by this check.
