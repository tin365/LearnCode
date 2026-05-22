/**
 * Wave — Java Module 7 "Arrays & ArrayLists"
 *
 * Adds the Java M7 lesson plus 7 problems.
 *
 * Run:  pnpm tsx prisma/seed-java-m7.ts
 *
 * Idempotent: module + lesson upserted; problems skip if title exists.
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGE = 'java';
const MODULE_ORDER_INDEX = 207; // Java Base (200) + Module 7
const MODULE = {
  title: 'Arrays & ArrayLists',
  description: 'Store collections of values and operate on them.',
  estimatedMinutes: 35,
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
  title: 'Storing Collections',
  estimatedMinutes: 15,
  concepts: ['Arrays', 'ArrayList', 'Indexing', 'Iteration'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Managing Groups',
      content: `Until now, we've mostly worked with single values. But what if you need to manage a list of 500 student names, or 10,000 game scores? Creating 10,000 variables would be impossible.

In Java, we use **collections** to store many values inside a single variable. This lets us treat a group of items as one thing, and use loops to process every item in the list with just a few lines of code.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Arrays and ArrayLists',
      content: `Java gives you two main ways to store lists:

1. **Arrays**: Fixed-size lists. Once you create an array of size 10, it stays size 10 forever. Great for when you know exactly how many items you have.
2. **ArrayList**: Dynamic lists. You can add or remove items whenever you want. This is the most popular collection in Java!

In both cases, every item in the list has an **index** (a position number). Just like in most programming languages, Java starts counting at **0**. The first item is at index 0, the second is at index 1, and so on.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'Using Arrays and ArrayLists in Java:',
      code: `// --- Arrays (Fixed Size) ---
int[] numbers = {10, 20, 30};
int first = numbers[0]; // 10
int len = numbers.length; // 3

// --- ArrayList (Dynamic Size) ---
import java.util.ArrayList;

ArrayList<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");

String s = names.get(0); // "Alice"
int size = names.size(); // 2`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Processing a List',
      content: `**Example:** Calculating the average of a list of doubles.

\`\`\`java
import java.util.ArrayList;

public class Solution {
    public static double average(double[] numbers) {
        if (numbers.length == 0) return 0.0;
        
        double total = 0;
        for (int i = 0; i < numbers.length; i++) {
            total += numbers[i];
        }
        return total / numbers.length;
    }
}
\`\`\`

We use a \`for\` loop to visit every index from \`0\` to \`length - 1\`. Inside the loop, \`numbers[i]\` lets us look at the current item.`,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Find the Minimum',
      content: `Complete the method \`findMin\` so that it takes an array of integers and returns the smallest number in the list.`,
      code: `public class Solution {
    public static int findMin(int[] numbers) {
        int min = numbers[0];
        // TODO: Loop through and update min if you find a smaller number
        return min;
    }
}
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **IndexOutOfBoundsException.** Trying to access an index that doesn't exist (like \`numbers[10]\` on a list of size 5). Remember, the last index is always \`size - 1\`.
- ❌ **Mixing up \`.length\` and \`.size()\`.** Arrays use \`.length\` (no parentheses), while ArrayLists use \`.size()\` (with parentheses).
- ❌ **Trying to use \`[]\` on an ArrayList.** To get an item from an ArrayList, you must use the \`.get(index)\` method.
- ❌ **Forgetting to import ArrayList.** If you use ArrayList, you must have \`import java.util.ArrayList;\` at the top of your file.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

// ---------------------------------------------------------------------------
// Problems
// ---------------------------------------------------------------------------

const PROBLEMS: ProblemInput[] = [
  // -------- M7.1 ----------
  {
    title: 'Java: Sum Array',
    orderIndex: 1,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Sum Array

Complete the method \`sumAll\` that takes an array of integers and returns the total sum of all items in the array.

### Example
\`\`\`java
Solution.sumAll(new int[]{1, 2, 3}) // 6
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static int sumAll(int[] numbers) {
        int sum = 0;
        // TODO: Loop and add to sum
        return sum;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a `for` loop to visit every item in the array.' },
      { orderIndex: 2, content: 'The loop should go from `0` to `numbers.length - 1`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nfor (int i = 0; i < numbers.length; i++) {\n    sum += numbers[i];\n}\nreturn sum;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.sumAll(new int[]{1, 2, 3})', expected: '6', isHidden: false },
      { inputData: 'Solution.sumAll(new int[]{10, -5, 2})', expected: '7', isHidden: true },
      { inputData: 'Solution.sumAll(new int[]{})', expected: '0', isHidden: true },
    ],
  },

  // -------- M7.2 ----------
  {
    title: 'Java: Find Largest',
    orderIndex: 2,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Find Largest

Complete the method \`findMax\` that takes an array of integers and returns the largest number in the list. Assume the array will have at least one number.

### Example
\`\`\`java
Solution.findMax(new int[]{5, 2, 9, 1}) // 9
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static int findMax(int[] numbers) {
        int max = numbers[0];
        // TODO: Find the largest value
        return max;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop through the array starting from the second item (index 1).' },
      { orderIndex: 2, content: 'If `numbers[i] > max`, update `max`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nfor (int i = 1; i < numbers.length; i++) {\n    if (numbers[i] > max) max = numbers[i];\n}\nreturn max;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.findMax(new int[]{5, 2, 9, 1})', expected: '9', isHidden: false },
      { inputData: 'Solution.findMax(new int[]{-10, -2, -5})', expected: '-2', isHidden: true },
    ],
  },

  // -------- M7.3 ----------
  {
    title: 'Java: Count Occurrences',
    orderIndex: 3,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Count Occurrences

Complete the method \`countTarget\` that takes an array of integers and a \`target\` number, and returns how many times the target appears in the array.

### Example
\`\`\`java
Solution.countTarget(new int[]{1, 2, 1, 3, 1}, 1) // 3
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static int countTarget(int[] numbers, int target) {
        int count = 0;
        // TODO: Count how many times target appears
        return count;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a loop to check every item.' },
      { orderIndex: 2, content: 'If `numbers[i] == target`, increment `count`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nfor (int i = 0; i < numbers.length; i++) {\n    if (numbers[i] == target) count++;\n}\nreturn count;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.countTarget(new int[]{1, 2, 1, 3, 1}, 1)', expected: '3', isHidden: false },
      { inputData: 'Solution.countTarget(new int[]{5, 5, 5}, 5)', expected: '3', isHidden: true },
      { inputData: 'Solution.countTarget(new int[]{1, 2, 3}, 4)', expected: '0', isHidden: true },
    ],
  },

  // -------- M7.4 ----------
  {
    title: 'Java: Reverse Array',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Reverse Array

Complete the method \`reverse\` that takes an array of integers and returns a **new array** with the items in reverse order.

### Example
\`\`\`java
Solution.reverse(new int[]{1, 2, 3}) // [3, 2, 1]
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static int[] reverse(int[] numbers) {
        int[] result = new int[numbers.length];
        // TODO: Fill result with numbers in reverse order
        return result;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'You can use a loop that goes forward through `numbers` and backward through `result`.' },
      { orderIndex: 2, content: 'The item at `numbers[i]` should go to `result[numbers.length - 1 - i]`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nfor (int i = 0; i < numbers.length; i++) {\n    result[numbers.length - 1 - i] = numbers[i];\n}\nreturn result;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.reverse(new int[]{1, 2, 3})', expected: '[3, 2, 1]', isHidden: false },
      { inputData: 'Solution.reverse(new int[]{10, 20})', expected: '[20, 10]', isHidden: true },
      { inputData: 'Solution.reverse(new int[]{1})', expected: '[1]', isHidden: true },
    ],
  },

  // -------- M7.5 ----------
  {
    title: 'Java: Average Score',
    orderIndex: 5,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Average Score

Complete the method \`calculateAverage\` that takes an array of doubles representing test scores and returns their average. If the array is empty, return 0.0.

### Example
\`\`\`java
Solution.calculateAverage(new double[]{80.0, 90.0, 100.0}) // 90.0
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static double calculateAverage(double[] scores) {
        if (scores.length == 0) return 0.0;
        double sum = 0;
        // TODO: Calculate average
        return 0.0;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'First find the sum of all scores.' },
      { orderIndex: 2, content: 'The average is the `sum / scores.length`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nfor (double s : scores) sum += s;\nreturn sum / scores.length;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.calculateAverage(new double[]{80.0, 90.0, 100.0})', expected: '90.0', isHidden: false },
      { inputData: 'Solution.calculateAverage(new double[]{70.0, 75.0})', expected: '72.5', isHidden: true },
      { inputData: 'Solution.calculateAverage(new double[]{})', expected: '0.0', isHidden: true },
    ],
  },

  // -------- M7.6 ----------
  {
    title: 'Java: Filter Positives',
    orderIndex: 6,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Filter Positives

Complete the method \`getPositives\` that takes an array of integers and returns an **ArrayList** containing only the numbers that are greater than 0.

### Tip
Since you don't know how many positive numbers there are ahead of time, an **ArrayList** is the perfect tool!

### Example
\`\`\`java
Solution.getPositives(new int[]{1, -2, 3, 0, 5}) // [1, 3, 5]
\`\`\`
`.trim(),
    starterCode: `import java.util.ArrayList;

public class Solution {
    public static ArrayList<Integer> getPositives(int[] numbers) {
        ArrayList<Integer> result = new ArrayList<>();
        // TODO: Add positive numbers to result
        return result;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Loop through the `numbers` array.' },
      { orderIndex: 2, content: 'If `n > 0`, call `result.add(n)`.' },
      { orderIndex: 3, content: 'Complete solution:\n\n```java\nfor (int n : numbers) {\n    if (n > 0) result.add(n);\n}\nreturn result;\n```' },
    ],
    testCases: [
      { inputData: 'Solution.getPositives(new int[]{1, -2, 3, 0, 5})', expected: '[1, 3, 5]', isHidden: false },
      { inputData: 'Solution.getPositives(new int[]{-1, -5})', expected: '[]', isHidden: true },
      { inputData: 'Solution.getPositives(new int[]{10, 20})', expected: '[10, 20]', isHidden: true },
    ],
  },

  // -------- M7.7 ----------
  {
    title: 'Java: Find Index',
    orderIndex: 7,
    difficulty: Difficulty.easy,
    type: ProblemType.STANDARD,
    description: `
## Find Index

Complete the method \`indexOf\` that takes an array of Strings and a target String, and returns the index of the **first** occurrence of that target. If it's not found, return \`-1\`.

### Tip
Use **\`.equals()\`** for string comparison!

### Example
\`\`\`java
Solution.indexOf(new String[]{"a", "b", "c"}, "b") // 1
\`\`\`
`.trim(),
    starterCode: `public class Solution {
    public static int indexOf(String[] list, String target) {
        // TODO: Find the first index of target
        return -1;
    }
}
`,
    hints: [
      { orderIndex: 1, content: 'Use a `for` loop that uses an index variable `i`.' },
      { orderIndex: 2, content: 'Check `if (list[i].equals(target))`.' },
      { orderIndex: 3, content: 'If found, return `i` immediately. If the loop finishes, return `-1`.' },
    ],
    testCases: [
      { inputData: 'Solution.indexOf(new String[]{"apple", "banana", "cherry"}, "banana")', expected: '1', isHidden: false },
      { inputData: 'Solution.indexOf(new String[]{"x", "y", "z"}, "w")', expected: '-1', isHidden: true },
      { inputData: 'Solution.indexOf(new String[]{"same", "same"}, "same")', expected: '0', isHidden: true },
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
