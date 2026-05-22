import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LogOut, Settings as SettingsIcon } from 'lucide-react';
import type { ModuleWithProgress } from '@learncode/types';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function MobileHeader() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: modules = [] } = useQuery<ModuleWithProgress[]>({
    queryKey: ['modules'],
    queryFn: () => api.get<ModuleWithProgress[]>('/modules'),
    enabled: !!user,
  });

  const totals = modules.reduce(
    (acc, m) => ({
      completed: acc.completed + m.completedCount,
      total: acc.total + m.totalCount,
    }),
    { completed: 0, total: 0 },
  );

  const initial = user?.email?.[0]?.toUpperCase() ?? '?';
  const isAdmin = user?.isAdmin ?? false;

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // logout is best-effort: even if the server call fails, drop the
      // local session and bounce the user to /login.
    }
    clearSession();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-3 py-2 md:hidden">
      <Link to="/dashboard" className="flex items-center gap-2">
        <img
          src="/learncode-icon.svg"
          alt="LearnCode"
          className="h-8 w-8 rounded-full"
        />
        <span className="text-sm font-semibold text-slate-900">LearnCode</span>
      </Link>

      <div className="flex items-center gap-2">
        {isAdmin && (
          <span
            title="Admin: bypasses all unlock checks"
            className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800"
          >
            Admin
          </span>
        )}
        <span className="text-xs font-medium">
          <span className="text-emerald-600">{totals.completed}</span>
          <span className="text-slate-400"> / {totals.total} solved</span>
        </span>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
          aria-label="Account menu"
        >
          {initial}
        </button>
        {menuOpen && (
          <>
            {/* Click-outside scrim. Pointer-events-only — visually transparent. */}
            <button
              type="button"
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            />
            <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border bg-white shadow-lg">
              <div className="truncate border-b px-3 py-2 text-xs text-slate-500">
                {user?.email}
              </div>
              <Link
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 border-t px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
