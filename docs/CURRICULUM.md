# Curriculum: 12 Modules, 60 Problems

Designed for the 100% beginner — someone who has never written code.

## Module Map

```
M0  How Programming Works         (concept-only, no problems)
M1  First Lines of Code           5 problems
M2  Variables & Data Types        6 problems
M3  Strings in Depth              5 problems
M4  Getting Input from the User   4 problems
M5  Making Decisions              6 problems
M6  Loops                         7 problems
M7  Lists                         7 problems
M8  String Operations             5 problems
M9  Dictionaries & Tuples         5 problems
M10 Functions (Going Deeper)      5 problems
M11 Debugging & Reading Errors    5 problems

Total: 60 problems
```

## Existing 10 problems — module assignments

These move into the new structure without rewriting:

```
Existing #1  Hello, World!         → M1.1
Existing #2  Sum Two Numbers       → M10.1  (function-focused)
Existing #3  Even or Odd           → M5.1
Existing #4  FizzBuzz              → M6.4
Existing #5  Find the Largest      → M7.2
Existing #6  Reverse a String      → M8.1
Existing #7  Count Vowels          → M8.2
Existing #8  Fibonacci             → M10.4
Existing #9  Palindrome            → M8.3
Existing #10 List Deduplication    → M7.5
```

## Module 0: How Programming Works

**No problems.** Concept-only module. Five reading sections:

```
0.1  What is a program?
0.2  What is Python?
0.3  How code runs (interpreter, execution flow)
0.4  Tour of the LearnCode interface
0.5  Tips for learning to code
```

Estimated time: 15 minutes. Marked complete after reading all sections.

## Module 1: First Lines of Code

**Concepts:** print(), strings, comments, basic execution
**Lesson estimated time:** 7 min

```
1.1  Print "Hello, World!"                    easy
1.2  Print your name on one line              easy
1.3  Print multiple lines (3 print calls)     easy
1.4  Use escape characters (\n, \t)           easy
1.5  Add comments to existing code            easy   [DEBUG type]
```

## Module 2: Variables & Data Types

**Concepts:** Variables, int, float, str, bool, type(), naming rules

```
2.1  Store a name and print it                easy
2.2  Store age as int, print it               easy
2.3  Calculate rectangle area                 easy
2.4  Swap two variables                       easy
2.5  Celsius to Fahrenheit converter          medium
2.6  Check types of different values          easy
```

## Module 3: Strings in Depth

**Concepts:** Concatenation, f-strings, len(), .upper(), .lower(), .strip()

```
3.1  Combine first and last name              easy
3.2  Build a sentence using f-strings         easy
3.3  Get the length of a string               easy
3.4  Convert input to uppercase               easy
3.5  Clean up a messy string                  medium
```

## Module 4: Getting Input from the User

**Concepts:** input(), int(), float(), str(), implicit string type

```
4.1  Ask for a name, greet the user           easy
4.2  Read two numbers, print their sum        easy
4.3  Read a number, print its square          easy
4.4  Build a tip calculator                   medium
```

## Module 5: Making Decisions

**Concepts:** if/elif/else, comparison operators, boolean logic (and/or/not)

```
5.1  Even or Odd                              easy   ← existing #3
5.2  Positive, Negative, or Zero              easy
5.3  Larger of two numbers                    easy
5.4  Grade calculator (A/B/C/D/F)             medium
5.5  Leap year checker                        medium
5.6  Simple login (AND condition)             medium
```

## Module 6: Loops

**Concepts:** for, while, range(), break, continue

```
6.1  Print numbers 1 to 10                    easy
6.2  Sum 1 to N                               easy
6.3  Multiplication table for a number        easy
6.4  FizzBuzz                                 easy   ← existing #4
6.5  Count down from N to 1 (while loop)      medium
6.6  First multiple of both 3 and 7           medium
6.7  Loop until user types "quit"             medium
```

## Module 7: Lists

**Concepts:** Create, index, slice, append, remove, len(), iteration

```
7.1  Sum all numbers in a list                easy
7.2  Find the largest number                  easy   ← existing #5
7.3  Count items in a list                    easy
7.4  Reverse a list                           easy
7.5  Remove duplicates (preserve order)       hard   ← existing #10
7.6  Average of a list                        medium
7.7  Filter even numbers                      medium
```

## Module 8: String Operations

**Concepts:** Slicing, iteration, "in" keyword, .split(), .join(), .replace()

```
8.1  Reverse a string                         medium ← existing #6
8.2  Count vowels                             medium ← existing #7
8.3  Check if palindrome                      medium ← existing #9
8.4  Count words in a sentence                medium
8.5  Replace all spaces with underscores      easy
```

## Module 9: Dictionaries & Tuples

**Concepts:** Key-value pairs, .keys(), .values(), .items(), tuples, choosing the right structure

```
9.1  Build a simple contact book              medium
9.2  Count letter frequency                   medium
9.3  Most common item in a list               medium
9.4  Invert a dictionary                      medium
9.5  Group words by first letter              hard
```

## Module 10: Functions (Going Deeper)

**Concepts:** Parameters (already taught in M1), default values, multiple return values, scope

```
10.1 Sum Two Numbers                          easy   ← existing #2
10.2 Function with default greeting           easy
10.3 Return multiple values (tuple)           medium
10.4 Fibonacci with a function                medium ← existing #8
10.5 Build a calculator (dispatch dict)       hard
```

## Module 11: Debugging & Reading Errors

**Concepts:** Reading error messages, common error types, print() debugging

All problems in this module use `ProblemType.DEBUG` — user fixes broken code.

```
11.1 Fix the NameError                        easy   [DEBUG]
11.2 Fix the TypeError                        easy   [DEBUG]
11.3 Fix the IndexError                       medium [DEBUG]
11.4 Fix the IndentationError                 easy   [DEBUG]
11.5 Use print() to debug a logic bug         medium [DEBUG]
```

## Module unlocking rules

```
M0  Always unlocked
M1  Unlocks after viewing all sections of M0's lesson
Mn  Unlocks after passing ALL problems in module M(n-1)
```

Within a module, problem N+1 unlocks after problem N passes.
