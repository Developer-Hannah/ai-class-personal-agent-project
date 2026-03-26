import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { VectorStore } from "@langchain/core/vectorstores";
import { logToolCall } from "../logger.js";

export function createRagTool(vectorStore: VectorStore) {
  function readMeta(pageContent: string, key: string): string | null {
    const prefix = `${key}:`;
    const line = pageContent
      .split("\n")
      .map((s) => s.trim())
      .find((s) => s.startsWith(prefix));
    return line ? line.slice(prefix.length).trim() : null;
  }

  return tool(
    async ({ query }) => {
      const results = await vectorStore.similaritySearch(query, 3);

      let result: string;
      if (results.length === 0) {
        result = "No relevant documents found in the knowledge base.";
      } else {
        result = results
          .map((doc, i) => {
            const title = readMeta(doc.pageContent, "Title");
            const sourceUrl = readMeta(doc.pageContent, "Source URL");
            const sourceLabel = title ?? doc.metadata.source;
            const urlPart = sourceUrl ? ` | URL: ${sourceUrl}` : "";
            return `[${i + 1}] (Source: ${sourceLabel}${urlPart})\n${doc.pageContent}`;
          })
          .join("\n\n");
      }

      logToolCall("knowledge_base", { query }, result);
      return result;
    },
    {
      name: "knowledge_base",
      description:
        "Search the career guidance knowledge base using semantic search. " +
        "Use this to answer questions about resume writing, job interview preparation, " +
        "salary negotiation, LinkedIn profile optimization, cover letter writing, " +
        "and professional networking. Always cite the source document in your response.",
      schema: z.object({
        query: z
          .string()
          .describe(
            "Natural language question or topic about career development or job searching"
          ),
      }),
    }
  );
}
