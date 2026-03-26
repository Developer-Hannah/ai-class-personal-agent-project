# Architecture — Career Compass

**Last updated:** March 25, 2026
**Reference docs:** [PRD](./prd.md) · [MVP](./mvp.md) · [Library guides](../ai/guides/)
**Phase plans:** [ai/roadmaps/](../ai/roadmaps/2026-03-25-high-level_project-roadmap.md)

---

## System Overview

Career Compass is a locally-hosted, single-user chatbot. A browser sends messages to an Express server, which delegates to a `chat()` function that maintains history and invokes the LangGraph ReAct agent. The agent reasons over the full conversation and decides which tool(s) to call, then returns a final response.

```
Browser (index.html)
    │  POST /chat { message }
    ▼
Express Server (server.ts)
    │  calls chat(message) from memory.ts
    ▼
memory.ts
    │  pushes to messageHistory[]
    │  calls agent.invoke({ messages: history }, { recursionLimit: 10 })
    ▼
LangGraph ReAct Agent (agent.ts)
    │  loops: LLM → decide → tool → LLM → ...
    ▼
Claude (chat model) ──── decides which tool(s) to call
    │
    ├── calculator      →  mathjs.evaluate()
    ├── web_search      →  Tavily API  →  internet
    └── knowledge_base  →  MemoryVectorStore
                              └── OpenAI embeddings
                                  └── docs/ folder (5+ .txt files)
```

---

## Request / Response Flow

1. User types a message and submits in `index.html`
2. Frontend sends `POST /chat` with `{ message: string }`
3. `server.ts` calls `chat(message)` from `memory.ts`
4. `memory.ts` pushes the user message onto `messageHistory[]`
5. `memory.ts` calls `agent.invoke({ messages: messageHistory }, { recursionLimit: 10 })`
6. Agent enters ReAct loop:
   - Claude receives the full message history + tool descriptions
   - Claude decides whether to call a tool or respond directly
   - If tool call: execute tool, log the call, append result to messages, loop back
   - If final response: exit loop
7. `memory.ts` extracts content from the last message in `result.messages`
   - Content can be a `string` or an array — handle both (find item with `type === "text"`)
8. `memory.ts` pushes the assistant reply onto `messageHistory[]` and returns it
9. `server.ts` returns `{ reply: string }` to the browser
10. Frontend appends the reply to the chat display

---

## Component Map

```
src/
├── server.ts          Entry point. Express app, /chat + /health routes, startup sequence
├── agent.ts           createReactAgent wiring — ChatAnthropic + all tools assembled here
├── memory.ts          messageHistory[] array, chat() helper, clearHistory()
├── vectorStore.ts     initVectorStore() — loads docs/, embeds with OpenAI, returns MemoryVectorStore
├── logger.ts          logToolCall(name, args, result) helper — shared by all tool files
└── tools/
    ├── calculator.ts  mathjs.evaluate() wrapped as a LangChain tool
    ├── webSearch.ts   TavilySearchResults instance (no custom wrapper needed)
    └── ragTool.ts     knowledge_base tool — similaritySearch() + source attribution formatting

public/
└── index.html         Single-page chat UI — input, send, scrollable history (vanilla JS)

docs/
└── *.txt              5+ career guidance source documents for RAG

uploads/               User-dropped files for the file reader stretch goal (empty until Phase 8)

aiDocs/                Project documentation (tracked)
ai/                    Local workspace — guides, roadmaps, notes (gitignored)
```

---

## Module Responsibilities

| Module | Owns | Does NOT own |
|---|---|---|
| `server.ts` | Express setup, routes, startup sequence | message history, agent invocation |
| `memory.ts` | `messageHistory[]`, `chat()`, `clearHistory()` | HTTP, agent config |
| `agent.ts` | `createReactAgent` instance, tool wiring, Claude model | request handling, memory |
| `vectorStore.ts` | Document loading, embedding, `MemoryVectorStore` | tool interface |
| `ragTool.ts` | LangChain tool wrapper, result formatting | vector store initialization |
| `logger.ts` | `logToolCall()` function | nothing else |

---

## Package List

