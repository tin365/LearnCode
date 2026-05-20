import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ArrowRight, BookOpen, CheckCircle2, Circle, Lock } from 'lucide-react';
import type { ModuleWithProgress } from '@learncode/types';
import { api, logout } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function getDisplayName(email: string): string {
  return email.split('@')[0];
}

type ResumeTarget =
  | {
      kind: 'lesson';
      moduleId: number;
      moduleTitle: string;
      moduleOrderIndex: number;
    }
  | {
      kind: 'problem';
      problemId: number;
      problemTitle: string;
      problemOrderIndex: number;
      moduleTitle: string;
      moduleOrderIndex: number;
    };

function findResumeTarget(
  modules: ModuleWithProgress[],
  isAdmin: boolean,
): ResumeTarget | null {
  for (const mod of modules) {
    if (!isAdmin && !mod.isUnlocked) continue;

    if (mod.isFoundational) {
      if (!mod.lesson?.progress[0]?.readAt) {
        return {
          kind: 'lesson',
          moduleId: mod.id,
          moduleTitle: mod.title,
          moduleOrderIndex: mod.orderIndex,
        };
      }
      continue;
    }

    for (const p of mod.problems) {
      if (!p.progress[0]?.passed) {
        return {
          kind: 'problem',
          problemId: p.id,
          problemTitle: p.title,
          problemOrderIndex: p.orderIndex,
          moduleTitle: mod.title,
          moduleOrderIndex: mod.orderIndex,
        };
      }
    }
  }
  return null;
}

export function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.isAdmin ?? false;

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: () => api.get<ModuleWithProgress[]>('/modules'),
  });

  const displayName = user ? getDisplayName(user.email) : '';
  const totals = modules.reduce(
    (acc, m) => ({
      completed: acc.completed + m.completedCount,
      total: acc.total + m.totalCount,
    }),
    { completed: 0, total: 0 },
  );

  const resume = useMemo(() => findResumeTarget(modules, isAdmin), [modules, isAdmin]);

  const content = (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Welcome back, {displayName}</h1>
        <p className="text-sm text-muted-foreground">
          {totals.completed} of {totals.total} problems solved.
        </p>
      </header>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <>
          {resume && <ResumeCard resume={resume} />}
          <ModuleGrid modules={modules} isAdmin={isAdmin} />
        </>
      )}
    </div>
  );

  return (
    <div className="h-screen overflow-hidden">
      {/* Desktop (≥ md): sidebar + main */}
      <div className="hidden h-full md:block">
        <PanelGroup direction="horizontal" className="h-full">
          <Panel defaultSize={18} minSize={15} maxSize={25}>
            <Sidebar />
          </Panel>
          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/30" />
          <Panel defaultSize={82} minSize={50}>
            <main className="h-full overflow-auto bg-slate-50 p-6">{content}</main>
          </Panel>
        </PanelGroup>
      </div>

      {/* Mobile (< md): top bar + scroll */}
      <div className="flex h-full flex-col bg-slate-50 md:hidden">
        <MobileTopBar />
        <main className="flex-1 overflow-auto p-4">{content}</main>
      </div>
    </div>
  );
}

function MobileTopBar() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.isAdmin ?? false;
  const initials = user?.email.slice(0, 2).toUpperCase() ?? '';

  return (
    <header className="flex shrink-0 items-center justify-between border-b bg-white px-4 py-3">
      <Link to="/dashboard" className="text-lg font-bold text-primary">
        LearnCode
      </Link>
      <div className="flex items-center gap-2">
        {isAdmin && (
          <span
            title="Admin: bypasses all unlock checks"
            className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800"
          >
            Admin
          </span>
        )}
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
          {initials}
        </span>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-md border px-2 py-1 text-xs hover:bg-slate-50"
        >
          Log out
        </button>
      </div>
    </header>
  );
}

function ResumeCard({ resume }: { resume: ResumeTarget }) {
  const href =
    resume.kind === 'lesson'
      ? `/module/${resume.moduleId}/lesson`
      : `/workspace/${resume.problemId}`;
  const title =
    resume.kind === 'lesson' ? `${resume.moduleTitle} — Lesson` : resume.problemTitle;
  const subtitle =
    resume.kind === 'lesson'
      ? `Start with the M${resume.moduleOrderIndex} reading`
      : `M${resume.moduleOrderIndex}.${resume.problemOrderIndex} · ${resume.moduleTitle}`;

  return (
    <Link
      to={href}
      className="block rounded-lg border border-blue-200 bg-blue-50 p-5 transition-shadow hover:shadow-md"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
        Resume where you left off
      </p>
      <div className="mt-2 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-blue-900">{title}</h3>
          <p className="truncate text-sm text-blue-700">{subtitle}</p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-blue-600" />
      </div>
    </Link>
  );
}

function ModuleGrid({
  modules,
  isAdmin,
}: {
  modules: ModuleWithProgress[];
  isAdmin: boolean;
}) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">All Modules</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <ModuleCard key={mod.id} module={mod} isAdmin={isAdmin} />
        ))}
      </div>
    </section>
  );
}

function ModuleCard({
  module: mod,
  isAdmin,
}: {
  module: ModuleWithProgress;
  isAdmin: boolean;
}) {
  const locked = !isAdmin && !mod.isUnlocked;
  const lessonRead = !!mod.lesson?.progress[0]?.readAt;
  const firstUnsolved = mod.problems.find((p) => !p.progress[0]?.passed);

  const href = locked
    ? null
    : mod.isFoundational
      ? `/module/${mod.id}/lesson`
      : firstUnsolved
        ? `/workspace/${firstUnsolved.id}`
        : `/module/${mod.id}/lesson`;

  const percent =
    mod.totalCount > 0
      ? Math.round((mod.completedCount / mod.totalCount) * 100)
      : lessonRead
        ? 100
        : 0;

  const StatusIcon = locked ? Lock : mod.isComplete ? CheckCircle2 : Circle;

  const card = (
    <Card
      className={cn(
        'h-full transition-shadow',
        !locked && 'hover:shadow-md',
        locked && 'opacity-60',
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">
            M{mod.orderIndex} · {mod.title}
          </CardTitle>
          <StatusIcon
            className={cn(
              'h-4 w-4 shrink-0',
              locked && 'text-muted-foreground',
              !locked && mod.isComplete && 'text-emerald-600',
              !locked && !mod.isComplete && 'text-slate-300',
            )}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="line-clamp-2 text-xs text-muted-foreground">{mod.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpen className="h-3 w-3" />
          <span>
            {mod.totalCount > 0
              ? `${mod.completedCount} / ${mod.totalCount} solved`
              : lessonRead
                ? 'Lesson read'
                : 'Reading lesson'}
          </span>
        </div>
        {(mod.totalCount > 0 || mod.isFoundational) && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={cn(
                'h-full transition-all',
                mod.isComplete ? 'bg-emerald-500' : 'bg-blue-500',
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (!href) return card;
  return (
    <Link to={href} className="block">
      {card}
    </Link>
  );
}
