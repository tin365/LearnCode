# Database Schema

## Existing tables (from MVP)

```prisma
model User {
  id           Int        @id @default(autoincrement())
  email        String     @unique
  passwordHash String     @map("password_hash")
  createdAt    DateTime   @default(now()) @map("created_at")
  progress     Progress[]
  lessonProgress LessonProgress[]   // NEW
}

model Problem {
  id          Int         @id @default(autoincrement())
  title       String
  description String
  starterCode String      @map("starter_code")
  difficulty  Difficulty
  orderIndex  Int         @map("order_index")   // CHANGE: no longer globally unique
  
  // NEW fields:
  moduleId    Int         @map("module_id")
  type        ProblemType @default(STANDARD)
  
  module      Module      @relation(fields: [moduleId], references: [id])
  testCases   TestCase[]
  hints       Hint[]
  progress    Progress[]
  
  @@unique([moduleId, orderIndex])  // NEW: scoped uniqueness within module
}

model TestCase { ... unchanged ... }
model Hint     { ... unchanged ... }
model Progress { ... unchanged ... }

enum Difficulty { easy medium hard }
```

## New tables (Wave 1)

### Module — group of problems with one lesson

```prisma
model Module {
  id               Int       @id @default(autoincrement())
  title            String                                          // "First Lines of Code"
  description      String                                          // Short summary for sidebar
  orderIndex       Int       @unique @map("order_index")           // 0, 1, 2, ... 11
  estimatedMinutes Int       @default(30) @map("estimated_minutes")
  language         String    @default("python")
  isFoundational   Boolean   @default(false) @map("is_foundational")  // Module 0 = true
  
  lesson           Lesson?
  problems         Problem[]
  
  @@map("modules")
}
```

### Lesson — one per module

```prisma
model Lesson {
  id               Int             @id @default(autoincrement())
  moduleId         Int             @unique @map("module_id")
  title            String                                          // "What is Programming?"
  estimatedMinutes Int             @default(5) @map("estimated_minutes")
  concepts         String[]                                        // ["functions", "return"]
  
  module           Module          @relation(fields: [moduleId], references: [id])
  sections         LessonSection[]
  progress         LessonProgress[]
  
  @@map("lessons")
}
```

### LessonSection — structured pieces of a lesson

```prisma
model LessonSection {
  id         Int          @id @default(autoincrement())
  lessonId   Int          @map("lesson_id")
  orderIndex Int          @map("order_index")
  type       SectionType
  title      String?
  content    String                                                // Markdown body
  code       String?                                               // Runnable Python for code_example/try_it
  
  lesson     Lesson       @relation(fields: [lessonId], references: [id])
  
  @@unique([lessonId, orderIndex])
  @@map("lesson_sections")
}
```

### LessonProgress — track who has read what

```prisma
model LessonProgress {
  id        Int      @id @default(autoincrement())
  userId    Int      @map("user_id")
  lessonId  Int      @map("lesson_id")
  readAt    DateTime @default(now()) @map("read_at")
  
  user      User     @relation(fields: [userId], references: [id])
  lesson    Lesson   @relation(fields: [lessonId], references: [id])
  
  @@unique([userId, lessonId])
  @@map("lesson_progress")
}
```

## New enums

```prisma
enum ProblemType {
  STANDARD       // Write code from scratch (default — existing behavior)
  DEBUG          // Fix broken starter_code
  CONCEPT_ONLY   // No coding, lesson-only (Module 0)
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

## Migration order

Critical: this order avoids broken constraints during migration.

```
1. Add Module table
2. Add Lesson, LessonSection, LessonProgress tables
3. Add new enums (ProblemType, SectionType)
4. Add new columns to Problem (moduleId nullable initially, type with default)
5. Run data migration script — assigns moduleId to all existing problems
6. Make Problem.moduleId NOT NULL
7. Drop old unique constraint on Problem.orderIndex
8. Add new composite unique on (moduleId, orderIndex)
```

## What stays the same

- `User`, `TestCase`, `Hint`, `Progress` tables — no changes
- All existing API routes still work
- All existing seed data preserved (just reassigned to modules)
