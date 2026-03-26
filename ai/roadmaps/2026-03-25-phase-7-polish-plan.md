# Phase 7 Plan — Structured Logging + Polish
**Date:** March 25, 2026
**Roadmap:** [2026-03-25-phase-7-polish-roadmap.md](./2026-03-25-phase-7-polish-roadmap.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)
**Prerequisite:** Phase 6 complete and committed. Project works end-to-end in the browser.

> **No over-engineering.** No logging library, no log levels, no log rotation. `console.log` with a consistent format is sufficient. This phase is about meeting graded requirements, not production hardening.

---

## Goal
Every tool call is logged to the console with name, args, result, and timestamp. `README.md` is complete. Project is fully submittable.

## Guides
- [Architecture](../../aiDocs/architecture.md) — logging format reference
- [MVP](../../aiDocs/mvp.md) — final checklist

---

## Structured Logging

### Where to add it
Each tool function in `src/tools/` should log before returning. Add a single `console.log` call inside each tool function, after the result is computed but before returning.

### Log format
```
[<ISO timestamp>] TOOL_CALL  <tool_name>  | args: <JSON> | result: <truncated string>
```

Example:
```
[2026-03-25T16:00:00.000Z] TOOL_CALL  calculator      | args: {"expression":"85000*0.72"} | result: "61200"
[2026-03-25T16:00:02.000Z] TOOL_CALL  web_search      | args: {"query":"SE salary 2026"} | result: "[Glassdoor: Software..."
[2026-03-25T16:00:04.000Z] TOOL_CALL  knowledge_base  | args: {"query":"resume tips"} | result: "[1] (Source: resume-wr..."
```

### Truncation
Truncate the result to ~80 characters in the log to keep it readable. Full results still go to the agent — truncation is log-display only.

### Implementation
A simple helper function `logToolCall(name, args, result)` defined once in a shared location (e.g., inline in each tool file, or in a tiny `src/logger.ts`) and called at the end of each tool function.

---

## `README.md` — Complete

Replace the stub from Phase 0 with:

1. **Project name and description** — what Career Compass is
2. **Tools** — list all three tools with one-line descriptions
3. **Prerequisites** — Node.js LTS, three API keys
4. **Setup**
   - `git clone ...`
   - `npm install`
   - `cp .env.example .env`
   - Fill in the three API keys
   - Add `.txt` documents to `docs/` (if not already present)
   - `npm run dev`
5. **Usage** — open `http://localhost:3000`, start chatting
6. **Example prompts** — 2-3 examples showing different tools being triggered

---

## Final Review Against MVP Checklist

Go through `aiDocs/mvp.md` and check off each item. Fix any gaps before committing.

Key items to verify:
- All three tools work from the browser
- Tool chaining works (one message triggers multiple tools)
- Follow-up questions use memory correctly
- RAG responses include source attribution
- Structured logging visible in terminal for every tool call
- `.gitignore` blocks `.env`, `node_modules`, `ai/`, `CLAUDE.md`

---

## Update `aiDocs/context.md`

Update the "Current Focus" section to reflect that MVP is complete:
```
## Current Focus
- MVP complete — all core requirements met
- Project is submittable
- Stretch goals available in Phase 8 (optional)
```

---

## Commit
```
polish: structured logging, README, final cleanup
```
