# Step 1 — Schema Migration

**Goal:** Add the new tables and enums for Modules & Lessons. No data migration in this step — just schema.

**Estimated time:** 15 min

## What to do

1. Open `prisma/schema.prisma`.
2. Add the new models and enums per `docs/SCHEMA.md`.
3. Add `moduleId` to `Problem` as **nullable for now** (so existing rows don't break).
4. Add `type ProblemType @default(STANDARD)` to `Problem`.
5. Do NOT yet drop the old `@unique` on `Problem.orderIndex`. We'll change that in step 2 after data migration.
6. Run `pnpm prisma migrate dev --name add_modules_and_lessons`.

## Exact additions

Add these to `prisma/schema.prisma` (do NOT remove existing models):

```prisma
model Module {
  id               Int       @id @default(autoincrement())
  title            String
  description      String
  orderIndex       Int       @unique @map("order_index")
  estimatedMinutes Int       @default(30) @map("estimated_minutes")
  language         String    @default("python")
  isFoundational   Boolean   @default(false) @map("is_foundational")
  lesson           Lesson?
  problems         Problem[]

  @@map("modules")
}

model Lesson {
  id               Int             @id @default(autoincrement())
  moduleId         Int             @unique @map("module_id")
  title            String
  estimatedMinutes Int             @default(5) @map("estimated_minutes")
  concepts         String[]
  module           Module          @relation(fields: [moduleId], references: [id])
  sections         LessonSection[]
  progress         LessonProgress[]

  @@map("lessons")
}

model LessonSection {
  id         Int         @id @default(autoincrement())
  lessonId   Int         @map("lesson_id")
  orderIndex Int         @map("order_index")
  type       SectionType
  title      String?
  content    String
  code       String?
  lesson     Lesson      @relation(fields: [lessonId], references: [id])

  @@unique([lessonId, orderIndex])
  @@map("lesson_sections")
}

model LessonProgress {
  id       Int      @id @default(autoincrement())
  userId   Int      @map("user_id")
  lessonId Int      @map("lesson_id")
  readAt   DateTime @default(now()) @map("read_at")
  user     User     @relation(fields: [userId], references: [id])
  lesson   Lesson   @relation(fields: [lessonId], references: [id])

  @@unique([userId, lessonId])
  @@map("lesson_progress")
}

enum ProblemType {
  STANDARD
  DEBUG
  CONCEPT_ONLY
}

enum SectionType {
  why_you_need_this
  the_basics
  syntax_reference
  worked_example
  try_it_yourself
  common_mistakes
}
```

## Modify existing `Problem` model

Add these two fields, do not remove anything:

```prisma
model Problem {
  // ... existing fields stay exactly as they are ...
  
  moduleId Int?         @map("module_id")           // NULLABLE for now
  type     ProblemType  @default(STANDARD)
  
  module   Module?      @relation(fields: [moduleId], references: [id])  // optional relation
}
```

## Modify existing `User` model

Add the relation field (no DB change, just for type completeness):

```prisma
model User {
  // ... existing fields stay exactly as they are ...
  
  lessonProgress LessonProgress[]
}
```

## Verification

After running the migration:

```bash
pnpm prisma migrate dev --name add_modules_and_lessons
pnpm prisma studio
```

Confirm in Prisma Studio:
- [ ] `modules` table exists, empty
- [ ] `lessons` table exists, empty
- [ ] `lesson_sections` table exists, empty
- [ ] `lesson_progress` table exists, empty
- [ ] `problems` table has new `module_id` (nullable) and `type` (default STANDARD) columns
- [ ] Existing 10 problems are still there, with `module_id = NULL` and `type = STANDARD`

## STOP

Do not proceed to step 2 until the user has verified the schema migration succeeded. Report back with:
- The migration filename Prisma generated
- A confirmation that all 4 new tables exist
- Whether existing problems still load via the API
