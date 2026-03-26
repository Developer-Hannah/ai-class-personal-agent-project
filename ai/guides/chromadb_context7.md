# ChromaDB + LangChain Reference Guide (Stretch Goal)

**Sources:**
- https://docs.trychroma.com/docs/overview/introduction
- https://www.npmjs.com/package/@langchain/community (v1.1.25 — includes `chromadb: ^3.0.10`)

> **This is a stretch goal only.** Do not implement until Phases 0–7 are complete and committed.

---

## What ChromaDB Adds Over MemoryVectorStore

| | MemoryVectorStore (MVP) | ChromaDB (Stretch) |
|---|---|---|
| Persistence | Lost on restart | Survives restarts |
| Setup | None (pure JS) | Requires running a local server |
| Documents embedded | Every startup | Only once (first run) |
| Package | `@langchain/community` | `@langchain/community` + `chromadb` |

---

## Required Packages

```bash
npm install chromadb
# @langchain/community already installed — it includes the Chroma integration
```

---

## Running ChromaDB Locally

ChromaDB runs as a separate local HTTP server. Two options:

**Option A — Docker (recommended):**
```bash
docker run -p 8000:8000 chromadb/chroma
```

**Option B — Python package:**
```bash
pip install chromadb
chroma run --path ./chroma-data
```

ChromaDB listens at `http://localhost:8000` by default.

---

## LangChain Chroma Integration

Replace the `MemoryVectorStore` section in `src/vectorStore.ts`:

```ts
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

// First run: creates the collection and embeds documents
// Subsequent runs: loads existing collection (no re-embedding)
const vectorStore = await Chroma.fromDocuments(
  docs,           // Document[] — your career guidance files
  embeddings,
  {
    collectionName: "career-compass-docs",
    url: "http://localhost:8000",   // ChromaDB server URL
  }
);

// OR: connect to an existing collection without re-embedding
const vectorStore = new Chroma(embeddings, {
  collectionName: "career-compass-docs",
  url: "http://localhost:8000",
});
```

The similarity search API is **identical** to `MemoryVectorStore`:

```ts
const results = await vectorStore.similaritySearch(query, 3);
```

So `src/tools/ragTool.ts` does not need to change at all — only `src/vectorStore.ts`.

---

## Startup Logic Change

With ChromaDB, check if the collection already exists before re-embedding:

```ts
// Simple approach: always call fromDocuments
// ChromaDB will upsert (update existing or create new)
const vectorStore = await Chroma.fromDocuments(docs, embeddings, {
  collectionName: "career-compass-docs",
  url: "http://localhost:8000",
});
```

ChromaDB uses document IDs to avoid duplicates on subsequent runs — if you're loading the same files, it will update rather than re-embed.

---

## Chroma Collection Name

Use a consistent, descriptive collection name: `"career-compass-docs"`. This is the key that persists data between restarts. Changing it creates a new empty collection.

---

## Constraints

- ChromaDB server must be running **before** the Node.js server starts
- If ChromaDB is unreachable, `Chroma.fromDocuments()` will throw at startup
- Default port is `8000` — make sure nothing else is using it
- ChromaDB stores data in a local directory (configurable via `--path` flag)

---

## Unverified

- Whether `Chroma.fromDocuments()` with the same collection name truly skips re-embedding on subsequent calls or always re-embeds — test this to confirm before claiming persistence benefit
- Exact `chromadb` npm package version compatibility with `@langchain/community` v1.1.25 — the community package lists `chromadb: ^3.0.10` as dev dependency and `chromadb: *` as peer dependency, so any v3.x should work
