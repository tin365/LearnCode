/**
 * Wave 2 — Module 2 "Variables & Data Types"
 *
 * Adds the M2 lesson plus 6 new problems (2.1 – 2.6). All problems use the
 * function-return convention so the server-side test runner can evaluate
 * each test case as a Python expression on the user's defined function.
 *
 * Run:  pnpm tsx prisma/seed-wave2-m2.ts
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
  moduleOrderIndex: 2,
  title: 'Variables & Data Types',
  estimatedMinutes: 14,
  concepts: ['variables', 'int', 'float', 'str', 'bool', 'type()'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Name the Things You Reason About',
      content: `Imagine a recipe that just says "add 2, then add 2, then add 2" everywhere — no word for *what* you're adding. Trying to read or change that recipe later would be miserable.

**Variables** are how programmers stop repeating values and start naming the things they reason about. Once a value has a name (\`price\`, \`age\`, \`message\`), your code reads like a story and editing it is much easier.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Variables and Types',
      content: `A **variable** is a labelled box that holds a value. You create one with the assignment operator \`=\`:

\`\`\`python
name = "Alice"
age  = 25
\`\`\`

After this runs, \`name\` holds the string \`"Alice"\` and \`age\` holds the integer \`25\`.

Python figures out the **type** of each value automatically. The four types you'll meet first:

- **\`int\`** — whole numbers like \`25\` or \`-3\`.
- **\`float\`** — numbers with a decimal point like \`9.99\` or \`3.14\`.
- **\`str\`** — text in quotes like \`"hello"\`.
- **\`bool\`** — \`True\` or \`False\` (note the capital letter).

You can ask Python what type a value has with the built-in \`type()\` function, and you can read just the type's name with \`type(x).__name__\`.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Creating variables, the four basic types, and inspecting them:',
      code: `# Assignment
name      = "Alice"   # str
age       = 25         # int
price     = 9.99       # float
is_active = True       # bool

# Reading a variable just uses its name
print(name)

# Naming rules: lowercase_with_underscores, starts with letter or _,
# never starts with a digit, never uses Python keywords like 'if' or 'class'.

# Inspecting types
type(name)               # <class 'str'>
type(age).__name__       # 'int'`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'A Tiny Calculation',
      content: `**Example 1:** read three values into named variables, then use them in an expression. Naming things up front makes the math line easy to read.

\`\`\`python
price    = 9.99
quantity = 3
tax_rate = 0.10

subtotal = price * quantity
total    = subtotal + subtotal * tax_rate
print(total)            # 32.967
\`\`\`

**Example 2:** mixing types deliberately. Numbers can be turned into strings with \`str()\` and strings of digits can be turned into numbers with \`int()\`.

\`\`\`python
score = 87
print("Your score is " + str(score))    # Your score is 87

age_text = "25"
age = int(age_text)
print(age + 1)                          # 26
\`\`\`

If you try to mix types without converting (\`"score is " + 87\`), Python raises a \`TypeError\` — it doesn't guess what you meant.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Two Variables',
      content: `Create two variables — \`name\` set to your name (a string) and \`age\` set to a number — and have the function return a sentence that uses both, like \`"Alice is 25 years old."\`.`,
      code: `def about_me():
    name = "Alice"
    age  = 25
    # Return a sentence using both variables, like:
    # "Alice is 25 years old."
    pass

print(about_me())
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Using \`=\` when you meant \`==\`.** \`=\` assigns, \`==\` compares. \`if age = 18:\` is a syntax error — use \`if age == 18:\`.
- ❌ **Forgetting quotes on strings.** \`name = Alice\` looks for a variable called \`Alice\`. Use \`name = "Alice"\`.
- ❌ **Mixing numbers and strings without converting.** \`"score: " + 87\` is a \`TypeError\`. Convert first: \`"score: " + str(87)\`.
- ❌ **Using a Python keyword as a variable name.** \`if\`, \`for\`, \`class\`, \`return\`, \`True\`, \`False\` and a few others are reserved. Pick a descriptive synonym instead.`,
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
  // -------- M2.1 ----------
  {
    title: 'Profile Card',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Profile Card

Write a function called \`profile\` that takes two parameters — \`name\` (a string) and \`age\` (an integer) — and returns a two-line profile card in this exact format:

\`\`\`
Name: <name>
Age: <age>
\`\`\`

The two lines are separated by a single newline (\`\\n\`).

### Example

\`\`\`python
print(profile("Alice", 25))
# Name: Alice
# Age: 25
\`\`\`

> **Tip:** You'll need to convert the age (an \`int\`) into a string when sticking it inside another string. \`str(age)\` does that, or you can use an f-string and skip the conversion entirely.
    `.trim(),
    starterCode: `def profile(name, age):
    # Build and return the two-line profile string below.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `You need to build one string that contains a newline in the middle. \`\\n\` inside the quotes is treated as a single newline character.`,
      },
      {
        orderIndex: 2,
        content: `Sketch of the shape using an f-string:

\`\`\`python
return f"Name: {name}\\nAge: {age}"
\`\`\`

Both placeholders sit inside one set of quotes.`,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def profile(name, age):
    return f"Name: {name}\\nAge: {age}"
\`\`\`

Capital "N" on Name, capital "A" on Age, and a single space after each colon.`,
      },
    ],
    testCases: [
      { inputData: `profile("Alice", 25)`, expected: `Name: Alice\nAge: 25`, isHidden: false },
      { inputData: `profile("Bob", 40)`, expected: `Name: Bob\nAge: 40`, isHidden: true },
      { inputData: `profile("Q", 1).count("\\n")`, expected: `1`, isHidden: true },
      { inputData: `profile("Sam", 7).split("\\n")[0]`, expected: `Name: Sam`, isHidden: true },
      { inputData: `profile("Sam", 7).split("\\n")[1]`, expected: `Age: 7`, isHidden: true },
    ],
  },

  // -------- M2.2 ----------
  {
    title: 'Years to Days',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Years to Days

Write a function called \`to_days\` that takes an integer \`years\` and returns the equivalent number of days. For this exercise, **assume every year has exactly 365 days** (we'll worry about leap years another day).

### Examples

\`\`\`python
to_days(1)    # → 365
to_days(10)   # → 3650
to_days(0)    # → 0
\`\`\`

The return value must be an integer, not a float.
    `.trim(),
    starterCode: `def to_days(years):
    # Multiply years by 365 and return the result.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Days per year is 365, and you multiply that by the number of years. The multiplication operator in Python is \`*\`.`,
      },
      {
        orderIndex: 2,
        content: `Body shape:

\`\`\`python
return years * 365
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def to_days(years):
    return years * 365
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `to_days(1)`, expected: `365`, isHidden: false },
      { inputData: `to_days(0)`, expected: `0`, isHidden: true },
      { inputData: `to_days(10)`, expected: `3650`, isHidden: true },
      { inputData: `to_days(25)`, expected: `9125`, isHidden: true },
      { inputData: `type(to_days(3)).__name__`, expected: `int`, isHidden: true },
    ],
  },

  // -------- M2.3 ----------
  {
    title: 'Rectangle Area',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Rectangle Area

Write a function called \`rectangle_area\` that takes two numbers — \`width\` and \`height\` — and returns the area of the rectangle.

### Reminder

Area of a rectangle is \`width × height\`. In Python that's \`width * height\`.

### Examples

\`\`\`python
rectangle_area(3, 4)   # → 12
rectangle_area(5, 5)   # → 25
rectangle_area(2.5, 4) # → 10.0
\`\`\`
    `.trim(),
    starterCode: `def rectangle_area(width, height):
    # Return width * height.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Two parameters come in, one number goes out. Multiply them with \`*\` and \`return\` the result.`,
      },
      {
        orderIndex: 2,
        content: `Body shape:

\`\`\`python
return width * height
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def rectangle_area(width, height):
    return width * height
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `rectangle_area(3, 4)`, expected: `12`, isHidden: false },
      { inputData: `rectangle_area(5, 5)`, expected: `25`, isHidden: true },
      { inputData: `rectangle_area(0, 100)`, expected: `0`, isHidden: true },
      { inputData: `rectangle_area(7, 8)`, expected: `56`, isHidden: true },
      { inputData: `rectangle_area(2.5, 4)`, expected: `10`, isHidden: true },
    ],
  },

  // -------- M2.4 ----------
  {
    title: 'Swap Two Variables',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Swap Two Variables

Write a function called \`swap\` that takes two values \`a\` and \`b\` and returns them **swapped** — \`b\` first, then \`a\`.

Return them as a **tuple**: \`(b, a)\`. A tuple is just a fixed-size group of values written with commas (parentheses are optional but conventional). The caller can unpack it like \`x, y = swap(1, 2)\`.

### Examples

\`\`\`python
swap(1, 2)            # → (2, 1)
swap("hi", "there")   # → ('there', 'hi')

x, y = swap(10, 20)
print(x, y)           # 20 10
\`\`\`

> **Tip:** Python has a particularly clean way to write this — \`return b, a\` is enough. The parentheses are optional.
    `.trim(),
    starterCode: `def swap(a, b):
    # Return b first, then a.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `You don't need a temporary variable. Python lets you list multiple values after \`return\`, separated by commas, and it bundles them into a tuple automatically.`,
      },
      {
        orderIndex: 2,
        content: `Body shape:

\`\`\`python
return b, a
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def swap(a, b):
    return b, a
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `swap(1, 2)[0]`, expected: `2`, isHidden: false },
      { inputData: `swap(1, 2)[1]`, expected: `1`, isHidden: true },
      { inputData: `swap("hi", "there")[0]`, expected: `there`, isHidden: true },
      { inputData: `swap("hi", "there")[1]`, expected: `hi`, isHidden: true },
      { inputData: `len(swap(7, 9))`, expected: `2`, isHidden: true },
    ],
  },

  // -------- M2.5 (medium) ----------
  {
    title: 'Celsius to Fahrenheit',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Celsius to Fahrenheit

Write a function called \`celsius_to_fahrenheit\` that takes a temperature in Celsius and returns the equivalent temperature in Fahrenheit.

### Formula

\`F = C × 9 / 5 + 32\`

### Reference points

\`\`\`python
celsius_to_fahrenheit(0)     # → 32.0    (freezing)
celsius_to_fahrenheit(100)   # → 212.0   (boiling)
celsius_to_fahrenheit(37)    # → 98.6    (body temperature)
celsius_to_fahrenheit(-40)   # → -40.0   (the famous coincidence)
\`\`\`

> **Tip:** In Python, \`/\` is regular division and produces a \`float\` (decimal number). For example, \`10 / 2\` is \`5.0\`, not \`5\`. That's the right thing here — temperatures usually have decimals.

> **Note:** The tests round to 2 decimal places, so small floating-point errors like \`98.60000000000001\` will still pass.
    `.trim(),
    starterCode: `def celsius_to_fahrenheit(c):
    # Apply the formula: F = c * 9 / 5 + 32, and return the result.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Three arithmetic operators in one line: multiply, divide, add. Python follows the usual order — multiplication and division before addition — so you don't strictly need parentheses, but adding them never hurts readability.`,
      },
      {
        orderIndex: 2,
        content: `Body shape:

\`\`\`python
return c * 9 / 5 + 32
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def celsius_to_fahrenheit(c):
    return c * 9 / 5 + 32
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `round(celsius_to_fahrenheit(0), 2)`, expected: `32`, isHidden: false },
      { inputData: `round(celsius_to_fahrenheit(100), 2)`, expected: `212`, isHidden: true },
      { inputData: `round(celsius_to_fahrenheit(37), 2)`, expected: `98.6`, isHidden: true },
      { inputData: `round(celsius_to_fahrenheit(-40), 2)`, expected: `-40`, isHidden: true },
      { inputData: `round(celsius_to_fahrenheit(25), 2)`, expected: `77`, isHidden: true },
    ],
  },

  // -------- M2.6 ----------
  {
    title: 'What Type?',
    orderIndex: 6,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## What Type?

Write a function called \`describe\` that takes a single value and returns the **name** of its type as a string — like \`"int"\`, \`"str"\`, \`"float"\`, or \`"bool"\`.

### Examples

\`\`\`python
describe(5)         # → "int"
describe(3.14)      # → "float"
describe("hello")   # → "str"
describe(True)      # → "bool"
\`\`\`

> **Tip:** \`type(x)\` gives you the type object (like \`<class 'int'>\`). The bit you want is the **name** of that type, available as \`type(x).__name__\`.
    `.trim(),
    starterCode: `def describe(value):
    # Return the name of value's type as a string.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Python's built-in \`type()\` function tells you what type a value is. But \`type(5)\` produces \`<class 'int'>\` — you want just \`"int"\`.`,
      },
      {
        orderIndex: 2,
        content: `Every type object has a \`.__name__\` attribute that gives you just the name:

\`\`\`python
type(5).__name__       # 'int'
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def describe(value):
    return type(value).__name__
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `describe(5)`, expected: `int`, isHidden: false },
      { inputData: `describe(3.14)`, expected: `float`, isHidden: true },
      { inputData: `describe("hello")`, expected: `str`, isHidden: true },
      { inputData: `describe(True)`, expected: `bool`, isHidden: true },
      { inputData: `describe([1, 2])`, expected: `list`, isHidden: true },
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
      `+ Seeded M2.${p.orderIndex} ${p.title} (id=${created.id}, ${p.hints.length} hints, ${p.testCases.length} test cases)`,
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
