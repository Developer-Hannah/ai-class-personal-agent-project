import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatAnthropic } from "@langchain/anthropic";
import type { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { calculatorTool } from "./tools/calculator.js";
import { createWebSearchTool } from "./tools/webSearch.js";
import { createRagTool } from "./tools/ragTool.js";
import { fileReaderTool } from "./tools/fileReader.js";

export function createAgent(vectorStore: MemoryVectorStore) {
  const model = new ChatAnthropic({
    model: "claude-haiku-4-5",
    temperature: 0,
  });

  const webSearchTool = createWebSearchTool();
  const ragTool = createRagTool(vectorStore);

  return createReactAgent({
    llm: model,
    tools: [calculatorTool, webSearchTool, ragTool, fileReaderTool],
  });
}
