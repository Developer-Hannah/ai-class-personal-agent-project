# Career Compass

A locally-hosted multi-tool chatbot agent that demonstrates the ReAct pattern using LangChain.js and Claude. Answers career and job-search questions using a calculator, live web search, and an in-memory knowledge base.

## Setup

1. Clone the repo and navigate into it
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your API keys:
   ```bash
   cp .env.example .env
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tools

_(Details added in Phase 7 — see [aiDocs/architecture.md](aiDocs/architecture.md) for full tool descriptions)_

- **Calculator** — safe math evaluation via mathjs
- **Web Search** — live search via Tavily
- **Knowledge Base** — RAG over career guidance documents via OpenAI embeddings

## Tech Stack

- LangChain.js + LangGraph (ReAct agent)
- Anthropic Claude (chat model)
- OpenAI `text-embedding-3-small` (embeddings)
- Express.js (server)
- TypeScript + tsx (dev)
