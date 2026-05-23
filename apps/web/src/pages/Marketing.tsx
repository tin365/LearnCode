import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Atom,
  Calculator,
  Code2,
  GraduationCap,
  Lightbulb,
  Network,
  Play,
  Sparkles,
  Zap,
} from 'lucide-react';

const LANGUAGES = [
  {
    id: 'python',
    label: 'Python',
    tagline: 'Beginner-friendly, batteries included',
    accent: 'bg-blue-500',
    modules: 12,
    problems: 60,
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    tagline: 'The language of the web',
    accent: 'bg-yellow-500',
    modules: 12,
    problems: 60,
  },
  {
    id: 'java',
    label: 'Java',
    tagline: 'Class-based, statically typed',
    accent: 'bg-orange-500',
    modules: 12,
    problems: 60,
  },
  {
    id: 'rust',
    label: 'Rust',
    tagline: 'Memory-safe systems programming',
    accent: 'bg-red-600',
    modules: 12,
    problems: 60,
  },
];

const COMING_NEXT = [
  {
    id: 'dsa',
    label: 'Data Structures & Algorithms',
    blurb: 'From arrays and hash maps to graphs and dynamic programming.',
    icon: <Network className="h-5 w-5" />,
  },
  {
    id: 'math',
    label: 'Math for Programmers',
    blurb: 'Linear algebra, discrete math, probability — only what you actually use.',
    icon: <Calculator className="h-5 w-5" />,
  },
  {
    id: 'physics',
    label: 'Physics for Engineers',
    blurb: 'Mechanics, waves, and the math models that power game engines.',
    icon: <Atom className="h-5 w-5" />,
  },
];

const STEPS = [
  {
    n: '1',
    title: 'Pick a language',
    body: 'Python, JavaScript, Java, or Rust. Each has 12 modules and 60 hand-written problems.',
  },
  {
    n: '2',
    title: 'Write code in your browser',
    body: 'A real editor (the same one VS Code uses). Run your code with one click. See test results instantly.',
  },
  {
    n: '3',
    title: 'Get unstuck with hints',
    body: 'Stuck on a problem? Reveal hints one at a time. Each hint costs a few points — never your time.',
  },
];

const FEATURES = [
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Instant feedback',
    body: 'Python and JavaScript run in your browser. No server round-trip, no waiting.',
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    title: 'Hints when stuck',
    body: 'Three escalating hints per problem. The final hint always shows the working approach.',
  },
  {
    icon: <GraduationCap className="h-5 w-5" />,
    title: 'Bite-sized lessons',
    body: 'Every module starts with a short concept page. Then 3–6 problems to lock it in.',
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'Track your streak',
    body: 'Solve one problem a day to build a streak. Watch your total grow.',
  },
];

export function Marketing() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <MarketingHeader />

      <main className="flex-1">
        <Hero />
        <ComingNextSection />
        <LanguagesSection />
        <HowItWorks />
        <FeaturesSection />
        <FinalCta />
      </main>

      <MarketingFooter />
    </div>
  );
}

function MarketingHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/80 backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src="/learncode-icon.svg" alt="" className="h-8 w-8 rounded-full" />
          <span className="text-base font-bold">LearnCode</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            to="/login"
            className="rounded-md px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-md bg-blue-600 px-3 py-1.5 font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60">
      {/* Subtle background gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/60 to-transparent dark:from-blue-950/20"
      />
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Free · No setup · Runs in your browser
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Learn to code, one problem at a time.
          </h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400">
            Hand-written lessons in Python, JavaScript, Java, and Rust. Read a
            short concept, write code in the editor, and see your tests pass
            instantly. No tutorial hell — just problems and progress.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Start learning free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              I already have an account
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            240+ problems · 48 modules · 4 languages
          </p>
        </div>

        <CodeMockup />
      </div>
    </section>
  );
}

function CodeMockup() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-900">
        {/* macOS-style title bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2.5 dark:border-slate-800">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="ml-3 font-mono text-xs text-slate-500">solution.py</span>
        </div>

        {/* Editor body */}
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed">
          <code>
            <span className="text-purple-600 dark:text-purple-400">def</span>{' '}
            <span className="text-blue-600 dark:text-blue-400">greet</span>
            <span className="text-slate-500">(</span>name<span className="text-slate-500">)</span>
            <span className="text-slate-500">:</span>
            {'\n'}
            {'    '}
            <span className="text-purple-600 dark:text-purple-400">return</span>{' '}
            <span className="text-emerald-700 dark:text-emerald-400">
              f"Hello, {'{name}'}!"
            </span>
            {'\n\n'}
            <span className="text-blue-600 dark:text-blue-400">print</span>
            <span className="text-slate-500">(</span>
            greet<span className="text-slate-500">(</span>
            <span className="text-emerald-700 dark:text-emerald-400">"world"</span>
            <span className="text-slate-500">))</span>
          </code>
        </pre>

        {/* Run bar + results */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="inline-flex items-center gap-1 rounded bg-blue-600 px-2 py-0.5 text-white">
              <Play className="h-3 w-3" />
              Run
            </span>
            <span className="text-emerald-700 dark:text-emerald-400">
              ✓ All 3 tests passed
            </span>
          </div>
          <p className="mt-2 font-mono text-xs text-slate-500">
            Hello, world!
          </p>
        </div>
      </div>
    </div>
  );
}

function ComingNextSection() {
  return (
    <section className="border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 md:py-20">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Roadmap
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            Three new tracks on the way.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
            More to learn. Same promise — free, hand-written, no setup.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMING_NEXT.map((track) => (
            <div
              key={track.id}
              className="rounded-lg border border-dashed border-slate-300 bg-white/50 p-5 dark:border-slate-700 dark:bg-slate-900/40"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {track.icon}
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  Soon
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold">{track.label}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {track.blurb}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-600 dark:text-slate-400">
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Create a free account
          </Link>{' '}
          and we'll email you the day each track launches.
        </p>
      </div>
    </section>
  );
}

function LanguagesSection() {
  return (
    <section className="border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 md:py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Four languages. One workspace.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
            Each language has its own track. Switch any time — your progress is
            tracked per language.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.id}
              className="rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${lang.accent}`} />
                <span className="text-base font-semibold">{lang.label}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {lang.tagline}
              </p>
              <p className="mt-4 text-xs font-medium text-slate-500">
                {lang.modules} modules · {lang.problems} problems
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 md:py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
            No setup. No video lectures. Just read, code, and submit.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="relative pl-12">
              <span className="absolute left-0 top-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {step.n}
              </span>
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 md:py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Built for beginners. Made to ship.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                {f.icon}
              </div>
              <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section>
      <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center">
        <Code2 className="mx-auto h-10 w-10 text-blue-600 dark:text-blue-400" />
        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Stop watching tutorials. Start writing code.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
          Free forever for individuals. No credit card. Sign in with Google,
          Facebook, or email.
        </p>
        <Link
          to="/register"
          className="mt-7 inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Create your free account
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} LearnCode. Free to learn, free to use.</p>
        <nav className="flex items-center gap-5">
          <Link to="/privacy" className="hover:text-slate-900 dark:hover:text-slate-200">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-slate-900 dark:hover:text-slate-200">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
