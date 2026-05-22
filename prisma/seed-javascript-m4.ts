/**
 * Wave — JavaScript Module 4 "Getting Input from the User"
 *
 * Adds the JavaScript M4 lesson plus 4 problems.
 * Note: Adapted to function parameters as input per the authoring brief.
 *
 * Run:  pnpm tsx prisma/seed-javascript-m4.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'javascript';
const MODULE_ORDER_INDEX = 104; // JavaScript Base (100) + Module 4
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
  concepts: ['Parameters', 'Arguments', 'Interactive logic'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'A Conversation with Code',
      content: `A program that only ever does the same thing is like a movie — you can watch it, but you can't change it. For a program to be useful, it needs to **react to data** from the outside world.

Whether it's a search query, a user's age, or a click on a screen, "input" is what makes software interactive. In this module, you'll learn how to write code that takes different inputs and produces different results every time it runs.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Parameters as Input',
      content: `While real-world apps might get input from a keyboard, a mouse, or a server, in programming logic, we represent that input using **parameters**.

Think of a function like a machine. You put something in (the parameters), the machine processes it, and something comes out (the return value).

\`\`\`
Input (Parameters)  ──→  [ YOUR CODE ]  ──→  Output (Return)
\`\`\`

In JavaScript, we define the names of our inputs inside the parentheses: \`function square(number)\`. This tells JavaScript that whenever this function runs, it will be given a value to work with.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Using parameters to represent user input:',
      code: `// This function "asks" for a name input
function greet(name) {
  return \`Hello, \${name}!\`;
}

// This function "asks" for two number inputs
function add(a, b) {
  return a + b;
}

// When the computer calls your code, it provides the "input":
const output = greet("Alice");
const sum = add(5, 10);`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'The Welcome Badge',
      content: `**Example:** A program that greets a user and tells them how many characters are in their name.

\`\`\`javascript
function welcomeMessage(name) {
  const length = name.length;
  return \`Welcome \${name}! Your name has \${length} letters.\`;
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
      content: `Complete the function \`doubleNumber\` so that it takes a number \`n\` and returns that number multiplied by 2.`,
      code: `function doubleNumber(n) {
  // TODO: Multiply n by 2
}

console.log(doubleNumber(5)); // Should be 10
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Trying to use a variable that isn't a parameter.** You can only use the names provided in the parentheses (like \`n\` or \`name\`).
- ❌ **Forgetting the names in the parentheses.** If you write \`function greet() { return name; }\`, JavaScript won't know what \`name\` is!
- ❌ **Hardcoding the answer.** If a problem asks you to double a number, don't write \`return 10;\`. Write \`return n * 2;\` so it works for *any* number!`,
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
    title: 'JS: Welcome User',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Welcome User

Complete the function \`welcome\` that takes a \`name\` as input and returns a welcoming string:
\`Welcome to LearnCode, <name>!\`
`.trim(),
    starterCode: `function welcome(name) {
  // TODO: Build and return the welcome message
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `name` parameter provided to the function.' },
      { orderIndex: 2, content: 'Use a template literal: `Welcome to LearnCode, ${name}!`' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction welcome(name) {\n  return `Welcome to LearnCode, ${name}!`;\n}\n```' },
    ],
    testCases: [
      { inputData: 'welcome("Alice")', expected: '"Welcome to LearnCode, Alice!"', isHidden: false },
      { inputData: 'welcome("Bob")', expected: '"Welcome to LearnCode, Bob!"', isHidden: true },
    ],
  },

  // -------- M4.2 ----------
  {
    title: 'JS: Add From Input',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Add From Input

Complete the function \`addTwo\` that takes two numbers \`a\` and \`b\` and returns their sum.
`.trim(),
    starterCode: `function addTwo(a, b) {
  // TODO: Return the sum of a and b
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `+` operator on the two parameters.' },
      { orderIndex: 2, content: 'Simply write `return a + b;`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction addTwo(a, b) {\n  return a + b;\n}\n```' },
    ],
    testCases: [
      { inputData: 'addTwo(5, 10)', expected: '15', isHidden: false },
      { inputData: 'addTwo(-1, 1)', expected: '0', isHidden: true },
    ],
  },

  // -------- M4.3 ----------
  {
    title: 'JS: Square It',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Square It

Complete the function \`square\` that takes a number \`n\` and returns its square (\`n\` multiplied by itself).
`.trim(),
    starterCode: `function square(n) {
  // TODO: Return n squared
}
`,
    hints: [
      { orderIndex: 1, content: 'Multiply the input `n` by itself.' },
      { orderIndex: 2, content: 'Use the `*` operator: `n * n`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction square(n) {\n  return n * n;\n}\n```' },
    ],
    testCases: [
      { inputData: 'square(4)', expected: '16', isHidden: false },
      { inputData: 'square(0)', expected: '0', isHidden: true },
      { inputData: 'square(-3)', expected: '9', isHidden: true },
    ],
  },

  // -------- M4.4 ----------
  {
    title: 'JS: Tip Calculator',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Tip Calculator

Complete the function \`calculateTotal\` that takes a \`billAmount\` and a \`tipPercentage\` and returns the total amount including the tip.

### Formula
\`Total = Bill + (Bill * TipPercentage / 100)\`
`.trim(),
    starterCode: `function calculateTotal(billAmount, tipPercentage) {
  // TODO: Calculate and return the total
}
`,
    hints: [
      { orderIndex: 1, content: 'First calculate the tip amount: `billAmount * (tipPercentage / 100)`.' },
      { orderIndex: 2, content: 'Add the tip amount back to the original `billAmount`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction calculateTotal(billAmount, tipPercentage) {\n  return billAmount + (billAmount * tipPercentage / 100);\n}\n```' },
    ],
    testCases: [
      { inputData: 'calculateTotal(100, 15)', expected: '115', isHidden: false },
      { inputData: 'calculateTotal(50, 20)', expected: '60', isHidden: true },
      { inputData: 'calculateTotal(80, 10)', expected: '88', isHidden: true },
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
