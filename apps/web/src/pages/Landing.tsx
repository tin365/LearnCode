import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Flame, Trophy } from 'lucide-react';
import type { ModuleWithProgress, ProblemLanguage, UserStats } from '@learncode/types';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { ErrorState } from '@/components/ui/ErrorState';
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

function StreakBanner({ stats }: { stats: UserStats }) {
  // Three states, decided by how recently the user was active:
  //   - active today or yesterday → flame + count
  //   - never active or lapsed >= 2 days → call-to-action
  //   - everything else → covered by the "active" branch above

  if (stats.currentStreak === 0) {
    // First-time or lapsed. Show an inviting "start your streak" card
    // rather than a sad zero — keeps the page from feeling punishing.
    return (
      <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <Flame className="h-6 w-6 shrink-0 text-slate-300" />
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {stats.longestStreak > 0
                ? 'Restart your streak today'
                : 'Solve a problem today to start your streak'}
            </p>
            <p className="text-xs text-slate-500">
              {stats.longestStreak > 0
                ? `Your longest run so far: ${stats.longestStreak} day${stats.longestStreak === 1 ? '' : 's'}.`
                : 'One problem a day keeps the muscle memory sharp.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10 grid gap-3 sm:grid-cols-3">
      <Stat
        icon={<Flame className="h-5 w-5 text-orange-500" />}
        label="Current streak"
        value={`${stats.currentStreak} day${stats.currentStreak === 1 ? '' : 's'}`}
        emphasis
      />
      <Stat
        icon={<Trophy className="h-5 w-5 text-amber-500" />}
        label="Longest streak"
        value={`${stats.longestStreak} day${stats.longestStreak === 1 ? '' : 's'}`}
      />
      <Stat
        label="Total solved"
        value={`${stats.totalSolved}`}
      />
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
  emphasis,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-white p-4',
        emphasis ? 'border-orange-200 bg-orange-50/40' : 'border-slate-200',
      )}
    >
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export function Landing() {
  const user = useAuthStore((s) => s.user);
  const [lastLanguage] = useLanguagePref();

  // Landing falls through to render even before /modules resolves — the
  // chips just show as "Coming soon" briefly until data arrives. Only the
  // error case needs a dedicated branch.
  const {
    data: modules = [],
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['modules'],
    queryFn: () => api.get<ModuleWithProgress[]>('/modules'),
  });

  const { data: stats } = useQuery({
    queryKey: ['me-stats'],
    queryFn: () => api.get<UserStats>('/me/stats'),
  });

  // Aggregate per-language progress for the chip row at the bottom.
  const byLanguage = useMemo(() => {
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
    if (byLanguage.has(lastLanguage)) return lastLanguage;
    for (const lang of LANGUAGES) {
      const s = byLanguage.get(lang.id);
      if (s && s.completed > 0) return lang.id;
    }
    for (const lang of LANGUAGES) {
      if (byLanguage.has(lang.id)) return lang.id;
    }
    return null;
  }, [byLanguage, lastLanguage]);

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <MobileHeader />
        <ErrorState
          message={error instanceof Error ? error.message : null}
          onRetry={refetch}
          retrying={isFetching}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <MobileHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:py-16">
        {/* Hero */}
        <section className="text-center">
          <img
            src="/learncode-icon.svg"
            alt="LearnCode"
            className="mx-auto mb-4 h-14 w-14 rounded-full"
          />
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

        {/* Streak banner — only renders once stats land so we don't flash
            a confusing "0 day streak" during load. */}
        {stats && <StreakBanner stats={stats} />}

        {/* Per-language progress chips */}
        <section className="mt-12">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Your progress
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {LANGUAGES.map((lang) => {
              const s = byLanguage.get(lang.id);
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
