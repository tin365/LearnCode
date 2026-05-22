/**
 * Wave — JavaScript Module 6 "Loops"
 *
 * Adds the JavaScript M6 lesson plus 7 problems.
 *
 * Run:  pnpm tsx prisma/seed-javascript-m6.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'javascript';
const MODULE_ORDER_INDEX = 106; // JavaScript Base (100) + Module 6
const MODULE = {
  title: 'Loops',
  description: 'Repeat actions with for and while loops.',
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
  concepts: ['for loops', 'while loops', 'break', 'continue'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Don\'t Repeat Yourself',
      content: `Imagine you need to print "Hello" 100 times. You *could* write 100 lines of code, but that would be exhausting and hard to fix if you made a mistake.

**Loops** are how we tell the computer to repeat a block of code over and over again. Computers never get tired and they never get bored — they are perfect for doing repetitive tasks millions of times per second.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'for and while',
      content: `JavaScript has two main types of loops:

- **\`for\` loops**: Best when you know exactly how many times you want to repeat (e.g., "count from 1 to 10").
- **\`while\` loops**: Best when you want to repeat *until* something happens (e.g., "keep asking for a password until it's correct").

A \`for\` loop has three parts:
1. **Initialization**: Start a counter (\`let i = 0\`).
2. **Condition**: Keep looping while this is true (\`i < 10\`).
3. **Update**: Change the counter after each loop (\`i++\`).`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Loop syntax in JavaScript:',
      code: `// Counting from 1 to 5
for (let i = 1; i <= 5; i++) {
  console.log(i);
}

// Repeating while a condition is true
let count = 5;
while (count > 0) {
  console.log(count);
  count--; // Decrement
}

// Infinite loop with a break
while (true) {
  if (someCondition) break;
}`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Summing Numbers',
      content: `**Example:** Calculating the sum of numbers from 1 to N.

\`\`\`javascript
function sumToN(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total = total + i;
  }
  return total;
}
\`\`\`

If \`n = 3\`, the loop runs 3 times:
1. \`i = 1\`: \`total\` becomes 1.
2. \`i = 2\`: \`total\` becomes 3 (1 + 2).
3. \`i = 3\`: \`total\` becomes 6 (3 + 3).

The loop finishes, and the function returns 6.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Factorial',
      content: `A factorial of a number \`n\` is the product of all positive integers from 1 to \`n\`. Complete the function \`factorial\` to calculate it.`,
      code: `function factorial(n) {
  let result = 1;
  // TODO: Use a for loop to multiply result by i
  return result;
}

console.log(factorial(5)); // Should be 120
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Infinite Loops.** If your \`while\` condition never becomes false, the loop will run forever and your browser will "hang". Always make sure something changes inside the loop!
- ❌ **Off-by-one errors.** Should you use \`i < n\` or \`i <= n\`? Think carefully about whether the last number should be included.
- ❌ **Forgetting to update the counter.** In a \`while\` loop, if you forget \`count++\` or \`count--\`, you'll hit an infinite loop.
- ❌ **Variable Scope.** If you declare a variable *inside* a loop with \`let\`, you cannot use it *outside* the loop. Declare your result variable before the loop starts!`,
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
    title: 'JS: Sum 1 to N',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Sum 1 to N

Complete the function \`sumToN\` that takes a number \`n\` and returns the sum of all numbers from 1 up to and including \`n\`.

### Example
\`\`\`javascript
sumToN(3) // 1 + 2 + 3 = 6
sumToN(5) // 1 + 2 + 3 + 4 + 5 = 15
\`\`\`
`.trim(),
    starterCode: `function sumToN(n) {
  let sum = 0;
  // TODO: Use a loop
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a `for` loop starting at 1.' },
      { orderIndex: 2, content: 'The condition should be `i <= n` to include n.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction sumToN(n) {\n  let sum = 0;\n  for (let i = 1; i <= n; i++) {\n    sum += i;\n  }\n  return sum;\n}\n```' },
    ],
    testCases: [
      { inputData: 'sumToN(3)', expected: '6', isHidden: false },
      { inputData: 'sumToN(5)', expected: '15', isHidden: true },
      { inputData: 'sumToN(10)', expected: '55', isHidden: true },
    ],
  },

  // -------- M6.2 ----------
  {
    title: 'JS: Multiplication Table',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Multiplication Table

Complete the function \`multiTable\` that takes a number \`n\` and returns a string containing the first 5 results of its multiplication table, separated by spaces.

### Example
\`\`\`javascript
multiTable(3) // "3 6 9 12 15"
\`\`\`
`.trim(),
    starterCode: `function multiTable(n) {
  let result = "";
  // TODO: Build the string with a loop
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop from 1 to 5.' },
      { orderIndex: 2, content: 'Inside the loop, add `(n * i) + " "` to the result string.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction multiTable(n) {\n  let result = "";\n  for (let i = 1; i <= 5; i++) {\n    result += (n * i) + " ";\n  }\n  return result.trim();\n}\n```' },
    ],
    testCases: [
      { inputData: 'multiTable(3)', expected: '"3 6 9 12 15"', isHidden: false },
      { inputData: 'multiTable(5)', expected: '"5 10 15 20 25"', isHidden: true },
    ],
  },

  // -------- M6.3 ----------
  {
    title: 'JS: FizzBuzz',
    orderIndex: 3,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## FizzBuzz

Complete the function \`fizzBuzz\` that returns numbers 1 to \`n\` as a string separated by spaces.
- If divisible by 3: \`Fizz\`
- If divisible by 5: \`Buzz\`
- If both: \`FizzBuzz\`
`.trim(),
    starterCode: `function fizzBuzz(n) {
  let result = "";
  // TODO: Loop 1 to n
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `i % 3 === 0 && i % 5 === 0` for FizzBuzz.' },
      { orderIndex: 2, content: 'Add spaces between items in your result string.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction fizzBuzz(n) {\n  let res = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) res.push("FizzBuzz");\n    else if (i % 3 === 0) res.push("Fizz");\n    else if (i % 5 === 0) res.push("Buzz");\n    else res.push(i);\n  }\n  return res.join(" ");\n}\n```' },
    ],
    testCases: [
      { inputData: 'fizzBuzz(5)', expected: '"1 2 Fizz 4 Buzz"', isHidden: false },
      { inputData: 'fizzBuzz(15)', expected: '"1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz"', isHidden: true },
    ],
  },

  // -------- M6.4 ----------
  {
    title: 'JS: Count Down',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Count Down

Complete the function \`countDown\` that returns a string counting down to 1, followed by \`"Lift off!"\`.
`.trim(),
    starterCode: `function countDown(start) {
  let result = "";
  // TODO: Use a while loop
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `while (start > 0)`.' },
      { orderIndex: 2, content: 'Subtract 1 from start each time: `start--`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction countDown(start) {\n  let res = "";\n  while (start > 0) {\n    res += start + " ";\n    start--;\n  }\n  return res + "Lift off!";\n}\n```' },
    ],
    testCases: [
      { inputData: 'countDown(3)', expected: '"3 2 1 Lift off!"', isHidden: false },
      { inputData: 'countDown(1)', expected: '"1 Lift off!"', isHidden: true },
    ],
  },

  // -------- M6.5 ----------
  {
    title: 'JS: Find Multiple',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Find Multiple

Find the smallest positive number that is a multiple of both \`a\` and \`b\`.
`.trim(),
    starterCode: `function findMultiple(a, b) {
  let i = 1;
  // TODO: Use a loop
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a loop that increments `i` until it hits a match.' },
      { orderIndex: 2, content: 'Check `i % a === 0 && i % b === 0`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction findMultiple(a, b) {\n  let i = 1;\n  while (true) {\n    if (i % a === 0 && i % b === 0) return i;\n    i++;\n  }\n}\n```' },
    ],
    testCases: [
      { inputData: 'findMultiple(3, 7)', expected: '21', isHidden: false },
      { inputData: 'findMultiple(4, 6)', expected: '12', isHidden: true },
    ],
  },

  // -------- M6.6 ----------
  {
    title: 'JS: Power of Two',
    orderIndex: 6,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Power of Two

Return \`true\` if \`n\` is a power of 2 (1, 2, 4, 8...).
`.trim(),
    starterCode: `function isPowerOfTwo(n) {
  if (n <= 0) return false;
  // TODO: Keep dividing by 2 while n is even
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a `while` loop that runs as long as `n % 2 === 0`.' },
      { orderIndex: 2, content: 'Inside the loop, `n = n / 2`.' },
      { orderIndex: 3, content: 'If n is 1 at the end, it was a power of 2.' },
    ],
    testCases: [
      { inputData: 'isPowerOfTwo(8)', expected: 'true', isHidden: false },
      { inputData: 'isPowerOfTwo(10)', expected: 'false', isHidden: true },
      { inputData: 'isPowerOfTwo(1)', expected: 'true', isHidden: true },
    ],
  },

  // -------- M6.7 ----------
  {
    title: 'JS: Find Invalid',
    orderIndex: 7,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Find First Invalid

Take a list of passwords and return the index of the first one that is less than 8 characters long. Return \`-1\` if all are valid.
`.trim(),
    starterCode: `function findFirstInvalid(passwords) {
  // TODO: Loop through indexes
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `for (let i = 0; i < passwords.length; i++)`.' },
      { orderIndex: 2, content: 'Check `passwords[i].length < 8`.' },
      { orderIndex: 3, content: 'Return `i` immediately if found.' },
    ],
    testCases: [
      { inputData: 'findFirstInvalid(["strongpass", "short", "validpass"])', expected: '1', isHidden: false },
      { inputData: 'findFirstInvalid(["validone", "validtwo"])', expected: '-1', isHidden: true },
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
