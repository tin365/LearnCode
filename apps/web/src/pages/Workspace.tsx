import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type { Problem, Progress } from '@learncode/types';
import { api } from '@/lib/api';
import { useProblemStore } from '@/store/problemStore';
import { useExecutionStore } from '@/store/executionStore';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { LearningPanel } from '@/components/layout/LearningPanel';
import { CodePanel } from '@/components/layout/CodePanel';
import { MobileWorkspace } from '@/components/layout/MobileWorkspace';
import { ErrorState } from '@/components/ui/ErrorState';
import { useMediaQuery, MOBILE_QUERY } from '@/hooks/useMediaQuery';

function isUnlocked(problems: Problem[], progress: Progress[], target: Problem): boolean {
  if (target.orderIndex === 1) return true;
  const prev = problems.find(
    (p) => p.moduleId === target.moduleId && p.orderIndex === target.orderIndex - 1,
  );
  // First problem of a module (no in-module predecessor): unlock here; module-level
  // gating is enforced by the sidebar / module-unlock chain.
  if (!prev) return true;
  return progress.some((pr) => pr.problemId === prev.id && pr.passed);
}

export function Workspace() {
  const { id } = useParams();
  const problemId = parseInt(id || '0', 10);
  const setProblem = useProblemStore((s) => s.setProblem);
  const syncHintsFromProgress = useProblemStore((s) => s.syncHintsFromProgress);
  const resetExecution = useExecutionStore((s) => s.reset);
  const isAdmin = useAuthStore((s) => s.user?.isAdmin ?? false);
  const isMobile = useMediaQuery(MOBILE_QUERY);

  const { data: problems = [] } = useQuery({
    queryKey: ['problems'],
    queryFn: () => api.get<Problem[]>('/problems'),
  });

  const {
    data: problem,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['problem', problemId],
    queryFn: () => api.get<Problem>(`/problems/${problemId}`),
    enabled: problemId > 0,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['progress'],
    queryFn: () => api.get<Progress[]>('/progress'),
  });

  // Reset code only when navigating to a different problem, not on background refetches.
  useEffect(() => {
    if (problem) {
      setProblem(problem);
      resetExecution();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem?.id]);

  // Sync revealed hints whenever progress updates (safe — doesn't touch code).
  useEffect(() => {
    if (problem) {
      const prog = progress.find((p) => p.problemId === problem.id);
      syncHintsFromProgress(problem.hints, prog?.hintsUsed ?? 0);
    }
  }, [problem, progress, syncHintsFromProgress]);

  if (!problemId || isNaN(problemId)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">Loading workspace…</div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load this problem"
        message={error instanceof Error ? error.message : null}
        onRetry={refetch}
        retrying={isFetching}
      />
    );
  }

  if (!problem) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!isAdmin && !isUnlocked(problems, progress, problem)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render exactly one of the two layouts. We used to render both with
  // md:hidden / md:block CSS gates, but that double-mounted Monaco, the
  // Sidebar's module query, the LearningPanel's lesson query, etc. —
  // wasteful and a source of subtle duplicate-event bugs.
  if (isMobile) {
    return <MobileWorkspace problemId={problem.id} moduleId={problem.moduleId} />;
  }

  return (
    <div className="h-screen overflow-hidden">
      <PanelGroup direction="horizontal" className="h-full">
        <Panel defaultSize={18} minSize={15} maxSize={25}>
          <Sidebar />
        </Panel>
        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/30" />
        <Panel defaultSize={40} minSize={30}>
          <LearningPanel problemId={problem.id} moduleId={problem.moduleId} />
        </Panel>
        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/30" />
        <Panel defaultSize={42} minSize={30}>
          <CodePanel problemId={problemId} />
        </Panel>
      </PanelGroup>
    </div>
  );
}
