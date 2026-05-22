/**
 * Wave — Rust Module 2 "Variables & Data Types"
 *
 * Adds the Rust M2 lesson plus 6 problems.
 *
 * Run:  pnpm tsx prisma/seed-rust-m2.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'rust';
const MODULE_ORDER_INDEX = 302; // Rust Base (300) + Module 2
const MODULE = {
  title: 'Variables & Data Types',
  description: 'Store values, work with numbers, text, and booleans.',
  estimatedMinutes: 25,
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
  title: 'Variables and Types',
  estimatedMinutes: 14,
  concepts: ['let', 'mut', 'i32', 'f64', 'bool', 'String'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Labeling Your Logic',
      content: `Imagine a recipe that says "add 2, then add 2" without telling you *what* you're adding. It would be impossible to follow.

**Variables** let you give names to your data. Instead of raw numbers, you reason about \`price\`, \`age\`, or \`user_name\`. This makes your code a story that others (and future-you) can read and understand.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Immutable by Default',
      content: `In Rust, variables are **immutable** by default. Once you give a variable a value, you can't change it. This sounds annoying, but it's a huge safety feature!

If you *know* you need to change a value later, you must explicitly say so with the **\`mut\`** keyword.

Rust also needs to know the **type** of your data. The common ones:
- **\`i32\`**: Integer (whole number like \`25\`).
- **\`f64\`**: Float (decimal like \`9.99\`).
- **\`bool\`**: Boolean (\`true\` or \`false\`).
- **\`String\`**: Text data.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Creating variables and common types:',
      code: `// Immutable (cannot change)
let name = "Alice";

// Mutable (can change)
let mut age = 25;
age = 26; // OK!

// Explicit types
let score: i32 = 100;
let price: f64 = 9.99;
let is_ready: bool = true;`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'A Tiny Calculation',
      content: `**Example:** Read values into variables and perform math.

\`\`\`rust
let price = 9.99;
let quantity = 3.0; // Floats must match floats!
let tax_rate = 0.10;

let subtotal = price * quantity;
let total = subtotal + (subtotal * tax_rate);
println!("Total: {}", total);
\`\`\`

Rust is very strict: you cannot multiply an \`i32\` (integer) by an \`f64\` (float). You must convert them or make sure they are both the same type from the start.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Two Variables',
      content: `Create two variables: \`name\` set to a string and \`age\` set to a number. Have the function return a sentence like \`"Alice is 25"\`.`,
      code: `fn about_me() -> String {
    let name = "Alice";
    let age = 25;
    
    // TODO: Return a formatted string
    String::new()
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Trying to change an immutable variable.** If you don't use \`mut\`, Rust will error if you try to re-assign a value.
- ❌ **Mixing types in math.** You can't do \`5 + 2.0\`. One is an integer, one is a float. Rust won't guess which one you want.
- ❌ **Forgetting double quotes.** \`let s = 'hello';\` is an error because single quotes are for single characters (char), not strings.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const PROBLEMS: ProblemInput[] = [
  // -------- M2.1 ----------
  {
    title: 'Rust: Profile Card',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Profile Card

Complete the function \`profile\` that takes a \`name\` (&str) and \`age\` (i32) and returns a two-line string:

\`\`\`
Name: <name>
Age: <age>
\`\`\`

> **Tip:** Use the \`format!\` macro. Use \`\\n\` for the newline.
`.trim(),
    starterCode: `fn profile(name: &str, age: i32) -> String {
    // TODO: Return the two-line string
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'The `format!` macro works like `println!` but returns a String.' },
      { orderIndex: 2, content: 'Try: `format!("Name: {}\\nAge: {}", name, age)`' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn profile(name: &str, age: i32) -> String {\n    format!("Name: {}\\nAge: {}", name, age)\n}\n```' },
    ],
    testCases: [
      { inputData: 'profile("Alice", 25)', expected: '"Name: Alice\\nAge: 25"', isHidden: false },
      { inputData: 'profile("Bob", 40)', expected: '"Name: Bob\\nAge: 40"', isHidden: true },
    ],
  },

  // -------- M2.2 ----------
  {
    title: 'Rust: Years to Days',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Years to Days

Complete the function \`to_days\` that takes an \`i32\` representing years and returns the equivalent number of days (assume 365 days per year).
`.trim(),
    starterCode: `fn to_days(years: i32) -> i32 {
    // TODO: Multiply by 365 and return
    0
}
`,
    hints: [
      { orderIndex: 1, content: 'Multiplication uses the `*` operator.' },
      { orderIndex: 2, content: 'Just return `years * 365`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn to_days(years: i32) -> i32 {\n    years * 365\n}\n```' },
    ],
    testCases: [
      { inputData: 'to_days(1)', expected: '365', isHidden: false },
      { inputData: 'to_days(10)', expected: '3650', isHidden: true },
    ],
  },

  // -------- M2.3 ----------
  {
    title: 'Rust: Rectangle Area',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Rectangle Area

Complete the function \`area\` that takes \`width\` and \`height\` (both \`f64\`) and returns the area.
`.trim(),
    starterCode: `fn area(width: f64, height: f64) -> f64 {
    // TODO: Return width * height
    0.0
}
`,
    hints: [
      { orderIndex: 1, content: 'Multiply the two parameters.' },
      { orderIndex: 2, content: 'Use the `*` operator.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn area(width: f64, height: f64) -> f64 {\n    width * height\n}\n```' },
    ],
    testCases: [
      { inputData: 'area(3.0, 4.0)', expected: '12.0', isHidden: false },
      { inputData: 'area(2.5, 4.0)', expected: '10.0', isHidden: true },
    ],
  },

  // -------- M2.4 ----------
  {
    title: 'Rust: Swap Values',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Swap Values

Complete the function \`swap\` that takes two integers and returns them swapped as a **tuple**.

### Example
\`\`\`rust
swap(1, 2) // (2, 1)
\`\`\`

> **Tip:** A tuple in Rust is written with parentheses: \`(value1, value2)\`.
`.trim(),
    starterCode: `fn swap(a: i32, b: i32) -> (i32, i32) {
    // TODO: Return (b, a)
    (0, 0)
}
`,
    hints: [
      { orderIndex: 1, content: 'You can just list the values in reverse order inside parentheses.' },
      { orderIndex: 2, content: 'The function should return `(b, a)`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn swap(a: i32, b: i32) -> (i32, i32) {\n    (b, a)\n}\n```' },
    ],
    testCases: [
      { inputData: 'swap(1, 2)', expected: '(2, 1)', isHidden: false },
      { inputData: 'swap(10, 20)', expected: '(20, 10)', isHidden: true },
    ],
  },

  // -------- M2.5 ----------
  {
    title: 'Rust: Temp Converter',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Temp Converter (Celsius to Fahrenheit)

Complete the function \`c_to_f\` that takes a temperature in Celsius (\`f64\`) and returns Fahrenheit.

### Formula
\`F = C * 9.0 / 5.0 + 32.0\`
`.trim(),
    starterCode: `fn c_to_f(c: f64) -> f64 {
    // TODO: Apply formula
    0.0
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the formula: `c * 9.0 / 5.0 + 32.0`.' },
      { orderIndex: 2, content: 'Make sure all your numbers have a decimal point (like 9.0) since `c` is a float.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn c_to_f(c: f64) -> f64 {\n    c * 9.0 / 5.0 + 32.0\n}\n```' },
    ],
    testCases: [
      { inputData: 'c_to_f(0.0)', expected: '32.0', isHidden: false },
      { inputData: 'c_to_f(100.0)', expected: '212.0', isHidden: true },
      { inputData: 'c_to_f(37.0)', expected: '98.6', isHidden: true },
    ],
  },

  // -------- M2.6 ----------
  {
    title: 'Rust: Is Positive',
    orderIndex: 6,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Is Positive

Complete the function \`is_positive\` that takes an \`i32\` and returns \`true\` if it is greater than 0, and \`false\` otherwise.
`.trim(),
    starterCode: `fn is_positive(n: i32) -> bool {
    // TODO: Return n > 0
    false
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the comparison operator `> `.' },
      { orderIndex: 2, content: 'Just return the result of `n > 0`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn is_positive(n: i32) -> bool {\n    n > 0\n}\n```' },
    ],
    testCases: [
      { inputData: 'is_positive(5)', expected: 'true', isHidden: false },
      { inputData: 'is_positive(-3)', expected: 'false', isHidden: true },
      { inputData: 'is_positive(0)', expected: 'false', isHidden: true },
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
