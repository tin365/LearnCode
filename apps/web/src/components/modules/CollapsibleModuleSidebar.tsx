import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { displayOrderIndex } from '@/hooks/useLanguagePref';
import {
  BookOpen,
  Bug,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Lock,
} from 'lucide-react';
import type { ModuleWithProgress, ProblemInModule } from '@learncode/types';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

type ModuleItemProps = {
  module: ModuleWithProgress;
  isExpanded: boolean;
  onToggle: () => void;
  currentProblemId: number | null;
  isAdmin: boolean;
};

type ProblemRowProps = {
  problem: ProblemInModule;
  moduleOrderIndex: number;
  isLocked: boolean;
  isCurrent: boolean;
  onSelect: () => void;
};

export function CollapsibleModuleSidebar() {
  const { id } = useParams();
  const currentProblemId = id ? Number(id) : null;
  const isAdmin = useAuthStore((s) => s.user?.isAdmin ?? false);
  const [manuallyExpanded, setManuallyExpanded] = useState<Set<number>>(new Set());

  const { data: allModules = [], isLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: () => api.get<ModuleWithProgress[]>('/modules'),
  });

  // Scope the sidebar to the active language. Two sources, in order:
  //   1. `:language` URL param when on /learn/:language (LanguageView).
  //   2. The language of the current problem when on /workspace/:id.
  // Mixing curricula would clutter the nav and confuse the M0-M11
  // numbering, so we always filter to one.
  const { language: languageParam } = useParams<{ language?: string }>();
  const currentModuleLanguage = useMemo(() => {
    if (languageParam) return languageParam;
    if (currentProblemId == null) return null;
    return (
      allModules.find((m) => m.problems.some((p) => p.id === currentProblemId))
        ?.language ?? null
    );
  }, [allModules, currentProblemId, languageParam]);
  const modules = currentModuleLanguage
    ? allModules.filter((m) => m.language === currentModuleLanguage)
    : allModules;

  const autoExpandModuleId = useMemo(() => {
    if (currentProblemId == null) return null;
    const mod = modules.find((m) =>
      m.problems.some((p) => p.id === currentProblemId),
    );
    return mod?.id ?? null;
  }, [modules, currentProblemId]);

  if (isLoading) return <SidebarSkeleton />;

  const toggle = (moduleId: number) => {
    setManuallyExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      {modules.map((mod) => (
        <ModuleItem
          key={mod.id}
          module={mod}
          isExpanded={manuallyExpanded.has(mod.id) || mod.id === autoExpandModuleId}
          onToggle={() => toggle(mod.id)}
          currentProblemId={currentProblemId}
          isAdmin={isAdmin}
        />
      ))}
    </nav>
  );
}

function ModuleItem({ module: mod, isExpanded, onToggle, currentProblemId, isAdmin }: ModuleItemProps) {
  const navigate = useNavigate();

  const HeaderIcon = !mod.isUnlocked
    ? Lock
    : mod.isComplete
      ? CheckCircle2
      : isExpanded
        ? ChevronDown
        : ChevronRight;

  const handleHeaderClick = () => {
    if (!mod.isUnlocked) return;
    if (mod.isFoundational) {
      navigate(`/module/${mod.id}/lesson`);
    } else {
      onToggle();
    }
  };

  return (
    <div>
      <button
        type="button"
        disabled={!mod.isUnlocked}
        onClick={handleHeaderClick}
        className={cn(
          'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm',
          'hover:bg-slate-200/60',
          !mod.isUnlocked && 'cursor-not-allowed opacity-40 hover:bg-transparent',
          mod.isComplete && 'text-emerald-700',
        )}
      >
        <HeaderIcon className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate font-medium">
          M{displayOrderIndex(mod.orderIndex)}: {mod.title}
        </span>
        {mod.totalCount > 0 && (
          <span className="shrink-0 text-xs text-slate-500">
            {mod.completedCount}/{mod.totalCount}
          </span>
        )}
      </button>

      {isExpanded && mod.isUnlocked && (
        <div className="ml-6 mt-1 space-y-0.5">
          {mod.lesson && (
            <button
              type="button"
              onClick={() => navigate(`/module/${mod.id}/lesson`)}
              className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs hover:bg-slate-200/60"
            >
              <BookOpen className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-slate-600">Lesson</span>
              {mod.lesson.progress[0]?.readAt && (
                <CheckCircle2 className="ml-auto h-3 w-3 text-emerald-500" />
              )}
            </button>
          )}

          {mod.problems.map((p, i) => {
            const prevPassed = i === 0 || !!mod.problems[i - 1].progress[0]?.passed;
            return (
              <ProblemRow
                key={p.id}
                problem={p}
                moduleOrderIndex={displayOrderIndex(mod.orderIndex)}
                isLocked={!isAdmin && !prevPassed}
                isCurrent={p.id === currentProblemId}
                onSelect={() => navigate(`/workspace/${p.id}`)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProblemRow({
  problem,
  moduleOrderIndex,
  isLocked,
  isCurrent,
  onSelect,
}: ProblemRowProps) {
  const passed = !!problem.progress[0]?.passed;
  const score = problem.progress[0]?.score;

  const Icon = isLocked ? Lock : passed ? CheckCircle2 : Circle;

  return (
    <button
      type="button"
      disabled={isLocked}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-xs',
        isCurrent ? 'border border-blue-200 bg-blue-50' : 'hover:bg-slate-200/60',
        isLocked && 'cursor-not-allowed opacity-40 hover:bg-transparent',
      )}
    >
      <Icon
        className={cn(
          'h-3.5 w-3.5 shrink-0',
          isLocked && 'text-slate-400',
          !isLocked && passed && 'text-emerald-500',
          !isLocked && !passed && 'text-slate-300',
        )}
      />
      <span className="flex-1 truncate">
        {moduleOrderIndex}.{problem.orderIndex} {problem.title}
      </span>
      {problem.type === 'DEBUG' && (
        <span title="Broken code — fix the bug" className="shrink-0">
          <Bug className="h-3 w-3 text-amber-600" aria-label="Debug problem" />
        </span>
      )}
      {passed && score != null && (
        <span className="shrink-0 text-xs font-medium text-emerald-600">{score}pt</span>
      )}
    </button>
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-9 animate-pulse rounded-md bg-slate-200" />
      ))}
    </div>
  );
}
