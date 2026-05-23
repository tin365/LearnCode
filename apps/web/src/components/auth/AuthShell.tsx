import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Atom, Calculator, Network, Sparkles } from 'lucide-react';

const AVAILABLE = [
  { id: 'python', label: 'Python', accent: 'bg-blue-500' },
  { id: 'javascript', label: 'JavaScript', accent: 'bg-yellow-500' },
  { id: 'java', label: 'Java', accent: 'bg-orange-500' },
  { id: 'rust', label: 'Rust', accent: 'bg-red-600' },
];

const COMING_SOON = [
  {
    id: 'dsa',
    label: 'Data Structures & Algorithms',
    blurb: 'From arrays and hash maps to graphs and dynamic programming',
    icon: <Network className="h-4 w-4" />,
  },
  {
    id: 'math',
    label: 'Math for Programmers',
    blurb: 'Linear algebra, discrete math, probability — only what you actually use',
    icon: <Calculator className="h-4 w-4" />,
  },
  {
    id: 'physics',
    label: 'Physics for Engineers',
    blurb: 'Mechanics, waves, and the math models that power game engines',
    icon: <Atom className="h-4 w-4" />,
  },
];

interface AuthShellProps {
  /** The actual form lives here — Login or Register card. */
  children: ReactNode;
  /** Tagline shown above the headline on the marketing panel. */
  eyebrow?: string;
  /** Big headline on the marketing panel. */
  headline?: ReactNode;
  /** One-paragraph sub. */
  subheadline?: string;
}

/**
 * Two-column shell for Login + Register: marketing panel on the left
 * (roadmap, free-forever pitch), form on the right. Single column on
 * mobile so the form stays above the fold.
 */
export function AuthShell({
  children,
  eyebrow = 'Coming this year',
  headline = (
    <>
      Languages today.
      <br />
      Algorithms, math, and physics next.
    </>
  ),
  subheadline = "LearnCode starts where every developer starts — writing real code in real languages. We're building deeper tracks for the concepts that take you from 'I can code' to 'I think like an engineer.'",
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
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

      <main className="relative flex-1">
        {/* Same subtle gradient as the marketing landing for visual continuity. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/60 to-transparent dark:from-blue-950/20"
        />
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-10 md:grid-cols-[1.05fr_1fr] md:gap-14 md:py-16">
          <MarketingPanel
            eyebrow={eyebrow}
            headline={headline}
            subheadline={subheadline}
          />
          <div className="flex w-full items-start">{children}</div>
        </div>
      </main>
    </div>
  );
}

function MarketingPanel({
  eyebrow,
  headline,
  subheadline,
}: {
  eyebrow: string;
  headline: ReactNode;
  subheadline: string;
}) {
  return (
    <aside className="hidden flex-col md:flex">
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
        {headline}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
        {subheadline}
      </p>

      {/* Available-now strip */}
      <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Available now
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {AVAILABLE.map((lang) => (
          <div
            key={lang.id}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <span className={`h-2 w-2 rounded-full ${lang.accent}`} />
            <span className="font-medium">{lang.label}</span>
          </div>
        ))}
      </div>

      {/* Roadmap */}
      <h2 className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Coming next
      </h2>
      <div className="mt-3 space-y-2">
        {COMING_SOON.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-3 rounded-md border border-dashed border-slate-300 bg-white/50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900/40"
          >
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {track.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{track.label}</p>
              <p className="text-xs leading-snug text-slate-500">{track.blurb}</p>
            </div>
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              Soon
            </span>
          </div>
        ))}
      </div>

      {/* Free-forever pledge */}
      <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-900 dark:text-emerald-100">
          <Sparkles className="h-4 w-4" />
          Free now. Free always.
        </p>
        <p className="mt-1 text-xs leading-relaxed text-emerald-800/90 dark:text-emerald-200/80">
          Every track stays free. No credit card, no trial timer. Sign up
          now to be the first to know when a new track launches.
        </p>
      </div>
    </aside>
  );
}
