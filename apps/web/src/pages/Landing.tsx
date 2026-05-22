import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { ModuleWithProgress, ProblemLanguage } from '@learncode/types';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { useLanguagePref } from '@/hooks/useLanguagePref';
import { cn } from '@/lib/utils';

const LANGUAGES: { id: ProblemLanguage; label: string; tagline: string; accent: string }[] = [
  { id: 'python', label: 'Python', tagline: 'Beginner-friendly, batteries included', accent: 'bg-blue-500' },
  { id: 'javascript', label: 'JavaScript', tagline: 'The language of the web', accent: 'bg-yellow-500' },
  { id: 'java', label: 'Java', tagline: 'Class-based, statically typed', accent: 'bg-orange-500' },
  { id: 'rust', label: 'Rust', tagline: 'Memory-safe systems programming', accent: 'bg-red-600' },
];

function displayName(email: string): string {
  return email.split('@')[0];
}

export function Landing() {
  const user = useAuthStore((s) => s.user);
  const [lastLanguage] = useLanguagePref();

  const { data: modules = [] } = useQuery({
    queryKey: ['modules'],
    queryFn: () => api.get<ModuleWithProgress[]>('/modules'),
  });

  // Aggregate per-language progress for the chip row at the bottom.
  const stats = useMemo(() => {
    const acc = new Map<ProblemLanguage, { completed: number; total: number }>();
    for (const m of modules) {
      const cur = acc.get(m.language) ?? { completed: 0, total: 0 };
      cur.completed += m.completedCount;
      cur.total += m.totalCount;
      acc.set(m.language, cur);
    }
    return acc;
  }, [modules]);

  // The "continue" suggestion: prefer the language the user last
  // visited; fall back to whichever language has any progress; else
  // the first available language; else Python.
  const continueTarget: ProblemLanguage | null = useMemo(() => {
    if (stats.has(lastLanguage)) return lastLanguage;
    for (const lang of LANGUAGES) {
      const s = stats.get(lang.id);
      if (s && s.completed > 0) return lang.id;
    }
    for (const lang of LANGUAGES) {
      if (stats.has(lang.id)) return lang.id;
    }
    return null;
  }, [stats, lastLanguage]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <MobileHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:py-16">
        {/* Hero */}
        <section className="text-center">
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Welcome back{user ? `, ${displayName(user.email)}` : ''}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-600 md:text-lg">
            Learn to code in four languages, one bite-sized problem at a time. Pick a
            curriculum to dive in, or pick up where you left off.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {continueTarget ? (
              <Link
                to={`/learn/${continueTarget}`}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Continue {LANGUAGES.find((l) => l.id === continueTarget)?.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
            <Link
              to="/languages"
              className={cn(
                'inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100',
                !continueTarget && 'bg-blue-600 text-white hover:bg-blue-700',
              )}
            >
              Browse all languages
            </Link>
          </div>
        </section>

        {/* Per-language progress chips */}
        <section className="mt-12">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Your progress
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {LANGUAGES.map((lang) => {
              const s = stats.get(lang.id);
              const completed = s?.completed ?? 0;
              const total = s?.total ?? 0;
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
              const seeded = s !== undefined;
              return (
                <Link
                  key={lang.id}
                  to={seeded ? `/learn/${lang.id}` : '/languages'}
                  className={cn(
                    'group rounded-lg border bg-white p-4 transition-shadow',
                    seeded ? 'border-slate-200 hover:shadow-md' : 'border-dashed border-slate-200 opacity-60',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full', lang.accent)} />
                        <span className="font-semibold text-slate-900">{lang.label}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{lang.tagline}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {seeded ? `${completed} / ${total}` : 'Coming soon'}
                    </span>
                  </div>
                  {seeded && (
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={cn(
                          'h-full transition-all',
                          completed === total && total > 0 ? 'bg-emerald-500' : 'bg-blue-500',
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
