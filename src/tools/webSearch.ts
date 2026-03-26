import { tool } from "@langchain/core/tools";
import { TavilySearch } from "@langchain/tavily";
import { z } from "zod";
import { logToolCall } from "../logger.js";

export function createWebSearchTool() {
  const tavily = new TavilySearch({ maxResults: 3, searchDepth: "basic" });

  return tool(
    async ({ query }) => {
      const result = await tavily.invoke({ query });
      const resultStr = typeof result === "string" ? result : JSON.stringify(result);
      logToolCall("web_search", { query }, resultStr);
      return resultStr;
    },
    {
      name: "web_search",
      description: tavily.description,
      schema: z.object({
        query: z.string().describe("Search query to look up current information on the web"),
      }),
    }
  );
}
