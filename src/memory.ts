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

export async function* streamChat(
  userMessage: string
): AsyncGenerator<string, void, unknown> {
  messageHistory.push({ role: "user", content: userMessage });

  const stream = await _agent.stream(
    { messages: messageHistory },
    { streamMode: "values", recursionLimit: 10 }
  );

  let lastAiText = "";
  let finalReply = "";

  for await (const chunk of stream) {
    const msgs: unknown[] = (chunk as { messages?: unknown[] }).messages ?? [];
    const lastMsg = msgs[msgs.length - 1] as
      | { _getType?: () => string; content: unknown }
      | undefined;
    if (!lastMsg) continue;

    const msgType =
      typeof lastMsg._getType === "function" ? lastMsg._getType() : "";
    if (msgType !== "ai") continue;

    const raw = lastMsg.content;
    const text =
      typeof raw === "string"
        ? raw
        : (raw as Array<{ type: string; text: string }>).find(
            (b) => b.type === "text"
          )?.text ?? "";

    if (text && text !== lastAiText) {
      const delta = text.slice(lastAiText.length);
      if (delta) {
        yield delta;
        lastAiText = text;
        finalReply = text;
      }
    }
  }

  messageHistory.push({ role: "assistant", content: finalReply });
}

export function clearHistory(): void {
  messageHistory.length = 0;
}
