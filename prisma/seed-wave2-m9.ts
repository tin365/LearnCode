/**
 * Wave 2 — Module 9 "Dictionaries & Tuples"
 *
 * Adds the M9 lesson plus 5 new problems (9.1 – 9.5).
 *
 * Test-runner note:
 *   formatPythonValue in testRunner.ts doesn't stringify dict-shaped values
 *   meaningfully (falls through to "[object Object]"). So every problem
 *   that returns a dict is tested via specific key access, len(), or a
 *   list derived from the dict — never the bare dict itself.
 *
 * Run:  pnpm tsx prisma/seed-wave2-m9.ts
 */
import { Difficulty, PrismaClient, ProblemType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

interface SectionInput {
  orderIndex: number;
  type: SectionType;
  title: string | null;
  content: string;
  code: string | null;
}

const LESSON = {
  moduleOrderIndex: 9,
  title: 'Dictionaries & Tuples',
  estimatedMinutes: 16,
  concepts: ['dict', 'key-value', '.keys/.values/.items', 'tuple', 'choosing the right structure'],
  sections: [
    {
      orderIndex: 1,
      type: SectionType.why_you_need_this,
      title: 'Looking Things Up by Name',
      content: `Lists let you store many values, but to find a specific one you have to remember its position. That's fine for an ordered sequence — first place, second place — but useless for things like:

- "What's Alice's phone number?"
- "How many times did the word 'python' appear?"
- "What's the capital of France?"

For lookups like these you want **dictionaries** — a structure that maps a **key** (the name you'll search by) to a **value** (the thing you want back). Tuples are dictionaries' close cousin: they bundle a few related values together as a unit, and unlike lists, once made they can't be changed.`,
      code: null,
    },
    {
      orderIndex: 2,
      type: SectionType.the_basics,
      title: 'Dictionaries and Tuples',
      content: `**Dictionaries** are written with curly braces and \`key: value\` pairs separated by commas. You look up a value with square brackets, the same syntax as lists — except the index is the *key*, not a position.

\`\`\`python
phones = {"Alice": "555-1234", "Bob": "555-5678"}
print(phones["Alice"])     # 555-1234
\`\`\`

You can add a new pair or update an existing one with assignment, check whether a key exists with \`in\`, and iterate keys, values, or both with \`.keys()\`, \`.values()\`, and \`.items()\`.

**Tuples** are written with parentheses (or just commas) and **cannot be changed** after creation. They're perfect for small fixed groups — coordinates, RGB colors, or any "here are exactly N related things" situation:

\`\`\`python
point = (3, 5)
x, y  = point             # unpack
\`\`\`

**Choosing the right structure:** if order matters and the items are uniform, use a list. If you want lookups by name, use a dict. If you have a fixed-size bundle that shouldn't be mutated, use a tuple.`,
      code: null,
    },
    {
      orderIndex: 3,
      type: SectionType.syntax_reference,
      title: null,
      content: 'The moves you will reach for constantly:',
      code: `# Dict literal
person = {"name": "Alice", "age": 30, "city": "Tokyo"}

# Lookup
person["name"]            # 'Alice'

# Add / update
person["email"] = "alice@example.com"

# Membership
"name" in person          # True
"phone" in person         # False

# Iterating
for k in person:               # iterates keys by default
    print(k)
for v in person.values():
    print(v)
for k, v in person.items():
    print(k, "=", v)

# Tuple
point = (3, 5)
x, y  = point             # unpacking
point[0]                  # 3 — but point[0] = 9 raises TypeError`,
    },
    {
      orderIndex: 4,
      type: SectionType.worked_example,
      title: 'Counting and Looking Up',
      content: `**Example 1:** count how often each word appears in a sentence. The classic dictionary-counting pattern.

\`\`\`python
sentence = "the cat sat on the mat"
counts   = {}
for word in sentence.split():
    counts[word] = counts.get(word, 0) + 1
print(counts)
# {'the': 2, 'cat': 1, 'sat': 1, 'on': 1, 'mat': 1}
\`\`\`

\`counts.get(word, 0)\` returns the current count for \`word\`, or \`0\` if the word hasn't been seen yet. That avoids a \`KeyError\` on the first occurrence.

**Example 2:** safely look up a phone number, returning a friendly fallback when the name isn't there.

\`\`\`python
phones = {"Alice": "555-1234", "Bob": "555-5678"}

def find_phone(name):
    return phones.get(name, "Not found")

print(find_phone("Alice"))    # 555-1234
print(find_phone("Carol"))    # Not found
\`\`\``,
      code: null,
    },
    {
      orderIndex: 5,
      type: SectionType.try_it_yourself,
      title: 'Your Turn: Count a Letter',
      content: `Use a dictionary to count how many times each letter appears in \`word\`. Print just the count of the letter \`'l'\`.`,
      code: `word = "hello"

counts = {}
# Loop over each character in word and update counts:

print(counts.get("l", 0))   # expected: 2
`,
    },
    {
      orderIndex: 6,
      type: SectionType.common_mistakes,
      title: 'Common Mistakes',
      content: `- ❌ **\`KeyError\` from missing keys.** \`d["x"]\` raises \`KeyError\` if \`"x"\` isn't there. Use \`d.get("x")\` (returns \`None\`) or \`d.get("x", default)\` for a safe fallback.
- ❌ **Trying to modify a tuple.** Tuples are immutable — \`point[0] = 9\` is a \`TypeError\`. Build a new tuple if you need to change something.
- ❌ **Using a mutable thing (like a list) as a dict key.** Keys must be hashable. Strings, numbers, and tuples work — lists and dicts don't.
- ❌ **Assuming dictionaries are ordered by anything meaningful.** Modern Python preserves insertion order, but iterating doesn't give you sorted-by-value or sorted-by-key automatically. Use \`sorted(d.items())\` when you need a specific order.`,
      code: null,
    },
  ] satisfies SectionInput[],
};

interface HintInput {
  orderIndex: number;
  content: string;
}

interface TestCaseInput {
  inputData: string;
  expected: string;
  isHidden: boolean;
}

interface ProblemInput {
  title: string;
  orderIndex: number;
  difficulty: Difficulty;
  type: ProblemType;
  description: string;
  starterCode: string;
  hints: HintInput[];
  testCases: TestCaseInput[];
}

const PROBLEMS: ProblemInput[] = [
  // -------- M9.1 ----------
  {
    title: 'Make Contact Book',
    orderIndex: 1,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Make Contact Book

You have two lists of equal length — \`names\` and \`phones\` — where \`phones[i]\` is the phone number for \`names[i]\`.

Write a function called \`make_contact_book\` that returns a **dictionary** mapping each name to its corresponding phone number.

### Example

\`\`\`python
make_contact_book(["Alice", "Bob"], ["555-1234", "555-5678"])
# → {"Alice": "555-1234", "Bob": "555-5678"}
\`\`\`

Then \`book["Alice"]\` returns \`"555-1234"\`.

> **Tip:** Loop through the names with their position using \`enumerate\`, OR pair them up with \`zip\` and pass the result to \`dict(...)\`.
    `.trim(),
    starterCode: `def make_contact_book(names, phones):
    # Build and return a dict that maps each name to its phone number.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Start with an empty dict (\`{}\`) and loop. For each position \`i\`, assign \`result[names[i]] = phones[i]\`.`,
      },
      {
        orderIndex: 2,
        content: `Sketch:

\`\`\`python
result = {}
for i in range(len(names)):
    result[names[i]] = phones[i]
return result
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `One-line Pythonic version:

\`\`\`python
def make_contact_book(names, phones):
    return dict(zip(names, phones))
\`\`\`

\`zip\` pairs the two lists element-by-element, and \`dict(...)\` turns those pairs into a dictionary.`,
      },
    ],
    testCases: [
      {
        inputData: `make_contact_book(["Alice"], ["111"])["Alice"]`,
        expected: `111`,
        isHidden: false,
      },
      {
        inputData: `make_contact_book(["A", "B"], ["1", "2"])["B"]`,
        expected: `2`,
        isHidden: true,
      },
      {
        inputData: `len(make_contact_book(["A", "B", "C"], ["1", "2", "3"]))`,
        expected: `3`,
        isHidden: true,
      },
      { inputData: `len(make_contact_book([], []))`, expected: `0`, isHidden: true },
      {
        inputData: `"Alice" in make_contact_book(["Alice"], ["111"])`,
        expected: `True`,
        isHidden: true,
      },
    ],
  },

  // -------- M9.2 ----------
  {
    title: 'Letter Frequency',
    orderIndex: 2,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Letter Frequency

Write a function called \`count_letters\` that takes a string \`s\` and returns a **dictionary** mapping each character in \`s\` to the number of times it appears.

### Example

\`\`\`python
count_letters("hello")
# → {"h": 1, "e": 1, "l": 2, "o": 1}

count_letters("aaa")
# → {"a": 3}
\`\`\`

> **Tip:** Loop over the characters in \`s\` (a string is iterable). For each character, increment its count in the dictionary. \`counts.get(ch, 0) + 1\` gives you the current count or \`0\` if you haven't seen \`ch\` before — perfect for incrementing.
    `.trim(),
    starterCode: `def count_letters(s):
    # Return a dict mapping each character in s to its count.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Initialise an empty dict. Loop over each character of \`s\`. For each character, set its count to "current count plus one" — the current count might not exist yet.`,
      },
      {
        orderIndex: 2,
        content: `Use \`.get(key, default)\` to avoid \`KeyError\` on the first occurrence of a character:

\`\`\`python
counts[ch] = counts.get(ch, 0) + 1
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body:

\`\`\`python
def count_letters(s):
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
    return counts
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `count_letters("hello")["l"]`, expected: `2`, isHidden: false },
      { inputData: `count_letters("hello")["h"]`, expected: `1`, isHidden: true },
      { inputData: `len(count_letters("hello"))`, expected: `4`, isHidden: true },
      { inputData: `count_letters("aaa")["a"]`, expected: `3`, isHidden: true },
      { inputData: `len(count_letters(""))`, expected: `0`, isHidden: true },
      { inputData: `count_letters("aabbcc")["b"]`, expected: `2`, isHidden: true },
    ],
  },

  // -------- M9.3 ----------
  {
    title: 'Most Common Item',
    orderIndex: 3,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Most Common Item

Write a function called \`most_common\` that takes a non-empty list \`items\` and returns the single item that appears the most times.

If two items tie for most common, return either one — tests will accept any winner.

### Examples

\`\`\`python
most_common([1, 2, 2, 3])              # → 2
most_common(["a", "b", "a", "c", "a"]) # → "a"
most_common([5, 5, 5])                 # → 5
most_common([7])                       # → 7
\`\`\`

> **Tip:** Build a count dictionary first (the same pattern as letter counting). Then find the key with the largest count — either with a loop or with \`max(counts, key=counts.get)\`.
    `.trim(),
    starterCode: `def most_common(items):
    # Count occurrences, then return the item with the highest count.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Two steps: (1) count how many times each item appears, (2) find which key has the largest count.`,
      },
      {
        orderIndex: 2,
        content: `Counting step is the same pattern as letter counting:

\`\`\`python
counts = {}
for x in items:
    counts[x] = counts.get(x, 0) + 1
\`\`\`

Then walk through \`counts.items()\` to find the largest, or use \`max(counts, key=counts.get)\`.`,
      },
      {
        orderIndex: 3,
        content: `Full body — using \`max\` with a key function:

\`\`\`python
def most_common(items):
    counts = {}
    for x in items:
        counts[x] = counts.get(x, 0) + 1
    return max(counts, key=counts.get)
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `most_common([1, 2, 2, 3])`, expected: `2`, isHidden: false },
      { inputData: `most_common(["a", "b", "a", "c", "a"])`, expected: `a`, isHidden: true },
      { inputData: `most_common([5, 5, 5])`, expected: `5`, isHidden: true },
      { inputData: `most_common([7])`, expected: `7`, isHidden: true },
      {
        inputData: `most_common([1, 1, 2, 2, 2, 3, 3, 3, 3])`,
        expected: `3`,
        isHidden: true,
      },
    ],
  },

  // -------- M9.4 ----------
  {
    title: 'Invert a Dictionary',
    orderIndex: 4,
    difficulty: Difficulty.medium,
    type: ProblemType.STANDARD,
    description: `
## Invert a Dictionary

Write a function called \`invert\` that takes a dictionary \`d\` and returns a **new** dictionary where every key becomes a value and every value becomes a key.

You can assume the values in \`d\` are all unique and hashable, so the inverted dict has no collisions.

### Example

\`\`\`python
invert({"a": 1, "b": 2})
# → {1: "a", 2: "b"}

result = invert({"name": "Alice", "city": "Tokyo"})
result["Alice"]   # → "name"
\`\`\`

> **Tip:** Two clean options — a \`for\` loop over \`d.items()\`, or a dict comprehension like \`{v: k for k, v in d.items()}\`.
    `.trim(),
    starterCode: `def invert(d):
    # Return a new dict with keys and values swapped.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Iterate \`d.items()\` to get each key/value pair, and add them to a new dictionary in the opposite direction.`,
      },
      {
        orderIndex: 2,
        content: `Loop sketch:

\`\`\`python
result = {}
for k, v in d.items():
    result[v] = k
return result
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Full body — dict comprehension version:

\`\`\`python
def invert(d):
    return {v: k for k, v in d.items()}
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `invert({"a": 1, "b": 2})[1]`, expected: `a`, isHidden: false },
      { inputData: `invert({"a": 1, "b": 2})[2]`, expected: `b`, isHidden: true },
      { inputData: `len(invert({"a": 1, "b": 2}))`, expected: `2`, isHidden: true },
      { inputData: `invert({"x": 99})[99]`, expected: `x`, isHidden: true },
      { inputData: `len(invert({}))`, expected: `0`, isHidden: true },
    ],
  },

  // -------- M9.5 (hard) ----------
  {
    title: 'Group Words by First Letter',
    orderIndex: 5,
    difficulty: Difficulty.hard,
    type: ProblemType.STANDARD,
    description: `
## Group Words by First Letter

Write a function called \`group_by_first\` that takes a list \`words\` and returns a dictionary mapping each **first letter** to a list of the words starting with that letter, in the order they appeared in the input.

### Example

\`\`\`python
group_by_first(["apple", "ant", "bat", "berry", "cat"])
# → {"a": ["apple", "ant"], "b": ["bat", "berry"], "c": ["cat"]}
\`\`\`

You can assume every word has at least one character.

> **Tip:** The pattern is "check if the key exists; if not, create an empty list for it; then append". The standard shortcut is \`d.setdefault(key, []).append(value)\` — it does the check + create in one call.
    `.trim(),
    starterCode: `def group_by_first(words):
    # Group words by their first letter into a dict of lists.
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `For each word, the first letter is \`word[0]\`. The value in the dict is a *list* of words. The first time you see a new first letter, you need to create the list before you can append to it.`,
      },
      {
        orderIndex: 2,
        content: `Body sketch with explicit "if first time":

\`\`\`python
result = {}
for word in words:
    first = word[0]
    if first not in result:
        result[first] = []
    result[first].append(word)
return result
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `One-line trick with \`setdefault\`:

\`\`\`python
def group_by_first(words):
    result = {}
    for word in words:
        result.setdefault(word[0], []).append(word)
    return result
\`\`\``,
      },
    ],
    testCases: [
      {
        inputData: `group_by_first(["apple", "ant", "bat"])["a"]`,
        expected: `['apple','ant']`,
        isHidden: false,
      },
      {
        inputData: `group_by_first(["apple", "ant", "bat"])["b"]`,
        expected: `['bat']`,
        isHidden: true,
      },
      {
        inputData: `len(group_by_first(["apple", "ant", "bat", "berry", "cat"]))`,
        expected: `3`,
        isHidden: true,
      },
      {
        inputData: `len(group_by_first(["apple", "ant", "bat", "berry", "cat"])["b"])`,
        expected: `2`,
        isHidden: true,
      },
      { inputData: `len(group_by_first([]))`, expected: `0`, isHidden: true },
      {
        inputData: `group_by_first(["one"])["o"]`,
        expected: `['one']`,
        isHidden: true,
      },
    ],
  },
];

