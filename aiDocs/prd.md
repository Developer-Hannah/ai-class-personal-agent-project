# Product Requirements Document
## Career Compass — Multi-Tool AI Career Agent

**Version:** 1.0  
**Date:** March 25, 2026  
**Author:** Student Project — AI Class Unit 8

---

## 1. Overview

Career Compass is a locally-hosted conversational AI agent that helps users navigate job searching, resume writing, interview preparation, and career development. It combines real-time web search, a curated career knowledge base, and math calculation into a single chat interface — demonstrating the LangChain.js ReAct pattern with multi-tool reasoning and conversation memory.

---

## 2. Problem Statement

Job seekers often need three different kinds of help in a single conversation:

1. **Up-to-date information** — current job market trends, salary ranges, company news (requires live web search)
2. **Trusted guidance** — proven frameworks for resumes, interviews, and salary negotiation (requires a curated knowledge base)
3. **Quick calculations** — comparing offer packages, computing take-home pay, estimating commute costs (requires a calculator)

No single tool does all three well. Career Compass brings them together in one agent that reasons across all three to give complete, contextual answers.

---

## 3. Goals

- Demonstrate the ReAct (Reason + Act) agent pattern using LangChain.js
- Show multi-tool chaining: the agent should autonomously decide which tool(s) to call and in what order
- Provide a working web UI accessible from a local browser
- Maintain conversation context across multiple turns
- Meet all graded deliverable requirements for the AI class project

---

## 4. Non-Goals

- No cloud deployment — the app runs locally only
- No persistent vector store by default — documents are loaded into memory at startup (ChromaDB persistence is a stretch goal)
- No user authentication or multi-user support
- No mobile-optimized UI
- No real job board integrations or application tracking

---

## 5. Users

**Primary user:** The student/developer running the app locally, using it to demo the agent pattern and explore career-related questions.

**Graders:** Instructors evaluating the repo quality, tool implementation, and agent behavior.

---

## 6. Tools

### 6.1 Calculator
- **Purpose:** Evaluate math expressions — comparing salary offers, calculating take-home pay after tax estimates, cost-of-living adjustments, etc.
- **Implementation:** `mathjs` library (safe, sandboxed evaluation — never `eval`)
- **Input:** A math expression string
- **Output:** The computed result as a string

### 6.2 Web Search
- **Purpose:** Retrieve current information — job market trends, average salaries for specific roles, company news, current job postings context
- **Implementation:** Tavily Search API via `@langchain/community`
- **Input:** A natural language search query
- **Output:** Summarized search results with source URLs

### 6.3 RAG Knowledge Base
- **Purpose:** Answer questions using a curated set of career guidance documents — resume writing, interview prep, salary negotiation, LinkedIn optimization, networking, cover letters
- **Implementation:** OpenAI `text-embedding-3-small` embeddings + LangChain `MemoryVectorStore`
- **Input:** A natural language query
- **Output:** Relevant document excerpts with source attribution (document filename/title included in every response)
- **Documents:** 5+ real career guidance documents loaded at startup

---

## 7. Conversation Memory

- Message history is maintained in a server-side array for the duration of the session
- The full history is passed to the agent on every invocation
- Follow-up questions that reference earlier context work correctly (e.g., "What's that per year?" after discussing a monthly salary)
- History is reset on server restart (in-memory, no persistence)

---

## 8. Web UI

- Single-page chat interface served by Express.js
- Input field + send button + scrollable message history
- Displays user messages and agent responses
- Minimal styling — functional over decorative
- No frameworks (vanilla HTML/CSS/JS)
- Accessible at `http://localhost:3000`

---

## 9. Logging

Every tool call is logged to the console with:
- Tool name
- Arguments passed
- Result returned
- Timestamp

Format example:
```
[2026-03-25T16:00:00Z] TOOL_CALL: calculator | args: {"expression":"85000*0.72"} | result: "61200"
```

---

