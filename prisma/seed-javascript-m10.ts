/**
 * Wave — JavaScript Module 10 "Functions (Going Deeper)"
 *
 * Adds the JavaScript M10 lesson plus 5 problems.
 *
 * Run:  pnpm tsx prisma/seed-javascript-m10.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'javascript';
const MODULE_ORDER_INDEX = 110; // JavaScript Base (100) + Module 10
const MODULE = {
  title: 'Functions (Going Deeper)',
  description: 'Arrow functions, default parameters, and organizing code.',
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
  title: 'Mastering Functions',
  estimatedMinutes: 15,
  concepts: ['Arrow Functions', 'Default Parameters', 'Rest Parameters', 'Scope'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Building Blocks of Logic',
      content: `As your programs grow larger, you can't just write one long list of instructions. You need to break your code into small, specialized tools that you can reuse.

In this module, you'll learn how to take your functions to the next level. You'll learn shorter ways to write them, how to handle "optional" information, and how to keep your variables organized so they don't get mixed up.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Modern Function Patterns',
      content: `JavaScript has evolved to make functions more powerful and less wordy:

1. **Arrow Functions**: A shorter way to write functions using the \`=>\` syntax.
2. **Default Parameters**: You can set a "fallback" value if the person calling your function forgets to provide an input.
3. **Rest Parameters (\`...\`)**: Allows a function to accept any number of inputs as an array.

Every function also has its own **Scope**. Variables created inside a function only exist for as long as that function is running.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Advanced function patterns in JavaScript:',
      code: `// --- Arrow Function ---
const greet = (name) => \`Hello \${name}\`;

// --- Default Parameters ---
function welcome(name = "Guest") {
  return \`Welcome, \${name}!\`;
}

// --- Rest Parameters ---
function sumAll(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

// --- Scope ---
function test() {
  const x = 10; // Only exists inside test()
}`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'The Flexible Greet',
      content: `**Example:** Using default parameters to handle missing data gracefully.

\`\`\`javascript
function greet(name = "Friend", timeOfDay = "Day") {
  return \`Good \${timeOfDay}, \${name}!\`;
}

console.log(greet()); // "Good Day, Friend!"
console.log(greet("Alice")); // "Good Day, Alice!"
console.log(greet("Bob", "Morning")); // "Good Morning, Bob!"
\`\`\`

By providing defaults, our function works perfectly even if the caller only provides some (or none) of the information.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Power Method',
      content: `Complete the function \`power\` that calculates \`base\` raised to the exponent \`exp\`. Use a default value of \`2\` for the exponent so it squares the number by default.`,
      code: `function power(base, exp = 2) {
  // TODO: Use Math.pow or the ** operator
}

console.log(power(3)); // Should be 9
console.log(power(2, 3)); // Should be 8
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Accessing local variables outside.** You cannot use a variable created inside a function in the rest of your code.
- ❌ **Confusing the order of defaults.** Parameters with defaults should generally come *after* parameters without them.
- ❌ **Forgetting the return in arrow functions.** If you use curly braces \`{ }\` in an arrow function, you MUST use the \`return\` keyword. If you don't use braces, the return is automatic.`,
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
    title: 'JS: Arrow Addition',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Arrow Addition

Rewrite the following function as a one-line **arrow function** assigned to the variable \`add\`.

\`\`\`javascript
function add(a, b) {
  return a + b;
}
\`\`\`
`.trim(),
    starterCode: `const add = (a, b) => {
  // TODO: Finish this arrow function
};
`,
    hints: [
      { orderIndex: 1, content: 'An arrow function looks like `(args) => expression`.' },
      { orderIndex: 2, content: 'If it\'s on one line, you don\'t need the `return` keyword or curly braces.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nconst add = (a, b) => a + b;\n```' },
    ],
    testCases: [
      { inputData: 'add(5, 10)', expected: '15', isHidden: false },
      { inputData: 'add(-1, 1)', expected: '0', isHidden: true },
    ],
  },

  // -------- M10.2 ----------
  {
    title: 'JS: Default Greeting',
    orderIndex: 2,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Default Greeting

Complete the function \`greet\` so that it takes a \`name\` and returns \`"Hello, <name>!"\`.

If no name is provided (it is \`undefined\`), it should default to **\`"Guest"\`**.
`.trim(),
    starterCode: `function greet(name) {
  // TODO: Use a default parameter
}
`,
    hints: [
      { orderIndex: 1, content: 'You can set a default in the function definition: `function greet(name = "Value")`.' },
      { orderIndex: 2, content: 'Use a template literal to build the string.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction greet(name = "Guest") {\n  return `Hello, ${name}!`;\n}\n```' },
    ],
    testCases: [
      { inputData: 'greet("Alice")', expected: '"Hello, Alice!"', isHidden: false },
      { inputData: 'greet()', expected: '"Hello, Guest!"', isHidden: true },
    ],
  },

  // -------- M10.3 ----------
  {
    title: 'JS: Sum All',
    orderIndex: 3,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Sum All Arguments

Complete the function \`sumAll\` so that it takes **any number** of arguments and returns their total sum.

> **Tip:** Use the **rest parameter** syntax (\`...args\`) to collect all inputs into an array.
`.trim(),
    starterCode: `function sumAll(...numbers) {
  // TODO: Loop through numbers and add them up
}
`,
    hints: [
      { orderIndex: 1, content: '`numbers` is now an array of all the arguments passed in.' },
      { orderIndex: 2, content: 'Use a `for...of` loop or the `.reduce()` method.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction sumAll(...numbers) {\n  let total = 0;\n  for (let n of numbers) total += n;\n  return total;\n}\n```' },
    ],
    testCases: [
      { inputData: 'sumAll(1, 2, 3, 4)', expected: '6', isHidden: false },
      { inputData: 'sumAll(10, 20)', expected: '30', isHidden: true },
      { inputData: 'sumAll()', expected: '0', isHidden: true },
    ],
  },

  // -------- M10.4 ----------
  {
    title: 'JS: Double and Add',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Function Composition

Complete the function \`doubleAndAdd\` which takes three numbers. It should:
1. Double each number.
2. Return the sum of the doubled numbers.

**Requirement:** You must create and use a helper function called \`double(n)\` inside your code.
`.trim(),
    starterCode: `function doubleAndAdd(a, b, c) {
  // TODO: Create a helper function 'double'
  // TODO: Use it on a, b, and c and return the sum
}
`,
    hints: [
      { orderIndex: 1, content: 'Define `const double = (n) => n * 2;` inside your function.' },
      { orderIndex: 2, content: 'Call it three times and add the results.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction doubleAndAdd(a, b, c) {\n  const double = (n) => n * 2;\n  return double(a) + double(b) + double(c);\n}\n```' },
    ],
    testCases: [
      { inputData: 'doubleAndAdd(1, 2, 3)', expected: '12', isHidden: false },
      { inputData: 'doubleAndAdd(10, 10, 10)', expected: '60', isHidden: true },
    ],
  },

  // -------- M10.5 ----------
  {
    title: 'JS: Calculator Dispatch',
    orderIndex: 5,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Calculator Dispatch

Complete the function \`calculate\` that takes two numbers (\`a\`, \`b\`) and an operator (\`String\`). Use a \`switch\` statement to perform the calculation.

Supported operators: \`"add"\`, \`"sub"\`, \`"mul"\`, \`"div"\`.

If the operator is unknown, return \`null\`.
`.trim(),
    starterCode: `function calculate(a, b, op) {
  // TODO: Use a switch on 'op'
}
`,
    hints: [
      { orderIndex: 1, content: 'The syntax is `switch(op) { case "add": ... }`.' },
      { orderIndex: 2, content: 'Don\'t forget to use `return` in each case.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nswitch(op) {\n  case "add": return a + b;\n  case "sub": return a - b;\n  case "mul": return a * b;\n  case "div": return a / b;\n  default: return null;\n}\n```' },
    ],
    testCases: [
      { inputData: 'calculate(10, 5, "add")', expected: '15', isHidden: false },
      { inputData: 'calculate(10, 5, "mul")', expected: '50', isHidden: true },
      { inputData: 'calculate(10, 5, "unknown")', expected: 'null', isHidden: true },
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
