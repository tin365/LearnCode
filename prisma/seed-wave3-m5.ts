/**
 * Wave 3 — Module 5 "Making Decisions" — adds 5 new problems (5.2–5.6).
 * The M5 lesson was already written in Wave 1 Step 7, so this seed only
 * adds problems. orderIndex slots match the gaps left in CURRICULUM.md.
 *
 * Run:  pnpm tsx prisma/seed-wave3-m5.ts
 */
import { Difficulty, PrismaClient, ProblemType } from '@prisma/client';

const prisma = new PrismaClient();

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
  // -------- M5.2 ----------
  {
    title: 'Sign of a Number',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Sign of a Number

Write a function called \`sign\` that takes one number \`n\` and returns one of three strings:

- \`"positive"\` if \`n\` is greater than zero
- \`"negative"\` if \`n\` is less than zero
- \`"zero"\` if \`n\` is exactly zero

### Examples

\`\`\`python
sign(5)      # → "positive"
sign(-3)     # → "negative"
sign(0)      # → "zero"
\`\`\`

> **Tip:** You have three branches, so the cleanest shape is \`if / elif / else\`.
    `.trim(),
    starterCode: `def sign(n):
    # Return "positive", "negative", or "zero".
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Three branches means \`if / elif / else\`. The order matters: check one possibility per branch.`,
      },
      {
        orderIndex: 2,
        content: `Sketch:

\`\`\`python
if n > 0:
    return "positive"
elif n < 0:
    return "negative"
else:
    return "zero"
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def sign(n):
    if n > 0:
        return "positive"
    elif n < 0:
        return "negative"
    else:
        return "zero"
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `sign(5)`, expected: `positive`, isHidden: false },
      { inputData: `sign(-3)`, expected: `negative`, isHidden: true },
      { inputData: `sign(0)`, expected: `zero`, isHidden: true },
      { inputData: `sign(100)`, expected: `positive`, isHidden: true },
      { inputData: `sign(-0.5)`, expected: `negative`, isHidden: true },
    ],
  },

  // -------- M5.3 ----------
  {
    title: 'Larger of Two Numbers',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Larger of Two Numbers

Write a function called \`larger\` that takes two numbers \`a\` and \`b\` and returns whichever one is bigger. If they're equal, either one is fine.

### Examples

\`\`\`python
larger(5, 3)        # → 5
larger(2, 10)       # → 10
larger(7, 7)        # → 7
larger(-1, -5)      # → -1
\`\`\`

> **Tip:** Two branches — \`if\` and \`else\`. Or use Python's built-in \`max(a, b)\` if you spot it.
    `.trim(),
    starterCode: `def larger(a, b):
    # Return whichever of a or b is bigger.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Compare \`a\` and \`b\`, then return whichever is bigger. With \`>=\`, the equal case picks \`a\` — which still satisfies the problem.`,
      },
      {
        orderIndex: 2,
        content: `Sketch:

\`\`\`python
if a >= b:
    return a
else:
    return b
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Two-line body, or a one-liner with Python's built-in:

\`\`\`python
def larger(a, b):
    return a if a >= b else b      # conditional expression

# or
def larger(a, b):
    return max(a, b)
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `larger(5, 3)`, expected: `5`, isHidden: false },
      { inputData: `larger(2, 10)`, expected: `10`, isHidden: true },
      { inputData: `larger(7, 7)`, expected: `7`, isHidden: true },
      { inputData: `larger(-1, -5)`, expected: `-1`, isHidden: true },
      { inputData: `larger(0, 1)`, expected: `1`, isHidden: true },
    ],
  },

  // -------- M5.4 (medium) ----------
  {
    title: 'Grade Calculator',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Grade Calculator

Write a function called \`grade\` that takes a numeric \`score\` and returns a letter grade according to this scale:

| Score range  | Grade |
|--------------|-------|
| 90 and up    | "A"   |
| 80–89        | "B"   |
| 70–79        | "C"   |
| 60–69        | "D"   |
| below 60     | "F"   |

The boundaries are inclusive on the lower end — e.g. **80 is a "B", 90 is an "A"**.

### Examples

\`\`\`python
grade(95)    # → "A"
grade(85)    # → "B"
grade(75)    # → "C"
grade(65)    # → "D"
grade(50)    # → "F"
grade(90)    # → "A"   (boundary)
grade(60)    # → "D"   (boundary)
\`\`\`

> **Tip:** Check from high to low with \`if / elif\`. Once a branch matches, the others are skipped — so by the time you reach \`elif score >= 80\`, you already know the score is below 90.
    `.trim(),
    starterCode: `def grade(score):
    # Return "A", "B", "C", "D", or "F" based on score.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Five branches, so \`if / elif / elif / elif / else\`. Walk from highest to lowest — once you match, the rest get skipped.`,
      },
      {
        orderIndex: 2,
        content: `Sketch (just the first two branches):

\`\`\`python
if score >= 90:
    return "A"
elif score >= 80:
    return "B"
# ... continue for C, D, F
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `grade(95)`, expected: `A`, isHidden: false },
      { inputData: `grade(90)`, expected: `A`, isHidden: true },
      { inputData: `grade(85)`, expected: `B`, isHidden: true },
      { inputData: `grade(80)`, expected: `B`, isHidden: true },
      { inputData: `grade(75)`, expected: `C`, isHidden: true },
      { inputData: `grade(65)`, expected: `D`, isHidden: true },
      { inputData: `grade(60)`, expected: `D`, isHidden: true },
      { inputData: `grade(59)`, expected: `F`, isHidden: true },
      { inputData: `grade(0)`, expected: `F`, isHidden: true },
    ],
  },

  // -------- M5.5 (medium) ----------
  {
    title: 'Leap Year Checker',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Leap Year Checker

A year is a **leap year** if:

- it is divisible by 4, **and**
- it is **not** divisible by 100, **unless**
- it is also divisible by 400.

So 2000 was a leap year, 1900 was not, 2024 is, and 2023 isn't.

Write a function called \`is_leap\` that takes an integer \`year\` and returns \`True\` if it's a leap year, \`False\` otherwise.

### Examples

\`\`\`python
is_leap(2000)    # → True   (divisible by 400)
is_leap(1900)    # → False  (divisible by 100 but not 400)
is_leap(2024)    # → True   (divisible by 4, not 100)
is_leap(2023)    # → False  (not divisible by 4)
\`\`\`

> **Tip:** The modulo operator \`%\` gives the remainder. \`year % 4 == 0\` is "year is divisible by 4." You can combine these checks with \`and\` and \`or\`, or use nested \`if\` blocks — both work.
    `.trim(),
    starterCode: `def is_leap(year):
    # Return True if year is a leap year, False otherwise.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Three conditions: divisible by 400 ⇒ True. Divisible by 100 (but not 400) ⇒ False. Divisible by 4 (but not 100) ⇒ True. Anything else ⇒ False.`,
      },
      {
        orderIndex: 2,
        content: `One-expression version with \`and\`/\`or\`:

\`\`\`python
return (year % 4 == 0 and year % 100 != 0) or year % 400 == 0
\`\`\`

Read it as: "divisible by 4 AND not by 100" OR "divisible by 400".`,
      },
      {
        orderIndex: 3,
        content: `Full body (one-expression version):

\`\`\`python
def is_leap(year):
    return (year % 4 == 0 and year % 100 != 0) or year % 400 == 0
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `is_leap(2000)`, expected: `True`, isHidden: false },
      { inputData: `is_leap(1900)`, expected: `False`, isHidden: true },
      { inputData: `is_leap(2024)`, expected: `True`, isHidden: true },
      { inputData: `is_leap(2023)`, expected: `False`, isHidden: true },
      { inputData: `is_leap(2100)`, expected: `False`, isHidden: true },
      { inputData: `is_leap(2400)`, expected: `True`, isHidden: true },
      { inputData: `is_leap(1)`, expected: `False`, isHidden: true },
    ],
  },

  // -------- M5.6 (medium) ----------
  {
    title: 'Simple Login',
    orderIndex: 6,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Simple Login

Write a function called \`can_login\` that takes a \`username\` and \`password\` and returns \`True\` only when **both** match the expected values:

- username: \`"admin"\`
- password: \`"secret"\`

Anything else — wrong username, wrong password, both wrong, even just different capitalisation — must return \`False\`.

### Examples

\`\`\`python
can_login("admin", "secret")     # → True
can_login("admin", "wrong")      # → False
can_login("ADMIN", "secret")     # → False   (case sensitive)
can_login("", "")                # → False
\`\`\`

> **Tip:** Combine two equality checks with \`and\`. The function body can be a single \`return\` line.
    `.trim(),
    starterCode: `def can_login(username, password):
    # Return True only if both username and password match.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Both conditions must be true. Use \`and\` to combine two \`==\` checks.`,
      },
      {
        orderIndex: 2,
        content: `Sketch:

\`\`\`python
return username == "admin" and password == "secret"
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def can_login(username, password):
    return username == "admin" and password == "secret"
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `can_login("admin", "secret")`, expected: `True`, isHidden: false },
      { inputData: `can_login("admin", "wrong")`, expected: `False`, isHidden: true },
      { inputData: `can_login("user", "secret")`, expected: `False`, isHidden: true },
      { inputData: `can_login("", "")`, expected: `False`, isHidden: true },
      { inputData: `can_login("ADMIN", "secret")`, expected: `False`, isHidden: true },
      { inputData: `can_login("admin", "")`, expected: `False`, isHidden: true },
    ],
  },
];

const MODULE_ORDER_INDEX = 5;

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
        title: p.title,
        description: p.description,
        starterCode: p.starterCode,
        difficulty: p.difficulty,
        type: p.type,
        moduleId: mod.id,
        orderIndex: p.orderIndex,
        hints: { create: p.hints },
        testCases: { create: p.testCases },
      },
      select: { id: true },
    });
    console.log(
      `+ Seeded M5.${p.orderIndex} ${p.title} (id=${created.id}, ${p.hints.length} hints, ${p.testCases.length} test cases)`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
