# Phase 1 Plan — Calculator Tool
**Date:** March 25, 2026
**Roadmap:** [2026-03-25-phase-1-calculator-roadmap.md](./2026-03-25-phase-1-calculator-roadmap.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)
**Prerequisite:** Phase 0 complete and committed

> **No over-engineering.** One file, one function, one tool. Do not add input sanitization beyond what mathjs already provides.

---

## Goal
A single `calculator.ts` file that exports a LangChain tool. The tool evaluates math expressions safely using `mathjs` and returns the result as a string.

## Guides
- [mathjs + Express](../guides/mathjs-express.md)
- [LangChain + LangGraph](../guides/langchain-langgraph.md) — tool() pattern
- [Zod](../guides/zod_context7.md) — schema definition

---

## File: `src/tools/calculator.ts`

### What it does
- Accepts a single input: `expression` (string)
- Calls `math.evaluate(expression)` from `mathjs`
- Returns the numeric result as a string
- On error, returns the error message as a string — never throws

### Tool metadata
- `name`: `"calculator"`
- `description`: Should tell Claude exactly when to use it — any arithmetic, salary math, cost comparisons, percentage calculations. Be specific enough that Claude doesn't use web search for simple math.
- `schema`: `z.object({ expression: z.string().describe("...") })`

### Error handling
Wrap the `evaluate()` call in try/catch. Return `"Error: <message>"` string on failure. mathjs throws on invalid expressions (e.g., mismatched parens, undefined variables).

---

## Verify Before Committing

Mentally trace these cases — the tool should handle all cleanly:
- `"2 + 2"` → `"4"`
- `"85000 * 0.72"` → `"61200"`
- `"sqrt(144)"` → `"12"`
- `"(120000 + 15000) / 12"` → `"11250"`
- `"invalid!!expr"` → `"Error: ..."` (does not crash)

No test framework needed — verify manually by temporarily importing and calling the tool function at the bottom of the file, then removing the test call before committing.

---

## Commit
```
feat: calculator tool
```
