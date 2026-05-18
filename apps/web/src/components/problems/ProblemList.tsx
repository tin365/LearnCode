import type { Problem, Progress } from '@learncode/types';
import { ProblemCard } from './ProblemCard';

interface ProblemListProps {
  problems: Problem[];
  progress: Progress[];
}

function isUnlocked(problems: Problem[], progress: Progress[], orderIndex: number): boolean {
  if (orderIndex === 1) return true;
  const prev = problems.find((p) => p.orderIndex === orderIndex - 1);
  if (!prev) return false;
  return progress.some((pr) => pr.problemId === prev.id && pr.passed);
}

export function ProblemList({ problems, progress }: ProblemListProps) {
  const sorted = [...problems].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((problem) => {
        const prog = progress.find((p) => p.problemId === problem.id);
        const locked = !isUnlocked(sorted, progress, problem.orderIndex);
        return (
          <ProblemCard key={problem.id} problem={problem} progress={prog} locked={locked} />
        );
      })}
    </div>
  );
}
