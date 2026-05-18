/**
 * Wave 2 — Module 1 "First Lines of Code"
 *
 * Adds the M1 lesson plus problems 1.2–1.5 (Hello, World! 1.1 was migrated in
 * Wave 1). Each new problem follows the existing function-return convention
 * used by seed.ts so the server-side test runner can evaluate test cases as
 * Python expressions over the user's defined function.
 *
 * Run:  pnpm tsx prisma/seed-wave2-m1.ts
 *
 * Idempotent: lesson is upserted; problems are added only if a row with the
 * same title does not yet exist.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

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
  moduleOrderIndex: 1,
  title: 'First Lines of Code',
  estimatedMinutes: 10,
  concepts: ['print', 'strings', 'functions', 'comments'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Make the Computer Talk',
      content: `The first thing every programmer wants to do is **make the computer say something**. That's not a tradition — it's a sanity check. If you can put text on the screen, you know your setup works, your code runs, and you have a real signal you can build on.

In this module you'll learn to print messages, define your first functions, and leave notes for yourself with comments. Tiny skills, but everything else builds on them.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'print, strings, def, return',
      content: `Four ideas — that's all you need for your first program:

- **\`print\`** is a built-in function that puts text on the screen. You call it by writing the name followed by parentheses: \`print("Hello")\`.
- A **string** is text in quotes. \`"hello"\` and \`'hello'\` are both strings. Both single and double quotes work — pick one and stay consistent.
- **\`def\`** lets you create your own functions. A function is a named bundle of instructions. Inside it, **\`return\`** sends a value back to whoever called the function.
- **Comments** start with \`#\` — Python ignores them. They're notes for the humans reading the code (including future-you).

LearnCode problems all follow the same shape: you fill in a function that **returns** the answer. The grader checks the return value, and your description shows you what the function should produce.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'The four pieces side by side:',
      code: `# A comment — ignored by Python

# print puts text on the screen
print("Hello!")

# Strings — text in quotes
greeting = "Hello"

# A function definition. Calling greet() runs the body and returns a value.
def greet():
    return "Hello, World!"

# Call it like this:
print(greet())`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'From print to return',
      content: `**Example 1:** the simplest possible program — printing one line.

\`\`\`python
print("Today is a good day to code.")
\`\`\`

That single line is a complete Python program. When you Run it, you see the text in the output.

**Example 2:** wrapping the same idea in a function. Functions are reusable: define once, call many times.

\`\`\`python
def motto():
    return "Today is a good day to code."

# Call the function and print its result:
print(motto())
print(motto())
\`\`\`

The function \`motto\` doesn't print anything by itself. It **returns** a string. The \`print\` calls outside the function are what actually puts the text on screen. Keeping the *making* of a value separate from the *showing* of it is one of the most important habits in programming.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: A One-Line Hello',
      content: `Finish the function so it returns the string \`"Hello!"\`. Then run the code — the \`print(say_hello())\` line at the bottom shows the result.`,
      code: `def say_hello():
    # Return the string "Hello!" below:
    pass

print(say_hello())
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Forgetting the quotes around a string.** \`return Hello\` makes Python look for a variable named Hello — and crash when it doesn't find one. Use \`return "Hello"\`.
- ❌ **Forgetting the colon at the end of a \`def\` line.** \`def greet()\` alone is a syntax error — must be \`def greet():\`.
- ❌ **\`print\` instead of \`return\`.** \`print("Hello")\` shows text on screen but the function's *return value* is \`None\`. LearnCode tests grade the return value, so swap to \`return\`.
- ❌ **Inconsistent indentation.** Every line inside a function must be indented the same amount (4 spaces is the convention).`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

interface HintInput {
  orderIndex: number;
  content: string;
}

interface TestCaseInput {
  inputData: string;
  expected: string;
  isHidden: boolean;
}

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
  // -------- M1.2 ----------
  {
    title: 'Greet by Name',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Greet by Name

Build on Hello, World by greeting **anyone**.

Write a function called \`greet\` that takes one parameter \`name\` (a string) and returns a greeting in this exact format:

\`\`\`
Hello, <name>!
\`\`\`

### Example

\`\`\`python
result = greet("Alice")
print(result)   # Hello, Alice!
\`\`\`

> **Tip:** You can build the result by **concatenating** strings with \`+\`, or by using an **f-string** like \`f"Hello, {name}!"\`. Both are fine — pick whichever feels clearer.
    `.trim(),
    starterCode: `def greet(name):
    # Build and return the greeting below.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Your function receives a name and should send back a string. Remember which keyword sends a value back from a function.`,
      },
      {
        orderIndex: 2,
        content: `You have two clean options for sticking a name into a sentence:

\`\`\`python
"Hello, " + name + "!"
f"Hello, {name}!"
\`\`\`

Both produce the same result.`,
      },
      {
        orderIndex: 3,
        content: `The full body is one line:

\`\`\`python
def greet(name):
    return f"Hello, {name}!"
\`\`\`

Pay attention to the comma after Hello, the space before the name, and the exclamation mark at the end.`,
      },
    ],
    testCases: [
      { inputData: `greet("Alice")`, expected: `Hello, Alice!`, isHidden: false },
      { inputData: `greet("Bob")`, expected: `Hello, Bob!`, isHidden: true },
      { inputData: `greet("World")`, expected: `Hello, World!`, isHidden: true },
      { inputData: `type(greet("X")).__name__`, expected: `str`, isHidden: true },
    ],
  },

  // -------- M1.3 ----------
  {
    title: 'Three Lines',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Three Lines

Write a function called \`verses\` that takes no parameters and returns a **single string** containing three lines. Use the newline character \`\\n\` to separate the lines.

The exact text the function must return:

\`\`\`
The sky is blue.
The grass is green.
The code runs clean.
\`\`\`

### Example

\`\`\`python
print(verses())
# The sky is blue.
# The grass is green.
# The code runs clean.
\`\`\`

> **Tip:** \`"\\n"\` inside a string is interpreted as a single newline character — that's how you put line breaks inside one string.
    `.trim(),
    starterCode: `def verses():
    # Return the three-line string below.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `You only need to return *one* string. The newlines live **inside** that string, written as \`\\n\`.`,
      },
      {
        orderIndex: 2,
        content: `The shape is:

\`\`\`python
return "line one\\nline two\\nline three"
\`\`\`

Replace each placeholder with the exact wording from the description.`,
      },
      {
        orderIndex: 3,
        content: `Final string:

\`\`\`python
return "The sky is blue.\\nThe grass is green.\\nThe code runs clean."
\`\`\`

Capitalisation, the periods at the end of each line, and the spelling must match exactly.`,
      },
    ],
    testCases: [
      {
        inputData: `verses()`,
        expected: `The sky is blue.\nThe grass is green.\nThe code runs clean.`,
        isHidden: false,
      },
      { inputData: `verses().count("\\n")`, expected: `2`, isHidden: true },
      { inputData: `len(verses().split("\\n"))`, expected: `3`, isHidden: true },
      { inputData: `verses().split("\\n")[0]`, expected: `The sky is blue.`, isHidden: true },
      { inputData: `verses().split("\\n")[2]`, expected: `The code runs clean.`, isHidden: true },
    ],
  },

  // -------- M1.4 ----------
  {
    title: 'Escape Characters',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Escape Characters

Inside a string, **\`\\n\`** means a newline and **\`\\t\`** means a tab. Together they let you format text neatly with one string and one print call.

Write a function called \`name_tag\` that takes one parameter \`name\` and returns a name tag string in this exact format:

\`\`\`
HELLO
\tmy name is <name>
\`\`\`

(The second line starts with a tab character, followed by the literal text \`my name is \`, followed by the given name.)

### Example

\`\`\`python
print(name_tag("Sam"))
# HELLO
#     my name is Sam
\`\`\`

(The exact spacing the tab produces depends on your terminal — Python just inserts the tab character; your terminal decides how wide to render it.)
    `.trim(),
    starterCode: `def name_tag(name):
    # Use \\n for the newline and \\t for the tab.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Your function needs to return **one** string that contains a newline and a tab. Both fit inside a single pair of quotes when written with escape sequences.`,
      },
      {
        orderIndex: 2,
        content: `Sketch the shape with placeholders:

\`\`\`python
return "HELLO\\n\\tmy name is " + name
\`\`\`

Plug \`name\` onto the end — the rest is exact text.`,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def name_tag(name):
    return "HELLO\\n\\tmy name is " + name
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `name_tag("Sam")`, expected: `HELLO\n\tmy name is Sam`, isHidden: false },
      { inputData: `name_tag("Alex")`, expected: `HELLO\n\tmy name is Alex`, isHidden: true },
      { inputData: `name_tag("X").count("\\n")`, expected: `1`, isHidden: true },
      { inputData: `name_tag("X").count("\\t")`, expected: `1`, isHidden: true },
      { inputData: `name_tag("Q").startswith("HELLO")`, expected: `True`, isHidden: true },
    ],
  },

  // -------- M1.5 (DEBUG) ----------
  {
    title: 'Fix the Square',
    orderIndex: 5,
    difficulty: Difficulty.easy,
    type: ProblemType.DEBUG,
    description: `
## Fix the Square

The starter code below **looks** like a function that calculates the area of a square — but it has a bug. The body uses the wrong operator: addition instead of multiplication. With a side of 3, it returns 6 instead of 9.

Your job:

1. **Fix the bug** so \`square_area(side)\` returns \`side * side\`.
2. **Add a short comment** above the return line explaining what the function does. Comments start with \`#\` and are ignored by Python — they exist to help humans read your code.

### Reminder

The area of a square with side \`s\` is \`s × s\`, which in Python is \`s * s\`.

### Example

\`\`\`python
print(square_area(3))   # 9
print(square_area(5))   # 25
\`\`\`
    `.trim(),
    starterCode: `def square_area(side):
    return side + side
`,
    hints: [
      {
        orderIndex: 1,
        content: `Read the current return line out loud. With \`side = 3\`, \`side + side\` is \`6\`. But \`3 × 3\` is \`9\`. Which operator do you need?`,
      },
      {
        orderIndex: 2,
        content: `In Python, multiplication is the \`*\` symbol — not \`x\` or \`×\`. The general shape:

\`\`\`python
return side * side
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full fix, with a comment:

\`\`\`python
def square_area(side):
    # Area of a square = side multiplied by itself.
    return side * side
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `square_area(3)`, expected: `9`, isHidden: false },
      { inputData: `square_area(0)`, expected: `0`, isHidden: true },
      { inputData: `square_area(5)`, expected: `25`, isHidden: true },
      { inputData: `square_area(10)`, expected: `100`, isHidden: true },
      { inputData: `square_area(7)`, expected: `49`, isHidden: true },
    ],
  },
];

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function upsertLesson() {
  const mod = await prisma.module.findUnique({
    where: { orderIndex: LESSON.moduleOrderIndex },
  });
  if (!mod) throw new Error(`Module M${LESSON.moduleOrderIndex} not found`);

  const existing = await prisma.lesson.findUnique({ where: { moduleId: mod.id } });
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
    console.log(`↻ Updated M${LESSON.moduleOrderIndex} lesson: ${LESSON.title}`);
  } else {
    await prisma.lesson.create({
      data: {
        moduleId: mod.id,
        title: LESSON.title,
        estimatedMinutes: LESSON.estimatedMinutes,
        concepts: LESSON.concepts,
        sections: { create: LESSON.sections },
      },
    });
    console.log(`+ Seeded M${LESSON.moduleOrderIndex} lesson: ${LESSON.title}`);
  }
  return mod.id;
}

async function upsertProblems(moduleId: number) {
  for (const p of PROBLEMS) {
    const existing = await prisma.problem.findFirst({ where: { title: p.title } });
    if (existing) {
      console.log(`= Problem already exists: ${p.title} (id=${existing.id}) — skipping`);
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
      `+ Seeded M1.${p.orderIndex} ${p.title} (id=${created.id}, ${p.hints.length} hints, ${p.testCases.length} test cases)`,
    );
  }
}

async function main() {
  const moduleId = await upsertLesson();
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
