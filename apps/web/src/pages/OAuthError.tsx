import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const REASONS: Record<string, string> = {
  email_unverified:
    "Your provider account doesn't have a verified email. Verify it with the provider and try again.",
};

export function OAuthError() {
  const [params] = useSearchParams();
  const provider = params.get('provider');
  const reason = params.get('reason');
  const message =
    (reason && REASONS[reason]) ||
    (provider
      ? `We couldn't sign you in with ${provider}. Try again, or use email and password instead.`
      : "We couldn't complete sign in. Try again, or use email and password instead.");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 text-center">
        <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-amber-500" />
        <h1 className="text-lg font-semibold text-slate-900">Sign in didn't complete</h1>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