| Package | Version | Purpose |
|---|---|---|
| `@langchain/langgraph` | ^1.2.5 | ReAct agent (`createReactAgent`) |
| `@langchain/anthropic` | ^1.3.25 | Claude chat model (`ChatAnthropic`) |
| `@langchain/openai` | latest | OpenAI embeddings (`OpenAIEmbeddings`) |
| `@langchain/community` | ^1.1.25 | `TavilySearchResults`, `MemoryVectorStore` |
| `@langchain/core` | ^1.1.36 | Shared types, `tool()`, `Document` |
| `langchain` | ^1.0.0 | Re-exports including `createReactAgent` |
| `mathjs` | latest | Safe sandboxed math evaluation |
| `express` | latest | HTTP server |
| `dotenv` | latest | `.env` file loading |
| `zod` | ^3.x or ^4 | Tool input schema validation |
| `typescript` | ~5.x | Language |
| `tsx` | latest | Run TypeScript directly in dev (no build step) |
| `@types/express` | latest | TypeScript types for Express |
| `@types/node` | latest | TypeScript types for Node.js |

---

## Key Technical Decisions

### Agent framework: createReactAgent
`createReactAgent` from `@langchain/langgraph/prebuilt` (or re-exported via `langchain`) wraps the full StateGraph loop in a simpler API. If the import fails from one location, try the other — both are valid depending on installed versions.

### Chat model: Claude via @langchain/anthropic
`ChatAnthropic` reads `ANTHROPIC_API_KEY` from env automatically. Use `claude-haiku-4-5` during development (cheapest), `claude-sonnet-4-6` for demos. Both are confirmed valid API aliases (no date suffix required for 4.x models).

### Embeddings: OpenAI text-embedding-3-small
Anthropic has no embeddings model. `text-embedding-3-small` — 1536 dims, 8192 token max, ~62k pages per dollar — is called once at server startup when documents are loaded. Zero cost per subsequent query.

### Vector store: MemoryVectorStore initialized via initVectorStore()
`vectorStore.ts` exports an `initVectorStore()` async function. `server.ts` calls and awaits it during startup before starting the HTTP server. The returned store instance is passed to or imported by `ragTool.ts`. Documents are lost on restart (ChromaDB stretch goal adds persistence).

### Calculator: mathjs.evaluate() not eval()
`eval()` executes arbitrary JavaScript — a security risk under prompt injection. `mathjs.evaluate()` is a sandboxed math parser that only does math.

### Memory: module-level array in memory.ts
`messageHistory[]` lives in `memory.ts` as a module-level array. The `chat()` function appends to it, invokes the agent with the full history, extracts the response, appends the reply, and returns the reply string. History resets on server restart. One session per process — sufficient for a single local user.

### Claude response content handling
Claude's response `.content` field can be a `string` or an array of content blocks. `memory.ts` must handle both: if string, use directly; if array, find the first block with `type === "text"` and use its `.text` property.

### Frontend: vanilla HTML/JS
No frontend framework. One `index.html` file in `public/`. Express serves it statically. Required behaviors: capture input, disable UI while waiting, POST to `/chat`, append reply, re-enable UI, auto-scroll.

### Web search: TavilySearchResults (no custom wrapper)
`TavilySearchResults` already implements the LangChain tool interface. It is instantiated and exported directly — no `tool()` wrapper needed.

---

## API Endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health` | Liveness check — returns `{ status: "ok" }` |
| `GET` | `/` | Serves `public/index.html` |
| `POST` | `/chat` | Chat endpoint — `{ message }` → `{ reply }` |
| `POST` | `/chat/stream` | *(Stretch)* SSE streaming variant |

### POST /chat contract
- **Request body:** `{ "message": "string" }`
- **200 OK:** `{ "reply": "string" }`
- **400 Bad Request:** `{ "error": "message is required" }`
- **500 Internal Server Error:** `{ "error": "Internal server error" }`

---

## Data Flow: Each Tool

### Calculator
```
User: "What is 85000 * 0.72?"
  → agent calls calculator({ expression: "85000 * 0.72" })
  → mathjs.evaluate("85000 * 0.72") → 61200
  → logToolCall("calculator", { expression: "85000 * 0.72" }, "61200")
  → tool returns "61200"
  → Claude: "85,000 × 72% = $61,200 take-home"
```

### Web Search
```
User: "What are current software engineer salaries?"
  → agent calls web_search({ query: "software engineer salary 2026" })
  → TavilySearchResults → POST https://api.tavily.com/search (basic depth, 3 results)
  → logToolCall("web_search", { query: "..." }, "[truncated]")
  → tool returns formatted results string with titles, URLs, snippets
  → Claude synthesizes answer with sources
```

