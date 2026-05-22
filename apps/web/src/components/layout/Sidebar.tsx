import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { ModuleWithProgress } from '@learncode/types';
import { api, logout } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { CollapsibleModuleSidebar } from '@/components/modules/CollapsibleModuleSidebar';

function getDisplayName(email: string): string {
  return email.split('@')[0];
}

function getInitials(email: string): string {
  return email.slice(0, 2).toUpperCase();
}

export function Sidebar() {
  const user = useAuthStore((s) => s.user);

  const { data: modules = [] } = useQuery({
    queryKey: ['modules'],
    queryFn: () => api.get<ModuleWithProgress[]>('/modules'),
  });

  const totals = modules.reduce(
    (acc, m) => {
      acc.completed += m.completedCount;
      acc.total += m.totalCount;
      return acc;
    },
    { completed: 0, total: 0 },
  );

  const email = user?.email ?? '';

  return (
    <aside className="flex h-full flex-col border-r bg-slate-50">
      <div className="border-b p-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img
            src="/learncode.svg"
            alt="LearnCode"
            className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
          />
          <span className="text-lg font-bold text-primary">LearnCode</span>
        </Link>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {getInitials(email)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium">{getDisplayName(email)}</p>
              {user?.isAdmin && (
                <span
                  title="Admin: bypasses all unlock checks"
                  className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800"
                >
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {totals.completed} / {totals.total} solved
            </p>
          </div>
        </div>
      </div>

      <CollapsibleModuleSidebar />

      <div className="border-t p-3">
        <Button variant="outline" size="sm" className="w-full" onClick={() => void logout()}>
          Log out
        </Button>
      </div>
    </aside>
  );
}
