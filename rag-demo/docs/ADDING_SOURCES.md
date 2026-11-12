# Add sources without changing the demo code

The index reads only files explicitly listed in `sources/manifest.json`. It does not crawl the workspace or read credentials. Keep student conversations and evaluation questions out of `sources/`.

For manual chunks, copy the structure in `sources/avp-syntax.json`: each passage has a stable `id`, a `locator` and exact `text`. Preserve a complete explanation or small code example in each passage. Register the file in the manifest with `chunking: "manual"`, its title, topic/algorithm, kind, revision, license and review status. Oversized manual passages fail the build and require an explicit split.

For automatic chunking, add a UTF-8 `.md` or `.txt` file under `sources/` and use `chunking: "auto"`. The builder prefers paragraph ends, splits long paragraphs with the actual model tokenizer and retains character ranges. It includes overlap and checks the full embedding input, including the title and special tokens. It does not silently truncate the text.

Edit `data/rag-config.json` to change token size, overlap, top-k, retrieval cutoff or answer limits. Defaults use 224 tokens per source input, 24-token overlap and a 256-token encoder limit. Search can show related matches above 0.35 while the offline answer requires its first match to reach 0.5. These are demonstration cutoffs, not calibrated probabilities. A cautious cutoff can reject a valid paraphrase; keep that tradeoff visible in evaluation.

Rebuild and evaluate:

```sh
npm run index
npm run evaluate:rag
```

Add question/source pairs to `tests/fixtures/retrieval-cases.json`. Prepared presenter questions live in `public/demo-scenarios.json`; they do not contain answers. Neither file enters the source index. Use independent questions for a later held-out evaluation.

Run `npm run verify` for the full reference, syntax, ingestion, retrieval and page-build checks. The checked AVP syntax file includes expected outputs for its snippets; `validate:syntax` tests the code extracted from those actual passages. Its hash must match the syntax validation report before indexing.

The running service reads the rebuilt index on the next question. Source, manifest, chunk-setting or validation-report changes cause a clear unavailable response until the index is rebuilt. Backend code changes still require a process restart.

Code snippets use fenced `avp` blocks for display. They never execute through the chat or replace student code. Full reference programs and saved answer configurations must keep `tutor_visible: false`. A reviewer still needs to check source permission, explanation quality and hint disclosure.
