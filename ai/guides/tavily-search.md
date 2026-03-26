# Tavily Search API + LangChain Integration Reference Guide

**Sources:**
- https://docs.tavily.com/documentation/api-reference/endpoint/search
- https://www.npmjs.com/package/@langchain/community (v1.1.25, Mar 2026)

---

## Setup

### API Key
Get a key at: https://tavily.com

```bash
TAVILY_API_KEY=tvly-...
```

### Package Install

```bash
npm install @langchain/community @langchain/core
```

---

## LangChain Integration (Use This)

`TavilySearchResults` is a pre-built LangChain tool in `@langchain/community`.

```ts
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

const searchTool = new TavilySearchResults({
  maxResults: 3,                        // default 5, range 0–20
  apiKey: process.env.TAVILY_API_KEY,   // optional if env var set
});

// Used directly as a tool in createReactAgent
const agent = createReactAgent({
  llm: model,
  tools: [searchTool, calculatorTool, knowledgeBaseTool],
});
```

### TavilySearchResults options

```ts
new TavilySearchResults({
  maxResults: 3,             // number of results to return
  searchDepth: "basic",      // "basic" | "advanced" | "fast" | "ultra-fast"
  // "basic" and "fast" = 1 API credit; "advanced" = 2 credits
  apiKey: process.env.TAVILY_API_KEY,
});
```

---

## Raw Tavily API (For Reference)

The LangChain wrapper calls this automatically.

```
POST https://api.tavily.com/search
Authorization: Bearer tvly-YOUR_API_KEY
Content-Type: application/json
```

### Request body

```json
{
  "query": "average software engineer salary 2026",
  "search_depth": "basic",
  "max_results": 5,
  "topic": "general",
  "include_answer": false,
  "include_raw_content": false,
  "include_images": false
}
```

**Required fields:** `query` only

**Key params:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `query` | string | — | **Required** |
| `search_depth` | enum | `"basic"` | `basic`=1 credit, `advanced`=2 credits |
| `max_results` | integer | 5 | Range: 0–20 |
| `topic` | enum | `"general"` | `"general"` or `"news"` or `"finance"` |
| `time_range` | enum | null | `"day"`, `"week"`, `"month"`, `"year"` |
| `include_answer` | bool | false | LLM-generated answer in response |

### Response shape

```json
{
  "query": "average software engineer salary 2026",
  "results": [
    {
      "title": "Software Engineer Salaries 2026 | Glassdoor",
      "url": "https://glassdoor.com/...",
      "content": "The average software engineer salary in 2026...",
      "score": 0.91
    }
  ],
  "response_time": 1.23
}
```

The `TavilySearchResults` LangChain tool returns the `results` array as a formatted string to the agent.

---

## Error Codes

| Code | Meaning | Fix |
|---|---|---|
| 400 | Bad request (invalid params) | Check request body |
| 401 | Unauthorized | Check `TAVILY_API_KEY` |
| 429 | Rate limit exceeded | Slow down requests |
| 432 | Plan/key limit exceeded | Upgrade plan or contact support |
| 433 | Pay-as-you-go limit exceeded | Increase limit on Tavily dashboard |

---

## Free Tier Limits

Tavily's free tier (as of early 2026) provides a limited number of API credits per month. **Check your current plan at https://app.tavily.com** after creating an account.

- 1 credit = 1 `basic`, `fast`, or `ultra-fast` search
- 2 credits = 1 `advanced` search
- Use `search_depth: "basic"` in dev to conserve credits

---

## Unverified

- Exact free tier credit limit — **check dashboard after signup**; was ~1000 credits/month on free tier historically but may have changed
- Whether `TavilySearchResults` import path is exactly `@langchain/community/tools/tavily_search` in v1.1.25 — verify at runtime
