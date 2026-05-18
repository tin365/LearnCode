/**
 * Wave 1 lesson content for the 5 modules that already have existing problems:
 * M5 (Making Decisions), M6 (Loops), M7 (Lists), M8 (String Operations),
 * M10 (Functions — Going Deeper).
 *
 * Run:  pnpm tsx prisma/seed-lessons-wave1.ts
 *
 * Upsert behavior: if a lesson already exists for the module, its sections
 * are wiped and rewritten so re-running this seed updates content in place.
 */
import { PrismaClient, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

interface SectionInput {
  orderIndex: number;
  type: SectionType;
  title: string | null;
  content: string;
  code: string | null;
}

interface LessonInput {
  moduleOrderIndex: number;
  title: string;
  estimatedMinutes: number;
  concepts: string[];
  sections: SectionInput[];
}

const LESSONS: LessonInput[] = [
  // ---------------------------------------------------------------------------
  // M5 — Making Decisions
  // ---------------------------------------------------------------------------
  {
    moduleOrderIndex: 5,
    title: 'Making Decisions with if/else',
    estimatedMinutes: 12,
    concepts: ['if statements', 'elif/else', 'comparison operators', 'boolean logic'],
    sections: [
      {
        orderIndex: 1,
        type: SectionType.why_you_need_this,
        title: 'Why Branch Your Code?',
        content: `Up to now your programs ran one line after another, no matter what. But real programs need to **react** to what's happening:

- Is the password right? Let the user in.
- Is the cart empty? Show a different message at checkout.
- Is the user under 13? Don't let them sign up.

Every "if X then Y" decision in your head becomes an \`if\` statement in code. Once you've got this, you can write programs that handle situations instead of running blindly.`,
        code: null,
      },
      {
        orderIndex: 2,
        type: SectionType.the_basics,
        title: 'If, Else, and Elif',
        content: `An \`if\` statement runs a block of code **only when a condition is true**.

A condition is anything Python can evaluate to \`True\` or \`False\` — like \`age >= 18\` or \`name == "Alice"\`. If the condition is true, Python runs the indented block underneath. If it's false, Python skips it.

You can pair \`if\` with **\`else\`** to handle the "otherwise" case, and chain more checks with **\`elif\`** ("else if"). Python checks each branch in order from top to bottom, runs the first one whose condition is true, and skips the rest.`,
        code: null,
      },
      {
        orderIndex: 3,
        type: SectionType.syntax_reference,
        title: null,
        content: 'The general shape, plus the six comparison operators you can use in conditions:',
        code: `if condition:
    # runs when condition is True
elif other_condition:
    # runs when the first was False and this is True
else:
    # runs when nothing above matched

# Comparison operators
x == y    # equal
x != y    # not equal
x  > y    # greater than
x  < y    # less than
x >= y    # greater than or equal
x <= y    # less than or equal`,
      },
      {
        orderIndex: 4,
        type: SectionType.worked_example,
        title: 'Age Check and Letter Grades',
        content: `**Example 1:** decide whether someone can vote.

Notice the indentation — Python uses 4 spaces to mark what's *inside* the \`if\` block.

\`\`\`python
age = 17

if age >= 18:
    print("You can vote.")
else:
    print("Too young to vote — come back in", 18 - age, "years.")
\`\`\`

**Example 2:** turn a number score into a letter grade. With more than two branches, use \`elif\` so each case is checked in order.

\`\`\`python
score = 78

if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
elif score >= 60:
    print("D")
else:
    print("F")
\`\`\`

Once \`score >= 70\` matches, Python prints \`"C"\` and **skips the rest**.`,
        code: null,
      },
      {
        orderIndex: 5,
        type: SectionType.try_it_yourself,
        title: 'Your Turn: Positive or Negative?',
        content: `Finish the program so it prints \`"positive"\`, \`"negative"\`, or \`"zero"\` based on the value of \`number\`. Run it with different values of \`number\` to test all three branches.`,
        code: `number = 7

# Add your if / elif / else here:
`,
      },
      {
        orderIndex: 6,
        type: SectionType.common_mistakes,
        title: 'Common Mistakes',
        content: `- ❌ **Using \`=\` instead of \`==\` inside a condition.** \`=\` *assigns*, \`==\` *compares*. \`if name = "Alice":\` is a syntax error — use \`if name == "Alice":\`.
- ❌ **Forgetting the colon at the end of the if line.** \`if x > 0\` is not valid Python — it must be \`if x > 0:\`.
- ❌ **Inconsistent indentation.** Every line inside an \`if\` block must be indented the same amount (4 spaces is the convention). Mixing tabs and spaces causes hard-to-spot errors.
- ❌ **Using \`elif\` when you really wanted multiple separate \`if\`s.** With \`elif\`, only one branch ever runs. If you have two independent checks, write two separate \`if\` statements.`,
        code: null,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // M6 — Loops
  // ---------------------------------------------------------------------------
  {
    moduleOrderIndex: 6,
    title: 'Loops: Doing Things Over and Over',
    estimatedMinutes: 14,
    concepts: ['for loop', 'while loop', 'range', 'break', 'continue'],
    sections: [
      {
        orderIndex: 1,
        type: SectionType.why_you_need_this,
        title: 'Stop Repeating Yourself',
        content: `Imagine printing \`"Hello"\` ten times. You could write \`print("Hello")\` ten times — but what about a hundred? A million? At some point typing it out is impossible.

Loops let you say "do this **once for each thing** in a list" or "keep doing this **while a condition is true**." That's how programs process every row in a spreadsheet, every player in a game, every email in your inbox.`,
        code: null,
      },
      {
        orderIndex: 2,
        type: SectionType.the_basics,
        title: 'Two Kinds of Loops',
        content: `Python has two main loop types:

- **\`for\` loop** — runs once *for each item* in a sequence (a list, a string, a range of numbers). You use \`for\` when you know how many things you want to go through.
- **\`while\` loop** — keeps running *while a condition stays True*. You use \`while\` when you don't know in advance how many times you'll loop — like "keep asking until they type 'quit'."

Inside either loop, two keywords give you finer control: **\`break\`** exits the loop immediately, and **\`continue\`** skips ahead to the next iteration.`,
        code: null,
      },
      {
        orderIndex: 3,
        type: SectionType.syntax_reference,
        title: null,
        content: 'The two loop shapes plus the helpers you reach for most often:',
        code: `# for loop over a range of numbers
for i in range(5):       # i takes values 0, 1, 2, 3, 4
    print(i)

# for loop over a list
for name in ["Anna", "Ben"]:
    print(name)

# while loop
count = 0
while count < 3:
    print(count)
    count = count + 1

# break and continue
for i in range(10):
    if i == 5:
        break        # stop the loop entirely
    if i % 2 == 0:
        continue     # skip ahead to next iteration
    print(i)`,
      },
      {
        orderIndex: 4,
        type: SectionType.worked_example,
        title: 'Counting, Summing, and Waiting for Input',
        content: `**Example 1:** print numbers 1 through 10. Note that \`range(1, 11)\` goes from 1 *up to but not including* 11.

\`\`\`python
for i in range(1, 11):
    print(i)
\`\`\`

**Example 2:** add up every number in a list. We start with \`total = 0\` and add each value as we go.

\`\`\`python
prices = [4.50, 12.00, 3.25]
total = 0
for price in prices:
    total = total + price
print("Total:", total)
\`\`\`

**Example 3:** a \`while\` loop that exits as soon as we see the magic word.

\`\`\`python
answer = ""
while answer != "quit":
    answer = input("Type something (or 'quit'): ")
    print("You typed:", answer)
\`\`\``,
        code: null,
      },
      {
        orderIndex: 5,
        type: SectionType.try_it_yourself,
        title: 'Your Turn: Print 1 to 5',
        content: `Write a \`for\` loop that prints each number from 1 through 5 (inclusive) on its own line. Remember that \`range(1, 6)\` gives you \`1, 2, 3, 4, 5\`.`,
        code: `# Write your loop below.
# Expected output:
# 1
# 2
# 3
# 4
# 5
`,
      },
      {
        orderIndex: 6,
        type: SectionType.common_mistakes,
        title: 'Common Mistakes',
        content: `- ❌ **Off-by-one with \`range\`.** \`range(10)\` produces \`0\` through \`9\`, not \`1\` through \`10\`. To loop from 1 to 10 inclusive, use \`range(1, 11)\`.
- ❌ **Infinite \`while\` loop.** If the condition never becomes false, the loop never stops. Always change something inside the loop that moves toward exiting.
- ❌ **Modifying a list while iterating over it.** Adding or removing items inside the loop can make Python skip items or repeat them. Build a *new* list instead, or iterate over a copy with \`for x in items[:]:\`.
- ❌ **Confusing \`break\` with \`continue\`.** \`break\` leaves the loop entirely. \`continue\` skips just the current iteration and keeps looping.`,
        code: null,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // M7 — Lists
  // ---------------------------------------------------------------------------
  {
    moduleOrderIndex: 7,
    title: 'Lists: Storing Many Values',
    estimatedMinutes: 14,
    concepts: ['lists', 'indexing', 'append', 'slicing', 'iteration'],
    sections: [
      {
        orderIndex: 1,
        type: SectionType.why_you_need_this,
        title: 'One Variable for Many Things',
        content: `So far each variable has held a single value — one name, one number, one score. But the real world is full of *collections*: a shopping list, the people in a group chat, the scores of every player. Trying to use a separate variable for each (\`name1\`, \`name2\`, \`name3\`, …) gets unmanageable fast.

A **list** is a single variable that holds many values, in order. Once you have a list, you can loop over it, search it, change it, sort it — all without naming each item individually.`,
        code: null,
      },
      {
        orderIndex: 2,
        type: SectionType.the_basics,
        title: 'What a List Looks Like',
        content: `A list is an **ordered collection** written with square brackets, items separated by commas. The items can be any type — numbers, strings, even other lists — and they don't all have to be the same type.

Each item has a position called its **index**. Indexing in Python starts at **0**, not 1: the first item is at index 0, the second at index 1, and so on. You can also count backwards from the end with negative indexes: \`-1\` is the last item.

You can change a list after creating it: append new items, replace items at a given index, slice out a chunk, or check how long it is.`,
        code: null,
      },
      {
        orderIndex: 3,
        type: SectionType.syntax_reference,
        title: null,
        content: 'The list operations you will reach for constantly:',
        code: `numbers = [10, 20, 30, 40]

numbers[0]        # → 10   (first item)
numbers[-1]       # → 40   (last item)
numbers[1:3]      # → [20, 30]  (slice: from index 1 up to but not including 3)
len(numbers)      # → 4

numbers.append(50)         # adds 50 to the end → [10, 20, 30, 40, 50]
numbers[0] = 99            # replaces first item → [99, 20, 30, 40, 50]

for n in numbers:          # loop over every item
    print(n)`,
      },
      {
        orderIndex: 4,
        type: SectionType.worked_example,
        title: 'Sum, Max, and Building a List',
        content: `**Example 1:** add up every number in a list. We start at 0 and add each value.

\`\`\`python
scores = [82, 91, 76, 88]
total = 0
for s in scores:
    total = total + s
print("Total:", total)
print("Average:", total / len(scores))
\`\`\`

**Example 2:** find the largest value yourself, then use Python's built-in \`max()\` for the short version.

\`\`\`python
scores = [82, 91, 76, 88]

biggest = scores[0]
for s in scores:
    if s > biggest:
        biggest = s
print(biggest)           # → 91

print(max(scores))       # same answer, one line
\`\`\`

**Example 3:** build a list as you go using \`append\`.

\`\`\`python
squares = []
for i in range(1, 6):
    squares.append(i * i)
print(squares)           # → [1, 4, 9, 16, 25]
\`\`\``,
        code: null,
      },
      {
        orderIndex: 5,
        type: SectionType.try_it_yourself,
        title: 'Your Turn: Sum Three Numbers',
        content: `Create a list called \`nums\` that contains three numbers of your choice. Then loop over the list and print the total sum. Try changing the numbers and see the sum update.`,
        code: `nums = [4, 7, 12]

total = 0
# Add your for loop below to sum the numbers in nums:

print("Sum:", total)
`,
      },
      {
        orderIndex: 6,
        type: SectionType.common_mistakes,
        title: 'Common Mistakes',
        content: `- ❌ **Index out of range.** A list of length 4 has indexes 0, 1, 2, 3. Asking for \`numbers[4]\` raises an \`IndexError\`. Use \`numbers[-1]\` for the last item.
- ❌ **Forgetting that indexes start at 0.** The "third item" is at index 2, not 3. This trips up almost every beginner at least once.
- ❌ **Mistaking \`numbers[0]\` for the count.** \`numbers[0]\` is the *first item*. The number of items is \`len(numbers)\`.
- ❌ **Modifying a list while iterating over it.** Removing items inside a \`for\` loop can make Python skip the item after the removed one. Build a new list, or iterate over a copy with \`numbers[:]\`.`,
        code: null,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // M8 — String Operations
  // ---------------------------------------------------------------------------
  {
    moduleOrderIndex: 8,
    title: 'Working with Strings',
    estimatedMinutes: 14,
    concepts: ['indexing', 'slicing', 'string methods', 'membership', 'immutability'],
    sections: [
      {
        orderIndex: 1,
        type: SectionType.why_you_need_this,
        title: 'Text Is Messy',
        content: `Real text rarely arrives clean. Usernames have stray spaces. Search queries come in mixed case. Filenames need to be transformed. Emails need to be checked for an \`@\`.

The good news: Python treats strings a lot like lists of characters. Once you know a few methods — slicing, replacing, splitting, searching — you can clean and transform text with very little code.`,
        code: null,
      },
      {
        orderIndex: 2,
        type: SectionType.the_basics,
        title: 'Strings as Sequences',
        content: `A string is a **sequence of characters**. You can index into it just like a list — \`name[0]\` is the first character, \`name[-1]\` is the last — and you can slice ranges out of it with \`name[start:stop]\`.

One important difference from lists: strings are **immutable**. Once you create a string, you cannot change it. Methods like \`.replace()\` and \`.lower()\` don't modify the original — they return a *new* string. If you want to keep the result, assign it back: \`name = name.lower()\`.`,
        code: null,
      },
      {
        orderIndex: 3,
        type: SectionType.syntax_reference,
        title: null,
        content: 'The string operations you will use over and over:',
        code: `s = "Hello, World"

s[0]               # → 'H'
s[-1]              # → 'd'
s[0:5]             # → 'Hello'    (slice from 0 up to but not including 5)
s[::-1]            # → 'dlroW ,olleH'   (reverse with a slice step of -1)

s.lower()          # → 'hello, world'
s.upper()          # → 'HELLO, WORLD'
s.replace("o", "0")  # → 'Hell0, W0rld'
s.strip()          # → removes spaces/newlines from both ends

"World" in s       # → True   (membership test)
"abc"   in s       # → False

"a,b,c".split(",") # → ['a', 'b', 'c']`,
      },
      {
        orderIndex: 4,
        type: SectionType.worked_example,
        title: 'Reverse, Clean, and Search',
        content: `**Example 1:** reverse a string using a slice with step \`-1\`. This is the idiomatic Python way.

\`\`\`python
word = "Python"
reversed_word = word[::-1]
print(reversed_word)         # → 'nohtyP'
\`\`\`

**Example 2:** clean up messy user input by stripping spaces and forcing lowercase.

\`\`\`python
raw   = "  Alice@Example.COM  "
clean = raw.strip().lower()
print(clean)                 # → 'alice@example.com'
\`\`\`

Method calls **chain**: \`raw.strip().lower()\` first strips, then lowercases the result.

**Example 3:** check whether a word contains a specific letter.

\`\`\`python
sentence = "the quick brown fox"
if "fox" in sentence:
    print("Found it.")
\`\`\``,
        code: null,
      },
      {
        orderIndex: 5,
        type: SectionType.try_it_yourself,
        title: 'Your Turn: Reverse a String',
        content: `Reverse the string \`"Python"\` using slice notation and assign the result to \`reversed_word\`. Then print it.`,
        code: `word = "Python"

# Use slice notation [::-1] to reverse word:
reversed_word = ""

print(reversed_word)
`,
      },
      {
        orderIndex: 6,
        type: SectionType.common_mistakes,
        title: 'Common Mistakes',
        content: `- ❌ **Trying to change a string in place.** \`name[0] = "X"\` raises a TypeError — strings are immutable. Build a new string instead.
- ❌ **Forgetting to assign the result of a method.** \`name.lower()\` does not modify \`name\`. You need \`name = name.lower()\`.
- ❌ **Case-sensitive comparisons.** \`"Apple" == "apple"\` is \`False\`. Lowercase both sides first if you don't care about case: \`a.lower() == b.lower()\`.
- ❌ **Wrong slice indexes.** \`s[0:3]\` includes positions 0, 1, 2 but **not** 3. The end index is exclusive — a common gotcha when reading text patterns.`,
        code: null,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // M10 — Functions (Going Deeper)
  // ---------------------------------------------------------------------------
  {
    moduleOrderIndex: 10,
    title: 'Functions: Reusable Building Blocks',
    estimatedMinutes: 16,
    concepts: ['def', 'parameters', 'return', 'default arguments', 'multiple return values'],
    sections: [
      {
        orderIndex: 1,
        type: SectionType.why_you_need_this,
        title: 'Why Functions?',
        content: `When the same handful of lines shows up over and over, copy-paste tempts you — and then a bug means fixing it in five places. **Functions** let you give a chunk of logic a name, define what goes in and what comes out, and reuse it from anywhere.

Functions also make code easier to *read*. \`calculate_tax(amount, rate)\` says exactly what it does in one line. The reader doesn't have to understand how taxes are calculated to follow the program.`,
        code: null,
      },
      {
        orderIndex: 2,
        type: SectionType.the_basics,
        title: 'Defining and Calling Functions',
        content: `A function bundles a set of instructions under a name. You **define** it once with the \`def\` keyword and then **call** it as many times as you want.

Two pieces matter:

- **Parameters** — the variables listed in the parentheses after the name. They're the inputs the function expects.
- **\`return\`** — the keyword that sends a value back to whoever called the function. If you don't write \`return\`, the function returns the special value \`None\`.

The lines inside the function don't run when you *define* it. They run only when you *call* it.`,
        code: null,
      },
      {
        orderIndex: 3,
        type: SectionType.syntax_reference,
        title: null,
        content: 'The shapes of a function definition you will use most:',
        code: `# Basic function with one parameter
def greet(name):
    return "Hello, " + name + "!"

print(greet("Alice"))         # → 'Hello, Alice!'

# Function with a default argument
def greet(name="World"):
    return "Hello, " + name + "!"

print(greet())                # → 'Hello, World!'  (uses the default)
print(greet("Bob"))           # → 'Hello, Bob!'

# Returning more than one value (Python returns a tuple)
def stats(numbers):
    return min(numbers), max(numbers), sum(numbers) / len(numbers)

lo, hi, avg = stats([4, 8, 15, 16, 23])
print(lo, hi, avg)`,
      },
      {
        orderIndex: 4,
        type: SectionType.worked_example,
        title: 'A Tiny Calculator',
        content: `**Example 1:** a function that takes two numbers and an operation and returns the result. Notice how we use \`if\`/\`elif\` inside the function body.

\`\`\`python
def calculate(a, b, op):
    if op == "+":
        return a + b
    elif op == "-":
        return a - b
    elif op == "*":
        return a * b
    elif op == "/":
        return a / b
    else:
        return None              # unknown operation

print(calculate(7, 3, "+"))      # → 10
print(calculate(7, 3, "*"))      # → 21
\`\`\`

**Example 2:** returning multiple values. Python packs them into a tuple, and you can unpack them on the receiving side.

\`\`\`python
def divide_with_remainder(a, b):
    quotient  = a // b
    remainder = a %  b
    return quotient, remainder

q, r = divide_with_remainder(17, 5)
print(q, r)                      # → 3 2
\`\`\``,
        code: null,
      },
      {
        orderIndex: 5,
        type: SectionType.try_it_yourself,
        title: 'Your Turn: Personalised Hello',
        content: `Define a function called \`hello\` that takes one parameter \`name\` and **returns** the string \`"Hello, <name>!"\`. Then call it with your own name and print the result.`,
        code: `def hello(name):
    # Build and return the greeting:
    pass

print(hello("Alice"))   # should print: Hello, Alice!
`,
      },
      {
        orderIndex: 6,
        type: SectionType.common_mistakes,
        title: 'Common Mistakes',
        content: `- ❌ **Forgetting to \`return\`.** A function with no \`return\` gives back \`None\`. If you wrote \`print(...)\` instead of \`return ...\`, the value is shown to the screen but the caller can't use it.
- ❌ **Mutable default arguments.** \`def f(items=[]):\` reuses the *same* list across calls — a subtle bug factory. Use \`def f(items=None):\` and create the list inside.
- ❌ **Calling vs referencing.** \`hello\` (no parentheses) is the function itself; \`hello()\` calls it. Mixing these up gives confusing errors like "function is not subscriptable."
- ❌ **Scope confusion.** A variable created inside a function only exists inside it. \`def f(): x = 1\` doesn't make \`x\` available outside the function.`,
        code: null,
      },
    ],
  },
];

async function main() {
  for (const lessonData of LESSONS) {
    const mod = await prisma.module.findUnique({
      where: { orderIndex: lessonData.moduleOrderIndex },
    });
    if (!mod) {
      console.error(`Module M${lessonData.moduleOrderIndex} not found — skipping.`);
      continue;
    }

    const existing = await prisma.lesson.findUnique({ where: { moduleId: mod.id } });

    if (existing) {
      await prisma.lessonSection.deleteMany({ where: { lessonId: existing.id } });
      await prisma.lesson.update({
        where: { id: existing.id },
        data: {
          title: lessonData.title,
          estimatedMinutes: lessonData.estimatedMinutes,
          concepts: lessonData.concepts,
          sections: { create: lessonData.sections },
        },
      });
      console.log(
        `↻ Updated M${lessonData.moduleOrderIndex} lesson: ${lessonData.title} (${lessonData.sections.length} sections)`,
      );
    } else {
      await prisma.lesson.create({
        data: {
          moduleId: mod.id,
          title: lessonData.title,
          estimatedMinutes: lessonData.estimatedMinutes,
          concepts: lessonData.concepts,
          sections: { create: lessonData.sections },
        },
      });
      console.log(
        `+ Seeded M${lessonData.moduleOrderIndex} lesson: ${lessonData.title} (${lessonData.sections.length} sections)`,
      );
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
