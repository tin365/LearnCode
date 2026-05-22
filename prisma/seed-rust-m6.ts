/**
 * Wave — Rust Module 6 "Loops"
 *
 * Adds the Rust M6 lesson plus 7 problems.
 *
 * Run:  pnpm tsx prisma/seed-rust-m6.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'rust';
const MODULE_ORDER_INDEX = 306; // Rust Base (300) + Module 6
const MODULE = {
  title: 'Loops',
  description: 'Repeat actions with while and for loops.',
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
  title: 'Repetitive Tasks',
  estimatedMinutes: 15,
  concepts: ['while', 'for', 'ranges (..)', 'break', 'continue'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Don\'t Repeat Yourself',
      content: `Imagine you need to print "Hello" 100 times. You *could* write 100 lines of code, but that would be exhausting and hard to fix.

**Loops** are how we tell the computer to repeat a block of code. Computers never get tired or bored — they are perfect for doing repetitive tasks millions of times per second.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'While and For',
      content: `Rust has several ways to loop:

- **\`while\` loops**: Repeat as long as a condition is true.
- **\`for\` loops**: Best for iterating over a **range** of numbers or items in a list.
- **\`loop\`**: An infinite loop that only stops when you say \`break\`.

In Rust, \`for\` loops usually use **ranges**. \`0..5\` means "start at 0 and go up to (but not including) 5." \`0..=5\` means "go up to and including 5."`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Loop syntax in Rust:',
      code: `// Counting 1 to 5
for i in 1..=5 {
    println!("{}", i);
}

// Repeating while a condition is true
let mut count = 5;
while count > 0 {
    println!("{}", count);
    count -= 1;
}

// Infinite loop with break
loop {
    if some_condition { break; }
}`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Summing Numbers',
      content: `**Example:** Calculating the sum of numbers from 1 to N.

\`\`\`rust
fn sum_to_n(n: i32) -> i32 {
    let mut total = 0;
    for i in 1..=n {
        total += i;
    }
    total
}
\`\`\`

If \`n = 3\`, the loop runs for \`i = 1\`, \`i = 2\`, and \`i = 3\`. Each time, the value of \`i\` is added to \`total\`, finally returning 6.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Factorial',
      content: `Complete the function \`factorial\` to calculate the product of all integers from 1 to \`n\`.`,
      code: `fn factorial(n: i32) -> i32 {
    let mut result = 1;
    // TODO: Loop from 1 to n and multiply
    result
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Infinite while loops.** If your condition never becomes false, the program will run forever.
- ❌ **Range confusion.** Remember \`0..5\` only loops 5 times (0, 1, 2, 3, 4). If you need 5 itself, use \`0..=5\`.
- ❌ **Forgetting \`mut\`.** If you update a variable inside a loop (like a counter or a sum), that variable must be declared with \`let mut\`.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const PROBLEMS: ProblemInput[] = [
  // -------- M6.1 ----------
  {
    title: 'Rust: Sum 1 to N',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Sum 1 to N

Complete the function \`sum_to_n\` that takes an \`i32\` and returns the sum of all numbers from 1 up to and including \`n\`.
`.trim(),
    starterCode: `fn sum_to_n(n: i32) -> i32 {
    let mut sum = 0;
    // TODO: Use a loop
    sum
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a `for` loop with the range `1..=n`.' },
      { orderIndex: 2, content: 'Inside the loop, use `sum += i;`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfor i in 1..=n {\n    sum += i;\n}\nsum\n```' },
    ],
    testCases: [
      { inputData: 'sum_to_n(3)', expected: '6', isHidden: false },
      { inputData: 'sum_to_n(5)', expected: '15', isHidden: true },
      { inputData: 'sum_to_n(10)', expected: '55', isHidden: true },
    ],
  },

  // -------- M6.2 ----------
  {
    title: 'Rust: Multiplication Table',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Multiplication Table

Complete the function \`multi_table\` that takes an \`i32\` and returns a string with the first 5 results of its multiplication table, separated by spaces.

### Example
\`multi_table(3)\` -> \`"3 6 9 12 15"\`
`.trim(),
    starterCode: `fn multi_table(n: i32) -> String {
    let mut result = String::new();
    // TODO: Use a loop
    result.trim().to_string()
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop from 1 to 5.' },
      { orderIndex: 2, content: 'Use `format!` or `push_str` to build the string.' },
      { orderIndex: 3, content: 'Example: `result.push_str(&format!("{} ", n * i));`' },
    ],
    testCases: [
      { inputData: 'multi_table(3)', expected: '"3 6 9 12 15"', isHidden: false },
      { inputData: 'multi_table(10)', expected: '"10 20 30 40 50"', isHidden: true },
    ],
  },

  // -------- M6.3 ----------
  {
    title: 'Rust: FizzBuzz',
    orderIndex: 3,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## FizzBuzz

Complete the function \`fizz_buzz\` that returns numbers 1 to \`n\` as a string separated by spaces.
- If divisible by 3: \`Fizz\`
- If divisible by 5: \`Buzz\`
- If both: \`FizzBuzz\`
`.trim(),
    starterCode: `fn fizz_buzz(n: i32) -> String {
    let mut result = String::new();
    // TODO: Loop 1..=n
    result.trim().to_string()
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `if i % 15 == 0` first for FizzBuzz.' },
      { orderIndex: 2, content: 'Use `result.push_str(...)` to add to the string.' },
      { orderIndex: 3, content: 'Don\'t forget the spaces between items!' },
    ],
    testCases: [
      { inputData: 'fizz_buzz(5)', expected: '"1 2 Fizz 4 Buzz"', isHidden: false },
      { inputData: 'fizz_buzz(15)', expected: '"1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz"', isHidden: true },
    ],
  },

  // -------- M6.4 ----------
  {
    title: 'Rust: Count Down',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Count Down

Complete the function \`count_down\` that returns a string counting down to 1, followed by \`"Lift off!"\`.
`.trim(),
    starterCode: `fn count_down(mut start: i32) -> String {
    let mut result = String::new();
    // TODO: Use a while loop
    format!("{}Lift off!", result)
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `while start > 0`.' },
      { orderIndex: 2, content: 'Append `start` and a space each time.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nwhile start > 0 {\n    result.push_str(&format!("{} ", start));\n    start -= 1;\n}\nformat!("{}Lift off!", result)\n```' },
    ],
    testCases: [
      { inputData: 'count_down(3)', expected: '"3 2 1 Lift off!"', isHidden: false },
      { inputData: 'count_down(1)', expected: '"1 Lift off!"', isHidden: true },
    ],
  },

  // -------- M6.5 ----------
  {
    title: 'Rust: Find Multiple',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Find Multiple

Find the smallest positive number that is a multiple of both \`a\` and \`b\`.
`.trim(),
    starterCode: `fn find_multiple(a: i32, b: i32) -> i32 {
    let mut i = 1;
    // TODO: Use loop or while
    i
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `loop { ... }`.' },
      { orderIndex: 2, content: 'Use `if i % a == 0 && i % b == 0 { break; }`.' },
      { orderIndex: 3, content: 'Increment `i` every time the condition is false.' },
    ],
    testCases: [
      { inputData: 'find_multiple(3, 7)', expected: '21', isHidden: false },
      { inputData: 'find_multiple(4, 6)', expected: '12', isHidden: true },
    ],
  },

  // -------- M6.6 ----------
  {
    title: 'Rust: Power of Two',
    orderIndex: 6,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Power of Two

Return \`true\` if \`n\` is a power of 2 (1, 2, 4, 8...).
`.trim(),
    starterCode: `fn is_power_of_two(mut n: i32) -> bool {
    if n <= 0 { return false; }
    // TODO: Keep dividing by 2 while even
    n == 1
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `while n % 2 == 0`.' },
      { orderIndex: 2, content: 'Inside the loop, `n /= 2;`.' },
      { orderIndex: 3, content: 'After the loop, check if `n == 1`.' },
    ],
    testCases: [
      { inputData: 'is_power_of_two(8)', expected: 'true', isHidden: false },
      { inputData: 'is_power_of_two(10)', expected: 'false', isHidden: true },
      { inputData: 'is_power_of_two(1)', expected: 'true', isHidden: true },
    ],
  },

  // -------- M6.7 ----------
  {
    title: 'Rust: Find Invalid',
    orderIndex: 7,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Find First Invalid

Take a list of passwords and return the index of the first one that is less than 8 characters long. Return \`-1\` if all are valid.

> **Tip:** You can return \`-1\` as an \`i32\`.
`.trim(),
    starterCode: `fn find_invalid(passwords: Vec<String>) -> i32 {
    // TODO: Loop through indexes
    -1
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `for i in 0..passwords.len()`.' },
      { orderIndex: 2, content: 'Check `if passwords[i].len() < 8`.' },
      { orderIndex: 3, content: 'Return `i as i32` if found.' },
    ],
    testCases: [
      { inputData: 'find_invalid(vec!["strongpass".to_string(), "short".to_string()])', expected: '1', isHidden: false },
      { inputData: 'find_invalid(vec!["validone".to_string()])', expected: '-1', isHidden: true },
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
