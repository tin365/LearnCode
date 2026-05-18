import { Link } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';
import type { Problem, Progress } from '@learncode/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProblemCardProps {
  problem: Problem;
  progress?: Progress;
  locked: boolean;
}

const difficultyVariant = {
  easy: 'easy' as const,
  medium: 'medium' as const,
  hard: 'hard' as const,
};

export function ProblemCard({ problem, progress, locked }: ProblemCardProps) {
  const completed = progress?.passed;

  const inner = (
    <Card className={cn('transition-shadow', !locked && 'hover:shadow-md', locked && 'opacity-60')}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <CardTitle className="text-base">
          {problem.orderIndex}. {problem.title}
        </CardTitle>
        {locked ? (
          <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : completed ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
        ) : null}
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Badge variant={difficultyVariant[problem.difficulty]}>{problem.difficulty}</Badge>
        {completed && progress && <Badge variant="success">{progress.score} pts</Badge>}
        {locked && <span className="text-xs text-muted-foreground">Complete previous problem to unlock</span>}
      </CardContent>
    </Card>
  );

  if (locked) return inner;
  return <Link to={`/workspace/${problem.id}`}>{inner}</Link>;
}
