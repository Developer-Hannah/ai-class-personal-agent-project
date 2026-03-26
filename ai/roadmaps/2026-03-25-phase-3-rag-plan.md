# Phase 3 Plan — RAG Tool
**Date:** March 25, 2026
**Roadmap:** [2026-03-25-phase-3-rag-roadmap.md](./2026-03-25-phase-3-rag-roadmap.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)
**Prerequisite:** Phase 2 complete and committed. `OPENAI_API_KEY` obtained.

> **No over-engineering.** Two files: one that loads documents into a vector store, one that wraps similarity search as a LangChain tool. No chunking strategy, no metadata beyond source filename.

---

## Goal
A knowledge base of 5+ career guidance documents, searchable by meaning. The RAG tool returns the top-3 matching excerpts with their source filenames, which the agent cites in its response.

## Guides
- [OpenAI Embeddings + MemoryVectorStore](../guides/openai-embeddings-vectorstore.md)
- [LangChain + LangGraph](../guides/langchain-langgraph.md) — tool() pattern
- [Zod](../guides/zod_context7.md)

---

## Step 1: Source Documents

Place 5+ `.txt` files in the `docs/` folder. Topics that give good coverage:
1. Resume writing tips
2. Job interview preparation
3. Salary negotiation strategies
4. LinkedIn profile optimization
5. Cover letter writing
6. Networking for job seekers *(optional 6th)*

Each file should be substantive — at least 300–500 words. Real content from reputable sources (articles, guides, etc.) is preferred over generated filler.

Filename format: `resume-writing.txt`, `interview-prep.txt`, etc. The filename becomes the source attribution shown to users.

---

## File: `src/vectorStore.ts`

### What it does
1. Reads all `.txt` files from the `docs/` directory using Node.js `fs`
2. Creates a `Document` object for each file with `pageContent` (file text) and `metadata.source` (filename)
3. Initializes `OpenAIEmbeddings` with `text-embedding-3-small`
4. Calls `MemoryVectorStore.fromDocuments(docs, embeddings)` to embed and store all docs
5. Exports the resulting `vectorStore` instance

### Key constraint
`vectorStore.ts` uses `await` at the top level — it must be called from an async context. Export an async init function or use a module-level `await` (if the project uses ESM top-level await). The simplest pattern: export an `initVectorStore()` async function that `server.ts` calls at startup.

### Import path to test
Try `from "langchain/vectorstores/memory"` first. If it fails to resolve, try `from "@langchain/community/vectorstores/memory"`. One will work — mark the unverified note in the guide.

---

## File: `src/tools/ragTool.ts`

### What it does
- Imports `vectorStore` (or the init result) from `vectorStore.ts`
- Implements a `tool()` with:
  - `name`: `"knowledge_base"`
  - `description`: Specific about what the knowledge base contains — career guidance docs covering resume writing, interviews, salary negotiation, LinkedIn, cover letters, networking
  - `schema`: `z.object({ query: z.string().describe("...") })`
- Calls `vectorStore.similaritySearch(query, 3)` inside the tool function
- Formats output as numbered list with source attribution: `[1] (Source: resume-writing.txt)\n<content>`
- Returns `"No relevant documents found."` if results array is empty

### Source attribution requirement
This is a graded requirement. Every RAG response must include the source filename. Format each result as:
```
[1] (Source: resume-writing.txt)
<content of the document excerpt>
```

---

## Wiring: `src/server.ts`

In Phase 3, call `initVectorStore()` during server startup (before `app.listen`). Log a message when embedding is complete. The `/health` endpoint should still work — no other changes to `server.ts` yet.

---

## Verify Before Committing

- Server starts and logs "Vector store initialized" (or similar)
- Temporarily call `vectorStore.similaritySearch("resume tips", 3)` in startup code
- Confirm 3 results returned, each with `metadata.source` set to the correct filename
- Remove the test call before committing

---

## Commit
```
feat: RAG knowledge base tool
```
