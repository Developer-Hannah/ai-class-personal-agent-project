import { TavilySearch } from "@langchain/tavily";

export const webSearchTool = new TavilySearch({
  maxResults: 3,
  searchDepth: "basic",
});
