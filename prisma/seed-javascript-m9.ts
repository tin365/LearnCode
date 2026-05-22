/**
 * Wave — JavaScript Module 9 "Objects (Dictionaries)"
 *
 * Adds the JavaScript M9 lesson plus 5 problems.
 *
 * Run:  pnpm tsx prisma/seed-javascript-m9.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'javascript';
const MODULE_ORDER_INDEX = 109; // JavaScript Base (100) + Module 9
const MODULE = {
  title: 'Objects (Dictionaries)',
  description: 'Work with key-value data.',
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
  title: 'Key-Value Pairs with Objects',
  estimatedMinutes: 15,
  concepts: ['Objects', 'Keys and Values', 'Dot notation', 'Bracket notation'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Looking Things Up',
      content: `In an array, you find items by their position (0, 1, 2...). But often, it's more useful to find items by a **name** or a **key**.

Imagine a contact list: you don't look for the 50th contact; you look for the name "Alice" to find her number. In JavaScript, we use **Objects** to store these pairs. This is how settings, user profiles, and product catalogs are built.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'What is an Object?',
      content: `An **Object** is a collection of related data in the form of **Key-Value pairs**.

- **Key**: The name you use to look something up (like "username").
- **Value**: The data associated with that key (like "coding_wizard").

You create an object using curly braces \`{}\`. Once data is inside, you can get it out using **dot notation** (\`obj.key\`) or **bracket notation** (\`obj["key"]\`).`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Creating and using objects in JavaScript:',
      code: `const user = {
  name: "Alice",
  age: 25,
  isAdmin: true
};

// Reading data (Dot notation)
console.log(user.name); // "Alice"

// Reading data (Bracket notation)
console.log(user["age"]); // 25

// Adding/Updating data
user.email = "alice@example.com";
user.age = 26;

// Checking if a key exists
const hasName = "name" in user; // true

// Getting all keys
const keys = Object.keys(user); // ["name", "age", "isAdmin", "email"]`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'A Simple Phonebook',
      content: `**Example:** Building a phonebook where we store names and numbers, then look up a specific person's number.

\`\`\`javascript
function getPhoneNumber(name) {
  const phonebook = {
    "Alice": "555-0101",
    "Bob": "555-0202"
  };
  
  if (name in phonebook) {
    return phonebook[name];
  } else {
    return "Not found";
  }
}

console.log(getPhoneNumber("Alice")); // "555-0101"
console.log(getPhoneNumber("Charlie")); // "Not found"
\`\`\`

Notice we use **bracket notation** (\`phonebook[name]\`) because the key we want to look up is stored in a variable.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Fruit Counter',
      content: `Complete the function \`getQuantity\` to return the count of a fruit from the inventory object. Add "apple": 5 and "banana": 10.`,
      code: `function getQuantity(fruit) {
  const inventory = {
    // TODO: Add apple and banana
  };
  
  // TODO: Return count for 'fruit' or 0 if missing
}

console.log(getQuantity("apple")); // Should be 5
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Keys must be unique.** If you have \`name: "Alice"\` and then add \`name: "Bob"\`, the first one is overwritten.
- ❌ **Mixing up dot and bracket notation.** Use \`obj.key\` when you know the exact name. Use \`obj[variable]\` when the key name is stored in another variable.
- ❌ **Forgetting commas.** Every key-value pair in an object must be separated by a comma.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const PROBLEMS: ProblemInput[] = [
  // -------- M9.1 ----------
  {
    title: 'JS: Contact Book',
    orderIndex: 1,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Contact Book

Complete the function \`findNumber\` that takes an object \`contacts\` and a \`targetName\`. 

Return the phone number if it exists, or \`"Missing"\` if it doesn't.
`.trim(),
    starterCode: `function findNumber(contacts, targetName) {
  // TODO: Look up targetName
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `targetName in contacts` to check if it exists.' },
      { orderIndex: 2, content: 'Use bracket notation `contacts[targetName]` to get the value.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction findNumber(contacts, targetName) {\n  if (targetName in contacts) return contacts[targetName];\n  return "Missing";\n}\n```' },
    ],
    testCases: [
      { inputData: 'findNumber({"Alice": "123"}, "Alice")', expected: '"123"', isHidden: false },
      { inputData: 'findNumber({"Alice": "123"}, "Bob")', expected: '"Missing"', isHidden: true },
    ],
  },

  // -------- M9.2 ----------
  {
    title: 'JS: Letter Frequency',
    orderIndex: 2,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Letter Frequency

Complete the function \`countLetters\` that takes a string and returns an object where the keys are characters and the values are the number of times that character appeared.

### Example
\`\`\`javascript
countLetters("apple") // {a: 1, p: 2, l: 1, e: 1}
\`\`\`
`.trim(),
    starterCode: `function countLetters(s) {
  const counts = {};
  // TODO: Loop through s and update counts
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop through the string using `for (let char of s)`.' },
      { orderIndex: 2, content: 'If the char is already in `counts`, add 1. If not, set it to 1.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction countLetters(s) {\n  const counts = {};\n  for (let char of s) {\n    counts[char] = (counts[char] || 0) + 1;\n  }\n  return counts;\n}\n```' },
    ],
    testCases: [
      { inputData: 'countLetters("apple")["p"]', expected: '2', isHidden: false },
      { inputData: 'Object.keys(countLetters("abc")).length', expected: '3', isHidden: true },
    ],
  },

  // -------- M9.3 ----------
  {
    title: 'JS: Most Common',
    orderIndex: 3,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Most Common Item

Find the string that appears most often in an array.
`.trim(),
    starterCode: `function getMostCommon(items) {
  // TODO: 1. Count items in an object
  // TODO: 2. Find key with max value
}
`,
    hints: [
      { orderIndex: 1, content: 'First build a frequency object just like the last problem.' },
      { orderIndex: 2, content: 'Then loop over the object using `for (let key in counts)` to find the highest number.' },
      { orderIndex: 3, content: 'Keep track of a `winner` and a `maxCount` variable.' },
    ],
    testCases: [
      { inputData: 'getMostCommon(["a", "a", "b"])', expected: '"a"', isHidden: false },
      { inputData: 'getMostCommon(["apple", "banana", "banana"])', expected: '"banana"', isHidden: true },
    ],
  },

  // -------- M9.4 ----------
  {
    title: 'JS: Invert Object',
    orderIndex: 4,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Invert Object

Take an object and return a NEW object where the keys become values and the values become keys. Assume all values are unique.
`.trim(),
    starterCode: `function invert(obj) {
  const result = {};
  // TODO: Swap keys and values
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop over the keys using `for (let key in obj)`.' },
      { orderIndex: 2, content: 'Set `result[obj[key]] = key`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction invert(obj) {\n  const result = {};\n  for (let key in obj) {\n    result[obj[key]] = key;\n  }\n  return result;\n}\n```' },
    ],
    testCases: [
      { inputData: 'invert({"a": 1})[1]', expected: '"a"', isHidden: false },
      { inputData: 'Object.keys(invert({"x": 100})).length', expected: '1', isHidden: true },
    ],
  },

  // -------- M9.5 ----------
  {
    title: 'JS: Group by Length',
    orderIndex: 5,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Group by Length

Return an object where keys are word lengths and values are the number of words with that length.
`.trim(),
    starterCode: `function groupByLength(words) {
  const result = {};
  // TODO: Count occurrences of lengths
}
`,
    hints: [
      { orderIndex: 1, content: 'The key is `word.length`.' },
      { orderIndex: 2, content: 'Initialize the count to 0 if the length hasn\'t been seen yet.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```javascript\nfunction groupByLength(words) {\n  const res = {};\n  for (let w of words) {\n    res[w.length] = (res[w.length] || 0) + 1;\n  }\n  return res;\n}\n```' },
    ],
    testCases: [
      { inputData: 'groupByLength(["a", "bb", "ccc"])[1]', expected: '1', isHidden: false },
      { inputData: 'groupByLength(["hi", "ho"])[2]', expected: '2', isHidden: true },
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
