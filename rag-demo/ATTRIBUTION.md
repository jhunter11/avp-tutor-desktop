# Sources

The local AVP grammar, generated parser, trace visitor and types come from the existing team frontend at revision `50e1b608983a98837e9f2af163cafeadbe85526c`. `docs/UPSTREAM.json` records original hashes and the isolated loop-cap patch. The copied GPL license remains in `LICENSE`. The original repository is unchanged.

The new library contains locally authored corrected reference programs, finite input cases and teaching notes. Execution checks do not constitute prose review. Source records distinguish notes in `public/library.json` from code excerpts in `public/examples/`.

Dense embeddings use `sentence-transformers/all-MiniLM-L6-v2` at revision `1110a243fdf4706b3f48f1d95db1a4f5529b4d41`. Its [model card](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) lists Apache 2.0 and documents masked mean pooling with normalization. Weights stay in the local model cache, outside the demo.

The earlier teaching candidate drew on Jane Street's `agent_skills` repository at `7c6715c29548a3b39d4a9545c698ee4fd17a7213`. Its source and MIT notice remain in `.upstream/janestreet/`. That candidate is not part of the active RAG extraction path.

External books and course sites named in `docs/CORPUS_PLAN.md` are future source candidates. No content from those sites has been added to this index.
