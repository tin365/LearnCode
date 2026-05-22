import { useEffect, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Code2, Lightbulb } from 'lucide-react';
import type { HintsState, Lesson } from '@learncode/types';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { LessonView } from '@/components/lessons/LessonView';
import { ProblemView } from '@/components/problems/ProblemView';
import { HintsView } from '@/components/problems/HintsView';

type Tab = 'learn' | 'problem' | 'hints';

interface LearningPanelProps {
  problemId: number;
  moduleId: number;
}

export function LearningPanel({ problemId, moduleId }: LearningPanelProps) {
  const { data: lesson } = useQuery<Lesson, Error>({
    queryKey: ['lesson', moduleId],
    queryFn: () => api.get<Lesson>(`/modules/${moduleId}/lesson`),
    enabled: moduleId > 0,
    retry: false,
  });

  const { data: hintsState } = useQuery<HintsState>({
    queryKey: ['hints-state', problemId],
    queryFn: () => api.get<HintsState>(`/problems/${problemId}/hints-state`),
    enabled: problemId > 0,
  });

  const lessonRead = !!lesson?.readAt;
  const lessonExists = !!lesson;

  // Default tab: Learn first time, Problem if lesson already read (or no lesson).
  // Resets per problem so each new problem starts at the user's "next" task.
  const [tab, setTab] = useState<Tab>(lessonRead || !lessonExists ? 'problem' : 'learn');

  useEffect(() => {
    setTab(lessonRead || !lessonExists ? 'problem' : 'learn');
  }, [problemId, lessonRead, lessonExists]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex border-b bg-white dark:bg-slate-900 px-2">
        <TabButton
          active={tab === 'learn'}
          onClick={() => setTab('learn')}
          icon={<BookOpen className="h-4 w-4" />}
          label="Learn"
          badge={lessonExists && !lessonRead ? 'New' : undefined}
        />
        <TabButton
          active={tab === 'problem'}
          onClick={() => setTab('problem')}
          icon={<Code2 className="h-4 w-4" />}
          label="Problem"
        />
        <TabButton
          active={tab === 'hints'}
          onClick={() => setTab('hints')}
          icon={<Lightbulb className="h-4 w-4" />}
          label="Hints"
          badge={hintsState && hintsState.total > 0 ? `${hintsState.used}/${hintsState.total}` : undefined}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === 'learn' && (
          <LessonView moduleId={moduleId} onContinue={() => setTab('problem')} />
        )}
        {tab === 'problem' && <ProblemView problemId={problemId} />}
        {tab === 'hints' && <HintsView problemId={problemId} />}
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  badge?: string;
}

function TabButton({ active, onClick, icon, label, badge }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-slate-600 hover:text-slate-900',
      )}
    >
      {icon}
      <span>{label}</span>
      {badge && (
        <span
          className={cn(
            'rounded-full px-1.5 py-0.5 text-xs',
            active ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600',
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
