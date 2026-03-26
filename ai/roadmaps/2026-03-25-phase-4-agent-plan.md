# Phase 4 Plan — Agent Assembly
**Date:** March 25, 2026
**Roadmap:** [2026-03-25-phase-4-agent-roadmap.md](./2026-03-25-phase-4-agent-roadmap.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)
**Prerequisite:** Phases 1–3 complete and committed. All three API keys in `.env`.

> **No over-engineering.** Wire the three existing tools into `createReactAgent`. No custom graph nodes, no state management, no callbacks yet. Just the simplest working agent.

---

## Goal
A `createReactAgent` instance with all three tools and Claude as the model. Testable from the terminal via a temporary script. Multi-tool chaining verified manually.

## Guides
- [LangChain + LangGraph](../guides/langchain-langgraph.md) — `createReactAgent`, tool wiring, recursion limit
- [Anthropic + Claude](../guides/anthropic-claude.md) — `ChatAnthropic`, model selection

---

## File: `src/agent.ts`

### What it does
1. Imports `calculatorTool` from `src/tools/calculator.ts`
2. Imports `webSearchTool` from `src/tools/webSearch.ts`
3. Imports `ragTool` from `src/tools/ragTool.ts`
4. Imports `vectorStore` init — **agent.ts must not run before the vector store is ready**. The simplest approach: `agent.ts` exports a factory function `createAgent(vectorStore)` that takes the initialized store, or it imports the tool directly if `ragTool.ts` lazily references the store.
5. Initializes `ChatAnthropic` with:
   - `model: "claude-haiku-4-5"` during development (cheap), switch to `"claude-sonnet-4-6"` for demo
   - `temperature: 0`
6. Calls `createReactAgent({ llm: model, tools: [calculatorTool, webSearchTool, ragTool] })`
7. Exports the agent

> **Model ID note:** `"claude-haiku-4-5"` and `"claude-sonnet-4-6"` are confirmed valid API aliases per Anthropic's models overview (March 2026). No date suffix required. See [anthropic-claude guide](../guides/anthropic-claude.md).

### Import note
`createReactAgent` — try `from "@langchain/langgraph/prebuilt"` first. Fall back to `from "langchain"` if it fails. See the LangChain guide for details.

### Recursion limit
When invoking, pass `{ recursionLimit: 10 }` as the second argument to `agent.invoke()` to prevent infinite loops during testing.

---

## Temporary Test Script: `src/test-agent.ts`

Write a throwaway script (deleted before Phase 5 commit or kept but gitignored) that:
1. Calls `initVectorStore()` to set up RAG
2. Creates the agent
3. Invokes it with a multi-tool test question such as:
   - "What is the average salary for a product manager? Calculate what that is per month after 25% tax."
4. Logs the final response

This script is only for manual verification — do not wire it into package.json scripts permanently.

---

## Verify Before Committing

The agent must correctly:
- Use **calculator** for math questions
- Use **web_search** for current events or salary data
- Use **knowledge_base** for career guidance questions
- **Chain tools** — a single question triggers RAG + calculator sequentially without you telling it to

Test cases:
1. `"What is 120000 divided by 12?"` → uses calculator
2. `"What are current software engineer salaries?"` → uses web search
3. `"How should I structure my resume?"` → uses knowledge_base with source attribution
4. `"The job says $95k. What is that per month after 30% tax?"` → chains calculator

---

## Commit
```
feat: ReAct agent with all tools
```
