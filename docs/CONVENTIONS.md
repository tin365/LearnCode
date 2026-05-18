# Conventions

Rules to follow in every code change. These exist to keep the codebase consistent across multiple agent sessions.

## TypeScript

- **No `any`.** If a type is unknown, use `unknown` and narrow. Exception: third-party libs with no types.
- **Prefer types over interfaces** for data shapes. Use interfaces only for class contracts.
- **Shared types live in `packages/types/`.** Both `apps/web` and `apps/api` import from there.

## React

- **Functional components only.** No class components.
- **Co-locate component files:** `Button.tsx` + `Button.stories.tsx` (if applicable) in the same folder.
- **Custom hooks start with `use`.** Place in `apps/web/src/hooks/`.
- **No prop drilling beyond 2 levels.** Use Zustand store or context.
- **Default props via destructuring**, not `defaultProps`.

```tsx
// ✅ Good
function ProblemCard({ title, score = 0 }: ProblemCardProps) { ... }

// ❌ Bad
function ProblemCard(props: ProblemCardProps) {
  return <div>{props.title}</div>;
}
```

## Naming

```
Component files       PascalCase.tsx       (CodeEditor.tsx)
Hook files            useThing.ts          (useExecution.ts)
Util files            camelCase.ts         (formatScore.ts)
Constants             SCREAMING_SNAKE      (MAX_HINTS = 3)
DB tables             snake_case           (lesson_sections)
Prisma models         PascalCase           (LessonSection)
API routes            kebab-case           (/lesson-progress)
```

## API conventions

### Response shape

```typescript
// Success
{ data: <T> }

// Error
{ error: { code: string, message: string } }
```

### Status codes

```
200  Success with data
201  Resource created
204  Success, no body (e.g. logout)
400  Invalid input (Zod validation failed)
401  Not authenticated
403  Authenticated but forbidden
404  Resource not found
409  Conflict (e.g. email already exists)
500  Server error
```

### Auth

All routes except `/auth/register`, `/auth/login`, `/health` require JWT.
JWT is sent as `Authorization: Bearer <token>` header.
Decode middleware attaches `request.user` to every authenticated request.

## Database

- **Every model has `id` (autoincrement Int) and `createdAt` (DateTime).** Skip `createdAt` only if there's a strong reason.
- **Foreign keys are always `<name>Id`** (camelCase in Prisma, `<name>_id` in SQL via `@map`).
- **Use `@@unique` for composite unique constraints**, not application-level checks.
- **Wallet/score updates MUST use transactions:**

```typescript
await prisma.$transaction(async (tx) => {
  const wallet = await tx.wallet.findUnique({ where: { userId }, lock: true });
  if (wallet.tokens < cost) throw new Error('Insufficient tokens');
  await tx.wallet.update({ where: { userId }, data: { tokens: { decrement: cost } } });
});
```

## File organization

```
apps/web/src/
├── components/
│   ├── layout/          ← Sidebar, Workspace shell, AppShell
│   ├── editor/          ← Monaco + Terminal
│   ├── problems/        ← Problem-specific components
│   ├── lessons/         ← Lesson-specific components (NEW in Wave 1)
│   ├── modules/         ← Module-specific components (NEW in Wave 1)
│   └── ui/              ← shadcn/ui generated components
├── pages/               ← Route-level components
├── store/               ← Zustand stores
├── lib/                 ← API client, pyodide loader, utils
├── hooks/               ← Custom React hooks
└── workers/             ← Web Workers (pyodide.worker.ts)

apps/api/src/
├── routes/              ← One file per resource
├── plugins/             ← Fastify plugins (prisma, jwt, cors)
├── lib/                 ← Business logic (testRunner, scoring)
└── server.ts            ← Composition root
```

## Styling

- **Tailwind utility classes only.** No CSS modules, no styled-components, no inline `style` props (except for dynamic values like positions).
- **Use `cn()` from `lib/utils.ts`** to merge classes conditionally.
- **Color palette** uses Tailwind defaults: `slate` for grayscale, `blue` for primary, `emerald` for success, `red` for error, `amber` for warnings.

## Comments

Comment **why**, not **what**.

```typescript
// ❌ Bad — explains what's obvious from reading the code
// Loop through users
for (const user of users) { ... }

// ✅ Good — explains why
// Process users sequentially because Stripe rate-limits to 25 req/sec
for (const user of users) { ... }
```

## Testing

Not required for Wave 1 (move fast, validate first). When tests come back:
- Unit tests with Vitest
- Place next to source: `Foo.tsx` + `Foo.test.tsx`
- E2E tests with Playwright in `apps/web/e2e/`
