import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/monaco';
import { initSentry, Sentry } from './lib/sentry';
import { applyStoredTheme } from './hooks/useTheme';
import App from './App';
import './index.css';

// Apply the user's persisted theme before React mounts so the first
// paint matches their preference — avoids the "flash of light" jolt
// dark-mode users get if the class is added after hydration.
applyStoredTheme();

initSentry();

function Fallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Something went wrong.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The error has been reported. Try reloading the page.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Reload
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<Fallback />}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
);
