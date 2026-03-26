# OpenAI Embeddings + MemoryVectorStore Reference Guide

**Sources:**
- https://platform.openai.com/docs/guides/embeddings
- https://www.npmjs.com/package/@langchain/community (v1.1.25, Mar 2026)

---

## Package Install

```bash
npm install @langchain/openai @langchain/community @langchain/core
```

---

## Environment Variable

```bash
OPENAI_API_KEY=sk-...
```

---

## OpenAI Embedding Models

| Model | Dimensions | Max Input Tokens | ~ Pages per dollar | MTEB Score |
|---|---|---|---|---|
| `text-embedding-3-small` | 1536 | 8192 | 62,500 | 62.3% |
| `text-embedding-3-large` | 3072 | 8192 | 9,615 | 64.6% |
| `text-embedding-ada-002` | 1536 | 8192 | 12,500 | 61.0% |

**For this project:** Use `text-embedding-3-small` — cheapest, fast, more than sufficient for 5-10 career docs.

---

## OpenAIEmbeddings (@langchain/openai)

```ts
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: process.env.OPENAI_API_KEY,  // optional if env var set
});

// Embed a single query (for search)
const queryVector = await embeddings.embedQuery("How do I write a resume?");
// → array of 1536 numbers

// Embed multiple documents (for indexing)
const docVectors = await embeddings.embedDocuments([
  "Resume writing tips...",
  "Interview preparation guide...",
]);
// → array of arrays
```

---

## MemoryVectorStore

In-memory only — data is lost on server restart. Perfect for this project's MVP scope.

```ts
import { MemoryVectorStore } from "langchain/vectorstores/memory";
// Alternative import path:
// import { MemoryVectorStore } from "@langchain/community/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

// Create store and add documents at startup
const vectorStore = await MemoryVectorStore.fromDocuments(
  [
    {
      pageContent: "A strong resume should have clear sections...",
      metadata: { source: "resume-guide.txt" },
    },
    {
      pageContent: "Common interview questions include...",
      metadata: { source: "interview-prep.txt" },
    },
    // ... add all 5+ docs here
  ],
  embeddings
);
```

### Alternatively: add documents after creation

```ts
const vectorStore = new MemoryVectorStore(embeddings);

await vectorStore.addDocuments([
  { pageContent: "...", metadata: { source: "filename.txt" } },
]);
```

---

## Similarity Search (the RAG query)

```ts
// Returns top-k most relevant documents
const results = await vectorStore.similaritySearch("How to negotiate salary?", 3);

// results is Document[]
results.forEach((doc, i) => {
  console.log(`[${i + 1}] Source: ${doc.metadata.source}`);
  console.log(doc.pageContent);
});
```

### With score (for debugging)

```ts
const resultsWithScore = await vectorStore.similaritySearchWithScore("query", 3);
// Returns [Document, number][] — number is cosine similarity score (0–1)
```

---

## Full RAG Tool Pattern

```ts
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// vectorStore is already initialized at app startup

const knowledgeBaseTool = tool(
  async ({ query }) => {
    const results = await vectorStore.similaritySearch(query, 3);

    if (results.length === 0) {
      return "No relevant documents found in the knowledge base.";
    }

    return results
      .map((doc, i) =>
        `[${i + 1}] (Source: ${doc.metadata.source})\n${doc.pageContent}`
      )
      .join("\n\n");
  },
  {
    name: "knowledge_base",
    description:
      "Search the career guidance knowledge base using semantic search. " +
      "Use this to find information about resume writing, interview preparation, " +
      "salary negotiation, job search strategies, LinkedIn optimization, and networking. " +
      "Always cite the source document in your response.",
    schema: z.object({
      query: z.string().describe("Natural language question about career topics"),
    }),
  }
);
```

---

## Loading Documents from a Directory (Optional)

```ts
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";

const loader = new DirectoryLoader("./docs", {
  ".txt": (path) => new TextLoader(path),
  ".md": (path) => new TextLoader(path),
});

const docs = await loader.load();
// docs[i].metadata.source will be the file path

await vectorStore.addDocuments(docs);
```

---

## Document Format for addDocuments

```ts
interface Document {
  pageContent: string;    // the text content
  metadata: {
    source: string;       // filename or URL — required for source attribution
    [key: string]: any;   // any additional metadata
  };
}
```

---

## Constraints

- `text-embedding-3-small` max input: **8192 tokens** per document (~6000 words). Split large docs if needed.
- The entire vector store lives in Node.js process memory. Fine for 5-50 docs; would be slow/large with thousands.
- Documents are embedded once at startup — changing docs requires server restart.
- OpenAI embeddings are normalized to length 1, so cosine similarity = dot product similarity.

---

## Unverified

- Exact import path for `MemoryVectorStore` — both `langchain/vectorstores/memory` and `@langchain/community/vectorstores/memory` appear in different docs. **Test both after install; one will resolve correctly.**
- Whether `DirectoryLoader` requires a separate package install beyond `langchain` — likely yes for some loaders
