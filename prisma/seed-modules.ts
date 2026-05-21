import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MODULES = [
  { orderIndex: 0,  title: 'How Programming Works',      description: 'A gentle intro to coding. No programming experience needed.',   estimatedMinutes: 15, isFoundational: true  },
  { orderIndex: 1,  title: 'First Lines of Code',        description: 'Print things, write comments, run your first programs.',         estimatedMinutes: 20, isFoundational: false },
  { orderIndex: 2,  title: 'Variables & Data Types',     description: 'Store values, work with numbers, text, and booleans.',           estimatedMinutes: 25, isFoundational: false },
  { orderIndex: 3,  title: 'Strings in Depth',           description: 'Combine, format, and transform text.',                           estimatedMinutes: 25, isFoundational: false },
  { orderIndex: 4,  title: 'Getting Input from the User',description: 'Ask questions and react to answers.',                            estimatedMinutes: 20, isFoundational: false },
  { orderIndex: 5,  title: 'Making Decisions',           description: 'Use if/else to branch your code based on conditions.',           estimatedMinutes: 30, isFoundational: false },
  { orderIndex: 6,  title: 'Loops',                      description: 'Repeat actions with for and while loops.',                       estimatedMinutes: 35, isFoundational: false },
  { orderIndex: 7,  title: 'Lists',                      description: 'Store collections of values and operate on them.',               estimatedMinutes: 35, isFoundational: false },
  { orderIndex: 8,  title: 'String Operations',          description: 'Slice strings, search them, and manipulate them.',               estimatedMinutes: 30, isFoundational: false },
  { orderIndex: 9,  title: 'Dictionaries & Tuples',      description: 'Work with key-value data and fixed-size groups.',                estimatedMinutes: 30, isFoundational: false },
  { orderIndex: 10, title: 'Functions (Going Deeper)',   description: 'Default args, multiple return values, organizing code.',         estimatedMinutes: 30, isFoundational: false },
  { orderIndex: 11, title: 'Debugging & Reading Errors', description: 'Read error messages and fix broken code.',                       estimatedMinutes: 25, isFoundational: false },
];

const PROBLEM_TO_MODULE: Record<string, { moduleOrderIndex: number; newOrderIndex: number }> = {
  'Hello, World!':           { moduleOrderIndex: 1,  newOrderIndex: 1 },
  'Sum Two Numbers':         { moduleOrderIndex: 10, newOrderIndex: 1 },
  'Even or Odd':             { moduleOrderIndex: 5,  newOrderIndex: 1 },
  'FizzBuzz (1 to N)':       { moduleOrderIndex: 6,  newOrderIndex: 4 },
  'Find the Largest Number': { moduleOrderIndex: 7,  newOrderIndex: 2 },
  'Reverse a String':        { moduleOrderIndex: 8,  newOrderIndex: 1 },
  'Count Vowels':            { moduleOrderIndex: 8,  newOrderIndex: 2 },
  'Fibonacci Sequence':      { moduleOrderIndex: 10, newOrderIndex: 4 },
  'Check if Palindrome':     { moduleOrderIndex: 8,  newOrderIndex: 3 },
  'List Deduplication':      { moduleOrderIndex: 7,  newOrderIndex: 5 },
};

async function main() {
  console.log('Creating 12 modules...');
  for (const m of MODULES) {
    await prisma.module.upsert({
      where: { orderIndex: m.orderIndex },
      update: m,
      create: m,
    });
    console.log(`  ✓ M${m.orderIndex}: ${m.title}`);
  }

  console.log('\nAssigning problems to modules...');
  for (const [title, mapping] of Object.entries(PROBLEM_TO_MODULE)) {
    const module = await prisma.module.findUnique({
      where: { orderIndex: mapping.moduleOrderIndex },
    });
    if (!module) {
      console.error(`  ✗ Module ${mapping.moduleOrderIndex} not found`);
      continue;
    }
    const updated = await prisma.problem.updateMany({
      where: { title },
      data: { moduleId: module.id, orderIndex: mapping.newOrderIndex },
    });
    console.log(`  ✓ "${title}" → M${mapping.moduleOrderIndex} (orderIndex ${mapping.newOrderIndex}) [${updated.count} row]`);
  }

  // Orphan check removed: post-migration `problems.module_id` is NOT NULL,
  // so a moduleId: null filter is a schema-level type error. The composite
  // unique (moduleId, orderIndex) and the FK constraint make orphans
  // impossible at the DB level.

  console.log('\n✅ Data migration complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
