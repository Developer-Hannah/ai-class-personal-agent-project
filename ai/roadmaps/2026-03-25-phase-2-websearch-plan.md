# Phase 2 Plan — Web Search Tool
**Date:** March 25, 2026
**Roadmap:** [2026-03-25-phase-2-websearch-roadmap.md](./2026-03-25-phase-2-websearch-roadmap.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)
**Prerequisite:** Phase 1 complete and committed

> **No over-engineering.** `TavilySearchResults` is a pre-built LangChain tool — instantiate it with config and export it. No custom wrapper needed.

---

## Goal
Export a configured `TavilySearchResults` instance that the agent can call directly. No custom tool function needed — Tavily's LangChain integration handles everything.

## Guides
- [Tavily Search](../guides/tavily-search.md)
- [dotenv](../guides/dotenv_context7.md) — `TAVILY_API_KEY` must be in `.env`

---

## File: `src/tools/webSearch.ts`

### What it does
- Instantiates `TavilySearchResults` from `@langchain/community/tools/tavily_search`
- Configures `maxResults: 3` — enough for good answers, not too many tokens
- Uses `searchDepth: "basic"` to conserve free-tier API credits
- Reads `TAVILY_API_KEY` automatically from `process.env`
- Exports the instance as the default export

### No custom wrapper
`TavilySearchResults` already implements the LangChain tool interface. Export it directly — do not wrap it in another `tool()` call.

---

## Dependency Note
`TAVILY_API_KEY` must be set in `.env` before this tool can be tested. If the key is blank, Tavily will throw a 401 on first use. The app should still start without the key — the error only appears when the tool is called.

---

## Verify Before Committing

With a valid `TAVILY_API_KEY` in `.env`:
- Temporarily import the tool in `server.ts` and invoke it with a test query
- Confirm results come back with titles, URLs, and content snippets
- Remove the test call before committing

If no API key yet: skip live verification, commit the code, and verify in Phase 4 when all tools are wired into the agent.

---

## Commit
```
feat: web search tool (Tavily)
```
