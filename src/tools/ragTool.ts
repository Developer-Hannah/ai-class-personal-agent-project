import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { logToolCall } from "../logger.js";

export function createRagTool(vectorStore: MemoryVectorStore) {
  return tool(
    async ({ query }) => {
      const results = await vectorStore.similaritySearch(query, 3);

      let result: string;
      if (results.length === 0) {
        result = "No relevant documents found in the knowledge base.";
      } else {
        result = results
          .map(
            (doc, i) =>
              `[${i + 1}] (Source: ${doc.metadata.source})\n${doc.pageContent}`
          )
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
