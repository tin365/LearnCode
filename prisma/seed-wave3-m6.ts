/**
 * Wave 3 — Module 6 "Loops" — adds 6 new problems (6.1, 6.2, 6.3, 6.5, 6.6, 6.7).
 * Lesson already in DB from Wave 1 Step 7.
 *
 * Run:  pnpm tsx prisma/seed-wave3-m6.ts
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
  // -------- M6.1 ----------
  {
    title: 'Numbers 1 to 10',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Numbers 1 to 10

Write a function called \`numbers_1_to_10\` that takes no parameters and returns a **list** of integers from 1 to 10 (inclusive).

### Example

\`\`\`python
numbers_1_to_10()    # → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
\`\`\`

> **Tip:** \`range(1, 11)\` produces the numbers 1 through 10 (the second number is *exclusive*). Loop with a \`for\` and \`.append()\` each one, or pass the range directly to \`list(...)\` for the one-liner.
    `.trim(),
    starterCode: `def numbers_1_to_10():
    # Return the list [1, 2, ..., 10].
    pass
`,
    hints: [
      { orderIndex: 1, content: `Start with an empty list. Loop \`for i in range(1, 11)\` and append \`i\`.` },
      { orderIndex: 2, content: `Body sketch:\n\n\`\`\`python\nresult = []\nfor i in range(1, 11):\n    result.append(i)\nreturn result\n\`\`\`` },
      { orderIndex: 3, content: `One-line version:\n\n\`\`\`python\ndef numbers_1_to_10():\n    return list(range(1, 11))\n\`\`\`` },
    ],
    testCases: [
      { inputData: `numbers_1_to_10()[0]`, expected: `1`, isHidden: false },
      { inputData: `numbers_1_to_10()[-1]`, expected: `10`, isHidden: true },
      { inputData: `len(numbers_1_to_10())`, expected: `10`, isHidden: true },
      { inputData: `sum(numbers_1_to_10())`, expected: `55`, isHidden: true },
      { inputData: `numbers_1_to_10()[4]`, expected: `5`, isHidden: true },
    ],
  },

  // -------- M6.2 ----------
  {
    title: 'Sum 1 to N',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Sum 1 to N

Write a function called \`sum_to\` that takes a non-negative integer \`n\` and returns the sum of all integers from 1 through \`n\` (inclusive).

### Examples

\`\`\`python
sum_to(10)     # → 55       (1 + 2 + ... + 10)
sum_to(1)      # → 1
sum_to(0)      # → 0        (the range is empty)
sum_to(100)    # → 5050
\`\`\`

> **Tip:** Start with an accumulator at 0, loop \`for i in range(1, n + 1)\`, and add each \`i\` to the accumulator. Or use the built-in: \`sum(range(1, n + 1))\`.
    `.trim(),
    starterCode: `def sum_to(n):
    # Return 1 + 2 + ... + n.
    pass
`,
    hints: [
      { orderIndex: 1, content: `Start \`total = 0\` and add \`i\` to it inside the loop. Remember that \`range(1, n + 1)\` includes \`n\`.` },
      { orderIndex: 2, content: `Sketch:\n\n\`\`\`python\ntotal = 0\nfor i in range(1, n + 1):\n    total += i\nreturn total\n\`\`\`` },
      { orderIndex: 3, content: `One-liner with the built-in \`sum\`:\n\n\`\`\`python\ndef sum_to(n):\n    return sum(range(1, n + 1))\n\`\`\`` },
    ],
    testCases: [
      { inputData: `sum_to(10)`, expected: `55`, isHidden: false },
      { inputData: `sum_to(1)`, expected: `1`, isHidden: true },
      { inputData: `sum_to(0)`, expected: `0`, isHidden: true },
      { inputData: `sum_to(100)`, expected: `5050`, isHidden: true },
      { inputData: `sum_to(5)`, expected: `15`, isHidden: true },
    ],
  },

  // -------- M6.3 ----------
  {
    title: 'Multiplication Table',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Multiplication Table

Write a function called \`times_table\` that takes an integer \`n\` and returns the **list** of \`n × 1\`, \`n × 2\`, ..., \`n × 10\`.

### Example

\`\`\`python
times_table(5)
# → [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]

times_table(3)
# → [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
\`\`\`

> **Tip:** Loop \`for i in range(1, 11)\` and append \`n * i\` to a list.
    `.trim(),
    starterCode: `def times_table(n):
    # Return [n*1, n*2, ..., n*10].
    pass
`,
    hints: [
      { orderIndex: 1, content: `Empty list, loop \`for i in range(1, 11)\`, append \`n * i\` each time.` },
      { orderIndex: 2, content: `Sketch:\n\n\`\`\`python\nresult = []\nfor i in range(1, 11):\n    result.append(n * i)\nreturn result\n\`\`\`` },
      { orderIndex: 3, content: `One-line list comprehension version:\n\n\`\`\`python\ndef times_table(n):\n    return [n * i for i in range(1, 11)]\n\`\`\`` },
    ],
    testCases: [
      { inputData: `times_table(5)[0]`, expected: `5`, isHidden: false },
      { inputData: `times_table(5)[9]`, expected: `50`, isHidden: true },
      { inputData: `times_table(7)[3]`, expected: `28`, isHidden: true },
      { inputData: `len(times_table(3))`, expected: `10`, isHidden: true },
      { inputData: `sum(times_table(1))`, expected: `55`, isHidden: true },
      { inputData: `times_table(0)[0]`, expected: `0`, isHidden: true },
    ],
  },

  // -------- M6.5 (medium) ----------
  {
    title: 'Countdown',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Countdown

Write a function called \`countdown\` that takes an integer \`n\` and returns a list of integers counting down from \`n\` to \`1\` (inclusive). If \`n\` is 0 or negative, return an empty list.

This problem is a great fit for a **\`while\` loop** — but a \`for\` with \`range\` also works.

### Examples

\`\`\`python
countdown(5)     # → [5, 4, 3, 2, 1]
countdown(1)     # → [1]
countdown(0)     # → []
\`\`\`

> **Tip (while):** Start a counter at \`n\`, loop while it's positive, append the counter, then **decrement** it (\`n -= 1\`). Forgetting to decrement is the classic infinite-loop bug.

> **Tip (for):** \`range(n, 0, -1)\` produces \`n, n-1, ..., 1\` directly.
    `.trim(),
    starterCode: `def countdown(n):
    # Return [n, n-1, ..., 1], or [] if n <= 0.
    pass
`,
    hints: [
      { orderIndex: 1, content: `Two main shapes — pick whichever feels cleaner: a \`while n > 0\` loop that decrements, OR a \`for i in range(n, 0, -1)\` loop.` },
      { orderIndex: 2, content: `While sketch (don't forget the \`n -= 1\` — otherwise the loop runs forever):\n\n\`\`\`python\nresult = []\nwhile n > 0:\n    result.append(n)\n    n -= 1\nreturn result\n\`\`\`` },
      { orderIndex: 3, content: `One-liner with \`range\`:\n\n\`\`\`python\ndef countdown(n):\n    return list(range(n, 0, -1))\n\`\`\`` },
    ],
    testCases: [
      { inputData: `countdown(5)[0]`, expected: `5`, isHidden: false },
      { inputData: `countdown(5)[-1]`, expected: `1`, isHidden: true },
      { inputData: `len(countdown(5))`, expected: `5`, isHidden: true },
      { inputData: `len(countdown(0))`, expected: `0`, isHidden: true },
      { inputData: `len(countdown(-3))`, expected: `0`, isHidden: true },
      { inputData: `countdown(1)[0]`, expected: `1`, isHidden: true },
      { inputData: `countdown(3)[1]`, expected: `2`, isHidden: true },
    ],
  },

  // -------- M6.6 (medium) ----------
  {
    title: 'First Multiple of Both',
    orderIndex: 6,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## First Multiple of Both

Write a function called \`first_multiple\` that takes two positive integers \`a\` and \`b\` and returns the **smallest** positive integer that is divisible by both.

This is the classic "use a \`while\` loop until a condition is met" pattern. Start at 1, step up by 1, return as soon as you find one.

### Examples

\`\`\`python
first_multiple(3, 7)     # → 21
first_multiple(2, 3)     # → 6
first_multiple(4, 6)     # → 12
first_multiple(5, 5)     # → 5
\`\`\`

> **Tip:** \`x % a == 0\` is "x is divisible by a." Combine with \`and\` for the both-at-once check. Loop with \`while True\` and \`return\` from inside the loop the moment you find a match.
    `.trim(),
    starterCode: `def first_multiple(a, b):
    # Find the smallest positive integer divisible by both a and b.
    pass
`,
    hints: [
      { orderIndex: 1, content: `Walk integers starting from 1. For each one, check whether it's divisible by both \`a\` and \`b\`. Return the first one that is.` },
      { orderIndex: 2, content: `Sketch:\n\n\`\`\`python\nn = 1\nwhile True:\n    if n % a == 0 and n % b == 0:\n        return n\n    n += 1\n\`\`\`` },
      { orderIndex: 3, content: `Full body:\n\n\`\`\`python\ndef first_multiple(a, b):\n    n = 1\n    while True:\n        if n % a == 0 and n % b == 0:\n            return n\n        n += 1\n\`\`\`` },
    ],
    testCases: [
      { inputData: `first_multiple(3, 7)`, expected: `21`, isHidden: false },
      { inputData: `first_multiple(2, 3)`, expected: `6`, isHidden: true },
      { inputData: `first_multiple(4, 6)`, expected: `12`, isHidden: true },
      { inputData: `first_multiple(5, 5)`, expected: `5`, isHidden: true },
      { inputData: `first_multiple(1, 1)`, expected: `1`, isHidden: true },
      { inputData: `first_multiple(8, 12)`, expected: `24`, isHidden: true },
    ],
  },

  // -------- M6.7 (medium) ----------
  {
    title: 'Loop Until Quit',
    orderIndex: 7,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Loop Until Quit

In a real program this would loop reading \`input()\` until the user types \`"quit"\`. For testing, your function receives the messages directly as a list.

Write a function called \`collect_inputs\` that takes a list \`messages\` and returns a new list of every message **before** the first occurrence of \`"quit"\`. The word \`"quit"\` itself and anything after it should be excluded.

If \`"quit"\` never appears, return the whole list.

### Examples

\`\`\`python
collect_inputs(["hi", "hello", "quit"])         # → ["hi", "hello"]
collect_inputs(["a", "b", "c"])                 # → ["a", "b", "c"]      (no quit, take all)
collect_inputs(["quit"])                        # → []
collect_inputs(["one", "quit", "two", "three"]) # → ["one"]              (stop at quit)
\`\`\`

> **Tip:** Loop over each message. The moment you see \`"quit"\`, **\`break\`** out of the loop. Append the others as you go.
    `.trim(),
    starterCode: `def collect_inputs(messages):
    # Return every message before the first "quit".
    pass
`,
    hints: [
      { orderIndex: 1, content: `Empty list. Loop over \`messages\`. If the current item is \`"quit"\`, \`break\` to stop the loop. Otherwise append it.` },
      { orderIndex: 2, content: `Sketch:\n\n\`\`\`python\nresult = []\nfor m in messages:\n    if m == "quit":\n        break\n    result.append(m)\nreturn result\n\`\`\`` },
      { orderIndex: 3, content: `Full body:\n\n\`\`\`python\ndef collect_inputs(messages):\n    result = []\n    for m in messages:\n        if m == "quit":\n            break\n        result.append(m)\n    return result\n\`\`\`` },
    ],
    testCases: [
      {
        inputData: `collect_inputs(["hi", "hello", "quit"])`,
        expected: `['hi','hello']`,
        isHidden: false,
      },
      { inputData: `len(collect_inputs(["quit"]))`, expected: `0`, isHidden: true },
      {
        inputData: `collect_inputs(["a", "b", "c"])`,
        expected: `['a','b','c']`,
        isHidden: true,
      },
      {
        inputData: `len(collect_inputs(["one", "quit", "two", "three"]))`,
        expected: `1`,
        isHidden: true,
      },
      {
        inputData: `collect_inputs(["x", "quit", "y"])[0]`,
        expected: `x`,
        isHidden: true,
      },
      { inputData: `len(collect_inputs([]))`, expected: `0`, isHidden: true },
    ],
  },
];

const MODULE_ORDER_INDEX = 6;

async function main() {
  const mod = await prisma.module.findUnique({ where: { orderIndex: MODULE_ORDER_INDEX } });
  if (!mod) throw new Error(`Module M${MODULE_ORDER_INDEX} not found`);

  for (const p of PROBLEMS) {
    const existing = await prisma.problem.findFirst({ where: { title: p.title } });
    if (existing) {
      console.log(`= Problem already exists: ${p.title} (id=${existing.id}) — skipping`);
      continue;
    }
    const created = await prisma.problem.create({
      data: {
        title: p.title, description: p.description, starterCode: p.starterCode,
        difficulty: p.difficulty, type: p.type, moduleId: mod.id, orderIndex: p.orderIndex,
        hints: { create: p.hints }, testCases: { create: p.testCases },
      },
      select: { id: true },
    });
    console.log(
      `+ Seeded M6.${p.orderIndex} ${p.title} (id=${created.id}, ${p.hints.length} hints, ${p.testCases.length} test cases)`,
    );
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
