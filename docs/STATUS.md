# LearnCode — Project Status

Snapshot of what's built, what's running, and what's still on the table.

## Status at a glance

```
MVP foundation         ✅ shipped (pre-existing)
Wave 1 — restructure   ✅ Steps 1–7 complete
Wave 2 — new content   ✅ M1, M2, M3, M4, M9, M11
Wave 3 — fill gaps     ✅ M5, M6, M7, M8, M10
Admin unlock flag      ✅ shipped
Curriculum coverage    ✅ 60 / 60 problems (CURRICULUM.md target)
```

The app is end-to-end usable: sign up → read M0 → solve Hello World → progress through the full 11-module learning path.

---

## What we have

### Schema (PostgreSQL via Prisma)

| Model | Purpose |
|---|---|
| `User` | id, email, passwordHash, isAdmin flag |
| `Module` | 12 rows, M0–M11, with `isFoundational` for M0 |
| `Lesson` | one-to-one with Module |
| `LessonSection` | 6 typed sections per lesson (why → basics → syntax → example → try-it → mistakes) |
| `LessonProgress` | per-user lesson-read tracking |
| `Problem` | now scoped to a Module via `moduleId`, with `ProblemType` (STANDARD / DEBUG / CONCEPT_ONLY) |
| `TestCase` | per-problem, with `isHidden` flag — counts exposed via API, content never is |
| `Hint` | up to 3 progressive hints per problem |
| `Progress` | per-user problem progress (`passed`, `score`, `hintsUsed`) |

4 migrations applied; schema is stable.

### Backend (Fastify + Prisma)

Routes shipped:

```
/auth/register   /auth/login   /auth/logout
/problems        /problems/:id        /problems/:id/hints-state
/progress        /progress/submit     /progress/hint
/modules         /modules/:id/lesson  /modules/:id/lesson/complete
/health
```

- JWT auth (`@fastify/jwt`); `isAdmin` baked into payload.
- `req.user` is `{ userId, email, isAdmin }`.
- `/modules` computes unlock state server-side; admin bypasses it.
- Test runner (`apps/api/src/lib/testRunner.ts`) shells out to `python3` and evaluates `testCase.inputData` as an expression on the user's submitted code, JSON-comparing the result to `testCase.expected`.

### Frontend (React + Vite + Tailwind + shadcn/ui)

Pages:
- `/login`, `/register`
- `/dashboard` — sidebar + welcome + problem list
- `/workspace/:id` — 3-panel workspace (Sidebar / tabbed LearningPanel / CodePanel)
- `/module/:moduleId/lesson` — full-page single-panel reading view (M0 + lesson-only reads)

Key components:
- `CollapsibleModuleSidebar` — 12 module tree with per-problem lock chain; admin bypass.
- `LearningPanel` — tabs: **Learn** (LessonView), **Problem** (ProblemView), **Hints** (HintsView). Default tab logic from lesson-read state.
- `LessonView` — header, all sections, footer with mark-complete button.
- `SectionRenderer` — per-section-type icon + tone color, special handling for `try_it_yourself` and `syntax_reference`.
- `TryItExercise` — Monaco editor + Run/Reset using Pyodide (singleton worker via `lib/pyodide.ts`).
- `ProblemView` / `HintsView` — extracted from the original `LearningPanel`, self-fetch via React Query cache.
- `CodePanel` — Monaco editor + terminal output (untouched from MVP).

Auth state in Zustand (`authStore`), server state in TanStack Query v5.

### Curriculum (60 problems, 12 lessons)

| Module | Lesson? | Problems |
|---|---|---|
| M0 How Programming Works | ✅ | 0 (foundational, no problems by design) |
| M1 First Lines of Code | ✅ | 5 (Hello World + Greet + Three Lines + Escape Chars + Fix the Square) |
| M2 Variables & Data Types | ✅ | 6 (Profile + Years to Days + Rect Area + Swap + C→F + What Type) |
| M3 Strings in Depth | ✅ | 5 (Full Name + Build Sentence + Length + Shout + Clean Up) |
| M4 Getting Input from User | ✅ | 4 (Welcome + Add From Input + Square It + Tip Calculator) |
| M5 Making Decisions | ✅ | 6 (Even or Odd + Sign + Larger + Grade + Leap Year + Login) |
| M6 Loops | ✅ | 7 (FizzBuzz + 1–10 + Sum to N + Mult Table + Countdown + First Multiple + Until Quit) |
| M7 Lists | ✅ | 7 (Largest + Dedup + Sum + Count + Reverse + Average + Filter Evens) |
| M8 String Operations | ✅ | 5 (Reverse + Vowels + Palindrome + Count Words + Spaces→Underscores) |
| M9 Dictionaries & Tuples | ✅ | 5 (Contact Book + Letter Freq + Most Common + Invert + Group by First) |
| M10 Functions (Going Deeper) | ✅ | 5 (Sum Two + Fibonacci + Default Greeting + Min & Max + Calculator) |
| M11 Debugging & Reading Errors | ✅ | 5 DEBUG (NameError + TypeError + IndexError + IndentationError + Logic Bug) |

Every problem has 3 progressive hints and 4–9 test cases (one visible, the rest hidden). All ~250 test cases were pre-validated against reference Python solutions before seeding, so no expected-value typos slip through.

