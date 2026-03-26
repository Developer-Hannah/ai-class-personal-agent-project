import { readdir, readFile } from "fs/promises";
import { join, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import type { Document } from "@langchain/core/documents";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function initVectorStore(): Promise<MemoryVectorStore> {
  const docsDir = join(__dirname, "../docs");
  const files = (await readdir(docsDir)).filter((f) => f.endsWith(".txt"));

  const docs: Document[] = await Promise.all(
    files.map(async (filename) => {
      const content = await readFile(join(docsDir, filename), "utf-8");
      return {
        pageContent: content,
        metadata: { source: basename(filename) },
      };
    })
  );

  const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });
  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

  console.log(`Vector store initialized with ${docs.length} documents.`);
  return vectorStore;
}
