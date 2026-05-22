/**
 * Wave — JavaScript Module 3 "Strings in Depth"
 *
 * Adds the JavaScript M3 lesson plus 5 problems.
 *
 * Run:  pnpm tsx prisma/seed-javascript-m3.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'javascript';
const MODULE_ORDER_INDEX = 103; // JavaScript Base (100) + Module 3
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
  title: 'Strings and Templates',
  estimatedMinutes: 12,
  concepts: ['Concatenation', 'Template Literals', 'length', 'toUpperCase', 'trim'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'The Language of People',
      content: `Computers love numbers, but people love words. Almost every app you use spends most of its time showing you text: your friend's name, a news headline, or a message you just typed.

In JavaScript, we handle text using **Strings**. Learning how to manipulate strings — like combining them, searching them, or cleaning them up — is essential because text is how your program talks to the world.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'String Methods and Properties',
      content: `A **String** in JavaScript is more than just text; it comes with built-in tools called **methods** and **properties**.

- **\`.length\`**: A property that tells you how many characters are in the string.
- **\`.toUpperCase()\`**: A method that returns a new string in all CAPS.
- **\`.trim()\`**: A method that removes extra spaces from the start and end.

Modern JavaScript also has **Template Literals**. Instead of using \`+\` to join strings, you can use backticks (\` \` \` \`) and put variables directly inside using \`\${variable}\`. This is much cleaner and easier to read!`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Common String operations in JavaScript:',
      code: `const s = "  JS code  ";

// Join strings (the old way)
const msg = "Hello " + "World";

// Join strings (the new way: Template Literals)
const name = "Alice";
const greeting = \`Hello \${name}!\`;

// Get length
const len = s.length;       // 11

// Change case
const loud = s.toUpperCase(); // "  JS CODE  "

// Remove whitespace
const clean = s.trim();       // "JS code"`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Formatting a Message',
      content: `**Example:** Building a full name and cleaning it up.

\`\`\`javascript
function formatName(first, last) {
  const cleanFirst = first.trim();
  const cleanLast = last.trim();
  return \`\${cleanFirst} \${cleanLast}\`;
}

console.log(formatName(" Alice  ", "Smith")); // "Alice Smith"
\`\`\`

Notice how we use backticks for the template literal and \`\${ }\` to "inject" our variables into the string. This is the professional way to build text in modern JavaScript.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Shout it Out',
      content: `Complete the function \`shout\` so that it takes a string, removes any leading/trailing spaces, and returns it in all uppercase.`,
      code: `function shout(text) {
  // TODO: trim and convert to uppercase
  return "";
}

console.log(shout("  hello  "));
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Mixing up backticks and quotes.** \`\${variable}\` only works inside backticks (\` \` \` \`), not single or double quotes.
- ❌ **Forgetting parentheses on methods.** \`text.toUpperCase\` is the method itself; \`text.toUpperCase()\` is actually *running* the method.
- ❌ **Expecting methods to change the original string.** Strings in JS are immutable. \`text.trim();\` doesn't change \`text\`. You must use the result: \`const clean = text.trim();\`.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

interface HintInput { orderIndex: number; content: string; }
interface TestCaseInput { inputData: string; expected: string; isHidden: boolean; }
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
  // -------- M3.1 ----------
  {
    title: 'JS: Full Name',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Full Name

Complete the function \`combineNames\` that takes two strings — \`first\` and \`last\` — and returns the full name with a space in between.

### Example
\`\`\`javascript
combineNames("Alice", "Smith") // "Alice Smith"
\`\`\`
`.trim(),
    starterCode: `function combineNames(first, last) {
  // TODO: Join with a space
}
`,
    hints: [
      { orderIndex: 1, content: 'You can use the `+` operator or a template literal.' },
      { orderIndex: 2, content: 'With a template literal, use backticks and `${first} ${last}`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction combineNames(first, last) {\n  return `${first} ${last}`;\n}\n```' },
    ],
    testCases: [
      { inputData: 'combineNames("Alice", "Smith")', expected: '"Alice Smith"', isHidden: false },
      { inputData: 'combineNames("Bob", "Jones")', expected: '"Bob Jones"', isHidden: true },
    ],
  },

  // -------- M3.2 ----------
  {
    title: 'JS: Build a Sentence',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Build a Sentence

Complete the function \`makeSentence\` that takes a \`name\` and a \`hobby\` and returns a sentence in this exact format:
\`<name> loves to <hobby>.\`

### Example
\`\`\`javascript
makeSentence("Alice", "code") // "Alice loves to code."
\`\`\`
`.trim(),
    starterCode: `function makeSentence(name, hobby) {
  // TODO: Build the sentence
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a template literal for the easiest path.' },
      { orderIndex: 2, content: 'Don\'t forget the literal text " loves to " and the period "." at the end.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction makeSentence(name, hobby) {\n  return `${name} loves to ${hobby}.`;\n}\n```' },
    ],
    testCases: [
      { inputData: 'makeSentence("Alice", "code")', expected: '"Alice loves to code."', isHidden: false },
      { inputData: 'makeSentence("Sam", "run")', expected: '"Sam loves to run."', isHidden: true },
    ],
  },

  // -------- M3.3 ----------
  {
    title: 'JS: String Length',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## String Length

Complete the function \`getLength\` that takes a string and returns its length as a number.
`.trim(),
    starterCode: `function getLength(text) {
  // TODO: Return length
}
`,
    hints: [
      { orderIndex: 1, content: 'JavaScript strings have a `.length` property.' },
      { orderIndex: 2, content: 'You don\'t need parentheses for `.length` because it is a property, not a method.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction getLength(text) {\n  return text.length;\n}\n```' },
    ],
    testCases: [
      { inputData: 'getLength("JavaScript")', expected: '10', isHidden: false },
      { inputData: 'getLength("")', expected: '0', isHidden: true },
      { inputData: 'getLength("Hello World")', expected: '11', isHidden: true },
    ],
  },

  // -------- M3.4 ----------
  {
    title: 'JS: Shout!',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Shout!

Complete the function \`shout\` that takes a string and returns it in all uppercase letters.
`.trim(),
    starterCode: `function shout(text) {
  // TODO: Convert to uppercase
}
`,
    hints: [
      { orderIndex: 1, content: 'Look for the `.toUpperCase()` method.' },
      { orderIndex: 2, content: 'Remember to include the parentheses `()`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction shout(text) {\n  return text.toUpperCase();\n}\n```' },
    ],
    testCases: [
      { inputData: 'shout("hello")', expected: '"HELLO"', isHidden: false },
      { inputData: 'shout("JS")', expected: '"JS"', isHidden: true },
    ],
  },

  // -------- M3.5 ----------
  {
    title: 'JS: Clean Up',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Clean Up

Complete the function \`cleanUp\` that takes a string, removes whitespace from both ends, and returns it in lowercase.

### Example
\`\`\`javascript
cleanUp("  JAvaScript  ") // "javascript"
\`\`\`
`.trim(),
    starterCode: `function cleanUp(text) {
  // TODO: trim and lowercase
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `.trim()` to remove spaces and `.toLowerCase()` for the casing.' },
      { orderIndex: 2, content: 'You can chain them: `text.trim().toLowerCase()`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction cleanUp(text) {\n  return text.trim().toLowerCase();\n}\n```' },
    ],
    testCases: [
      { inputData: 'cleanUp("  JAvaScript  ")', expected: '"javascript"', isHidden: false },
      { inputData: 'cleanUp("NO SPACE")', expected: '"no space"', isHidden: true },
      { inputData: 'cleanUp("   ")', expected: '""', isHidden: true },
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
