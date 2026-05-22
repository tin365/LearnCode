/**
 * Wave — JavaScript Module 0 "How JavaScript Works"
 *
 * Adds the JavaScript M0 lesson (foundational reading). M0 has no problems.
 *
 * Run:  pnpm tsx prisma/seed-javascript-m0.ts
 *
 * Idempotent: module + lesson upserted.
 */
import { PrismaClient, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'javascript';
const MODULE_ORDER_INDEX = 100; // JavaScript Base (100) + Module 0
const MODULE = {
  title: 'How JavaScript Works',
  description: 'A gentle intro to the language of the web. No experience needed.',
  estimatedMinutes: 15,
  isFoundational: true,
};

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
  title: 'Introduction to JavaScript',
  estimatedMinutes: 15,
  concepts: ['JavaScript', 'Web Browsers', 'Interpreted', 'Engines'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'The Language of the Web',
      content: `If the internet was a city, HTML would be the buildings, CSS would be the paint and decorations, and **JavaScript** would be the people, the cars, and the electricity. 

JavaScript is what makes the web **alive**. It's the language that lets you click a button to like a photo, drag items into a shopping cart, or play games in your browser. Today, it's the most popular programming language in the world and runs on everything from tiny watches to massive servers.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Code that Runs Anywhere',
      content: `JavaScript was originally designed to run inside web browsers like Chrome, Safari, and Firefox. Because of this, it is **interpreted**, which means your code runs instantly without needing a long "compiling" step.

When you write JavaScript, a piece of software called an **Engine** (like Google's "V8") reads your text and performs the actions immediately. This makes JavaScript one of the fastest and most fun languages to learn because you see results the second you finish typing.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: 'The JavaScript Pattern',
      content: `JavaScript is designed to be readable and flexible. We organize our logic into **functions**, and we use \`console.log()\` to print information.

Here is a tiny piece of JavaScript:`,
      code: `function sayHello() {
  console.log("Hello, World!");
}

sayHello();`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Tour of the LearnCode Interface',
      content: `You'll be writing and running JavaScript directly in this app. The workspace has three main areas:

- **Left Panel**: Your progress map. It shows all 12 modules and the problems inside them.
- **Middle Panel**: Your "textbook." This is where you'll find lessons, problem descriptions, and hints if you get stuck.
- **Right Panel**: Your workshop. You'll write your code in the editor and see the result in the terminal below it.

When you're ready, press **Run** to see your output. When you think you've solved a problem, press **Submit** to check it against our test cases.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.common_mistakes,
      title: 'Tips for Success',
      content: `Learning to code is a skill, like playing an instrument or a sport. Here is how to learn effectively:

- **Don't just read — Type!** Your brain learns patterns much faster when your fingers do the work. Try typing the examples yourself.
- **Errors are helpful.** If your code doesn't work, JavaScript will give you an error message. It's not a failure; it's a specific instruction on what to fix!
- **Break it down.** Big programs are just many small instructions joined together. If you're overwhelmed, focus on making just the next line work.
- **Stay curious.** Experiment! Change a number or a word and see what happens.

Ready to start? In the next module, you'll write your very first lines of JavaScript!`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function upsertModule(): Promise<number> {
  const existing = await prisma.module.findUnique({ where: { orderIndex: MODULE_ORDER_INDEX } });
  if (existing) {
    await prisma.module.update({
      where: { id: existing.id },
      data: { ...MODULE, language: LANGUAGE },
    });
    console.log(`↻ Updated ${LANGUAGE} M${MODULE_ORDER_INDEX}: ${MODULE.title}`);
    return existing.id;
  }
  const created = await prisma.module.create({
    data: { ...MODULE, language: LANGUAGE, orderIndex: MODULE_ORDER_INDEX },
  });
  console.log(`+ Seeded ${LANGUAGE} M${MODULE_ORDER_INDEX}: ${MODULE.title}`);
  return created.id;
}

async function upsertLesson(moduleId: number) {
  const existing = await prisma.lesson.findUnique({ where: { moduleId } });
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
    console.log(`↻ Updated lesson: ${LESSON.title}`);
  } else {
    await prisma.lesson.create({
      data: { moduleId, ...LESSON, sections: { create: LESSON.sections } },
    });
    console.log(`+ Seeded lesson: ${LESSON.title}`);
  }
}

async function main() {
  const moduleId = await upsertModule();
  await upsertLesson(moduleId);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
