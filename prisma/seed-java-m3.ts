/**
 * Wave — Java Module 3 "Strings in Depth"
 *
 * Adds the Java M3 lesson plus 5 problems.
 *
 * Run:  pnpm tsx prisma/seed-java-m3.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'java';
const MODULE_ORDER_INDEX = 203; // Java Base (200) + Module 3
const MODULE = {
  title: 'Strings in Depth',
  description: 'Combine, format, and transform text.',
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
  title: 'Strings in Depth',
  estimatedMinutes: 12,
  concepts: ['Concatenation', 'length()', 'toUpperCase()', 'toLowerCase()', 'trim()'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'The Language of People',
      content: `Computers love numbers, but people love words. Almost every app you use spends most of its time showing you text: your friend's name, a news headline, or a message you just typed.

In Java, we handle text using the **String** class. Learning how to manipulate strings — like combining them, searching them, or cleaning them up — is essential because text is how your program talks to the world.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'String Methods',
      content: `A **String** in Java is more than just text; it's an **object** that comes with its own set of tools, called **methods**. You can use these methods to ask questions about the string or create new, modified versions of it.

Key tools you'll use often:
- **\`+\`**: Joins two strings together (Concatenation).
- **\`.length()\`**: Tells you how many characters are in the string.
- **\`.toUpperCase()\`** and **\`.toLowerCase()\`**: Changes the casing of the text.
- **\`.trim()\`**: Removes any extra spaces from the beginning and end.

Important: Strings in Java are **immutable**. This means a method like \`.toUpperCase()\` doesn't change the original string; it returns a *brand new* string with the changes applied.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Common String operations in Java:',
      code: `String s = "  Java code  ";

// Join strings
String greeting = "Hello " + "World";

// Get length
int len = s.length();       // 13

// Change case
String loud = s.toUpperCase(); // "  JAVA CODE  "

// Remove whitespace
String clean = s.trim();       // "Java code"

// Check if it starts with something
boolean starts = s.startsWith(" "); // true`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Formatting a Message',
      content: `**Example 1:** Building a full name. We often take small pieces of text and join them together into a single sentence.

\`\`\`java
String first = "Alice";
String last = "Smith";
String full = first + " " + last;
System.out.println(full); // "Alice Smith"
\`\`\`

**Example 2:** Cleaning user input. When people type into a form, they often accidentally add extra spaces or use weird capitalization. We can "normalize" the text before using it.

\`\`\`java
String input = "  alIce  ";
String clean = input.trim().toLowerCase();
System.out.println(clean); // "alice"
\`\`\`

Notice how we can "chain" methods together: \`.trim().toLowerCase()\` runs the trim first, then lowercase.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Shout it Out',
      content: `Complete the method \`shout\` so that it takes a string, removes any leading/trailing spaces, and returns it in all uppercase letters.`,
      code: `public class Solution {
    public static String shout(String text) {
        // TODO: Trim and convert to uppercase
        return "";
    }
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Using \`==\` to compare strings.** In Java, \`==\` checks if two things are the *exact same object*. To check if two strings have the same *text*, always use **\`.equals()\`**.
- ❌ **Forgetting parentheses on \`.length()\`**. In Java, strings use a method for length, so you must include the parentheses: \`text.length()\`.
- ❌ **Expecting methods to change the original string.** Writing \`text.toUpperCase(); return text;\` will return the original text. You must return the result of the method: \`return text.toUpperCase();\`.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const PROBLEMS: ProblemInput[] = [
  // -------- M3.1 ----------
  {
    title: 'Java: Full Name',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Full Name

Complete the method \`combineNames\` that takes two strings — \`first\` and \`last\` — and returns the full name with a space in between.

### Example

\`\`\`java
Solution.combineNames("Alice", "Smith") // "Alice Smith"
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static String combineNames(String first, String last) {
        // TODO: Join the names with a space
        return "";
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `+` operator to join strings.' },
      { orderIndex: 2, content: 'You need to join `first`, then a string containing a space `" "`, then `last`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nreturn first + " " + last;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.combineNames("Alice", "Smith")', expected: 'Alice Smith', isHidden: false },
      { inputData: 'Solution.combineNames("Bob", "Jones")', expected: 'Bob Jones', isHidden: true },
      { inputData: 'Solution.combineNames("A", "B")', expected: 'A B', isHidden: true },
    ],
  },

  // -------- M3.2 ----------
  {
    title: 'Java: Build a Sentence',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Build a Sentence

Complete the method \`makeSentence\` that takes a \`name\` and a \`hobby\` and returns a sentence in this exact format:

\`\`\`
<name> loves to <hobby>.
\`\`\`

### Example

\`\`\`java
Solution.makeSentence("Alice", "code") // "Alice loves to code."
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static String makeSentence(String name, String hobby) {
        // TODO: Build the sentence
        return "";
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `+` to build the string piece by piece.' },
      { orderIndex: 2, content: 'Remember the literal text " loves to " and the period "." at the end.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nreturn name + " loves to " + hobby + ".";\n```' },
    ],
    testCases: [
      { inputData: 'Solution.makeSentence("Alice", "code")', expected: 'Alice loves to code.', isHidden: false },
      { inputData: 'Solution.makeSentence("Sam", "run")', expected: 'Sam loves to run.', isHidden: true },
    ],
  },

  // -------- M3.3 ----------
  {
    title: 'Java: String Length',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## String Length

Complete the method \`getLength\` that takes a string and returns its length as an integer.

### Example

\`\`\`java
Solution.getLength("Java") // 4
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static int getLength(String text) {
        // TODO: Return the length
        return 0;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Java strings have a `.length()` method.' },
      { orderIndex: 2, content: 'Don\'t forget the parentheses: `text.length()`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nreturn text.length();\n```' },
    ],
    testCases: [
      { inputData: 'Solution.getLength("Java")', expected: '4', isHidden: false },
      { inputData: 'Solution.getLength("")', expected: '0', isHidden: true },
      { inputData: 'Solution.getLength("Hello World")', expected: '11', isHidden: true },
    ],
  },

  // -------- M3.4 ----------
  {
    title: 'Java: Shout!',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Shout!

Complete the method \`shout\` that takes a string and returns it in all uppercase letters.

### Example

\`\`\`java
Solution.shout("hello") // "HELLO"
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static String shout(String text) {
        // TODO: Convert to uppercase
        return "";
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Look for a method on the String class that handles uppercase.' },
      { orderIndex: 2, content: 'The method is `.toUpperCase()`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nreturn text.toUpperCase();\n```' },
    ],
    testCases: [
      { inputData: 'Solution.shout("hello")', expected: 'HELLO', isHidden: false },
      { inputData: 'Solution.shout("Java")', expected: 'JAVA', isHidden: true },
      { inputData: 'Solution.shout("123")', expected: '123', isHidden: true },
    ],
  },

  // -------- M3.5 ----------
  {
    title: 'Java: Clean Up',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Clean Up

Complete the method \`cleanUp\` that takes a messy string, removes the leading/trailing whitespace, and returns it in all lowercase.

### Example

\`\`\`java
Solution.cleanUp("  JAva  ") // "java"
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static String cleanUp(String text) {
        // TODO: Trim and lowercase
        return "";
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `.trim()` to remove spaces and `.toLowerCase()` for the casing.' },
      { orderIndex: 2, content: 'You can chain them: `text.trim().toLowerCase()`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nreturn text.trim().toLowerCase();\n```' },
    ],
    testCases: [
      { inputData: 'Solution.cleanUp("  JAva  ")', expected: 'java', isHidden: false },
      { inputData: 'Solution.cleanUp("NO SPACE")', expected: 'no space', isHidden: true },
      { inputData: 'Solution.cleanUp("   ")', expected: '', isHidden: true },
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
