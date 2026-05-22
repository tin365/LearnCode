# Step 7 — Write Lesson Content for Existing Modules

**Goal:** Author the lesson content for the 5 modules where existing problems already live.

**Estimated time:** 2–3 hours (writing-heavy)

**Prerequisite:** Steps 1–6 complete.

## Scope

In Wave 1, write lessons for **5 modules** that already have existing problems migrated into them:

```
✅ Module 5  Making Decisions          (existing: Even or Odd)
✅ Module 6  Loops                     (existing: FizzBuzz)
✅ Module 7  Lists                     (existing: Find Largest, Deduplication)
✅ Module 8  String Operations         (existing: Reverse, Vowels, Palindrome)
✅ Module 10 Functions (Going Deeper)  (existing: Sum, Fibonacci)
```

Wave 2 will add lessons + problems for the remaining 6 modules (M1, M2, M3, M4, M9, M11).

## How to write each lesson

Follow `docs/LESSON_STRUCTURE.md` exactly. Each lesson has 6 sections:

```
1. why_you_need_this       (2-4 sentence motivation)
2. the_basics              (1-3 paragraphs, plain language)
3. syntax_reference        (code pattern with caption)
4. worked_example          (1-3 annotated examples)
5. try_it_yourself         (small interactive exercise)
6. common_mistakes         (2-4 mistakes beginners hit)
```

Use `templates/content-templates.md` for the YAML format.

## Output format

For each lesson, output a single TypeScript object with this shape. Stick to this exact shape so the seed script can insert them automatically:

```typescript
{
  moduleOrderIndex: 5,   // which module this belongs to
  title: 'Making Decisions',
  estimatedMinutes: 12,
  concepts: ['if statements', 'comparison', 'boolean logic'],
  sections: [
    {
      orderIndex: 1,
      type: 'why_you_need_this',
      title: 'Why Branch Your Code?',
      content: 'Markdown content here...',
      code: null,
    },
    {
      orderIndex: 2,
      type: 'the_basics',
      title: 'If/Else in Plain Language',
      content: 'Markdown content here...',
      code: null,
    },
    {
      orderIndex: 3,
      type: 'syntax_reference',
      title: null,
      content: 'The basic shape of an if statement:',
      code: 'if condition:\n    do_something()\nelse:\n    do_something_else()',
    },
    // ... etc
  ],
}
```

## Lesson topics per module (in order)

### M5 — Making Decisions
- **why_you_need_this:** Programs need to react differently to different inputs
- **the_basics:** if checks a condition (True/False). else runs when the condition is False. elif chains more checks
- **syntax_reference:** Standard if/elif/else block, comparison operators (`==`, `!=`, `>`, `<`, `>=`, `<=`)
- **worked_example:** Age-based access check; grade classifier
- **try_it_yourself:** Write an if/else that checks if a number is positive or negative
- **common_mistakes:** `=` vs `==`, missing colon, indentation errors

### M6 — Loops
- **why_you_need_this:** Stop repeating yourself; let the computer do the boring parts
- **the_basics:** A for loop runs a block once per item in a sequence. A while loop runs while a condition is True
- **syntax_reference:** `for x in range(n):`, `while condition:`, `break`, `continue`
- **worked_example:** Counting 1 to 10; summing a list; while loop with break
- **try_it_yourself:** Print numbers 1 to 5 using a for loop
- **common_mistakes:** Off-by-one with range(), infinite while loops, modifying lists during iteration

### M7 — Lists
- **why_you_need_this:** Need to hold many values (shopping list, scores, names) — variables can hold one value, lists hold many
- **the_basics:** Lists are ordered collections. Index from 0. Can hold any type. Iterable with for
- **syntax_reference:** `[1, 2, 3]`, `lst[0]`, `lst[-1]`, `lst.append(x)`, `len(lst)`, `lst[1:3]`
- **worked_example:** Sum a list; find max manually vs with max(); building a list with append
- **try_it_yourself:** Create a list of 3 numbers and print their sum
- **common_mistakes:** Index out of range, forgetting 0-indexing, modifying while iterating

