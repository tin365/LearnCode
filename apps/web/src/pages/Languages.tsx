import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import type { ModuleWithProgress, ProblemLanguage } from '@learncode/types';
import { api } from '@/lib/api';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { cn } from '@/lib/utils';

interface LanguageMeta {
  id: ProblemLanguage;
  label: string;
  description: string;
}

const LANGUAGES: LanguageMeta[] = [
  { id: 'python', label: 'Python', description: 'Where most people start. Clean syntax, huge ecosystem.' },
  { id: 'javascript', label: 'JavaScript', description: 'The language every web browser already runs.' },
  { id: 'java', label: 'Java', description: 'Statically typed, class-based — Android and enterprise.' },
  { id: 'rust', label: 'Rust', description: 'Memory-safe systems programming with a strict compiler.' },
];

export function Languages() {
  const {
    data: modules = [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['modules'],
    queryFn: () => api.get<ModuleWithProgress[]>('/modules'),
  });

  // Per-language aggregate, computed in one pass.
  const stats = useMemo(() => {
    const acc = new Map<
      ProblemLanguage,
      { completed: number; total: number; moduleCount: number; completeModules: number }
    >();
    for (const m of modules) {
      const cur = acc.get(m.language) ?? {
        completed: 0,
        total: 0,
        moduleCount: 0,
        completeModules: 0,
      };
      cur.completed += m.completedCount;
      cur.total += m.totalCount;
      cur.moduleCount += 1;
      if (m.isComplete) cur.completeModules += 1;
      acc.set(m.language, cur);
    }
    return acc;
  }, [modules]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <MobileHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">Choose a language</h1>
        <p className="mt-1 text-sm text-slate-600">
          Each curriculum runs from M0 (the basics) to M11 (debugging real code).
        </p>

        {isError ? (
          <div className="mt-8">
            <ErrorState
              compact
              message={error instanceof Error ? error.message : null}
              onRetry={refetch}
              retrying={isFetching}
            />
          </div>
        ) : isLoading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
        ) : (
          <ul className="mt-8 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {LANGUAGES.map((lang) => {
              const s = stats.get(lang.id);
              const seeded = s !== undefined && s.moduleCount > 0;
              const completed = s?.completed ?? 0;
              const total = s?.total ?? 0;
              const moduleCount = s?.moduleCount ?? 0;
              const completeModules = s?.completeModules ?? 0;
              const started = completed > 0 || completeModules > 0;
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

              const inner = (
                <div className="flex items-center justify-between gap-4 p-4 sm:p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-slate-900">{lang.label}</h2>
                      {!seeded && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          Coming soon
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{lang.description}</p>
                    {seeded && (
                      <dl className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <dt className="sr-only">Problems solved</dt>
                          <dd>
                            {completed} / {total} solved
                          </dd>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-slate-400" />
                          <dt className="sr-only">Modules</dt>
                          <dd>
                            {moduleCount} module{moduleCount === 1 ? '' : 's'}
                          </dd>
                        </div>
                        <dt className="sr-only">Progress</dt>
                        <dd className="text-slate-400">{pct}% complete</dd>
                      </dl>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-sm font-medium text-blue-600">
                    {seeded ? (started ? 'Continue' : 'Start')  : 'Notify me'}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              );

              return (
                <li key={lang.id}>
                  {seeded ? (
                    <Link
                      to={`/learn/${lang.id}`}
                      className="block transition-colors hover:bg-slate-50"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className={cn('cursor-not-allowed opacity-60')}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
