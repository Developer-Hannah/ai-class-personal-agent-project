import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

export function createRagTool(vectorStore: MemoryVectorStore) {
  return tool(
    async ({ query }) => {
      const results = await vectorStore.similaritySearch(query, 3);

      if (results.length === 0) {
        return "No relevant documents found in the knowledge base.";
      }

      return results
        .map(
          (doc, i) =>
            `[${i + 1}] (Source: ${doc.metadata.source})\n${doc.pageContent}`
        )
        .join("\n\n");
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
