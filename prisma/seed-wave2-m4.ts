/**
 * Wave 2 — Module 4 "Getting Input from the User"
 *
 * Adds the M4 lesson plus 4 new problems (4.1 – 4.4).
 *
 * Design note on input():
 *   The lesson teaches input() and the int()/float() conversion pattern with
 *   real examples. Problems themselves take **parameters** — the caller (the
 *   server test runner) provides values directly. The description explains
 *   that in a real program the caller would be `int(input(...))`. This keeps
 *   problems deterministically testable and consistent with every other
 *   problem in the curriculum.
 *
 * Run:  pnpm tsx prisma/seed-wave2-m4.ts
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
  moduleOrderIndex: 4,
  title: 'Getting Input from the User',
  estimatedMinutes: 11,
  concepts: ['input()', 'int()', 'float()', 'type conversion'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Make Your Program Listen',
      content: `So far your programs do whatever they're told to do, with values you typed into the code. That's fine for warm-ups, but real programs need to **listen** — to ask questions and react to whoever's using them. "What's your name?" "How many tickets?" "Spicy or mild?"

\`input()\` is how Python pauses your program, waits for someone to type a line, and hands you back what they typed.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'input() and the Conversion Trap',
      content: `\`input(prompt)\` does three things:

1. Prints the prompt on the screen.
2. Waits for the user to type a line and press Enter.
3. Returns whatever they typed as a **string** — *always a string*, even if they typed a number.

That last part is where every beginner trips. If the user types \`25\`, Python hands you back \`"25"\` (a string), not \`25\` (an int). Trying to do math on it (\`"25" + 1\`) raises a \`TypeError\`.

The fix: **convert** the string yourself with \`int()\` or \`float()\`.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'The two patterns you will use over and over:',
      code: `# Reading a string (no conversion needed)
name = input("What's your name? ")
print("Hello,", name)

# Reading an integer
age_text = input("How old are you? ")
age      = int(age_text)        # convert the string to an int
print("Next year you'll be", age + 1)

# One-liner version — convert directly around the input() call
age = int(input("How old are you? "))

# For decimal numbers, use float() instead
price = float(input("Enter price: "))`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'A Tiny Conversation',
      content: `**Example 1:** ask for a name and greet the user. Names stay as strings — no conversion needed.

\`\`\`python
name = input("What's your name? ")
print(f"Welcome, {name}!")
\`\`\`

**Example 2:** ask for two numbers and add them. **Both** must be converted from string to \`int\` before the math.

\`\`\`python
a = int(input("First number:  "))
b = int(input("Second number: "))
print("Sum:", a + b)
\`\`\`

If you forget the \`int(...)\`, Python concatenates the *strings* — typing \`3\` and \`5\` would print \`Sum: 35\`, not \`Sum: 8\`. That's the classic input bug.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Double a Number',
      content: `Below, \`raw\` simulates what \`input()\` would return — a string. Convert it to an integer, double it, and print the result. (The real program would use \`int(input(...))\`.)`,
      code: `raw = "21"

# Convert raw to an int and store it in number:
number = 0

# Print double the number:
print(number * 2)
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Forgetting the conversion.** \`age + 1\` raises \`TypeError\` if \`age\` came directly from \`input()\` (it's a string). Wrap with \`int(...)\`.
- ❌ **Mixing string and int with \`+\`.** \`"Hello, " + 25\` is a \`TypeError\`. Convert the number first, or use an f-string.
- ❌ **\`int()\` on non-numeric text.** \`int("hello")\` raises \`ValueError\`. Make sure the user actually typed a number — or wrap the conversion in a try/except later in the course.
- ❌ **Using \`int()\` for decimals.** \`int("3.14")\` raises \`ValueError\`. Use \`float()\` for decimal numbers.`,
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
  // -------- M4.1 ----------
  {
    title: 'Welcome the User',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Welcome the User

In a real program this would start with:

\`\`\`python
name = input("What's your name? ")
\`\`\`

For testing, your function receives \`name\` directly as a parameter. Write a function called \`welcome\` that takes a name and returns a greeting in this exact format:

\`\`\`
Welcome, <name>!
\`\`\`

### Example

\`\`\`python
welcome("Alice")      # → "Welcome, Alice!"
welcome("Sam")        # → "Welcome, Sam!"
\`\`\`
    `.trim(),
    starterCode: `def welcome(name):
    # Return the welcome string.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Stick the name into a sentence with an f-string or string concatenation. Names from \`input()\` are already strings, so no conversion is needed.`,
      },
      {
        orderIndex: 2,
        content: `Body shape:

\`\`\`python
return f"Welcome, {name}!"
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def welcome(name):
    return f"Welcome, {name}!"
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `welcome("Alice")`, expected: `Welcome, Alice!`, isHidden: false },
      { inputData: `welcome("Sam")`, expected: `Welcome, Sam!`, isHidden: true },
      { inputData: `welcome("")`, expected: `Welcome, !`, isHidden: true },
      { inputData: `welcome("Long Name")`, expected: `Welcome, Long Name!`, isHidden: true },
    ],
  },

  // -------- M4.2 ----------
  {
    title: 'Add From Input',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Add From Input

In a real program this would start with:

\`\`\`python
a = int(input("First number:  "))
b = int(input("Second number: "))
\`\`\`

For testing, your function receives \`a\` and \`b\` directly as **integers**. Write a function called \`add_two\` that returns their sum.

### Examples

\`\`\`python
add_two(3, 5)     # → 8
add_two(-2, 7)    # → 5
add_two(0, 0)     # → 0
\`\`\`
    `.trim(),
    starterCode: `def add_two(a, b):
    # Return the sum of a and b.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `One line of body. Use the \`+\` operator on the two parameters and \`return\` the result.`,
      },
      {
        orderIndex: 2,
        content: `Body shape:

\`\`\`python
return a + b
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def add_two(a, b):
    return a + b
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `add_two(3, 5)`, expected: `8`, isHidden: false },
      { inputData: `add_two(0, 0)`, expected: `0`, isHidden: true },
      { inputData: `add_two(-2, 7)`, expected: `5`, isHidden: true },
      { inputData: `add_two(100, 250)`, expected: `350`, isHidden: true },
      { inputData: `add_two(-10, -5)`, expected: `-15`, isHidden: true },
    ],
  },

  // -------- M4.3 ----------
  {
    title: 'Square It',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Square It

In a real program this would start with:

\`\`\`python
n = int(input("Pick a number: "))
\`\`\`

For testing, your function receives \`n\` directly as an integer. Write a function called \`square\` that returns \`n\` squared (\`n × n\`).

### Two ways to write it

\`\`\`python
n * n          # plain multiplication
n ** 2         # exponentiation operator
\`\`\`

Both work. The \`**\` operator means "raise to the power of" — handy when the exponent isn't 2.

### Examples

\`\`\`python
square(7)     # → 49
square(0)     # → 0
square(-4)    # → 16   (negative times negative is positive)
\`\`\`
    `.trim(),
    starterCode: `def square(n):
    # Return n squared.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Either \`n * n\` or \`n ** 2\` will work. Pick one.`,
      },
      {
        orderIndex: 2,
        content: `Body shape:

\`\`\`python
return n ** 2
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def square(n):
    return n ** 2
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `square(7)`, expected: `49`, isHidden: false },
      { inputData: `square(0)`, expected: `0`, isHidden: true },
      { inputData: `square(1)`, expected: `1`, isHidden: true },
      { inputData: `square(-4)`, expected: `16`, isHidden: true },
      { inputData: `square(12)`, expected: `144`, isHidden: true },
    ],
  },

  // -------- M4.4 (medium) ----------
  {
    title: 'Tip Calculator',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Tip Calculator

In a real program this would start with:

\`\`\`python
bill    = float(input("Bill amount: "))
percent = float(input("Tip percent: "))
\`\`\`

For testing, your function receives \`bill\` and \`percent\` directly. Write a function called \`tip_total\` that returns the **total** the customer pays — bill plus tip.

### Formula

\`tip = bill × percent / 100\`
\`total = bill + tip\`

Equivalently, \`total = bill × (1 + percent / 100)\` — both are fine.

### Examples

\`\`\`python
tip_total(100, 15)     # → 115.0     (15% tip on $100)
tip_total(50, 20)      # → 60.0      (20% tip on $50)
tip_total(80, 0)       # → 80.0      (no tip)
\`\`\`

> **Note:** The tests round to 2 decimal places, so small floating-point noise like \`23.00000000001\` won't trip you up.
    `.trim(),
    starterCode: `def tip_total(bill, percent):
    # Return bill + the tip amount.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Calculate the tip first — it's \`bill * percent / 100\`. Then add it to the bill and return.`,
      },
      {
        orderIndex: 2,
        content: `One-line body using the combined formula:

\`\`\`python
return bill + bill * percent / 100
\`\`\`

Python's operator precedence handles \`*\` and \`/\` before \`+\` so you don't need parentheses, but \`bill * (1 + percent / 100)\` is also fine.`,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def tip_total(bill, percent):
    return bill + bill * percent / 100
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `round(tip_total(100, 15), 2)`, expected: `115`, isHidden: false },
      { inputData: `round(tip_total(50, 20), 2)`, expected: `60`, isHidden: true },
      { inputData: `round(tip_total(80, 0), 2)`, expected: `80`, isHidden: true },
      { inputData: `round(tip_total(75.50, 18), 2)`, expected: `89.09`, isHidden: true },
      { inputData: `round(tip_total(200, 10), 2)`, expected: `220`, isHidden: true },
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
      `+ Seeded M4.${p.orderIndex} ${p.title} (id=${created.id}, ${p.hints.length} hints, ${p.testCases.length} test cases)`,
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
