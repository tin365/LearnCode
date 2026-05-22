/**
 * Wave — JavaScript Module 1 "First Lines of Code"
 *
 * Adds the JavaScript M1 lesson plus problems. Problems follow the
 * function-return convention used by the grader.
 *
 * Run:  pnpm tsx prisma/seed-javascript-m1.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'javascript';
const MODULE_ORDER_INDEX = 101; // JavaScript Base (100) + Module 1
const MODULE = {
  title: 'First Lines of Code',
  description: 'Your first JavaScript: console.log, strings, functions, comments.',
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
  title: 'First Lines of JavaScript',
  estimatedMinutes: 10,
  concepts: ['console.log', 'strings', 'functions', 'comments'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Make the Browser Talk',
      content: `The first thing every programmer wants to do is **make the computer say something**. That's not just a tradition — it's a sanity check. If you can make text appear on the screen, you know your environment works, your code runs, and you have a solid baseline to build on.

In this module, you'll learn how to print messages, group instructions using your first functions, and leave notes in your code with comments. These may seem like tiny skills, but every advanced program you will ever write builds directly on top of them!`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'console.log, strings, functions, comments',
      content: `Four basic ideas are all you need to write and understand your first programs:

- **\`console.log\`** is JavaScript's built-in tool to print text to the output screen. Think of it like a megaphone. You call it using parentheses: \`console.log("Hello")\`.
- A **string** is text wrapped in quotes. \`"Hello"\` (double quotes) and \`'Hello'\` (single quotes) are both valid strings. Choose one style and be consistent.
- A **function** is a named package of instructions. It's like a recipe. Inside a function, the **\`return\`** keyword sends a result back to whoever asked for it.
- **Comments** start with \`//\` in JavaScript. The computer completely ignores them! They are sticky notes written to help humans read and understand the code.

All LearnCode problems follow the same structure: you fill in a function that **returns** the answer. The grader checks the returned value, and you get feedback immediately.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'The basic pieces side by side:',
      code: `// A comment — ignored by JavaScript

// console.log prints text to the screen
console.log("Hello!");

// Strings are text enclosed in quotes
const greeting = "Hello";

// A function that packages instructions and returns a value
function greet() {
  return "Hello, World!";
}

// Call the function and print the result
console.log(greet());`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'From log to return',
      content: `**Example 1:** The simplest way to display text is by calling \`console.log\` directly.

\`\`\`javascript
console.log("Welcome to JavaScript!");
\`\`\`

When this single line runs, you will see the sentence in the terminal output.

**Example 2:** Reusable code. We wrap our code in a **function** so we can run it whenever we want.

\`\`\`javascript
function welcomeMessage() {
  return "Welcome to JavaScript!";
}

// We call the function and print the result it hands back:
console.log(welcomeMessage());
\`\`\`

Notice that the function \`welcomeMessage\` doesn't print anything on its own. It **returns** the string. The \`console.log\` statement outside the function takes that returned string and prints it to the screen. Keeping the creation of a value separate from how you display it is one of the most important concepts in programming!`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: A One-Line Hello',
      content: `Complete the function \`sayHello\` below so that it returns the string \`"Hello!"\`. When you press Run, the \`console.log(sayHello())\` at the bottom will print the result to the output screen.`,
      code: `function sayHello() {
  // Return the string "Hello!" below:
  
}

console.log(sayHello());
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Forgetting quotes around a string.** Writing \`return Hello;\` makes JavaScript look for a variable named \`Hello\`. Since it doesn't exist, the program will crash. Use quotes: \`return "Hello";\`.
- ❌ **Casing errors on console.log.** Writing \`Console.log("Hello");\` or \`console.Log("Hello");\` will fail. JavaScript is strictly case-sensitive. Always write lowercase \`console.log\`.
- ❌ **Logging instead of returning.** Writing \`console.log("Hello")\` inside a function prints the text, but the function returns \`undefined\`. LearnCode checks the *return* value, so make sure to use the \`return\` keyword!
- ❌ **Unmatched curly braces.** If you open a function with \`{\`, you must close it with \`}\`. Forgetting the closing brace leads to syntax errors.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

interface HintInput {
  orderIndex: number;
  content: string;
}

interface TestCaseInput {
  inputData: string;
  expected: string;
  isHidden: boolean;
}

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
  // -------- M1.1 ----------
  {
    title: 'JS: Hello, World!',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Hello, World!

The ultimate programming tradition: making the computer speak to you!

Write a function called \`helloWorld\` that takes no parameters and returns the exact string:

\`\`\`
Hello, World!
\`\`\`

### Example

\`\`\`javascript
const result = helloWorld();
console.log(result); // Hello, World!
\`\`\`

> **Tip:** Strings are text enclosed in matching quotes (double \`"\` or single \`'\`). Be careful with the spelling, capitalization, space, and punctuation — they must match exactly!
`.trim(),
    starterCode: `function helloWorld() {
  // TODO: Return the string "Hello, World!"
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'Your function needs to return a string. Remember to use the `return` keyword followed by the text in quotes.',
      },
      {
        orderIndex: 2,
        content: 'The structure of your code should look like this:\n\n```javascript\nfunction helloWorld() {\n  return "your text here";\n}\n```',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete working solution:\n\n```javascript\nfunction helloWorld() {\n  return "Hello, World!";\n}\n```',
      },
    ],
    testCases: [
      { inputData: 'helloWorld()', expected: '"Hello, World!"', isHidden: false },
      { inputData: 'typeof helloWorld()', expected: '"string"', isHidden: true },
      { inputData: 'helloWorld().length', expected: '13', isHidden: true },
    ],
  },

  // -------- M1.2 ----------
  {
    title: 'JS: Greet by Name',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Greet by Name

Now let's take a step forward and greet **anyone** by their name!

Write a function called \`greet\` that takes one parameter \`name\` (a string) and returns a personalized greeting in this exact format:

\`\`\`
Hello, <name>!
\`\`\`

### Example

\`\`\`javascript
const result = greet("Alice");
console.log(result); // Hello, Alice!
\`\`\`

> **Tip:** You can combine strings by adding them together using the \`+\` operator (called concatenation), or by using a **template literal** enclosed in backticks (\` \` \` \`) with \`\${name}\` inside it.
`.trim(),
    starterCode: `function greet(name) {
  // TODO: Build and return the greeting below.
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'Your function receives a parameter `name`. You need to stick it between the string `"Hello, "` and the string `"\!"`.',
      },
      {
        orderIndex: 2,
        content: 'Using string addition, you can write:\n\n```javascript\n"Hello, " + name + "!"\n```\nMake sure to include the space after the comma!',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete solution using string addition:\n\n```javascript\nfunction greet(name) {\n  return "Hello, " + name + "!";\n}\n```\nAlternatively, you can use a template literal:\n\n```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n```',
      },
    ],
    testCases: [
      { inputData: 'greet("Alice")', expected: '"Hello, Alice!"', isHidden: false },
      { inputData: 'greet("Bob")', expected: '"Hello, Bob!"', isHidden: true },
      { inputData: 'greet("World")', expected: '"Hello, World!"', isHidden: true },
      { inputData: 'typeof greet("X")', expected: '"string"', isHidden: true },
    ],
  },

  // -------- M1.3 ----------
  {
    title: 'JS: Three Lines',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Three Lines

Write a function called \`verses\` that takes no parameters and returns a **single string** containing exactly three lines of text. Use the newline character \`\\n\` to separate the lines.

The exact text the function must return is:

\`\`\`
The sky is blue.
The grass is green.
The code runs clean.
\`\`\`

### Example

\`\`\`javascript
console.log(verses());
// The sky is blue.
// The grass is green.
// The code runs clean.
\`\`\`

> **Tip:** \`\\n\` represents a single newline character. Putting it inside a string splits the text onto a new line when printed.
`.trim(),
    starterCode: `function verses() {
  // TODO: Return the three-line string below.
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'You only need to return a single string. The newline breaks are represented as `\\n` inside that string.',
      },
      {
        orderIndex: 2,
        content: 'The structure of your string should look like this:\n\n```javascript\n"line one\\nline two\\nline three"\n```\nSimply replace the placeholders with the actual text.',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete solution:\n\n```javascript\nfunction verses() {\n  return "The sky is blue.\\nThe grass is green.\\nThe code runs clean.";\n}\n```\nCapitalization, spelling, and periods must match exactly!',
      },
    ],
    testCases: [
      {
        inputData: 'verses()',
        expected: '"The sky is blue.\\nThe grass is green.\\nThe code runs clean."',
        isHidden: false,
      },
      { inputData: 'verses().split("\\n").length', expected: '3', isHidden: true },
      { inputData: 'verses().includes("blue")', expected: 'true', isHidden: true },
      { inputData: 'verses().includes("green")', expected: 'true', isHidden: true },
    ],
  },

  // -------- M1.4 ----------
  {
    title: 'JS: Escape Characters',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Escape Characters

Inside strings, **\`\\n\`** means a newline and **\`\\t\`** means a horizontal tab indentation. Together they let you format text neatly with one string.

Write a function called \`nameTag\` that takes one parameter \`name\` and returns a name tag string in this exact format:

\`\`\`
HELLO
\tmy name is <name>
\`\`\`

(The second line must start with a tab character, followed by the literal text \`my name is \`, and then the given name.)

### Example

\`\`\`javascript
console.log(nameTag("Sam"));
// HELLO
//     my name is Sam
\`\`\`
`.trim(),
    starterCode: `function nameTag(name) {
  // TODO: Use \\n for the newline and \\t for the tab.
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'Your function needs to return a single string that contains both a newline and a tab, joined with the `name` parameter.',
      },
      {
        orderIndex: 2,
        content: 'Draft the text layout first:\n\n```javascript\n"HELLO\\n\\tmy name is " + name\n```\nThis combines the escape characters and attaches the name at the end.',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete solution:\n\n```javascript\nfunction nameTag(name) {\n  return "HELLO\\n\\tmy name is " + name;\n}\n```',
      },
    ],
    testCases: [
      { inputData: 'nameTag("Sam")', expected: '"HELLO\\n\\tmy name is Sam"', isHidden: false },
      { inputData: 'nameTag("Alex")', expected: '"HELLO\\n\\tmy name is Alex"', isHidden: true },
      { inputData: 'nameTag("X").includes("\\n")', expected: 'true', isHidden: true },
      { inputData: 'nameTag("X").includes("\\t")', expected: 'true', isHidden: true },
    ],
  },

  // -------- M1.5 (DEBUG) ----------
  {
    title: 'JS: Fix the Square',
    orderIndex: 5,
    difficulty: Difficulty.easy,
    type: ProblemType.DEBUG,
    description: `
## Fix the Square

The starter code below **looks** like a function that calculates the area of a square — but it has a bug. The body uses the wrong operator: addition instead of multiplication. With a side of 3, it returns 6 instead of 9.

Your job:

1. **Fix the bug** so \`squareArea(side)\` returns \`side * side\`.
2. **Add a short comment** starting with \`//\` above the return line explaining what the function does. Comments are ignored by JavaScript and exist to help human readers!

### Example

\`\`\`javascript
console.log(squareArea(3));   // 9
console.log(squareArea(5));   // 25
\`\`\`
`.trim(),
    starterCode: `function squareArea(side) {
  return side + side;
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'To find the area of a square, you must multiply the side by itself. What operator does JavaScript use for multiplication?',
      },
      {
        orderIndex: 2,
        content: 'In JavaScript, multiplication is done using the asterisk symbol `*`. The expression should be `side * side`.',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete solution with a comment added:\n\n```javascript\nfunction squareArea(side) {\n  // Area of a square = side multiplied by itself\n  return side * side;\n}\n```',
      },
    ],
    testCases: [
      { inputData: 'squareArea(3)', expected: '9', isHidden: false },
      { inputData: 'squareArea(0)', expected: '0', isHidden: true },
      { inputData: 'squareArea(5)', expected: '25', isHidden: true },
      { inputData: 'squareArea(10)', expected: '100', isHidden: true },
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
