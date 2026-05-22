/**
 * Wave — Java Module 11 "Debugging & Reading Errors"
 *
 * Adds the Java M11 lesson plus 5 DEBUG problems.
 *
 * Run:  pnpm tsx prisma/seed-java-m11.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'java';
const MODULE_ORDER_INDEX = 211; // Java Base (200) + Module 11
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
  concepts: ['Exceptions', 'Stack Traces', 'Common Java Errors'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Breaking Things is Good',
      content: `Every professional programmer spends more time fixing bugs than writing new code. It's just a part of the job!

When your program crashes, Java doesn't just stop — it gives you a **report** called an Exception. Learning how to read these reports is like learning a superpower. Instead of guessing what's wrong, you'll know exactly where the problem is and how to fix it.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'What is an Exception?',
      content: `In Java, an error that happens while the program is running is called an **Exception**. When one happens, Java prints a **Stack Trace** — a list of methods that were running at the moment of the crash.

The most important part is the very first line, which tells you the *type* of error.

Common Java Exceptions:
- **\`NullPointerException\` (NPE)**: You tried to use a variable that is \`null\`.
- **\`ArrayIndexOutOfBoundsException\`**: You tried to access an index that doesn't exist (like -1 or 10 on a list of size 5).
- **\`ArithmeticException\`**: You tried to do something mathematically impossible, like dividing by zero.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Reading a Stack Trace:',
      code: `Exception in thread "main" java.lang.NullPointerException
    at Solution.greet(Solution.java:5)
    at Solution.main(Solution.java:10)

// 1. Error type: NullPointerException
// 2. Where: Inside 'greet' method
// 3. Line: 5 of Solution.java`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Fixing the Null Pointer',
      content: `**Example:** This code crashes if someone passes \`null\` as the name.

\`\`\`java
public static int getNameLength(String name) {
    return name.length(); // CRASH if name is null!
}
\`\`\`

**The Fix:** Always "defend" your code by checking for null before using an object.

\`\`\`java
public static int getNameLength(String name) {
    if (name == null) {
        return 0;
    }
    return name.length(); // Safe!
}
\`\`\`

By adding a simple \`if\` check, we've made our code "robust" — it can handle unexpected data without crashing.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Spot the Bug',
      content: `The code below is supposed to return the first character of a string, but it has a major flaw. Can you see what happens if the string is empty?`,
      code: `public class Solution {
    public static char getFirst(String s) {
        // This will crash on an empty string ("")
        return s.charAt(0);
    }
}
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
    title: 'Java: Fix the NPE',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.DEBUG,
    description: `
## Fix the NullPointerException

The method \`shout\` below is supposed to convert a string to uppercase. However, it crashes if the input string is \`null\`.

**Your Job:** Add a check at the beginning of the method. If the string is \`null\`, return an empty string \`""\`.
`.trim(),
    starterCode: `public class Solution {
    public static String shout(String s) {
        return s.toUpperCase();
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use an `if` statement to check `if (s == null)`.' },
      { orderIndex: 2, content: 'If the check is true, `return "";`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nif (s == null) return "";\nreturn s.toUpperCase();\n```' },
    ],
    testCases: [
      { inputData: 'Solution.shout("hello")', expected: 'HELLO', isHidden: false },
      { inputData: 'Solution.shout(null)', expected: '', isHidden: true },
    ],
  },

  // -------- M11.2 ----------
  {
    title: 'Java: Fix the Bounds',
    orderIndex: 2,
    difficulty: Difficulty.medium,
    type: ProblemType.DEBUG,
    description: `
## Fix the Bounds

The method \`getLast\` is supposed to return the last element of an array. It currently has an \`ArrayIndexOutOfBoundsException\`.

**Your Job:** Fix the index calculation so it correctly returns the last item.
`.trim(),
    starterCode: `public class Solution {
    public static int getLast(int[] numbers) {
        // This is wrong!
        return numbers[numbers.length];
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Remember that Java arrays start at index 0.' },
      { orderIndex: 2, content: 'The last index of an array is always `length - 1`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nreturn numbers[numbers.length - 1];\n```' },
    ],
    testCases: [
      { inputData: 'Solution.getLast(new int[]{1, 2, 3})', expected: '3', isHidden: false },
      { inputData: 'Solution.getLast(new int[]{10})', expected: '10', isHidden: true },
    ],
  },

  // -------- M11.3 ----------
  {
    title: 'Java: Zero Division',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.DEBUG,
    description: `
## Zero Division

The method \`divide\` crashes if the second number is 0. 

**Your Job:** If the divisor \`b\` is 0, return \`0\` instead of crashing.
`.trim(),
    starterCode: `public class Solution {
    public static int divide(int a, int b) {
        return a / b;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Check if `b` is 0 using an `if` statement.' },
      { orderIndex: 2, content: 'If true, return 0.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nif (b == 0) return 0;\nreturn a / b;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.divide(10, 2)', expected: '5', isHidden: false },
      { inputData: 'Solution.divide(10, 0)', expected: '0', isHidden: true },
    ],
  },

  // -------- M11.4 ----------
  {
    title: 'Java: Off-by-One Loop',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.DEBUG,
    description: `
## Off-by-One Loop

This loop is supposed to return the sum of numbers from 1 up to **and including** \`n\`. But for \`n=3\`, it returns 3 instead of 6.

**Your Job:** Fix the loop condition so it includes the number \`n\`.
`.trim(),
    starterCode: `public class Solution {
    public static int sumUpTo(int n) {
        int sum = 0;
        for (int i = 1; i < n; i++) {
            sum += i;
        }
        return sum;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Look at the loop condition: `i < n`.' },
      { orderIndex: 2, content: 'This condition stops *before* reaching `n`.' },
      { orderIndex: 3, content: 'Change it to `i <= n`.' },
    ],
    testCases: [
      { inputData: 'Solution.sumUpTo(3)', expected: '6', isHidden: false },
      { inputData: 'Solution.sumUpTo(5)', expected: '15', isHidden: true },
      { inputData: 'Solution.sumUpTo(1)', expected: '1', isHidden: true },
    ],
  },

  // -------- M11.5 ----------
  {
    title: 'Java: Scope Bug',
    orderIndex: 5,
    difficulty: Difficulty.hard,
    type: ProblemType.DEBUG,
    description: `
## Variable Scope Bug

The method \`calculateTotal\` is supposed to add a 10% tax to a bill. The starter code below won't even compile because of a scope issue.

**Your Job:** Fix the variable declarations so the code correctly calculates and returns the total.
`.trim(),
    starterCode: `public class Solution {
    public static double calculateTotal(double bill) {
        if (bill > 0) {
            double tax = bill * 0.10;
        }
        // Error: 'tax' is not accessible here!
        return bill + tax;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Variables declared inside an `if` block { } are only visible inside that block.' },
      { orderIndex: 2, content: 'Declare `tax` outside (before) the `if` statement.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\ndouble tax = 0;\nif (bill > 0) tax = bill * 0.10;\nreturn bill + tax;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.calculateTotal(100.0)', expected: '110.0', isHidden: false },
      { inputData: 'Solution.calculateTotal(0.0)', expected: '0.0', isHidden: true },
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
