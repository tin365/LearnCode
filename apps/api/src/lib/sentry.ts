import * as Sentry from '@sentry/node';
import { env } from '../config/env.js';

let initialized = false;

export function initSentry(): void {
  if (initialized) return;
  if (!env.SENTRY_DSN) return;

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT ?? env.NODE_ENV,
    release: env.SENTRY_RELEASE,
    // Performance traces are off by default — they consume quota fast.
    // Flip on per-route later if specific endpoints need profiling.
    tracesSampleRate: 0,
    // Auto-capture IP and other request context. Email/userId is set
    // explicitly via Sentry.setUser when a user is authenticated.
    sendDefaultPii: true,
  });
  initialized = true;
}

export function isSentryEnabled(): boolean {
  return initialized;
}

export { Sentry };
