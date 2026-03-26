# dotenv Reference Guide

**Sources:**
- https://www.npmjs.com/package/dotenv (v17.3.1, Feb 2026)

---

## Install

```bash
npm install dotenv
```

Zero dependencies. 111M weekly downloads.

---

## The Only Pattern We Need

Place this as the **very first import** in `src/server.ts`, before any LangChain or API imports:

```ts
import "dotenv/config";

// Now all .env values are available everywhere in the process
import { ChatAnthropic } from "@langchain/anthropic";
// etc.
```

That's it. `process.env.ANTHROPIC_API_KEY`, `process.env.OPENAI_API_KEY`, and `process.env.TAVILY_API_KEY` will be populated from `.env` before any other module loads.

---

## .env File Format

```ini
# .env  (gitignored — never commit this file)
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-proj-...
TAVILY_API_KEY=tvly-...
```

Rules:
- No quotes needed for simple values (quotes are included literally if added)
- Lines starting with `#` are comments
- No spaces around `=`
- Multiline values: wrap in double quotes

---

## .env.example File

Commit this file to git as a template — with fake placeholder values, never real keys:

```ini
# .env.example  (committed to git — safe to share)
ANTHROPIC_API_KEY=your-anthropic-api-key-here
OPENAI_API_KEY=your-openai-api-key-here
TAVILY_API_KEY=your-tavily-api-key-here
```

---

## Accessing Values in Code

```ts
const apiKey = process.env.ANTHROPIC_API_KEY;

// With a fallback (optional)
const port = process.env.PORT ?? "3000";
```

Most LangChain packages read env vars automatically — you don't need to pass them explicitly:
- `ChatAnthropic` reads `ANTHROPIC_API_KEY` automatically
- `OpenAIEmbeddings` reads `OPENAI_API_KEY` automatically
- `TavilySearchResults` reads `TAVILY_API_KEY` automatically

Only pass them explicitly if you want to be explicit or override the default:

```ts
const model = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // optional — reads env var by default
  model: "claude-sonnet-4-6",
});
```

---

## .gitignore Entries Required

These should already be in `.gitignore`:

```
.env
.env.*
!.env.example
```

The `!.env.example` exception allows the example file to be committed.

---

## Constraints

- `.env` is only loaded when `import "dotenv/config"` runs — it must be the first import
- Variables set in the actual environment (e.g., shell `export`) override `.env` values
- `dotenv` does NOT throw if `.env` is missing — it silently does nothing. If keys are missing, the LangChain packages will throw their own errors when first used.

---

## Unverified

- Nothing — dotenv is extremely stable and this usage pattern is the same across all versions
