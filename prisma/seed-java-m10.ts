/**
 * Wave — Java Module 10 "Functions (Going Deeper)"
 *
 * Adds the Java M10 lesson plus 5 problems.
 *
 * Run:  pnpm tsx prisma/seed-java-m10.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'java';
const MODULE_ORDER_INDEX = 210; // Java Base (200) + Module 10
const MODULE = {
  title: 'Functions (Going Deeper)',
  description: 'Method overloading, multiple return values, and organizing code.',
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
  title: 'Mastering Methods',
  estimatedMinutes: 15,
  concepts: ['Overloading', 'Recursion', 'Scope', 'Parameters'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Building Blocks of Logic',
      content: `As your programs grow larger, you can't just write one long list of instructions. You need to break your code into small, specialized tools that you can reuse.

In this module, you'll learn how to take your methods to the next level. You'll learn how to give them multiple "flavors," how to make them call themselves to solve complex problems, and how to keep your variables organized so they don't get mixed up.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Overloading and Recursion',
      content: `Two powerful concepts in Java methods:

1. **Method Overloading**: This is when you have two methods with the *same name* but different parameters. Java is smart enough to know which one to run based on the data you provide. This is how we handle "optional" information.
2. **Recursion**: This is when a method calls **itself**. It's like a mirror reflecting a mirror. It's a great way to solve problems that can be broken down into smaller, identical steps (like counting down or calculating a sequence).

Every method also has its own **Scope**. Variables created inside a method only exist for as long as that method is running.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Advanced method patterns in Java:',
      code: `// --- Overloading ---
public static void greet() {
    System.out.println("Hello!");
}

public static void greet(String name) {
    System.out.println("Hello, " + name + "!");
}

// --- Recursion ---
public static int count(int n) {
    if (n <= 0) return 0; // Base case
    return n + count(n - 1); // Recursive call
}

// --- Scope ---
public static void test() {
    int x = 10; // Only exists inside test()
}`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'The Overloaded Greet',
      content: `**Example:** Using overloading to provide a default greeting.

\`\`\`java
public class Solution {
    // Version 1: No name provided
    public static String greet() {
        return "Hello, Guest!";
    }

    // Version 2: Name provided
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}
\`\`\`

If we call \`Solution.greet()\`, Java runs Version 1. If we call \`Solution.greet("Alice")\`, Java runs Version 2. This makes your methods much more flexible and easier to use!`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Power Method',
      content: `Complete the method \`power\` that calculates \`base\` raised to the exponent \`exp\`. For extra credit, try to solve it using recursion!`,
      code: `public class Solution {
    public static int power(int base, int exp) {
        // Base case: anything to the power of 0 is 1
        if (exp == 0) return 1;
        // TODO: Multiply base by (base to the power of exp - 1)
        return 0;
    }
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **StackOverflowError.** In recursion, if you forget a "base case" (a way for the method to stop), it will call itself forever until the computer runs out of memory.
- ❌ **Ambiguous Overloading.** If you have two methods that are too similar, Java won't know which one to pick and will give you a compile error.
- ❌ **Modifying parameters.** While you can change a parameter's value inside a method, it doesn't change the original variable outside the method (for primitives like \`int\`).
- ❌ **Forgetting the return type.** Every Java method MUST declare what it returns (\`int\`, \`String\`, \`void\`, etc.).`,
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
    title: 'Java: Sum Two Numbers',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Sum Two Numbers

Complete the method \`sum\` that takes two integers and returns their sum. 

Wait, haven't we done this? Yes! But this time, focus on the method signature: \`public static int sum(int a, int b)\`.
`.trim(),
    starterCode: `public class Solution {
    public static int sum(int a, int b) {
        // TODO: Return the sum
        return 0;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `+` operator.' },
      { orderIndex: 2, content: 'The return type is `int`, so return an integer.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nreturn a + b;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.sum(5, 10)', expected: '15', isHidden: false },
      { inputData: 'Solution.sum(-1, 1)', expected: '0', isHidden: true },
    ],
  },

  // -------- M10.2 ----------
  {
    title: 'Java: Fibonacci',
    orderIndex: 2,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Fibonacci Sequence

The Fibonacci sequence starts with 0 and 1, and each following number is the sum of the previous two (0, 1, 1, 2, 3, 5, 8...).

Complete the method \`fib\` that returns the Nth Fibonacci number. Assume \`n >= 0\`.

### Examples
- \`fib(0)\` -> 0
- \`fib(1)\` -> 1
- \`fib(4)\` -> 3 (0, 1, 1, 2, **3**)
`.trim(),
    starterCode: `public class Solution {
    public static int fib(int n) {
        if (n == 0) return 0;
        if (n == 1) return 1;
        // TODO: Use recursion or a loop to return the Nth number
        return 0;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'The recursive formula is `fib(n) = fib(n-1) + fib(n-2)`.' },
      { orderIndex: 2, content: 'You already have the base cases for 0 and 1.' },
      { orderIndex: 3, content: 'Complete solution (recursive):\n\n```java\nreturn fib(n - 1) + fib(n - 2);\n```' },
    ],
    testCases: [
      { inputData: 'Solution.fib(4)', expected: '3', isHidden: false },
      { inputData: 'Solution.fib(0)', expected: '0', isHidden: true },
      { inputData: 'Solution.fib(1)', expected: '1', isHidden: true },
      { inputData: 'Solution.fib(6)', expected: '8', isHidden: true },
    ],
  },

  // -------- M10.3 ----------
  {
    title: 'Java: Default Greeting',
    orderIndex: 3,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Default Greeting (Overloading)

In Java, we don't have "default parameters." Instead, we use method overloading.

We've provided two method signatures for \`greet\`. 
1. If no name is given, return \`"Hello, Guest!"\`.
2. If a name is given, return \`"Hello, <name>!"\`.

Complete both methods.
`.trim(),
    starterCode: `public class Solution {
    public static String greet() {
        // TODO: Return greeting for Guest
        return "";
    }

    public static String greet(String name) {
        // TODO: Return greeting for specific name
        return "";
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'The first method takes no arguments.' },
      { orderIndex: 2, content: 'The second method takes a `String` argument.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\npublic static String greet() { return "Hello, Guest!"; }\npublic static String greet(String name) { return "Hello, " + name + "!"; }\n```' },
    ],
    testCases: [
      { inputData: 'Solution.greet()', expected: 'Hello, Guest!', isHidden: false },
      { inputData: 'Solution.greet("Alice")', expected: 'Hello, Alice!', isHidden: true },
    ],
  },

  // -------- M10.4 ----------
  {
    title: 'Java: Min & Max',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Min & Max (Varargs)

Java allows you to write methods that take a variable number of arguments using \`...\`. Inside the method, the arguments are treated as an array.

Complete the method \`findMin\` that takes any number of integers and returns the smallest one. Assume at least one number is provided.
`.trim(),
    starterCode: `public class Solution {
    public static int findMin(int... numbers) {
        int min = numbers[0];
        // TODO: Loop through the 'numbers' array and find the min
        return min;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Treat `numbers` exactly like an array: `numbers.length` and `numbers[i]`.' },
      { orderIndex: 2, content: 'Use a `for-each` loop: `for (int n : numbers)`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nfor (int n : numbers) {\n    if (n < min) min = n;\n}\nreturn min;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.findMin(10, 20, 5, 30)', expected: '5', isHidden: false },
      { inputData: 'Solution.findMin(1, 2)', expected: '1', isHidden: true },
      { inputData: 'Solution.findMin(100)', expected: '100', isHidden: true },
    ],
  },

  // -------- M10.5 ----------
  {
    title: 'Java: Calculator Dispatch',
    orderIndex: 5,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Calculator Dispatch

Complete the method \`calculate\` that takes two numbers (\`a\`, \`b\`) and an operator (\`String\`). Use a \`switch\` statement or a series of \`if\` statements to perform the calculation.

Supported operators: \`"add"\`, \`"sub"\`, \`"mul"\`, \`"div"\`.

If the operator is unknown, return \`-1\`.
`.trim(),
    starterCode: `public class Solution {
    public static int calculate(int a, int b, String op) {
        // TODO: Use a switch or if/else on 'op'
        return -1;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'A `switch` statement is perfect for checking strings: `switch(op) { case "add": ... }`.' },
      { orderIndex: 2, content: 'Remember to use `return` or `break` inside your cases.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nswitch(op) {\n    case "add": return a + b;\n    case "sub": return a - b;\n    case "mul": return a * b;\n    case "div": return a / b;\n    default: return -1;\n}\n```' },
    ],
    testCases: [
      { inputData: 'Solution.calculate(10, 5, "add")', expected: '15', isHidden: false },
      { inputData: 'Solution.calculate(10, 5, "mul")', expected: '50', isHidden: true },
      { inputData: 'Solution.calculate(10, 5, "div")', expected: '2', isHidden: true },
      { inputData: 'Solution.calculate(10, 5, "unknown")', expected: '-1', isHidden: true },
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
