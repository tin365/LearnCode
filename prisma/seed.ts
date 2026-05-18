// prisma/seed.ts
// Run with: pnpm prisma db seed
//
// Each test case uses:
//   inputData  → Python expression evaluated after user's code runs (e.g. "str(add(2, 3))")
//   expected   → Expected string output of that expression
//   isHidden   → Hidden tests are not shown to the user on failure (only count is shown)

import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

const problems = [
  {
    orderIndex: 1,
    title: 'Hello, World!',
    difficulty: Difficulty.easy,
    description: `
## Hello, World!

Every programmer's journey starts here.

Write a function called \`hello_world\` that **returns** the string:

\`\`\`
Hello, World!
\`\`\`

### Example
\`\`\`python
result = hello_world()
print(result)  # Hello, World!
\`\`\`

> **Tip:** Pay attention to the exact text — capitalisation, comma, and exclamation mark all matter.
    `.trim(),
    starterCode: `def hello_world():
    # Write your code below
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `A function in Python sends back a value using the \`return\` keyword.
Think: what value should this function send back?`,
      },
      {
        orderIndex: 2,
        content: `Text in Python is called a **string**. Strings are wrapped in quotes.
For example: \`return "some text"\``,
      },
      {
        orderIndex: 3,
        content: `The exact string you need to return is \`"Hello, World!"\` — capital H, capital W, a comma after Hello, and an exclamation mark at the end.`,
      },
    ],
    testCases: [
      { inputData: `str(hello_world())`, expected: `Hello, World!`, isHidden: false },
      { inputData: `type(hello_world()).__name__`, expected: `str`, isHidden: true },
      { inputData: `len(hello_world())`, expected: `13`, isHidden: true },
    ],
  },
  {
    orderIndex: 2,
    title: 'Sum Two Numbers',
    difficulty: Difficulty.easy,
    description: `
## Sum Two Numbers

Write a function called \`add\` that takes **two numbers** as parameters and returns their **sum**.

### Example
\`\`\`python
add(2, 3)    # returns 5
add(-1, 1)   # returns 0
add(0, 0)    # returns 0
\`\`\`

This might feel trivial — but understanding how functions receive inputs and return outputs is the foundation of all programming.
    `.trim(),
    starterCode: `def add(a, b):
    # Write your code below
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `The function receives two values — \`a\` and \`b\`. Both are available to you inside the function body. Use them in your logic.`,
      },
      {
        orderIndex: 2,
        content: `The \`+\` operator adds two numbers together in Python:
\`\`\`python
result = a + b
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Don't forget to **return** the result. A common mistake is computing the answer but not sending it back:
\`\`\`python
return a + b
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `str(add(2, 3))`, expected: `5`, isHidden: false },
      { inputData: `str(add(-1, 1))`, expected: `0`, isHidden: false },
      { inputData: `str(add(100, 200))`, expected: `300`, isHidden: true },
      { inputData: `str(add(0, 0))`, expected: `0`, isHidden: true },
      { inputData: `str(add(-50, -50))`, expected: `-100`, isHidden: true },
    ],
  },
  {
    orderIndex: 3,
    title: 'Even or Odd',
    difficulty: Difficulty.easy,
    description: `
## Even or Odd

Write a function called \`even_or_odd\` that takes a **whole number** and returns:
- \`"Even"\` if the number is divisible by 2
- \`"Odd"\` if it is not

### Example
\`\`\`python
even_or_odd(4)   # returns "Even"
even_or_odd(7)   # returns "Odd"
even_or_odd(0)   # returns "Even"
\`\`\`

### Hint about the modulo operator
The \`%\` operator gives you the **remainder** after division:
- \`10 % 3\` → \`1\` (10 divided by 3 leaves a remainder of 1)
- \`8 % 2\` → \`0\` (8 divided by 2 leaves no remainder)
    `.trim(),
    starterCode: `def even_or_odd(n):
    # Write your code below
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `The **modulo operator** \`%\` gives you the remainder of a division.
If \`n % 2\` equals \`0\`, there's no remainder — the number divides evenly.`,
      },
      {
        orderIndex: 2,
        content: `Use an \`if / else\` statement to branch your logic:
\`\`\`python
if n % 2 == 0:
    # it's even
else:
    # it's odd
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Make sure to return the exact strings \`"Even"\` and \`"Odd"\` with capital first letters — the tests check for exact matches.`,
      },
    ],
    testCases: [
      { inputData: `even_or_odd(4)`, expected: `Even`, isHidden: false },
      { inputData: `even_or_odd(7)`, expected: `Odd`, isHidden: false },
      { inputData: `even_or_odd(0)`, expected: `Even`, isHidden: true },
      { inputData: `even_or_odd(1)`, expected: `Odd`, isHidden: true },
      { inputData: `even_or_odd(-4)`, expected: `Even`, isHidden: true },
      { inputData: `even_or_odd(-3)`, expected: `Odd`, isHidden: true },
    ],
  },
  {
    orderIndex: 4,
    title: 'FizzBuzz (1 to N)',
    difficulty: Difficulty.easy,
    description: `
## FizzBuzz

A classic programming interview problem. Write a function called \`fizzbuzz\` that takes a number \`n\` and returns a **list of strings** from 1 to n where:

- Multiples of **3** → \`"Fizz"\`
- Multiples of **5** → \`"Buzz"\`
- Multiples of **both 3 and 5** → \`"FizzBuzz"\`
- Everything else → the number as a string (e.g. \`"1"\`, \`"2"\`)

### Example
\`\`\`python
fizzbuzz(5)
# returns ["1", "2", "Fizz", "4", "Buzz"]

fizzbuzz(15)
# returns ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8",
#           "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
\`\`\`
    `.trim(),
    starterCode: `def fizzbuzz(n):
    result = []
    # Write your code below
    return result
`,
    hints: [
      {
        orderIndex: 1,
        content: `Use a loop that goes from 1 to n **inclusive**. In Python, \`range(1, n+1)\` gives you the numbers 1, 2, 3, ... n.`,
      },
      {
        orderIndex: 2,
        content: `**Order of checks matters.** Check for divisibility by both 3 AND 5 first. If you check for 3 alone first, you'll never reach the "FizzBuzz" case:
\`\`\`python
if i % 3 == 0 and i % 5 == 0:
    result.append("FizzBuzz")
elif i % 3 == 0:
    ...
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `Numbers that don't match any rule should be added as strings, not integers. Use \`str(i)\` to convert the number:
\`\`\`python
else:
    result.append(str(i))
\`\`\``,
      },
    ],
    testCases: [
      { inputData: `str(fizzbuzz(5))`, expected: `['1', '2', 'Fizz', '4', 'Buzz']`, isHidden: false },
      { inputData: `fizzbuzz(15)[-1]`, expected: `FizzBuzz`, isHidden: false },
      { inputData: `str(fizzbuzz(1))`, expected: `['1']`, isHidden: true },
      { inputData: `len(fizzbuzz(15))`, expected: `15`, isHidden: true },
      { inputData: `fizzbuzz(9)[-1]`, expected: `Fizz`, isHidden: true },
      { inputData: `fizzbuzz(10)[-1]`, expected: `Buzz`, isHidden: true },
    ],
  },
  {
    orderIndex: 5,
    title: 'Find the Largest Number',
    difficulty: Difficulty.easy,
    description: `
## Find the Largest Number

Write a function called \`find_largest\` that takes a **list of numbers** and returns the **largest one**.

### Example
\`\`\`python
find_largest([3, 1, 4, 1, 5, 9, 2, 6])  # returns 9
find_largest([10])                         # returns 10
find_largest([-3, -1, -4])                # returns -1
\`\`\`

### Challenge
Try solving it **without** using Python's built-in \`max()\` function first. Loop through the list and keep track of the largest value you've seen. Once you have it working, you can see how \`max()\` compares.
    `.trim(),
    starterCode: `def find_largest(numbers):
    # Write your code below
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Start by assuming the first item in the list is the largest. Store it in a variable:
\`\`\`python
largest = numbers[0]
\`\`\`
Then loop through the rest of the list looking for anything bigger.`,
      },
      {
        orderIndex: 2,
        content: `Inside the loop, compare each number to your current \`largest\`. If you find something bigger, update \`largest\`:
\`\`\`python
for num in numbers:
    if num > largest:
        largest = num
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `After the loop finishes, \`largest\` holds the biggest number in the list. Return it.
Python also has \`max(numbers)\` built-in — but understanding the manual approach is more valuable at this stage.`,
      },
    ],
    testCases: [
      { inputData: `str(find_largest([3, 1, 4, 1, 5, 9, 2, 6]))`, expected: `9`, isHidden: false },
      { inputData: `str(find_largest([-3, -1, -4]))`, expected: `-1`, isHidden: false },
      { inputData: `str(find_largest([10]))`, expected: `10`, isHidden: true },
      { inputData: `str(find_largest([0, 0, 0]))`, expected: `0`, isHidden: true },
      { inputData: `str(find_largest([100, 99, 101, 50]))`, expected: `101`, isHidden: true },
    ],
  },
  {
    orderIndex: 6,
    title: 'Reverse a String',
    difficulty: Difficulty.medium,
    description: `
## Reverse a String

Write a function called \`reverse_string\` that takes a string and returns it **reversed**.

### Example
\`\`\`python
reverse_string("hello")    # returns "olleh"
reverse_string("Python")   # returns "nohtyP"
reverse_string("a")        # returns "a"
reverse_string("")          # returns ""
\`\`\`

### Things to think about
- What should happen with an empty string?
- What about a single character?
- Does capitalisation matter? (It should be preserved as-is.)
    `.trim(),
    starterCode: `def reverse_string(s):
    # Write your code below
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Python strings support **slice notation**: \`s[start:stop:step]\`
- \`s[0:5]\` gives you characters 0 through 4
- \`s[::2]\` gives you every second character
- The \`step\` can be negative — what do you think \`s[::-1]\` does?`,
      },
      {
        orderIndex: 2,
        content: `A step of \`-1\` moves backwards through the string. Leaving \`start\` and \`stop\` empty means "from the beginning to the end":
\`\`\`python
s[::-1]  # reads the entire string backwards
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `The complete solution is a single line:
\`\`\`python
return s[::-1]
\`\`\`
This works for any string — empty, single character, or long. Python handles edge cases automatically.`,
      },
    ],
    testCases: [
      { inputData: `reverse_string("hello")`, expected: `olleh`, isHidden: false },
      { inputData: `reverse_string("Python")`, expected: `nohtyP`, isHidden: false },
      { inputData: `reverse_string("")`, expected: ``, isHidden: true },
      { inputData: `reverse_string("a")`, expected: `a`, isHidden: true },
      { inputData: `reverse_string("racecar")`, expected: `racecar`, isHidden: true },
      { inputData: `reverse_string("Hello, World!")`, expected: `!dlroW ,olleH`, isHidden: true },
    ],
  },
  {
    orderIndex: 7,
    title: 'Count Vowels',
    difficulty: Difficulty.medium,
    description: `
## Count Vowels

Write a function called \`count_vowels\` that takes a string and returns the **number of vowels** in it.

Vowels are: **a, e, i, o, u** (both uppercase and lowercase count).

### Example
\`\`\`python
count_vowels("hello")          # returns 2  (e, o)
count_vowels("Python")         # returns 1  (o)
count_vowels("AEIOU")          # returns 5
count_vowels("rhythm")         # returns 0
count_vowels("")               # returns 0
\`\`\`
    `.trim(),
    starterCode: `def count_vowels(s):
    # Write your code below
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Define a collection of vowels to check against. A string works well:
\`\`\`python
vowels = "aeiouAEIOU"
\`\`\`
Then loop through each character in \`s\` and check if it's \`in\` the vowels string.`,
      },
      {
        orderIndex: 2,
        content: `Use a counter variable and increment it each time you find a vowel:
\`\`\`python
count = 0
for char in s:
    if char in "aeiouAEIOU":
        count += 1
return count
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `A more Pythonic approach uses \`s.lower()\` so you only need to check lowercase vowels, then uses a generator expression:
\`\`\`python
return sum(1 for char in s.lower() if char in "aeiou")
\`\`\`
Both approaches are correct — choose whichever is clearer to you.`,
      },
    ],
    testCases: [
      { inputData: `str(count_vowels("hello"))`, expected: `2`, isHidden: false },
      { inputData: `str(count_vowels("AEIOU"))`, expected: `5`, isHidden: false },
      { inputData: `str(count_vowels(""))`, expected: `0`, isHidden: true },
      { inputData: `str(count_vowels("rhythm"))`, expected: `0`, isHidden: true },
      { inputData: `str(count_vowels("Python"))`, expected: `1`, isHidden: true },
      { inputData: `str(count_vowels("The quick brown fox"))`, expected: `5`, isHidden: true },
    ],
  },
  {
    orderIndex: 8,
    title: 'Fibonacci Sequence',
    difficulty: Difficulty.medium,
    description: `
## Fibonacci Sequence

Write a function called \`fibonacci\` that takes a number \`n\` and returns a **list** containing the first \`n\` Fibonacci numbers.

The Fibonacci sequence starts with **0** and **1**. Each subsequent number is the sum of the two before it:

\`\`\`
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
\`\`\`

### Example
\`\`\`python
fibonacci(1)   # returns [0]
fibonacci(2)   # returns [0, 1]
fibonacci(5)   # returns [0, 1, 1, 2, 3]
fibonacci(8)   # returns [0, 1, 1, 2, 3, 5, 8, 13]
\`\`\`
    `.trim(),
    starterCode: `def fibonacci(n):
    # Write your code below
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Start by handling the base cases — what should you return when \`n\` is 1 or 2?
\`\`\`python
if n == 1:
    return [0]
if n == 2:
    return [0, 1]
\`\`\`
For anything larger, you'll build on these two starting values.`,
      },
      {
        orderIndex: 2,
        content: `Initialise your list with the first two values, then loop from position 2 up to \`n\`:
\`\`\`python
sequence = [0, 1]
for i in range(2, n):
    next_num = sequence[-1] + sequence[-2]
    sequence.append(next_num)
\`\`\`
\`sequence[-1]\` is the last element, \`sequence[-2]\` is the second-to-last.`,
      },
      {
        orderIndex: 3,
        content: `Putting it together — initialise, loop, and return:
\`\`\`python
sequence = [0, 1]
for _ in range(2, n):
    sequence.append(sequence[-1] + sequence[-2])
return sequence
\`\`\`
Make sure to handle \`n == 1\` separately, otherwise \`sequence[:n]\` or returning the full list will work cleanly.`,
      },
    ],
    testCases: [
      { inputData: `str(fibonacci(5))`, expected: `[0, 1, 1, 2, 3]`, isHidden: false },
      { inputData: `str(fibonacci(1))`, expected: `[0]`, isHidden: false },
      { inputData: `str(fibonacci(2))`, expected: `[0, 1]`, isHidden: true },
      { inputData: `str(fibonacci(8))`, expected: `[0, 1, 1, 2, 3, 5, 8, 13]`, isHidden: true },
      { inputData: `len(fibonacci(10))`, expected: `10`, isHidden: true },
      { inputData: `str(fibonacci(10)[-1])`, expected: `34`, isHidden: true },
    ],
  },
  {
    orderIndex: 9,
    title: 'Check if Palindrome',
    difficulty: Difficulty.medium,
    description: `
## Check if Palindrome

A **palindrome** is a word or phrase that reads the same forwards and backwards.

Write a function called \`is_palindrome\` that takes a string and returns \`True\` if it's a palindrome, or \`False\` if not.

### Rules
- Ignore **case** (so \`"Racecar"\` should return \`True\`)
- Ignore **spaces** (so \`"never odd or even"\` should return \`True\`)

### Example
\`\`\`python
is_palindrome("racecar")           # True
is_palindrome("hello")             # False
is_palindrome("Racecar")           # True
is_palindrome("never odd or even") # True
is_palindrome("A")                 # True
is_palindrome("")                  # True
\`\`\`
    `.trim(),
    starterCode: `def is_palindrome(s):
    # Write your code below
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `Before comparing, clean the string — convert to lowercase and remove spaces:
\`\`\`python
cleaned = s.lower().replace(" ", "")
\`\`\`
Now \`"Never Odd Or Even"\` becomes \`"neveroddoreven"\`, which is easier to check.`,
      },
      {
        orderIndex: 2,
        content: `A palindrome is equal to its own reverse. You already know how to reverse a string — use slice notation:
\`\`\`python
cleaned == cleaned[::-1]
\`\`\`
This comparison returns \`True\` or \`False\` directly.`,
      },
      {
        orderIndex: 3,
        content: `The complete solution is two lines:
\`\`\`python
cleaned = s.lower().replace(" ", "")
return cleaned == cleaned[::-1]
\`\`\`
Empty strings and single characters are palindromes by definition — this handles both automatically.`,
      },
    ],
    testCases: [
      { inputData: `str(is_palindrome("racecar"))`, expected: `True`, isHidden: false },
      { inputData: `str(is_palindrome("hello"))`, expected: `False`, isHidden: false },
      { inputData: `str(is_palindrome("Racecar"))`, expected: `True`, isHidden: true },
      { inputData: `str(is_palindrome("never odd or even"))`, expected: `True`, isHidden: true },
      { inputData: `str(is_palindrome(""))`, expected: `True`, isHidden: true },
      { inputData: `str(is_palindrome("A"))`, expected: `True`, isHidden: true },
      { inputData: `str(is_palindrome("Was it a car or a cat I saw"))`, expected: `True`, isHidden: true },
    ],
  },
  {
    orderIndex: 10,
    title: 'List Deduplication',
    difficulty: Difficulty.hard,
    description: `
## List Deduplication

Write a function called \`deduplicate\` that takes a list and returns a **new list** with all duplicate values removed, **preserving the original order**.

### Example
\`\`\`python
deduplicate([1, 2, 2, 3, 4, 3, 5])      # returns [1, 2, 3, 4, 5]
deduplicate(["a", "b", "a", "c", "b"])  # returns ["a", "b", "c"]
deduplicate([1, 1, 1, 1])               # returns [1]
deduplicate([])                          # returns []
\`\`\`

### The catch
Python has a \`set()\` that removes duplicates automatically — but **sets don't preserve order**.

\`\`\`python
list(set([3, 1, 2, 1]))  # might return [1, 2, 3] — original order lost!
\`\`\`

Your function must keep elements in the order they **first appear**.
    `.trim(),
    starterCode: `def deduplicate(lst):
    # Write your code below
    pass
`,
    hints: [
      {
        orderIndex: 1,
        content: `The key insight: you need to track which items you've **already seen**. As you loop through the list, only add an item to your result if you haven't seen it before.
\`\`\`python
seen = []
result = []
for item in lst:
    if item not in seen:
        ...
\`\`\``,
      },
      {
        orderIndex: 2,
        content: `Using a \`set\` for tracking (not for output) gives better performance than a list, because checking \`item in set\` is much faster than \`item in list\`:
\`\`\`python
seen = set()
result = []
for item in lst:
    if item not in seen:
        result.append(item)
        seen.add(item)
return result
\`\`\``,
      },
      {
        orderIndex: 3,
        content: `There's also a clever one-liner using \`dict.fromkeys()\`. Dictionaries in Python 3.7+ preserve insertion order and keys are unique — so:
\`\`\`python
return list(dict.fromkeys(lst))
\`\`\`
Both the loop approach and this one-liner are correct. The loop approach shows your understanding more clearly.`,
      },
    ],
    testCases: [
      { inputData: `str(deduplicate([1, 2, 2, 3, 4, 3, 5]))`, expected: `[1, 2, 3, 4, 5]`, isHidden: false },
      { inputData: `str(deduplicate(["a", "b", "a", "c", "b"]))`, expected: `['a', 'b', 'c']`, isHidden: false },
      { inputData: `str(deduplicate([]))`, expected: `[]`, isHidden: true },
      { inputData: `str(deduplicate([1, 1, 1, 1]))`, expected: `[1]`, isHidden: true },
      { inputData: `str(deduplicate([3, 1, 2, 1, 3]))`, expected: `[3, 1, 2]`, isHidden: true },
      { inputData: `str(deduplicate([1, 2, 3, 4, 5]))`, expected: `[1, 2, 3, 4, 5]`, isHidden: true },
      { inputData: `len(deduplicate([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]))`, expected: `5`, isHidden: true },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding database...\n');

  await prisma.progress.deleteMany();
  await prisma.hint.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.problem.deleteMany();

  console.log('🗑️  Cleared existing problem data\n');

  for (const problemData of problems) {
    const { hints, testCases, ...problem } = problemData;

    const created = await prisma.problem.create({
      data: {
        ...problem,
        hints: { create: hints },
        testCases: { create: testCases },
      },
      include: { hints: true, testCases: true },
    });

    const visibleCount = created.testCases.filter((tc) => !tc.isHidden).length;
    const hiddenCount = created.testCases.filter((tc) => tc.isHidden).length;

    console.log(
      `✅ [${String(created.orderIndex).padStart(2, '0')}] ${created.title.padEnd(30)} ` +
        `${created.difficulty.padEnd(8)} ` +
        `${created.hints.length} hints   ` +
        `${visibleCount} visible / ${hiddenCount} hidden tests`,
    );
  }

  console.log(`\n🎉 Seeded ${problems.length} problems successfully.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
