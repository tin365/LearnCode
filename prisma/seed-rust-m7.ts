/**
 * Wave — Rust Module 7 "Vectors (Lists)"
 *
 * Adds the Rust M7 lesson plus 7 problems.
 *
 * Run:  pnpm tsx prisma/seed-rust-m7.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'rust';
const MODULE_ORDER_INDEX = 307; // Rust Base (300) + Module 7
const MODULE = {
  title: 'Vectors (Lists)',
  description: 'Store collections of values and operate on them.',
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
  title: 'Dynamic Lists with Vectors',
  estimatedMinutes: 15,
  concepts: ['Vec<T>', 'push', 'pop', 'indexing', 'iterating'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Managing Groups',
      content: `Until now, we've mostly worked with single values. But what if you need to manage a list of 500 student names, or 10,000 game scores?

In Rust, we use a **Vector** (\`Vec\`) to store many values in one place. This lets us treat a group of items as one thing and use loops to process every item with just a few lines of code.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'What is a Vector?',
      content: `A **Vector** is a dynamic list that can grow or shrink. Every item in the list must be the same **type**.

Key features:
- **Indexing**: Find an item by its position. Rust starts counting at **0**.
- **Growing**: Add items to the end with \`.push()\`.
- **Shrinking**: Remove the last item with \`.pop()\`.

Think of it like a train: you can add more cars to the back, and you can see what's in any specific car by its number.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Using Vectors in Rust:',
      code: `// Create with values
let mut numbers = vec![10, 20, 30];

// Add an item
numbers.push(40);

// Get an item (index 0 is the first)
let first = numbers[0];

// Get the size
let size = numbers.len();

// Iterate through values
for n in &numbers {
    println!("{}", n);
}`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Calculating an Average',
      content: `**Example:** Calculating the average of a list of floats.

\`\`\`rust
fn average(numbers: &Vec<f64>) -> f64 {
    if numbers.is_empty() { return 0.0; }
    
    let mut total = 0.0;
    for n in numbers {
        total += n;
    }
    total / (numbers.len() as f64)
}
\`\`\`

Notice the \`&Vec<f64>\`. The \`&\` means we are "borrowing" the list rather than taking ownership of it. This is a very common pattern in Rust!`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Find Minimum',
      content: `Complete the function \`find_min\` to return the smallest number in a vector of integers.`,
      code: `fn find_min(numbers: Vec<i32>) -> i32 {
    let mut min = numbers[0];
    // TODO: Loop and update min
    min
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Index out of bounds.** Accessing \`numbers[10]\` when the list only has 5 items will cause your program to "panic" (crash).
- ❌ **Mixing types.** You cannot put a string into a \`Vec<i32>\`.
- ❌ **Forgetting mutability.** If you want to \`.push()\` items into a vector, you must declare it with \`let mut\`.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const PROBLEMS: ProblemInput[] = [
  // -------- M7.1 ----------
  {
    title: 'Rust: Sum Vector',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Sum Vector

Complete the function \`sum_all\` that takes a vector of integers and returns their total sum.
`.trim(),
    starterCode: `fn sum_all(numbers: Vec<i32>) -> i32 {
    let mut sum = 0;
    // TODO: Loop and add
    sum
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `for n in &numbers` to visit each item.' },
      { orderIndex: 2, content: 'Add `n` to the `sum` variable.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfor n in &numbers { sum += n; }\nsum\n```' },
    ],
    testCases: [
      { inputData: 'sum_all(vec![1, 2, 3])', expected: '6', isHidden: false },
      { inputData: 'sum_all(vec![10, -5, 2])', expected: '7', isHidden: true },
    ],
  },

  // -------- M7.2 ----------
  {
    title: 'Rust: Find Largest',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Find Largest

Return the largest number in the vector. Assume the list is not empty.
`.trim(),
    starterCode: `fn find_max(numbers: Vec<i32>) -> i32 {
    let mut max = numbers[0];
    // TODO: Find the max
    max
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop through the items.' },
      { orderIndex: 2, content: 'If the current item is > max, update max.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfor n in numbers { if n > max { max = n; } }\nmax\n```' },
    ],
    testCases: [
      { inputData: 'find_max(vec![5, 2, 9, 1])', expected: '9', isHidden: false },
      { inputData: 'find_max(vec![-10, -2, -5])', expected: '-2', isHidden: true },
    ],
  },

  // -------- M7.3 ----------
  {
    title: 'Rust: Count Occurrences',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Count Target

Count how many times \`target\` appears in the vector.
`.trim(),
    starterCode: `fn count_target(numbers: Vec<i32>, target: i32) -> i32 {
    let mut count = 0;
    // TODO: Count occurrences
    count
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop through the numbers.' },
      { orderIndex: 2, content: 'If `n == target`, increment the count.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfor n in numbers { if n == target { count += 1; } }\ncount\n```' },
    ],
    testCases: [
      { inputData: 'count_target(vec![1, 2, 1, 3], 1)', expected: '2', isHidden: false },
      { inputData: 'count_target(vec![5, 5, 5], 0)', expected: '0', isHidden: true },
    ],
  },

  // -------- M7.4 ----------
  {
    title: 'Rust: Reverse Vector',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Reverse Vector

Return a new vector with the items in reverse order.

> **Tip:** You can create a new vector and use \`push\` to add items to it.
`.trim(),
    starterCode: `fn reverse(numbers: Vec<i32>) -> Vec<i32> {
    let mut result = Vec::new();
    // TODO: Fill result
    result
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop backward through the original vector indices.' },
      { orderIndex: 2, content: 'Or use the `.rev()` method on a range.' },
      { orderIndex: 3, content: 'Try: `for i in (0..numbers.len()).rev() { result.push(numbers[i]); }`' },
    ],
    testCases: [
      { inputData: 'reverse(vec![1, 2, 3])', expected: '[3, 2, 1]', isHidden: false },
      { inputData: 'reverse(vec![10])', expected: '[10]', isHidden: true },
    ],
  },

  // -------- M7.5 ----------
  {
    title: 'Rust: Average Score',
    orderIndex: 5,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Average Score

Calculate the average of a vector of doubles. Return 0.0 if empty.
`.trim(),
    starterCode: `fn calculate_average(scores: Vec<f64>) -> f64 {
    if scores.is_empty() { return 0.0; }
    let mut sum = 0.0;
    // TODO: Sum and divide
    0.0
}
`,
    hints: [
      { orderIndex: 1, content: 'Sum all scores first.' },
      { orderIndex: 2, content: 'Divide by `scores.len() as f64`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfor s in &scores { sum += s; }\nsum / (scores.len() as f64)\n```' },
    ],
    testCases: [
      { inputData: 'calculate_average(vec![80.0, 90.0, 100.0])', expected: '90.0', isHidden: false },
      { inputData: 'calculate_average(vec![])', expected: '0.0', isHidden: true },
    ],
  },

  // -------- M7.6 ----------
  {
    title: 'Rust: Filter Positives',
    orderIndex: 6,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Filter Positives

Return a new Vector containing only the numbers from the input that are greater than 0.
`.trim(),
    starterCode: `fn get_positives(numbers: Vec<i32>) -> Vec<i32> {
    let mut result = Vec::new();
    // TODO: Push positive numbers into result
    result
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop through the input vector.' },
      { orderIndex: 2, content: 'Use `if n > 0 { result.push(n); }`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfor n in numbers { if n > 0 { result.push(n); } }\nresult\n```' },
    ],
    testCases: [
      { inputData: 'get_positives(vec![1, -2, 3, 0, 5])', expected: '[1, 3, 5]', isHidden: false },
      { inputData: 'get_positives(vec![-1, -5])', expected: '[]', isHidden: true },
    ],
  },

  // -------- M7.7 ----------
  {
    title: 'Rust: Find Index',
    orderIndex: 7,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Find Index

Return the index of the first occurrence of \`target\`. Return -1 if not found.
`.trim(),
    starterCode: `fn index_of(list: Vec<String>, target: &str) -> i32 {
    // TODO: Find the index
    -1
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `for i in 0..list.len()`.' },
      { orderIndex: 2, content: 'Compare with `if list[i] == target`.' },
      { orderIndex: 3, content: 'Return `i as i32` if found.' },
    ],
    testCases: [
      { inputData: 'index_of(vec!["a".to_string(), "b".to_string()], "b")', expected: '1', isHidden: false },
      { inputData: 'index_of(vec!["x".to_string()], "z")', expected: '-1', isHidden: true },
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
