# Step 3 — Module Sidebar

**Goal:** Replace the flat problem list in the sidebar with a collapsible module tree.

**Estimated time:** 1.5 hours

**Prerequisite:** Steps 1 and 2 complete.

## What to build

A collapsible module-based navigation in the left sidebar. Each module is expandable. Expanded modules show their problems.

## New API endpoint

Add `GET /modules` route in `apps/api/src/routes/modules.ts`:

```typescript
import { FastifyPluginAsync } from 'fastify';

const modulesRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/modules', { onRequest: [fastify.authenticate] }, async (req) => {
    const userId = (req.user as { id: number }).id;
    
    const modules = await fastify.prisma.module.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        problems: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            title: true,
            difficulty: true,
            orderIndex: true,
            type: true,
            progress: {
              where: { userId },
              select: { passed: true, score: true },
            },
          },
        },
        lesson: {
          select: {
            id: true,
            progress: {
              where: { userId },
              select: { readAt: true },
            },
          },
        },
      },
    });
    
    // Compute lock status server-side
    let prevModuleComplete = true;
    const enriched = modules.map((mod) => {
      const allPassed = mod.problems.length > 0 &&
        mod.problems.every(p => p.progress[0]?.passed);
      const isUnlocked = mod.isFoundational || prevModuleComplete;
      const completedCount = mod.problems.filter(p => p.progress[0]?.passed).length;
      
      const result = {
        ...mod,
        isUnlocked,
        completedCount,
        totalCount: mod.problems.length,
        isComplete: allPassed || (mod.isFoundational && mod.lesson?.progress[0]?.readAt),
      };
      
      prevModuleComplete = result.isComplete;
      return result;
    });
    
    return { data: enriched };
  });
};

export default modulesRoute;
```

Register this route in `apps/api/src/server.ts`.

## New shared type

Add to `packages/types/src/index.ts`:

```typescript
export interface ModuleWithProgress {
  id: number;
  orderIndex: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  isFoundational: boolean;
  isUnlocked: boolean;
  isComplete: boolean;
  completedCount: number;
  totalCount: number;
  problems: ProblemInModule[];
  lesson?: { id: number; progress: { readAt: string }[] };
}

export interface ProblemInModule {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  orderIndex: number;
  type: 'STANDARD' | 'DEBUG' | 'CONCEPT_ONLY';
  progress: { passed: boolean; score: number }[];
}
```

## New component: `CollapsibleModuleSidebar`

Create `apps/web/src/components/modules/CollapsibleModuleSidebar.tsx`:

```tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronRightIcon, ChevronDownIcon, LockIcon, CheckCircleIcon, CircleIcon, BookOpenIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function CollapsibleModuleSidebar() {
  const { data: modules } = useQuery({
    queryKey: ['modules'],
    queryFn: () => api.get<ModuleWithProgress[]>('/modules').then(r => r.data),
  });
  
  const params = useParams();
  const currentProblemId = Number(params.problemId);
  const currentModuleId  = Number(params.moduleId);
  
  // Auto-expand the current module
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  
  if (!modules) return <SidebarSkeleton />;
  
  return (
    <nav className="flex-1 overflow-y-auto p-3 space-y-1">
      {modules.map(mod => (
        <ModuleItem
          key={mod.id}
          module={mod}
          isExpanded={expanded.has(mod.id) || mod.id === currentModuleId}
          onToggle={() => toggle(expanded, mod.id, setExpanded)}
          currentProblemId={currentProblemId}
        />
      ))}
    </nav>
  );
}

function toggle(set: Set<number>, id: number, setter: (s: Set<number>) => void) {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  setter(next);
}

function ModuleItem({ module, isExpanded, onToggle, currentProblemId }) {
  const navigate = useNavigate();
  const Icon = !module.isUnlocked ? LockIcon
             : module.isComplete  ? CheckCircleIcon
             : isExpanded         ? ChevronDownIcon
             : ChevronRightIcon;
  
  return (
    <div>
      <button
        disabled={!module.isUnlocked}
        onClick={() => {
          if (!module.isUnlocked) return;
          if (module.isFoundational) {
            navigate(`/module/${module.id}/lesson`);
          } else {
            onToggle();
          }
        }}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left',
          'hover:bg-slate-50',
          !module.isUnlocked && 'opacity-50 cursor-not-allowed',
          module.isComplete && 'text-emerald-700'
        )}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 truncate font-medium">
          M{module.orderIndex}: {module.title}
        </span>
        {module.totalCount > 0 && (
          <span className="text-xs text-slate-500">
            {module.completedCount}/{module.totalCount}
          </span>
        )}
      </button>
      
      {isExpanded && module.isUnlocked && (
        <div className="ml-6 mt-1 space-y-0.5">
          {/* Lesson link */}
          {module.lesson && (
            <button
              onClick={() => navigate(`/module/${module.id}/lesson`)}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-left hover:bg-slate-50"
            >
              <BookOpenIcon className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-slate-600">Lesson</span>
              {module.lesson.progress[0]?.readAt && (
                <CheckCircleIcon className="w-3 h-3 text-emerald-500 ml-auto" />
              )}
            </button>
          )}
          
          {/* Problems */}
          {module.problems.map((p, i) => {
            const passed = p.progress[0]?.passed;
            const score  = p.progress[0]?.score;
            const isCurrent = p.id === currentProblemId;
            const isLocked = i > 0 && !module.problems[i-1].progress[0]?.passed;
            
            return (
              <button
                key={p.id}
                disabled={isLocked}
                onClick={() => navigate(`/problem/${p.id}`)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-left',
                  isCurrent ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50',
                  isLocked && 'opacity-40 cursor-not-allowed'
                )}
              >
                {isLocked ? <LockIcon className="w-3.5 h-3.5" />
                  : passed ? <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500" />
                  : <CircleIcon className="w-3.5 h-3.5 text-slate-300" />}
                
                <span className="flex-1 truncate">
                  {module.orderIndex}.{p.orderIndex} {p.title}
                </span>
                
                {passed && (
                  <span className="text-emerald-600 font-medium">{score}pt</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="p-3 space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-9 bg-slate-100 rounded-md animate-pulse" />
      ))}
    </div>
  );
}
```

## Replace existing Sidebar

In `apps/web/src/components/layout/Sidebar.tsx`, replace the flat problem list with `<CollapsibleModuleSidebar />`. Keep the user identity block (avatar, username, "X/60 solved") above it. Update the count to count across all problems in all modules.

## Routes to update

```
/dashboard               → Show all modules as expandable cards (optional)
/module/:moduleId/lesson → Open the lesson for that module
/problem/:problemId      → Open problem in workspace (existing route)
```

For Wave 1, just make sure `/problem/:problemId` still works and `/module/:moduleId/lesson` is wired up. The Dashboard page enhancement can come later.

## Verification

- [ ] Sidebar shows 12 modules with M0–M11 labels
- [ ] Each module shows X/Y completed count
- [ ] Clicking a module expands it (except Module 0, which goes straight to lesson)
- [ ] Problems show difficulty and score for passed ones
- [ ] Locked modules show lock icon, can't be clicked
- [ ] Existing 10 problems show in their assigned modules

## STOP

Verify the sidebar renders correctly before moving to step 4.
