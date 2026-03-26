# Project Roadmap — Career Compass
**Date:** March 25, 2026  
**Scope:** Full project, high-level phases only  
**Reference:** [Architecture](../../aiDocs/architecture.md) · [MVP](../../aiDocs/mvp.md) · [PRD](../../aiDocs/prd.md)

**Library Guides (`ai/guides/`):**
- [LangChain + LangGraph](../guides/langchain-langgraph.md) — `createReactAgent`, `tool()`, streaming, memory
- [Anthropic + Claude](../guides/anthropic-claude.md) — `ChatAnthropic`, models, rate limits
- [OpenAI Embeddings + MemoryVectorStore](../guides/openai-embeddings-vectorstore.md) — `OpenAIEmbeddings`, `MemoryVectorStore`, RAG tool pattern
- [Tavily Search](../guides/tavily-search.md) — `TavilySearchResults`, Tavily API, error codes
- [mathjs + Express](../guides/mathjs-express.md) — `math.evaluate()`, Express server, SSE streaming
- [Zod](../guides/zod_context7.md) — tool schemas, `.describe()`, v3 vs v4 imports
- [TypeScript + tsconfig](../guides/typescript-tsconfig_context7.md) — `tsconfig.json`, `tsx`, package.json scripts
- [dotenv](../guides/dotenv_context7.md) — `.env` loading, `.env.example`, gitignore
- [ChromaDB *(stretch)*](../guides/chromadb_context7.md) — persistent vector store, Docker setup, LangChain integration

---

## Guiding Principle

> **Avoid over-engineering.** This is a clean, focused class project — not a production system. No abstraction layers, no design patterns, no legacy-compatibility shims, no "craft" for its own sake. Every file and function should exist because it is directly needed. When in doubt, do the simpler thing.

---

## Pre-Work (Before Writing Code)

- [ ] Acquire all three API keys: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `TAVILY_API_KEY`
- [ ] Source 5+ real career guidance documents for the RAG knowledge base (`.txt` or `.md` files)
- [ ] Confirm Node.js LTS is installed
- [ ] Create a GitHub repo and connect it locally

---

## Phase 0 — Project Setup
*Goal: A clean, runnable skeleton. First meaningful commit.*

- [ ] Initialize `package.json` with TypeScript and all required dependencies
- [ ] Configure `tsconfig.json`
- [ ] Create `.env` and `.env.example`
- [ ] Confirm `.gitignore` covers secrets, `node_modules`, `dist`, and local AI workspace
- [ ] Create the folder structure: `src/`, `src/tools/`, `public/`, `docs/`, `uploads/`
- [ ] Write a minimal `src/server.ts` that starts Express and responds to a health check
- [ ] Write stub `README.md`
- [ ] **Commit:** `setup: project scaffold, tsconfig, dependencies`

---

## Phase 1 — Calculator Tool
*Goal: One working, tested tool. Establishes the tool pattern for everything else.*

- [ ] Implement `src/tools/calculator.ts` using `mathjs`
- [ ] Verify it handles basic expressions, multi-step math, and graceful errors
- [ ] **Commit:** `feat: calculator tool`

---

## Phase 2 — Web Search Tool
*Goal: Live external data flowing through a tool.*

- [ ] Implement `src/tools/webSearch.ts` using `TavilySearchResults`
- [ ] Verify it returns results and formats them for the agent
- [ ] **Commit:** `feat: web search tool (Tavily)`

---

## Phase 3 — RAG Tool
*Goal: Career knowledge base searchable by meaning.*

- [ ] Add 5+ career guidance documents to `docs/`
- [ ] Implement `src/vectorStore.ts` — load documents, embed with OpenAI, create `MemoryVectorStore`
- [ ] Implement `src/tools/ragTool.ts` — similarity search with source attribution
- [ ] Verify results include source filenames in the output
- [ ] **Commit:** `feat: RAG knowledge base tool`

---

## Phase 4 — Agent Assembly
*Goal: All three tools wired together into a working ReAct agent, testable from terminal.*

- [ ] Implement `src/agent.ts` — `createReactAgent` with all three tools and Claude model
- [ ] Write a temporary terminal test script to verify multi-tool chaining works
- [ ] **Commit:** `feat: ReAct agent with all tools`

---

