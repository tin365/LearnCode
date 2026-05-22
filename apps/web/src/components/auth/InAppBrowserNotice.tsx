import { useState } from 'react';
import { AlertTriangle, Copy, Check } from 'lucide-react';
import { detectInAppBrowser } from '@/lib/inAppBrowser';

export function InAppBrowserNotice() {
  const [copied, setCopied] = useState(false);
  const detection = detectInAppBrowser();
  if (!detection.isInApp) return null;

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Older webviews don't allow clipboard access without a user-
      // visible select+copy. Silently no-op — the user can long-press
      // the URL bar to copy.
    }
  }

  return (
    <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">
      <div className="flex gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <div className="space-y-2">
          <p className="font-medium">
            You're in {detection.appName}'s in-app browser
          </p>
          <p className="text-xs leading-relaxed">
            Google sign-in is blocked here by Google's security policy. Tap the
            <strong> ⋯ menu</strong> (top right) and choose{' '}
            <strong>Open in browser</strong>. Email + password login still works
            in this view.
          </p>
          <button
            type="button"
            onClick={copyUrl}
            className="inline-flex items-center gap-1 rounded border border-amber-400 bg-white px-2 py-1 text-xs font-medium text-amber-900 hover:bg-amber-100 dark:border-amber-600 dark:bg-amber-900/40 dark:text-amber-100 dark:hover:bg-amber-900/60"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy link
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
