# LearnCode — Documentation Bundle

Drop these files into your repo, then point your AI agent at them. Keeps prompts small, specs version-controlled, and Wave 1 broken into independently verifiable steps.

## How to use

1. **Copy `CLAUDE.md` to the root of your repo** (next to `package.json`)
2. **Copy the `docs/` folder to your repo root**
3. **Copy the `templates/` folder to your repo root**

Your repo should now look like:

```
your-repo/
├── CLAUDE.md                ← NEW
├── docs/                    ← NEW
│   ├── ARCHITECTURE.md
│   ├── CONVENTIONS.md
│   ├── SCHEMA.md
│   ├── CURRICULUM.md
│   ├── LESSON_STRUCTURE.md
│   └── waves/
│       ├── step-1-schema-migration.md
│       ├── step-2-data-migration.md
│       ├── step-3-module-sidebar.md
│       ├── step-4-tabbed-panel.md
│       ├── step-5-lesson-view.md
│       ├── step-6-module-zero.md
│       └── step-7-lesson-content.md
├── templates/               ← NEW
│   └── content-templates.md
├── apps/
├── packages/
└── ...your existing files
```

## Running Wave 1 with your AI agent

Open Claude Code (or Cursor / Windsurf) in your repo. For each step, your prompt is just one line:

```
Step 1: Read docs/waves/step-1-schema-migration.md and implement it. Stop when done.
```

```
Step 2: Read docs/waves/step-2-data-migration.md and implement it. Stop when done.
```

...and so on. The CLAUDE.md file is auto-loaded, providing context about the project, conventions, and where everything lives.

## Why this approach

**Token efficiency:** Instead of pasting 5,000 lines of spec into every prompt, the agent reads only the file it needs. Roughly 75% fewer tokens than monolithic prompts.

**Verifiability:** Each step has a "STOP" checkpoint. You verify before continuing, so errors don't compound across the build.

**Version control:** Specs live in git. You can edit them, the agent reads the latest version. No copy-paste drift.

**Future-proof:** Wave 2 and Wave 3 specs will be added to `docs/waves/` later. Same workflow, no new tooling.

## Estimated time for Wave 1

```
Step 1: Schema migration         15 min
Step 2: Data migration           30 min
Step 3: Module sidebar           1.5 hours
Step 4: Tabbed middle panel      45 min
Step 5: Lesson view              1.5 hours
Step 6: Module 0 reading view    45 min
Step 7: Lesson content writing   2-3 hours

Total: ~7-8 hours of agent work, broken across 7 small prompts
```

## What you get after Wave 1

```
✓ 12 modules in a collapsible sidebar tree
✓ Module 0 (concept-only) lesson on "How Programming Works"
✓ 6 lessons covering existing problem topics
✓ Tabbed middle panel (Learn / Problem / Hints)
✓ Interactive "Try It" mini-exercises inside lessons
✓ 60-problem curriculum structure (ready for Waves 2/3)
✓ All 10 existing problems still working in new structure
```

## Wave 2 / Wave 3

Once Wave 1 is shipped, drop in `docs/waves/wave-2-*.md` files to keep going. The conventions and templates files don't change — they're stable across waves.

## Customization

- **Edit `CLAUDE.md`** if you want to change the agent's default behavior
- **Edit `docs/CONVENTIONS.md`** to adjust code style (it'll apply to all future work)
- **Edit step files** to skip parts you've already done or change implementation choices
- **Templates** in `templates/` define content shape — extend as needed for new problem types
