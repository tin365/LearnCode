/**
 * Wave — Rust Module 11 "Debugging & Reading Errors"
 *
 * Adds the Rust M11 lesson plus 5 DEBUG problems.
 *
 * Run:  pnpm tsx prisma/seed-rust-m11.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'rust';
const MODULE_ORDER_INDEX = 311; // Rust Base (300) + Module 11
const MODULE = {
  title: 'Debugging & Reading Errors',
  description: 'Read compiler messages and fix broken code.',
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
  title: 'The Art of Debugging',
  estimatedMinutes: 10,
  concepts: ['Compiler Errors', 'Borrow Checker', 'Option/Result', 'unwrap'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'The Best Error Messages',
      content: `In many languages, errors are scary red text that you want to hide from. In Rust, error messages are a gift. The Rust compiler was designed to be a teacher, not just a judge.

Learning to read these messages is the final step in becoming a proficient Rust developer. Instead of guessing, you'll learn to follow the compiler's advice to fix bugs before they even happen!`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Compiler vs Runtime Errors',
      content: `Most Rust bugs are **Compiler Errors**. These happen *before* the program runs. The compiler will point at a line and say "Help: try borrowing here" or "Error: type mismatch."

A few errors happen while running, called a **Panic**. These usually happen when you try to access something that doesn't exist (like a 10th item in a 5-item list).

Rust uses **\`Option\`** and **\`Result\`** to avoid common crashes like "Null Pointer Exceptions." It forces you to check if a value exists before you use it.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Reading a Rust error message:',
      code: `error[E0382]: use of moved value: \`name\`
  --> src/main.rs:5:20
   |
 2 |     let name = String::from("Alice");
   |         ---- move occurs because \`name\` has type \`String\`
 3 |     take_ownership(name);
   |                    ---- value moved here
 4 |
 5 |     println!("{}", name);
   |                    ^^^^ value used here after move

// 1. Error Code: E0382
// 2. Line Number: main.rs:5
// 3. Explanation: You used 'name' after giving it away!`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Handling Missing Values',
      content: `**Example:** This code crashes if the value is missing.

\`\`\`rust
fn get_first_char(s: &str) -> char {
    s.chars().nth(0).unwrap() // CRASH if string is empty!
}
\`\`\`

**The Fix:** Use \`unwrap_or\` to provide a safe default value.

\`\`\`rust
fn get_first_char(s: &str) -> char {
    s.chars().nth(0).unwrap_or(' ') // Safe!
}
\`\`\`

Instead of crashing (\`unwrap\`), we tell Rust: "If there's no first character, just give me a space." This makes our program much more stable.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Fix the Math',
      content: `The code below will not compile because of a type mismatch. Can you fix it? (Hint: \`b\` needs to be converted to \`f64\`).`,
      code: `fn divide(a: f64, b: i32) -> f64 {
    // Rust cannot divide f64 by i32
    a / b
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Ignoring the compiler's advice.** Rust often includes a "help:" line in the error. 90% of the time, typing exactly what it suggests will fix the bug!
- ❌ **Overusing \`.unwrap()\`.** Using \`unwrap()\` tells Rust "I'm 100% sure this value exists." if you're wrong, the program crashes. Use \`unwrap_or()\` or \`match\` to be safer.
- ❌ **Forgetting type conversions.** Unlike JavaScript, Rust will never automatically turn an integer into a float for you. You must use \`as f64\`.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const PROBLEMS: ProblemInput[] = [
  // -------- M11.1 ----------
  {
    title: 'Rust: Fix the Type',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.DEBUG,
    description: `
## Fix the Type Mismatch

The function below won't compile because it tries to add an \`i32\` and an \`f64\`.

**Your Job:** Convert the integer \`a\` to an \`f64\` using the \`as\` keyword so the math works.
`.trim(),
    starterCode: `fn add_mixed(a: i32, b: f64) -> f64 {
    a + b
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `a as f64` to convert the type.' },
      { orderIndex: 2, content: 'Rust requires both sides of the `+` to be the same type.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\n(a as f64) + b\n```' },
    ],
    testCases: [
      { inputData: 'add_mixed(5, 2.5)', expected: '7.5', isHidden: false },
      { inputData: 'add_mixed(10, 0.1)', expected: '10.1', isHidden: true },
    ],
  },

  // -------- M11.2 ----------
  {
    title: 'Rust: Fix the Move',
    orderIndex: 2,
    difficulty: Difficulty.hard,
    type: ProblemType.DEBUG,
    description: `
## Fix the Move Error

The code below fails to compile because \`s\` is "moved" into the first function, and is no longer available for the second one.

**Your Job:** Fix the code so \`s\` is **borrowed** (using \`&\`) instead of moved.

> **Note:** You only need to change the function call.
`.trim(),
    starterCode: `fn take_it(s: String) { println!("{}", s); }

fn fix_me() -> String {
    let s = "Rust".to_string();
    take_it(s);
    s // Error! s was moved
}
`,
    hints: [
      { orderIndex: 1, content: 'Change `take_it(s)` to `take_it(s.clone())` or change the function to borrow.' },
      { orderIndex: 2, content: 'In this environment, using `.clone()` is the easiest fix.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nlet s = "Rust".to_string();\ntake_it(s.clone());\ns\n```' },
    ],
    testCases: [
      { inputData: 'fix_me()', expected: '"Rust"', isHidden: false },
    ],
  },

  // -------- M11.3 ----------
  {
    title: 'Rust: Safe Division',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.DEBUG,
    description: `
## Safe Division

Dividing by zero causes a panic. 

**Your Job:** Check if \`b\` is 0. If it is, return 0. Otherwise, return \`a / b\`.
`.trim(),
    starterCode: `fn divide(a: i32, b: i32) -> i32 {
    a / b
}
`,
    hints: [
      { orderIndex: 1, content: 'Use an `if` statement: `if b == 0 { 0 } else { ... }`.' },
      { orderIndex: 2, content: 'Make sure you don\'t use a semicolon if you want to return the result.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nif b == 0 { 0 } else { a / b }\n```' },
    ],
    testCases: [
      { inputData: 'divide(10, 2)', expected: '5', isHidden: false },
      { inputData: 'divide(10, 0)', expected: '0', isHidden: true },
    ],
  },

  // -------- M11.4 ----------
  {
    title: 'Rust: Fix the Bounds',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.DEBUG,
    description: `
## Fix the Bounds

This code is supposed to return the last number in a Vector, but it uses the wrong index.

**Your Job:** Fix the index so it doesn't panic.
`.trim(),
    starterCode: `fn get_last(nums: Vec<i32>) -> i32 {
    nums[nums.len()]
}
`,
    hints: [
      { orderIndex: 1, content: 'Indexes start at 0, so the last item is at `len() - 1`.' },
      { orderIndex: 2, content: 'Change `nums.len()` to `nums.len() - 1`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nnums[nums.len() - 1]\n```' },
    ],
    testCases: [
      { inputData: 'get_last(vec![1, 2, 3])', expected: '3', isHidden: false },
      { inputData: 'get_last(vec![100])', expected: '100', isHidden: true },
    ],
  },

  // -------- M11.5 ----------
  {
    title: 'Rust: Missing Value',
    orderIndex: 5,
    difficulty: Difficulty.hard,
    type: ProblemType.DEBUG,
    description: `
## Handle the Missing Value

The function below crashes if the word "rust" isn't in the map.

**Your Job:** Use \`.unwrap_or(0)\` so that it returns \`0\` if the key is missing instead of crashing.
`.trim(),
    starterCode: `use std::collections::HashMap;

fn get_rust_score(scores: HashMap<String, i32>) -> i32 {
    *scores.get("rust").unwrap()
}
`,
    hints: [
      { orderIndex: 1, content: 'Replace `.unwrap()` with `.unwrap_or(&0)`.' },
      { orderIndex: 2, content: 'Note that `.get()` returns a reference, so `unwrap_or` needs a reference too.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\n*scores.get("rust").unwrap_or(&0)\n```' },
    ],
    testCases: [
      { inputData: 'get_rust_score(vec![("rust".to_string(), 100)].into_iter().collect())', expected: '100', isHidden: false },
      { inputData: 'get_rust_score(HashMap::new())', expected: '0', isHidden: true },
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
