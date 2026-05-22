import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Circle, Lock } from 'lucide-react';
import type { ModuleWithProgress, ProblemLanguage } from '@learncode/types';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { MobileModuleStrip } from '@/components/layout/MobileModuleStrip';
import { MobileModuleDetail } from '@/components/layout/MobileModuleDetail';
import { ErrorState } from '@/components/ui/ErrorState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { displayOrderIndex, useLanguagePref } from '@/hooks/useLanguagePref';

const VALID_LANGUAGES: ReadonlySet<ProblemLanguage> = new Set([
  'python',
  'javascript',
  'java',
  'rust',
]);

const LANGUAGE_TITLE: Record<ProblemLanguage, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  java: 'Java',
  rust: 'Rust',
};

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

export function LanguageView() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.isAdmin ?? false;
  const { language: langParam } = useParams<{ language: string }>();
  const [, setLanguagePref] = useLanguagePref();

  // Bail out for unknown languages — guards typos in URLs and stops
  // garbage data from getting cached.
  const language = VALID_LANGUAGES.has(langParam as ProblemLanguage)
    ? (langParam as ProblemLanguage)
    : null;

  // Persist the user's last-visited language so the landing page can
  // surface a "continue with X" affordance.
  useEffect(() => {
    if (language) setLanguagePref(language);
  }, [language, setLanguagePref]);

  const {
    data: allModules = [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['modules'],
    queryFn: () => api.get<ModuleWithProgress[]>('/modules'),
    enabled: language !== null,
  });

  const modules = useMemo(
    () => allModules.filter((m) => m.language === language),
    [allModules, language],
  );

  const displayName = user ? getDisplayName(user.email) : '';
  const totals = modules.reduce(
    (acc, m) => ({
      completed: acc.completed + m.completedCount,
      total: acc.total + m.totalCount,
    }),
    { completed: 0, total: 0 },
  );

  const resume = useMemo(() => findResumeTarget(modules, isAdmin), [modules, isAdmin]);

  // Mobile-only selection. Defaults to resume target's module, else the
  // first unlocked module, else M0. Resets to the language's default
  // when the user toggles languages so we don't keep a stale id that
  // belongs to the other curriculum.
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const selectionStillValid = modules.some((m) => m.id === selectedModuleId);
  useEffect(() => {
    if (modules.length === 0) return;
    if (selectionStillValid) return;
    const resumeOrderIndex =
      resume?.kind === 'lesson' ? resume.moduleOrderIndex : resume?.moduleOrderIndex;
    const defaultId =
      modules.find((m) => m.orderIndex === resumeOrderIndex)?.id ??
      modules.find((m) => isAdmin || m.isUnlocked)?.id ??
      modules[0].id;
    setSelectedModuleId(defaultId);
  }, [modules, resume, isAdmin, selectionStillValid]);
  const selectedModule = modules.find((m) => m.id === selectedModuleId) ?? null;

  // Unknown language slug in the URL — bounce to the language picker
  // rather than render an empty curriculum.
  if (!language) return <Navigate to="/languages" replace />;

  const langLabel = LANGUAGE_TITLE[language];

  const content = (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-2">
        <Link
          to="/languages"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-3 w-3" />
          All languages
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{langLabel} curriculum</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {displayName} — {totals.completed} of {totals.total} {langLabel}{' '}
            problems solved.
          </p>
        </div>
      </header>

      {isError ? (
        <ErrorState
          compact
          message={error instanceof Error ? error.message : null}
          onRetry={refetch}
          retrying={isFetching}
        />
      ) : isLoading ? (
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

      {/* Mobile (< md): top bar + narrow module strip + selected module detail */}
      <div className="flex h-full flex-col bg-slate-50 md:hidden">
        <MobileHeader />
        <div className="flex items-center justify-between border-b bg-white px-3 py-2">
          <Link
            to="/languages"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500"
          >
            <ArrowLeft className="h-3 w-3" />
            Languages
          </Link>
          <span className="text-xs font-semibold text-slate-700">{langLabel}</span>
        </div>
        {isError ? (
          <div className="p-4">
            <ErrorState
              compact
              message={error instanceof Error ? error.message : null}
              onRetry={refetch}
              retrying={isFetching}
            />
          </div>
        ) : isLoading ? (
          <p className="p-4 text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <MobileModuleStrip
              modules={modules}
              selectedId={selectedModuleId}
              isAdmin={isAdmin}
              onSelect={setSelectedModuleId}
            />
            <main className="flex-1 overflow-y-auto">
              {selectedModule ? (
                <MobileModuleDetail module={selectedModule} isAdmin={isAdmin} />
              ) : (
                <p className="p-4 text-sm text-muted-foreground">
                  Select a module from the left.
                </p>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
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
      ? `Start with the M${displayOrderIndex(resume.moduleOrderIndex)} reading`
      : `M${displayOrderIndex(resume.moduleOrderIndex)}.${resume.problemOrderIndex} · ${resume.moduleTitle}`;

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
            M{displayOrderIndex(mod.orderIndex)} · {mod.title}
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
