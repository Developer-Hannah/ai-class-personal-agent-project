# Phase 8 Roadmap — Stretch Goals
**Date:** March 25, 2026
**Plan:** [2026-03-25-phase-8-stretch-plan.md](./2026-03-25-phase-8-stretch-plan.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)

> **No over-engineering.** Each stretch goal is independent. Implement in order, commit each separately.

---

## Checklist

### Stretch Goal A — Streaming
- [ ] `POST /chat/stream` route added to `src/server.ts`
- [ ] SSE headers set correctly
- [ ] `agent.stream()` called with `streamMode: "values"`
- [ ] Each chunk written as `data: <JSON>\n\n`
- [ ] `data: [DONE]\n\n` sent at end
- [ ] `index.html` updated to consume SSE stream
- [ ] Tokens appear progressively in UI
- [ ] README updated to document streaming behavior
- [ ] **Committed:** `feat(stretch): streaming responses via SSE`

### Stretch Goal B — File Reader Tool
- [ ] `src/tools/fileReader.ts` created
- [ ] Reads from `uploads/` directory only
- [ ] Path traversal check: resolves path and validates prefix
- [ ] Tool name: `"file_reader"` with specific description
- [ ] Error returned as string (never throws)
- [ ] Tool added to agent in `src/agent.ts`
- [ ] Verified: place a `.txt` file in `uploads/`, ask agent to read it
- [ ] README updated with file reader usage instructions
- [ ] **Committed:** `feat(stretch): file reader tool`

### Stretch Goal C — ChromaDB
- [ ] `chromadb` npm package installed
- [ ] ChromaDB server running locally (Docker or Python)
- [ ] `src/vectorStore.ts` updated to use `Chroma` from `@langchain/community/vectorstores/chroma`
- [ ] Collection name: `"career-compass-docs"`, URL: `"http://localhost:8000"`
- [ ] `ragTool.ts` unchanged (same `similaritySearch` API)
- [ ] Documents persist after server restart — verified
- [ ] README updated with ChromaDB setup instructions
- [ ] **Committed:** `feat(stretch): ChromaDB persistent vector store`

---

## Status: `pending`
