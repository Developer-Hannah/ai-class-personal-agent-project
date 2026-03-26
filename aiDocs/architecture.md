# Architecture — Career Compass

**Last updated:** March 25, 2026  
**Reference docs:** [PRD](./prd.md) · [MVP](./mvp.md) · [Library guides](../ai/guides/)

---

## System Overview

Career Compass is a locally-hosted, single-user chatbot. A browser sends messages to an Express server, which passes them to a LangGraph ReAct agent. The agent reasons over the message and decides which tool(s) to call, then returns a final response.

```
Browser (index.html)
    │  POST /chat { message }
    ▼
Express Server (server.ts)
    │  appends to messageHistory[]
    │  calls agent.invoke({ messages: history })
    ▼
LangGraph ReAct Agent (agent.ts)
    │  loops: LLM → decide → tool → LLM → ...
    ▼
Claude (chat model) ──── decides which tool to call
    │
    ├── calculatorTool  →  mathjs.evaluate()
    ├── webSearchTool   →  Tavily API  →  internet
    └── knowledgeBaseTool → MemoryVectorStore
                              └── OpenAI embeddings
                                  └── docs/ folder (5+ .txt files)
```

---

## Request / Response Flow

1. User types a message and submits in `index.html`
2. Frontend sends `POST /chat` with `{ message: string }`
3. `server.ts` pushes the message onto `messageHistory[]`
4. `server.ts` calls `agent.invoke({ messages: messageHistory })`
5. Agent enters ReAct loop:
   - Claude receives the full message history + tool descriptions
   - Claude decides whether to call a tool or respond directly
   - If tool call: execute tool, append result to messages, loop back to Claude
   - If final response: exit loop
6. `server.ts` extracts the last message from `result.messages`
7. Appends Claude's response to `messageHistory[]`
8. Returns `{ reply: string }` to the browser
9. Frontend appends the reply to the chat display

---

## Component Map

```
src/
├── server.ts          Entry point. Express app, /chat route, message history, startup
├── agent.ts           createReactAgent wiring — model + all tools assembled here
├── tools/
│   ├── calculator.ts  mathjs.evaluate() wrapped as a LangChain tool
│   ├── webSearch.ts   TavilySearchResults instance with config
│   └── ragTool.ts     similaritySearch() over vectorStore, formats output with sources
├── vectorStore.ts     Initializes MemoryVectorStore — loads docs, embeds at startup
└── memory.ts          messageHistory array + chat() helper function

public/
└── index.html         Single-page chat UI — input, send, message list (vanilla JS)

docs/
└── *.txt              Career guidance source documents for RAG (5+ files)

aiDocs/               Project documentation (tracked)
ai/                   Local workspace (gitignored)
```

---

## Package List

| Package | Version | Purpose |
|---|---|---|
| `@langchain/langgraph` | ^1.2.5 | ReAct agent orchestration (`createReactAgent`) |
| `@langchain/anthropic` | ^1.3.25 | Claude chat model (`ChatAnthropic`) |
| `@langchain/openai` | latest | OpenAI embeddings (`OpenAIEmbeddings`) |
| `@langchain/community` | ^1.1.25 | Tavily search tool + `MemoryVectorStore` |
| `@langchain/core` | ^1.1.36 | Shared types, `tool()`, `Document` |
| `langchain` | ^1.0.0 | Re-exports including `createReactAgent` |
| `mathjs` | latest | Safe math expression evaluation |
| `express` | latest | HTTP server |
| `dotenv` | latest | `.env` loading |
| `zod` | ^3.x | Tool schema validation |
| `typescript` | ~5.x | Language |
| `tsx` | latest | Run TS directly in dev (no build step needed) |
| `@types/express` | latest | TypeScript types for Express |
| `@types/node` | latest | TypeScript types for Node |

---

## Key Technical Decisions

### Agent framework: createReactAgent (not raw StateGraph)
`createReactAgent` from `@langchain/langgraph/prebuilt` (or re-exported from `langchain`) wraps the full StateGraph pattern in a simpler API. It's what the course slides use and what current LangGraph docs recommend for straightforward multi-tool agents. The raw `StateGraph` approach is available if we need more control later (stretch goal streaming may require it).

### Chat model: Claude via @langchain/anthropic
`ChatAnthropic` is the LangChain wrapper for the Anthropic API. Reads `ANTHROPIC_API_KEY` from env. Use `claude-haiku-4-5` during development (cheapest), `claude-sonnet-4-6` for demos.

### Embeddings: OpenAI text-embedding-3-small
Anthropic offers no embeddings model. `text-embedding-3-small` is the cheapest and fastest option (1536 dims, 8192 token max, ~62k pages per dollar). Only called at server startup when documents are loaded.

