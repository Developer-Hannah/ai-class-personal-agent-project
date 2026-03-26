# Project Context — Career Compass

- **PRD:** [aiDocs/prd.md](./prd.md)
- **MVP:** [aiDocs/mvp.md](./mvp.md)
- **Architecture:** [aiDocs/architecture.md](./architecture.md)
- **Purpose:** Locally-hosted multi-tool AI career agent demonstrating the LangChain.js ReAct pattern (AI class Unit 8 project)
- **Changelog:** [ai/changelog.md](../ai/changelog.md) Concise change notes with references to source plan docs.

## Behavior
- Whenever creating plan docs and roadmap docs, save them in `ai/roadmaps/` and prefix filenames with the date.
- Add a clear "no over-engineering" note in each plan/roadmap pair and ensure related docs reference each other.
- After finishing a plan/roadmap implementation pair, update checklist status and then update `ai/changelog.md`.
- Keep docs in sync: when roadmap status changes, update this file's "Current Focus" and the changelog in the same pass.

## API Keys Required

- `ANTHROPIC_API_KEY` — Claude chat model
- `OPENAI_API_KEY` — embeddings only
- `TAVILY_API_KEY` — web search

## Current Focus

- MVP complete — all core requirements met
- Project is submittable
- Stretch goals available in Phase 8 (optional)
