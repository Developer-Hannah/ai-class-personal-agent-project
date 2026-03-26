import { TavilySearch } from "@langchain/tavily";

export function createWebSearchTool() {
  return new TavilySearch({
    maxResults: 3,
    searchDepth: "basic",
  });
}
