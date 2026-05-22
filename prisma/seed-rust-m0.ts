/**
 * Wave — Rust Module 0 "How Rust Works"
 *
 * Adds the Rust M0 lesson (foundational reading). M0 has no problems.
 *
 * Run:  pnpm tsx prisma/seed-rust-m0.ts
 *
 * Idempotent: module + lesson upserted.
 */
import { PrismaClient, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'rust';
const MODULE_ORDER_INDEX = 300; // Rust Base (300) + Module 0
const MODULE = {
  title: 'How Rust Works',
  description: 'A gentle intro to Rust. No programming experience needed.',
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
  title: 'Introduction to Rust',
  estimatedMinutes: 15,
  concepts: ['Rust', 'Compiler', 'Safety', 'Cargo'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Why Learn Rust?',
      content: `Rust is one of the most exciting languages in modern programming. It was built to solve two big problems: making programs **fast** and making them **safe**.

Usually, you have to choose between speed (like C++) and safety (like Java or Python). Rust gives you both. It prevents common mistakes that cause programs to crash or be hacked, which is why companies like Microsoft, Amazon, and Discord are moving their most important code to Rust.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'The Helpful Guardian',
      content: `In most languages, you find out about bugs when your program crashes while someone is using it. In Rust, you find out **before the program even runs**.

Rust uses a very strict **Compiler** — a tool that reads your code and translates it for the computer. If the compiler sees something that might cause a crash later, it will refuse to finish until you fix it. It's like having a professional senior developer looking over your shoulder, helping you write perfect code from the start.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: 'The Rust Pattern',
      content: `In Rust, we organize code into **functions**. Every Rust program starts with a function named \`main\`. We use the \`println!\` macro to speak to the world.

Here is a tiny Rust program:`,
      code: `fn main() {
    println!("Hello, Rust!");
}`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Learning in the Browser',
      content: `On this platform, you don't need to install anything. The workspace has three panels:

- **Left**: Your curriculum path through 12 modules.
- **Middle**: Lessons, problem descriptions, and hints.
- **Right**: The code editor and terminal.

When you press **Run**, we send your code to a Rust compiler. If it's happy, it runs the code and shows the result. If not, it will give you a detailed error message explaining how to fix it.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.common_mistakes,
      title: 'Tips for Rust Success',
      content: `- **Embrace the compiler.** Rust's error messages are famous for being incredibly helpful. Read them carefully — they often tell you exactly what to type to fix the bug!
- **Type, don't copy.** You'll learn the syntax much faster if your fingers do the work.
- **Start small.** Rust has many advanced features, but you don't need them yet. Focus on the basics of logic and data.
- **Ask for help.** If you're stuck for more than 10 minutes, use the hints!

Ready to write your first line of Rust? Let's go!`,
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
