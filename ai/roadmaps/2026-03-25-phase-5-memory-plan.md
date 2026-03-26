# Phase 5 Plan — Conversation Memory
**Date:** March 25, 2026
**Roadmap:** [2026-03-25-phase-5-memory-roadmap.md](./2026-03-25-phase-5-memory-roadmap.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)
**Prerequisite:** Phase 4 complete and committed.

> **No over-engineering.** An array and a function. No class, no storage layer, no TTL, no per-user sessions. One conversation history for the single local user.

---

## Goal
Follow-up questions that reference earlier context work correctly. The full message history is passed to the agent on every invocation.

## Guides
- [LangChain + LangGraph](../guides/langchain-langgraph.md) — conversation memory pattern

---

## File: `src/memory.ts`

### What it does
1. Declares `messageHistory` as a module-level array of `{ role: string; content: string }` objects
2. Exports a `chat(userMessage: string): Promise<string>` function that:
   - Pushes the user message onto `messageHistory`
   - Calls `agent.invoke({ messages: messageHistory }, { recursionLimit: 10 })`
   - Extracts the last message from `result.messages`
   - Extracts its text content (handle both string and array content shapes)
   - Pushes the assistant reply onto `messageHistory`
   - Returns the reply string
3. Exports a `clearHistory()` function that resets `messageHistory` to `[]`

### Agent dependency
`memory.ts` needs the agent. Two clean options:
- Import the agent directly from `agent.ts` (simplest — do this)
- Accept agent as a parameter (unnecessary abstraction — skip)

### Content extraction
Claude's response `content` field can be a string or an array. Handle both:
- If string: use directly
- If array: find the first item with `type === "text"` and use its `.text` property

---

## Wiring: `src/server.ts`

No changes to `server.ts` in this phase beyond updating the test call (if any) to use `chat()` from `memory.ts`. The `/chat` POST endpoint will be added in Phase 6.

---

## Verify Before Committing

Run a two-turn conversation via the test script from Phase 4 (or a new temporary one):

Turn 1: `"My job offer is $85,000 per year."`
Turn 2: `"What is that per month after 25% tax?"` — agent should reference the $85,000 without being told again

If the second turn correctly uses $85,000 without it being restated, memory is working.

---

## Commit
```
feat: conversation memory for multi-turn chat
```
