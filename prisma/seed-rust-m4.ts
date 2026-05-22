/**
 * Wave — Rust Module 4 "Getting Input from the User"
 *
 * Adds the Rust M4 lesson plus 4 problems.
 * Note: Adapted to function parameters as input per the authoring brief.
 *
 * Run:  pnpm tsx prisma/seed-rust-m4.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'rust';
const MODULE_ORDER_INDEX = 304; // Rust Base (300) + Module 4
const MODULE = {
  title: 'Getting Input from the User',
  description: 'Learn how programs receive and react to data.',
  estimatedMinutes: 20,
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
  title: 'Reacting to Data',
  estimatedMinutes: 10,
  concepts: ['Parameters', 'Input types', 'Interactive programs'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'A Conversation with Code',
      content: `A program that only ever does the same thing is like a movie — you can watch it, but you can't change it. For a program to be useful, it needs to **react to data** from the outside world.

Whether it's a search query, a user's age, or a tap on a screen, "input" is what makes software interactive. In this module, you'll learn how to write code that takes different inputs and produces different results every time it runs.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Parameters as Input',
      content: `While real-world apps might get input from a keyboard, in programming logic, we represent that input using **parameters**.

Think of a function like a machine. You put something in (the parameters), the machine processes it, and something comes out (the return value).

\`\`\`
Input (Parameters)  ──→  [ YOUR CODE ]  ──→  Output (Return)
\`\`\`

In Rust, we define the type of input a function expects inside the parentheses: \`fn square(n: i32)\`. This tells Rust that the "input" to this function will always be a whole number.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Using parameters to represent user input:',
      code: `// This function "asks" for a name (&str input)
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

// This function "asks" for two numbers (i32 inputs)
fn add(a: i32, b: i32) -> i32 {
    a + b
}

// When the computer calls your code, it provides the "input":
let output = greet("Alice");
let sum = add(5, 10);`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'The Welcome Badge',
      content: `**Example:** A program that greets a user and tells them how many characters are in their name.

\`\`\`rust
fn welcome_message(name: &str) -> String {
    let length = name.len();
    format!("Welcome {}! Your name has {} letters.", name, length)
}
\`\`\`

If we run this with the input \`"Alice"\`, the function returns:
\`"Welcome Alice! Your name has 5 letters."\`

The logic stays the same, but the **behavior changes** based on the input!`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Double It',
      content: `Complete the function \`double_number\` so that it takes a whole number (\`i32\`) and returns that number multiplied by 2.`,
      code: `fn double_number(n: i32) -> i32 {
    // TODO: Multiply n by 2
    0
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Trying to use a variable that isn't a parameter.** You can only use the names provided in the parentheses.
- ❌ **Mismatching types.** If a function expects an \`i32\`, you can't give it a decimal (\`f64\`).
- ❌ **Hardcoding the answer.** If a problem asks you to double a number, don't write \`return 10;\`. Write \`n * 2;\` so it works for *any* number!`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const PROBLEMS: ProblemInput[] = [
  // -------- M4.1 ----------
  {
    title: 'Rust: Welcome User',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Welcome User

Complete the function \`welcome\` that takes a \`name\` (&str) and returns a welcoming string:
\`Welcome to LearnCode, <name>!\`
`.trim(),
    starterCode: `fn welcome(name: &str) -> String {
    // TODO: Build the welcome message
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `format!` macro.' },
      { orderIndex: 2, content: 'The pattern is `"Welcome to LearnCode, {}!"`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn welcome(name: &str) -> String {\n    format!("Welcome to LearnCode, {}!", name)\n}\n```' },
    ],
    testCases: [
      { inputData: 'welcome("Alice")', expected: '"Welcome to LearnCode, Alice!"', isHidden: false },
      { inputData: 'welcome("Bob")', expected: '"Welcome to LearnCode, Bob!"', isHidden: true },
    ],
  },

  // -------- M4.2 ----------
  {
    title: 'Rust: Add From Input',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Add From Input

Complete the function \`add_two\` that takes two integers \`a\` and \`b\` and returns their sum.
`.trim(),
    starterCode: `fn add_two(a: i32, b: i32) -> i32 {
    // TODO: Return the sum
    0
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `+` operator.' },
      { orderIndex: 2, content: 'Simply return `a + b`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn add_two(a: i32, b: i32) -> i32 {\n    a + b\n}\n```' },
    ],
    testCases: [
      { inputData: 'add_two(5, 10)', expected: '15', isHidden: false },
      { inputData: 'add_two(-1, 1)', expected: '0', isHidden: true },
    ],
  },

  // -------- M4.3 ----------
  {
    title: 'Rust: Square It',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Square It

Complete the function \`square\` that takes a number \`n\` (i32) and returns its square.
`.trim(),
    starterCode: `fn square(n: i32) -> i32 {
    // TODO: Return n squared
    0
}
`,
    hints: [
      { orderIndex: 1, content: 'Multiply the input by itself.' },
      { orderIndex: 2, content: 'Use the `*` operator: `n * n`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn square(n: i32) -> i32 {\n    n * n\n}\n```' },
    ],
    testCases: [
      { inputData: 'square(4)', expected: '16', isHidden: false },
      { inputData: 'square(0)', expected: '0', isHidden: true },
      { inputData: 'square(-3)', expected: '9', isHidden: true },
    ],
  },

  // -------- M4.4 ----------
  {
    title: 'Rust: Tip Calculator',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Tip Calculator

Complete the function \`calculate_total\` that takes a \`bill\` (\`f64\`) and a \`tip_percent\` (\`i32\`) and returns the total amount.

### Formula
\`Total = Bill + (Bill * TipPercent / 100)\`

> **Note:** Since \`tip_percent\` is an integer, you'll need to convert it to a float to do math with the bill: \`tip_percent as f64\`.
`.trim(),
    starterCode: `fn calculate_total(bill: f64, tip_percent: i32) -> f64 {
    // TODO: Calculate and return the total
    0.0
}
`,
    hints: [
      { orderIndex: 1, content: 'Convert the tip percent: `let tip = tip_percent as f64;`' },
      { orderIndex: 2, content: 'The formula is `bill + (bill * tip / 100.0)`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn calculate_total(bill: f64, tip_percent: i32) -> f64 {\n    bill + (bill * (tip_percent as f64) / 100.0)\n}\n```' },
    ],
    testCases: [
      { inputData: 'calculate_total(100.0, 15)', expected: '115.0', isHidden: false },
      { inputData: 'calculate_total(50.0, 20)', expected: '60.0', isHidden: true },
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
