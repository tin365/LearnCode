# Architecture

## System Overview

LearnCode is a 3-tier system:

```
┌───────────────────────────────────────────────┐
│  CLIENT (React, browser or Tauri later)        │
│                                                │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ Sidebar  │  │ Learning │  │ Code Panel  │  │
│  │ (modules)│  │ Panel    │  │ (Monaco +   │  │
│  │          │  │ (tabs)   │  │  Terminal)  │  │
│  └──────────┘  └──────────┘  └─────────────┘  │
│                                                │
│  Pyodide Web Worker (Python execution)        │
└────────────────────┬───────────────────────────┘
                     │ HTTPS / JWT
┌────────────────────▼───────────────────────────┐
│  API (Fastify on Node.js)                      │
│  Routes: /auth /problems /progress /modules    │
│          /lessons                              │
└────────────────────┬───────────────────────────┘
                     │ Prisma
┌────────────────────▼───────────────────────────┐
│  PostgreSQL                                    │
└────────────────────────────────────────────────┘
```

## Key design decisions

### 1. Code runs client-side (Pyodide)
Python executes in the user's browser via WebAssembly. Zero server cost for execution.
Server-side test running only happens on **Submit**, not **Run**, to keep hidden test cases secret.

### 2. Two-tier evaluation
- **Tier 1:** Local unit testing in Pyodide (free, fast, runs on every Run)
- **Tier 2:** Server-side run against hidden test cases (only on Submit)

### 3. Sequential unlocking
- Module N+1 unlocks after all problems in Module N pass
- Within a module, problems unlock sequentially
- Module 0 (concepts only) is always unlocked

### 4. Three-panel workspace
- Left: collapsible module tree + user identity
- Middle: tabbed (Learn / Problem / Hints)
- Right: Monaco editor + terminal output

## What this is NOT (yet)

- No Tauri desktop app (Phase 6+)
- No multi-language support (Python only for now)
- No AI hints, AI review, or any LLM calls (Phase 4+)
- No social features, leaderboards, or streaks (Phase 3+)
- No payment / premium tier (Phase 8+)
- No mobile responsive layout (desktop-first)

## Where complexity lives

- **Sidebar:** Module tree with lock states + progress per problem
- **Test runner (server):** Evaluates user code against hidden tests safely
- **Lesson rendering:** 6-section structured layout with embedded "Try It" exercises
- **Pyodide loading:** Cold-start UX, must handle the 4–6 second initial load
- **Score calculation:** -10 per hint used, floor at 70 if all hints used
