# Career Compass

A locally-hosted multi-tool AI chatbot that answers career and job-search questions using the [ReAct](https://arxiv.org/abs/2210.03629) reasoning pattern. Built with LangChain.js, LangGraph, and Anthropic Claude as an AI class project.

## Tools

| Tool | When it's used |
|---|---|
| **Calculator** | Any arithmetic — salary math, monthly budgeting, tax estimates, percentages |
| **Web Search** | Current salary data, job market trends, recent news via Tavily |
| **Knowledge Base** | Career guidance from 6 curated documents via semantic RAG search |

The agent chains tools automatically — a single message can trigger a web search _and_ a calculator call without any extra instruction.

## Prerequisites

- **Node.js** v18 LTS or higher (`node --version`)
- **API keys** for three services:
  - [Anthropic](https://console.anthropic.com/) — `ANTHROPIC_API_KEY`
  - [OpenAI](https://platform.openai.com/api-keys) — `OPENAI_API_KEY` (embeddings only)
  - [Tavily](https://app.tavily.com/) — `TAVILY_API_KEY`

## Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd "AI Class Personal Agent Project"
npm install

# 2. Add API keys
cp .env.example .env
# Open .env and fill in your three API keys

# 3. Start
npm run dev
```

## Usage

Open [http://localhost:3000](http://localhost:3000) in your browser and start chatting.

Every tool call is logged to the terminal in structured format:
```
[2026-03-25T16:00:00.000Z] TOOL_CALL  calculator      | args: {"expression":"85000*0.72"} | result: "61200"
[2026-03-25T16:00:02.000Z] TOOL_CALL  web_search      | args: {"query":"SE salary 2026"}  | result: "[Glassdoor: Software..."
[2026-03-25T16:00:04.000Z] TOOL_CALL  knowledge_base  | args: {"query":"resume tips"}     | result: "[1] (Source: resume-wr..."
```

## Example Prompts

**Calculator** — "My job offer is $95,000. What is that per month after 28% tax?"

**Web Search** — "What are current software engineer salaries in Seattle?"

**Knowledge Base** — "How should I structure my resume for a tech role?"

**Multi-tool chain** — "The job listing says $120k. Search what the market rate is, then calculate how much that is per month after 30% tax."

## Tech Stack

| Layer | Technology |
|---|---|
| Agent framework | LangChain.js + LangGraph (`createReactAgent`) |
| Chat model | Anthropic Claude (`claude-haiku-4-5` dev / `claude-sonnet-4-6` demo) |
| Embeddings | OpenAI `text-embedding-3-small` |
| Vector store | `MemoryVectorStore` (in-memory, resets on restart) |
| Web search | Tavily Search API |
| Math | mathjs `evaluate()` (sandboxed — not `eval()`) |
| Server | Express.js |
| Language | TypeScript + tsx |

## Project Structure

```
src/
├── server.ts        Express app, /chat and /health routes
├── agent.ts         ReAct agent wiring (Claude + all tools)
├── memory.ts        Conversation history and chat() helper
├── vectorStore.ts   Document loading and embedding at startup
├── logger.ts        Structured tool-call logging
└── tools/
    ├── calculator.ts   mathjs-powered math tool
    ├── webSearch.ts    Tavily web search tool
    └── ragTool.ts      Semantic search over docs/

public/
└── index.html       Single-page chat UI (vanilla JS)

docs/
└── *.txt            Career guidance source documents for RAG
```
