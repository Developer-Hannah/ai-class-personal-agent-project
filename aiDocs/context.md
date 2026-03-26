# Project Context — Career Compass

- **PRD:** [aiDocs/prd.md](./prd.md)
- **MVP:** [aiDocs/mvp.md](./mvp.md)
- **Purpose:** Locally-hosted multi-tool AI career agent demonstrating the LangChain.js ReAct pattern (AI class Unit 8 project)

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Server:** Express.js
- **Frontend:** Vanilla HTML / CSS / JS (minimal chat UI)
- **Agent framework:** LangChain.js (`createReactAgent`)
- **Chat model:** Anthropic Claude (`@langchain/anthropic`)
- **Embeddings:** OpenAI `text-embedding-3-small` (`@langchain/openai`)
- **Vector store:** `MemoryVectorStore` (in-memory; ChromaDB is a stretch goal)
- **Web search:** Tavily API (`@langchain/community`)
- **Math:** `mathjs`

## Tools

- **Calculator** — safe math evaluation via `mathjs`
- **Web Search** — live results via Tavily
- **RAG Knowledge Base** — career guidance docs, semantic search, source attribution
- **File Reader** *(stretch)* — reads local text files for agent analysis

## API Keys Needed

- `ANTHROPIC_API_KEY` — Claude chat model
- `OPENAI_API_KEY` — embeddings only
- `TAVILY_API_KEY` — web search

## Current Focus

- Project scaffolding and documentation
- Acquire API keys before any code can run
- Next: roadmap, then project setup commit
