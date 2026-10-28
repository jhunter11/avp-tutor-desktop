# Source and modifications

Public desktop snapshot prepared by Jack Hunter on October 28, 2026.

The frontend comes from the Algorithm Visualization Project, base revision `c30d6dca06d87850582f39e12883408abe847e6d`. The upstream repository is `2026-algorithm-visualization` in Miami University's Algorithm-Visualization-Capstone-Project-AI-Integration GitLab group. Original authors and credits are preserved in README.md and the original GPLv3 LICENSE is included unchanged.

The modified version replaces the inherited AI code generator with a text-only Hint/Explain conversation. It adds exact current/executed source and viewed-state context, visualization screenshots, loading/error/retry feedback, a Python tutoring API, server-owned teaching skills, provider adapters, tests and API documentation. The editor/interpreter/visualizer and algorithm examples remain based on the original project.

Frontend integration changes affect `app/components/Visualizer.tsx`, `app/components/panes/AIPane.tsx`, `app/components/panes/VarsPane.tsx`, `app/components/visualization/VisFrame.tsx`, `vite.config.ts`, `package.json` and `package-lock.json`; new files are in `app/tutor/`, `backend/`, tutor tests and `docs/tutor/`. The tutor's teaching approach derives from Jack Hunter's standalone `jhunter11/demo-tutor` baseline `76ec05b`.

This public copy adds desktop setup instructions and validation notes, selects the locally checked Node 24.19.0 runtime in `.nvmrc`, and expands ignore rules. It is a fresh source snapshot without upstream Git history, internal issue/MR drafts, local audit paths, credentials or learner conversations. It is separate from the still-unmerged GitLab integration branch.

RAG, an improvement harness, student simulation and a saved-correct-solution button are future work. No student-learning result or production readiness is claimed.
