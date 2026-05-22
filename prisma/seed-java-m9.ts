/**
 * Wave — Java Module 9 "Maps (Dictionaries)"
 *
 * Adds the Java M9 lesson plus 5 problems.
 *
 * Run:  pnpm tsx prisma/seed-java-m9.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'java';
const MODULE_ORDER_INDEX = 209; // Java Base (200) + Module 9
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
  title: 'Key-Value Pairs',
  estimatedMinutes: 15,
  concepts: ['HashMap', 'put', 'get', 'containsKey', 'keySet'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Looking Things Up',
      content: `In an array, you find items by their position (index 0, 1, 2...). But often, it's more useful to find items by a **name** or a **key**.

Imagine a real-world dictionary: you don't look for the 500th word; you look for the word "Java" to find its definition. In programming, we use a **Map** (specifically a \`HashMap\` in Java) to store these pairs of keys and values. This is how contact lists, settings menus, and product catalogs are built.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'The HashMap',
      content: `A **HashMap** is a collection that stores data in pairs: a **Key** and a **Value**.

- **Key**: The unique identifier you use to look something up (like a name).
- **Value**: The data associated with that key (like a phone number).

When you put a pair into the map, Java remembers it. Later, you can provide the key and Java will give you the value back instantly — even if there are millions of items in the map!`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Using HashMap in Java:',
      code: `import java.util.HashMap;

// Create a map (Key: String, Value: Integer)
HashMap<String, Integer> scores = new HashMap<>();

// Add data
scores.put("Alice", 95);
scores.put("Bob", 82);

// Retrieve data
int s = scores.get("Alice"); // 95

// Check if a key exists
boolean hasBob = scores.containsKey("Bob"); // true

// Remove data
scores.remove("Bob");

// Get all keys
for (String name : scores.keySet()) {
    System.out.println(name);
}`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'A Simple Phonebook',
      content: `**Example:** Building a phonebook where we store names and numbers, then look up a specific person's number.

\`\`\`java
import java.util.HashMap;

public class Solution {
    public static String getPhoneNumber(String name) {
        HashMap<String, String> phonebook = new HashMap<>();
        phonebook.put("Alice", "555-0101");
        phonebook.put("Bob", "555-0202");
        
        if (phonebook.containsKey(name)) {
            return phonebook.get(name);
        } else {
            return "Not found";
        }
    }
}
\`\`\`

If we call this with \`"Alice"\`, we get \`"555-0101"\`. If we call it with \`"Charlie"\`, we get \`"Not found"\`.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Fruit Counter',
      content: `Complete the method \`getQuantity\` so that it creates a map of fruit names to their quantities, and returns the quantity for the given fruit. Add "apple": 5 and "banana": 10.`,
      code: `import java.util.HashMap;

public class Solution {
    public static int getQuantity(String fruit) {
        HashMap<String, Integer> inventory = new HashMap<>();
        // TODO: Add apple and banana to inventory
        // TODO: Return the quantity for the given fruit (return 0 if not found)
        return 0;
    }
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **Keys must be unique.** If you call \`put("Alice", 10)\` and then \`put("Alice", 20)\`, the first value (10) is overwritten and lost.
- ❌ **NullPointerException.** If you call \`.get("Key")\` for a key that doesn't exist, it returns \`null\`. If you try to use that \`null\` as a number, your program will crash. Always check \`containsKey()\` first!
- ❌ **Forgetting Imports.** Always include \`import java.util.HashMap;\` at the top of your file.
- ❌ **Using Primitives.** You can't use \`int\` or \`double\` in the angle brackets \`< >\`. You must use the "wrapper classes" like \`Integer\`, \`Double\`, or \`Boolean\`.`,
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
    title: 'Java: Contact Book',
    orderIndex: 1,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Contact Book

Complete the method \`findNumber\` that takes a HashMap of names to phone numbers (both Strings) and a \`targetName\`. 

Return the phone number if it exists, or \`"Missing"\` if it doesn't.
`.trim(),
    starterCode: `import java.util.HashMap;

public class Solution {
    public static String findNumber(HashMap<String, String> contacts, String targetName) {
        // TODO: Look up targetName in contacts
        return "";
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use `contacts.containsKey(targetName)` to check if they are in the book.' },
      { orderIndex: 2, content: 'Use `contacts.get(targetName)` to retrieve the number.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nif (contacts.containsKey(targetName)) {\n    return contacts.get(targetName);\n} else {\n    return "Missing";\n}\n```' },
    ],
    testCases: [
      { inputData: 'Solution.findNumber(new HashMap<String, String>() {{ put("Alice", "123"); put("Bob", "456"); }}, "Alice")', expected: '123', isHidden: false },
      { inputData: 'Solution.findNumber(new HashMap<String, String>() {{ put("Alice", "123"); }}, "Charlie")', expected: 'Missing', isHidden: true },
    ],
  },

  // -------- M9.2 ----------
  {
    title: 'Java: Letter Frequency',
    orderIndex: 2,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Letter Frequency

Complete the method \`countLetters\` that takes a string and returns a HashMap where the keys are characters and the values are the number of times that character appeared in the string.

### Example
\`\`\`java
Solution.countLetters("apple") // {a=1, p=2, l=1, e=1}
\`\`\`
`.trim(),
    starterCode: `import java.util.HashMap;

public class Solution {
    public static HashMap<Character, Integer> countLetters(String s) {
        HashMap<Character, Integer> counts = new HashMap<>();
        // TODO: Loop through the string and update the map
        return counts;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop through the string using `s.charAt(i)`.' },
      { orderIndex: 2, content: 'For each character `c`, check if it\'s already in the map. If yes, increment its value. If no, put it in with a value of 1.' },
      { orderIndex: 3, content: 'Try: `counts.put(c, counts.getOrDefault(c, 0) + 1);`' },
    ],
    testCases: [
      { inputData: 'Solution.countLetters("apple").toString()', expected: '{a=1, p=2, l=1, e=1}', isHidden: false },
      { inputData: 'Solution.countLetters("aaa").get(\'a\')', expected: '3', isHidden: true },
    ],
  },

  // -------- M9.3 ----------
  {
    title: 'Java: Most Common',
    orderIndex: 3,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Most Common Item

Complete the method \`getMostCommon\` that takes an array of Strings and returns the String that appears the most often. If there's a tie, any of the top ones is fine.

### Tip
First build a frequency map (like the previous problem), then loop through that map to find the key with the highest value.
`.trim(),
    starterCode: `import java.util.HashMap;

public class Solution {
    public static String getMostCommon(String[] items) {
        HashMap<String, Integer> counts = new HashMap<>();
        // TODO: 1. Count items
        // TODO: 2. Find key with max value
        return "";
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a loop to fill a `HashMap<String, Integer>` with counts.' },
      { orderIndex: 2, content: 'Use a second loop over `counts.keySet()` to find the word with the highest number.' },
      { orderIndex: 3, content: 'Keep track of `String winner` and `int maxCount` as you loop.' },
    ],
    testCases: [
      { inputData: 'Solution.getMostCommon(new String[]{"a", "b", "a", "c", "a"})', expected: 'a', isHidden: false },
      { inputData: 'Solution.getMostCommon(new String[]{"apple", "banana", "banana"})', expected: 'banana', isHidden: true },
    ],
  },

  // -------- M9.4 ----------
  {
    title: 'Java: Invert Map',
    orderIndex: 4,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Invert Map

Complete the method \`invert\` that takes a HashMap (String keys, Integer values) and returns a **new** HashMap where the values become the keys and the keys become the values.

Assume all values in the original map are unique!

### Example
Original: \`{"Alice": 101, "Bob": 202}\`
Inverted: \`{101: "Alice", 202: "Bob"}\`
`.trim(),
    starterCode: `import java.util.HashMap;

public class Solution {
    public static HashMap<Integer, String> invert(HashMap<String, Integer> original) {
        HashMap<Integer, String> inverted = new HashMap<>();
        // TODO: Swap keys and values
        return inverted;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop through the original keys using `original.keySet()`.' },
      { orderIndex: 2, content: 'For each key `k`, get its value `v = original.get(k)`.' },
      { orderIndex: 3, content: 'Put the swap into the new map: `inverted.put(v, k)`.' },
    ],
    testCases: [
      { inputData: 'Solution.invert(new HashMap<String, Integer>() {{ put("A", 1); put("B", 2); }}).get(1)', expected: 'A', isHidden: false },
      { inputData: 'Solution.invert(new HashMap<String, Integer>() {{ put("X", 500); }}).size()', expected: '1', isHidden: true },
    ],
  },

  // -------- M9.5 ----------
  {
    title: 'Java: Group by Length',
    orderIndex: 5,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Group by Length

Complete the method \`groupByLength\` that takes an array of Strings and returns a HashMap where the keys are **lengths** (Integers) and the values are the **count** of words that have that length.

### Example
Input: \`{"a", "bb", "ccc", "dd"}\`
Output: \`{1=1, 2=2, 3=1}\` (1 word of length 1, 2 words of length 2, 1 word of length 3)
`.trim(),
    starterCode: `import java.util.HashMap;

public class Solution {
    public static HashMap<Integer, Integer> groupByLength(String[] words) {
        HashMap<Integer, Integer> result = new HashMap<>();
        // TODO: Count occurrences of each word length
        return result;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop through each `word` in `words`.' },
      { orderIndex: 2, content: 'Calculate `int len = word.length()`.' },
      { orderIndex: 3, content: 'Update the map using `len` as the key: `result.put(len, result.getOrDefault(len, 0) + 1)`.' },
    ],
    testCases: [
      { inputData: 'Solution.groupByLength(new String[]{"cat", "dog", "apple", "a"}).toString()', expected: '{1=1, 3=2, 5=1}', isHidden: false },
      { inputData: 'Solution.groupByLength(new String[]{"hi", "hi"}).get(2)', expected: '2', isHidden: true },
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