async function upsertLesson() {
  const mod = await prisma.module.findUnique({
    where: { orderIndex: LESSON.moduleOrderIndex },
  });
  if (!mod) throw new Error(`Module M${LESSON.moduleOrderIndex} not found`);

  const existing = await prisma.lesson.findUnique({ where: { moduleId: mod.id } });
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
    console.log(`↻ Updated M${LESSON.moduleOrderIndex} lesson: ${LESSON.title}`);
  } else {
    await prisma.lesson.create({
      data: {
        moduleId: mod.id,
        title: LESSON.title,
        estimatedMinutes: LESSON.estimatedMinutes,
        concepts: LESSON.concepts,
        sections: { create: LESSON.sections },
      },
    });
    console.log(`+ Seeded M${LESSON.moduleOrderIndex} lesson: ${LESSON.title}`);
  }
  return mod.id;
}

async function upsertProblems(moduleId: number) {
  for (const p of PROBLEMS) {
    const existing = await prisma.problem.findFirst({ where: { title: p.title } });
    if (existing) {
      console.log(`= Problem already exists: ${p.title} (id=${existing.id}) — skipping`);
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
      `+ Seeded M9.${p.orderIndex} ${p.title} (id=${created.id}, ${p.hints.length} hints, ${p.testCases.length} test cases)`,
    );
  }
}

async function main() {
  const moduleId = await upsertLesson();
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
