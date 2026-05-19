/**
 * Wave 3 — Module 8 "String Operations" — adds 2 new problems (8.4, 8.5).
 * Run:  pnpm tsx prisma/seed-wave3-m8.ts
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
  // -------- M8.4 (medium) ----------
  {
    title: 'Count Words',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Count Words

Write a function called \`count_words\` that takes a string \`sentence\` and returns how many words it contains.

Words are runs of non-whitespace characters separated by any kind of whitespace. **Multiple spaces in a row, leading spaces, and trailing spaces don't count as extra words.**

### Examples

\`\`\`python
count_words("hello world")            # → 2
count_words("the quick brown fox")    # → 4
count_words("")                       # → 0
count_words("   ")                    # → 0
count_words("  many   spaces  ")      # → 2
count_words("single")                 # → 1
\`\`\`

> **Tip:** \`s.split()\` with no arguments splits on any whitespace and discards empty parts — exactly the behaviour you want. Combine with \`len(...)\` for the count.
    `.trim(),
    starterCode: `def count_words(sentence):
    # Return the number of words in sentence.
    pass
`,
    hints: [
      { orderIndex: 1, content: `\`s.split()\` (with no argument) splits on any whitespace AND drops empty pieces — so multiple spaces don't create phantom empty words.` },
      { orderIndex: 2, content: `Body sketch:\n\n\`\`\`python\nreturn len(sentence.split())\n\`\`\`` },
      { orderIndex: 3, content: `Full body:\n\n\`\`\`python\ndef count_words(sentence):\n    return len(sentence.split())\n\`\`\`` },
    ],
    testCases: [
      { inputData: `count_words("hello world")`, expected: `2`, isHidden: false },
      { inputData: `count_words("the quick brown fox")`, expected: `4`, isHidden: true },
      { inputData: `count_words("")`, expected: `0`, isHidden: true },
      { inputData: `count_words("   ")`, expected: `0`, isHidden: true },
      { inputData: `count_words("  many   spaces  ")`, expected: `2`, isHidden: true },
      { inputData: `count_words("single")`, expected: `1`, isHidden: true },
      { inputData: `count_words("a b c d e f g")`, expected: `7`, isHidden: true },
    ],
  },

  // -------- M8.5 ----------
  {
    title: 'Spaces to Underscores',
    orderIndex: 5,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Spaces to Underscores

Write a function called \`underscore\` that takes a string \`s\` and returns the same string with **every space replaced by an underscore**.

### Examples

\`\`\`python
underscore("hello world")           # → "hello_world"
underscore("the quick brown fox")   # → "the_quick_brown_fox"
underscore("no_spaces_here")        # → "no_spaces_here"
underscore("")                      # → ""
\`\`\`

> **Tip:** Strings have a \`.replace(old, new)\` method that returns a copy with every occurrence of \`old\` swapped for \`new\`.
    `.trim(),
    starterCode: `def underscore(s):
    # Replace every space in s with an underscore.
    pass
`,
    hints: [
      { orderIndex: 1, content: `One method does the whole job: \`s.replace(" ", "_")\`. Remember it returns a *new* string — you have to \`return\` the result, not modify \`s\` in place.` },
      { orderIndex: 2, content: `Body sketch:\n\n\`\`\`python\nreturn s.replace(" ", "_")\n\`\`\`` },
      { orderIndex: 3, content: `Full body:\n\n\`\`\`python\ndef underscore(s):\n    return s.replace(" ", "_")\n\`\`\`` },
    ],
    testCases: [
      { inputData: `underscore("hello world")`, expected: `hello_world`, isHidden: false },
      { inputData: `underscore("the quick brown fox")`, expected: `the_quick_brown_fox`, isHidden: true },
      { inputData: `underscore("no_spaces_here")`, expected: `no_spaces_here`, isHidden: true },
      { inputData: `underscore("")`, expected: ``, isHidden: true },
      { inputData: `underscore("  leading and trailing  ").count(" ")`, expected: `0`, isHidden: true },
      { inputData: `underscore("a b c d").count("_")`, expected: `3`, isHidden: true },
    ],
  },
];

const MODULE_ORDER_INDEX = 8;

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
    console.log(`+ Seeded M8.${p.orderIndex} ${p.title} (id=${created.id}, ${p.hints.length} hints, ${p.testCases.length} test cases)`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