### RAG Knowledge Base
```
User: "How should I structure my resume?"
  → agent calls knowledge_base({ query: "resume structure and formatting" })
  → OpenAI embeds query → 1536-dim vector
  → MemoryVectorStore.similaritySearch(query, 3)
  → returns top 3 Document objects
  → logToolCall("knowledge_base", { query: "..." }, "[1] (Source: resume-wr...")
  → tool formats: "[1] (Source: resume-writing.txt)\n<content>\n\n[2]..."
  → Claude answers citing source filenames — required for grading
```

### Multi-tool chain (agent decides automatically)
```
User: "The job posting says $120k. How much is that per month after 30% tax?"
  → agent calls calculator({ expression: "120000 * 0.7 / 12" }) → "7000"
  → Claude: "That's approximately $7,000/month take-home after 30% tax"
```

---

## Environment Variables

All stored in `.env` at project root. Never committed to git. Loaded by `import "dotenv/config"` as the first line of `server.ts`.

```env
ANTHROPIC_API_KEY=sk-ant-...    # Claude chat model
OPENAI_API_KEY=sk-...           # Embeddings only (not for chat)
TAVILY_API_KEY=tvly-...         # Web search
```

`.env.example` (committed, safe to share) contains the same keys with placeholder values.

---

## Startup Sequence

```
1. import "dotenv/config"            ← first line of server.ts, before all other imports
2. Import all modules
3. await initVectorStore()           ← loads docs/, calls OpenAI embeddings API
4. Build ragTool with vectorStore    ← or ragTool imports vectorStore lazily
5. Create agent (agent.ts)           ← createReactAgent with all 3 tools + Claude
6. app.listen(3000, callback)        ← only after vector store is fully ready
7. Log: "Server running at http://localhost:3000"
```

Steps 3–4 happen once at startup and cost fractions of a cent for 5–10 documents. The server does not accept connections until the vector store is initialized.

---

## Logging Format

Every tool call logged to console inside the tool function, after result is computed, before returning:

```
[2026-03-25T16:00:00.000Z] TOOL_CALL  calculator      | args: {"expression":"85000*0.72"} | result: "61200"
[2026-03-25T16:00:02.000Z] TOOL_CALL  web_search      | args: {"query":"SE salary 2026"}  | result: "[Glassdoor: Software..."
[2026-03-25T16:00:04.000Z] TOOL_CALL  knowledge_base  | args: {"query":"resume tips"}     | result: "[1] (Source: resume-wr..."
```

**Implementation:** `src/logger.ts` exports a single `logToolCall(name: string, args: object, result: string)` function. Result is truncated to ~80 characters in the log only — the full result still goes to the agent.

---

## Stretch Goal Additions

### Streaming (Phase 8A)
- Add `POST /chat/stream` route to `server.ts`
- Set SSE response headers: `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`
- Call `agent.stream({ messages: messageHistory }, { streamMode: "values" })` instead of `agent.invoke()`
- For each chunk: extract last message content, write `data: <JSON>\n\n` to response
- Send `data: [DONE]\n\n` when complete
- Frontend uses `EventSource` to consume the stream and append tokens as they arrive

### File Reader — 4th Tool (Phase 8B)
- New tool `file_reader` in `src/tools/fileReader.ts`
- Reads files from `uploads/` using Node.js `fs.promises.readFile`
- Input: `filename` string; Output: file text contents string
- **Path traversal protection:** resolve the path and confirm it starts with the absolute `uploads/` path before reading — return an error string if not
- On any error: return error message string, never throw
- Added to the tools array in `agent.ts`

### ChromaDB — Persistent Vector Store (Phase 8C)
- Install `chromadb` package
- Replace `MemoryVectorStore.fromDocuments()` in `vectorStore.ts` with `Chroma.fromDocuments()` from `@langchain/community/vectorstores/chroma`
- Collection name: `"career-compass-docs"`, URL: `"http://localhost:8000"`
- Requires ChromaDB running locally before server starts: `docker run -p 8000:8000 chromadb/chroma`
- `ragTool.ts` unchanged — `similaritySearch()` API is identical
- Documents persist across server restarts; re-embedding only happens on first run
