# Lesson Structure

Every lesson has 6 sections, in this exact order. The consistency helps beginners build a mental model of "what's coming next."

## The 6 sections

```
1. why_you_need_this    → Motivation, real-world hook (2-3 sentences)
2. the_basics           → Core concept in plain language (1-2 paragraphs)
3. syntax_reference     → Visual cheat sheet (code block with syntax pattern)
4. worked_example       → 1-3 annotated examples (code with comments)
5. try_it_yourself      → Interactive editor exercise (no scoring)
6. common_mistakes      → 2-3 mistakes beginners make (bulleted)
```

## SectionType enum values

These map to the database `SectionType` enum:

```typescript
type SectionType =
  | 'why_you_need_this'
  | 'the_basics'
  | 'syntax_reference'
  | 'worked_example'
  | 'try_it_yourself'
  | 'common_mistakes';
```

## Section details

### 1. why_you_need_this

**Purpose:** Hook the reader before any technical content. Answer "what's in this for me?"

**Length:** 2–4 sentences

**Tone:** Casual, conversational, motivational

**Example for M2 (Variables):**

> Imagine you're following a recipe that says "add 2 cups, then add 2 cups, then add 2 cups." Annoying, right? Variables are how programmers say "store this value, and use it whenever I need it." Once you understand variables, you stop repeating yourself in code — and everything that comes next gets easier.

### 2. the_basics

**Purpose:** Define the concept clearly, plain language.

**Length:** 1–3 paragraphs

**Rules:**
- No jargon without defining it inline
- Use an analogy where possible
- Avoid forward references ("you'll learn about X later")

**Example for M2:**

> A variable is a labelled box that holds a value. The label is the variable's name. The box holds whatever you put inside.
> 
> In Python, you create a variable by writing the name, an equals sign, and the value:
> 
> `name = "Alice"`
> 
> After this line runs, the variable `name` holds the value `"Alice"`. You can now use `name` anywhere in your code instead of typing `"Alice"` over and over.

### 3. syntax_reference

**Purpose:** Visual pattern the user can scan back to.

**Length:** A code block, possibly with a one-line caption

**Format:** `code` field of the section contains the code; `content` field contains a short caption or annotation.

**Example for M2:**

```python
variable_name = value

# Examples
name = "Alice"
age = 25
price = 9.99
is_student = True
```

### 4. worked_example

**Purpose:** Show the concept in action with explanation.

**Length:** 1–3 examples, each with annotated code

**Format:** Each example has `code` (runnable Python) and `content` (markdown explanation around it).

**Example for M2:**

> **Example 1: Storing and printing a name**
> 
> ```python
> name = "Alice"        # Create a variable called "name"
> print(name)           # Use it — prints: Alice
> ```
> 
> **Example 2: Updating a variable**
> 
> ```python
> score = 0             # Start at zero
> score = score + 10    # Add 10 — score is now 10
> print(score)          # Prints: 10
> ```

### 5. try_it_yourself

**Purpose:** Apply the concept immediately. Build muscle memory.

**Length:** One small exercise, ~5 lines of code

**Behavior in UI:**
- Code loads into Monaco editor when user clicks "Try this"
- Pressing Run executes via Pyodide
- No scoring, no test cases — pure exploration
- A success message appears when user runs valid code

**Format:** `code` field has the starter code; `content` field has instructions.

**Example for M2:**

> **Your turn:** Create a variable called `favourite_food` and set it to your favourite food. Then print it.
> 
> Starter code:
> ```python
> # Your code here
> 
> print(favourite_food)
> ```

### 6. common_mistakes

**Purpose:** Prevent the 2–3 errors every beginner hits with this concept.

**Length:** Bulleted list of 2–4 items

**Format:** Each mistake has the wrong way and the right way, briefly.

**Example for M2:**

> ❌ **Using = instead of == for comparison**  
> `if age = 18` is wrong — `=` assigns, `==` compares.  
> ✅ `if age == 18`
> 
> ❌ **Forgetting quotes around strings**  
> `name = Alice` will fail because Python thinks Alice is another variable.  
> ✅ `name = "Alice"`
> 
> ❌ **Using reserved words as names**  
> `print = "hello"` will break the built-in print function.  
> ✅ Use descriptive names like `greeting` or `message`.

## Special case: Module 0 lessons

Module 0 is concept-only — no problems. Its lesson has all 5 conceptual sections (no `try_it_yourself`):

```
0.1  why_you_need_this    → Why learn programming at all
0.2  the_basics           → What is a program / Python
0.3  syntax_reference     → How code runs (interpreter)
0.4  worked_example       → Tour of the LearnCode interface
0.5  common_mistakes      → Tips for learning effectively
```

These are read sequentially. No coding required to complete Module 0.

## Rendering rules

- Sections render in `orderIndex` order
- Each section has its own visual treatment (icon + heading + content)
- `worked_example` and `try_it_yourself` sections render code in a Monaco read-only mini-editor (or a code block + "Load into editor" button)
- Markdown in `content` is rendered with full markdown support (bold, italic, code, lists, headings)
