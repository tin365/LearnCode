/**
 * Wave 2 — Module 11 "Debugging & Reading Errors"  (final Wave 2 step)
 *
 * Adds the M11 lesson plus 5 new problems (11.1 – 11.5), all
 * ProblemType.DEBUG. Each problem ships with intentionally broken
 * starter code and the user fixes it. Test cases evaluate the fixed
 * function — the test runner already surfaces stderr from Python,
 * so an unfixed submission shows the user the same Python error
 * message they'd see locally.
 *
 * Run:  pnpm tsx prisma/seed-wave2-m11.ts
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
  moduleOrderIndex: 11,
  title: 'Debugging & Reading Errors',
  estimatedMinutes: 14,
  concepts: ['traceback', 'NameError', 'TypeError', 'IndexError', 'IndentationError', 'print-debugging'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Errors Are Your Friends',
      content: `Every programmer hits errors. The good ones don't hit *fewer* errors — they just **read** them faster. Python's error messages tell you almost exactly where the problem is and what went wrong, but they can feel intimidating until you've seen each kind a few times.

This module gets you fluent in the four most common Python errors, plus the single most-used debugging technique: dropping in a \`print()\` to see what your code actually thinks is going on.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Read the Traceback Bottom-Up',
      content: `When Python crashes, it prints a **traceback** — a stack of frames showing how it got to the error. The most useful line is the last one. It always has the same shape:

\`\`\`
<ErrorType>: <short message>
\`\`\`

The four you'll meet most often:

- **\`NameError\`** — you used a name Python doesn't know (typo, or forgot to define it).
- **\`TypeError\`** — you used an operation on the wrong kind of value (\`"3" + 5\`, or calling something that isn't a function).
- **\`IndexError\`** — you asked for a list position that doesn't exist (\`items[5]\` when the list has 3 items).
- **\`IndentationError\`** — your indentation is broken (missing 4 spaces, or mixing tabs and spaces).

When you can't tell what went wrong from the message alone, drop a \`print()\` in just before the line that crashed and inspect the values you're working with. That's it. That's the debugging move.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'What a traceback looks like, and the print-debugging pattern:',
      code: `Traceback (most recent call last):
  File "main.py", line 3, in <module>
    print(grade)
NameError: name 'grade' is not defined
#  ^         ^
#  type      what specifically went wrong

# Print-debugging — sprinkle prints to inspect values
def average(numbers):
    total = sum(numbers)
    print("DEBUG total =", total)         # remove once fixed
    print("DEBUG len   =", len(numbers))
    return total / len(numbers)`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Two Quick Fixes',
      content: `**Example 1 — NameError:** Python tells you the name it doesn't know. Find it in your code; it's almost always a typo or a missing definition.

\`\`\`python
def shout(message):
    return mesage.upper()   # NameError: name 'mesage' is not defined

# Fix:
def shout(message):
    return message.upper()  # ← restored the missing 'm'
\`\`\`

**Example 2 — TypeError:** the message tells you which two types collided. Convert one to match the other.

\`\`\`python
print("Score: " + 87)
# TypeError: can only concatenate str (not "int") to str

# Fix — convert the int to a str, or use an f-string:
print("Score: " + str(87))
print(f"Score: {87}")
\`\`\`

The pattern is always the same: read the error type, read the message, look at the line it points to.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Fix the NameError',
      content: `Run the code below. You'll get a \`NameError\` telling you a specific name isn't defined. Fix the typo and run again.`,
      code: `def shout(message):
    return mesage.upper()    # bug: typo on the variable name

print(shout("hello"))
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes (when debugging)',
      content: `- ❌ **Ignoring the error message and re-running.** "Maybe it'll work this time" — it won't. Read the bottom of the traceback before changing anything.
- ❌ **Fixing the wrong line.** The error usually points to *exactly* the problem, but sometimes the *real* cause is one line up (a missing colon, a typo in a variable used below). Look at neighbouring lines too.
- ❌ **Removing code you didn't write to "make it shut up."** Especially with starter code in a DEBUG problem — your job is to *fix* the bug, not delete the broken line. The tests still need the function.
- ❌ **Not narrowing the bug.** If you can't tell where it crashes, add prints between sections to see how far execution got and what the values look like at each step.`,
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
  // -------- M11.1 ----------
  {
    title: 'Fix the NameError',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.DEBUG,
    description: `
## Fix the NameError

The function below is supposed to return its \`message\` parameter shouted in uppercase. But running it produces:

\`\`\`
NameError: name 'mesage' is not defined
\`\`\`

### Your job

Read the traceback. The name Python doesn't know is the clue. **Find the typo and fix it.** Don't add or remove lines — just correct the name.

### Expected behaviour after the fix

\`\`\`python
shout("hello")        # → "HELLO"
shout("good day")     # → "GOOD DAY"
\`\`\`
    `.trim(),
    starterCode: `def shout(message):
    return mesage.upper()
`,
    hints: [
      {
        orderIndex: 1,
        content: `The error message tells you exactly which name Python doesn't recognise. Look at it next to the parameter name — they're one letter apart.`,
      },
      {
        orderIndex: 2,
        content: `The parameter is \`message\`, but the body uses \`mesage\` (missing an 's'). Make them match.`,
      },
      {
        orderIndex: 3,
        content: `Full fix:

\`\`\`python
def shout(message):
    return message.upper()
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `shout("hello")`, expected: `HELLO`, isHidden: false },
      { inputData: `shout("good day")`, expected: `GOOD DAY`, isHidden: true },
      { inputData: `shout("")`, expected: ``, isHidden: true },
      { inputData: `shout("AlReAdY MiXeD")`, expected: `ALREADY MIXED`, isHidden: true },
    ],
  },

  // -------- M11.2 ----------
  {
    title: 'Fix the TypeError',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.DEBUG,
    description: `
## Fix the TypeError

The function below is supposed to format a one-line cart summary like:

\`\`\`
Cart has 3 items, total $50
\`\`\`

But it crashes with:

\`\`\`
TypeError: can only concatenate str (not "int") to str
\`\`\`

### Your job

The bug is mixing strings and integers with \`+\`. Either convert each number to a string with \`str(...)\`, or rewrite the line as an f-string. Both are fine.

### Expected behaviour after the fix

\`\`\`python
cart_summary(3, 50)    # → "Cart has 3 items, total $50"
cart_summary(0, 0)     # → "Cart has 0 items, total $0"
\`\`\`
    `.trim(),
    starterCode: `def cart_summary(items, total):
    return "Cart has " + items + " items, total $" + total
`,
    hints: [
      {
        orderIndex: 1,
        content: `\`items\` and \`total\` are integers. You can't \`+\` an int onto a string — that's the TypeError. Either convert each number with \`str(...)\` first, or use an f-string and let Python do the conversion for you.`,
      },
      {
        orderIndex: 2,
        content: `Option A — wrap each int with \`str\`:

\`\`\`python
return "Cart has " + str(items) + " items, total $" + str(total)
\`\`\`

Option B — f-string:

\`\`\`python
return f"Cart has {items} items, total \${total}"
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full fix (f-string version):

\`\`\`python
def cart_summary(items, total):
    return f"Cart has {items} items, total \${total}"
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `cart_summary(3, 50)`, expected: `Cart has 3 items, total $50`, isHidden: false },
      { inputData: `cart_summary(0, 0)`, expected: `Cart has 0 items, total $0`, isHidden: true },
      { inputData: `cart_summary(1, 999)`, expected: `Cart has 1 items, total $999`, isHidden: true },
      { inputData: `cart_summary(12, 1)`, expected: `Cart has 12 items, total $1`, isHidden: true },
    ],
  },

  // -------- M11.3 (medium) ----------
  {
    title: 'Fix the IndexError',
    orderIndex: 3,
    difficulty: Difficulty.medium,
    type: ProblemType.DEBUG,
    description: `
## Fix the IndexError

The function below is supposed to return the **last** item of a list. But it crashes with:

\`\`\`
IndexError: list index out of range
\`\`\`

### Your job

The classic off-by-one error. Python lists are zero-indexed, so the last item of a list with \`n\` elements is at position \`n - 1\`, **not** \`n\`. (Or use the elegant shortcut \`items[-1]\`.)

### Expected behaviour after the fix

\`\`\`python
get_last([1, 2, 3])       # → 3
get_last(["a", "b"])      # → "b"
get_last([42])            # → 42
\`\`\`
    `.trim(),
    starterCode: `def get_last(items):
    return items[len(items)]
`,
    hints: [
      {
        orderIndex: 1,
        content: `If a list has 3 items, the valid positions are 0, 1, 2 — there is no position 3. So \`items[len(items)]\` always asks for the *one past the end*. Subtract one.`,
      },
      {
        orderIndex: 2,
        content: `Two equally good fixes:

\`\`\`python
return items[len(items) - 1]
return items[-1]                # negative indexes count from the end
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full fix (the Pythonic version):

\`\`\`python
def get_last(items):
    return items[-1]
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `get_last([1, 2, 3])`, expected: `3`, isHidden: false },
      { inputData: `get_last(["a", "b"])`, expected: `b`, isHidden: true },
      { inputData: `get_last([42])`, expected: `42`, isHidden: true },
      { inputData: `get_last([10, 20, 30, 40, 50])`, expected: `50`, isHidden: true },
      { inputData: `get_last(["only"])`, expected: `only`, isHidden: true },
    ],
  },

  // -------- M11.4 ----------
  {
    title: 'Fix the IndentationError',
    orderIndex: 4,
    difficulty: Difficulty.easy,
    type: ProblemType.DEBUG,
    description: `
## Fix the IndentationError

The function below should double a number and return it. But it won't even start — running it produces:

\`\`\`
IndentationError: expected an indented block
\`\`\`

### Your job

Python uses indentation to mark what's *inside* a function. The body of a function must be indented (4 spaces is the convention). The starter has the \`return\` on the same level as the \`def\`. **Add the indentation.**

### Expected behaviour after the fix

\`\`\`python
double(5)        # → 10
double(0)        # → 0
double(-7)       # → -14
\`\`\`
    `.trim(),
    starterCode: `def double(n):
return n * 2
`,
    hints: [
      {
        orderIndex: 1,
        content: `Every line inside the function body must start with a consistent number of spaces — Python's convention is **4 spaces**.`,
      },
      {
        orderIndex: 2,
        content: `Shape:

\`\`\`python
def double(n):
    return n * 2          # 4 spaces in front of return
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full fix:

\`\`\`python
def double(n):
    return n * 2
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `double(5)`, expected: `10`, isHidden: false },
      { inputData: `double(0)`, expected: `0`, isHidden: true },
      { inputData: `double(-7)`, expected: `-14`, isHidden: true },
      { inputData: `double(100)`, expected: `200`, isHidden: true },
      { inputData: `double(1)`, expected: `2`, isHidden: true },
    ],
  },

  // -------- M11.5 (medium) — logic bug, no crash ----------
  {
    title: 'Find the Logic Bug',
    orderIndex: 5,
    difficulty: Difficulty.medium,
    type: ProblemType.DEBUG,
    description: `
## Find the Logic Bug

The function below is supposed to return the **largest** number in a list. But every test fails — no Python error, just wrong answers.

### Your job

Read the loop carefully. The comparison operator is reversed: it's checking for the *smallest* number, not the largest. Flip the operator.

If you're not sure what's happening, try adding a \`print()\` inside the loop to see what \`biggest\` becomes after each step:

\`\`\`python
print("DEBUG", n, "biggest now", biggest)
\`\`\`

You can leave or remove the prints when you submit — the tests only check the return value.

### Expected behaviour after the fix

\`\`\`python
biggest([3, 1, 4, 1, 5, 9, 2, 6])   # → 9
biggest([-1, -5, -3])               # → -1
biggest([5])                        # → 5
\`\`\`
    `.trim(),
    starterCode: `def biggest(numbers):
    biggest = numbers[0]
    for n in numbers:
        if n < biggest:
            biggest = n
    return biggest
`,
    hints: [
      {
        orderIndex: 1,
        content: `The function is checking \`if n < biggest\` — that means "if I find a *smaller* number, save it." But the goal is to find the *largest* number. Which direction should the comparison go?`,
      },
      {
        orderIndex: 2,
        content: `Flip the operator from \`<\` to \`>\`:

\`\`\`python
if n > biggest:
    biggest = n
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full fix:

\`\`\`python
def biggest(numbers):
    biggest = numbers[0]
    for n in numbers:
        if n > biggest:
            biggest = n
    return biggest
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `biggest([3, 1, 4, 1, 5, 9, 2, 6])`, expected: `9`, isHidden: false },
      { inputData: `biggest([-1, -5, -3])`, expected: `-1`, isHidden: true },
      { inputData: `biggest([5])`, expected: `5`, isHidden: true },
      { inputData: `biggest([10, 20, 30])`, expected: `30`, isHidden: true },
      { inputData: `biggest([100, 99, 98, 97])`, expected: `100`, isHidden: true },
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
      `+ Seeded M11.${p.orderIndex} ${p.title} (id=${created.id}, ${p.hints.length} hints, ${p.testCases.length} test cases)`,
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
