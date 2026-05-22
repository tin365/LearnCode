/**
 * Wave — Rust Module 1 "First Lines of Code"
 *
 * Adds the Rust M1 lesson plus 5 problems.
 *
 * Run:  pnpm tsx prisma/seed-rust-m1.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'rust';
const MODULE_ORDER_INDEX = 301; // Rust Base (300) + Module 1
const MODULE = {
  title: 'First Lines of Code',
  description: 'Your first Rust: println!, strings, functions, comments.',
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
  title: 'First Lines of Rust',
  estimatedMinutes: 10,
  concepts: ['println!', 'String', 'fn', 'return'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Make the Computer Talk',
      content: `The first thing every programmer wants to do is **make the computer say something**. It's a "sanity check" to ensure your environment is working and your code actually runs.

In this module, you'll learn how to print messages, package instructions into **functions**, and write notes for yourself using **comments**. These are the tiny building blocks that every complex system uses!`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Printing and Functions',
      content: `Rust is very precise. Here are the four things you need to know for your first program:

- **\`println!\`**: This is a "macro" (think of it as a special command) that prints text to the screen. It always ends with an exclamation mark \`!\`.
- **Strings**: Text wrapped in double quotes, like \`"Hello"\`. In Rust, you must use double quotes for text.
- **Functions (\`fn\`)**: A named bundle of instructions. You'll see the \`fn\` keyword followed by a name.
- **Return Value**: In these problems, you'll write functions that "return" a result. The last line of a function (without a semicolon) is what it hands back to the computer.
- **Comments**: Use \`//\` to write notes that the computer ignores.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'The basic Rust pieces side by side:',
      code: `// A comment — ignored by Rust

fn main() {
    // println! prints text to the screen
    println!("Hello!");
    
    // Calling a function
    let result = greet();
    println!("{}", result);
}

// A function that returns a String
fn greet() -> String {
    "Hello, World!".to_string()
}`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'From Print to Return',
      content: `**Example 1:** The simplest program prints a line.

\`\`\`rust
fn main() {
    println!("Welcome to Rust!");
}
\`\`\`

**Example 2:** In LearnCode, we usually use functions that **return** a value.

\`\`\`rust
fn welcome_message() -> String {
    // Note: No semicolon on the last line means "return this"
    "Welcome to Rust!".to_string()
}
\`\`\`

Notice the \`-> String\` part — this tells Rust that the function will hand back a piece of text. We use \`.to_string()\` to turn a literal piece of text into a full Rust String object.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: A One-Line Hello',
      content: `Complete the function \`say_hello\` so that it returns the exact string \`"Hello!"\`.`,
      code: `fn say_hello() -> String {
    // TODO: Return "Hello!" below
    String::new()
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Forgetting the exclamation mark.** It's \`println!\`, not \`println\`. Without the \`!\`, Rust thinks you are looking for a normal function, and it won't find it!
- ❌ **Semicolon confusion.** In Rust, adding a \`;\` to the last line of a function means "do this, then return nothing." If you want to return a value, leave the \`;\` off the last expression!
- ❌ **Using single quotes.** \`"Hello"\` is a string (text), but \`'H'\` is a character (one letter). Use double quotes for strings.
- ❌ **Case-sensitivity.** \`Fn\` or \`Println!\` will not work. Rust uses lowercase for keywords.`,
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
  // -------- M1.1 ----------
  {
    title: 'Rust: Hello, World!',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Hello, World!

The ultimate tradition! Make the computer speak.

Complete the function \`hello_world\` so it returns the exact string:

\`\`\`
Hello, World!
\`\`\`

> **Tip:** In Rust, if the last line of a function has no semicolon, that value is **returned** automatically. Use \`"your text".to_string()\` to create a String.
`.trim(),
    starterCode: `fn hello_world() -> String {
    // TODO: Return "Hello, World!"
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'You need to return a String. Use quotes for the text.' },
      { orderIndex: 2, content: 'To turn literal text into a String object, add `.to_string()` to the end of it.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn hello_world() -> String {\n    "Hello, World!".to_string()\n}\n```' },
    ],
    testCases: [
      { inputData: 'hello_world()', expected: '"Hello, World!"', isHidden: false },
      { inputData: 'hello_world().len()', expected: '13', isHidden: true },
    ],
  },

  // -------- M1.2 ----------
  {
    title: 'Rust: Greet by Name',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Greet by Name

Now let's greet **anyone**.

Complete the function \`greet\` that takes one parameter \`name\` (a string slice \`&str\`) and returns a greeting in this format:

\`\`\`
Hello, <name>!
\`\`\`

> **Tip:** You can use the \`format!\` macro to build a string. It works like \`println!\` but returns a String instead of printing it: \`format!("Hi {}!", name)\`.
`.trim(),
    starterCode: `fn greet(name: &str) -> String {
    // TODO: Build and return the greeting
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'The `format!` macro is the easiest way to stick a variable into text.' },
      { orderIndex: 2, content: 'Try: `format!("Hello, {}!", name)`' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn greet(name: &str) -> String {\n    format!("Hello, {}!", name)\n}\n```' },
    ],
    testCases: [
      { inputData: 'greet("Alice")', expected: '"Hello, Alice!"', isHidden: false },
      { inputData: 'greet("Bob")', expected: '"Hello, Bob!"', isHidden: true },
    ],
  },

  // -------- M1.3 ----------
  {
    title: 'Rust: Three Lines',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Three Lines

Complete the function \`verses\` so it returns a **single String** containing three lines of text. Use \`\\n\` to separate the lines.

The text must be:
\`\`\`
The sky is blue.
The grass is green.
The code runs clean.
\`\`\`
`.trim(),
    starterCode: `fn verses() -> String {
    // TODO: Return the three-line string
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `\\n` inside your string to create a line break.' },
      { orderIndex: 2, content: 'The shape is: `"line1\\nline2\\nline3".to_string()`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\n"The sky is blue.\\nThe grass is green.\\nThe code runs clean.".to_string()\n```' },
    ],
    testCases: [
      { inputData: 'verses()', expected: '"The sky is blue.\\nThe grass is green.\\nThe code runs clean."', isHidden: false },
      { inputData: 'verses().lines().count()', expected: '3', isHidden: true },
    ],
  },

  // -------- M1.4 ----------
  {
    title: 'Rust: Escape Characters',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Escape Characters

Inside strings, **\`\\n\`** means newline and **\`\\t\`** means a horizontal tab.

Complete the function \`name_tag\` that takes a \`name\` and returns a string in this format:

\`\`\`
HELLO
\tmy name is <name>
\`\`\`
`.trim(),
    starterCode: `fn name_tag(name: &str) -> String {
    // TODO: Use \\n and \\t
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'Use the `format!` macro with `\\n` and `\\t`.' },
      { orderIndex: 2, content: 'The pattern is: `format!("HELLO\\n\\tmy name is {}")`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nformat!("HELLO\\n\\tmy name is {}", name)\n```' },
    ],
    testCases: [
      { inputData: 'name_tag("Sam")', expected: '"HELLO\\n\\tmy name is Sam"', isHidden: false },
      { inputData: 'name_tag("Alex")', expected: '"HELLO\\n\\tmy name is Alex"', isHidden: true },
    ],
  },

  // -------- M1.5 (DEBUG) ----------
  {
    title: 'Rust: Fix the Square',
    orderIndex: 5,
    difficulty: Difficulty.easy,
    type: ProblemType.DEBUG,
    description: `
## Fix the Square

The code below is supposed to calculate the area of a square — but it has a bug. It uses addition (\`+\`) instead of multiplication (\`*\`).

**Your Job:**
1. Fix the bug.
2. Add a comment starting with \`//\` explaining what the code does.
`.trim(),
    starterCode: `fn square_area(side: i32) -> i32 {
    side + side
}
`,
    hints: [
      { orderIndex: 1, content: 'Area of a square is side multiplied by itself.' },
      { orderIndex: 2, content: 'Change `side + side` to `side * side`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfn square_area(side: i32) -> i32 {\n    // Area is side squared\n    side * side\n}\n```' },
    ],
    testCases: [
      { inputData: 'square_area(3)', expected: '9', isHidden: false },
      { inputData: 'square_area(5)', expected: '25', isHidden: true },
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
