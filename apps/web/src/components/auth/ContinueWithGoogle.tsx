const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function ContinueWithGoogle() {
  return (
    <a
      href={`${API_URL}/auth/google`}
      className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-300 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:bg-slate-950"
    >
      <GoogleMark className="h-4 w-4" />
      Continue with Google
    </a>
  );
}

// Official Google "G" mark as inline SVG so we don't depend on a CDN.
function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.49h4.84A4.14 4.14 0 0 1 12 13.56v2.27h2.92A8.78 8.78 0 0 0 17.64 9.2z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.17l-2.92-2.27c-.81.54-1.84.86-3.04.86a5.27 5.27 0 0 1-4.95-3.64H1.04v2.29A8.99 8.99 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M4.05 10.78A5.4 5.4 0 0 1 3.77 9c0-.62.11-1.22.28-1.78V4.93H1.04A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.07l3.09-2.29z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.97 8.97 0 0 0 9 0 8.99 8.99 0 0 0 .96 4.93l3.09 2.29A5.27 5.27 0 0 1 9 3.58z"
      />
    </svg>
  );
}
