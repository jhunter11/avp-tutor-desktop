# Validation notes

## Integrated frontend evidence — October 26, 2026

The original local integration recorded:

- 12 Python backend unit/HTTP checks passed.
- 68 focused frontend checks passed across Chromium, Firefox and WebKit; three inherited tests remain TODO. This was not the full repository suite.
- Typecheck and an isolated production build passed.
- Changed-file lint had zero errors and seven line-length warnings. Inherited CSS build warnings remain.
- One synthetic live hint through the actual frontend used free-only OpenRouter vision. Student code stayed unchanged and loading state cleared.
- OpenAI request/response behavior was checked with mocks only.

The inherited dependency audit recorded 27 findings (2 low, 6 moderate, 15 high, 4 critical). That result is historical; this transfer copy does not remediate or claim a current audit of the dependency graph.

The local source hashes were checked again on October 28 before creating this desktop copy. They matched the saved integration snapshot. Public-copy packaging checks are recorded below only after execution.

## Focused frontend command

```sh
npx vitest run tests/tutor.node.test.ts tests/globals.node.test.ts tests/routes.node.test.ts tests/components/panes/TutorPane.render.test.tsx tests/components/panes/VarsPane.render.test.tsx tests/components/visualization/VisFrame.render.test.tsx tests/hooks/useEditSrc.render.test.tsx tests/hooks/useSteps.render.test.tsx
```

## Public-copy checks — October 28, 2026

Executed in this public copy on macOS with Node 24.19.0:

- Fresh `npm ci --ignore-scripts --no-audit --no-fund`: passed (483 packages).
- `npm run build-g4`: passed using an isolated temporary npm prefix to work around the host bundled runtime's missing prefix directory. That workaround changed no source or global configuration.
- `python3 -m unittest backend.test_tutor backend.test_server -v`: 12 passed.
- `npm run typecheck`: passed.
- Focused frontend command above: 68 passed, 3 TODO; 15 test files passed and 3 skipped across the configured browser engines.
- `npm run build`: passed; the five inherited CSS selector warnings remain.
- Selected public text files: no matches in the targeted credential/private-key/local-home-path scan. Secret-file ignore behavior and the shareable `.env.example` were verified.

No new live model calls or paid-provider activation occurred during packaging. Windows instructions are provided for setup but were not executed on Windows.

The initial snapshot whitespace check reports trailing spaces in inherited source/algorithm files. Those files match the original checkout byte for byte and were preserved; the packaging documentation passes its focused whitespace check.
