import { useQuery } from '@tanstack/react-query';
import type { Problem, Progress } from '@learncode/types';
import { api } from '@/lib/api';
import { HintBox } from '@/components/problems/HintBox';

interface HintsViewProps {
  problemId: number;
}

export function HintsView({ problemId }: HintsViewProps) {
  const { data: problem, isLoading } = useQuery({
    queryKey: ['problem', problemId],
    queryFn: () => api.get<Problem>(`/problems/${problemId}`),
    enabled: problemId > 0,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['progress'],
    queryFn: () => api.get<Progress[]>('/progress'),
  });

  if (isLoading || !problem) {
    return <div className="p-6 text-sm text-muted-foreground">Loading hints…</div>;
  }

  const hintsUsed = progress.find((p) => p.problemId === problemId)?.hintsUsed ?? 0;

  return (
    <div className="p-6">
      <HintBox problemId={problem.id} hints={problem.hints} hintsUsed={hintsUsed} />
    </div>
  );
}
