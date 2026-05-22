/**
 * Wave — Java Module 8 "Advanced String Operations"
 *
 * Adds the Java M8 lesson plus 5 problems.
 *
 * Run:  pnpm tsx prisma/seed-java-m8.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'java';
const MODULE_ORDER_INDEX = 208; // Java Base (200) + Module 8
const MODULE = {
  title: 'String Operations',
  description: 'Slice strings, search them, and manipulate them.',
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
  title: 'Advanced String Magic',
  estimatedMinutes: 15,
  concepts: ['substring', 'split', 'replace', 'contains', 'StringBuilder'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Beyond Simple Text',
      content: `In the real world, text data is often messy or structured in specific ways. You might have a full URL but only need the domain name, or a list of tags separated by commas that you need to turn into a list.

In this module, you'll learn advanced tools for cutting, searching, and transforming strings. Mastering these operations will allow you to parse data, build search engines, and format complex reports.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Slicing and Dicing',
      content: `Java provides powerful methods for looking inside a string:

- **\`substring(start, end)\`**: Extracts a piece of the string. It starts at the \`start\` index and goes up to (but *not* including) the \`end\` index.
- **\`split(delimiter)\`**: Breaks a single string into an array of strings based on a separator (like a space or a comma).
- **\`replace(old, new)\`**: Swaps all occurrences of one piece of text with another.
- **\`contains(sequence)\`**: Returns \`true\` if a string contains a specific word or character.

For building new strings out of many pieces (like reversing a word), Java programmers use **\`StringBuilder\`**, which is faster and more efficient than adding strings together in a loop.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Advanced String tools in Java:',
      code: `String s = "Hello, Java, World";

// Extract "Java"
String sub = s.substring(7, 11);

// Split into ["Hello", "Java", "World"]
String[] parts = s.split(", ");

// Replace
String newS = s.replace("Java", "Coding");

// Efficient building
StringBuilder sb = new StringBuilder();
sb.append("Hi ");
sb.append("there");
String result = sb.toString(); // "Hi there"`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Parsing a CSV Line',
      content: `**Example:** Imagine you have a line of text representing a user: \`"Alice,25,Engineer"\`. We want to extract just the occupation.

\`\`\`java
public class Solution {
    public static String getOccupation(String csvLine) {
        String[] parts = csvLine.split(",");
        // Index 0: Alice, Index 1: 25, Index 2: Engineer
        return parts[2];
    }
}
\`\`\`

By using \`.split(",")\`, we turn one messy string into a clean array where every piece of data has its own index.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Domain Extractor',
      content: `Complete the method \`getDomain\` so that it takes an email address and returns everything after the "@" symbol.`,
      code: `public class Solution {
    public static String getDomain(String email) {
        // TODO: Find index of '@' and return substring after it
        return "";
    }
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Substring Index Out of Bounds.** If your \`end\` index is larger than the string's length, Java will crash. Always check your math!
- ❌ **Empty Split Results.** If you split \`"apple,,"\` by \`","\`, the last item in the array might be empty.
- ❌ **Case-Sensitivity in contains/replace.** \`"Hello".contains("hello")\` is \`false\`. Use \`.toLowerCase()\` first if you want a case-insensitive search.
- ❌ **StringBuilder \`.toString()\`**. Don't forget that if you use a \`StringBuilder\`, you must call \`.toString()\` at the very end to get an actual string back.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const PROBLEMS: ProblemInput[] = [
  // -------- M8.1 ----------
  {
    title: 'Java: Reverse String',
    orderIndex: 1,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Reverse String

Complete the method \`reverse\` that takes a string and returns a new string with the characters in reverse order.

### Example
\`\`\`java
Solution.reverse("java") // "avaj"
\`\`\`

### Tip
You can use a \`for\` loop starting from the last index (\`s.length() - 1\`) and counting down to 0. Use a \`StringBuilder\` to collect the characters efficiently.
`.trim(),
    starterCode: `public class Solution {
    public static String reverse(String s) {
        StringBuilder sb = new StringBuilder();
        // TODO: Loop backward and append to sb
        return sb.toString();
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Start your loop at `i = s.length() - 1`.' },
      { orderIndex: 2, content: 'Use `sb.append(s.charAt(i))` inside the loop.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nfor (int i = s.length() - 1; i >= 0; i--) {\n    sb.append(s.charAt(i));\n}\nreturn sb.toString();\n```' },
    ],
    testCases: [
      { inputData: 'Solution.reverse("java")', expected: 'avaj', isHidden: false },
      { inputData: 'Solution.reverse("Hello World")', expected: 'dlroW olleH', isHidden: true },
      { inputData: 'Solution.reverse("")', expected: '', isHidden: true },
    ],
  },

  // -------- M8.2 ----------
  {
    title: 'Java: Count Vowels',
    orderIndex: 2,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Count Vowels

Complete the method \`countVowels\` that takes a string and returns the total number of vowels (a, e, i, o, u) it contains. Ignore case (so 'A' and 'a' both count).

### Example
\`\`\`java
Solution.countVowels("Hello") // 2 (e, o)
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static int countVowels(String s) {
        int count = 0;
        String lower = s.toLowerCase();
        // TODO: Loop and check if each char is a vowel
        return count;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a loop to check each character: `lower.charAt(i)`.' },
      { orderIndex: 2, content: 'Use `if (c == \'a\' || c == \'e\' || ...)` to check for vowels.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nfor (int i = 0; i < lower.length(); i++) {\n    char c = lower.charAt(i);\n    if ("aeiou".indexOf(c) != -1) count++;\n}\nreturn count;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.countVowels("Hello")', expected: '2', isHidden: false },
      { inputData: 'Solution.countVowels("JAVA")', expected: '2', isHidden: true },
      { inputData: 'Solution.countVowels("xyz")', expected: '0', isHidden: true },
    ],
  },

  // -------- M8.3 ----------
  {
    title: 'Java: Palindrome',
    orderIndex: 3,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Palindrome Checker

A palindrome is a word that reads the same forward and backward (like "radar" or "level"). 

Complete the method \`isPalindrome\` that returns \`true\` if a string is a palindrome, and \`false\` otherwise. Ignore case.

### Example
\`\`\`java
Solution.isPalindrome("Radar") // true
Solution.isPalindrome("Java")  // false
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static boolean isPalindrome(String s) {
        String lower = s.toLowerCase();
        // TODO: Check if lower is equal to its reverse
        return false;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'You can reuse your logic from the "Reverse String" problem.' },
      { orderIndex: 2, content: 'Build the reversed string and use `.equals()` to compare it to the original.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nString rev = new StringBuilder(lower).reverse().toString();\nreturn lower.equals(rev);\n```' },
    ],
    testCases: [
      { inputData: 'Solution.isPalindrome("radar")', expected: 'true', isHidden: false },
      { inputData: 'Solution.isPalindrome("hello")', expected: 'false', isHidden: true },
      { inputData: 'Solution.isPalindrome("Level")', expected: 'true', isHidden: true },
    ],
  },

  // -------- M8.4 ----------
  {
    title: 'Java: Word Count',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Word Count

Complete the method \`countWords\` that takes a sentence and returns the number of words in it. Assume words are separated by exactly one space.

### Example
\`\`\`java
Solution.countWords("Java is fun") // 3
\`\`\`

### Tip
Use the \`.split(" ")\` method to turn the sentence into an array of words.
`.trim(),
    starterCode: `public class Solution {
    public static int countWords(String sentence) {
        if (sentence.trim().isEmpty()) return 0;
        // TODO: Split and return array length
        return 0;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'The `split` method returns an array of strings.' },
      { orderIndex: 2, content: 'The number of words is just the `length` of that array.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nString[] words = sentence.trim().split(" ");\nreturn words.length;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.countWords("Java is fun")', expected: '3', isHidden: false },
      { inputData: 'Solution.countWords("Hello")', expected: '1', isHidden: true },
      { inputData: 'Solution.countWords("One two three four")', expected: '4', isHidden: true },
    ],
  },

  // -------- M8.5 ----------
  {
    title: 'Java: Clean Spaces',
    orderIndex: 5,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Clean Spaces

Complete the method \`underscoreSpaces\` that takes a string and replaces all space characters with underscores (\`_\`).

### Example
\`\`\`java
Solution.underscoreSpaces("hello world") // "hello_world"
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static String underscoreSpaces(String s) {
        // TODO: Use replace()
        return "";
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `.replace(target, replacement)` method.' },
      { orderIndex: 2, content: 'The target is a space " " and the replacement is "_".' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nreturn s.replace(" ", "_");\n```' },
    ],
    testCases: [
      { inputData: 'Solution.underscoreSpaces("hello world")', expected: 'hello_world', isHidden: false },
      { inputData: 'Solution.underscoreSpaces("a b c")', expected: 'a_b_c', isHidden: true },
      { inputData: 'Solution.underscoreSpaces("none")', expected: 'none', isHidden: true },
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