### Vector store: MemoryVectorStore
In-memory only — no database, no setup. Documents are embedded once at startup and held in Node.js process memory. Sufficient for 5–50 documents. Lost on server restart (ChromaDB is the stretch goal for persistence).

### Calculator: mathjs.evaluate() not eval()
`eval()` is a security risk — prompt injection could execute arbitrary JS. `mathjs.evaluate()` is a sandboxed math parser; it only does math.

### Memory: server-side array
`messageHistory[]` lives in `server.ts` as a module-level variable. The full array is passed to `agent.invoke()` on every request. Simple and sufficient for a single-user local app. Resets on server restart.

### Frontend: vanilla HTML/JS
No framework. A single `index.html` file in `public/`. Express serves it statically. The only frontend JS needed is: capture input, POST to `/chat`, append response to DOM.

---

## Data Flow: Each Tool

### Calculator
```
User: "What is 85000 * 0.72?"
  → agent decides to call calculator
  → expression: "85000 * 0.72"
  → mathjs.evaluate("85000 * 0.72") → 61200
  → tool returns "61200"
  → Claude: "85,000 × 72% = $61,200 take-home"
```

### Web Search
```
User: "What are current software engineer salaries?"
  → agent decides to call web_search
  → query: "software engineer salary 2026"
  → TavilySearchResults → POST https://api.tavily.com/search
  → returns top 3 results with title, url, content snippet
  → tool returns formatted results string
  → Claude synthesizes answer with sources
```

### RAG Knowledge Base
```
User: "How should I structure my resume?"
  → agent decides to call knowledge_base
  → query: "resume structure and formatting"
  → OpenAI embeds query → 1536-dim vector
  → MemoryVectorStore.similaritySearch(query, 3)
  → returns top 3 Document objects
  → tool formats: "[1] (Source: resume-guide.txt)\n..."
  → Claude answers citing source documents
```

### Multi-tool chain (agent decides automatically)
```
User: "The job posting says $120k. How much is that per month after 30% tax?"
  → knowledge_base("salary negotiation") [optional]
  → calculator("120000 * 0.7 / 12") → 7000
  → Claude: "That's approximately $7,000/month take-home"
```

---

## Environment Variables

All stored in `.env` at project root. Never committed to git.

```env
ANTHROPIC_API_KEY=sk-ant-...       # Claude chat model
OPENAI_API_KEY=sk-...              # Embeddings only (not for chat)
TAVILY_API_KEY=tvly-...            # Web search
```

Loaded via `import "dotenv/config"` at the top of `server.ts`.

---

## Startup Sequence

```
1. Load .env
2. Initialize OpenAIEmbeddings (no API call yet)
3. Load documents from docs/ folder
4. Embed all documents → MemoryVectorStore (calls OpenAI API)
5. Build tool instances (calculator, webSearch, ragTool)
6. Create ReAct agent with model + tools
7. Start Express server on port 3000
8. Log: "Server running at http://localhost:3000"
```

Steps 3–4 happen once at startup. If there are 10 docs averaging 500 words, this is a single quick OpenAI API call and costs fractions of a cent.

---

## Logging Format

Every tool call logged to console:

```
[2026-03-25T16:00:00Z] TOOL_CALL  calculator  | args: {"expression":"85000*0.72"} | result: "61200"
[2026-03-25T16:00:01Z] TOOL_CALL  web_search  | args: {"query":"SE salary 2026"}  | result: "[truncated]"
[2026-03-25T16:00:02Z] TOOL_CALL  knowledge_base | args: {"query":"resume tips"} | result: "[truncated]"
```

Implementation: a wrapper function called before returning from each tool function, or a LangChain callback handler.

---

## Stretch Goal Additions

### Streaming (SSE)
- Add `POST /chat/stream` route alongside `POST /chat`
- Use `agent.stream()` instead of `agent.invoke()`
- Pipe token chunks via Server-Sent Events (`text/event-stream`)
- Frontend uses `EventSource` to listen and render tokens as they arrive

### File Reader (4th tool)
- New tool: `fileReaderTool` in `src/tools/fileReader.ts`
- Reads files from `uploads/` directory using Node.js `fs.readFile`
- Input: filename string; Output: file contents string
- No additional package needed

### ChromaDB (persistent vector store)
- Replace `MemoryVectorStore` in `vectorStore.ts` with `Chroma` from `@langchain/community/vectorstores/chroma`
- Requires running ChromaDB locally: `docker run -p 8000:8000 chromadb/chroma`
- Documents persist across server restarts
- Only embed once; subsequent startups skip embedding if collection exists
