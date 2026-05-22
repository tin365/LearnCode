/**
 * Wave — JavaScript Module 11 "Debugging & Reading Errors"
 *
 * Adds the JavaScript M11 lesson plus 5 DEBUG problems.
 *
 * Run:  pnpm tsx prisma/seed-javascript-m11.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'javascript';
const MODULE_ORDER_INDEX = 111; // JavaScript Base (100) + Module 11
const MODULE = {
  title: 'Debugging & Reading Errors',
  description: 'Read error messages and fix broken code.',
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
  concepts: ['ReferenceError', 'TypeError', 'SyntaxError', 'Stack Traces'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Breaking Things is Good',
      content: `Every professional programmer spends more time fixing bugs than writing new code. It's just a part of the job!

When your program crashes, JavaScript doesn't just stop — it gives you a **report** called an Error. Learning how to read these reports is like learning a superpower. Instead of guessing what's wrong, you'll know exactly where the problem is and how to fix it.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Common JavaScript Errors',
      content: `The most important part of an error message is the **type**. Here are the ones you'll see most often:

- **\`ReferenceError\`**: You tried to use a variable that hasn't been created yet (or you misspelled its name).
- **\`TypeError\`**: You tried to do something impossible with a value, like calling a number as if it were a function (\`5()\`) or reading a property of \`null\`.
- **\`SyntaxError\`**: You made a typo in the language itself, like forgetting a curly brace \`}\` or a parenthesis \`)\`.

The error will also include a **Stack Trace**, which lists the line numbers where the problem occurred.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Reading a JavaScript error:',
      code: `Uncaught ReferenceError: name is not defined
    at greet (app.js:5:10)
    at main (app.js:10:3)

// 1. Error Type: ReferenceError
// 2. Message: 'name' is not defined
// 3. Where: Line 5 of app.js, inside the 'greet' function`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Fixing the Type Error',
      content: `**Example:** This code crashes if someone passes \`null\` as the user.

\`\`\`javascript
function getUsername(user) {
  return user.name; // CRASH if user is null!
}
\`\`\`

**The Fix:** Always "defend" your code by checking if the object exists before reaching inside it.

\`\`\`javascript
function getUsername(user) {
  if (!user) {
    return "Guest";
  }
  return user.name; // Safe!
}
\`\`\`

By adding a simple \`if\` check, we've made our code robust — it can handle unexpected data without crashing.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Spot the Bug',
      content: `The code below is supposed to return the first character of a string, but it has a major flaw. Can you see what happens if the string is empty?`,
      code: `function getFirstChar(s) {
  // This will return undefined if the string is empty ("")
  return s[0];
}

console.log(getFirstChar(""));
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Ignoring the error message.** Many beginners see red text and immediately close it. Don't! The answer to your problem is usually in the first two lines.
- ❌ **Guessing and Checking.** Don't change random lines of code hoping it works. Use the line number in the error message to find the exact spot.
- ❌ **Forgetting Edge Cases.** Does your code work with 0? Does it work with an empty list? Does it work with \`null\`? Most bugs live in these "edge" scenarios.`,
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
    title: 'JS: Fix the Reference',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.DEBUG,
    description: `
## Fix the ReferenceError

The function below is supposed to return a greeting, but it crashes because of a typo.

**Your Job:** Fix the variable name so the code runs correctly.
`.trim(),
    starterCode: `function greet(name) {
  const message = "Hello, " + name;
  return mesage;
}
`,
    hints: [
      { orderIndex: 1, content: 'Look closely at the word `mesage` in the return line.' },
      { orderIndex: 2, content: 'Check the spelling against the variable created on the previous line.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction greet(name) {\n  const message = "Hello, " + name;\n  return message;\n}\n```' },
    ],
    testCases: [
      { inputData: 'greet("Alice")', expected: '"Hello, Alice"', isHidden: false },
    ],
  },

  // -------- M11.2 ----------
  {
    title: 'JS: Fix the Type',
    orderIndex: 2,
    difficulty: Difficulty.medium,
    type: ProblemType.DEBUG,
    description: `
## Fix the TypeError

The function \`shout\` below is supposed to convert a string to uppercase. However, it crashes if the input is \`null\` or \`undefined\`.

**Your Job:** Add a check at the beginning. If \`s\` is missing (falsy), return an empty string \`""\`.
`.trim(),
    starterCode: `function shout(s) {
  return s.toUpperCase();
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `if (!s)` to check if the string is missing.' },
      { orderIndex: 2, content: 'If the check is true, `return "";`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction shout(s) {\n  if (!s) return "";\n  return s.toUpperCase();\n}\n```' },
    ],
    testCases: [
      { inputData: 'shout("hello")', expected: '"HELLO"', isHidden: false },
      { inputData: 'shout(null)', expected: '""', isHidden: true },
    ],
  },

  // -------- M11.3 ----------
  {
    title: 'JS: Fix the Logic',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.DEBUG,
    description: `
## Fix the Logic Error

This function is supposed to return \`true\` if a number is positive (greater than 0). But it currently returns \`true\` for 0 as well.

**Your Job:** Fix the comparison operator so it only returns \`true\` for numbers **strictly greater** than 0.
`.trim(),
    starterCode: `function isPositive(n) {
  return n >= 0;
}
`,
    hints: [
      { orderIndex: 1, content: 'The `>=` operator means "greater than or equal to".' },
      { orderIndex: 2, content: 'Change it to just `>`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction isPositive(n) {\n  return n > 0;\n}\n```' },
    ],
    testCases: [
      { inputData: 'isPositive(5)', expected: 'true', isHidden: false },
      { inputData: 'isPositive(0)', expected: 'false', isHidden: true },
      { inputData: 'isPositive(-1)', expected: 'false', isHidden: true },
    ],
  },

  // -------- M11.4 ----------
  {
    title: 'JS: Off-by-One Loop',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.DEBUG,
    description: `
## Off-by-One Loop

This loop is supposed to return the sum of numbers from 1 up to **and including** \`n\`. But for \`n=3\`, it returns 3 instead of 6.

**Your Job:** Fix the loop condition so it includes the number \`n\`.
`.trim(),
    starterCode: `function sumUpTo(n) {
  let sum = 0;
  for (let i = 1; i < n; i++) {
    sum += i;
  }
  return sum;
}
`,
    hints: [
      { orderIndex: 1, content: 'Look at the loop condition: `i < n`.' },
      { orderIndex: 2, content: 'This condition stops *before* reaching `n`.' },
      { orderIndex: 3, content: 'Change it to `i <= n`.' },
    ],
    testCases: [
      { inputData: 'sumUpTo(3)', expected: '6', isHidden: false },
      { inputData: 'sumUpTo(5)', expected: '15', isHidden: true },
    ],
  },

  // -------- M11.5 ----------
  {
    title: 'JS: Fix the Object',
    orderIndex: 5,
    difficulty: Difficulty.hard,
    type: ProblemType.DEBUG,
    description: `
## Fix the Property Access

This function is supposed to return the user's name from an object. But the key name is stored in a variable \`key\`. 

The current code uses **dot notation**, which is looking for a literal property called "key" instead of using the value *inside* the variable.

**Your Job:** Fix the code to use **bracket notation**.
`.trim(),
    starterCode: `function getValue(user, key) {
  // This looks for user.key, not user["name"]
  return user.key;
}
`,
    hints: [
      { orderIndex: 1, content: 'When the property name is in a variable, you must use square brackets `[]`.' },
      { orderIndex: 2, content: 'Change `user.key` to `user[key]`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction getValue(user, key) {\n  return user[key];\n}\n```' },
    ],
    testCases: [
      { inputData: 'getValue({"name": "Alice"}, "name")', expected: '"Alice"', isHidden: false },
      { inputData: 'getValue({"age": 25}, "age")', expected: '25', isHidden: true },
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
