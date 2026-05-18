/**
 * Seeds the Module 0 lesson — the foundational reading that introduces
 * programming and the LearnCode interface. M0 has no problems; finishing
 * its lesson is what unlocks M1.
 *
 * Run:  pnpm tsx prisma/seed-module-zero.ts
 *
 * Idempotent: skips if the lesson already exists.
 */
import { PrismaClient, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const MODULE_ZERO_ORDER_INDEX = 0;

const LESSON = {
  title: 'How Programming Works',
  estimatedMinutes: 15,
  concepts: ['programming', 'python', 'how code runs'],
};

const SECTIONS: Array<{
  orderIndex: number;
  type: SectionType;
  title: string;
  content: string;
  code?: string;
}> = [
  {
    orderIndex: 1,
    type: SectionType.why_you_need_this,
    title: 'Why Learn to Code?',
    content: `Every app you use — your messaging app, your bank, YouTube, the search bar at the top of this page — is a stack of instructions written by people just like you. Learning to code means you can tell a computer *exactly* what to do, instead of being stuck with whatever someone else built.

You don't need to be "good at math." You don't need a special brain. Coding is mostly about breaking a problem into small, ordered steps. That's a skill anyone can learn — and it pays off in almost every job, hobby, and creative side project.`,
  },
  {
    orderIndex: 2,
    type: SectionType.the_basics,
    title: 'What is a Program?',
    content: `A program is a **list of instructions** a computer follows, one line at a time, top to bottom.

That's really it. Each line tells the computer to do *one specific thing* — print a message, do some math, ask the user a question. The computer does whatever's on line 1, then line 2, then line 3, never skipping ahead unless you tell it to.

The hard part of programming isn't typing the instructions. It's figuring out **what the right instructions are** to solve your problem. That's what most of this course is about: building the habit of thinking step by step.`,
  },
  {
    orderIndex: 3,
    type: SectionType.syntax_reference,
    title: 'Meet Python',
    content: `Python is the language we'll use. It was designed to read almost like English — which makes it the most popular first language for new programmers.

Here's a one-line Python program:`,
    code: `print("Hello, World!")`,
  },
  {
    orderIndex: 4,
    type: SectionType.worked_example,
    title: 'How LearnCode Works',
    content: `You'll be writing and running Python directly in this app. The workspace has three panels:

- **Left** — the module sidebar. It shows your progress through 12 modules.
- **Middle** — tabs for the lesson, the problem description, and hints.
- **Right** — the code editor and a terminal where your program's output appears.

When you write code and press **Run**, the editor sends your code to a Python engine running in your browser (no servers, no installs) and shows the result on the right. When you're confident your code works, you press **Submit** to check it against the hidden test cases.`,
  },
  {
    orderIndex: 5,
    type: SectionType.common_mistakes,
    title: 'Tips for Learning to Code',
    content: `A few habits make the difference between people who learn coding quickly and people who give up:

- **Type the code yourself — don't copy-paste.** Your fingers learn the patterns. Copy-paste robs you of that.
- **Read error messages carefully.** They look scary, but they almost always tell you exactly where the problem is and what's wrong.
- **Use hints when you're stuck for more than 10 minutes.** Hints cost you 10 points each — but staring at a wall for an hour costs you motivation, which matters more.
- **Practice every day, even just 15 minutes.** Short and frequent beats long and rare. Your brain consolidates programming patterns while you sleep.

Ready? On the next screen you'll write your very first program: making the computer say "Hello, World!"`,
  },
];

async function main() {
  const mod = await prisma.module.findUnique({
    where: { orderIndex: MODULE_ZERO_ORDER_INDEX },
  });
  if (!mod) {
    throw new Error('Module 0 not found — run the modules seed first.');
  }

  const existing = await prisma.lesson.findUnique({ where: { moduleId: mod.id } });
  if (existing) {
    console.log(`Module 0 lesson already exists (id=${existing.id}); skipping.`);
    return;
  }

  const lesson = await prisma.lesson.create({
    data: {
      moduleId: mod.id,
      title: LESSON.title,
      estimatedMinutes: LESSON.estimatedMinutes,
      concepts: LESSON.concepts,
      sections: { create: SECTIONS },
    },
    select: { id: true, sections: { select: { id: true } } },
  });

  console.log(
    `Seeded Module 0 lesson (id=${lesson.id}, ${lesson.sections.length} sections, moduleId=${mod.id}).`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
