# Phase 0 Plan — Project Setup
**Date:** March 25, 2026
**Roadmap:** [2026-03-25-phase-0-setup-roadmap.md](./2026-03-25-phase-0-setup-roadmap.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)

> **No over-engineering.** This phase is scaffolding only — no abstractions, no extra packages, no configuration beyond what is directly needed to run the project.

---

## Goal
A clean skeleton that compiles, starts an Express server, and responds to a health check. Nothing else.

## Guides
- [TypeScript + tsconfig](../guides/typescript-tsconfig_context7.md)
- [dotenv](../guides/dotenv_context7.md)
- [mathjs + Express](../guides/mathjs-express.md)

---

## File: `package.json`

Set `"type": "module"` for ESM. Scripts: `dev` runs `tsx src/server.ts`, `build` runs `tsc`.

Dependencies to install:
```
langchain @langchain/langgraph @langchain/anthropic @langchain/openai
@langchain/community @langchain/core mathjs express dotenv zod
```

Dev dependencies:
```
typescript tsx @types/node @types/express
```

---

## File: `tsconfig.json`

Use the config from the TypeScript guide exactly:
- `target: ES2022`, `module: NodeNext`, `moduleResolution: NodeNext`
- `strict: true`, `esModuleInterop: true`, `skipLibCheck: true`
- `rootDir: ./src`, `outDir: ./dist`

---

## File: `.env`

Three keys, all blank until obtained:
```
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
TAVILY_API_KEY=
```

---

## File: `.env.example`

Same keys, placeholder values. This file IS committed to git.

---

## File: `.gitignore`

Already exists. Confirm it includes: `.env`, `.env.*`, `!.env.example`, `node_modules/`, `dist/`, `ai/`, `CLAUDE.md`, `.cursorrules`.

---

## Folder Structure to Create

```
src/
src/tools/
public/
docs/
uploads/         ← pre-created now for Phase 8 stretch goal (file reader tool)
```

> **Note:** `uploads/` is created here so it exists in the repo structure before it's needed. It stays empty until Phase 8.

No files inside these yet — just the directories.

---

## File: `src/server.ts`

Minimal server — just enough to confirm the app boots:

1. First line: `import "dotenv/config"`
2. Import express
3. Create app, add `express.json()` middleware
4. Add `GET /health` route returning `{ status: "ok" }`
5. Serve `public/` statically
6. Listen on port 3000
7. Log startup message

No chat endpoint yet — that's Phase 6.

---

## File: `README.md`

Stub only. Include:
- Project name and one-line description
- "Setup" section: clone, `npm install`, copy `.env.example` to `.env`, fill in keys, `npm run dev`
- "Tools" section: placeholder list (to be completed in Phase 7)

---

## Verify Before Committing

- `npm install` completes without errors
- `npm run dev` starts without errors
- `GET http://localhost:3000/health` returns `{ "status": "ok" }`
- No TypeScript errors on startup

---

## Commit
```
setup: project scaffold, tsconfig, dependencies
```
