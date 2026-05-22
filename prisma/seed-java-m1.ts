/**
 * Wave — Java Module 1 "First Lines of Code"
 *
 * Adds the Java M1 lesson plus problems. Problems follow the
 * function-return convention used by the grader (static methods in a Solution class).
 *
 * Run:  pnpm tsx prisma/seed-java-m1.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'java';
const MODULE_ORDER_INDEX = 201; // Java Base (200) + Module 1
const MODULE = {
  title: 'First Lines of Code',
  description: 'Your first Java: System.out.println, Strings, static methods, comments.',
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
  title: 'First Lines of Java',
  estimatedMinutes: 10,
  concepts: ['System.out.println', 'String', 'static methods', 'comments'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Make the Computer Speak',
      content: `The first thing every programmer wants to do is **make the computer say something**. That's not just a tradition — it's a "sanity check." If you can make text appear on the screen, you know your tools are working, your code runs, and you have a solid foundation to build on.

In this module, you'll learn how to print messages, group instructions using your first **static methods**, and leave notes in your code with **comments**. Java is a powerful, professional language used in everything from Android apps to large bank systems, and it all starts right here.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Printing, Strings, and Methods',
      content: `Java is a "structured" language, which means we organize our code into **classes** and **methods**.

- **\`System.out.println\`** is Java's built-in tool to print text to the screen. You call it like this: \`System.out.println("Hello");\`.
- A **String** is text wrapped in double quotes, like \`"Hello"\`. In Java, strings **must** use double quotes; single quotes are reserved for single characters.
- A **method** is a named package of instructions. Every LearnCode problem provides a \`Solution\` class with a **\`static\`** method.
- The **\`return\`** keyword sends a result back from a method.
- **Comments** start with \`//\`. The computer ignores them, so you can use them to write notes to yourself or other people reading your code.

All Java problems in LearnCode follow a specific shape: you fill in a method inside a \`Solution\` class that **returns** the answer.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'The basic Java pieces side by side:',
      code: `// A comment — Java ignores this!

// System.out.println prints text to the screen
System.out.println("Hello!");

// Strings are text enclosed in double quotes
String greeting = "Hello";

// A class containing a static method that returns a value
public class Solution {
    public static String greet() {
        return "Hello, World!";
    }
}

// How we call the method and print its result:
System.out.println(Solution.greet());`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'From Print to Return',
      content: `**Example 1:** The simplest way to display text is by calling \`System.out.println\` directly.

\`\`\`java
System.out.println("Welcome to Java!");
\`\`\`

**Example 2:** Reusable code. We wrap our code in a **static method** inside a **class**.

\`\`\`java
public class Solution {
    public static String welcomeMessage() {
        return "Welcome to Java!";
    }
}

// We call the method and print the result:
System.out.println(Solution.welcomeMessage());
\`\`\`

Notice that the method \`welcomeMessage\` doesn't print anything on its own. It **returns** the string. The \`System.out.println\` call outside the class takes that returned string and prints it to the screen. Keeping the creation of a value separate from how you display it is a core principle of clean programming!`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: A One-Line Hello',
      content: `Complete the method \`sayHello\` below so that it returns the exact string \`"Hello!"\`.`,
      code: `public class Solution {
    public static String sayHello() {
        // Return the string "Hello!" below:
        return "";
    }
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Forgetting the semicolon.** In Java, almost every instruction must end with a semicolon (\`;\`). Forgetting it is the #1 cause of errors for beginners!
- ❌ **Using single quotes for text.** Java distinguishes between \`"String"\` (text) and \`'C'\` (a single character). Use double quotes for strings.
- ❌ **Case-sensitivity.** Java is very picky. \`system.out.println\` (lowercase S) will not work; it must be \`System.out.println\`.
- ❌ **Logging instead of returning.** Inside a method, writing \`System.out.println("Hello");\` prints the text, but doesn't hand it back to the grader. Make sure to use the \`return\` keyword!`,
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
    title: 'Java: Hello, World!',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Hello, World!

The ultimate programming tradition: making the computer speak to you!

In Java, code lives inside **classes**. We've provided a class called \`Solution\` with a method called \`helloWorld\`.

Complete the method so it returns the exact string:

\`\`\`
Hello, World!
\`\`\`

### Example

\`\`\`java
String result = Solution.helloWorld();
System.out.println(result); // Hello, World!
\`\`\`

> **Tip:** Strings are text enclosed in double quotes (\`"\`). Be careful with spelling and punctuation — it must match exactly!
`.trim(),
    starterCode: `public class Solution {
    public static String helloWorld() {
        // TODO: Return "Hello, World!"
        return "";
    }
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'You need to use the `return` keyword followed by the text in double quotes.',
      },
      {
        orderIndex: 2,
        content: 'The line should look like this: `return "Hello, World!";`. Don\'t forget the semicolon!',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete solution:\n\n```java\npublic class Solution {\n    public static String helloWorld() {\n        return "Hello, World!";\n    }\n}\n```',
      },
    ],
    testCases: [
      { inputData: 'Solution.helloWorld()', expected: 'Hello, World!', isHidden: false },
      { inputData: 'Solution.helloWorld().equals("Hello, World!")', expected: 'true', isHidden: true },
      { inputData: 'Solution.helloWorld().length()', expected: '13', isHidden: true },
    ],
  },

  // -------- M1.2 ----------
  {
    title: 'Java: Greet by Name',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Greet by Name

Now let's greet **anyone** by their name!

Complete the method \`greet\` that takes one parameter \`name\` (a String) and returns a personalized greeting in this exact format:

\`\`\`
Hello, <name>!
\`\`\`

### Example

\`\`\`java
String result = Solution.greet("Alice");
System.out.println(result); // Hello, Alice!
\`\`\`

> **Tip:** You can combine strings using the \`+\` operator (called concatenation). For example: \`"Hi " + name\`.
`.trim(),
    starterCode: `public class Solution {
    public static String greet(String name) {
        // TODO: Build and return the greeting
        return "";
    }
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'You have a variable `name`. You need to stick it between `"Hello, "` and `"\!"`.',
      },
      {
        orderIndex: 2,
        content: 'Use the `+` operator twice to join the three parts: `"Hello, " + name + "!"`.',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete solution:\n\n```java\npublic class Solution {\n    public static String greet(String name) {\n        return "Hello, " + name + "!";\n    }\n}\n```',
      },
    ],
    testCases: [
      { inputData: 'Solution.greet("Alice")', expected: 'Hello, Alice!', isHidden: false },
      { inputData: 'Solution.greet("Bob")', expected: 'Hello, Bob!', isHidden: true },
      { inputData: 'Solution.greet("World")', expected: 'Hello, World!', isHidden: true },
    ],
  },

  // -------- M1.3 ----------
  {
    title: 'Java: Three Lines',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Three Lines

Complete the method \`verses\` so it returns a **single String** containing exactly three lines of text. Use the newline character \`\\n\` to separate the lines.

The exact text must be:

\`\`\`
The sky is blue.
The grass is green.
The code runs clean.
\`\`\`

### Example

\`\`\`java
System.out.println(Solution.verses());
// The sky is blue.
// The grass is green.
// The code runs clean.
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static String verses() {
        // TODO: Return the three-line string
        return "";
    }
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'You only need one set of quotes. Put `\\n` wherever you want a line break.',
      },
      {
        orderIndex: 2,
        content: 'The shape is: `"line1\\nline2\\nline3"`.',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete solution:\n\n```java\npublic class Solution {\n    public static String verses() {\n        return "The sky is blue.\\nThe grass is green.\\nThe code runs clean.";\n    }\n}\n```',
      },
    ],
    testCases: [
      {
        inputData: 'Solution.verses()',
        expected: 'The sky is blue.\nThe grass is green.\nThe code runs clean.',
        isHidden: false,
      },
      { inputData: 'Solution.verses().split("\\n").length', expected: '3', isHidden: true },
      { inputData: 'Solution.verses().contains("blue")', expected: 'true', isHidden: true },
    ],
  },

  // -------- M1.4 ----------
  {
    title: 'Java: Escape Characters',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Escape Characters

Inside Strings, **\`\\n\`** means a newline and **\`\\t\`** means a horizontal tab (indentation).

Complete the method \`nameTag\` that takes a \`name\` and returns a string in this exact format:

\`\`\`
HELLO
\tmy name is <name>
\`\`\`

(The second line must start with a tab character, followed by \`my name is \`, and then the name.)

### Example

\`\`\`java
System.out.println(Solution.nameTag("Sam"));
// HELLO
//     my name is Sam
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static String nameTag(String name) {
        // TODO: Use \\n and \\t
        return "";
    }
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'Join the parts together using `+`. Remember to include `\\n` for the line break and `\\t` for the tab.',
      },
      {
        orderIndex: 2,
        content: 'Try joining them like this: `"HELLO\\n\\tmy name is " + name`.',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete solution:\n\n```java\npublic class Solution {\n    public static String nameTag(String name) {\n        return "HELLO\\n\\tmy name is " + name;\n    }\n}\n```',
      },
    ],
    testCases: [
      { inputData: 'Solution.nameTag("Sam")', expected: 'HELLO\n\tmy name is Sam', isHidden: false },
      { inputData: 'Solution.nameTag("Alex")', expected: 'HELLO\n\tmy name is Alex', isHidden: true },
    ],
  },

  // -------- M1.5 (DEBUG) ----------
  {
    title: 'Java: Fix the Square',
    orderIndex: 5,
    difficulty: Difficulty.easy,
    type: ProblemType.DEBUG,
    description: `
## Fix the Square

The code below is supposed to calculate the area of a square — but it has a bug. It uses addition (\`+\`) instead of multiplication (\`*\`).

Your job:

1. **Fix the bug** so \`squareArea(side)\` returns \`side * side\`.
2. **Add a comment** starting with \`//\` above the return line explaining what the code does.

### Example

\`\`\`java
System.out.println(Solution.squareArea(3)); // 9
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static int squareArea(int side) {
        return side + side;
    }
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'To find the area of a square, multiply the side by itself. Java uses `*` for multiplication.',
      },
      {
        orderIndex: 2,
        content: 'Change `side + side` to `side * side`. Then add a comment line above it.',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete solution:\n\n```java\npublic class Solution {\n    public static int squareArea(int side) {\n        // Area is side squared\n        return side * side;\n    }\n}\n```',
      },
    ],
    testCases: [
      { inputData: 'Solution.squareArea(3)', expected: '9', isHidden: false },
      { inputData: 'Solution.squareArea(5)', expected: '25', isHidden: true },
      { inputData: 'Solution.squareArea(10)', expected: '100', isHidden: true },
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
