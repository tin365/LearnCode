# Step 2 — Data Migration

**Goal:** Create the 12 modules, assign existing problems to them, then enforce constraints.

**Estimated time:** 30 min

**Prerequisite:** Step 1 must be complete and verified.

## What to do

1. Create a one-time migration script at `prisma/migrations/data/seed-modules.ts`
2. Run it to populate modules and assign `moduleId` to existing problems
3. After verification, run a Prisma schema update to make `moduleId` NOT NULL
4. Update unique constraint on `Problem.orderIndex`

## Module seed data

Create these 12 modules with the exact `orderIndex` shown:

```typescript
const MODULES = [
  { orderIndex: 0,  title: 'How Programming Works',     description: 'A gentle intro to coding. No programming experience needed.', estimatedMinutes: 15, isFoundational: true  },
  { orderIndex: 1,  title: 'First Lines of Code',       description: 'Print things, write comments, run your first programs.',      estimatedMinutes: 20, isFoundational: false },
  { orderIndex: 2,  title: 'Variables & Data Types',    description: 'Store values, work with numbers, text, and booleans.',         estimatedMinutes: 25, isFoundational: false },
  { orderIndex: 3,  title: 'Strings in Depth',          description: 'Combine, format, and transform text.',                          estimatedMinutes: 25, isFoundational: false },
  { orderIndex: 4,  title: 'Getting Input from the User', description: 'Ask questions and react to answers.',                         estimatedMinutes: 20, isFoundational: false },
  { orderIndex: 5,  title: 'Making Decisions',          description: 'Use if/else to branch your code based on conditions.',          estimatedMinutes: 30, isFoundational: false },
  { orderIndex: 6,  title: 'Loops',                     description: 'Repeat actions with for and while loops.',                      estimatedMinutes: 35, isFoundational: false },
  { orderIndex: 7,  title: 'Lists',                     description: 'Store collections of values and operate on them.',              estimatedMinutes: 35, isFoundational: false },
  { orderIndex: 8,  title: 'String Operations',         description: 'Slice strings, search them, and manipulate them.',              estimatedMinutes: 30, isFoundational: false },
  { orderIndex: 9,  title: 'Dictionaries & Tuples',     description: 'Work with key-value data and fixed-size groups.',               estimatedMinutes: 30, isFoundational: false },
  { orderIndex: 10, title: 'Functions (Going Deeper)',  description: 'Default args, multiple return values, organizing code.',        estimatedMinutes: 30, isFoundational: false },
  { orderIndex: 11, title: 'Debugging & Reading Errors', description: 'Read error messages and fix broken code.',                      estimatedMinutes: 25, isFoundational: false },
];
```

## Existing problem → module mapping

Reassign existing 10 problems by their current title:

```typescript
const PROBLEM_TO_MODULE = {
  'Hello, World!':            { moduleOrderIndex: 1,  newOrderIndex: 1 },
  'Sum Two Numbers':          { moduleOrderIndex: 10, newOrderIndex: 1 },
  'Even or Odd':              { moduleOrderIndex: 5,  newOrderIndex: 1 },
  'FizzBuzz (1 to N)':        { moduleOrderIndex: 6,  newOrderIndex: 4 },
  'Find the Largest Number':  { moduleOrderIndex: 7,  newOrderIndex: 2 },
  'Reverse a String':         { moduleOrderIndex: 8,  newOrderIndex: 1 },
  'Count Vowels':             { moduleOrderIndex: 8,  newOrderIndex: 2 },
  'Fibonacci Sequence':       { moduleOrderIndex: 10, newOrderIndex: 4 },
  'Check if Palindrome':      { moduleOrderIndex: 8,  newOrderIndex: 3 },
  'List Deduplication':       { moduleOrderIndex: 7,  newOrderIndex: 5 },
};
```

## Script implementation

Create `prisma/migrations/data/seed-modules.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// (paste MODULES and PROBLEM_TO_MODULE here)

async function main() {
  console.log('Creating modules...');
  
  // 1. Create the 12 modules
  for (const m of MODULES) {
    await prisma.module.upsert({
      where: { orderIndex: m.orderIndex },
      update: m,
      create: m,
    });
  }
  
  // 2. Reassign existing problems
  console.log('Reassigning problems...');
  for (const [title, mapping] of Object.entries(PROBLEM_TO_MODULE)) {
    const module = await prisma.module.findUnique({
      where: { orderIndex: mapping.moduleOrderIndex },
    });
    if (!module) {
      console.error(`Module ${mapping.moduleOrderIndex} not found`);
      continue;
    }
    
    const updated = await prisma.problem.updateMany({
      where: { title },
      data: {
        moduleId: module.id,
        orderIndex: mapping.newOrderIndex,
      },
    });
    console.log(`  ${title}: ${updated.count} updated`);
  }
  
  // 3. Verify no problem is left unassigned
  const orphans = await prisma.problem.findMany({
    where: { moduleId: null },
    select: { id: true, title: true },
  });
  
  if (orphans.length > 0) {
    console.error('Orphan problems (no module):', orphans);
    throw new Error('Some problems were not assigned to modules');
  }
  
  console.log('Data migration complete.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
```

Run it:

```bash
pnpm tsx prisma/migrations/data/seed-modules.ts
```

## After successful data migration

Update `prisma/schema.prisma`:

```prisma
model Problem {
  // Change moduleId from Int? to Int (NOT NULL)
  moduleId Int  @map("module_id")
  
  // Change the relation from optional to required
  module Module @relation(fields: [moduleId], references: [id])
  
  // Remove the global unique constraint on orderIndex
  orderIndex Int @map("order_index")   // (no @unique)
  
  // Add composite unique
  @@unique([moduleId, orderIndex])
}
```

Run another migration:

```bash
pnpm prisma migrate dev --name enforce_module_required
```

## Verification

After both migrations:

- [ ] All 12 modules exist in DB
- [ ] All 10 existing problems have `module_id` set (none are NULL)
- [ ] Each problem's `(moduleId, orderIndex)` combination is unique
- [ ] Existing API routes still return problems correctly
- [ ] Frontend dashboard loads without errors (it may not show new structure yet — that's step 3)

## STOP

Do not proceed to step 3 until:
- Data migration script ran without errors
- All 12 modules visible in Prisma Studio
- All 10 existing problems have non-null module_id
