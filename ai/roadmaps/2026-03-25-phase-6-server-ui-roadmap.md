# Phase 6 Roadmap — Server + Web UI
**Date:** March 25, 2026
**Plan:** [2026-03-25-phase-6-server-ui-plan.md](./2026-03-25-phase-6-server-ui-plan.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)

> **No over-engineering.** One endpoint. One HTML file. No frontend framework.

---

## Checklist

### `src/server.ts` — POST /chat
- [ ] `chat` imported from `src/memory.ts`
- [ ] `POST /chat` route added
- [ ] `message` validated — 400 if missing
- [ ] `chat(message)` awaited
- [ ] `{ reply }` returned on success
- [ ] Error caught — 500 returned with `{ error: "Internal server error" }`
- [ ] Startup order correct: dotenv → initVectorStore → app.listen

### `public/index.html`
- [ ] File created
- [ ] Page title: "Career Compass"
- [ ] Scrollable chat history div
- [ ] Input field + Send button
- [ ] User and assistant messages visually distinct
- [ ] Send on button click and Enter key
- [ ] Input disabled while waiting, re-enabled after response
- [ ] "Thinking..." indicator shown while waiting
- [ ] Auto-scroll to bottom after each message
- [ ] Error message shown on fetch failure

### End-to-End Verification
- [ ] Calculator tool triggered from browser
- [ ] Follow-up memory works (references earlier message)
- [ ] Web search tool triggered from browser
- [ ] RAG tool triggered from browser — source attribution visible in reply
- [ ] UI remains usable after multiple turns

### Commit
- [ ] **Committed:** `feat: Express server and chat web UI`

---

## Status: `pending`
