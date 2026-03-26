# Phase 2 Roadmap — Web Search Tool
**Date:** March 25, 2026
**Plan:** [2026-03-25-phase-2-websearch-plan.md](./2026-03-25-phase-2-websearch-plan.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)

> **No over-engineering.** Instantiate `TavilySearchResults`, configure it, export it. No custom wrapper.

---

## Checklist

### Prerequisites
- [ ] Phase 1 complete and committed
- [ ] `TAVILY_API_KEY` obtained and added to `.env`

### Implementation
- [ ] `src/tools/webSearch.ts` created
- [ ] `TavilySearchResults` imported from `@langchain/community/tools/tavily_search`
- [ ] `maxResults: 3` configured
- [ ] `searchDepth: "basic"` configured
- [ ] Exported directly — no custom `tool()` wrapper

### Verification
- [ ] Tool returns results with title, URL, content snippet
- [ ] App still starts if `TAVILY_API_KEY` is blank (error only on tool call)

### Commit
- [ ] **Committed:** `feat: web search tool (Tavily)`

---

## Status: `pending`
