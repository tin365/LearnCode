# Step 4 — Tabbed Middle Panel

**Goal:** Add tabs to the middle panel of the workspace: **Learn**, **Problem**, **Hints**.

**Estimated time:** 45 min

**Prerequisite:** Steps 1–3 complete.

## Behavior

- Default tab depends on lesson read status:
  - If lesson is **not yet read** → default to "Learn"
  - If lesson **is read** → default to "Problem"
- User can freely switch tabs anytime
- Tab state is per-problem, not persisted (resets when navigating to a new problem)

## Component changes

Refactor `apps/web/src/components/layout/LearningPanel.tsx` to use tabs.

```tsx
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpenIcon, CodeIcon, LightbulbIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LessonView } from '@/components/lessons/LessonView';
import { ProblemView } from '@/components/problems/ProblemView';
import { HintsView } from '@/components/problems/HintsView';
import { api } from '@/lib/api';

type Tab = 'learn' | 'problem' | 'hints';

interface LearningPanelProps {
  problemId: number;
  moduleId: number;
}

export function LearningPanel({ problemId, moduleId }: LearningPanelProps) {
  const { data: lesson } = useQuery({
    queryKey: ['lesson', moduleId],
    queryFn: () => api.get(`/modules/${moduleId}/lesson`).then(r => r.data),
  });
  
  const { data: hintsState } = useQuery({
    queryKey: ['hints-state', problemId],
    queryFn: () => api.get(`/problems/${problemId}/hints-state`).then(r => r.data),
  });
  
  const lessonRead = lesson?.progress?.[0]?.readAt;
  
  // Default tab: Learn if not read, Problem if read
  const [tab, setTab] = useState<Tab>(lessonRead ? 'problem' : 'learn');
  
  useEffect(() => {
    setTab(lessonRead ? 'problem' : 'learn');
  }, [problemId, lessonRead]);
  
  return (
    <div className="flex flex-col h-full">
      
      {/* Tab bar */}
      <div className="flex border-b bg-white px-2">
        <TabButton
          active={tab === 'learn'}
          onClick={() => setTab('learn')}
          icon={<BookOpenIcon className="w-4 h-4" />}
          label="Learn"
          badge={!lessonRead ? 'New' : undefined}
        />
        <TabButton
          active={tab === 'problem'}
          onClick={() => setTab('problem')}
          icon={<CodeIcon className="w-4 h-4" />}
          label="Problem"
        />
        <TabButton
          active={tab === 'hints'}
          onClick={() => setTab('hints')}
          icon={<LightbulbIcon className="w-4 h-4" />}
          label="Hints"
          badge={hintsState ? `${hintsState.used}/${hintsState.total}` : undefined}
        />
      </div>
      
      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'learn'   && <LessonView moduleId={moduleId} onContinue={() => setTab('problem')} />}
        {tab === 'problem' && <ProblemView problemId={problemId} />}
        {tab === 'hints'   && <HintsView problemId={problemId} />}
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

function TabButton({ active, onClick, icon, label, badge }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-slate-600 hover:text-slate-900'
      )}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span className={cn(
          'text-xs px-1.5 py-0.5 rounded-full',
          active ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
        )}>
          {badge}
        </span>
      )}
    </button>
  );
}
```

## Stub the three views

For this step, the three child views can be placeholders. Real implementations come in steps 5 and 6.

```tsx
// apps/web/src/components/lessons/LessonView.tsx
export function LessonView({ moduleId, onContinue }: { moduleId: number; onContinue: () => void }) {
  return (
    <div className="p-6">
      <p className="text-slate-500">Lesson content for module {moduleId} (coming in step 5)</p>
      <button
        onClick={onContinue}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        I'm ready — start the problem →
      </button>
    </div>
  );
}

// apps/web/src/components/problems/ProblemView.tsx
// Move existing problem description rendering here from old LearningPanel
export function ProblemView({ problemId }: { problemId: number }) {
  // ... existing problem rendering (description, sample test cases, etc.)
}

// apps/web/src/components/problems/HintsView.tsx
// Move existing hint UI from old LearningPanel here
export function HintsView({ problemId }: { problemId: number }) {
  // ... existing hint reveal logic
}
```

## New API endpoints

### `GET /modules/:moduleId/lesson`

Returns the lesson with all sections, plus the user's read progress.

```typescript
fastify.get('/modules/:moduleId/lesson', { onRequest: [fastify.authenticate] }, async (req) => {
  const moduleId = Number((req.params as { moduleId: string }).moduleId);
  const userId   = (req.user as { id: number }).id;
  
  const lesson = await fastify.prisma.lesson.findUnique({
    where: { moduleId },
    include: {
      sections: { orderBy: { orderIndex: 'asc' } },
      progress: { where: { userId }, select: { readAt: true } },
    },
  });
  
  if (!lesson) {
    return reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Lesson not found' } });
  }
  
  return { data: lesson };
});
```

### `POST /modules/:moduleId/lesson/complete`

Marks the lesson as read (creates a LessonProgress row).

```typescript
fastify.post('/modules/:moduleId/lesson/complete', { onRequest: [fastify.authenticate] }, async (req) => {
  const moduleId = Number((req.params as { moduleId: string }).moduleId);
  const userId   = (req.user as { id: number }).id;
  
  const lesson = await fastify.prisma.lesson.findUnique({ where: { moduleId } });
  if (!lesson) return reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'Lesson not found' } });
  
  await fastify.prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId: lesson.id } },
    update: {},
    create: { userId, lessonId: lesson.id },
  });
  
  return { data: { success: true } };
});
```

### `GET /problems/:problemId/hints-state`

Returns hint usage info for the badge.

```typescript
fastify.get('/problems/:problemId/hints-state', { onRequest: [fastify.authenticate] }, async (req) => {
  const problemId = Number((req.params as { problemId: string }).problemId);
  const userId    = (req.user as { id: number }).id;
  
  const [problem, progress] = await Promise.all([
    fastify.prisma.problem.findUnique({ where: { id: problemId }, include: { hints: true } }),
    fastify.prisma.progress.findUnique({ where: { userId_problemId: { userId, problemId } } }),
  ]);
  
  return {
    data: {
      total: problem?.hints.length ?? 0,
      used:  progress?.hintsUsed ?? 0,
    },
  };
});
```

## Verification

- [ ] Workspace shows three tabs: Learn, Problem, Hints
- [ ] Active tab is highlighted with blue underline
- [ ] Clicking tabs switches content
- [ ] Hints tab shows X/Y counter badge
- [ ] Default tab is "Learn" first time on a problem, "Problem" if lesson already read
- [ ] All existing problem features still work in the "Problem" tab

## STOP

Verify tabs work correctly before step 5 (real lesson content rendering).
