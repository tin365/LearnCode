import ReactMarkdown from 'react-markdown';
import { useQuery } from '@tanstack/react-query';
import type { Problem } from '@learncode/types';
import { api } from '@/lib/api';
import { markdownComponents } from '@/lib/markdownComponents';
import { VisibleTestCases } from '@/components/problems/VisibleTestCases';

interface ProblemViewProps {
  problemId: number;
}

export function ProblemView({ problemId }: ProblemViewProps) {
  const { data: problem, isLoading } = useQuery({
    queryKey: ['problem', problemId],
    queryFn: () => api.get<Problem>(`/problems/${problemId}`),
    enabled: problemId > 0,
  });

  if (isLoading || !problem) {
    return <div className="p-6 text-sm text-muted-foreground">Loading problem…</div>;
  }

  const difficultyColor =
    problem.difficulty === 'easy'
      ? 'bg-emerald-100 text-emerald-800'
      : problem.difficulty === 'medium'
        ? 'bg-amber-100 text-amber-800'
        : 'bg-red-100 text-red-800';

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs font-medium capitalize ${difficultyColor}`}
        >
          {problem.difficulty}
        </span>
        <h1 className="text-xl font-semibold leading-tight">{problem.title}</h1>
      </div>

      <article className="prose prose-sm max-w-none text-sm leading-relaxed">
        <ReactMarkdown components={markdownComponents}>{problem.description}</ReactMarkdown>
      </article>

      <VisibleTestCases testCases={problem.testCases ?? []} />
    </div>
  );
}