### M8 — String Operations
- **why_you_need_this:** Real-world text needs cleaning, searching, transforming
- **the_basics:** Strings are sequences of characters. They support indexing and slicing like lists, but they're immutable
- **syntax_reference:** `s[0]`, `s[::-1]`, `s.lower()`, `s.replace(a, b)`, `s in t`, `s.split()`
- **worked_example:** Reverse with slicing, lowercase + replace chains, "in" keyword for membership
- **try_it_yourself:** Reverse the string "Python" using slice notation
- **common_mistakes:** Forgetting strings are immutable (methods return new strings), case sensitivity, slice indices

### M10 — Functions (Going Deeper)
- **why_you_need_this:** Functions are how you reuse logic and organize a program
- **the_basics:** A function bundles instructions under a name. Parameters are inputs. return sends a value back
- **syntax_reference:** `def name(a, b):`, default args `def greet(name="World"):`, returning tuples `return a, b`
- **worked_example:** Calculator function with operation parameter; multiple return values
- **try_it_yourself:** Write a function that takes a name and returns "Hello, <name>!"
- **common_mistakes:** Forgetting to return, mutating default arguments, scope confusion

## Suggested approach for the agent

For each lesson:

1. Draft section by section, keeping prose short and conversational
2. Code examples must be **runnable** Python (test them in a Pyodide instance)
3. Try-It code should be 3–6 lines max, easy to modify
4. Common mistakes should be **real** beginner errors, not made-up ones

## Seed script

After writing all 5 lessons, create `prisma/seed-lessons-wave1.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const LESSONS = [
  /* The 5 lesson objects from above */
];

async function main() {
  for (const lessonData of LESSONS) {
    const module = await prisma.module.findUnique({
      where: { orderIndex: lessonData.moduleOrderIndex },
    });
    if (!module) {
      console.error(`Module ${lessonData.moduleOrderIndex} not found`);
      continue;
    }
    
    // Upsert lesson
    const existingLesson = await prisma.lesson.findUnique({
      where: { moduleId: module.id },
    });
    
    if (existingLesson) {
      await prisma.lessonSection.deleteMany({ where: { lessonId: existingLesson.id } });
      await prisma.lesson.update({
        where: { id: existingLesson.id },
        data: {
          title: lessonData.title,
          estimatedMinutes: lessonData.estimatedMinutes,
          concepts: lessonData.concepts,
          sections: { create: lessonData.sections },
        },
      });
    } else {
      await prisma.lesson.create({
        data: {
          moduleId: module.id,
          title: lessonData.title,
          estimatedMinutes: lessonData.estimatedMinutes,
          concepts: lessonData.concepts,
          sections: { create: lessonData.sections },
        },
      });
    }
    
    console.log(`✓ Lesson for Module ${lessonData.moduleOrderIndex}: ${lessonData.title}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
```

Also create the Module 0 lesson (from step 6) following the same pattern.

Run it:

```bash
pnpm tsx prisma/seed-lessons-wave1.ts
```

## Verification

- [ ] Each of M5, M6, M7, M8, M10 shows a lesson when opened
- [ ] All 6 sections render correctly per lesson
- [ ] Try-It code runs in Pyodide without errors
- [ ] Module 0 lesson also exists and renders
- [ ] Existing problems still work — lesson is additive, not destructive

## Wave 1 — DONE

After step 7, you have:

```
✅ New schema: Modules, Lessons, LessonSections, LessonProgress
✅ All 10 existing problems organized into 5 modules
✅ Collapsible module sidebar
✅ Tabbed middle panel (Learn / Problem / Hints)
✅ Lesson rendering with 6 sections + Try-It interactive
✅ Module 0 reading view
✅ Lesson content for 5 modules + Module 0

Total: ~30 new problems' worth of pedagogy without writing any new problems.
```

Next stop: Wave 2 — fill in Modules 1, 2, 3, 4, 9, 11 with new problems and lessons (~30 new problems).
