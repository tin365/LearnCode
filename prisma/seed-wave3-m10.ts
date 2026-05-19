/**
 * Wave 3 — Module 10 "Functions (Going Deeper)" — adds 3 new problems
 * (10.2, 10.3, 10.5). Final piece of the curriculum.
 *
 * Run:  pnpm tsx prisma/seed-wave3-m10.ts
 */
import { Difficulty, PrismaClient, ProblemType } from '@prisma/client';

const prisma = new PrismaClient();

interface HintInput { orderIndex: number; content: string; }
interface TestCaseInput { inputData: string; expected: string; isHidden: boolean; }
interface ProblemInput {
  title: string; orderIndex: number; difficulty: Difficulty; type: ProblemType;
  description: string; starterCode: string; hints: HintInput[]; testCases: TestCaseInput[];
}

const PROBLEMS: ProblemInput[] = [
  // -------- M10.2 ----------
  {
    title: 'Default Greeting',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Default Greeting

Write a function called \`greet\` that takes one parameter \`name\` with a **default value of \`"World"\`**. The function should return \`"Hello, <name>!"\`.

When the caller passes a name, use it. When they don't, fall back to \`"World"\`.

### Examples

\`\`\`python
greet()              # → "Hello, World!"
greet("Alice")       # → "Hello, Alice!"
greet("")            # → "Hello, !"
\`\`\`

> **Tip:** Default values for parameters are written in the \`def\` line: \`def greet(name="World"):\`. That's it.
    `.trim(),
    starterCode: `def greet(name="World"):
    # Return the greeting.
    pass
`,
    hints: [
      { orderIndex: 1, content: `The starter already shows you the default-value syntax — \`name="World"\` in the \`def\` line. You just need to write the body that returns the greeting.` },
      { orderIndex: 2, content: `Body sketch:\n\n\`\`\`python\nreturn f"Hello, {name}!"\n\`\`\`` },
      { orderIndex: 3, content: `Full body:\n\n\`\`\`python\ndef greet(name="World"):\n    return f"Hello, {name}!"\n\`\`\`` },
    ],
    testCases: [
      { inputData: `greet()`, expected: `Hello, World!`, isHidden: false },
      { inputData: `greet("Alice")`, expected: `Hello, Alice!`, isHidden: true },
      { inputData: `greet("")`, expected: `Hello, !`, isHidden: true },
      { inputData: `greet("Bob")`, expected: `Hello, Bob!`, isHidden: true },
      { inputData: `greet("Long Name")`, expected: `Hello, Long Name!`, isHidden: true },
    ],
  },

  // -------- M10.3 (medium) ----------
  {
    title: 'Min and Max',
    orderIndex: 3,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Min and Max

Write a function called \`min_and_max\` that takes a non-empty list of numbers and returns **two values**: the smallest and the largest, in that order.

Python lets you return multiple values by listing them after \`return\`, separated by commas — Python packs them into a tuple automatically.

### Examples

\`\`\`python
min_and_max([3, 1, 4, 1, 5, 9, 2, 6])
# → (1, 9)

low, high = min_and_max([10, 20, 30])
# low == 10, high == 30
\`\`\`

> **Tip:** Python's built-ins do the work — \`min(numbers)\` and \`max(numbers)\`. Return them both: \`return min(numbers), max(numbers)\`.
    `.trim(),
    starterCode: `def min_and_max(numbers):
    # Return (smallest, largest) of numbers.
    pass
`,
    hints: [
      { orderIndex: 1, content: `Multiple return values are written with commas: \`return a, b\`. The caller gets a tuple they can unpack.` },
      { orderIndex: 2, content: `Body sketch:\n\n\`\`\`python\nreturn min(numbers), max(numbers)\n\`\`\`` },
      { orderIndex: 3, content: `Full body:\n\n\`\`\`python\ndef min_and_max(numbers):\n    return min(numbers), max(numbers)\n\`\`\`` },
    ],
    testCases: [
      { inputData: `min_and_max([3, 1, 4, 1, 5, 9, 2, 6])[0]`, expected: `1`, isHidden: false },
      { inputData: `min_and_max([3, 1, 4, 1, 5, 9, 2, 6])[1]`, expected: `9`, isHidden: true },
      { inputData: `min_and_max([10, 20, 30])[0]`, expected: `10`, isHidden: true },
      { inputData: `min_and_max([10, 20, 30])[1]`, expected: `30`, isHidden: true },
      { inputData: `min_and_max([-5, -10, 0])[0]`, expected: `-10`, isHidden: true },
      { inputData: `min_and_max([-5, -10, 0])[1]`, expected: `0`, isHidden: true },
      { inputData: `min_and_max([42])[0]`, expected: `42`, isHidden: true },
      { inputData: `len(min_and_max([1, 2, 3]))`, expected: `2`, isHidden: true },
    ],
  },

  // -------- M10.5 (hard) ----------
  {
    title: 'Build a Calculator',
    orderIndex: 5,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Build a Calculator

Write a function called \`calculate\` that takes two numbers \`a\` and \`b\` and an operator \`op\` (a string: \`"+"\`, \`"-"\`, \`"*"\`, or \`"/"\`), and returns the result of applying the operator to the numbers.

If \`op\` is anything else, return \`None\`.

### Examples

\`\`\`python
calculate(10, 5, "+")    # → 15
calculate(10, 5, "-")    # → 5
calculate(10, 5, "*")    # → 50
calculate(10, 5, "/")    # → 2.0
calculate(10, 5, "?")    # → None
\`\`\`

### Two clean ways to write this

**Option A — if/elif chain.** Straightforward, easy to read:

\`\`\`python
if op == "+":
    return a + b
elif op == "-":
    ...
\`\`\`

**Option B — dispatch dictionary** (the Python idiom). Build a dict that maps each operator string to a small function, then look up and call:

\`\`\`python
ops = {
    "+": lambda x, y: x + y,
    "-": lambda x, y: x - y,
    "*": lambda x, y: x * y,
    "/": lambda x, y: x / y,
}
\`\`\`

Both pass the tests. The dispatch-dict version scales better when you have many operations.
    `.trim(),
    starterCode: `def calculate(a, b, op):
    # Return the result of applying op to a and b, or None if op is unknown.
    pass
`,
    hints: [
      { orderIndex: 1, content: `Five cases total: +, -, *, /, and unknown. Either a chain of \`if / elif\` or a dispatch dict will work.` },
      { orderIndex: 2, content: `Dispatch dict sketch:\n\n\`\`\`python\nops = {\n    "+": lambda x, y: x + y,\n    "-": lambda x, y: x - y,\n    "*": lambda x, y: x * y,\n    "/": lambda x, y: x / y,\n}\nif op not in ops:\n    return None\nreturn ops[op](a, b)\n\`\`\`` },
      { orderIndex: 3, content: `Full body (if/elif version is just as valid):\n\n\`\`\`python\ndef calculate(a, b, op):\n    ops = {\n        "+": lambda x, y: x + y,\n        "-": lambda x, y: x - y,\n        "*": lambda x, y: x * y,\n        "/": lambda x, y: x / y,\n    }\n    if op not in ops:\n        return None\n    return ops[op](a, b)\n\`\`\`` },
    ],
    testCases: [
      { inputData: `calculate(10, 5, "+")`, expected: `15`, isHidden: false },
      { inputData: `calculate(10, 5, "-")`, expected: `5`, isHidden: true },
      { inputData: `calculate(10, 5, "*")`, expected: `50`, isHidden: true },
      { inputData: `calculate(10, 5, "/")`, expected: `2`, isHidden: true },
      { inputData: `calculate(10, 5, "?")`, expected: `None`, isHidden: true },
      { inputData: `calculate(0, 0, "+")`, expected: `0`, isHidden: true },
      { inputData: `calculate(3, 4, "*")`, expected: `12`, isHidden: true },
      { inputData: `calculate(100, 4, "/")`, expected: `25`, isHidden: true },
      { inputData: `calculate(5, 5, "")`, expected: `None`, isHidden: true },
    ],
  },
];

const MODULE_ORDER_INDEX = 10;

async function main() {
  const mod = await prisma.module.findUnique({ where: { orderIndex: MODULE_ORDER_INDEX } });
  if (!mod) throw new Error(`Module M${MODULE_ORDER_INDEX} not found`);
  for (const p of PROBLEMS) {
    const existing = await prisma.problem.findFirst({ where: { title: p.title } });
    if (existing) { console.log(`= Problem already exists: ${p.title} (id=${existing.id}) — skipping`); continue; }
    const created = await prisma.problem.create({
      data: {
        title: p.title, description: p.description, starterCode: p.starterCode,
        difficulty: p.difficulty, type: p.type, moduleId: mod.id, orderIndex: p.orderIndex,
        hints: { create: p.hints }, testCases: { create: p.testCases },
      },
      select: { id: true },
    });
    console.log(`+ Seeded M10.${p.orderIndex} ${p.title} (id=${created.id}, ${p.hints.length} hints, ${p.testCases.length} test cases)`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
