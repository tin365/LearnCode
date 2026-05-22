/**
 * Wave — Rust Module 8 "String Operations"
 *
 * Adds the Rust M8 lesson plus 5 problems.
 *
 * Run:  pnpm tsx prisma/seed-rust-m8.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'rust';
const MODULE_ORDER_INDEX = 308; // Rust Base (300) + Module 8
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
  concepts: ['chars()', 'contains', 'replace', 'split', 'collect'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Beyond Simple Text',
      content: `In the real world, text data is often messy or structured. You might have a full URL but only need the domain name, or a list of tags separated by commas.

In this module, you'll learn advanced tools for cutting, searching, and transforming strings. Mastering these operations allows you to parse data and build smarter search features in your apps.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Slicing and Searching',
      content: `Rust provides powerful tools for looking inside text:

- **\`contains\`**: Checks if a specific word or letter is present.
- **\`replace\`**: Swaps all occurrences of one piece of text with another.
- **\`split\`**: Breaks a single string into a list (Vector) of strings based on a separator.
- **\`chars()\`**: Lets you look at each individual character one by one.

Because Rust strings are UTF-8 encoded, we can't just access characters by index (like \`s[0]\`). Instead, we use methods that safely navigate the text.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Advanced String tools in Rust:',
      code: `let s = "Rust is fast";

// Search
let has_rust = s.contains("Rust"); // true

// Replace
let new_s = s.replace("fast", "cool");

// Split into parts
let words: Vec<&str> = s.split(' ').collect();

// Access individual characters
for c in s.chars() {
    println!("{}", c);
}`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Parsing a CSV Line',
      content: `**Example:** Extracting data from a comma-separated string like \`"Alice,25,Engineer"\`.

\`\`\`rust
fn get_occupation(csv: &str) -> String {
    let parts: Vec<&str> = csv.split(',').collect();
    // Index 0: Alice, Index 1: 25, Index 2: Engineer
    parts[2].to_string()
}
\`\`\`

By using \`split(',')\`, we turn one messy string into a clean collection where every piece of data has its own index. We use \`.collect()\` to turn the "split iterator" into a Vector we can use.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Domain Extractor',
      content: `Complete the function \`get_domain\` to return everything after the "@" symbol in an email.`,
      code: `fn get_domain(email: &str) -> String {
    // TODO: Split by '@' and return the second part
    String::new()
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Trying to index a string.** \`s[0]\` will not compile in Rust. Always use \`.chars().nth(0)\` or similar methods.
- ❌ **Forgetting \`.collect()\`.** Many methods like \`split\` or \`map\` return "iterators" (lazy lists). Use \`.collect()\` if you need an actual Vector.
- ❌ **Case-sensitivity.** \`s.contains("rust")\` is false if the string is "Rust". Use \`.to_lowercase()\` first for case-insensitive search.`,
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
    title: 'Rust: Reverse String',
    orderIndex: 1,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Reverse String

Complete the function \`reverse\` that takes a string slice and returns a new String with the characters in reverse order.

> **Tip:** You can call \`.chars().rev().collect()\` on a string slice!
`.trim(),
    starterCode: `fn reverse(s: &str) -> String {
    // TODO: Reverse the characters
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `.chars()` method to get the characters.' },
      { orderIndex: 2, content: 'Chain `.rev()` and then `.collect()`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn reverse(s: &str) -> String {\n    s.chars().rev().collect()\n}\n```' },
    ],
    testCases: [
      { inputData: 'reverse("rust")', expected: '"tsur"', isHidden: false },
      { inputData: 'reverse("Hello")', expected: '"olleH"', isHidden: true },
    ],
  },

  // -------- M8.2 ----------
  {
    title: 'Rust: Count Vowels',
    orderIndex: 2,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Count Vowels

Count the total number of vowels (a, e, i, o, u) in a string. Ignore case.
`.trim(),
    starterCode: `fn count_vowels(s: &str) -> usize {
    let mut count = 0;
    // TODO: Loop through chars and check
    count
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `for c in s.to_lowercase().chars()`.' },
      { orderIndex: 2, content: 'Check `if c == \'a\' || c == \'e\' ...`' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfor c in s.to_lowercase().chars() {\n    if "aeiou".contains(c) { count += 1; }\n}\ncount\n```' },
    ],
    testCases: [
      { inputData: 'count_vowels("Hello")', expected: '2', isHidden: false },
      { inputData: 'count_vowels("RUST")', expected: '1', isHidden: true },
    ],
  },

  // -------- M8.3 ----------
  {
    title: 'Rust: Palindrome',
    orderIndex: 3,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Palindrome Checker

Return \`true\` if a word is a palindrome (reads same forward and backward). Ignore case.
`.trim(),
    starterCode: `fn is_palindrome(s: &str) -> bool {
    let lower = s.to_lowercase();
    // TODO: Compare lower to its reverse
    false
}
`,
    hints: [
      { orderIndex: 1, content: 'Build a reversed string like you did in the first problem.' },
      { orderIndex: 2, content: 'Compare `lower` with the reversed version using `==`.' },
      { orderIndex: 3, content: 'Try: `let rev: String = lower.chars().rev().collect(); lower == rev`' },
    ],
    testCases: [
      { inputData: 'is_palindrome("radar")', expected: 'true', isHidden: false },
      { inputData: 'is_palindrome("hello")', expected: 'false', isHidden: true },
    ],
  },

  // -------- M8.4 ----------
  {
    title: 'Rust: Word Count',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Word Count

Count how many words are in a sentence. Assume words are separated by spaces.
`.trim(),
    starterCode: `fn count_words(sentence: &str) -> usize {
    // TODO: Split and count
    0
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `.split_whitespace()` method.' },
      { orderIndex: 2, content: 'Chain it with `.count()`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn count_words(sentence: &str) -> usize {\n    sentence.split_whitespace().count()\n}\n```' },
    ],
    testCases: [
      { inputData: 'count_words("Rust is fun")', expected: '3', isHidden: false },
      { inputData: 'count_words("Hello")', expected: '1', isHidden: true },
    ],
  },

  // -------- M8.5 ----------
  {
    title: 'Rust: Clean Spaces',
    orderIndex: 5,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Clean Spaces

Replace all spaces with underscores (\`_\`).
`.trim(),
    starterCode: `fn underscore_spaces(s: &str) -> String {
    // TODO: Use replace
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `.replace(" ", "_")` method.' },
      { orderIndex: 2, content: 'This method works on both &str and String.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn underscore_spaces(s: &str) -> String {\n    s.replace(" ", "_")\n}\n```' },
    ],
    testCases: [
      { inputData: 'underscore_spaces("hello world")', expected: '"hello_world"', isHidden: false },
      { inputData: 'underscore_spaces("a b c")', expected: '"a_b_c"', isHidden: true },
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
