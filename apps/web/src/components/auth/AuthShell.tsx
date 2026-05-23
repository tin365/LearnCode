import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Atom, Calculator, Network, Sparkles } from 'lucide-react';

/**
 * Minimal centered wrapper for Login + Register. Provides the header
 * (logo + back-to-home), a subtle gradient backdrop, and centers
 * whatever card the caller passes in.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Soft gradient backdrop — same blue tone as the marketing
          landing for visual continuity, kept very subtle so the card
          itself stays the focal point. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 dark:from-blue-950/20 dark:via-slate-950 dark:to-slate-950"
      />

      <header className="border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/learncode-icon.svg" alt="" className="h-8 w-8 rounded-full" />
            <span className="text-base font-bold">LearnCode</span>
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10 md:py-16">
        {children}
      </main>
    </div>
  );
}

/**
 * Compact roadmap + free-forever strip that lives at the bottom of
 * the auth card. Sells the "languages now, more coming soon, never
 * paid" pitch without sprawling into a separate column.
 */
export function ComingSoonStrip() {
  return (
    <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        Coming next
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <RoadmapPill icon={<Network className="h-3 w-3" />} label="Algorithms" />
        <RoadmapPill icon={<Calculator className="h-3 w-3" />} label="Math" />
        <RoadmapPill icon={<Atom className="h-3 w-3" />} label="Physics" />
      </div>
      <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            Free forever.
          </span>{' '}
          Sign up to be the first to know when each track launches.
        </span>
      </p>
    </div>
  );
}

function RoadmapPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
      {icon}
      {label}
    </span>
  );
}
