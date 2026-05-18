# Step 5 — Lesson View Component

**Goal:** Build the real lesson rendering with 6-section layout, including "Try It" mini exercises.

**Estimated time:** 1.5 hours

**Prerequisite:** Steps 1–4 complete.

## Component structure

```
LessonView
├── LessonHeader          (title, estimated time, concepts tags)
├── LessonProgress        (section X of Y indicator)
├── LessonSections
│   ├── SectionRenderer (×N)
│   │   ├── WhyYouNeedThis
│   │   ├── TheBasics
│   │   ├── SyntaxReference
│   │   ├── WorkedExample
│   │   ├── TryItYourself
│   │   └── CommonMistakes
└── LessonFooter           (mark complete + continue button)
```

## Reference

Follow the 6-section format defined in `docs/LESSON_STRUCTURE.md`.

## Main component

Create `apps/web/src/components/lessons/LessonView.tsx`:

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClockIcon, ArrowRightIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { SectionRenderer } from './SectionRenderer';

interface LessonViewProps {
  moduleId: number;
  onContinue: () => void;
}

export function LessonView({ moduleId, onContinue }: LessonViewProps) {
  const qc = useQueryClient();
  
  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', moduleId],
    queryFn: () => api.get(`/modules/${moduleId}/lesson`).then(r => r.data),
  });
  
  const completeLesson = useMutation({
    mutationFn: () => api.post(`/modules/${moduleId}/lesson/complete`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lesson', moduleId] });
      qc.invalidateQueries({ queryKey: ['modules'] });
    },
  });
  
  if (isLoading) return <LessonSkeleton />;
  if (!lesson) return <p className="p-6 text-slate-500">No lesson for this module.</p>;
  
  const alreadyRead = lesson.progress?.[0]?.readAt;
  
  return (
    <article className="max-w-3xl mx-auto p-6 space-y-6">
      
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5" />
            {lesson.estimatedMinutes} min read
          </span>
          {lesson.concepts.map((c: string) => (
            <span key={c} className="px-2 py-0.5 bg-slate-100 rounded-full">{c}</span>
          ))}
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
      </header>
      
      {/* Sections */}
      <div className="space-y-8">
        {lesson.sections.map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>
      
      {/* Footer */}
      <footer className="pt-6 border-t flex items-center justify-between">
        <div className="text-sm text-slate-500">
          {alreadyRead ? '✓ You\'ve read this lesson' : 'Finished reading?'}
        </div>
        <button
          onClick={() => {
            if (!alreadyRead) completeLesson.mutate();
            onContinue();
          }}
          className="
            flex items-center gap-2 px-4 py-2 rounded-md
            bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm
          "
        >
          {alreadyRead ? 'Continue to problem' : 'I\'m ready — start the problem'}
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </footer>
    </article>
  );
}

function LessonSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 animate-pulse">
      <div className="h-6 bg-slate-100 rounded w-1/3"></div>
      <div className="h-8 bg-slate-100 rounded w-2/3"></div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-100 rounded w-full"></div>
        <div className="h-4 bg-slate-100 rounded w-5/6"></div>
        <div className="h-4 bg-slate-100 rounded w-4/6"></div>
      </div>
    </div>
  );
}
```

## Section renderer

Create `apps/web/src/components/lessons/SectionRenderer.tsx`:

```tsx
import { 
  LightbulbIcon, BookOpenIcon, CodeIcon, FlaskConicalIcon, 
  PlayCircleIcon, AlertTriangleIcon 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TryItExercise } from './TryItExercise';

const SECTION_META = {
  why_you_need_this: { icon: LightbulbIcon,        label: 'Why You Need This', tone: 'amber' },
  the_basics:        { icon: BookOpenIcon,         label: 'The Basics',         tone: 'blue'  },
  syntax_reference:  { icon: CodeIcon,             label: 'Syntax',             tone: 'slate' },
  worked_example:    { icon: FlaskConicalIcon,     label: 'Example',            tone: 'emerald' },
  try_it_yourself:   { icon: PlayCircleIcon,       label: 'Try It Yourself',    tone: 'purple' },
  common_mistakes:   { icon: AlertTriangleIcon,    label: 'Common Mistakes',    tone: 'red' },
} as const;

