# Zod Reference Guide

**Sources:**
- https://zod.dev/ (home)
- https://zod.dev/api (schema API reference)

**Version:** Zod 4 is now stable (Mar 2026). `@langchain/community` pins `zod: ^3.25.76 || ^4` — both versions work.

---

## Install

```bash
npm install zod
```

Requires TypeScript `strict: true` in `tsconfig.json`.

---

## Why We Use Zod

Every LangChain tool requires a Zod schema to define its input shape. The agent uses this schema to:
- Validate arguments before calling the tool
- Generate a JSON Schema for Claude so it knows what arguments to pass

---

## The Only Zod Patterns We Need

### Basic object schema (every tool uses this)

```ts
import * as z from "zod";

const schema = z.object({
  expression: z.string().describe("A math expression like '2 + 2'"),
  query: z.string().describe("A natural language search query"),
  filename: z.string().optional().describe("Optional filename to read"),
});

// TypeScript type is automatically inferred — no manual interface needed
type SchemaType = z.infer<typeof schema>;
// → { expression: string; query: string; filename?: string }
```

### Primitive types

```ts
z.string()       // string
z.number()       // number
z.boolean()      // boolean
z.string().optional()   // string | undefined
```

### `.describe()` — critical for tool schemas

```ts
z.object({
  query: z.string().describe(
    "Natural language question about career topics. Be specific."
  ),
})
```

`.describe()` sets the description that Claude sees when deciding how to call the tool. **Write clear, specific descriptions** — this directly affects agent behavior.

---

## Full Tool Schema Pattern

```ts
import { tool } from "@langchain/core/tools";
import * as z from "zod";

const myTool = tool(
  async ({ query }) => {
    return `Result for: ${query}`;
  },
  {
    name: "tool_name",
    description: "When to call this tool and what it does",
    schema: z.object({
      query: z.string().describe("The search query"),
    }),
  }
);
```

The `schema` field is what Zod provides. That's it — we don't use Zod for anything else in this project.

---

## Zod v3 vs v4 Differences (Relevant to Us)

The import changed between versions:

```ts
// Zod v3 (older — still works)
import { z } from "zod";

// Zod v4 (current recommended)
import * as z from "zod";
```

LangChain examples use both. Use `import * as z from "zod"` to be consistent with the current LangGraph quickstart docs.

---

## Constraints

- Zod schemas are validated at runtime when the agent calls the tool
- If Claude passes invalid arguments, Zod throws — LangChain catches this and returns an error string to the agent
- Keep schemas simple: only include fields the tool actually needs

---

## Unverified

- Whether Zod v4 breaking changes affect `@langchain/core`'s `tool()` wrapper — the community package explicitly supports both `^3.25.76 || ^4`, so it should be fine
