/**
 * Wave — JavaScript Module 2 "Variables & Data Types"
 *
 * Adds the JavaScript M2 lesson plus 6 problems.
 *
 * Run:  pnpm tsx prisma/seed-javascript-m2.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'javascript';
const MODULE_ORDER_INDEX = 102; // JavaScript Base (100) + Module 2
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
  title: 'Variables & Data Types',
  estimatedMinutes: 14,
  concepts: ['let', 'const', 'number', 'string', 'boolean', 'typeof'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Name the Things You Reason About',
      content: `Imagine a recipe that just says "add 2, then add 2, then add 2" everywhere — no word for *what* you're adding. Trying to read or change that recipe later would be a nightmare.

**Variables** are how programmers stop repeating values and start naming the things they reason about. Once a value has a name (\`price\`, \`age\`, \`message\`), your code reads like a story and making changes becomes much easier.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Variables and Types',
      content: `A **variable** is a labelled box that holds a value. In modern JavaScript, we use **\`let\`** to create a variable that can change, and **\`const\`** for one that stays the same:

\`\`\`javascript
const name = "Alice";
let age = 25;
\`\`\`

JavaScript figures out the **type** of each value automatically. The four types you'll meet first:

- **\`number\`** — both whole numbers (\`25\`) and decimals (\`9.99\`).
- **\`string\`** — text in quotes like \`"hello"\`.
- **\`boolean\`** — either \`true\` or \`false\`.
- **\`undefined\`** — a special type for a variable that has been declared but not yet assigned a value.

You can ask JavaScript what type a value has with the **\`typeof\`** operator.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Creating variables, the four basic types, and inspecting them:',
      code: `// Constants (cannot be changed)
const name = "Alice";      // string

// Variables (can be reassigned)
let age = 25;              // number
let price = 9.99;          // number
let isActive = true;       // boolean

// Reading a variable
console.log(name);

// Naming rules: camelCase is the standard in JS. 
// Must start with a letter, $ or _. Cannot start with a digit.

// Inspecting types
console.log(typeof name);  // "string"
console.log(typeof age);   // "number"`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'A Tiny Calculation',
      content: `**Example 1:** Read values into named variables, then use them in an expression. Naming things up front makes the math much clearer.

\`\`\`javascript
const price = 9.99;
const quantity = 3;
const taxRate = 0.10;

const subtotal = price * quantity;
const total = subtotal + (subtotal * taxRate);
console.log(total);        // 32.967
\`\`\`

**Example 2:** Converting between types. Sometimes you have a number but need it as text, or vice-versa.

\`\`\`javascript
const score = 87;
console.log("Your score is " + score);  // "Your score is 87" (JS converts automatically here)

const ageText = "25";
const age = Number(ageText);
console.log(age + 1);                   // 26
\`\`\`

Unlike some languages, JavaScript tries to be "helpful" by automatically converting types during addition with strings. This can lead to bugs, so being explicit with \`Number()\` or \`String()\` is often safer!`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Two Variables',
      content: `Create two variables — \`myName\` set to your name (a string) and \`myAge\` set to a number — and have the function return a sentence that uses both, like \`"Alice is 25 years old."\`.`,
      code: `function aboutMe() {
  const myName = "Alice";
  const myAge = 25;
  
  // Return a sentence using both variables, like:
  // "Alice is 25 years old."
  
}

console.log(aboutMe());
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Using \`=\` when you mean \`===\`.** \`=\` assigns a value, \`===\` compares two values.
- ❌ **Forgetting quotes on strings.** \`const name = Alice;\` looks for a variable called \`Alice\`. Use \`const name = "Alice";\`.
- ❌ **Reassigning a \`const\`.** If you use \`const\`, you cannot change that variable later. Use \`let\` if you need to update the value.
- ❌ **Using a reserved keyword.** You cannot name a variable \`let\`, \`const\`, \`function\`, or \`return\`.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

interface HintInput { orderIndex: number; content: string; }
interface TestCaseInput { inputData: string; expected: string; isHidden: boolean; }
interface ProblemInput {
  title: string;
  orderIndex: number;
  difficulty: Difficulty;
  type: ProblemType;
  description: string;
  starterCode: string;
  hints: HintInput[];
  testCases: TestCaseInput[];
}

const PROBLEMS: ProblemInput[] = [
  // -------- M2.1 ----------
  {
    title: 'JS: Profile Card',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Profile Card

Write a function called \`profile\` that takes two parameters — \`name\` (a string) and \`age\` (a number) — and returns a two-line profile card in this exact format:

\`\`\`
Name: <name>
Age: <age>
\`\`\`

> **Tip:** You can use a template literal (backticks \` \` \` \`) to build this string easily. It allows you to put variables directly inside the string using \`\${variableName}\`.
`.trim(),
    starterCode: `function profile(name, age) {
  // TODO: Build and return the two-line profile string.
}
`,
    hints: [
      { orderIndex: 1, content: 'You need to return a single string with a newline character `\\n` in the middle.' },
      { orderIndex: 2, content: 'Using a template literal, the shape looks like this:\n\n```javascript\nreturn `Name: ${name}\\nAge: ${age}`;\n```' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction profile(name, age) {\n  return `Name: ${name}\\nAge: ${age}`;\n}\n```' },
    ],
    testCases: [
      { inputData: 'profile("Alice", 25)', expected: '"Name: Alice\\nAge: 25"', isHidden: false },
      { inputData: 'profile("Bob", 40)', expected: '"Name: Bob\\nAge: 40"', isHidden: true },
    ],
  },

  // -------- M2.2 ----------
  {
    title: 'JS: Years to Days',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Years to Days

Write a function called \`toDays\` that takes a number \`years\` and returns the equivalent number of days (assume 365 days per year).
`.trim(),
    starterCode: `function toDays(years) {
  // TODO: Multiply years by 365 and return the result.
}
`,
    hints: [
      { orderIndex: 1, content: 'Multiplication in JavaScript is done using the asterisk `*` symbol.' },
      { orderIndex: 2, content: 'Simply multiply the input `years` by `365` and use the `return` keyword.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction toDays(years) {\n  return years * 365;\n}\n```' },
    ],
    testCases: [
      { inputData: 'toDays(1)', expected: '365', isHidden: false },
      { inputData: 'toDays(10)', expected: '3650', isHidden: true },
    ],
  },

  // -------- M2.3 ----------
  {
    title: 'JS: Rectangle Area',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Rectangle Area

Write a function called \`rectangleArea\` that takes two numbers — \`width\` and \`height\` — and returns the area of the rectangle (\`width * height\`).
`.trim(),
    starterCode: `function rectangleArea(width, height) {
  // TODO: Return width multiplied by height.
}
`,
    hints: [
      { orderIndex: 1, content: 'Take the two inputs and multiply them using the `*` operator.' },
      { orderIndex: 2, content: 'The function body should be a single line: `return width * height;`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction rectangleArea(width, height) {\n  return width * height;\n}\n```' },
    ],
    testCases: [
      { inputData: 'rectangleArea(3, 4)', expected: '12', isHidden: false },
      { inputData: 'rectangleArea(2.5, 4)', expected: '10', isHidden: true },
    ],
  },

  // -------- M2.4 ----------
  {
    title: 'JS: Swap Values',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Swap Values

Write a function called \`swap\` that takes two values \`a\` and \`b\` and returns them **swapped** — \`b\` first, then \`a\`, inside an array: \`[b, a]\`.
`.trim(),
    starterCode: `function swap(a, b) {
  // TODO: Return an array containing b followed by a.
}
`,
    hints: [
      { orderIndex: 1, content: 'You need to create and return an array. An array is written with square brackets `[]`.' },
      { orderIndex: 2, content: 'Put `b` in the first position and `a` in the second: `[b, a]`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction swap(a, b) {\n  return [b, a];\n}\n```' },
    ],
    testCases: [
      { inputData: 'swap(1, 2)', expected: '[2,1]', isHidden: false },
      { inputData: 'swap("hi", "there")', expected: '["there","hi"]', isHidden: true },
    ],
  },

  // -------- M2.5 ----------
  {
    title: 'JS: Temp Converter',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Temp Converter (Celsius to Fahrenheit)

Write a function called \`celsiusToFahrenheit\` that takes a temperature in Celsius and returns Fahrenheit.

### Formula
\`F = C * 9 / 5 + 32\`
`.trim(),
    starterCode: `function celsiusToFahrenheit(c) {
  // TODO: Apply the formula and return the result.
}
`,
    hints: [
      { orderIndex: 1, content: 'Apply the math in order: multiply by 9, divide by 5, then add 32.' },
      { orderIndex: 2, content: 'The expression looks like: `c * 9 / 5 + 32`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction celsiusToFahrenheit(c) {\n  return c * 9 / 5 + 32;\n}\n```' },
    ],
    testCases: [
      { inputData: 'celsiusToFahrenheit(0)', expected: '32', isHidden: false },
      { inputData: 'celsiusToFahrenheit(100)', expected: '212', isHidden: true },
      { inputData: 'celsiusToFahrenheit(37)', expected: '98.6', isHidden: true },
    ],
  },

  // -------- M2.6 ----------
  {
    title: 'JS: What Type?',
    orderIndex: 6,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## What Type?

Write a function called \`describe\` that takes a value and returns the **name** of its type as a string — like \`"number"\`, \`"string"\`, or \`"boolean"\`.

> **Tip:** Use the **\`typeof\`** operator.
`.trim(),
    starterCode: `function describe(value) {
  // TODO: Use the typeof operator
}
`,
    hints: [
      { orderIndex: 1, content: 'The `typeof` operator returns a string representing the type.' },
      { orderIndex: 2, content: 'Your function should return the result of `typeof value`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction describe(value) {\n  return typeof value;\n}\n```' },
    ],
    testCases: [
      { inputData: 'describe(5)', expected: '"number"', isHidden: false },
      { inputData: 'describe("hello")', expected: '"string"', isHidden: true },
      { inputData: 'describe(true)', expected: '"boolean"', isHidden: true },
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