const TONE_CLASSES = {
  amber:   'border-amber-200 bg-amber-50',
  blue:    'border-blue-200 bg-blue-50',
  slate:   'border-slate-200 bg-slate-50',
  emerald: 'border-emerald-200 bg-emerald-50',
  purple:  'border-purple-200 bg-purple-50',
  red:     'border-red-200 bg-red-50',
};

export function SectionRenderer({ section }: { section: any }) {
  const meta = SECTION_META[section.type as keyof typeof SECTION_META];
  if (!meta) return null;
  
  const Icon = meta.icon;
  
  // Special handling for try_it_yourself
  if (section.type === 'try_it_yourself') {
    return (
      <section className={`rounded-lg border-2 p-5 ${TONE_CLASSES[meta.tone]}`}>
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5 text-purple-700" />
          <h3 className="font-semibold text-purple-900">{section.title || meta.label}</h3>
        </div>
        <div className="prose prose-sm max-w-none mb-4">
          <ReactMarkdown>{section.content}</ReactMarkdown>
        </div>
        {section.code && <TryItExercise initialCode={section.code} />}
      </section>
    );
  }
  
  // Standard rendering
  return (
    <section className={`rounded-lg border p-5 ${TONE_CLASSES[meta.tone]}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5" />
        <h3 className="font-semibold">{section.title || meta.label}</h3>
      </div>
      
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown>{section.content}</ReactMarkdown>
      </div>
      
      {section.code && (
        <pre className="mt-3 p-3 bg-white border rounded-md overflow-x-auto text-sm font-mono">
          {section.code}
        </pre>
      )}
    </section>
  );
}
```

## Try-It interactive exercise

Create `apps/web/src/components/lessons/TryItExercise.tsx`:

```tsx
import { useState } from 'react';
import { PlayIcon, RefreshCwIcon } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { usePyodideStore } from '@/store/pyodideStore';

export function TryItExercise({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const runCode = usePyodideStore(s => s.runCode);
  
  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    try {
      const result = await runCode(code);
      setOutput(result.output || 'Ran successfully (no output)');
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-purple-200 bg-white overflow-hidden">
        <Editor
          height="160px"
          language="python"
          value={code}
          onChange={(v) => setCode(v ?? '')}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 8, bottom: 8 },
            lineNumbers: 'on',
          }}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-md text-sm"
        >
          <PlayIcon className="w-3.5 h-3.5" />
          {isRunning ? 'Running…' : 'Run'}
        </button>
        <button
          onClick={() => { setCode(initialCode); setOutput(''); }}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border hover:bg-slate-50 rounded-md text-sm text-slate-600"
        >
          <RefreshCwIcon className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
      
      {output && (
        <pre className="p-3 bg-slate-950 text-slate-100 rounded-md text-xs font-mono whitespace-pre-wrap">
          {output}
        </pre>
      )}
    </div>
  );
}
```

## Add a shared Pyodide store

If you don't already have one, create `apps/web/src/store/pyodideStore.ts`. This lets both the workspace and the lesson view share the same Pyodide instance (no double-loading).

```typescript
import { create } from 'zustand';

interface PyodideStore {
  ready: boolean;
  runCode: (code: string) => Promise<{ output: string; error: string | null }>;
}

let worker: Worker | null = null;

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(
      new URL('@/workers/pyodide.worker.ts', import.meta.url),
      { type: 'module' }
    );
  }
  return worker;
}

export const usePyodideStore = create<PyodideStore>(() => ({
  ready: false,
  
  runCode: (code: string) =>
    new Promise((resolve, reject) => {
      const w = getWorker();
      const handler = (e: MessageEvent) => {
        w.removeEventListener('message', handler);
        if (e.data.error) reject(new Error(e.data.error));
        else resolve(e.data);
      };
      w.addEventListener('message', handler);
      w.postMessage({ code, testCases: [] });
    }),
}));
```

## Install missing dependencies

```bash
pnpm add react-markdown lucide-react
```

## Verification

- [ ] Opening a lesson shows the title, estimated time, and concept tags
- [ ] Each section renders with its own icon and color
- [ ] Markdown content renders correctly (bold, code, lists)
- [ ] "Try It" sections show an editable Monaco editor
- [ ] Clicking Run in a Try-It executes code and shows output
- [ ] Reset button restores the original starter code
- [ ] Continue button marks the lesson complete and switches to Problem tab
- [ ] On revisit, the lesson shows "✓ You've read this lesson"

## STOP

Verify lesson rendering before moving to step 6 (Module 0 special view).
