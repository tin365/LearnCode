import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, Circle, Lock } from 'lucide-react';
import type { ModuleWithProgress } from '@learncode/types';
import { cn } from '@/lib/utils';
import { displayOrderIndex } from '@/hooks/useLanguagePref';

interface MobileModuleDetailProps {
  module: ModuleWithProgress;
  isAdmin: boolean;
}

export function MobileModuleDetail({ module: mod, isAdmin }: MobileModuleDetailProps) {
  const locked = !isAdmin && !mod.isUnlocked;
  const lessonRead = !!mod.lesson?.progress[0]?.readAt;
  const percent =
    mod.totalCount > 0
      ? Math.round((mod.completedCount / mod.totalCount) * 100)
      : lessonRead
        ? 100
        : 0;

  return (
    <div className="space-y-4 p-4">
      <header>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Module {displayOrderIndex(mod.orderIndex)}
        </p>
        <h1 className="mt-0.5 text-xl font-bold text-slate-900">{mod.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{mod.description}</p>
      </header>

      {/* Progress bar */}
      {(mod.totalCount > 0 || mod.isFoundational) && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {mod.totalCount > 0
                ? `${mod.completedCount} / ${mod.totalCount} solved`
                : lessonRead
                  ? 'Lesson read'
                  : 'Lesson not read'}
            </span>
            <span>{percent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={cn(
                'h-full transition-all',
                mod.isComplete ? 'bg-emerald-500' : 'bg-blue-500',
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {locked && (
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          <Lock className="h-4 w-4 shrink-0" />
          <span>Complete the previous module to unlock.</span>
        </div>
      )}

      {!locked && mod.lesson && (
        <Link
          to={`/module/${mod.id}/lesson`}
          className="flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 hover:bg-blue-100"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {lessonRead ? 'Re-read the lesson' : 'Read the lesson'}
          </span>
          {lessonRead && (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          )}
        </Link>
      )}

      {!locked && mod.problems.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Problems
          </h2>
          <ul className="space-y-1">
            {mod.problems
              .slice()
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((p) => {
                const passed = !!p.progress[0]?.passed;
                return (
                  <li key={p.id}>
                    <Link
                      to={`/workspace/${p.id}`}
                      className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-3 hover:bg-slate-50"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        {passed ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                        )}
                        <span className="truncate text-sm text-slate-800">
                          {displayOrderIndex(mod.orderIndex)}.{p.orderIndex} {p.title}
                        </span>
                      </span>
                      <span
                        className={cn(
                          'shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold uppercase',
                          p.difficulty === 'easy' && 'bg-emerald-100 text-emerald-700',
                          p.difficulty === 'medium' && 'bg-amber-100 text-amber-700',
                          p.difficulty === 'hard' && 'bg-red-100 text-red-700',
                        )}
                      >
                        {p.difficulty}
                      </span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </section>
      )}

      {!locked && mod.isFoundational && mod.problems.length === 0 && (
        <p className="text-sm text-slate-500">
          This is a reading-only module — no problems to solve.
        </p>
      )}
    </div>
  );
}
