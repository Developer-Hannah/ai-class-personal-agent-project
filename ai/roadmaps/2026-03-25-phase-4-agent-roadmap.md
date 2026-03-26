# Phase 4 Roadmap — Agent Assembly
**Date:** March 25, 2026
**Plan:** [2026-03-25-phase-4-agent-plan.md](./2026-03-25-phase-4-agent-plan.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)

> **No over-engineering.** Wire tools into createReactAgent, test it works, commit.

---

## Checklist

### Prerequisites
- [ ] All three API keys set in `.env`
- [ ] Phases 1, 2, 3 all committed

### `src/agent.ts`
- [ ] File created
- [ ] All three tools imported: `calculator`, `webSearch`, `ragTool`
- [ ] `ChatAnthropic` initialized with `claude-haiku-4-5` (dev) or `claude-sonnet-4-6` (demo)
- [ ] `temperature: 0` set
- [ ] `createReactAgent` import path confirmed working
- [ ] Agent created with all three tools
- [ ] Agent exported

### Temporary Test
- [ ] `src/test-agent.ts` written
- [ ] Agent invoked with multi-tool test question
- [ ] Response logged to console

### Verification — All 4 test cases pass
- [ ] Math question → calculator tool used
- [ ] Current info question → web_search tool used
- [ ] Career question → knowledge_base used with source attribution
- [ ] Combined question → tools chained automatically

### Commit
- [ ] **Committed:** `feat: ReAct agent with all tools`

---

## Status: `pending`
