# CLAUDE.md
> Repo root file. Claude Code loads this automatically in every session.

## Project: LearnCode

An interactive Python learning platform for absolute beginners.

## Stack

```
Monorepo        Turborepo + pnpm workspaces
Frontend        React 18 + TypeScript + Vite + Tailwind + shadcn/ui
Editor          Monaco Editor (@monaco-editor/react)
Layout          react-resizable-panels (3-panel workspace)
State           Zustand (client) + TanStack Query v5 (server state)
Backend         Node.js + Fastify v4
Auth            JWT (@fastify/jwt) + bcrypt
Database        PostgreSQL + Prisma ORM
Execution       Pyodide in Web Worker (client-side, no server cost)
```

## Repo layout

```
apps/web        → React app (Vite)
apps/api        → Fastify backend
packages/types  → Shared TypeScript types
packages/validators → Shared Zod schemas
prisma/         → Schema + seed scripts (at repo root)
docs/           → Specs, conventions, wave plans
templates/      → YAML templates for content authoring
```

## Working agreements

1. **Always read the relevant doc first.** Specs live in `docs/`. Wave-specific tasks live in `docs/waves/`.
2. **Never expose hidden test cases through any API.** Only their count.
3. **Always use Prisma transactions when modifying wallet/score data.** Race conditions are blocking issues.
4. **Stop and ask before:** modifying the Prisma schema, changing auth flow, or touching the Pyodide worker.
5. **One step at a time.** If a task spec lists multiple steps, do step 1, ask the user to verify, then continue.
6. **Commit between steps.** Each step is independently verifiable and rollback-able.

## Where to look

| Need to know about... | Read this |
|---|---|
| System overview | `docs/ARCHITECTURE.md` |
| Code style & patterns | `docs/CONVENTIONS.md` |
| Database schema | `docs/SCHEMA.md` |
| Curriculum design | `docs/CURRICULUM.md` |
| Lesson format | `docs/LESSON_STRUCTURE.md` |
| Current task | `docs/waves/` (latest wave) |
| Content templates | `templates/` |

## Current focus

**Wave 1 — Module Restructure** (see `docs/waves/`).
Adding a Learning Modules system to the existing MVP. Restructuring flat problem list into 12 modules with lessons per module.
