import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import type { Lesson } from '@learncode/types';
import { api } from '@/lib/api';
import { SectionRenderer } from './SectionRenderer';

interface LessonViewProps {
  moduleId: number;
  onContinue: () => void;
}

export function LessonView({ moduleId, onContinue }: LessonViewProps) {
  const queryClient = useQueryClient();

  const { data: lesson, isLoading, error } = useQuery<Lesson, Error>({
    queryKey: ['lesson', moduleId],
    queryFn: () => api.get<Lesson>(`/modules/${moduleId}/lesson`),
    enabled: moduleId > 0,
    retry: false,
  });

  const completeMutation = useMutation({
    mutationFn: () => api.post<{ readAt: string }>(`/modules/${moduleId}/lesson/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson', moduleId] });
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      onContinue();
    },
  });

  if (isLoading) return <LessonSkeleton />;

  if (error || !lesson) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <BookOpen className="h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-700">No lesson yet for this module</p>
        <p className="max-w-sm text-xs text-muted-foreground">
          Lesson content is being authored. You can jump straight to the problem for now.
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Go to problem →
        </button>
      </div>
    );
  }

  const alreadyRead = !!lesson.readAt;

  return (
    <article className="mx-auto h-full max-w-3xl space-y-6 overflow-y-auto p-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {lesson.estimatedMinutes} min read
          </span>
          {lesson.concepts.map((c) => (
            <span key={c} className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
              {c}
            </span>
          ))}
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
      </header>

      <div className="space-y-6">
        {lesson.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>

      <footer className="flex items-center justify-between border-t pt-6">
        <div className="text-sm text-slate-500">
          {alreadyRead ? (
            <span className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              You've read this lesson
            </span>
          ) : (
            "Finished reading?"
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            if (alreadyRead) onContinue();
            else completeMutation.mutate();
          }}
          disabled={completeMutation.isPending}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {alreadyRead ? 'Continue to problem' : "I'm ready — start the problem"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </footer>
    </article>
  );
}

function LessonSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-6 p-6">
      <div className="h-6 w-1/3 rounded bg-slate-100" />
      <div className="h-8 w-2/3 rounded bg-slate-100" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-5/6 rounded bg-slate-100" />
        <div className="h-4 w-4/6 rounded bg-slate-100" />
      </div>
      <div className="h-32 rounded bg-slate-100" />
      <div className="h-32 rounded bg-slate-100" />
    </div>
  );
}
