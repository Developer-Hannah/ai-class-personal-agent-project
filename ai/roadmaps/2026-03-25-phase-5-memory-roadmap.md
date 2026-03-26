# Phase 5 Roadmap — Conversation Memory
**Date:** March 25, 2026
**Plan:** [2026-03-25-phase-5-memory-plan.md](./2026-03-25-phase-5-memory-plan.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)

> **No over-engineering.** A module-level array and a chat() function. Nothing more.

---

## Checklist

### Prerequisites
- [ ] Phase 4 complete and committed

### `src/memory.ts`
- [ ] File created
- [ ] `messageHistory` declared as module-level array
- [ ] `chat(userMessage)` function exported
- [ ] User message pushed to history before invoke
- [ ] `agent.invoke({ messages: messageHistory }, { recursionLimit: 10 })` called
- [ ] Assistant content extracted (handles both string and array content shapes)
- [ ] Assistant reply pushed to history
- [ ] Reply returned as string
- [ ] `clearHistory()` function exported

### Verification
- [ ] Turn 1: state a salary figure
- [ ] Turn 2: ask a follow-up — agent references earlier figure without being told again
- [ ] History grows correctly across turns

### Commit
- [ ] **Committed:** `feat: conversation memory for multi-turn chat`

---

## Status: `pending`
