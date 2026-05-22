import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MobileHeader } from '@/components/layout/MobileHeader';

// Minimal first-pass terms of service. Same caveat as Privacy.tsx —
// have a lawyer review before any monetisation or EU launch.

const LAST_UPDATED = '2026-05-22';
const CONTACT = 'mgtinsan465@gmail.com';

export function Terms() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <MobileHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">
          Terms of Service
        </h1>
        <p className="mt-1 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-slate dark:prose-invert mt-8 max-w-none text-sm text-slate-700 dark:text-slate-300">
          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            What you can use it for
          </h2>
          <p>
            LearnCode is a free learning platform. You can use it to read lessons,
            write code, run it against test cases, and track your own progress. We
            grant you a personal, non-commercial right to use the service.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            What you can't use it for
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Attacking other systems via the code runner (port scanning, DDoS).</li>
            <li>Cryptocurrency mining or other resource-abuse workloads.</li>
            <li>Hosting, transmitting, or generating illegal content.</li>
            <li>
              Bypassing rate limits, sandbox restrictions, or other technical
              protections.
            </li>
            <li>Harvesting other users' data or impersonating other users.</li>
            <li>Submitting solutions you don't have the right to share.</li>
          </ul>
          <p>
            Violating any of these may result in immediate account termination and, in
            severe cases, legal action.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            Your account
          </h2>
          <p>
            You're responsible for keeping your password (or OAuth provider account)
            secure. Notify us immediately at{' '}
            <a href={`mailto:${CONTACT}`} className="text-primary hover:underline">
              {CONTACT}
            </a>{' '}
            if you suspect unauthorised access.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            Content you submit
          </h2>
          <p>
            You retain ownership of code you write. By submitting code to our grader,
            you grant us a temporary licence to execute it on our servers for the sole
            purpose of returning test results to you. We don't store your code on the
            server beyond the duration of a single grading run.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            Service availability
          </h2>
          <p>
            We try to keep the service running but make no guarantees of uptime,
            performance, or accuracy. The service is provided <strong>"as is"</strong>{' '}
            without warranties of any kind.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            Termination
          </h2>
          <p>
            You can delete your account at any time from{' '}
            <Link to="/settings" className="text-primary hover:underline">
              Settings
            </Link>
            . We may suspend or terminate accounts that violate these terms.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            Liability
          </h2>
          <p>
            To the maximum extent permitted by law, our total liability arising out of
            your use of the service is limited to zero — the service is free. We are
            not liable for any indirect, incidental, or consequential damages.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            Changes
          </h2>
          <p>
            We may update these terms. Material changes will be announced via email or
            a banner. Continued use after the notice period counts as acceptance.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            Contact
          </h2>
          <p>
            Questions about these terms:{' '}
            <a href={`mailto:${CONTACT}`} className="text-primary hover:underline">
              {CONTACT}
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
