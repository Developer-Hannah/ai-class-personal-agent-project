# TypeScript + tsconfig.json Reference Guide

**Sources:**
- https://www.typescriptlang.org/tsconfig/ (full compiler options reference)

---

## Packages

```bash
npm install --save-dev typescript @types/node @types/express
```

Run TypeScript directly in dev (no separate compile step needed):

```bash
npm install --save-dev tsx
```

---

## tsconfig.json for This Project

This is the minimal, correct config for a Node.js + ESM TypeScript project running with `tsx`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Key Options Explained

| Option | Value | Why |
|---|---|---|
| `target` | `ES2022` | Modern Node.js supports ES2022 natively |
| `module` | `NodeNext` | Required for proper ESM/CJS interop in Node |
| `moduleResolution` | `NodeNext` | Matches `module: NodeNext` — must match |
| `outDir` | `./dist` | Compiled output goes here (gitignored) |
| `rootDir` | `./src` | Source files live here |
| `strict` | `true` | Required by Zod; best practice always |
| `esModuleInterop` | `true` | Allows `import x from 'x'` for CJS packages |
| `skipLibCheck` | `true` | Skips type-checking of `.d.ts` in `node_modules` — avoids noise from conflicting packages |
| `resolveJsonModule` | `true` | Allows `import data from './data.json'` |

---

## package.json Scripts

```json
{
  "scripts": {
    "dev": "tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "type": "module"
}
```

`"type": "module"` tells Node.js to treat `.js` files as ESM. Combined with `module: NodeNext` in tsconfig, this enables modern import/export syntax throughout.

---

## Dev Workflow

Run the server directly without compiling:

```bash
npm run dev
```

`tsx` watches for changes and re-runs on save if you add `--watch`:

```json
"dev": "tsx watch src/server.ts"
```

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| `Cannot find module` | Missing `@types/*` package | Install the `@types/` package |
| `Property does not exist on type` | `strict` caught a type issue | Fix the type; don't use `any` as a shortcut |
| `Module '"x"' has no exported member` | Wrong import | Check the package's export names |
| `ERR_UNKNOWN_FILE_EXTENSION .ts` | Running with `node` instead of `tsx` | Use `tsx` in dev, `node dist/` in prod |

---

## Unverified

- Whether `module: "NodeNext"` is the right choice for all LangChain packages — some older packages may have CJS-only exports that need `esModuleInterop`. If import errors occur, try `module: "CommonJS"` as a fallback.
