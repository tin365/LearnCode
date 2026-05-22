/**
 * Wave — JavaScript Module 8 "Advanced String Operations"
 *
 * Adds the JavaScript M8 lesson plus 5 problems.
 *
 * Run:  pnpm tsx prisma/seed-javascript-m8.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'javascript';
const MODULE_ORDER_INDEX = 108; // JavaScript Base (100) + Module 8
const MODULE = {
  title: 'String Operations',
  description: 'Slice strings, search them, and manipulate characters.',
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
  concepts: ['substring', 'split', 'replace', 'includes', 'join'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Beyond Simple Text',
      content: `In the real world, text data is often messy or structured in specific ways. You might have a full URL but only need the domain name, or a list of tags separated by commas that you need to turn into an array.

In this module, you'll learn advanced tools for cutting, searching, and transforming strings. Mastering these operations will allow you to parse data and build smarter search features in your apps.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Slicing and Dicing',
      content: `JavaScript provides powerful methods for looking inside a string:

- **\`substring(start, end)\`**: Extracts a piece of the string. It starts at \`start\` and goes up to (but not including) \`end\`.
- **\`split(separator)\`**: Breaks a string into an array based on a character (like a space or comma).
- **\`replace(old, new)\`**: Swaps one piece of text for another.
- **\`includes(search)\`**: Returns \`true\` if the string contains a specific word.

You can also turn an array back into a string using the **\`.join()\`** method.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Advanced String tools in JavaScript:',
      code: `const s = "Hello, JS, World";

// Extract "JS"
const sub = s.substring(7, 9);

// Split into ["Hello", "JS", "World"]
const parts = s.split(", ");

// Replace
const newS = s.replace("JS", "Code");

// Join back together
const back = parts.join(" - "); // "Hello - JS - World"

// Check content
const hasJS = s.includes("JS"); // true`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Parsing a CSV Line',
      content: `**Example:** Imagine you have a line of text representing a user: \`"Alice,25,Engineer"\`. We want to extract just the occupation.

\`\`\`javascript
function getOccupation(csvLine) {
  const parts = csvLine.split(",");
  // Index 0: Alice, Index 1: 25, Index 2: Engineer
  return parts[2];
}

console.log(getOccupation("Alice,25,Engineer")); // "Engineer"
\`\`\`

By using \`.split(",")\`, we turn one messy string into a clean array where every piece of data has its own index.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Domain Extractor',
      content: `Complete the function \`getDomain\` so that it takes an email address and returns everything after the "@" symbol.`,
      code: `function getDomain(email) {
  // TODO: Split by "@" and return the second part
}

console.log(getDomain("alice@example.com")); // "example.com"
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Off-by-one in substring.** \`substring(0, 3)\` gives you characters at 0, 1, and 2. The 3 is NOT included.
- ❌ **Forgetting that strings are immutable.** \`s.replace("a", "b")\` returns a NEW string. It does not change \`s\`.
- ❌ **Case-sensitivity.** \`"Hello".includes("hello")\` is \`false\`. Use \`.toLowerCase()\` if you want to ignore casing.`,
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
    title: 'JS: Reverse String',
    orderIndex: 1,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Reverse String

Complete the function \`reverse\` that takes a string and returns it in reverse order.

> **Tip:** A common trick is to split the string into an array of characters, reverse the array, and join it back together.
`.trim(),
    starterCode: `function reverse(s) {
  // TODO: Reverse the string
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `.split("")` to get an array of characters.' },
      { orderIndex: 2, content: 'Arrays have a `.reverse()` method.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction reverse(s) {\n  return s.split("").reverse().join("");\n}\n```' },
    ],
    testCases: [
      { inputData: 'reverse("js")', expected: '"sj"', isHidden: false },
      { inputData: 'reverse("hello")', expected: '"olleh"', isHidden: true },
    ],
  },

  // -------- M8.2 ----------
  {
    title: 'JS: Count Vowels',
    orderIndex: 2,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Count Vowels

Count the total number of vowels (a, e, i, o, u) in a string. Ignore case.
`.trim(),
    starterCode: `function countVowels(s) {
  let count = 0;
  const lower = s.toLowerCase();
  // TODO: Loop and count vowels
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop through the string using `for (let char of lower)`.' },
      { orderIndex: 2, content: 'Check if `"aeiou".includes(char)`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction countVowels(s) {\n  let count = 0;\n  for (let char of s.toLowerCase()) {\n    if ("aeiou".includes(char)) count++;\n  }\n  return count;\n}\n```' },
    ],
    testCases: [
      { inputData: 'countVowels("Hello")', expected: '2', isHidden: false },
      { inputData: 'countVowels("JS")', expected: '0', isHidden: true },
    ],
  },

  // -------- M8.3 ----------
  {
    title: 'JS: Palindrome',
    orderIndex: 3,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Palindrome Checker

Return \`true\` if a word is a palindrome (reads same forward and backward). Ignore case.
`.trim(),
    starterCode: `function isPalindrome(s) {
  const lower = s.toLowerCase();
  // TODO: Check if lower is equal to its reverse
}
`,
    hints: [
      { orderIndex: 1, content: 'You can use your logic from the "Reverse String" problem.' },
      { orderIndex: 2, content: 'Compare the original lowercase string to the reversed version using `===`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction isPalindrome(s) {\n  const lower = s.toLowerCase();\n  const rev = lower.split("").reverse().join("");\n  return lower === rev;\n}\n```' },
    ],
    testCases: [
      { inputData: 'isPalindrome("radar")', expected: 'true', isHidden: false },
      { inputData: 'isPalindrome("hello")', expected: 'false', isHidden: true },
    ],
  },

  // -------- M8.4 ----------
  {
    title: 'JS: Word Count',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Word Count

Count how many words are in a sentence. Assume words are separated by spaces.
`.trim(),
    starterCode: `function countWords(sentence) {
  // TODO: Split and return length
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `.split(" ")` to get an array of words.' },
      { orderIndex: 2, content: 'If the input is an empty string, the word count should be 0.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction countWords(sentence) {\n  if (sentence.trim() === "") return 0;\n  return sentence.trim().split(/\\s+/).length;\n}\n```' },
    ],
    testCases: [
      { inputData: 'countWords("JS is fun")', expected: '3', isHidden: false },
      { inputData: 'countWords("Hello")', expected: '1', isHidden: true },
    ],
  },

  // -------- M8.5 ----------
  {
    title: 'JS: Clean Spaces',
    orderIndex: 5,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Clean Spaces

Replace all spaces with underscores (\`_\`).
`.trim(),
    starterCode: `function underscoreSpaces(s) {
  // TODO: Use replaceAll
}
`,
    hints: [
      { orderIndex: 1, content: 'Modern JS has a `.replaceAll()` method.' },
      { orderIndex: 2, content: 'The target is `" "` and the replacement is `"_"`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction underscoreSpaces(s) {\n  return s.replaceAll(" ", "_");\n}\n```' },
    ],
    testCases: [
      { inputData: 'underscoreSpaces("hello world")', expected: '"hello_world"', isHidden: false },
      { inputData: 'underscoreSpaces("a b c")', expected: '"a_b_c"', isHidden: true },
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
