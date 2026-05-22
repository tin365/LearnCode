/**
 * Wave — JavaScript Module 7 "Arrays"
 *
 * Adds the JavaScript M7 lesson plus 7 problems.
 *
 * Run:  pnpm tsx prisma/seed-javascript-m7.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'javascript';
const MODULE_ORDER_INDEX = 107; // JavaScript Base (100) + Module 7
const MODULE = {
  title: 'Arrays',
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
  title: 'Storing Collections',
  estimatedMinutes: 15,
  concepts: ['Arrays', 'Indexing', 'push', 'pop', 'Iteration'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Managing Groups',
      content: `Until now, we've mostly worked with single values. But what if you need to manage a list of 500 student names, or 10,000 game scores? Creating 10,000 variables would be impossible.

In JavaScript, we use an **Array** to store many values inside a single variable. This lets us treat a group of items as one thing, and use loops to process every item in the list with just a few lines of code.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'What is an Array?',
      content: `An **Array** is an ordered list of values. You create one using square brackets \`[]\`.

Every item in the list has an **index** (a position number). JavaScript starts counting at **0**.
- The first item is at index \`0\`.
- The second item is at index \`1\`.
- The last item's index is always \`array.length - 1\`.

Think of an array like a train: every car has a number, and you can add new cars to the back or see what's inside any car if you know its number.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Creating and using arrays in JavaScript:',
      code: `const numbers = [10, 20, 30];

// Accessing an item
const first = numbers[0]; // 10

// Changing an item
numbers[1] = 25;

// Adding to the end
numbers.push(40);

// Removing from the end
const last = numbers.pop(); // 40

// Get the size
const size = numbers.length; // 3`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Processing a List',
      content: `**Example:** Calculating the average of a list of numbers.

\`\`\`javascript
function calculateAverage(scores) {
  if (scores.length === 0) return 0;
  
  let total = 0;
  for (let i = 0; i < scores.length; i++) {
    total += scores[i];
  }
  return total / scores.length;
}
\`\`\`

We use a \`for\` loop to visit every index from \`0\` to \`length - 1\`. Inside the loop, \`scores[i]\` lets us look at the current item.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Find Minimum',
      content: `Complete the function \`findMin\` so that it takes an array of numbers and returns the smallest one.`,
      code: `function findMin(numbers) {
  let min = numbers[0];
  // TODO: Loop and update min if you find a smaller number
  return min;
}

console.log(findMin([5, 2, 9, 1])); // Should be 1
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Counting from 1.** \`list[1]\` is the *second* item. Always remember \`list[0]\` is the first.
- ❌ **Using the wrong brackets.** Arrays use square brackets \`[]\`, functions use parentheses \`()\`, and code blocks use curly braces \`{}\`.
- ❌ **Index Out of Bounds.** If you try to access \`list[10]\` but the list only has 5 items, JavaScript returns \`undefined\`. This is a common source of bugs!`,
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
    title: 'JS: Sum Array',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Sum Array

Complete the function \`sumAll\` that takes an array of numbers and returns the total sum.
`.trim(),
    starterCode: `function sumAll(numbers) {
  let sum = 0;
  // TODO: Loop and add
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a `for` loop to visit every item.' },
      { orderIndex: 2, content: 'Add `numbers[i]` to your sum variable.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction sumAll(numbers) {\n  let sum = 0;\n  for (let i = 0; i < numbers.length; i++) {\n    sum += numbers[i];\n  }\n  return sum;\n}\n```' },
    ],
    testCases: [
      { inputData: 'sumAll([1, 2, 3])', expected: '6', isHidden: false },
      { inputData: 'sumAll([10, -5, 2])', expected: '7', isHidden: true },
      { inputData: 'sumAll([])', expected: '0', isHidden: true },
    ],
  },

  // -------- M7.2 ----------
  {
    title: 'JS: Find Largest',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Find Largest

Return the largest number in the array. Assume the array is not empty.
`.trim(),
    starterCode: `function findMax(numbers) {
  let max = numbers[0];
  // TODO: Find the max
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop through the array starting from index 1.' },
      { orderIndex: 2, content: 'If `numbers[i] > max`, update `max`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction findMax(numbers) {\n  let max = numbers[0];\n  for (let i = 1; i < numbers.length; i++) {\n    if (numbers[i] > max) max = numbers[i];\n  }\n  return max;\n}\n```' },
    ],
    testCases: [
      { inputData: 'findMax([5, 2, 9, 1])', expected: '9', isHidden: false },
      { inputData: 'findMax([-10, -2, -5])', expected: '-2', isHidden: true },
    ],
  },

  // -------- M7.3 ----------
  {
    title: 'JS: Count Occurrences',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Count Target

Count how many times \`target\` appears in the array.
`.trim(),
    starterCode: `function countTarget(numbers, target) {
  let count = 0;
  // TODO: Count occurrences
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a loop to check every item.' },
      { orderIndex: 2, content: 'Check `if (numbers[i] === target)`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction countTarget(numbers, target) {\n  let count = 0;\n  for (let n of numbers) {\n    if (n === target) count++;\n  }\n  return count;\n}\n```' },
    ],
    testCases: [
      { inputData: 'countTarget([1, 2, 1, 3], 1)', expected: '2', isHidden: false },
      { inputData: 'countTarget([5, 5, 5], 0)', expected: '0', isHidden: true },
    ],
  },

  // -------- M7.4 ----------
  {
    title: 'JS: Reverse Array',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Reverse Array

Return a new array with the items in reverse order.

> **Tip:** You can create an empty array and use \`push()\` or \`unshift()\` to fill it.
`.trim(),
    starterCode: `function reverse(numbers) {
  let result = [];
  // TODO: Fill result
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop backward through the input array.' },
      { orderIndex: 2, content: 'The last index is `numbers.length - 1`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction reverse(numbers) {\n  let result = [];\n  for (let i = numbers.length - 1; i >= 0; i--) {\n    result.push(numbers[i]);\n  }\n  return result;\n}\n```' },
    ],
    testCases: [
      { inputData: 'reverse([1, 2, 3])', expected: '[3,2,1]', isHidden: false },
      { inputData: 'reverse([10])', expected: '[10]', isHidden: true },
    ],
  },

  // -------- M7.5 ----------
  {
    title: 'JS: Average Score',
    orderIndex: 5,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Average Score

Calculate the average of an array of numbers. Return 0 if empty.
`.trim(),
    starterCode: `function calculateAverage(scores) {
  if (scores.length === 0) return 0;
  // TODO: Sum and divide
}
`,
    hints: [
      { orderIndex: 1, content: 'Sum all scores first.' },
      { orderIndex: 2, content: 'Divide the sum by `scores.length`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction calculateAverage(scores) {\n  if (scores.length === 0) return 0;\n  let sum = 0;\n  for (let s of scores) sum += s;\n  return sum / scores.length;\n}\n```' },
    ],
    testCases: [
      { inputData: 'calculateAverage([80, 90, 100])', expected: '90', isHidden: false },
      { inputData: 'calculateAverage([])', expected: '0', isHidden: true },
    ],
  },

  // -------- M7.6 ----------
  {
    title: 'JS: Filter Positives',
    orderIndex: 6,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Filter Positives

Return a new Array containing only the numbers from the input that are greater than 0.
`.trim(),
    starterCode: `function getPositives(numbers) {
  let result = [];
  // TODO: push positive numbers into result
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a loop to visit each number.' },
      { orderIndex: 2, content: 'Use `if (n > 0)` and `result.push(n)`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction getPositives(numbers) {\n  let result = [];\n  for (let n of numbers) {\n    if (n > 0) result.push(n);\n  }\n  return result;\n}\n```' },
    ],
    testCases: [
      { inputData: 'getPositives([1, -2, 3, 0, 5])', expected: '[1,3,5]', isHidden: false },
      { inputData: 'getPositives([-1, -5])', expected: '[]', isHidden: true },
    ],
  },

  // -------- M7.7 ----------
  {
    title: 'JS: Find Index',
    orderIndex: 7,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Find Index

Return the index of the first occurrence of \`target\`. Return -1 if not found.
`.trim(),
    starterCode: `function indexOf(list, target) {
  // TODO: Find the index
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a `for` loop with an index `i`.' },
      { orderIndex: 2, content: 'Compare `list[i] === target`.' },
      { orderIndex: 3, content: 'Return `i` if matched. Return -1 after the loop finishes.' },
    ],
    testCases: [
      { inputData: 'indexOf(["a", "b", "c"], "b")', expected: '1', isHidden: false },
      { inputData: 'indexOf(["x", "y"], "z")', expected: '-1', isHidden: true },
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
