/**
 * Wave — Java Module 2 "Variables & Data Types"
 *
 * Adds the Java M2 lesson plus 6 problems. Problems follow the
 * function-return convention used by the grader.
 *
 * Run:  pnpm tsx prisma/seed-java-m2.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'java';
const MODULE_ORDER_INDEX = 202; // Java Base (200) + Module 2
const MODULE = {
  title: 'Variables & Data Types',
  description: 'Store values, work with numbers, text, and booleans.',
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
  title: 'Variables & Data Types',
  estimatedMinutes: 14,
  concepts: ['int', 'double', 'String', 'boolean', 'variables'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Name the Things You Reason About',
      content: `Imagine a recipe that just says "add 2, then add 2, then add 2" everywhere — no word for *what* you're adding. Trying to read or change that recipe later would be miserable.

**Variables** are how programmers stop repeating values and start naming the things they reason about. Once a value has a name (\`price\`, \`age\`, \`message\`), your code reads like a story and editing it is much easier.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Variables and Types',
      content: `A **variable** is a labelled box that holds a value. In Java, you must declare the **type** of the variable before you can use it:

\`\`\`java
String name = "Alice";
int age = 25;
\`\`\`

After this runs, \`name\` holds the text \`"Alice"\` and \`age\` holds the whole number \`25\`.

Java has several basic types. The four you'll meet first are:

- **\`int\`** — whole numbers like \`25\` or \`-3\`.
- **\`double\`** — numbers with a decimal point like \`9.99\` or \`3.14\`.
- **\`String\`** — text in double quotes like \`"hello"\`.
- **\`boolean\`** — either \`true\` or \`false\`.

Unlike some other languages, Java is "strongly typed," which means once you say a variable is an \`int\`, it can only ever hold an \`int\`.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Declaring variables and the four basic types:',
      code: `// Type name = value;
String name = "Alice";    // String (capital S)
int age = 25;             // int
double price = 9.99;      // double
boolean isActive = true;  // boolean

// Reading a variable
System.out.println(name);

// Naming rules: camelCase is the standard in Java.
// Must start with a letter, $ or _. Cannot start with a digit.
// Descriptive names like 'studentAge' are better than 'a'.`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'A Tiny Calculation',
      content: `**Example 1:** Read three values into named variables, then use them in an expression. Naming things up front makes the math line easy to read.

\`\`\`java
double price = 9.99;
int quantity = 3;
double taxRate = 0.10;

double subtotal = price * quantity;
double total = subtotal + (subtotal * taxRate);
System.out.println(total);        // 32.967
\`\`\`

**Example 2:** Mixing types. Java lets you add a number to a String, and it will automatically convert the number to text for you.

\`\`\`java
int score = 87;
System.out.println("Your score is " + score);  // "Your score is 87"

String ageText = "25";
int age = Integer.parseInt(ageText);
System.out.println(age + 1);                   // 26
\`\`\`

If you have a String like \`"25"\` and want to do math with it, you must use \`Integer.parseInt()\` to turn it into an \`int\` first!`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Two Variables',
      content: `Create two variables — \`myName\` set to your name (a String) and \`myAge\` set to a number (an int) — and have the method return a sentence that uses both, like \`"Alice is 25 years old."\`.`,
      code: `public class Solution {
    public static String aboutMe() {
        String myName = "Alice";
        int myAge = 25;
        
        // Return a sentence using both variables, like:
        // "Alice is 25 years old."
        return "";
    }
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Forgetting the type.** You can't just write \`name = "Alice";\`. You must write \`String name = "Alice";\`.
- ❌ **Mixing up \`int\` and \`double\`.** If you try to put \`9.99\` into an \`int\`, Java will give you an error because it doesn't want to lose the decimal part.
- ❌ **Forgetting quotes on strings.** \`String name = Alice;\` looks for a variable named \`Alice\`. Use \`String name = "Alice";\`.
- ❌ **Case-sensitivity.** \`string\` (lowercase) is not the same as \`String\` (uppercase). Java is very strict about this!`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const PROBLEMS: ProblemInput[] = [
  // -------- M2.1 ----------
  {
    title: 'Java: Profile Card',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Profile Card

Complete the method \`profile\` that takes two parameters — \`name\` (a String) and \`age\` (an int) — and returns a two-line profile card in this exact format:

\`\`\`
Name: <name>
Age: <age>
\`\`\`

The two lines must be separated by a single newline (\`\\n\`).

### Example

\`\`\`java
System.out.println(Solution.profile("Alice", 25));
// Name: Alice
// Age: 25
\`\`\`

> **Tip:** You can build this string by joining the parts with \`+\`. Remember to include the \`\\n\` character!
`.trim(),
    starterCode: `public class Solution {
    public static String profile(String name, int age) {
        // TODO: Build and return the profile string
        return "";
    }
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'You need to build one string that contains a newline in the middle. `\\n` is the character for a new line.',
      },
      {
        orderIndex: 2,
        content: 'Try joining the parts like this: `"Name: " + name + "\\nAge: " + age`. Java will automatically convert the `age` to text.',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete solution:\n\n```java\npublic class Solution {\n    public static String profile(String name, int age) {\n        return "Name: " + name + "\\nAge: " + age;\n    }\n}\n```',
      },
    ],
    testCases: [
      { inputData: 'Solution.profile("Alice", 25)', expected: 'Name: Alice\nAge: 25', isHidden: false },
      { inputData: 'Solution.profile("Bob", 40)', expected: 'Name: Bob\nAge: 40', isHidden: true },
      { inputData: 'Solution.profile("Q", 1).contains("\\n")', expected: 'true', isHidden: true },
    ],
  },

  // -------- M2.2 ----------
  {
    title: 'Java: Years to Days',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Years to Days

Complete the method \`toDays\` that takes an integer \`years\` and returns the equivalent number of days. Assume every year has exactly **365 days**.

### Examples

\`\`\`java
Solution.toDays(1)    // 365
Solution.toDays(10)   // 3650
Solution.toDays(0)    // 0
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static int toDays(int years) {
        // TODO: Multiply years by 365 and return the result
        return 0;
    }
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'Multiply the input `years` by `365` using the `*` operator.',
      },
      {
        orderIndex: 2,
        content: 'The method body should be a single line: `return years * 365;`.',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete solution:\n\n```java\npublic class Solution {\n    public static int toDays(int years) {\n        return years * 365;\n    }\n}\n```',
      },
    ],
    testCases: [
      { inputData: 'Solution.toDays(1)', expected: '365', isHidden: false },
      { inputData: 'Solution.toDays(10)', expected: '3650', isHidden: true },
      { inputData: 'Solution.toDays(25)', expected: '9125', isHidden: true },
    ],
  },

  // -------- M2.3 ----------
  {
    title: 'Java: Rectangle Area',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Rectangle Area

Complete the method \`rectangleArea\` that takes two numbers — \`width\` and \`height\` — and returns the area of the rectangle.

Since dimensions can have decimals, we use the **\`double\`** type for the parameters and the return value.

### Examples

\`\`\`java
Solution.rectangleArea(3.0, 4.0)   // 12.0
Solution.rectangleArea(2.5, 4.0)   // 10.0
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static double rectangleArea(double width, double height) {
        // TODO: Return width * height
        return 0.0;
    }
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'Multiply the two parameters `width` and `height` using the `*` operator.',
      },
      {
        orderIndex: 2,
        content: 'The method should return the result of `width * height`.',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete solution:\n\n```java\npublic class Solution {\n    public static double rectangleArea(double width, double height) {\n        return width * height;\n    }\n}\n```',
      },
    ],
    testCases: [
      { inputData: 'Solution.rectangleArea(3.0, 4.0)', expected: '12.0', isHidden: false },
      { inputData: 'Solution.rectangleArea(2.5, 4.0)', expected: '10.0', isHidden: true },
      { inputData: 'Solution.rectangleArea(5.0, 5.0)', expected: '25.0', isHidden: true },
    ],
  },

  // -------- M2.4 ----------
  {
    title: 'Java: Swap Values',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Swap Values

Complete the method \`swap\` that takes two integers \`a\` and \`b\` and returns them **swapped** — \`b\` first, then \`a\`.

In Java, we can return multiple values by putting them inside an **array**. The method is set up to return an \`int[]\` (an array of integers).

### Examples

\`\`\`java
Solution.swap(1, 2)    // [2, 1]
Solution.swap(10, 20)  // [20, 10]
\`\`\`

> **Tip:** You can create and return a new array in one line like this: \`return new int[]{b, a};\`.
`.trim(),
    starterCode: `public class Solution {
    public static int[] swap(int a, int b) {
        // TODO: Return an array containing b then a
        return new int[]{};
    }
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'You need to return a new array. Use the `new int[]{...}` syntax.',
      },
      {
        orderIndex: 2,
        content: 'Put `b` in the first position and `a` in the second: `new int[]{b, a}`.',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete solution:\n\n```java\npublic class Solution {\n    public static int[] swap(int a, int b) {\n        return new int[]{b, a};\n    }\n}\n```',
      },
    ],
    testCases: [
      { inputData: 'Solution.swap(1, 2)', expected: '[2, 1]', isHidden: false },
      { inputData: 'Solution.swap(10, 20)', expected: '[20, 10]', isHidden: true },
      { inputData: 'Solution.swap(7, 9).length', expected: '2', isHidden: true },
    ],
  },

  // -------- M2.5 ----------
  {
    title: 'Java: Temp Converter',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Temp Converter (Celsius to Fahrenheit)

Complete the method \`celsiusToFahrenheit\` that takes a temperature in Celsius (a \`double\`) and returns the equivalent in Fahrenheit.

### Formula

\`F = C * 9 / 5 + 32\`

### Reference points

\`\`\`java
Solution.celsiusToFahrenheit(0.0)    // 32.0
Solution.celsiusToFahrenheit(100.0)  // 212.0
Solution.celsiusToFahrenheit(37.0)   // 98.6
\`\`\`

> **Tip:** In Java, if you divide two integers (\`9 / 5\`), you get an integer result (\`1\`). To get a decimal result, use decimals in your numbers (\`9.0 / 5.0\`).
`.trim(),
    starterCode: `public class Solution {
    public static double celsiusToFahrenheit(double c) {
        // TODO: Apply the formula and return the result
        return 0.0;
    }
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'The math formula is `c * 9.0 / 5.0 + 32.0`. Using `.0` ensures Java treats them as decimal numbers.',
      },
      {
        orderIndex: 2,
        content: 'The method should return the result of the calculation.',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete solution:\n\n```java\npublic class Solution {\n    public static double celsiusToFahrenheit(double c) {\n        return c * 9.0 / 5.0 + 32.0;\n    }\n}\n```',
      },
    ],
    testCases: [
      { inputData: 'Solution.celsiusToFahrenheit(0.0)', expected: '32.0', isHidden: false },
      { inputData: 'Solution.celsiusToFahrenheit(100.0)', expected: '212.0', isHidden: true },
      { inputData: 'Solution.celsiusToFahrenheit(37.0)', expected: '98.6', isHidden: true },
      { inputData: 'Solution.celsiusToFahrenheit(-40.0)', expected: '-40.0', isHidden: true },
    ],
  },

  // -------- M2.6 ----------
  {
    title: 'Java: Check Object Type',
    orderIndex: 6,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Check Object Type

In Java, we can check if an object is of a certain type using the **\`instanceof\`** operator.

Complete the method \`isString\` that takes an **\`Object\`** and returns \`true\` if it is a \`String\`, and \`false\` otherwise.

### Examples

\`\`\`java
Solution.isString("Hello")  // true
Solution.isString(123)      // false
\`\`\`

> **Tip:** Use \`obj instanceof String\`.
`.trim(),
    starterCode: `public class Solution {
    public static boolean isString(Object obj) {
        // TODO: Return true if obj is a String
        return false;
    }
}
`,
    hints: [
      {
        orderIndex: 1,
        content: 'The `instanceof` operator checks if an object is an instance of a specific class.',
      },
      {
        orderIndex: 2,
        content: 'Use the expression `obj instanceof String`.',
      },
      {
        orderIndex: 3,
        content: 'Here is the complete solution:\n\n```java\npublic class Solution {\n    public static boolean isString(Object obj) {\n        return obj instanceof String;\n    }\n}\n```',
      },
    ],
    testCases: [
      { inputData: 'Solution.isString("Alice")', expected: 'true', isHidden: false },
      { inputData: 'Solution.isString(123)', expected: 'false', isHidden: true },
      { inputData: 'Solution.isString(true)', expected: 'false', isHidden: true },
    ],
  },
];

// ---------------------------------------------------------------------------
// Seed (standard idempotent block)
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
