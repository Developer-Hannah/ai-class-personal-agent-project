import { readdir, readFile } from "fs/promises";
import { join, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import type { VectorStore } from "@langchain/core/vectorstores";
import type { Document } from "@langchain/core/documents";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COLLECTION_NAME = "career-compass-docs";
const CHROMA_URL = "http://localhost:8000";

async function loadDocs(): Promise<Document[]> {
  const docsDir = join(__dirname, "../docs");
  const files = (await readdir(docsDir)).filter((f) => f.endsWith(".txt"));
  return Promise.all(
    files.map(async (filename) => ({
      pageContent: await readFile(join(docsDir, filename), "utf-8"),
      metadata: { source: basename(filename) },
    }))
  );
}

export async function initVectorStore(): Promise<VectorStore> {
  const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

  // Load existing collection to avoid re-embedding on every restart
  try {
    const existing = await Chroma.fromExistingCollection(embeddings, {
      collectionName: COLLECTION_NAME,
      url: CHROMA_URL,
    });
    const count = await existing.collection?.count();
    if (count && count > 0) {
      console.log(`Vector store loaded from ChromaDB (${count} documents).`);
      return existing;
    }
  } catch {
    // Collection does not exist yet — create it below
  }

  const docs = await loadDocs();
  const vectorStore = await Chroma.fromDocuments(docs, embeddings, {
    collectionName: COLLECTION_NAME,
    url: CHROMA_URL,
  });

  console.log(
    `Vector store created in ChromaDB with ${docs.length} documents.`
  );
  return vectorStore;
}
