# Phase 6 Plan — Server + Web UI
**Date:** March 25, 2026
**Roadmap:** [2026-03-25-phase-6-server-ui-roadmap.md](./2026-03-25-phase-6-server-ui-roadmap.md)
**Parent:** [2026-03-25-high-level_project-roadmap.md](./2026-03-25-high-level_project-roadmap.md)
**Prerequisite:** Phase 5 complete and committed.

> **No over-engineering.** One POST endpoint. One HTML file. Vanilla JS fetch. No frontend framework, no WebSocket, no build step for the frontend.

---

## Goal
The agent is accessible from a browser at `http://localhost:3000`. The full loop works: type a message, get a reply, follow-up questions remember context.

## Guides
- [mathjs + Express](../guides/mathjs-express.md) — Express endpoint pattern, SSE (stretch)
- [dotenv](../guides/dotenv_context7.md) — already loaded in server.ts

---

## File: `src/server.ts` — Add `POST /chat`

`server.ts` already exists from Phase 0. Add to it:

1. Import `chat` from `src/memory.ts`
2. Add `POST /chat` route:
   - Read `message` from `req.body`
   - Validate it is a non-empty string — return 400 if missing
   - Call `await chat(message)`
   - Return `{ reply }` as JSON
   - Catch errors — return 500 with `{ error: "Internal server error" }`
3. Keep `GET /health` as-is

### Request/response contract
- **Request body:** `{ "message": "string" }`
- **200 response:** `{ "reply": "string" }`
- **400 response:** `{ "error": "message is required" }`
- **500 response:** `{ "error": "Internal server error" }`

---

## File: `public/index.html`

Single HTML file. Vanilla JS only. No CDN imports needed.

### Required UI elements
- Page title: "Career Compass"
- A scrollable `<div>` for the chat history
- An `<input>` field for user messages
- A "Send" button
- Messages displayed with clear visual distinction between user and assistant

### Required JS behavior
1. On send (button click or Enter key): read input value, clear input, POST to `/chat`
2. While waiting: disable the input and button, show a "Thinking..." indicator
3. On response: re-enable input/button, append assistant reply to chat history
4. Auto-scroll to the bottom after each message
5. On error: show a simple "Something went wrong" message

### Styling
Minimal. Functional. No CSS framework. Just enough to make the messages readable and the layout usable:
- Messages aligned left (assistant) and right (user) OR simply labelled "You:" and "Agent:"
- Scrollable chat area with fixed height
- Input pinned to bottom

---

## Startup Sequence in `src/server.ts`

The complete startup order must be:
1. `import "dotenv/config"` (first line)
2. Import all modules
3. Call `initVectorStore()` — await it
4. Then `app.listen(3000, ...)`

Do not start accepting connections before the vector store is ready.

---

## Verify Before Committing

Full end-to-end test in the browser:
1. Open `http://localhost:3000`
2. Send: `"What is 25% of 120000?"` → agent uses calculator
3. Send: `"And what is that per month?"` → agent remembers 120000, calculates 30000/12
4. Send: `"What are current software engineer salaries?"` → agent uses web_search
5. Send: `"How do I negotiate a raise?"` → agent uses knowledge_base, cites source
6. Confirm all three tools callable from the browser UI

---

## Commit
```
feat: Express server and chat web UI
```
