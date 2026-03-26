import type { createAgent } from "./agent.js";

type Agent = ReturnType<typeof createAgent>;

let _agent: Agent;

const messageHistory: { role: string; content: string }[] = [];

export function initMemory(agent: Agent): void {
  _agent = agent;
}

export async function chat(userMessage: string): Promise<string> {
  messageHistory.push({ role: "user", content: userMessage });

  const result = await _agent.invoke(
    { messages: messageHistory },
    { recursionLimit: 10 }
  );

  const lastMessage = result.messages[result.messages.length - 1];
  const raw = lastMessage.content;

  const reply =
    typeof raw === "string"
      ? raw
      : (raw as Array<{ type: string; text: string }>).find(
          (block) => block.type === "text"
        )?.text ?? "";

  messageHistory.push({ role: "assistant", content: reply });
  return reply;
}

export function clearHistory(): void {
  messageHistory.length = 0;
}
