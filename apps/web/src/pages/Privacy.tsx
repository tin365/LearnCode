import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MobileHeader } from '@/components/layout/MobileHeader';

// Minimal first-pass privacy policy. Sufficient for OAuth provider
// review (Google, Facebook) which require a public Privacy URL. Real
// policy text should be reviewed by a lawyer before any paying-user
// launch or EU traffic — see TO_UPGRADE.md → Compliance/legal.

const LAST_UPDATED = '2026-05-22';
const CONTACT = 'mgtinsan465@gmail.com';

export function Privacy() {
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
          Privacy Policy
        </h1>
        <p className="mt-1 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-slate dark:prose-invert mt-8 max-w-none text-sm text-slate-700 dark:text-slate-300">
          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            What this is
          </h2>
          <p>
            LearnCode is a learning platform where you read lessons, write code, and run
            it against test cases. This page explains what data we collect, why, and what
            you can do about it.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            What we collect
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Email address.</strong> Required for sign-in and password reset.
            </li>
            <li>
              <strong>Provider account ID</strong> (Google, Facebook) if you sign in via
              OAuth. We don't fetch or store profile photos, name, or anything else
              available on the provider account.
            </li>
            <li>
              <strong>Your progress:</strong> which problems you've passed, hints you've
              revealed, scores, and timestamps.
            </li>
            <li>
              <strong>Code you submit:</strong> we run it on the server to grade against
              test cases, and discard the submission itself once tests finish. We do not
              persist your code on our servers; auto-save uses your browser's
              localStorage only.
            </li>
            <li>
              <strong>Session cookies:</strong> a signed HttpOnly cookie holds your
              refresh token so you stay logged in. We do not use tracking cookies.
            </li>
            <li>
              <strong>Error reports</strong> sent to Sentry: stack traces, URL,
              user-agent, and (after filtering) your user ID. Passwords / tokens /
              codes are stripped before transmission.
            </li>
          </ul>

          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            Who we share with
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Sentry</strong> (error tracking) — receives sanitised error events.
            </li>
            <li>
              <strong>Resend</strong> (transactional email) — receives the recipient
              address and the email body when we send a password-reset link.
            </li>
            <li>
              <strong>Neon</strong> (Postgres hosting) — stores your account + progress
              rows. Operated by Neon, governed by their privacy policy.
            </li>
            <li>
              <strong>Cloudflare</strong> + <strong>Render</strong> serve the site and
              API. They see request metadata (IP, user-agent) needed to deliver pages.
            </li>
          </ul>
          <p>
            We do not sell or rent your data to third parties. We don't run advertising.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            How long we keep data
          </h2>
          <p>
            Account data lives as long as your account does. Progress rows stay until
            you delete them (via account deletion). Error reports in Sentry expire on
            Sentry's default retention (currently 90 days for free plans).
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            Your rights
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Delete your account.</strong>{' '}
              <Link to="/settings" className="text-primary hover:underline">
                Settings → Danger zone → Delete my account
              </Link>
              . This permanently removes your profile, progress, OAuth links, and all
              session tokens. There is no undo.
            </li>
            <li>
              <strong>Change your password</strong> any time from Settings.
            </li>
            <li>
              <strong>Request a copy of your data.</strong> Email{' '}
              <a href={`mailto:${CONTACT}`} className="text-primary hover:underline">
                {CONTACT}
              </a>{' '}
              and we'll send a JSON dump within 30 days.
            </li>
          </ul>

          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            Children
          </h2>
          <p>
            LearnCode is not directed at children under 13. We do not knowingly collect
            data from anyone under 13. If you believe a child has registered, email{' '}
            <a href={`mailto:${CONTACT}`} className="text-primary hover:underline">
              {CONTACT}
            </a>{' '}
            and we'll remove the account.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            Changes
          </h2>
          <p>
            We may update this policy. Material changes will be announced via email or
            a banner on the site before they take effect.
          </p>

          <h2 className="mt-6 text-base font-semibold text-slate-900 dark:text-slate-100">
            Contact
          </h2>
          <p>
            Questions, requests, or complaints:{' '}
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
