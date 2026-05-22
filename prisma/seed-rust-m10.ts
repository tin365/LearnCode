/**
 * Wave — Rust Module 10 "Functions (Going Deeper)"
 *
 * Adds the Rust M10 lesson plus 5 problems.
 *
 * Run:  pnpm tsx prisma/seed-rust-m10.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'rust';
const MODULE_ORDER_INDEX = 310; // Rust Base (300) + Module 10
const MODULE = {
  title: 'Functions (Going Deeper)',
  description: 'Ownership, borrowing, and organizing your code.',
  estimatedMinutes: 35,
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
  title: 'Mastering Rust Functions',
  estimatedMinutes: 15,
  concepts: ['Ownership', 'Borrowing (&)', 'Tuples', 'Returning Values'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'The Rules of the Road',
      content: `In other languages, variables can be passed around freely. In Rust, every piece of data has a single "owner." When you pass data to a function, you have to decide: are you giving it away, or just letting the function borrow it?

This module introduces the most unique part of Rust. Once you understand how functions interact with data, you'll be able to write programs that are both extremely fast and impossible to crash.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Ownership and Borrowing',
      content: `When you pass a variable to a function:
1. **Ownership Transfer**: If you pass it as-is (\`fn take(s: String)\`), the function now "owns" the data. You can't use it anymore in the original code!
2. **Borrowing**: If you pass it with an ampersand (\`fn borrow(s: &String)\`), the function is just "looking" at it. After the function finishes, you still own the data and can keep using it.

Most of the time, you want your functions to **borrow** data so the rest of your program remains useful.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Borrowing and Multiple Returns in Rust:',
      code: `// Borrowing (using &)
fn print_length(s: &String) {
    println!("{}", s.len());
}

// Returning multiple values (Tuple)
fn get_coords() -> (i32, i32) {
    (10, 20)
}

fn main() {
    let name = "Alice".to_string();
    print_length(&name); // We pass a reference
    println!("{}", name); // Still works!
    
    let (x, y) = get_coords(); // Destructuring
}`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'The Stats Machine',
      content: `**Example:** A function that takes a list of numbers and returns both the sum and the count using a tuple.

\`\`\`rust
fn get_stats(numbers: &Vec<i32>) -> (i32, usize) {
    let mut sum = 0;
    for n in numbers {
        sum += n;
    }
    (sum, numbers.len()) // Returning a tuple
}
\`\`\`

By taking \`&Vec<i32>\`, the function borrows the list. The caller can keep using the list after the function returns the sum and count.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Swap & Return',
      content: `Complete the function \`swap_strings\` so that it takes two String slices and returns them swapped as a tuple.`,
      code: `fn swap_strings(a: &str, b: &str) -> (String, String) {
    // TODO: Return (b, a) as Strings
    (String::new(), String::new())
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **"Value used after move."** This is the classic Rust error. It means you gave ownership of a variable to a function, but then tried to use that variable again later. Use \`&\` to borrow instead.
- ❌ **Returning a reference to a local variable.** You can't return a reference (\`&String\`) to something created *inside* the function. Once the function ends, that data is destroyed. Always return the actual data (\`String\`).
- ❌ **Mismatching tuple sizes.** If a function returns \`(i32, i32)\`, you must handle both values.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const PROBLEMS: ProblemInput[] = [
  // -------- M10.1 ----------
  {
    title: 'Rust: Sum Two Numbers',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Sum Two Numbers

Complete the function \`sum\` that takes two integers and returns their sum.
`.trim(),
    starterCode: `fn sum(a: i32, b: i32) -> i32 {
    // TODO: Return sum
    0
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `+` operator.' },
      { orderIndex: 2, content: 'Just return `a + b`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn sum(a: i32, b: i32) -> i32 {\n    a + b\n}\n```' },
    ],
    testCases: [
      { inputData: 'sum(5, 10)', expected: '15', isHidden: false },
      { inputData: 'sum(-1, 1)', expected: '0', isHidden: true },
    ],
  },

  // -------- M10.2 ----------
  {
    title: 'Rust: Fibonacci',
    orderIndex: 2,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Fibonacci

Return the Nth Fibonacci number (0, 1, 1, 2, 3, 5, 8...).
- \`fib(0)\` -> 0
- \`fib(1)\` -> 1
`.trim(),
    starterCode: `fn fib(n: i32) -> i32 {
    if n == 0 { return 0; }
    if n == 1 { return 1; }
    // TODO: Use recursion
    0
}
`,
    hints: [
      { orderIndex: 1, content: 'The formula is `fib(n) = fib(n-1) + fib(n-2)`.' },
      { orderIndex: 2, content: 'Call the function itself inside the code.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfib(n - 1) + fib(n - 2)\n```' },
    ],
    testCases: [
      { inputData: 'fib(4)', expected: '3', isHidden: false },
      { inputData: 'fib(6)', expected: '8', isHidden: true },
    ],
  },

  // -------- M10.3 ----------
  {
    title: 'Rust: Area and Perimeter',
    orderIndex: 3,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Area and Perimeter

Complete the function \`rect_stats\` that takes \`width\` and \`height\` and returns both the **area** and the **perimeter** as a tuple \`(area, perimeter)\`.

### Formula
- Area: \`w * h\`
- Perimeter: \`2 * (w + h)\`
`.trim(),
    starterCode: `fn rect_stats(w: i32, h: i32) -> (i32, i32) {
    // TODO: Calculate both and return as a tuple
    (0, 0)
}
`,
    hints: [
      { orderIndex: 1, content: 'Calculate area: `w * h`.' },
      { orderIndex: 2, content: 'Calculate perimeter: `2 * (w + h)`.' },
      { orderIndex: 3, content: 'Return them inside parentheses: `(area, perimeter)`.' },
    ],
    testCases: [
      { inputData: 'rect_stats(3, 4)', expected: '(12, 14)', isHidden: false },
      { inputData: 'rect_stats(5, 5)', expected: '(25, 20)', isHidden: true },
    ],
  },

  // -------- M10.4 ----------
  {
    title: 'Rust: Borrow Checker',
    orderIndex: 4,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Borrowing Practice

Complete the function \`first_and_last\` that takes a **reference** to a Vector of Strings and returns a tuple containing the first and last strings.

> **Note:** Because you are borrowing, you should use \`.clone()\` on the strings to return new copies.
`.trim(),
    starterCode: `fn first_and_last(list: &Vec<String>) -> (String, String) {
    // TODO: Return (list[0], list[last])
    (String::new(), String::new())
}
`,
    hints: [
      { orderIndex: 1, content: 'The first item is at index `0`.' },
      { orderIndex: 2, content: 'The last item is at index `list.len() - 1`.' },
      { orderIndex: 3, content: 'Use `.clone()`: `(list[0].clone(), list[list.len()-1].clone())`.' },
    ],
    testCases: [
      { inputData: 'first_and_last(&vec!["a".to_string(), "b".to_string(), "c".to_string()])', expected: '("a", "c")', isHidden: false },
      { inputData: 'first_and_last(&vec!["rust".to_string(), "is".to_string(), "safe".to_string()])', expected: '("rust", "safe")', isHidden: true },
    ],
  },

  // -------- M10.5 ----------
  {
    title: 'Rust: Calculator Dispatch',
    orderIndex: 5,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Calculator Dispatch

Complete the function \`calculate\` that takes two numbers and an operation (\`"add"\`, \`"sub"\`, \`"mul"\`, \`"div"\`) and returns the result. Return \`-1\` for unknown operations.

> **Tip:** Use a \`match\` statement! It's the most powerful way to handle branching in Rust.
`.trim(),
    starterCode: `fn calculate(a: i32, b: i32, op: &str) -> i32 {
    // TODO: Use match op { ... }
    -1
}
`,
    hints: [
      { orderIndex: 1, content: 'The syntax is `match op { "add" => a + b, ... }`.' },
      { orderIndex: 2, content: 'The final case `_ => -1` handles anything else.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nmatch op {\n    "add" => a + b,\n    "sub" => a - b,\n    "mul" => a * b,\n    "div" => a / b,\n    _ => -1,\n}\n```' },
    ],
    testCases: [
      { inputData: 'calculate(10, 5, "add")', expected: '15', isHidden: false },
      { inputData: 'calculate(10, 5, "mul")', expected: '50', isHidden: true },
      { inputData: 'calculate(10, 5, "unknown")', expected: '-1', isHidden: true },
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
