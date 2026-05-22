/**
 * Wave — Rust Module 5 "Making Decisions"
 *
 * Adds the Rust M5 lesson plus 6 problems.
 *
 * Run:  pnpm tsx prisma/seed-rust-m5.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'rust';
const MODULE_ORDER_INDEX = 305; // Rust Base (300) + Module 5
const MODULE = {
  title: 'Making Decisions',
  description: 'Use if/else to branch your code based on conditions.',
  estimatedMinutes: 30,
  isFoundational: false,
};

// ---------------------------------------------------------------------------
// Lesson
// ---------------------------------------------------------------------------

interface SectionInput {
  orderIndex: number;
  type: SectionType;
  title: string | null;
  content: string;
  code: string | null;
}

const LESSON = {
  title: 'Control Flow',
  estimatedMinutes: 15,
  concepts: ['if expressions', 'comparison operators', 'boolean logic'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'The Fork in the Road',
      content: `A smart program needs to make choices. Should the app let the user log in? Is this number even or odd? Did the player win the game?

In programming, we call this **conditional logic**. It's like a fork in the road: if a certain condition is true, the program takes one path; if it's false, it takes another. This is the heart of making "intelligent" software.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Everything is an Expression',
      content: `In Rust, we use **if statements** to check conditions. A condition must result in a \`bool\` (\`true\` or \`false\`).

One unique thing about Rust: \`if\` is an **expression**. This means you can use it to return a value directly!

Comparison operators:
- **\`==\`**: Equal to
- **\`!=\`**: Not equal to
- **\`>\` / \`<\`**: Greater / Less than
- **\`>=\` / \`<=\`**: Greater / Less than or equal to

Unlike some languages, Rust does **not** allow "truthy" values. You cannot use a number where a boolean is expected. It must be a real \`bool\`.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'The syntax for making decisions in Rust:',
      code: `let number = 5;

if number > 0 {
    println!("Positive");
} else if number < 0 {
    println!("Negative");
} else {
    println!("Zero");
}

// Using 'if' as an expression to set a variable
let msg = if number % 2 == 0 { "even" } else { "odd" };`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Logical Operators',
      content: `Sometimes you need to check more than one thing at once. We use **logical operators** to combine conditions:

- **\`&&\` (AND)**: True only if *both* are true.
- **\`||\` (OR)**: True if *at least one* is true.
- **\`!\` (NOT)**: Reverses the condition.

**Example:** A program that checks if someone can ride a roller coaster (must be 48 inches tall AND have a ticket).

\`\`\`rust
fn can_ride(height: i32, has_ticket: bool) -> bool {
    if height >= 48 && has_ticket {
        true
    } else {
        false
    }
}
\`\`\`

Because \`if\` returns a value, we don't even need the \`return\` keyword here — the last line of each block is what the function hands back!`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Even or Odd',
      content: `Complete the function \`is_even\` so that it returns \`true\` if the number is even, and \`false\` if it is odd.`,
      code: `fn is_even(n: i32) -> bool {
    // TODO: Return true if n % 2 is 0
    false
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Forgetting that \`if\` needs a \`bool\`.** In JavaScript, you might write \`if (n)\`. In Rust, you **must** write \`if n != 0\`.
- ❌ **Using \`=\` when you meant \`==\`.** \`=\` sets a value; \`==\` compares them.
- ❌ **Mismatching types in an \`if\` expression.** If your \`if\` block returns a string, your \`else\` block **must** also return a string.
- ❌ **Forgetting curly braces.** Rust requires \`{ }\` around every block, even if it's only one line.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const PROBLEMS: ProblemInput[] = [
  // -------- M5.1 ----------
  {
    title: 'Rust: Even or Odd',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Even or Odd

Complete the function \`is_even\` that takes an integer and returns \`true\` if it is even, and \`false\` if it is odd.

> **Tip:** Use the modulo operator \`%\`. If \`n % 2 == 0\`, it's even.
`.trim(),
    starterCode: `fn is_even(n: i32) -> bool {
    // TODO: Return true if even
    false
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `n % 2 == 0`.' },
      { orderIndex: 2, content: 'You can return the result of that expression directly.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn is_even(n: i32) -> bool {\n    n % 2 == 0\n}\n```' },
    ],
    testCases: [
      { inputData: 'is_even(4)', expected: 'true', isHidden: false },
      { inputData: 'is_even(7)', expected: 'false', isHidden: true },
    ],
  },

  // -------- M5.2 ----------
  {
    title: 'Rust: Sign Checker',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Sign Checker

Complete the function \`check_sign\` that returns:
- \`"positive"\` if > 0
- \`"negative"\` if < 0
- \`"zero"\` if 0
`.trim(),
    starterCode: `fn check_sign(n: i32) -> String {
    // TODO: Use if/else if/else
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `if n > 0 { ... } else if n < 0 { ... }`.' },
      { orderIndex: 2, content: 'Return `"positive".to_string()`, etc.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn check_sign(n: i32) -> String {\n    if n > 0 {\n        "positive".to_string()\n    } else if n < 0 {\n        "negative".to_string()\n    } else {\n        "zero".to_string()\n    }\n}\n```' },
    ],
    testCases: [
      { inputData: 'check_sign(5)', expected: '"positive"', isHidden: false },
      { inputData: 'check_sign(-3)', expected: '"negative"', isHidden: true },
      { inputData: 'check_sign(0)', expected: '"zero"', isHidden: true },
    ],
  },

  // -------- M5.3 ----------
  {
    title: 'Rust: Larger of Two',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Larger of Two

Complete the function \`max\` that takes two integers and returns the larger one.
`.trim(),
    starterCode: `fn max(a: i32, b: i32) -> i32 {
    // TODO: Return larger number
    0
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `if a > b { a } else { b }`.' },
      { orderIndex: 2, content: 'No semicolon on the values in the if/else blocks means they are returned.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn max(a: i32, b: i32) -> i32 {\n    if a > b { a } else { b }\n}\n```' },
    ],
    testCases: [
      { inputData: 'max(10, 20)', expected: '20', isHidden: false },
      { inputData: 'max(50, 5)', expected: '50', isHidden: true },
    ],
  },

  // -------- M5.4 ----------
  {
    title: 'Rust: Grade Calculator',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Grade Calculator

Complete the function \`get_grade\` that returns a letter grade:
- 90+: \`"A"\`
- 80-89: \`"B"\`
- 70-79: \`"C"\`
- 60-69: \`"D"\`
- < 60: \`"F"\`
`.trim(),
    starterCode: `fn get_grade(score: i32) -> String {
    // TODO: Return A, B, C, D, or F
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a chain of `else if` statements.' },
      { orderIndex: 2, content: 'Start from 90 and work down.' },
      { orderIndex: 3, content: 'Example: `if score >= 90 { "A".to_string() } else if ...`' },
    ],
    testCases: [
      { inputData: 'get_grade(95)', expected: '"A"', isHidden: false },
      { inputData: 'get_grade(82)', expected: '"B"', isHidden: true },
      { inputData: 'get_grade(45)', expected: '"F"', isHidden: true },
    ],
  },

  // -------- M5.5 ----------
  {
    title: 'Rust: Leap Year',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Leap Year Checker

Complete the function \`is_leap_year\` that returns \`true\` if a year is a leap year.

Rules:
1. Divisible by 4.
2. BUT if divisible by 100, must also be divisible by 400.
`.trim(),
    starterCode: `fn is_leap_year(year: i32) -> bool {
    // TODO: Implement logic
    false
}
`,
    hints: [
      { orderIndex: 1, content: 'Check `year % 4 == 0` first.' },
      { orderIndex: 2, content: 'Use `&&` (and) and `||` (or) to combine rules.' },
      { orderIndex: 3, content: 'Logic: `(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)`' },
    ],
    testCases: [
      { inputData: 'is_leap_year(2024)', expected: 'true', isHidden: false },
      { inputData: 'is_leap_year(1900)', expected: 'false', isHidden: true },
      { inputData: 'is_leap_year(2000)', expected: 'true', isHidden: true },
    ],
  },

  // -------- M5.6 ----------
  {
    title: 'Rust: Simple Login',
    orderIndex: 6,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Simple Login

Complete the function \`can_login\` that returns \`true\` if \`user\` is "admin" AND \`pass\` is "secret123".
`.trim(),
    starterCode: `fn can_login(user: &str, pass: &str) -> bool {
    // TODO: Check user and pass
    false
}
`,
    hints: [
      { orderIndex: 1, content: 'Compare strings using `==`: `user == "admin"`.' },
      { orderIndex: 2, content: 'Use `&&` to require both conditions.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn can_login(user: &str, pass: &str) -> bool {\n    user == "admin" && pass == "secret123"\n}\n```' },
    ],
    testCases: [
      { inputData: 'can_login("admin", "secret123")', expected: 'true', isHidden: false },
      { inputData: 'can_login("admin", "wrong")', expected: 'false', isHidden: true },
    ],
  },
];

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function upsertModule(): Promise<number> {
  const existing = await prisma.module.findUnique({ where: { orderIndex: MODULE_ORDER_INDEX } });
  if (existing) {
    await prisma.module.update({
      where: { id: existing.id },
      data: { ...MODULE, language: LANGUAGE },
    });
    console.log(`↻ Updated ${LANGUAGE} M${MODULE_ORDER_INDEX}: ${MODULE.title}`);
    return existing.id;
  }
  const created = await prisma.module.create({
    data: { ...MODULE, language: LANGUAGE, orderIndex: MODULE_ORDER_INDEX },
  });
  console.log(`+ Seeded ${LANGUAGE} M${MODULE_ORDER_INDEX}: ${MODULE.title}`);
  return created.id;
}

async function upsertLesson(moduleId: number) {
  const existing = await prisma.lesson.findUnique({ where: { moduleId } });
  if (existing) {
    await prisma.lessonSection.deleteMany({ where: { lessonId: existing.id } });
    await prisma.lesson.update({
      where: { id: existing.id },
      data: {
        title: LESSON.title,
        estimatedMinutes: LESSON.estimatedMinutes,
        concepts: LESSON.concepts,
        sections: { create: LESSON.sections },
      },
    });
    console.log(`↻ Updated lesson: ${LESSON.title}`);
  } else {
    await prisma.lesson.create({
      data: { moduleId, ...LESSON, sections: { create: LESSON.sections } },
    });
    console.log(`+ Seeded lesson: ${LESSON.title}`);
  }
}

async function upsertProblems(moduleId: number) {
  for (const p of PROBLEMS) {
    const existing = await prisma.problem.findFirst({ where: { title: p.title } });
    if (existing) {
      console.log(`= Problem already exists: ${p.title} — skipping`);
      continue;
    }
    const created = await prisma.problem.create({
      data: {
        title: p.title,
        description: p.description,
        starterCode: p.starterCode,
        difficulty: p.difficulty,
        type: p.type,
        moduleId,
        orderIndex: p.orderIndex,
        hints: { create: p.hints },
        testCases: { create: p.testCases },
      },
      select: { id: true },
    });
    console.log(
      `+ Seeded ${p.title} (id=${created.id}, ${p.hints.length} hints, ${p.testCases.length} tests)`,
    );
  }
}

async function main() {
  const moduleId = await upsertModule();
  await upsertLesson(moduleId);
  await upsertProblems(moduleId);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
