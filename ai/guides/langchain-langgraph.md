# LangChain + LangGraph Reference Guide

**Sources:**
- https://js.langchain.com (redirects to unified docs)
- https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/
- https://www.npmjs.com/package/@langchain/langgraph (v1.2.5, Mar 2026)

---

## Package Versions (as of Mar 2026)

| Package | Latest Version |
|---|---|
| `@langchain/langgraph` | 1.2.5 |
| `@langchain/core` | ^1.1.36 |
| `langchain` | ^1.0.0-alpha |

---

## ⚠️ IMPORTANT: createReactAgent Import Location

**The course slides show:**
```ts
import { createReactAgent } from "@langchain/langgraph/prebuilt";
```

**Current LangGraph npm docs show:**
```ts
import { createReactAgent, tool } from "langchain";
```

Both patterns work — `langchain` re-exports from `@langchain/langgraph`. However, when building, use whichever resolves cleanly after `npm install`. **Confirm by testing import resolution before coding.**

---

## Pattern 1: createReactAgent (Simple — Use This)

Recommended for our project. Wraps the LangGraph StateGraph pattern in a simpler API.

```ts
import { createReactAgent } from "@langchain/langgraph/prebuilt";
// OR: import { createReactAgent } from "langchain";
import { ChatAnthropic } from "@langchain/anthropic";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const myTool = tool(
  async ({ query }) => {
    return `Result for: ${query}`;
  },
  {
    name: "my_tool",
    description: "Description of when to use this tool",
    schema: z.object({
      query: z.string().describe("The query to process"),
    }),
  }
);

const model = new ChatAnthropic({ model: "claude-sonnet-4-6" });

const agent = createReactAgent({
  llm: model,
  tools: [myTool],
});

// Invoke with message history (pass full history for memory)
const result = await agent.invoke({
  messages: [{ role: "user", content: "My question here" }],
});

// Last message in result.messages is the final assistant response
const lastMessage = result.messages[result.messages.length - 1];
console.log(lastMessage.content);
```

### With recursion limit (prevent infinite loops)

```ts
const result = await agent.invoke(
  { messages: messageHistory },
  { recursionLimit: 10 }
);
```

---

## Pattern 2: StateGraph (Low-Level — For Reference)

From the official LangGraph quickstart. More verbose but more control.

```ts
import { StateGraph, StateSchema, MessagesValue, START, END } from "@langchain/langgraph";
import { ChatAnthropic } from "@langchain/anthropic";
import { tool } from "@langchain/core/tools";
import { AIMessage, HumanMessage, ToolMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";

// 1. Define state
const MessagesState = new StateSchema({ messages: MessagesValue });

// 2. Create model + tools
const model = new ChatAnthropic({ model: "claude-sonnet-4-6", temperature: 0 });
const myTool = tool(({ a, b }) => a + b, {
  name: "add",
  description: "Add two numbers",
  schema: z.object({ a: z.number(), b: z.number() }),
});
const toolsByName = { [myTool.name]: myTool };
const modelWithTools = model.bindTools([myTool]);

// 3. Define nodes
const llmCall = async (state) => ({
  messages: [await modelWithTools.invoke([
    new SystemMessage("You are a helpful assistant."),
    ...state.messages,
  ])],
});

const toolNode = async (state) => {
  const lastMessage = state.messages.at(-1);
  const results = [];
  for (const toolCall of lastMessage.tool_calls ?? []) {
    const t = toolsByName[toolCall.name];
    results.push(await t.invoke(toolCall));
  }
  return { messages: results };
};

// 4. Define routing
const shouldContinue = (state) => {
  const last = state.messages.at(-1);
  if (AIMessage.isInstance(last) && last.tool_calls?.length) return "toolNode";
  return END;
};

// 5. Build graph
const agent = new StateGraph(MessagesState)
  .addNode("llmCall", llmCall)
  .addNode("toolNode", toolNode)
  .addEdge(START, "llmCall")
  .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
  .addEdge("toolNode", "llmCall")
  .compile();

const result = await agent.invoke({
  messages: [new HumanMessage("Add 3 and 4")],
});
```

---

## Defining Tools

```ts
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const myTool = tool(
  async ({ param1, param2 }) => {
    // Tool logic here
    // Return a string — NEVER throw; return error message as string
    try {
      return `Result: ${param1 + param2}`;
    } catch (e) {
      return `Error: ${e.message}`;
    }
  },
  {
    name: "tool_name",          // snake_case, no spaces
    description: "Clear description of WHEN and WHY to use this tool",
    schema: z.object({
      param1: z.number().describe("Description of param1"),
      param2: z.string().optional().describe("Optional param"),
    }),
  }
);
```

**Critical rules:**
- Tool functions must be `async` for web search and RAG
- Never throw from a tool — return an error string instead
- Tool descriptions drive when the agent calls them — be specific

---

## Conversation Memory Pattern

```ts
let messageHistory: { role: string; content: string }[] = [];

async function chat(userMessage: string): Promise<string> {
  messageHistory.push({ role: "user", content: userMessage });

  const result = await agent.invoke({ messages: messageHistory });

  const lastMessage = result.messages[result.messages.length - 1];
  const assistantContent = typeof lastMessage.content === "string"
    ? lastMessage.content
    : lastMessage.content[0]?.text ?? "";

  messageHistory.push({ role: "assistant", content: assistantContent });
  return assistantContent;
}
```

**Caveat:** Message array grows without limit. For a class project this is fine; in production you'd truncate.

---

## Streaming (Stretch Goal)

```ts
const stream = await agent.stream(
  { messages: messageHistory },
  { streamMode: "values" }
);

for await (const chunk of stream) {
  const lastMsg = chunk.messages[chunk.messages.length - 1];
  if (typeof lastMsg.content === "string") {
    process.stdout.write(lastMsg.content);
  }
}
```

---

## Unverified

- Exact behavior when mixing `langchain` and `@langchain/langgraph/prebuilt` imports in the same project — test during setup
- Whether `messageHistory` format `{ role, content }` vs `HumanMessage` instances matters for `createReactAgent` — likely both work
