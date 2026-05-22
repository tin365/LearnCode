/**
 * Wave — Java Module 4 "Getting Input from the User"
 *
 * Adds the Java M4 lesson plus 4 problems.
 * Note: Adapted to function parameters as input per the authoring brief.
 *
 * Run:  pnpm tsx prisma/seed-java-m4.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'java';
const MODULE_ORDER_INDEX = 204; // Java Base (200) + Module 4
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
  concepts: ['Parameters', 'Input types', 'Interactive programs'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'A Conversation with Code',
      content: `A program that only ever does the same thing is like a movie — you can watch it, but you can't change it. For a program to be useful, it needs to **react to data** from the outside world.

Whether it's a search query, a user's age, or a tap on a screen, "input" is what makes software interactive and powerful. In this module, you'll learn how to write code that takes different inputs and produces different results every time it runs.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Parameters as Input',
      content: `While real-world apps might get input from a keyboard, a mouse, or the internet, in programming logic, we represent that input using **parameters**.

Think of a method like a machine. You put something in (the parameters), the machine processes it, and something comes out (the return value).

\`\`\`
Input (Parameters)  ──→  [ YOUR CODE ]  ──→  Output (Return)
\`\`\`

In Java, we define the type of input a method expects inside the parentheses: \`public static int square(int number)\`. This tells Java that the "input" to this method will always be a whole number.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Using parameters to represent user input:',
      code: `public class Solution {
    // This method "asks" for a name (String input)
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }

    // This method "asks" for two numbers (int inputs)
    public static int add(int a, int b) {
        return a + b;
    }
}

// When the computer calls your code, it provides the "input":
String output = Solution.greet("Alice");
int sum = Solution.add(5, 10);`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'The Welcome Badge',
      content: `**Worked Example:** Let's imagine a program that greets a user and tells them how many characters are in their name.

\`\`\`java
public class Solution {
    public static String welcomeMessage(String name) {
        int length = name.length();
        return "Welcome " + name + "! Your name has " + length + " letters.";
    }
}
\`\`\`

If we run this with the input \`"Alice"\`, the method returns:
\`"Welcome Alice! Your name has 5 letters."\`

If we run it with \`"Bob"\`, it returns:
\`"Welcome Bob! Your name has 3 letters."\`

The code stays the same, but the **behavior changes** based on the input!`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Double It',
      content: `Complete the method \`doubleNumber\` so that it takes a whole number (\`int\`) and returns that number multiplied by 2.`,
      code: `public class Solution {
    public static int doubleNumber(int n) {
        // TODO: Multiply the input by 2 and return it
        return 0;
    }
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Trying to use a variable that isn't a parameter.** You can only use the variable names provided in the parentheses (like \`n\` or \`name\`).
- ❌ **Mismatching types.** If a method expects an \`int\`, you can't pass it a \`String\`. Java is very strict about keeping types consistent.
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
    title: 'Java: Welcome User',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Welcome User

Complete the method \`welcome\` that takes a \`name\` as input and returns a welcoming string:

\`\`\`
Welcome to LearnCode, <name>!
\`\`\`

### Example

\`\`\`java
Solution.welcome("Alice") // "Welcome to LearnCode, Alice!"
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static String welcome(String name) {
        // TODO: Build and return the welcome message
        return "";
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `name` parameter provided to the method.' },
      { orderIndex: 2, content: 'Join the literal text with the `name` using `+`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nreturn "Welcome to LearnCode, " + name + "!";\n```' },
    ],
    testCases: [
      { inputData: 'Solution.welcome("Alice")', expected: 'Welcome to LearnCode, Alice!', isHidden: false },
      { inputData: 'Solution.welcome("Bob")', expected: 'Welcome to LearnCode, Bob!', isHidden: true },
    ],
  },

  // -------- M4.2 ----------
  {
    title: 'Java: Add From Input',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Add From Input

Complete the method \`addTwo\` that takes two integers \`a\` and \`b\` and returns their sum.

### Example

\`\`\`java
Solution.addTwo(5, 10) // 15
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static int addTwo(int a, int b) {
        // TODO: Return the sum of a and b
        return 0;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `+` operator on the two parameters.' },
      { orderIndex: 2, content: 'Simply write `return a + b;`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\npublic static int addTwo(int a, int b) {\n    return a + b;\n}\n```' },
    ],
    testCases: [
      { inputData: 'Solution.addTwo(5, 10)', expected: '15', isHidden: false },
      { inputData: 'Solution.addTwo(-1, 1)', expected: '0', isHidden: true },
      { inputData: 'Solution.addTwo(100, 200)', expected: '300', isHidden: true },
    ],
  },

  // -------- M4.3 ----------
  {
    title: 'Java: Square It',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Square It

Complete the method \`square\` that takes a number \`n\` and returns its square (\`n\` multiplied by itself).

### Example

\`\`\`java
Solution.square(4) // 16
Solution.square(5) // 25
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static int square(int n) {
        // TODO: Return n squared
        return 0;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Multiply the input `n` by itself.' },
      { orderIndex: 2, content: 'Use the `*` operator.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nreturn n * n;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.square(4)', expected: '16', isHidden: false },
      { inputData: 'Solution.square(0)', expected: '0', isHidden: true },
      { inputData: 'Solution.square(-3)', expected: '9', isHidden: true },
    ],
  },

  // -------- M4.4 ----------
  {
    title: 'Java: Tip Calculator',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Tip Calculator

Complete the method \`calculateTotal\` that takes a \`billAmount\` (a \`double\`) and a \`tipPercentage\` (an \`int\`, e.g., 15 for 15%) and returns the total amount including the tip.

### Formula

\`Total = Bill + (Bill * TipPercentage / 100)\`

### Example

\`\`\`java
Solution.calculateTotal(100.0, 15) // 115.0
Solution.calculateTotal(50.0, 20)  // 60.0
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static double calculateTotal(double billAmount, int tipPercentage) {
        // TODO: Calculate and return the total
        return 0.0;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'First calculate the tip amount: `billAmount * tipPercentage / 100.0`.' },
      { orderIndex: 2, content: 'Add the tip amount back to the original `billAmount`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nreturn billAmount + (billAmount * tipPercentage / 100.0);\n```' },
    ],
    testCases: [
      { inputData: 'Solution.calculateTotal(100.0, 15)', expected: '115.0', isHidden: false },
      { inputData: 'Solution.calculateTotal(50.0, 20)', expected: '60.0', isHidden: true },
      { inputData: 'Solution.calculateTotal(80.0, 10)', expected: '88.0', isHidden: true },
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
