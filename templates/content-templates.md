# Content Templates

Use these templates as the **exact structure** when authoring problems or lessons. The agent should follow these without deviation.

---

## Problem Template

```yaml
problem:
  moduleOrderIndex: <int>        # 0-11
  orderIndex: <int>              # 1-based within module
  title: <string>                # "Find the Largest Number"
  difficulty: easy | medium | hard
  type: STANDARD | DEBUG          # STANDARD is the default
  
  description: |
    Markdown content here.
    
    Can include code blocks:
    ```python
    function_call(args)  # expected output
    ```
    
    Keep descriptions clear and beginner-friendly.
  
  starterCode: |
    def function_name(params):
        # Write your code below
        pass
  
  hints:
    - orderIndex: 1
      content: |
        First hint — conceptual nudge.
        Don't give away syntax yet.
    
    - orderIndex: 2
      content: |
        Second hint — show structure or pattern.
        ```python
        # Show a skeleton with placeholders
        ```
    
    - orderIndex: 3
      content: |
        Third hint — almost the solution but
        leave the final piece for them to fill in.
  
  testCases:
    - inputData: 'str(function_name(args))'   # Python expression to evaluate
      expected: 'output as string'
      isHidden: false                          # Visible in description
    
    - inputData: 'str(function_name(edge_case))'
      expected: 'edge case output'
      isHidden: true                           # Counted but never shown
    
    # At least 3 test cases per problem.
    # 1-2 visible, the rest hidden.
```

### Problem authoring rules

1. **Description must include 2-3 worked examples** with expected output as comments
2. **Starter code must include the function signature and a `pass`** so empty submission doesn't error
3. **Three hints, escalating in specificity** — conceptual → structural → almost-solution
4. **Minimum 3 test cases**, more is better — cover edge cases (empty input, single element, negative numbers)
5. **Hidden tests outnumber visible** (e.g., 2 visible + 4 hidden)
6. **For DEBUG type problems:** starterCode contains the BROKEN code that the user must fix

---

## Lesson Template

```yaml
lesson:
  moduleOrderIndex: <int>          # 0-11
  title: <string>                  # "Making Decisions"
  estimatedMinutes: <int>          # Typically 5-15
  concepts:                        # Tags shown in UI
    - <concept_name_1>
    - <concept_name_2>
  
  sections:
    
    # SECTION 1 — Motivation
    - orderIndex: 1
      type: why_you_need_this
      title: <optional string>     # If null, defaults to "Why You Need This"
      content: |
        2-4 sentences. Conversational tone.
        Real-world hook. Make them care before any technical content.
      code: null
    
    # SECTION 2 — Plain language explanation
    - orderIndex: 2
      type: the_basics
      title: <optional string>
      content: |
        1-3 paragraphs. Define the concept.
        Use an analogy if possible.
        No forward references ("you'll learn about X later").
      code: null
    
    # SECTION 3 — Visual syntax reference
    - orderIndex: 3
      type: syntax_reference
      title: <optional string>
      content: |
        Short caption above the code (1 line is fine).
      code: |
        # The syntax pattern in code form
        if condition:
            do_thing()
    
    # SECTION 4 — Worked examples
    - orderIndex: 4
      type: worked_example
      title: <optional string>
      content: |
        Markdown around the code. Walk through what each line does.
        Can include multiple examples separated by headings.
      code: |
        # Runnable example code
        age = 18
        if age >= 18:
            print("Adult")
    
    # SECTION 5 — Interactive exercise
    - orderIndex: 5
      type: try_it_yourself
      title: <optional string>
      content: |
        Clear instructions.
        Tell the user exactly what to change.
      code: |
        # Starter code that loads into the editor
        # Keep it short — 3-6 lines max
        x = 5
        # Change x to your favourite number and run
        print(x)
    
    # SECTION 6 — Anti-patterns
    - orderIndex: 6
      type: common_mistakes
      title: <optional string>
      content: |
        - **Mistake 1:** Brief description
          ❌ `wrong = code`
          ✅ `right = code`
        
        - **Mistake 2:** Brief description
          ❌ `wrong = code`
          ✅ `right = code`
        
        - **Mistake 3:** Brief description
          ❌ `wrong = code`
          ✅ `right = code`
      code: null
```

### Lesson authoring rules

1. **All 6 sections in this exact order** — consistency helps beginners build pattern recognition
2. **Markdown is rendered** — use bold, italic, inline code, lists, etc.
3. **Code field is optional** — only fill it when the section has runnable code
4. **For try_it_yourself:** starter code should be modifiable, not a finished solution
5. **For Module 0 lessons:** omit try_it_yourself (no problems in Module 0 = no coding context)
6. **Concepts array:** 2-5 tags that appear as pills in the UI

---

## Sample completed problem (for reference)

```yaml
problem:
  moduleOrderIndex: 5
  orderIndex: 2
  title: 'Positive, Negative, or Zero'
  difficulty: easy
  type: STANDARD
  
  description: |
    ## Positive, Negative, or Zero
    
    Write a function called `classify` that takes a number and returns:
    - `"Positive"` if the number is greater than 0
    - `"Negative"` if the number is less than 0
    - `"Zero"` if the number equals 0
    
    ### Example
    ```python
    classify(5)    # "Positive"
    classify(-3)   # "Negative"
    classify(0)    # "Zero"
    ```
  
  starterCode: |
    def classify(n):
        # Write your code below
        pass
  
  hints:
    - orderIndex: 1
      content: |
        You need to check THREE conditions, not two.
        Think about which comparison handles each case.
    
    - orderIndex: 2
      content: |
        Use `if`, `elif`, and `else` to handle all three cases:
        ```python
        if n > 0:
            ...
        elif n < 0:
            ...
        else:
            ...
        ```
    
    - orderIndex: 3
      content: |
        Don't forget to `return` the string — `print` won't pass the tests.
        Each branch should return one of "Positive", "Negative", or "Zero".
  
  testCases:
    - inputData: 'classify(5)'
      expected: 'Positive'
      isHidden: false
    
    - inputData: 'classify(-3)'
      expected: 'Negative'
      isHidden: false
    
    - inputData: 'classify(0)'
      expected: 'Zero'
      isHidden: true
    
    - inputData: 'classify(100)'
      expected: 'Positive'
      isHidden: true
    
    - inputData: 'classify(-1000)'
      expected: 'Negative'
      isHidden: true
```

---

## Sample completed lesson section (for reference)

```yaml
- orderIndex: 1
  type: why_you_need_this
  title: 'Why Branch Your Code?'
  content: |
    Imagine an app that greets users differently based on the time of day —
    "Good morning" before noon, "Good afternoon" after. Without **if statements**,
    your program would have to say the same thing every time. Branching is how
    code makes decisions, which is what makes software feel alive and responsive.
  code: null
```
