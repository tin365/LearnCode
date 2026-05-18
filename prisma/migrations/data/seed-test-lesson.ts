/**
 * TEMPORARY seed for Step 5 verification.
 * Adds a sample lesson on Module 5 (Making Decisions) so the tabbed
 * LessonView renderer can be visually verified before Step 7 writes
 * real content.
 *
 * Run:    pnpm tsx prisma/migrations/data/seed-test-lesson.ts
 * Remove: pnpm tsx prisma/migrations/data/seed-test-lesson.ts --delete
 */
import { PrismaClient, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const TARGET_MODULE_ORDER_INDEX = 5;

const SECTIONS: Array<{
  orderIndex: number;
  type: SectionType;
  title?: string;
  content: string;
  code?: string;
}> = [
  {
    orderIndex: 1,
    type: SectionType.why_you_need_this,
    content:
      'Your programs need to make decisions: should the user see a discount? Are they old enough to vote? Is the password correct? **if statements** are how your code answers questions like these.',
  },
  {
    orderIndex: 2,
    type: SectionType.the_basics,
    content:
      "An `if` statement runs a block of code **only when a condition is true**.\n\nThe condition is anything that evaluates to `True` or `False`. Python decides whether to run the indented block underneath the `if` based on that value.",
  },
  {
    orderIndex: 3,
    type: SectionType.syntax_reference,
    content: 'The general pattern:',
    code: 'if <condition>:\n    # runs when condition is True\nelse:\n    # runs otherwise',
  },
  {
    orderIndex: 4,
    type: SectionType.worked_example,
    content:
      "**Example:** check whether a number is positive.\n\nNotice the indentation — Python uses it to decide what's inside the `if` block.",
    code: 'number = 7\nif number > 0:\n    print("positive")\nelse:\n    print("zero or negative")',
  },
  {
    orderIndex: 5,
    type: SectionType.try_it_yourself,
    content:
      'Change the value of `age` and run the code. Try `15`, `18`, and `21`. What do you see?',
    code: 'age = 18\n\nif age >= 18:\n    print("You can vote.")\nelse:\n    print("Too young to vote.")',
  },
  {
    orderIndex: 6,
    type: SectionType.common_mistakes,
    content:
      '- ❌ **Using `=` instead of `==` in a condition.** `=` assigns, `==` compares.\n- ❌ **Forgetting the colon.** `if x > 0` is a syntax error — Python wants `if x > 0:`.\n- ❌ **Wrong indentation.** Everything inside the `if` must be indented the same amount.',
  },
];

async function seed() {
  const mod = await prisma.module.findUnique({
    where: { orderIndex: TARGET_MODULE_ORDER_INDEX },
  });
  if (!mod) throw new Error(`Module M${TARGET_MODULE_ORDER_INDEX} not found`);

  const existing = await prisma.lesson.findUnique({ where: { moduleId: mod.id } });
  if (existing) {
    console.log(`Lesson already exists for M${TARGET_MODULE_ORDER_INDEX}; skipping.`);
    return;
  }

  await prisma.lesson.create({
    data: {
      moduleId: mod.id,
      title: 'Making Decisions with if/else',
      estimatedMinutes: 10,
      concepts: ['if statements', 'comparison', 'boolean logic'],
      sections: { create: SECTIONS },
    },
  });

  console.log(`Seeded test lesson for M${TARGET_MODULE_ORDER_INDEX} (moduleId=${mod.id})`);
}

async function remove() {
  const mod = await prisma.module.findUnique({
    where: { orderIndex: TARGET_MODULE_ORDER_INDEX },
  });
  if (!mod) return;
  const lesson = await prisma.lesson.findUnique({ where: { moduleId: mod.id } });
  if (!lesson) {
    console.log('No lesson to delete.');
    return;
  }
  await prisma.lessonProgress.deleteMany({ where: { lessonId: lesson.id } });
  await prisma.lessonSection.deleteMany({ where: { lessonId: lesson.id } });
  await prisma.lesson.delete({ where: { id: lesson.id } });
  console.log(`Deleted test lesson for M${TARGET_MODULE_ORDER_INDEX}`);
}

async function main() {
  const shouldDelete = process.argv.includes('--delete');
  if (shouldDelete) await remove();
  else await seed();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
