# Phase 3 Roadmap — RAG Tool
**Date:** March 25, 2026
**Plan:** [2026-03-25-phase-3-rag-plan.md](./2026-03-25-phase-3-rag-plan.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)

> **No over-engineering.** No chunking, no complex metadata. Load files, embed, search, return with source.

---

## Checklist

### Prerequisites
- [ ] Phase 2 complete and committed
- [ ] `OPENAI_API_KEY` obtained and added to `.env`
- [ ] 5+ `.txt` career guidance documents sourced and placed in `docs/`

### Documents (minimum 5)
- [ ] `docs/resume-writing.txt`
- [ ] `docs/interview-prep.txt`
- [ ] `docs/salary-negotiation.txt`
- [ ] `docs/linkedin-optimization.txt`
- [ ] `docs/cover-letter.txt`
- [ ] `docs/networking.txt` *(optional 6th)*

### `src/vectorStore.ts`
- [ ] File created
- [ ] Reads all `.txt` files from `docs/` using `fs`
- [ ] Creates `Document[]` with `pageContent` and `metadata.source` (filename)
- [ ] `OpenAIEmbeddings` initialized with `text-embedding-3-small`
- [ ] `MemoryVectorStore.fromDocuments()` called
- [ ] Exports `initVectorStore()` async function
- [ ] Correct import path for `MemoryVectorStore` verified at runtime

### `src/tools/ragTool.ts`
- [ ] File created
- [ ] Tool name: `"knowledge_base"`
- [ ] Description lists the specific career topics covered
- [ ] `similaritySearch(query, 3)` called
- [ ] Results formatted with numbered list and `(Source: filename.txt)`
- [ ] Empty result case handled: returns `"No relevant documents found."`

### `src/server.ts`
- [ ] `initVectorStore()` called at startup before `app.listen`
- [ ] Startup log confirms vector store is ready

### Verification
- [ ] Server starts and logs vector store ready message
- [ ] `similaritySearch("resume tips", 3)` returns 3 results with correct `metadata.source`
- [ ] Source filenames appear in formatted output

### Commit
- [ ] **Committed:** `feat: RAG knowledge base tool`

---

## Status: `pending`
