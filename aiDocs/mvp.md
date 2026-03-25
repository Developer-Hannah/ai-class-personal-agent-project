# MVP Definition
## Career Compass — Minimum Viable Product

**Version:** 1.0  
**Date:** March 25, 2026

---

## What MVP Means Here

The MVP is the smallest working version of Career Compass that satisfies all **core** project requirements and can be demoed. Stretch goals are explicitly out of scope until the MVP is complete and committed.

---

## MVP Is Complete When

- [ ] A user can open `http://localhost:3000` and see a chat interface
- [ ] The agent correctly uses the **calculator** tool for math questions
- [ ] The agent correctly uses the **web search** tool for current information
- [ ] The agent correctly uses the **RAG** tool and includes source attribution in its response
- [ ] The agent **chains tools** automatically (e.g., RAG + calculator in one turn)
- [ ] **Follow-up questions** work — the agent remembers earlier context in the conversation
- [ ] **Structured logging** prints to the console for every tool call
- [ ] All three API keys are loaded from `.env` and the app starts cleanly

---

## In Scope for MVP

| Area | What's Included |
|---|---|
| Tools | Calculator, Web Search (Tavily), RAG knowledge base |
| Vector store | `MemoryVectorStore` — in-memory, loaded at startup |
| RAG documents | 5+ career guidance documents in the `docs/` folder |
| Memory | Server-side message history array, reset on restart |
| UI | Single HTML page — input field, send button, message list |
| Server | Express.js, one `/chat` POST endpoint |
| Logging | Console logs: tool name, args, result, timestamp |
| Repo | `.gitignore`, `README.md`, `package.json`, `tsconfig.json` |

---

## Out of Scope for MVP

| Feature | Where It Lives |
|---|---|
| Streaming responses | Stretch goal — add after MVP is stable |
| File reader (4th tool) | Stretch goal — add after MVP is stable |
| ChromaDB persistence | Stretch goal — add after MVP is stable |
| Polished UI styling | Not a goal at all |
| Cloud deployment | Not a goal at all |

---

## MVP Build Order

This is the sequence that produces a clean, logical git history:

1. **Project setup** — `package.json`, `tsconfig.json`, `.env`, `.gitignore`, folder structure
2. **Calculator tool** — implement, test standalone, commit
3. **Web search tool** — implement, test standalone, commit
4. **RAG tool** — load documents, set up vector store, implement tool, commit
5. **Agent** — wire all three tools into `createReactAgent`, test in terminal, commit
6. **Conversation memory** — add message history, verify multi-turn works, commit
7. **Express server + Web UI** — `/chat` endpoint, `index.html`, end-to-end test, commit
8. **Polish** — logging cleanup, README, final review, commit

> Stretch goals begin only after step 8 is committed.

---

## Definition of "Good Enough" for MVP

- Tools return correct results — not necessarily perfectly formatted
- UI works — not necessarily pretty
- Logs are readable — not necessarily structured as JSON
- Commits are meaningful — not necessarily perfectly worded
- README explains how to run it — not necessarily comprehensive docs

The goal is a working, demonstrable agent with a clean repo. Polish comes after.
