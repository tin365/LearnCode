/**
 * Wave 3 — Module 7 "Lists" — adds 5 new problems (7.1, 7.3, 7.4, 7.6, 7.7).
 * Run:  pnpm tsx prisma/seed-wave3-m7.ts
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
  // -------- M7.1 ----------
  {
    title: 'Sum All Numbers',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Sum All Numbers

Write a function called \`sum_list\` that takes a list of numbers and returns their sum. An empty list should sum to 0.

### Examples

\`\`\`python
sum_list([1, 2, 3, 4])      # → 10
sum_list([])                # → 0
sum_list([-5, 5])           # → 0
\`\`\`

> **Tip:** Either write the loop yourself (accumulate into a \`total\`), or use Python's built-in \`sum(numbers)\`.
    `.trim(),
    starterCode: `def sum_list(numbers):
    # Return the sum of all numbers in the list.
    pass
`,
    hints: [
      { orderIndex: 1, content: `Either accumulate with a loop, or just return \`sum(numbers)\`. Both are valid.` },
      { orderIndex: 2, content: `Loop sketch:\n\n\`\`\`python\ntotal = 0\nfor n in numbers:\n    total += n\nreturn total\n\`\`\`` },
      { orderIndex: 3, content: `One-liner:\n\n\`\`\`python\ndef sum_list(numbers):\n    return sum(numbers)\n\`\`\`` },
    ],
    testCases: [
      { inputData: `sum_list([1, 2, 3, 4])`, expected: `10`, isHidden: false },
      { inputData: `sum_list([])`, expected: `0`, isHidden: true },
      { inputData: `sum_list([-5, 5])`, expected: `0`, isHidden: true },
      { inputData: `sum_list([10])`, expected: `10`, isHidden: true },
      { inputData: `sum_list([1, 1, 1, 1, 1])`, expected: `5`, isHidden: true },
    ],
  },

  // -------- M7.3 ----------
  {
    title: 'Count Items',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Count Items

Write a function called \`count_items\` that takes a list and returns the **number of items** in it.

### Examples

\`\`\`python
count_items([1, 2, 3])               # → 3
count_items([])                      # → 0
count_items(["a", "b", "c", "d"])    # → 4
\`\`\`

> **Tip:** Python's built-in \`len(...)\` tells you the length of a list. That's the whole answer.
    `.trim(),
    starterCode: `def count_items(items):
    # Return how many items are in the list.
    pass
`,
    hints: [
      { orderIndex: 1, content: `One built-in covers this — the same one you used to count characters in a string.` },
      { orderIndex: 2, content: `Body:\n\n\`\`\`python\nreturn len(items)\n\`\`\`` },
      { orderIndex: 3, content: `Full body:\n\n\`\`\`python\ndef count_items(items):\n    return len(items)\n\`\`\`` },
    ],
    testCases: [
      { inputData: `count_items([1, 2, 3])`, expected: `3`, isHidden: false },
      { inputData: `count_items([])`, expected: `0`, isHidden: true },
      { inputData: `count_items(["a", "b", "c", "d"])`, expected: `4`, isHidden: true },
      { inputData: `count_items([0])`, expected: `1`, isHidden: true },
      { inputData: `count_items([None, None, None])`, expected: `3`, isHidden: true },
    ],
  },

  // -------- M7.4 ----------
  {
    title: 'Reverse a List',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Reverse a List

Write a function called \`reverse_list\` that takes a list and returns a **new** list with the items in reverse order.

### Examples

\`\`\`python
reverse_list([1, 2, 3])           # → [3, 2, 1]
reverse_list(["a", "b", "c"])     # → ["c", "b", "a"]
reverse_list([])                  # → []
reverse_list([42])                # → [42]
\`\`\`

> **Tip:** The slice \`items[::-1]\` returns a reversed copy of the list. (Same trick as reversing a string.)
    `.trim(),
    starterCode: `def reverse_list(items):
    # Return the list reversed.
    pass
`,
    hints: [
      { orderIndex: 1, content: `Slice with step \`-1\` walks the list backwards: \`items[::-1]\` is the whole list reversed.` },
      { orderIndex: 2, content: `One-liner:\n\n\`\`\`python\nreturn items[::-1]\n\`\`\`` },
      { orderIndex: 3, content: `Full body:\n\n\`\`\`python\ndef reverse_list(items):\n    return items[::-1]\n\`\`\`` },
    ],
    testCases: [
      { inputData: `reverse_list([1, 2, 3])[0]`, expected: `3`, isHidden: false },
      { inputData: `reverse_list([1, 2, 3])[-1]`, expected: `1`, isHidden: true },
      {
        inputData: `reverse_list(["a", "b", "c"])`,
        expected: `['c','b','a']`,
        isHidden: true,
      },
      { inputData: `len(reverse_list([]))`, expected: `0`, isHidden: true },
      { inputData: `reverse_list([42])[0]`, expected: `42`, isHidden: true },
      { inputData: `reverse_list([1, 2, 3, 4, 5])[2]`, expected: `3`, isHidden: true },
    ],
  },

  // -------- M7.6 (medium) ----------
  {
    title: 'Average of a List',
    orderIndex: 6,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Average of a List

Write a function called \`average\` that takes a list of numbers and returns their arithmetic mean (sum divided by count).

**Edge case:** if the list is empty, return \`0\` to avoid dividing by zero.

### Examples

\`\`\`python
average([10, 20, 30])       # → 20.0
average([1, 2, 3, 4, 5])    # → 3.0
average([])                 # → 0
average([7])                # → 7.0
\`\`\`

> **Tip:** \`sum(numbers) / len(numbers)\` is the formula — but guard against \`len(numbers) == 0\` first. The tests round to 2 decimal places so floating-point noise is fine.
    `.trim(),
    starterCode: `def average(numbers):
    # Return sum / len, or 0 if the list is empty.
    pass
`,
    hints: [
      { orderIndex: 1, content: `Empty list ⇒ return 0 right away. Otherwise return \`sum(numbers) / len(numbers)\`. The early return keeps the division safe.` },
      { orderIndex: 2, content: `Sketch:\n\n\`\`\`python\nif len(numbers) == 0:\n    return 0\nreturn sum(numbers) / len(numbers)\n\`\`\`` },
      { orderIndex: 3, content: `Full body:\n\n\`\`\`python\ndef average(numbers):\n    if len(numbers) == 0:\n        return 0\n    return sum(numbers) / len(numbers)\n\`\`\`` },
    ],
    testCases: [
      { inputData: `round(average([10, 20, 30]), 2)`, expected: `20`, isHidden: false },
      { inputData: `round(average([1, 2, 3, 4, 5]), 2)`, expected: `3`, isHidden: true },
      { inputData: `round(average([]), 2)`, expected: `0`, isHidden: true },
      { inputData: `round(average([7]), 2)`, expected: `7`, isHidden: true },
      { inputData: `round(average([1, 2]), 2)`, expected: `1.5`, isHidden: true },
      { inputData: `round(average([-5, 5]), 2)`, expected: `0`, isHidden: true },
    ],
  },

  // -------- M7.7 (medium) ----------
  {
    title: 'Filter Even Numbers',
    orderIndex: 7,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Filter Even Numbers

Write a function called \`even_numbers\` that takes a list of integers and returns a **new** list containing only the even ones, in their original order.

### Examples

\`\`\`python
even_numbers([1, 2, 3, 4, 5])     # → [2, 4]
even_numbers([1, 3, 5])           # → []
even_numbers([2, 4, 6])           # → [2, 4, 6]
even_numbers([])                  # → []
\`\`\`

> **Tip:** A number is even when \`n % 2 == 0\`. Either loop and append, or use a one-line list comprehension.
    `.trim(),
    starterCode: `def even_numbers(items):
    # Return a new list with only the even numbers from items.
    pass
`,
    hints: [
      { orderIndex: 1, content: `For each number, check if it's even with \`n % 2 == 0\`. If yes, append to a result list. Don't mutate the input.` },
      { orderIndex: 2, content: `Loop sketch:\n\n\`\`\`python\nresult = []\nfor n in items:\n    if n % 2 == 0:\n        result.append(n)\nreturn result\n\`\`\`` },
      { orderIndex: 3, content: `One-liner with a list comprehension:\n\n\`\`\`python\ndef even_numbers(items):\n    return [n for n in items if n % 2 == 0]\n\`\`\`` },
    ],
    testCases: [
      {
        inputData: `even_numbers([1, 2, 3, 4, 5])`,
        expected: `[2,4]`,
        isHidden: false,
      },
      { inputData: `len(even_numbers([1, 3, 5]))`, expected: `0`, isHidden: true },
      {
        inputData: `even_numbers([2, 4, 6])`,
        expected: `[2,4,6]`,
        isHidden: true,
      },
      { inputData: `len(even_numbers([]))`, expected: `0`, isHidden: true },
      { inputData: `even_numbers([10, 21, 32, 43])[0]`, expected: `10`, isHidden: true },
      { inputData: `len(even_numbers([10, 21, 32, 43]))`, expected: `2`, isHidden: true },
    ],
  },
];

const MODULE_ORDER_INDEX = 7;

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
    console.log(`+ Seeded M7.${p.orderIndex} ${p.title} (id=${created.id}, ${p.hints.length} hints, ${p.testCases.length} test cases)`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