### Tooling and scripts

```
prisma/seed.ts                  original MVP problems (10)
prisma/seed-modules.ts          12 module rows
prisma/seed-module-zero.ts      M0 lesson (foundational reading)
prisma/seed-lessons-wave1.ts    M5/M6/M7/M8/M10 lessons (Step 7)
prisma/seed-wave2-m1.ts         M1 lesson + 4 problems
prisma/seed-wave2-m2.ts         M2 lesson + 6 problems
prisma/seed-wave2-m3.ts         M3 lesson + 5 problems
prisma/seed-wave2-m4.ts         M4 lesson + 4 problems
prisma/seed-wave2-m9.ts         M9 lesson + 5 problems
prisma/seed-wave2-m11.ts        M11 lesson + 5 DEBUG problems
prisma/seed-wave3-m5.ts         M5 +5 problems
prisma/seed-wave3-m6.ts         M6 +6 problems
prisma/seed-wave3-m7.ts         M7 +5 problems
prisma/seed-wave3-m8.ts         M8 +2 problems
prisma/seed-wave3-m10.ts        M10 +3 problems
prisma/set-admin.ts             toggle isAdmin by email (+ --revoke)
prisma/seed-test-lesson.ts      throwaway dev seed; kept as a template
```

Every Wave 2/3 seed is **idempotent** — lessons upsert and wipe-rewrite sections, problems skip-if-title-exists, so reruns are safe.

### Auth & admin

- JWT on every authenticated request.
- `set-admin.ts` toggles a per-user `isAdmin` boolean. Admin users get every module unlocked (sidebar + workspace), with real progress/score stats untouched.
- Currently granted: `mgtinsan465@gmail.com` (toggled via `pnpm tsx prisma/set-admin.ts <email>` / `--revoke`).
- Caveat: `isAdmin` rides in the JWT, so after toggling the user must log out and back in.

---

## What's not done

Nothing is *required* to call the curriculum done. Everything below is optional / a future wave.

### Content polish

- [ ] Playtest each module end-to-end as a real beginner; tighten wording where things feel rushed or jargon-heavy.
- [ ] Re-balance difficulty markers if any "easy" problem turns out to consistently need hints, or vice-versa.
- [ ] Swap problems that feel awkward in practice (e.g. if M2.4 Swap is too dry, replace with something more motivating).
- [ ] Add screenshots / diagrams to lesson content where pure markdown isn't enough (e.g. how indentation defines blocks).

### UX gaps

- [ ] **DEBUG-type indicator** in the sidebar so users know M11 problems ship intentionally broken (right now they look like any other problem and the "this is broken on purpose" reveal happens only inside the problem description).
- [ ] **Admin badge** somewhere visible (e.g. next to the user identity in the sidebar) so admin users can tell which mode they're in. Currently silent.
- [ ] **Dashboard problem list** still lists problems flat — the page predates Wave 1's module structure. Consider replacing with a "Resume where you left off" + "All modules" grid view that mirrors the sidebar tree.
- [ ] **Empty placeholder modules** (M2/M3/M4/M9/M11 before they were filled) no longer exist as a concept now that every module has content, but the unlock-chain "transparent placeholder" logic in `apps/api/src/routes/modules.ts` is still there for safety. Could be simplified.
- [ ] **Mobile responsive layout** — the architecture explicitly says desktop-first; nothing tested on small screens.

### Engineering

- [ ] **Tests.** `docs/CONVENTIONS.md` says Vitest + Playwright are coming "when tests come back" — they haven't. The test runner has one unit test (`testRunner.test.ts`); everything else is untested. At minimum:
  - Unit tests on the unlock-chain logic in `/modules`.
  - Integration test that submits a known-good solution for each of the 60 problems and confirms it passes.
  - E2E test for the sign-up → M0 → M1.1 happy path.
- [ ] **Pyodide concurrency.** Single worker; concurrent Run calls (main editor + Try-It at the same time) can cross-talk. Pre-existing limitation, not yet hit in practice.
- [ ] **Response envelope inconsistency.** `docs/CONVENTIONS.md` says success responses should be `{ data: <T> }`, but actual routes return bare values. Decide which is right and retrofit (currently bare is the de-facto standard).
- [ ] **TestCase return-type quirks.** `formatPythonValue` in the test runner doesn't stringify dict-shaped values usefully (we worked around it by testing dicts via key-access and `len()`); could be improved.

### Original "not yet" list (from `docs/ARCHITECTURE.md`)

The architecture doc lists what was deliberately *out of scope* at MVP time. None of these have moved:

- [ ] **Tauri desktop app** (Phase 6+)
- [ ] **Multi-language support** (Python only for now)
- [ ] **AI hints, AI review, any LLM calls** (Phase 4+)
- [ ] **Social features, leaderboards, streaks** (Phase 3+)
- [ ] **Payment / premium tier** (Phase 8+)

---

## Repo

- **GitHub:** https://github.com/tin365/LearnCode
- **Branch:** `main`
- **Latest commit at time of writing:** `8c3dd39` ("Wave 3 — fill remaining problems")
- **Run locally:** `pnpm install && pnpm dev`
