# Phase 1 Roadmap — Calculator Tool
**Date:** March 25, 2026
**Plan:** [2026-03-25-phase-1-calculator-plan.md](./2026-03-25-phase-1-calculator-plan.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)

> **No over-engineering.** One file. Wrap mathjs, handle errors, done.

---

## Checklist

### Implementation
- [ ] `src/tools/calculator.ts` created
- [ ] `mathjs` `evaluate()` used (not `eval()`)
- [ ] Tool name: `"calculator"`
- [ ] Tool description is specific about when to use it
- [ ] Zod schema: single `expression` string field with `.describe()`
- [ ] Try/catch wraps `evaluate()` — returns error string, never throws

### Verification
- [ ] `"2 + 2"` → `"4"`
- [ ] `"85000 * 0.72"` → `"61200"`
- [ ] `"sqrt(144)"` → `"12"`
- [ ] `"(120000 + 15000) / 12"` → `"11250"` (multi-step)
- [ ] Invalid expression → error string, no crash

### Commit
- [ ] **Committed:** `feat: calculator tool`

---

## Status: `pending`
