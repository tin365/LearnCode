/**
 * Wave — Java Module 6 "Loops"
 *
 * Adds the Java M6 lesson plus 7 problems.
 *
 * Run:  pnpm tsx prisma/seed-java-m6.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'java';
const MODULE_ORDER_INDEX = 206; // Java Base (200) + Module 6
const MODULE = {
  title: 'Loops',
  description: 'Repeat actions with for and while loops.',
  estimatedMinutes: 35,
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
  title: 'Repetitive Tasks',
  estimatedMinutes: 15,
  concepts: ['for loops', 'while loops', 'break', 'continue'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Don\'t Repeat Yourself',
      content: `Imagine you need to print "Hello" 100 times. You *could* write 100 lines of code, but that would be exhausting and hard to fix if you made a mistake.

**Loops** are how we tell the computer to repeat a block of code over and over again. Computers never get tired and they never get bored — they are perfect for doing repetitive tasks millions of times per second.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'for and while',
      content: `Java has two main types of loops:

- **\`for\` loops**: Best when you know exactly how many times you want to repeat (e.g., "count from 1 to 10").
- **\`while\` loops**: Best when you want to repeat *until* something happens (e.g., "keep asking for a password until it's correct").

A \`for\` loop has three parts:
1. **Initialization**: Start a counter (\`int i = 0\`).
2. **Condition**: Keep looping while this is true (\`i < 10\`).
3. **Update**: Change the counter after each loop (\`i++\`).`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Loop syntax in Java:',
      code: `// Counting from 1 to 5
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}

// Repeating while a condition is true
int count = 5;
while (count > 0) {
    System.out.println(count);
    count--; // Decrement
}

// Infinite loop with a break
while (true) {
    if (someCondition) break;
}`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Summing Numbers',
      content: `**Example:** Calculating the sum of numbers from 1 to N.

\`\`\`java
public class Solution {
    public static int sumToN(int n) {
        int total = 0;
        for (int i = 1; i <= n; i++) {
            total = total + i;
        }
        return total;
    }
}
\`\`\`

If \`n = 3\`, the loop runs 3 times:
1. \`i = 1\`: \`total\` becomes 1.
2. \`i = 2\`: \`total\` becomes 3 (1 + 2).
3. \`i = 3\`: \`total\` becomes 6 (3 + 3).

The loop finishes, and the method returns 6.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Factorial',
      content: `A factorial of a number \`n\` is the product of all positive integers from 1 to \`n\`. Complete the method \`factorial\` to calculate it.`,
      code: `public class Solution {
    public static int factorial(int n) {
        int result = 1;
        // TODO: Use a for loop to multiply result by i
        return result;
    }
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Infinite Loops.** If your \`while\` condition never becomes false, the loop will run forever and your program will "hang" or crash. Always make sure something changes inside the loop!
- ❌ **Off-by-one errors.** Should you use \`i < n\` or \`i <= n\`? Think carefully about whether the last number should be included.
- ❌ **Forgetting to update the counter.** In a \`while\` loop, if you forget \`count++\` or \`count--\`, you'll likely hit an infinite loop.
- ❌ **Variable Scope.** If you declare a variable *inside* a loop, you cannot use it *outside* the loop. Declare your result variable before the loop starts!`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const PROBLEMS: ProblemInput[] = [
  // -------- M6.1 ----------
  {
    title: 'Java: Sum 1 to N',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Sum 1 to N

Complete the method \`sumToN\` that takes an integer \`n\` and returns the sum of all numbers from 1 up to and including \`n\`.

### Example
\`\`\`java
Solution.sumToN(3) // 1 + 2 + 3 = 6
Solution.sumToN(5) // 1 + 2 + 3 + 4 + 5 = 15
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static int sumToN(int n) {
        int sum = 0;
        // TODO: Use a loop to add numbers to sum
        return sum;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a `for` loop that starts at 1 and goes up to `n`.' },
      { orderIndex: 2, content: 'Inside the loop, use `sum += i;`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nfor (int i = 1; i <= n; i++) {\n    sum += i;\n}\nreturn sum;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.sumToN(3)', expected: '6', isHidden: false },
      { inputData: 'Solution.sumToN(5)', expected: '15', isHidden: true },
      { inputData: 'Solution.sumToN(1)', expected: '1', isHidden: true },
      { inputData: 'Solution.sumToN(10)', expected: '55', isHidden: true },
    ],
  },

  // -------- M6.2 ----------
  {
    title: 'Java: Multiplication Table',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Multiplication Table

Complete the method \`multiTable\` that takes an integer \`n\` and returns a single string containing the first 5 results of its multiplication table, separated by spaces.

### Example
\`\`\`java
Solution.multiTable(3) // "3 6 9 12 15"
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static String multiTable(int n) {
        String result = "";
        // TODO: Build the string with a loop
        return result.trim();
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a `for` loop from 1 to 5.' },
      { orderIndex: 2, content: 'Inside the loop, add `(n * i) + " "` to the result string.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nfor (int i = 1; i <= 5; i++) {\n    result += (n * i) + " ";\n}\nreturn result.trim();\n```' },
    ],
    testCases: [
      { inputData: 'Solution.multiTable(3)', expected: '3 6 9 12 15', isHidden: false },
      { inputData: 'Solution.multiTable(5)', expected: '5 10 15 20 25', isHidden: true },
      { inputData: 'Solution.multiTable(10)', expected: '10 20 30 40 50', isHidden: true },
    ],
  },

  // -------- M6.3 ----------
  {
    title: 'Java: FizzBuzz (1 to N)',
    orderIndex: 3,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## FizzBuzz

Complete the method \`fizzBuzz\` that takes an integer \`n\` and returns a single string with the numbers 1 to \`n\` separated by spaces. **HOWEVER**:
- If a number is divisible by 3, use \`"Fizz"\` instead of the number.
- If a number is divisible by 5, use \`"Buzz"\` instead of the number.
- If it's divisible by BOTH, use \`"FizzBuzz"\`.

### Example
\`\`\`java
Solution.fizzBuzz(5) // "1 2 Fizz 4 Buzz"
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static String fizzBuzz(int n) {
        String result = "";
        // TODO: Loop from 1 to n and add Fizz/Buzz/number
        return result.trim();
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a `for` loop from 1 up to `n`.' },
      { orderIndex: 2, content: 'Check `i % 3 == 0 && i % 5 == 0` first for "FizzBuzz".' },
      { orderIndex: 3, content: 'Use `if/else if/else` to decide what to add to the result string.' },
    ],
    testCases: [
      { inputData: 'Solution.fizzBuzz(5)', expected: '1 2 Fizz 4 Buzz', isHidden: false },
      { inputData: 'Solution.fizzBuzz(15)', expected: '1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz', isHidden: true },
    ],
  },

  // -------- M6.4 ----------
  {
    title: 'Java: Count Down',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Count Down

Complete the method \`countDown\` that takes a starting number and returns a string counting down to 1, followed by \`"Lift off!"\`.

### Example
\`\`\`java
Solution.countDown(3) // "3 2 1 Lift off!"
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static String countDown(int start) {
        String result = "";
        // TODO: Use a while loop
        return result + "Lift off!";
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'A `while (start > 0)` loop works well here.' },
      { orderIndex: 2, content: 'Inside the loop, add the current number and a space, then decrement `start--`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nwhile (start > 0) {\n    result += start + " ";\n    start--;\n}\nreturn result + "Lift off!";\n```' },
    ],
    testCases: [
      { inputData: 'Solution.countDown(3)', expected: '3 2 1 Lift off!', isHidden: false },
      { inputData: 'Solution.countDown(5)', expected: '5 4 3 2 1 Lift off!', isHidden: true },
      { inputData: 'Solution.countDown(1)', expected: '1 Lift off!', isHidden: true },
    ],
  },

  // -------- M6.5 ----------
  {
    title: 'Java: Find Multiple',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Find Multiple

Complete the method \`findFirstMultiple\` that takes two numbers \`a\` and \`b\` and finds the smallest positive number that is a multiple of **both**.

### Example
\`\`\`java
Solution.findFirstMultiple(3, 7) // 21
Solution.findFirstMultiple(4, 6) // 12
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static int findFirstMultiple(int a, int b) {
        // TODO: Find the LCM (Least Common Multiple)
        return 0;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Start a loop at 1 and keep going until you find a match.' },
      { orderIndex: 2, content: 'Use `if (i % a == 0 && i % b == 0)` to check.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nint i = 1;\nwhile (true) {\n    if (i % a == 0 && i % b == 0) return i;\n    i++;\n}\n```' },
    ],
    testCases: [
      { inputData: 'Solution.findFirstMultiple(3, 7)', expected: '21', isHidden: false },
      { inputData: 'Solution.findFirstMultiple(4, 6)', expected: '12', isHidden: true },
      { inputData: 'Solution.findFirstMultiple(10, 15)', expected: '30', isHidden: true },
    ],
  },

  // -------- M6.6 ----------
  {
    title: 'Java: Power of Two',
    orderIndex: 6,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Power of Two

Complete the method \`isPowerOfTwo\` that takes a positive integer and returns \`true\` if it is a power of 2 (2, 4, 8, 16, etc.), and \`false\` otherwise.

### Example
\`\`\`java
Solution.isPowerOfTwo(8)  // true
Solution.isPowerOfTwo(10) // false
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static boolean isPowerOfTwo(int n) {
        if (n <= 0) return false;
        // TODO: Keep dividing by 2 while n is even
        return false;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a `while` loop that runs as long as `n % 2 == 0`.' },
      { orderIndex: 2, content: 'Inside the loop, divide `n` by 2: `n = n / 2;`.' },
      { orderIndex: 3, content: 'After the loop, if `n` is 1, then it was a power of 2.' },
    ],
    testCases: [
      { inputData: 'Solution.isPowerOfTwo(8)', expected: 'true', isHidden: false },
      { inputData: 'Solution.isPowerOfTwo(16)', expected: 'true', isHidden: true },
      { inputData: 'Solution.isPowerOfTwo(1)', expected: 'true', isHidden: true },
      { inputData: 'Solution.isPowerOfTwo(10)', expected: 'false', isHidden: true },
      { inputData: 'Solution.isPowerOfTwo(18)', expected: 'false', isHidden: true },
    ],
  },

  // -------- M6.7 ----------
  {
    title: 'Java: Password Length',
    orderIndex: 7,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Password Length

A password is valid if it has at least 8 characters. Complete the method \`findFirstInvalid\` which takes an array of password strings and returns the index of the **first** password that is too short (less than 8 characters).

If all passwords are valid, return \`-1\`.

### Example
\`\`\`java
Solution.findFirstInvalid(new String[]{"password123", "short", "validpass"}) // 1
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static int findFirstInvalid(String[] passwords) {
        // TODO: Loop through the array and check lengths
        return -1;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a `for` loop to go through the array indices: `for (int i = 0; i < passwords.length; i++)`.' },
      { orderIndex: 2, content: 'Inside, check `if (passwords[i].length() < 8)`.' },
      { orderIndex: 3, content: 'If you find an invalid one, return its index `i` immediately.' },
    ],
    testCases: [
      { inputData: 'Solution.findFirstInvalid(new String[]{"strongpass", "123", "anotherone"})', expected: '1', isHidden: false },
      { inputData: 'Solution.findFirstInvalid(new String[]{"validone", "validtwo", "validthree"})', expected: '-1', isHidden: true },
      { inputData: 'Solution.findFirstInvalid(new String[]{"short"})', expected: '0', isHidden: true },
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