## Phase 5 — Conversation Memory
*Goal: Multi-turn follow-up questions work reliably using server-side message history.*

- [ ] Implement `src/memory.ts` — `messageHistory` array and `chat()` helper
- [ ] Wire memory flow so full conversation history is passed on each turn
- [ ] Verify multi-turn memory: follow-up questions reference earlier context
- [ ] **Commit:** `feat: conversation memory for multi-turn chat`

---

## Phase 6 — Server + Web UI
*Goal: Agent accessible from a browser. End-to-end working product.*

- [ ] Implement `POST /chat` endpoint in `src/server.ts` — accepts message, returns reply
- [ ] Implement `public/index.html` — input field, send button, scrollable chat history
- [ ] Wire frontend to `/chat` endpoint with `fetch`
- [ ] Verify the full loop: browser → server → agent → tools → browser
- [ ] **Commit:** `feat: Express server and chat web UI`

---

## Phase 7 — Structured Logging + Polish
*Goal: Graded requirements met. Project is submittable.*

- [ ] Add structured console logging to every tool call (name, args, result, timestamp)
- [ ] Complete `README.md` — what it does, how to run it, required env vars
- [ ] Update `aiDocs/context.md` Current Focus section
- [ ] Final review against MVP checklist and deliverables list
- [ ] **Commit:** `polish: structured logging, README, final cleanup`

---

## Phase 8 — Stretch Goals *(Optional, Extra Credit)*
*Only begin after Phase 7 is committed and the project is in a clean, submittable state.*

- [ ] **Streaming** — SSE endpoint + token-by-token UI rendering
  - [ ] **Commit:** `feat(stretch): streaming responses via SSE`
- [ ] **File Reader tool** — 4th tool, reads local text files from `uploads/`
  - [ ] **Commit:** `feat(stretch): file reader tool`
- [ ] **ChromaDB** — replace `MemoryVectorStore` with persistent local vector store
  - [ ] **Commit:** `feat(stretch): ChromaDB persistent vector store`

---

## Commit History Target

The graders review commit history. The sequence above produces:

```
setup: project scaffold, tsconfig, dependencies
feat: calculator tool
feat: web search tool (Tavily)
feat: RAG knowledge base tool
feat: ReAct agent with all tools
feat: conversation memory for multi-turn chat
feat: Express server and chat web UI
polish: structured logging, README, final cleanup
feat(stretch): ...  (if applicable)
```

Each commit should represent a working, tested increment — not a work-in-progress dump.

---

## Phase Plan Docs

All phase plans and roadmaps live in `ai/roadmaps/`. Each phase has a plan (implementation detail) and a roadmap (progress checklist).

| Phase | Plan | Roadmap |
|---|---|---|
| 0 — Setup | [plan](./2026-03-25-phase-0-setup-plan.md) | [roadmap](./2026-03-25-phase-0-setup-roadmap.md) |
| 1 — Calculator | [plan](./2026-03-25-phase-1-calculator-plan.md) | [roadmap](./2026-03-25-phase-1-calculator-roadmap.md) |
| 2 — Web Search | [plan](./2026-03-25-phase-2-websearch-plan.md) | [roadmap](./2026-03-25-phase-2-websearch-roadmap.md) |
| 3 — RAG Tool | [plan](./2026-03-25-phase-3-rag-plan.md) | [roadmap](./2026-03-25-phase-3-rag-roadmap.md) |
| 4 — Agent Assembly | [plan](./2026-03-25-phase-4-agent-plan.md) | [roadmap](./2026-03-25-phase-4-agent-roadmap.md) |
| 5 — Memory | [plan](./2026-03-25-phase-5-memory-plan.md) | [roadmap](./2026-03-25-phase-5-memory-roadmap.md) |
| 6 — Server + UI | [plan](./2026-03-25-phase-6-server-ui-plan.md) | [roadmap](./2026-03-25-phase-6-server-ui-roadmap.md) |
| 7 — Polish | [plan](./2026-03-25-phase-7-polish-plan.md) | [roadmap](./2026-03-25-phase-7-polish-roadmap.md) |
| 8 — Stretch Goals | [plan](./2026-03-25-phase-8-stretch-plan.md) | [roadmap](./2026-03-25-phase-8-stretch-roadmap.md) |
