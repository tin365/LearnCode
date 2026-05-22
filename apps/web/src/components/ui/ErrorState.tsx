import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  /** Short headline shown in bold. Defaults to a generic message. */
  title?: string;
  /** Optional body text, usually the error.message from React Query. */
  message?: string | null;
  /** Click handler for the retry button. Hide the button by omitting this. */
  onRetry?: () => void;
  /** Whether the page is currently retrying (disables the button + spins). */
  retrying?: boolean;
  /** Render compactly (inline) instead of full-screen. */
  compact?: boolean;
}

// Standard error UI used by data-fetching pages and panels. Picks the
// right glyph + tone for "network unreachable" vs "something went
// wrong" without callers having to wire it up each time.
export function ErrorState({
  title,
  message,
  onRetry,
  retrying = false,
  compact = false,
}: ErrorStateProps) {
  const looksLikeNetwork =
    typeof message === 'string' &&
    /(network|failed to fetch|load failed|err_network|offline)/i.test(message);

  const Icon = looksLikeNetwork ? WifiOff : AlertTriangle;
  const defaultTitle = looksLikeNetwork
    ? "Can't reach the server"
    : 'Something went wrong';

  const inner = (
    <>
      <Icon className="mb-3 h-10 w-10 text-amber-500" />
      <h2 className="text-base font-semibold text-slate-900">{title ?? defaultTitle}</h2>
      {message && (
        <p className="mt-1 max-w-md text-sm text-slate-600">{message}</p>
      )}
      {onRetry && (
        <Button
          type="button"
          onClick={onRetry}
          disabled={retrying}
          className="mt-4"
          variant="outline"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />
          {retrying ? 'Retrying…' : 'Retry'}
        </Button>
      )}
    </>
  );

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-amber-200 bg-amber-50/40 p-6 text-center">
        {inner}
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
      {inner}
    </div>
  );
}
