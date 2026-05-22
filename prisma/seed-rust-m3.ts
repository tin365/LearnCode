/**
 * Wave — Rust Module 3 "Strings in Depth"
 *
 * Adds the Rust M3 lesson plus 5 problems.
 *
 * Run:  pnpm tsx prisma/seed-rust-m3.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'rust';
const MODULE_ORDER_INDEX = 303; // Rust Base (300) + Module 3
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
  title: 'Strings and Formatting',
  estimatedMinutes: 12,
  concepts: ['String vs &str', 'format!', 'len()', 'trim', 'to_uppercase'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'The Language of People',
      content: `Computers love numbers, but people love words. Almost every app you use spends its time showing you text: your friend's name, a news headline, or a message you just typed.

Rust handles text with extreme precision. Learning how to combine, search, and clean up strings is essential because text is how your program talks to the world.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'The Two Types of Text',
      content: `Rust actually has two main ways to handle text, and this often confuses beginners:

1. **\`&str\`** (String Slice): This is like a "view" into some text. It's fast and lightweight. Literal text in your code (like \`"hello"\`) is always an \`&str\`.
2. **\`String\`**: This is a full, flexible text object that you can grow or change.

In LearnCode problems, your functions will often take an **\`&str\`** as input and return a **\`String\`** as the result. You can turn any \`&str\` into a \`String\` by calling **\`.to_string()\`**.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Common String operations in Rust:',
      code: `let s = "  Rust code  ";

// Join strings (the easy way)
let msg = format!("Hello {}", "World");

// Get length (number of bytes)
let len = s.len();

// Change case
let loud = s.to_uppercase();

// Remove whitespace
let clean = s.trim();

// Convert &str to String
let owned = "hi".to_string();`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Cleaning and Combining',
      content: `**Example:** Combining a first and last name while ensuring they are clean.

\`\`\`rust
fn full_name(first: &str, last: &str) -> String {
    // Trim removes spaces, then we format them together
    format!("{} {}", first.trim(), last.trim())
}
\`\`\`

The \`format!\` macro is the Swiss Army Knife of Rust strings. You write the "template" with \`{}\` as placeholders, and Rust fills them in with your variables.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Shout it Out',
      content: `Complete the function \`shout\` so that it takes text, removes any extra spaces, and returns it in all uppercase.`,
      code: `fn shout(text: &str) -> String {
    // TODO: trim() and to_uppercase()
    String::new()
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Using \`+\` for strings.** While possible, it's very messy in Rust. Always prefer the **\`format!\`** macro for combining text.
- ❌ **Forgetting \`.to_string()\`.** If a function expects a \`String\` but you give it \`"hello"\`, Rust will complain. Use \`"hello".to_string()\`.
- ❌ **Thinking methods change the string.** In Rust, \`s.trim()\` doesn't change \`s\`; it returns the trimmed version. You must use the result!`,
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
    title: 'Rust: Full Name',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Full Name

Complete the function \`combine_names\` that takes two string slices (\`first\` and \`last\`) and returns the full name with a space in between as a \`String\`.

### Example
\`\`\`rust
combine_names("Alice", "Smith") // "Alice Smith"
\`\`\`
`.trim(),
    starterCode: `fn combine_names(first: &str, last: &str) -> String {
    // TODO: Join with a space
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `format!` macro.' },
      { orderIndex: 2, content: 'The pattern is `"{}"` followed by a space and another `"{}"`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn combine_names(first: &str, last: &str) -> String {\n    format!("{} {}", first, last)\n}\n```' },
    ],
    testCases: [
      { inputData: 'combine_names("Alice", "Smith")', expected: '"Alice Smith"', isHidden: false },
      { inputData: 'combine_names("Bob", "Jones")', expected: '"Bob Jones"', isHidden: true },
    ],
  },

  // -------- M3.2 ----------
  {
    title: 'Rust: Build a Sentence',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Build a Sentence

Complete the function \`make_sentence\` that takes a \`name\` and a \`hobby\` and returns a sentence:
\`<name> loves to <hobby>.\`

### Example
\`\`\`rust
make_sentence("Alice", "code") // "Alice loves to code."
\`\`\`
`.trim(),
    starterCode: `fn make_sentence(name: &str, hobby: &str) -> String {
    // TODO: Build the sentence
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `format!` to build the string piece by piece.' },
      { orderIndex: 2, content: 'Remember the literal text " loves to " and the period at the end.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nformat!("{} loves to {}.", name, hobby)\n```' },
    ],
    testCases: [
      { inputData: 'make_sentence("Alice", "code")', expected: '"Alice loves to code."', isHidden: false },
      { inputData: 'make_sentence("Sam", "run")', expected: '"Sam loves to run."', isHidden: true },
    ],
  },

  // -------- M3.3 ----------
  {
    title: 'Rust: String Length',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## String Length

Complete the function \`get_len\` that takes a string slice and returns its length as a \`usize\` (the standard type for sizes in Rust).
`.trim(),
    starterCode: `fn get_len(text: &str) -> usize {
    // TODO: Return length
    0
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `.len()` method.' },
      { orderIndex: 2, content: 'Note: In Rust, `.len()` returns the number of bytes, which works for standard text.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn get_len(text: &str) -> usize {\n    text.len()\n}\n```' },
    ],
    testCases: [
      { inputData: 'get_len("Rust")', expected: '4', isHidden: false },
      { inputData: 'get_len("")', expected: '0', isHidden: true },
    ],
  },

  // -------- M3.4 ----------
  {
    title: 'Rust: Shout!',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Shout!

Complete the function \`shout\` that takes a string slice and returns it in all uppercase as a \`String\`.
`.trim(),
    starterCode: `fn shout(text: &str) -> String {
    // TODO: Convert to uppercase
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'Look for the `.to_uppercase()` method.' },
      { orderIndex: 2, content: 'Remember that this method returns a new String.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn shout(text: &str) -> String {\n    text.to_uppercase()\n}\n```' },
    ],
    testCases: [
      { inputData: 'shout("hello")', expected: '"HELLO"', isHidden: false },
      { inputData: 'shout("Rust")', expected: '"RUST"', isHidden: true },
    ],
  },

  // -------- M3.5 ----------
  {
    title: 'Rust: Clean Up',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Clean Up

Complete the function \`clean_up\` that takes a string slice, removes extra spaces at the ends, and returns it in lowercase.

### Example
\`\`\`rust
clean_up("  RUST  ") // "rust"
\`\`\`
`.trim(),
    starterCode: `fn clean_up(text: &str) -> String {
    // TODO: trim and lowercase
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `.trim()` first.' },
      { orderIndex: 2, content: 'Chain it with `.to_lowercase()`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn clean_up(text: &str) -> String {\n    text.trim().to_lowercase()\n}\n```' },
    ],
    testCases: [
      { inputData: 'clean_up("  RUST  ")', expected: '"rust"', isHidden: false },
      { inputData: 'clean_up("Mixed CASE")', expected: '"mixed case"', isHidden: true },
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
