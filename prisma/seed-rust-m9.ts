/**
 * Wave — Rust Module 9 "Maps (Dictionaries)"
 *
 * Adds the Rust M9 lesson plus 5 problems.
 *
 * Run:  pnpm tsx prisma/seed-rust-m9.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'rust';
const MODULE_ORDER_INDEX = 309; // Rust Base (300) + Module 9
const MODULE = {
  title: 'Maps (Dictionaries)',
  description: 'Work with key-value data.',
  estimatedMinutes: 30,
  isFoundational: false,
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
  title: 'Key-Value Pairs with HashMap',
  estimatedMinutes: 15,
  concepts: ['HashMap', 'insert', 'get', 'contains_key', 'entry'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Looking Things Up',
      content: `In a Vector, you find items by their position (0, 1, 2...). But often, it's more useful to find items by a **name** or a **key**.

Imagine a contact list: you don't look for the 50th contact; you look for "Alice" to find her number. In Rust, we use a **HashMap** to store these pairs. This is the foundation of databases, settings menus, and more.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'The HashMap',
      content: `A **HashMap** stores data in pairs: a **Key** and a **Value**.

- **Key**: The identifier you use for lookup (like a username).
- **Value**: The data associated with that key (like an email address).

When you put a pair into the map, Rust remembers it. Later, you can provide the key and Rust will give you the value back instantly, no matter how many items are in the map!`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Using HashMap in Rust:',
      code: `use std::collections::HashMap;

// Create a map
let mut scores = HashMap::new();

// Add data
scores.insert("Alice", 95);
scores.insert("Bob", 82);

// Retrieve data (returns an Option)
let s = scores.get("Alice");

// Check if a key exists
let has_bob = scores.contains_key("Bob");

// Iterate
for (name, score) in &scores {
    println!("{}: {}", name, score);
}`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'A Simple Phonebook',
      content: `**Example:** Building a phonebook where we store names and numbers.

\`\`\`rust
use std::collections::HashMap;

fn get_number(name: &str) -> String {
    let mut book = HashMap::new();
    book.insert("Alice", "555-0101");
    book.insert("Bob", "555-0202");
    
    match book.get(name) {
        Some(number) => number.to_string(),
        None => "Not found".to_string(),
    }
}
\`\`\`

Notice the \`match\` block. In Rust, \`.get()\` doesn't return the value directly — it returns an **Option**. This forces you to handle the case where the name isn't in the book, preventing crashes!`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Fruit Counter',
      content: `Complete the function \`get_quantity\` to create a map of fruit names to counts and return the count for the given fruit.`,
      code: `use std::collections::HashMap;

fn get_quantity(fruit: &str) -> i32 {
    let mut inventory = HashMap::new();
    // TODO: Add "apple": 5, "banana": 10
    // TODO: Return the count for 'fruit' or 0 if missing
    0
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Keys must be unique.** If you insert "Alice" twice, the second value will overwrite the first one.
- ❌ **Forgetting the import.** Unlike Vectors, you must include \`use std::collections::HashMap;\` at the very top of your file.
- ❌ **Ignoring the Option.** You can't use the result of \`.get()\` directly in math or as a string. You must use \`unwrap()\`, \`unwrap_or()\`, or a \`match\` to get the value out.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const PROBLEMS: ProblemInput[] = [
  // -------- M9.1 ----------
  {
    title: 'Rust: Contact Book',
    orderIndex: 1,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Contact Book

Complete the function \`find_number\` that takes a HashMap of names to numbers and a \`target\`. Return the number or \`"Missing"\`.
`.trim(),
    starterCode: `use std::collections::HashMap;

fn find_number(contacts: HashMap<String, String>, target: &str) -> String {
    // TODO: Look up target in contacts
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `contacts.get(target)`.' },
      { orderIndex: 2, content: 'Use `.cloned().unwrap_or("Missing".to_string())` on the result.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\ncontacts.get(target).cloned().unwrap_or("Missing".to_string())\n```' },
    ],
    testCases: [
      { inputData: 'find_number(vec![("Alice".to_string(), "123".to_string())].into_iter().collect(), "Alice")', expected: '"123"', isHidden: false },
      { inputData: 'find_number(HashMap::new(), "Bob")', expected: '"Missing"', isHidden: true },
    ],
  },

  // -------- M9.2 ----------
  {
    title: 'Rust: Letter Frequency',
    orderIndex: 2,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Letter Frequency

Build a frequency map showing how many times each letter appears in a string.
`.trim(),
    starterCode: `use std::collections::HashMap;

fn count_letters(s: &str) -> HashMap<char, usize> {
    let mut counts = HashMap::new();
    // TODO: Loop through chars and update map
    counts
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `s.chars()` to loop.' },
      { orderIndex: 2, content: 'Use the `.entry(c).or_insert(0)` method to update counts easily.' },
      { orderIndex: 3, content: 'Try: `*counts.entry(c).or_insert(0) += 1;`' },
    ],
    testCases: [
      { inputData: 'count_letters("apple").get(&\'p\').cloned().unwrap_or(0)', expected: '2', isHidden: false },
      { inputData: 'count_letters("abc").len()', expected: '3', isHidden: true },
    ],
  },

  // -------- M9.3 ----------
  {
    title: 'Rust: Most Common',
    orderIndex: 3,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Most Common Item

Find the string that appears most often in a vector.
`.trim(),
    starterCode: `use std::collections::HashMap;

fn get_most_common(items: Vec<String>) -> String {
    let mut counts = HashMap::new();
    // TODO: 1. Count items
    // TODO: 2. Find key with max value
    String::new()
}
`,
    hints: [
      { orderIndex: 1, content: 'First, build a frequency map of the strings.' },
      { orderIndex: 2, content: 'Then loop over the map and track the `max_count` and `winner`.' },
      { orderIndex: 3, content: 'Example: `for (k, v) in counts { if v > max { max = v; winner = k; } }`' },
    ],
    testCases: [
      { inputData: 'get_most_common(vec!["a".to_string(), "a".to_string(), "b".to_string()])', expected: '"a"', isHidden: false },
      { inputData: 'get_most_common(vec!["rust".to_string()])', expected: '"rust"', isHidden: true },
    ],
  },

  // -------- M9.4 ----------
  {
    title: 'Rust: Invert Map',
    orderIndex: 4,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Invert Map

Take a HashMap (String to i32) and return a new one (i32 to String). Assume values are unique.
`.trim(),
    starterCode: `use std::collections::HashMap;

fn invert(original: HashMap<String, i32>) -> HashMap<i32, String> {
    let mut inverted = HashMap::new();
    // TODO: Swap keys and values
    inverted
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop through the original: `for (k, v) in original`.' },
      { orderIndex: 2, content: 'Inside the loop, `inverted.insert(v, k);`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```rust\nfor (k, v) in original { inverted.insert(v, k); }\ninverted\n```' },
    ],
    testCases: [
      { inputData: 'invert(vec![("A".to_string(), 1)].into_iter().collect()).get(&1).cloned().unwrap_or_default()', expected: '"A"', isHidden: false },
      { inputData: 'invert(HashMap::new()).len()', expected: '0', isHidden: true },
    ],
  },

  // -------- M9.5 ----------
  {
    title: 'Rust: Group by Length',
    orderIndex: 5,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Group by Length

Return a map where keys are word lengths and values are the number of words with that length.
`.trim(),
    starterCode: `use std::collections::HashMap;

fn group_by_length(words: Vec<String>) -> HashMap<usize, usize> {
    let mut result = HashMap::new();
    // TODO: Count occurrences of lengths
    result
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop through each word.' },
      { orderIndex: 2, content: 'The key is `word.len()`.' },
      { orderIndex: 3, content: 'Use `*result.entry(word.len()).or_insert(0) += 1;`' },
    ],
    testCases: [
      { inputData: 'group_by_length(vec!["cat".to_string(), "dog".to_string()]).get(&3).cloned().unwrap_or(0)', expected: '2', isHidden: false },
      { inputData: 'group_by_length(vec!["a".to_string()]).get(&1).cloned().unwrap_or(0)', expected: '1', isHidden: true },
    ],
  },
];

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

async function upsertProblems(moduleId: number) {
  for (const p of PROBLEMS) {
    const existing = await prisma.problem.findFirst({ where: { title: p.title } });
    if (existing) {
      console.log(`= Problem already exists: ${p.title} — skipping`);
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
      `+ Seeded ${p.title} (id=${created.id}, ${p.hints.length} hints, ${p.testCases.length} tests)`,
    );
  }
}

async function main() {
  const moduleId = await upsertModule();
  await upsertLesson(moduleId);
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
