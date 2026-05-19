/**
 * Wave 2 — Module 3 "Strings in Depth"
 *
 * Adds the M3 lesson plus 5 new problems (3.1 – 3.5). Continues the
 * function-return convention used by every other seeded problem.
 *
 * Run:  pnpm tsx prisma/seed-wave2-m3.ts
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

interface SectionInput {
  orderIndex: number;
  type: SectionType;
  title: string | null;
  content: string;
  code: string | null;
}

const LESSON = {
  moduleOrderIndex: 3,
  title: 'Strings in Depth',
  estimatedMinutes: 12,
  concepts: ['concatenation', 'f-strings', 'len', '.upper / .lower', '.strip'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Why Strings Matter',
      content: `Almost everything a computer talks to humans about is a string. Names, addresses, search queries, error messages, headlines, JSON payloads — text, everywhere. The faster you get comfortable combining and reshaping strings, the faster every later problem feels.

This module sharpens the four moves you'll reach for daily: **combining** strings, **measuring** them, **changing their case**, and **trimming** off whitespace.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Combining, Measuring, Transforming',
      content: `**Combining strings** — Python has two main tools:

- The \`+\` operator glues strings end to end: \`"Hello, " + name + "!"\`.
- An **f-string** lets you drop variables straight into a quoted string by prefixing the quote with \`f\`: \`f"Hello, {name}!"\`. Most beginners find f-strings cleaner once they've seen a couple.

**Measuring** — \`len(s)\` returns the number of characters in \`s\`. Useful for everything from character limits to padding.

**Transforming** — strings have built-in methods you call with a dot:

- \`s.lower()\` — return a lowercase copy.
- \`s.upper()\` — return an uppercase copy.
- \`s.strip()\` — return a copy with whitespace removed from both ends.

Methods **return new strings** — they don't change the original. If you want to keep the change, assign it back: \`name = name.strip()\`.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'The five most-used string moves at a glance:',
      code: `name = "  Alice  "

# Combining
"Hi, " + name        # → 'Hi,   Alice  '
f"Hi, {name}!"       # → 'Hi,   Alice  !'

# Measuring
len("hello")         # → 5
len(name)            # → 9   (counts the spaces too)

# Transforming (each returns a NEW string)
name.lower()         # → '  alice  '
name.upper()         # → '  ALICE  '
name.strip()         # → 'Alice'

# Chaining is allowed — left-to-right
name.strip().lower() # → 'alice'`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Greet, Then Clean',
      content: `**Example 1:** build a sentence from a name and an age using an f-string.

\`\`\`python
name = "Alice"
age  = 25
print(f"{name} is {age} years old.")     # Alice is 25 years old.
\`\`\`

**Example 2:** clean up text a user typed in. Real input often has stray spaces and inconsistent capitalisation — chain \`.strip()\` and \`.lower()\` to normalise it.

\`\`\`python
raw   = "   Alice@Example.COM   "
clean = raw.strip().lower()
print(clean)                              # alice@example.com
print(len(clean))                         # 17
\`\`\`

Notice the assignment — \`raw.strip().lower()\` doesn't change \`raw\`, so we store the result in a new variable \`clean\`.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Clean a Username',
      content: `Take the messy username below and produce a clean version: no surrounding whitespace, all lowercase. Then print it.`,
      code: `raw = "   PythonLearner99   "

# Clean it: strip, then lowercase. Assign the result to a variable.
clean = ""

print(clean)
print("length:", len(clean))
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Adding a string and a number with \`+\`.** \`"Score: " + 87\` raises \`TypeError\`. Convert first (\`"Score: " + str(87)\`) or use an f-string (\`f"Score: {87}"\`).
- ❌ **Forgetting the \`f\` prefix.** \`"Hello, {name}!"\` is just literal text — Python won't substitute. \`f"Hello, {name}!"\` is the f-string.
- ❌ **Expecting methods to change the original string.** \`name.lower()\` returns a *new* string. If you want to keep the change, use \`name = name.lower()\`.
- ❌ **Calling methods in the wrong order.** \`s.lower().strip()\` and \`s.strip().lower()\` are usually equivalent, but for tasks like splitting first then trimming each piece, order matters — read left to right.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

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
  // -------- M3.1 ----------
  {
    title: 'Full Name',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Full Name

Write a function called \`full_name\` that takes two parameters — \`first\` and \`last\` — and returns the full name as a single string with **exactly one space** between the two parts.

### Example

\`\`\`python
full_name("Ada", "Lovelace")   # → "Ada Lovelace"
\`\`\`

> **Tip:** Either \`first + " " + last\` or \`f"{first} {last}"\` works. Both are clear; pick whichever you find easier to read.
    `.trim(),
    starterCode: `def full_name(first, last):
    # Return first and last joined by a single space.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `You're combining two strings with a space in the middle. The space is *also* a string — \`" "\` — so you can stick it between them.`,
      },
      {
        orderIndex: 2,
        content: `Two equally good shapes:

\`\`\`python
return first + " " + last
return f"{first} {last}"
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def full_name(first, last):
    return f"{first} {last}"
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `full_name("Ada", "Lovelace")`, expected: `Ada Lovelace`, isHidden: false },
      { inputData: `full_name("Grace", "Hopper")`, expected: `Grace Hopper`, isHidden: true },
      { inputData: `full_name("X", "Y")`, expected: `X Y`, isHidden: true },
      { inputData: `full_name("Ada", "Lovelace").count(" ")`, expected: `1`, isHidden: true },
    ],
  },

  // -------- M3.2 ----------
  {
    title: 'Build a Sentence',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Build a Sentence

Write a function called \`introduce\` that takes three parameters — \`name\`, \`age\`, and \`city\` — and returns a sentence in this exact format:

\`\`\`
My name is <name>. I am <age> years old. I live in <city>.
\`\`\`

### Example

\`\`\`python
introduce("Alice", 25, "Tokyo")
# → "My name is Alice. I am 25 years old. I live in Tokyo."
\`\`\`

> **Tip:** An f-string is the cleanest way to do this — three placeholders, all on one line.
    `.trim(),
    starterCode: `def introduce(name, age, city):
    # Build the sentence with an f-string and return it.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `An f-string can hold as many \`{placeholders}\` as you want, each one substituted with the variable named inside the braces.`,
      },
      {
        orderIndex: 2,
        content: `Shape of the return line:

\`\`\`python
return f"My name is {name}. I am {age} years old. I live in {city}."
\`\`\`

The three sentences are separated by ". " (period and space).`,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def introduce(name, age, city):
    return f"My name is {name}. I am {age} years old. I live in {city}."
\`\`\`

Watch the punctuation: a period after the name, after the age, and at the very end.`,
      },
    ],
    testCases: [
      {
        inputData: `introduce("Alice", 25, "Tokyo")`,
        expected: `My name is Alice. I am 25 years old. I live in Tokyo.`,
        isHidden: false,
      },
      {
        inputData: `introduce("Bob", 40, "Berlin")`,
        expected: `My name is Bob. I am 40 years old. I live in Berlin.`,
        isHidden: true,
      },
      { inputData: `introduce("X", 1, "Y").count(".")`, expected: `3`, isHidden: true },
      { inputData: `introduce("X", 1, "Y").startswith("My name is X")`, expected: `True`, isHidden: true },
      { inputData: `introduce("X", 1, "Y").endswith("I live in Y.")`, expected: `True`, isHidden: true },
    ],
  },

  // -------- M3.3 ----------
  {
    title: 'String Length',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## String Length

Write a function called \`length\` that takes one string \`s\` and returns the number of characters in it.

### Examples

\`\`\`python
length("hello")       # → 5
length("")            # → 0
length("a b c")       # → 5     (spaces count too)
\`\`\`

> **Tip:** Python has a built-in for this — \`len()\`.
    `.trim(),
    starterCode: `def length(s):
    # Return the number of characters in s.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `One built-in function is all you need here.`,
      },
      {
        orderIndex: 2,
        content: `Body shape:

\`\`\`python
return len(s)
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def length(s):
    return len(s)
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `length("hello")`, expected: `5`, isHidden: false },
      { inputData: `length("")`, expected: `0`, isHidden: true },
      { inputData: `length("a b c")`, expected: `5`, isHidden: true },
      { inputData: `length("python")`, expected: `6`, isHidden: true },
      { inputData: `length("123456789")`, expected: `9`, isHidden: true },
    ],
  },

  // -------- M3.4 ----------
  {
    title: 'Shout',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Shout

Write a function called \`shout\` that takes a string \`message\` and returns the **uppercase** version.

### Examples

\`\`\`python
shout("hello")        # → "HELLO"
shout("Quiet voice")  # → "QUIET VOICE"
shout("ALREADY LOUD") # → "ALREADY LOUD"
\`\`\`

> **Tip:** Strings have an \`.upper()\` method that returns an uppercase copy. (The original string is unchanged.)
    `.trim(),
    starterCode: `def shout(message):
    # Return message in uppercase.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Strings have a method that returns an uppercase version of themselves. You call methods with a dot: \`some_string.method_name()\`.`,
      },
      {
        orderIndex: 2,
        content: `Body shape:

\`\`\`python
return message.upper()
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def shout(message):
    return message.upper()
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `shout("hello")`, expected: `HELLO`, isHidden: false },
      { inputData: `shout("Quiet voice")`, expected: `QUIET VOICE`, isHidden: true },
      { inputData: `shout("ALREADY LOUD")`, expected: `ALREADY LOUD`, isHidden: true },
      { inputData: `shout("")`, expected: ``, isHidden: true },
      { inputData: `shout("mIxEd CaSe").islower()`, expected: `False`, isHidden: true },
    ],
  },

  // -------- M3.5 (medium) ----------
  {
    title: 'Clean Up a Messy String',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Clean Up a Messy String

Real-world text often arrives with stray spaces and inconsistent capitalisation — think of an email address typed into a form with a sticky shift key. Your job is to clean it up.

Write a function called \`clean\` that takes a string \`raw\` and returns the same text with:

- **All leading and trailing whitespace removed** (use \`.strip()\`).
- **Every character in lowercase** (use \`.lower()\`).

### Examples

\`\`\`python
clean("   Alice   ")             # → "alice"
clean("Hello World")             # → "hello world"
clean("  ALICE@EXAMPLE.COM  ")   # → "alice@example.com"
clean("already-clean")           # → "already-clean"
\`\`\`

> **Tip:** Methods chain — you can call \`.strip()\` and then \`.lower()\` on the result of the first call, all on one line: \`raw.strip().lower()\`.
    `.trim(),
    starterCode: `def clean(raw):
    # Strip leading/trailing whitespace AND make everything lowercase.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Two methods do the work: \`.strip()\` removes whitespace at both ends, and \`.lower()\` makes everything lowercase. You can call them one after the other on the same string.`,
      },
      {
        orderIndex: 2,
        content: `Shape:

\`\`\`python
return raw.strip().lower()
\`\`\`

The methods are read left-to-right: first strip the original, then lowercase the stripped result.`,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def clean(raw):
    return raw.strip().lower()
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `clean("   Alice   ")`, expected: `alice`, isHidden: false },
      { inputData: `clean("Hello World")`, expected: `hello world`, isHidden: true },
      { inputData: `clean("  ALICE@EXAMPLE.COM  ")`, expected: `alice@example.com`, isHidden: true },
      { inputData: `clean("already-clean")`, expected: `already-clean`, isHidden: true },
      { inputData: `clean("  PADDING  ").startswith(" ")`, expected: `False`, isHidden: true },
      { inputData: `clean("MIXED case").islower()`, expected: `True`, isHidden: true },
    ],
  },
];

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
      `+ Seeded M3.${p.orderIndex} ${p.title} (id=${created.id}, ${p.hints.length} hints, ${p.testCases.length} test cases)`,
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
