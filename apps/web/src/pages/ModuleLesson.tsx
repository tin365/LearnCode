import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate as RouterNavigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import type { Lesson, ModuleWithProgress } from '@learncode/types';
import { api } from '@/lib/api';
import { SectionRenderer } from '@/components/lessons/SectionRenderer';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { ErrorState } from '@/components/ui/ErrorState';

export function ModuleLesson() {
  const { moduleId: moduleIdParam } = useParams();
  const moduleId = Number(moduleIdParam);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: lesson,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery<Lesson, Error>({
    queryKey: ['lesson', moduleId],
    queryFn: () => api.get<Lesson>(`/modules/${moduleId}/lesson`),
    enabled: Number.isFinite(moduleId) && moduleId > 0,
    retry: false,
  });

  const { data: modules = [] } = useQuery<ModuleWithProgress[]>({
    queryKey: ['modules'],
    queryFn: () => api.get<ModuleWithProgress[]>('/modules'),
  });

  const completeMutation = useMutation({
    mutationFn: () => api.post<{ readAt: string }>(`/modules/${moduleId}/lesson/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson', moduleId] });
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      // Streak counts lesson reads — refresh.
      queryClient.invalidateQueries({ queryKey: ['me-stats'] });
    },
  });

  if (!Number.isFinite(moduleId) || moduleId <= 0) {
    return <RouterNavigate to="/dashboard" replace />;
  }

  if (isLoading) return <ReadingViewSkeleton />;

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <MobileHeader />
        <ErrorState
          title="Couldn't load this lesson"
          message={error?.message ?? null}
          onRetry={refetch}
          retrying={isFetching}
        />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 p-6 text-center">
        <BookOpen className="h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-700">No lesson for this module</p>
        <Link
          to="/dashboard"
          className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const currentMod = modules.find((m) => m.id === moduleId);
  const nextMod = currentMod
    ? modules.find((m) => m.orderIndex === currentMod.orderIndex + 1)
    : undefined;

  // Continue logic:
  //  - If the current module has problems, go to its first problem.
  //    (Foundational modules don't, so this skips to the next module.)
  //  - Else, if there is a next module with problems, go to its first problem.
  //  - Else, go to dashboard.
  const continueTarget = (() => {
    if (currentMod && currentMod.problems.length > 0) {
      return {
        kind: 'problem' as const,
        id: currentMod.problems[0].id,
        label: 'Start the problem',
        mobileLabel: 'Start the problem',
      };
    }
    if (nextMod && nextMod.problems.length > 0) {
      return {
        kind: 'problem' as const,
        id: nextMod.problems[0].id,
        label: `Continue to ${nextMod.title}`,
        mobileLabel: 'Continue to next module',
      };
    }
    if (nextMod) {
      return {
        kind: 'lesson' as const,
        id: nextMod.id,
        label: `Continue to ${nextMod.title}`,
        mobileLabel: 'Continue to next module',
      };
    }
    return {
      kind: 'dashboard' as const,
      label: 'Back to dashboard',
      mobileLabel: 'Back to dashboard',
    };
  })();

  const alreadyRead = !!lesson.readAt;

  const handleContinue = async () => {
    if (!alreadyRead) await completeMutation.mutateAsync();
    if (continueTarget.kind === 'problem') navigate(`/workspace/${continueTarget.id}`);
    else if (continueTarget.kind === 'lesson') navigate(`/module/${continueTarget.id}/lesson`);
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MobileHeader />
      <header className="sticky top-0 z-10 hidden border-b bg-white md:block">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <BookOpen className="h-4 w-4" />
            <span className="truncate">Reading: {lesson.title}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-10">
        <div className="mb-8">
          <div className="mb-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            <span>{lesson.estimatedMinutes} minute read</span>
            {alreadyRead && (
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Read
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{lesson.title}</h1>
          {lesson.concepts.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {lesson.concepts.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {lesson.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 rounded-lg border bg-white p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">
              {continueTarget.kind === 'dashboard'
                ? "You've finished the curriculum!"
                : `Up next: ${continueTarget.label.replace(/^(Start|Continue) (to |the )?/, '')}`}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {alreadyRead
                ? "You've already read this lesson — pick up where you left off."
                : "Mark this lesson as read and move on when you're ready."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            disabled={completeMutation.isPending}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <span className="md:hidden">{continueTarget.mobileLabel}</span>
            <span className="hidden md:inline">{continueTarget.label}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}

function ReadingViewSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl animate-pulse space-y-6 p-10">
        <div className="h-10 w-2/3 rounded bg-slate-100" />
        <div className="h-4 w-1/4 rounded bg-slate-100" />
        <div className="space-y-3">
          <div className="h-32 rounded bg-slate-100" />
          <div className="h-32 rounded bg-slate-100" />
          <div className="h-32 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
