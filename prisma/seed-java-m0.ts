/**
 * Wave — Java Module 0 "How Java Works"
 *
 * Adds the Java M0 lesson (foundational reading). M0 has no problems.
 *
 * Run:  pnpm tsx prisma/seed-java-m0.ts
 *
 * Idempotent: module + lesson upserted.
 */
import { PrismaClient, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'java';
const MODULE_ORDER_INDEX = 200; // Java Base (200) + Module 0
const MODULE = {
  title: 'How Java Works',
  description: 'A gentle intro to Java. No programming experience needed.',
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
  title: 'How Java Works',
  estimatedMinutes: 15,
  concepts: ['Java', 'JVM', 'Compiling', 'How code runs'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Why Learn Java?',
      content: `Java is one of the most popular and powerful programming languages in the world. It was designed with a simple goal: "Write Once, Run Anywhere." This means a program written in Java can run on almost any device — from your laptop to your smartphone, and even on huge servers powering companies like Google, Netflix, and Amazon.

By learning Java, you aren't just learning a language; you're learning how professional software is built. It's a great first language because it teaches you clear structure and helps you understand how computers really work.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'What is Java?',
      content: `Java is a **high-level** language, which means it's designed to be easy for humans to read and write. But computers don't speak Java; they speak "machine code" (ones and zeros).

To bridge this gap, Java uses a two-step process:
1. **Compiling**: Your Java code is translated into a special format called **Bytecode**.
2. **Running**: A program called the **Java Virtual Machine (JVM)** reads that Bytecode and tells the computer exactly what to do.

This "virtual machine" is the secret to Java's power — it acts like a universal translator that works on any system.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: 'How Java Code Runs',
      content: `In Java, every piece of code lives inside a **Class**. A class is like a blueprint for a part of your program. Inside that class, we write **Methods**, which are the actual instructions.

Here is what the smallest working Java program looks like:`,
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Tour of the LearnCode Interface',
      content: `You'll be writing and running Java directly in this app. The workspace has three main areas:

- **Left Panel**: Your progress map. It shows all 12 modules and the problems inside them.
- **Middle Panel**: Your "textbook." This is where you'll find lessons, problem descriptions, and hints if you get stuck.
- **Right Panel**: Your workshop. You'll write your code in the editor and see the result in the terminal below it.

When you're ready, you press **Run** to see your output. When you think you've solved a problem, press **Submit** to check it against our test cases.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.common_mistakes,
      title: 'Tips for Learning Java',
      content: `Learning to code is like learning a musical instrument: it takes practice! Here are a few tips to help you succeed:

- **Don't just read — Type!** Your brain learns patterns much faster when your fingers are doing the work. Try typing the examples yourself instead of copy-pasting.
- **Errors are your friends.** When your code doesn't work, Java will give you an error message. It might look scary, but it's actually a helpful note telling you exactly what went wrong and where.
- **Take it step-by-step.** Coding is about breaking big problems into tiny, manageable instructions. If you get overwhelmed, focus on just the next single line.
- **Stay curious.** Ask "what happens if I change this?" Experimenting is the fastest way to truly understand how the code works.

Ready to start? In the next module, you'll write your very first lines of Java!`,
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
