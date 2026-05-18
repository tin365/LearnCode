import { useQuery } from '@tanstack/react-query';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type { Problem, Progress } from '@learncode/types';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { ProblemList } from '@/components/problems/ProblemList';
import { Sidebar } from '@/components/layout/Sidebar';

function getDisplayName(email: string): string {
  return email.split('@')[0];
}

export function Dashboard() {
  const user = useAuthStore((s) => s.user);

  const { data: problems = [], isLoading: loadingProblems } = useQuery({
    queryKey: ['problems'],
    queryFn: () => api.get<Problem[]>('/problems'),
  });

  const { data: progress = [], isLoading: loadingProgress } = useQuery({
    queryKey: ['progress'],
    queryFn: () => api.get<Progress[]>('/progress'),
  });

  const completed = progress.filter((p) => p.passed).length;
  const displayName = user ? getDisplayName(user.email) : '';

  return (
    <div className="h-screen overflow-hidden">
      <PanelGroup direction="horizontal" className="h-full">
        <Panel defaultSize={18} minSize={15} maxSize={25}>
          <Sidebar />
        </Panel>
        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/30" />
        <Panel defaultSize={82} minSize={50}>
          <main className="h-full overflow-auto bg-slate-50 p-6">
            <div className="mx-auto max-w-5xl">
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Welcome back, {displayName}</h1>
                <p className="text-sm text-muted-foreground">
                  Pick up where you left off, or browse modules in the sidebar.
                </p>
              </div>

              {completed === 0 && !loadingProgress && (
                <div className="mb-6 rounded-md border border-blue-100 bg-blue-50 p-4">
                  <h2 className="mb-1 font-semibold text-blue-900">Welcome to LearnCode 👋</h2>
                  <p className="text-sm text-blue-800">
                    Start with <strong>Hello, World!</strong> below — it'll take 30 seconds. Each
                    problem unlocks the next.
                  </p>
                </div>
              )}

              <h2 className="mb-4 text-lg font-semibold">Python Problems</h2>
              {loadingProblems || loadingProgress ? (
                <p className="text-muted-foreground">Loading problems…</p>
              ) : (
                <ProblemList problems={problems} progress={progress} />
              )}
            </div>
          </main>
        </Panel>
      </PanelGroup>
    </div>
  );
}