## 10. Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (LTS) |
| Language | TypeScript |
| Agent framework | LangChain.js (`langchain`, `@langchain/langgraph`) |
| Chat model | Anthropic Claude (`@langchain/anthropic`) |
| Embeddings | OpenAI `text-embedding-3-small` (`@langchain/openai`) |
| Vector store | `MemoryVectorStore` (in-memory, no database) |
| Web search | Tavily API (`@langchain/community`) |
| Math | `mathjs` |
| Server | Express.js |
| Frontend | Vanilla HTML / CSS / JS |

---

## 11. API Keys Required

| Service | Purpose | Environment Variable |
|---|---|---|
| Anthropic | Claude chat model | `ANTHROPIC_API_KEY` |
| OpenAI | Embeddings only | `OPENAI_API_KEY` |
| Tavily | Web search | `TAVILY_API_KEY` |

Keys are stored in a `.env` file, never committed to git.

---

## 12. Repo Structure (Target)

```
career-agent/
├── src/
│   ├── agent.ts          # ReAct agent setup + tool wiring
│   ├── tools/
│   │   ├── calculator.ts
│   │   ├── webSearch.ts
│   │   └── ragTool.ts
│   ├── vectorStore.ts    # Document loading + MemoryVectorStore setup
│   ├── memory.ts         # Conversation history management
│   └── server.ts         # Express server + chat endpoint
├── public/
│   └── index.html        # Chat UI
├── docs/                 # Career guidance documents (RAG source files)
├── aiDocs/
│   ├── prd.md            # This document
│   ├── roadmap.md
│   └── context.md
├── .env                  # API keys (gitignored)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 13. Stretch Goals

These are optional extras for extra credit. Core deliverables take priority.

### 13.1 Streaming
- Stream agent responses token-by-token to the web UI using **Server-Sent Events (SSE)**
- Dramatically improves perceived responsiveness — user sees the answer forming in real time rather than waiting for the full response
- Implementation: Express SSE endpoint + LangChain `.stream()` method + frontend `EventSource` listener

### 13.2 4th Tool — File Reader
- **Purpose:** Read local text files dropped into an `uploads/` folder — job descriptions, resume drafts, offer letters — and make their contents available to the agent for analysis
- **Why file reader:** Fits the career theme naturally ("analyze this job description," "review my resume"), requires no external API key, and adds meaningful utility with minimal complexity
- **Implementation:** Node.js `fs.readFile` wrapped in a LangChain tool; agent receives file contents as a string and can reason over them
- **Input:** A filename (e.g., `"job-description.txt"`)
- **Output:** The full text content of that file

### 13.3 Persistent Vector Store — ChromaDB
- Replace `MemoryVectorStore` with **ChromaDB** so the document embeddings survive server restarts
- **Why ChromaDB:** Free, runs entirely locally as a separate process, no additional API key required, and LangChain has a direct integration via `@langchain/community`
- **Tradeoff:** Requires running a ChromaDB server locally (`docker run chromadb/chroma` or the Python package) alongside the Node.js app
- **Implementation:** Swap `MemoryVectorStore` for `Chroma` from `@langchain/community/vectorstores/chroma`; documents are embedded once and persisted to disk

---

## 14. Success Criteria

- [ ] All three tools callable and returning correct results
- [ ] Agent correctly chains tools (e.g., RAG for facts + calculator for math in one response)
- [ ] Follow-up questions work using conversation memory
- [ ] Web UI renders and accepts user input
- [ ] Source attribution present in RAG responses
- [ ] Structured logging visible in console for every tool call
- [ ] 5+ meaningful git commits showing development progression
- [ ] README explains the project and how to run it
- [ ] No API keys committed to git

### Stretch Goal Criteria (optional)
- [ ] Streaming: agent responses appear token-by-token in the UI
- [ ] File reader tool: agent can read and reason over a local text file
- [ ] ChromaDB: documents persist across server restarts
