/**
 * Wave — Java Module 5 "Making Decisions"
 *
 * Adds the Java M5 lesson plus 6 problems.
 *
 * Run:  pnpm tsx prisma/seed-java-m5.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'java';
const MODULE_ORDER_INDEX = 205; // Java Base (200) + Module 5
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
  concepts: ['if/else', 'comparison operators', 'boolean logic'],
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
      content: `In Java, we use **if statements** to check conditions. A condition is anything that results in a \`boolean\` (\`true\` or \`false\`).

- **\`if\`**: Runs a block of code only if the condition is true.
- **\`else if\`**: Checks a new condition if the first one was false.
- **\`else\`**: Runs a block of code if *none* of the above conditions were true.

Comparison operators you'll use:
- **\`==\`**: Equal to (for numbers/booleans)
- **\`!=\`**: Not equal to
- **\`>\` / \`<\`**: Greater / Less than
- **\`>=\` / \`<=\`**: Greater / Less than or equal to

**Important for Java**: To compare two Strings, never use \`==\`. Always use **\`.equals()\`**!`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'The syntax for making decisions in Java:',
      code: `int score = 85;

if (score >= 90) {
    System.out.println("Grade: A");
} else if (score >= 80) {
    System.out.println("Grade: B");
} else {
    System.out.println("Keep trying!");
}

// Comparing Strings
String choice = "yes";
if (choice.equals("yes")) {
    System.out.println("User said yes!");
}`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Logical Operators',
      content: `Sometimes you need to check more than one thing at once. We use **logical operators** to combine conditions:

- **\`&&\` (AND)**: True only if *both* conditions are true.
- **\`||\` (OR)**: True if *at least one* condition is true.
- **\`!\` (NOT)**: Reverses the condition (true becomes false).

**Example:** A program that checks if someone can ride a roller coaster (must be 48 inches tall AND have a ticket).

\`\`\`java
public class Solution {
    public static boolean canRide(int height, boolean hasTicket) {
        if (height >= 48 && hasTicket) {
            return true;
        } else {
            return false;
        }
    }
}
\`\`\`

If \`height = 50\` and \`hasTicket = true\`, the whole condition is true. If either one is false, the ride is a no-go!`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: positive or negative',
      content: `Complete the method \`checkSign\` so that it returns \`"positive"\` if the number is greater than 0, \`"negative"\` if it's less than 0, and \`"zero"\` if it's exactly 0.`,
      code: `public class Solution {
    public static String checkSign(int n) {
        // TODO: Use if/else to return the correct string
        return "";
    }
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Using \`=\` instead of \`==\`.** \`=\` is for assigning a value; \`==\` is for comparing them. \`if (age = 18)\` will cause a compile error.
- ❌ **Using \`==\` for Strings.** This is the most common Java bug! \`if (name == "Alice")\` often fails even if the text matches. Use \`if (name.equals("Alice"))\`.
- ❌ **Forgetting curly braces.** While Java allows one-line \`if\` statements without braces, it's safer and cleaner to always use \`{ }\` for your code blocks.
- ❌ **Confusing \`&&\` and \`||\`.** Remember: \`&&\` is strict (both must be true), \`||\` is relaxed (only one needs to be true).`,
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
    title: 'Java: Even or Odd',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Even or Odd

Complete the method \`isEven\` that takes an integer and returns \`true\` if it is even, and \`false\` if it is odd.

### Tip

In Java, the modulo operator \`%\` gives you the remainder of a division. A number is even if its remainder when divided by 2 is exactly 0 (\`n % 2 == 0\`).
`.trim(),
    starterCode: `public class Solution {
    public static boolean isEven(int n) {
        // TODO: Return true if even, false if odd
        return false;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the modulo operator `%` to check the remainder.' },
      { orderIndex: 2, content: 'If `n % 2 == 0`, the number is even.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nreturn n % 2 == 0;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.isEven(4)', expected: 'true', isHidden: false },
      { inputData: 'Solution.isEven(7)', expected: 'false', isHidden: true },
      { inputData: 'Solution.isEven(0)', expected: 'true', isHidden: true },
    ],
  },

  // -------- M5.2 ----------
  {
    title: 'Java: Sign Checker',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Sign Checker

Complete the method \`checkSign\` that takes an integer and returns:
- \`"positive"\` if the number is > 0
- \`"negative"\` if the number is < 0
- \`"zero"\` if the number is 0
`.trim(),
    starterCode: `public class Solution {
    public static String checkSign(int n) {
        // TODO: Use if/else if/else
        return "";
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'You\'ll need an `if`, an `else if`, and an `else`.' },
      { orderIndex: 2, content: 'Compare `n` to `0`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nif (n > 0) return "positive";\nelse if (n < 0) return "negative";\nelse return "zero";\n```' },
    ],
    testCases: [
      { inputData: 'Solution.checkSign(5)', expected: 'positive', isHidden: false },
      { inputData: 'Solution.checkSign(-3)', expected: 'negative', isHidden: true },
      { inputData: 'Solution.checkSign(0)', expected: 'zero', isHidden: true },
    ],
  },

  // -------- M5.3 ----------
  {
    title: 'Java: Larger of Two',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Larger of Two

Complete the method \`max\` that takes two integers \`a\` and \`b\` and returns the one that is larger.

### Example

\`\`\`java
Solution.max(10, 20) // 20
Solution.max(50, 5)  // 50
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static int max(int a, int b) {
        // TODO: Return the larger number
        return 0;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use an `if` to check if `a > b`.' },
      { orderIndex: 2, content: 'If `a` is larger, return `a`. Otherwise, return `b`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nif (a > b) {\n    return a;\n} else {\n    return b;\n}\n```' },
    ],
    testCases: [
      { inputData: 'Solution.max(10, 20)', expected: '20', isHidden: false },
      { inputData: 'Solution.max(50, 5)', expected: '50', isHidden: true },
      { inputData: 'Solution.max(7, 7)', expected: '7', isHidden: true },
    ],
  },

  // -------- M5.4 ----------
  {
    title: 'Java: Grade Calculator',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Grade Calculator

Complete the method \`getGrade\` that takes a score (0-100) and returns a letter grade:
- 90 or above: \`"A"\`
- 80 to 89: \`"B"\`
- 70 to 79: \`"C"\`
- 60 to 69: \`"D"\`
- Below 60: \`"F"\`
`.trim(),
    starterCode: `public class Solution {
    public static String getGrade(int score) {
        // TODO: Return A, B, C, D, or F
        return "";
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a chain of `if` and `else if` statements.' },
      { orderIndex: 2, content: 'Start from the highest grade (90) and work your way down.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nif (score >= 90) return "A";\nelse if (score >= 80) return "B";\nelse if (score >= 70) return "C";\nelse if (score >= 60) return "D";\nelse return "F";\n```' },
    ],
    testCases: [
      { inputData: 'Solution.getGrade(95)', expected: 'A', isHidden: false },
      { inputData: 'Solution.getGrade(82)', expected: 'B', isHidden: true },
      { inputData: 'Solution.getGrade(70)', expected: 'C', isHidden: true },
      { inputData: 'Solution.getGrade(45)', expected: 'F', isHidden: true },
    ],
  },

  // -------- M5.5 ----------
  {
    title: 'Java: Leap Year',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Leap Year Checker

Complete the method \`isLeapYear\` that takes a year and returns \`true\` if it is a leap year, and \`false\` otherwise.

### Rules
A year is a leap year if:
1. It is divisible by 4.
2. **BUT** if it is divisible by 100, it must **also** be divisible by 400.

### Examples
- 2024: Leap year (divisible by 4)
- 1900: Not a leap year (divisible by 100 but not 400)
- 2000: Leap year (divisible by 100 AND 400)
`.trim(),
    starterCode: `public class Solution {
    public static boolean isLeapYear(int year) {
        // TODO: Implement leap year logic
        return false;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `year % 4 == 0` for the basic check.' },
      { orderIndex: 2, content: 'Use a nested `if` or logical operators to handle the 100 and 400 rules.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nif (year % 400 == 0) return true;\nif (year % 100 == 0) return false;\nreturn year % 4 == 0;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.isLeapYear(2024)', expected: 'true', isHidden: false },
      { inputData: 'Solution.isLeapYear(1900)', expected: 'false', isHidden: true },
      { inputData: 'Solution.isLeapYear(2000)', expected: 'true', isHidden: true },
      { inputData: 'Solution.isLeapYear(2023)', expected: 'false', isHidden: true },
    ],
  },

  // -------- M5.6 ----------
  {
    title: 'Java: Simple Login',
    orderIndex: 6,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Simple Login

Complete the method \`canLogin\` that takes a \`username\` and a \`password\` and returns \`true\` if:
- username is \`"admin"\`
- **AND** password is \`"secret123"\`

### Tip
Remember to use **\`.equals()\`** for string comparison!
`.trim(),
    starterCode: `public class Solution {
    public static boolean canLogin(String username, String password) {
        // TODO: Check credentials
        return false;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'You need to check two conditions at once using the `&&` operator.' },
      { orderIndex: 2, content: 'Use `username.equals("admin")` and `password.equals("secret123")`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nreturn username.equals("admin") && password.equals("secret123");\n```' },
    ],
    testCases: [
      { inputData: 'Solution.canLogin("admin", "secret123")', expected: 'true', isHidden: false },
      { inputData: 'Solution.canLogin("admin", "wrong")', expected: 'false', isHidden: true },
      { inputData: 'Solution.canLogin("user", "secret123")', expected: 'false', isHidden: true },
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
