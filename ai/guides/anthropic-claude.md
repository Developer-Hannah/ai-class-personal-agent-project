# Anthropic Claude API + @langchain/anthropic Reference Guide

**Sources:**
- https://docs.anthropic.com/en/api/getting-started
- https://docs.anthropic.com/en/api/rate-limits
- https://docs.anthropic.com/en/docs/about-claude/models/overview
- https://www.npmjs.com/package/@langchain/anthropic (v1.3.25, Mar 2026)

---

## Package Install

```bash
npm install @langchain/anthropic @langchain/core
```

**Version:** `@langchain/anthropic` v1.3.25 (Mar 2026)

---

## Environment Variable

```bash
ANTHROPIC_API_KEY=sk-ant-...
```

Get key at: https://platform.claude.ai/settings/keys

---

## Current Claude Models (Mar 2026)

| Model | API ID | Context | Max Output | Price (input/output per MTok) | Best For |
|---|---|---|---|---|---|
| Claude Sonnet 4.6 | `claude-sonnet-4-6` | 1M tokens | 64k | $3 / $15 | **Recommended for this project** |
| Claude Haiku 4.5 | `claude-haiku-4-5` | 200k tokens | 64k | $1 / $5 | Cheapest, fastest |
| Claude Opus 4.6 | `claude-opus-4-6` | 1M tokens | 128k | $5 / $25 | Most capable, expensive |

**For this project:** Use `claude-haiku-4-5` during development (cheap), switch to `claude-sonnet-4-6` for demos.

**Deprecated (avoid):** `claude-3-haiku-20240307` — retires April 19, 2026.

---

## Basic ChatAnthropic Usage

```ts
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  model: "claude-sonnet-4-6",     // required
  apiKey: process.env.ANTHROPIC_API_KEY,  // optional if env var set
  temperature: 0,                 // 0 = deterministic, good for tools
  maxTokens: 4096,                // optional output limit
});

// Single call
const response = await model.invoke([
  { role: "user", content: "Hello!" }
]);
console.log(response.content); // string

// With system message
const response2 = await model.invoke([
  { role: "system", content: "You are a career advisor." },
  { role: "user", content: "How do I write a resume?" }
]);
```

## With Tools (bindTools)

```ts
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const myTool = tool(async ({ expr }) => String(eval(expr)), {
  name: "calculator",
  description: "Evaluates math expressions",
  schema: z.object({ expr: z.string() }),
});

const modelWithTools = model.bindTools([myTool]);
const result = await modelWithTools.invoke([{ role: "user", content: "What is 2+2?" }]);
```

## Streaming

```ts
const stream = await model.stream([{ role: "user", content: "Tell me a story" }]);
for await (const chunk of stream) {
  process.stdout.write(chunk.content as string);
}
```

---

## Rate Limits (Tier 1 — New API Key)

These are the limits you'll hit on a brand-new API key:

| Model | Requests/min | Input tokens/min | Output tokens/min |
|---|---|---|---|
| Claude Sonnet 4.x | 50 | 30,000 | 8,000 |
| Claude Haiku 4.5 | 50 | 50,000 | 10,000 |

**Tier 1 monthly spend limit: $100**

**429 errors:** Wait for `retry-after` header value in seconds. Token bucket replenishes continuously, not at fixed intervals.

**Practical implication for this project:** 50 RPM is plenty for a local dev chatbot. You won't hit rate limits in normal usage.

---

## Anthropic REST API (Direct — FYI Only)

The LangChain wrapper handles this automatically. For reference:

```
POST https://api.anthropic.com/v1/messages
Headers:
  x-api-key: YOUR_KEY
  anthropic-version: 2023-06-01
  content-type: application/json

Body:
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 1024,
  "messages": [{"role": "user", "content": "Hello"}]
}
```

Response:
```json
{
  "id": "msg_...",
  "type": "message",
  "role": "assistant",
  "content": [{"type": "text", "text": "Hello! How can I help?"}],
  "model": "claude-sonnet-4-6",
  "stop_reason": "end_turn",
  "usage": {"input_tokens": 12, "output_tokens": 8}
}
```

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| 401 Unauthorized | Wrong/missing API key | Check `ANTHROPIC_API_KEY` env var |
| 429 Too Many Requests | Rate limit hit | Add delay; use Haiku during dev |
| 529 Overloaded | Anthropic server busy | Retry with backoff |

---

## Unverified

- Whether `model: "claude-sonnet-4-6"` is the stable alias or if a date-versioned ID is required — the docs show aliases without dates for 4.x models, which suggests aliases work
