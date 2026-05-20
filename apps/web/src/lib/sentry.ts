import * as Sentry from '@sentry/react';
import type { User } from '@learncode/types';

let initialized = false;

export function initSentry(): void {
  if (initialized) return;
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: (import.meta.env.VITE_SENTRY_ENVIRONMENT as string | undefined) ?? import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE as string | undefined,
    tracesSampleRate: 0,
    sendDefaultPii: true,
  });
  initialized = true;
}

export function isSentryEnabled(): boolean {
  return initialized;
}

export function identifyUser(user: User): void {
  if (!initialized) return;
  Sentry.setUser({ id: String(user.id), email: user.email });
}

export function clearUser(): void {
  if (!initialized) return;
  Sentry.setUser(null);
}

export { Sentry };
