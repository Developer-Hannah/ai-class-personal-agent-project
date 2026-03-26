# Phase 8 Plan — Stretch Goals
**Date:** March 25, 2026
**Roadmap:** [2026-03-25-phase-8-stretch-roadmap.md](./2026-03-25-phase-8-stretch-roadmap.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)
**Prerequisite:** Phase 7 complete and committed. Project fully submittable.

> **No over-engineering.** Each stretch goal is additive and independent. Implement them in order: Streaming first (highest UX impact), then File Reader, then ChromaDB. Do not start the next one until the previous is committed and working.

---

## Goal
Extra credit features that enhance the project without modifying its core behavior. Each adds one commit to the history.

## Guides
- [mathjs + Express](../guides/mathjs-express.md) — SSE streaming endpoint pattern
- [LangChain + LangGraph](../guides/langchain-langgraph.md) — `agent.stream()` pattern
- [ChromaDB](../guides/chromadb_context7.md) — persistent vector store

---

## Stretch Goal A — Streaming

**What changes:**
- `src/server.ts`: add `POST /chat/stream` route
- `public/index.html`: add `EventSource`-based listener for streaming

**How it works:**
1. The stream endpoint sets response headers for SSE (`Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`)
2. Reads `message` from the request body
3. Calls `agent.stream({ messages: messageHistory })` using `streamMode: "values"`
4. For each chunk: extract the last message's content and write `data: <JSON>\n\n` to the response
5. When done, write `data: [DONE]\n\n` and close the response

**Frontend change:**
Add a toggle or second code path in `index.html` that uses `EventSource` (or `fetch` with `ReadableStream`) to the `/chat/stream` endpoint instead of `/chat`. Append tokens to the current message bubble as they arrive.

**Commit:** `feat(stretch): streaming responses via SSE`

---

## Stretch Goal B — File Reader Tool

**What changes:**
- Add `src/tools/fileReader.ts`
- Add the tool to the agent in `src/agent.ts`
- Create `uploads/` directory (already exists from Phase 0)

**How it works:**
1. Tool accepts a `filename` string
2. Reads the file from `uploads/<filename>` using Node.js `fs.promises.readFile`
3. Returns the file contents as a string
4. On error (file not found, permission error): returns the error message — never throws

**Security note:** Restrict the path to the `uploads/` directory only. Do not allow `../` traversal. Simple check: if the resolved path does not start with the `uploads/` absolute path, return an error string.

**Tool metadata:**
- `name`: `"file_reader"`
- `description`: Specific — reads a text file from the uploads folder. Tell the agent it can use this to analyze job descriptions, resume drafts, or offer letters that the user has placed in the uploads folder.

**Commit:** `feat(stretch): file reader tool`

---

## Stretch Goal C — ChromaDB Persistent Vector Store

**What changes:**
- Install `chromadb` package
- Modify `src/vectorStore.ts` to use `Chroma` instead of `MemoryVectorStore`
- Run ChromaDB locally before starting the server

**Setup required:**
ChromaDB must be running before the Node.js server starts:
```
docker run -p 8000:8000 chromadb/chroma
```
or via the Python package. Document this in the README.

**Code change in `src/vectorStore.ts`:**
- Replace `MemoryVectorStore.fromDocuments()` with `Chroma.fromDocuments()` from `@langchain/community/vectorstores/chroma`
- Use collection name `"career-compass-docs"` and URL `"http://localhost:8000"`
- No changes needed in `ragTool.ts` — the `similaritySearch` API is identical

**Verification:**
- Start server, add documents, stop server
- Restart server — documents should still be searchable without re-embedding
- Confirm with a query after restart

**Commit:** `feat(stretch): ChromaDB persistent vector store`

---

## README Update After Stretch Goals

Update `README.md` to document:
- Streaming: it happens automatically in the UI
- File reader: place `.txt` files in `uploads/`, then ask the agent to read them
- ChromaDB: prerequisites, Docker command, startup order
