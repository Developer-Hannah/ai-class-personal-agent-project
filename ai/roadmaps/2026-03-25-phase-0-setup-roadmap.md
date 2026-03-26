# Phase 0 Roadmap — Project Setup
**Date:** March 25, 2026
**Plan:** [2026-03-25-phase-0-setup-plan.md](./2026-03-25-phase-0-setup-plan.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)

> **No over-engineering.** Scaffolding only — no features, no abstractions beyond what boots the server.

---

## Checklist

### Pre-Work (Before Any Code)
- [ ] Node.js LTS confirmed installed (`node --version`)
- [ ] GitHub repo created and connected locally (`git remote -v`)
- [ ] All three API keys sourced: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `TAVILY_API_KEY`
- [ ] 5+ career guidance documents sourced for `docs/`

### Dependencies
- [ ] `npm init -y` run
- [ ] All runtime dependencies installed
- [ ] All dev dependencies installed
- [ ] `"type": "module"` added to `package.json`
- [ ] `dev` and `build` scripts added to `package.json`

### Configuration
- [ ] `tsconfig.json` created with correct settings
- [ ] `.env` created (blank values)
- [ ] `.env.example` created (placeholder values)
- [ ] `.gitignore` verified — covers all required entries

### Folders
- [ ] `src/` created
- [ ] `src/tools/` created
- [ ] `public/` created
- [ ] `docs/` created
- [ ] `uploads/` created

### Files
- [ ] `src/server.ts` written — boots Express, `GET /health` responds
- [ ] `README.md` stub written

### Verification
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts without TypeScript errors
- [ ] `GET http://localhost:3000/health` returns `{ "status": "ok" }`

### Commit
- [ ] **Committed:** `setup: project scaffold, tsconfig, dependencies`

---

## Status: `pending`
