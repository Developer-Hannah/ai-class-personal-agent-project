# mathjs + Express Reference Guide

**Sources:**
- https://mathjs.org/docs/reference/functions/evaluate.html
- https://expressjs.com/en/5x/api.html

---

## mathjs

### Install

```bash
npm install mathjs
```

### The one function we need: `math.evaluate()`

```ts
import { evaluate } from "mathjs";
// OR:
import * as math from "mathjs";

math.evaluate("(2+3)/4")           // → 1.25
math.evaluate("sqrt(3^2 + 4^2)")   // → 5
math.evaluate("85000 * 0.72")      // → 61200
math.evaluate("100 / 12")          // → 8.333...
math.evaluate("120000 + 15000 + 5000")  // → 140000
```

### Why mathjs over eval()

- `eval()` executes arbitrary JavaScript — a **security risk** (prompt injection could run `require('fs').unlinkSync(...)`)
- `mathjs.evaluate()` is a sandboxed math parser — only does math, nothing else
- This is explicitly called out in the course slides as the correct approach

### Calculator tool implementation

```ts
import { tool } from "@langchain/core/tools";
import { evaluate } from "mathjs";
import { z } from "zod";

export const calculatorTool = tool(
  async ({ expression }) => {
    try {
      const result = evaluate(expression);
      return String(result);
    } catch (e) {
      return `Error evaluating expression: ${(e as Error).message}`;
    }
  },
  {
    name: "calculator",
    description:
      "Evaluates mathematical expressions. Use this for any arithmetic, " +
      "salary calculations, cost comparisons, percentage calculations, or " +
      "any other math. Input should be a valid math expression string.",
    schema: z.object({
      expression: z.string().describe(
        "A mathematical expression to evaluate, e.g. '85000 * 0.72' or '(120000 + 15000) / 12'"
      ),
    }),
  }
);
```

### Supported operations

```
Basic:       + - * / ^ %
Functions:   sqrt, abs, ceil, floor, round, log, exp, sin, cos, tan
Constants:   pi, e, Infinity
Comparisons: ==, !=, <, >, <=, >=
Units:       math.evaluate("5 km to miles") → 3.107 (unverified — may need units config)
```

---

## Express.js

### Install

```bash
npm install express
npm install --save-dev @types/express  # TypeScript types
```

### Basic chat server pattern

```ts
import express, { Request, Response } from "express";
import path from "path";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Chat endpoint
app.post("/chat", async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  try {
    const reply = await chat(message);  // calls agent, returns string
    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

### Request/Response shape for our chat endpoint

**Request (POST /chat):**
```json
{ "message": "How do I negotiate my salary?" }
```

**Response (200 OK):**
```json
{ "reply": "When negotiating salary, you should..." }
```

**Response (400 Bad Request):**
```json
{ "error": "message is required" }
```

**Response (500 Internal Server Error):**
```json
{ "error": "Internal server error" }
```

### Serving static files (the chat UI)

```ts
// Serves public/index.html automatically at GET /
app.use(express.static(path.join(__dirname, "../public")));
```

Put `index.html` in `public/` and it's served at `http://localhost:3000`.

### SSE Streaming endpoint (stretch goal)

```ts
app.post("/chat/stream", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const { message } = req.body;
  messageHistory.push({ role: "user", content: message });

  const stream = await agent.stream({ messages: messageHistory });

  for await (const chunk of stream) {
    const last = chunk.messages?.at(-1);
    if (last && typeof last.content === "string") {
      res.write(`data: ${JSON.stringify({ token: last.content })}\n\n`);
    }
  }

  res.write("data: [DONE]\n\n");
  res.end();
});
```

**Frontend SSE listener:**
```js
const evtSource = new EventSource("/chat/stream");
evtSource.onmessage = (e) => {
  if (e.data === "[DONE]") { evtSource.close(); return; }
  const { token } = JSON.parse(e.data);
  document.getElementById("response").textContent += token;
};
```

---

## Environment Variables

Use `dotenv` to load `.env` file:

```bash
npm install dotenv
```

```ts
import "dotenv/config";  // at the top of server.ts, before any API calls

// Now process.env.ANTHROPIC_API_KEY etc. are available
```

---

## Unverified

- Express 5.x vs 4.x differences — verify which version `npm install express` installs; the docs fetched were for 5.x but 4.x is still common
- Whether SSE streaming works cleanly with `agent.stream()` from `createReactAgent` — the streaming pattern above is a reasonable approximation but needs testing
