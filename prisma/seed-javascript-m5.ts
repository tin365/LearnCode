/**
 * Wave — JavaScript Module 5 "Making Decisions"
 *
 * Adds the JavaScript M5 lesson plus 6 problems.
 *
 * Run:  pnpm tsx prisma/seed-javascript-m5.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'javascript';
const MODULE_ORDER_INDEX = 105; // JavaScript Base (100) + Module 5
const MODULE = {
  title: 'Making Decisions',
  description: 'Use if/else to branch your code based on conditions.',
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
  title: 'Conditional Logic',
  estimatedMinutes: 15,
  concepts: ['if/else', 'comparison operators', 'strict equality', 'logical operators'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'The Fork in the Road',
      content: `A smart program needs to make choices. Should the app let the user log in? Is this number even or odd? Did the player win the game?

In programming, we call this **conditional logic**. It's like a fork in the road: if a certain condition is true, the program takes one path; if it's false, it takes another. This is the foundation of all "intelligence" in software.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'if, else if, and else',
      content: `In JavaScript, we use **if statements** to check conditions. A condition is anything that results in a boolean (\`true\` or \`false\`).

- **\`if\`**: Runs a block of code only if the condition is true.
- **\`else if\`**: Checks a new condition if the first one was false.
- **\`else\`**: Runs a block of code if *none* of the above were true.

Comparison operators:
- **\`===\`**: Strict equal to (best practice in JS!)
- **\`!==\`**: Not equal to
- **\`>\` / \`<\`**: Greater / Less than
- **\`>=\` / \`<=\`**: Greater / Less than or equal to`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'The syntax for making decisions in JavaScript:',
      code: `const score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else {
  console.log("Keep trying!");
}

// Logical Operators
// && (AND) - Both must be true
// || (OR)  - At least one must be true
// !  (NOT) - Reverses the value`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Can you ride?',
      content: `**Example:** Checking if someone can ride a roller coaster (must be 48 inches tall AND have a ticket).

\`\`\`javascript
function canRide(height, hasTicket) {
  if (height >= 48 && hasTicket) {
    return true;
  } else {
    return false;
  }
}
\`\`\`

If \`height = 50\` and \`hasTicket = true\`, the \`&&\` operator sees that both are true, so the whole condition passes. If either one is false, the ride is a no-go!`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: positive or negative',
      content: `Complete the function \`checkSign\` so that it returns \`"positive"\` if the number is > 0, \`"negative"\` if it's < 0, and \`"zero"\` if it's exactly 0.`,
      code: `function checkSign(n) {
  // TODO: Use if/else if/else
}

console.log(checkSign(5));
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Using \`=\` when you mean \`===\`.** \`=\` sets a value, \`===\` compares them.
- ❌ **Using \`==\` instead of \`===\`.** JavaScript's \`==\` is "loose" and can cause weird bugs (like \`1 == "1"\` being true). Always use the "strict" triple equals \`===\`.
- ❌ **Forgetting the parentheses.** The condition in an \`if\` statement MUST be inside parentheses: \`if (condition) { ... }\`.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const PROBLEMS: ProblemInput[] = [
  // -------- M5.1 ----------
  {
    title: 'JS: Even or Odd',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Even or Odd

Complete the function \`isEven\` that takes a number and returns \`true\` if it is even, and \`false\` if it is odd.

> **Tip:** Use the modulo operator \`%\`. If \`n % 2 === 0\`, it's even.
`.trim(),
    starterCode: `function isEven(n) {
  // TODO: Return true if even
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the modulo operator `%`.' },
      { orderIndex: 2, content: 'If the remainder when divided by 2 is 0, it is even.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction isEven(n) {\n  return n % 2 === 0;\n}\n```' },
    ],
    testCases: [
      { inputData: 'isEven(4)', expected: 'true', isHidden: false },
      { inputData: 'isEven(7)', expected: 'false', isHidden: true },
    ],
  },

  // -------- M5.2 ----------
  {
    title: 'JS: Sign Checker',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Sign Checker

Complete the function \`checkSign\` that returns:
- \`"positive"\` if > 0
- \`"negative"\` if < 0
- \`"zero"\` if 0
`.trim(),
    starterCode: `function checkSign(n) {
  // TODO: Use if/else if/else
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `if (n > 0)` for positive numbers.' },
      { orderIndex: 2, content: 'Use `else if (n < 0)` for negative numbers.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction checkSign(n) {\n  if (n > 0) return "positive";\n  else if (n < 0) return "negative";\n  else return "zero";\n}\n```' },
    ],
    testCases: [
      { inputData: 'checkSign(5)', expected: '"positive"', isHidden: false },
      { inputData: 'checkSign(-3)', expected: '"negative"', isHidden: true },
      { inputData: 'checkSign(0)', expected: '"zero"', isHidden: true },
    ],
  },

  // -------- M5.3 ----------
  {
    title: 'JS: Larger of Two',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Larger of Two

Complete the function \`max\` that takes two numbers and returns the larger one.
`.trim(),
    starterCode: `function max(a, b) {
  // TODO: Return larger number
}
`,
    hints: [
      { orderIndex: 1, content: 'Check if `a > b`.' },
      { orderIndex: 2, content: 'If `a` is larger, return `a`. Else return `b`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction max(a, b) {\n  if (a > b) return a;\n  else return b;\n}\n```' },
    ],
    testCases: [
      { inputData: 'max(10, 20)', expected: '20', isHidden: false },
      { inputData: 'max(50, 5)', expected: '50', isHidden: true },
    ],
  },

  // -------- M5.4 ----------
  {
    title: 'JS: Grade Calculator',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Grade Calculator

Complete the function \`getGrade\` that returns a letter grade:
- 90+: \`"A"\`
- 80-89: \`"B"\`
- 70-79: \`"C"\`
- 60-69: \`"D"\`
- < 60: \`"F"\`
`.trim(),
    starterCode: `function getGrade(score) {
  // TODO: Return A, B, C, D, or F
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a chain of `else if` statements.' },
      { orderIndex: 2, content: 'Start from 90 and work down.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction getGrade(score) {\n  if (score >= 90) return "A";\n  else if (score >= 80) return "B";\n  else if (score >= 70) return "C";\n  else if (score >= 60) return "D";\n  else return "F";\n}\n```' },
    ],
    testCases: [
      { inputData: 'getGrade(95)', expected: '"A"', isHidden: false },
      { inputData: 'getGrade(82)', expected: '"B"', isHidden: true },
      { inputData: 'getGrade(45)', expected: '"F"', isHidden: true },
    ],
  },

  // -------- M5.5 ----------
  {
    title: 'JS: Leap Year',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Leap Year Checker

Complete the function \`isLeapYear\` that returns \`true\` if a year is a leap year.

Rules:
1. Divisible by 4.
2. BUT if divisible by 100, must also be divisible by 400.
`.trim(),
    starterCode: `function isLeapYear(year) {
  // TODO: Implement logic
}
`,
    hints: [
      { orderIndex: 1, content: 'Check `year % 4 === 0` first.' },
      { orderIndex: 2, content: 'Handle the 100 and 400 cases using nested if or logical operators.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction isLeapYear(year) {\n  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);\n}\n```' },
    ],
    testCases: [
      { inputData: 'isLeapYear(2024)', expected: 'true', isHidden: false },
      { inputData: 'isLeapYear(1900)', expected: 'false', isHidden: true },
      { inputData: 'isLeapYear(2000)', expected: 'true', isHidden: true },
    ],
  },

  // -------- M5.6 ----------
  {
    title: 'JS: Simple Login',
    orderIndex: 6,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Simple Login

Complete the function \`canLogin\` that returns \`true\` if \`user\` is "admin" AND \`pass\` is "secret123".
`.trim(),
    starterCode: `function canLogin(user, pass) {
  // TODO: Check user and pass
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `&&` (AND) operator.' },
      { orderIndex: 2, content: 'Compare both inputs to their expected values.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction canLogin(user, pass) {\n  return user === "admin" && pass === "secret123";\n}\n```' },
    ],
    testCases: [
      { inputData: 'canLogin("admin", "secret123")', expected: 'true', isHidden: false },
      { inputData: 'canLogin("admin", "wrong")', expected: 'false', isHidden: true },
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
