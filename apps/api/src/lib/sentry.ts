import * as Sentry from '@sentry/node';
import { env } from '../config/env.js';

let initialized = false;

// Field names that may carry user secrets — redacted from any Sentry
// event before it's sent. Caught case-insensitively. We're conservative
// here: better to lose a "code" field's value than to ship a
// password-reset token to a third party. Closes TO_UPGRADE.md P1 #14.
const SECRET_FIELD_PATTERN = /^(password|newPassword|token|refreshToken|code|secret|cookie|authorization|client_secret)$/i;

function scrubRecord(record: Record<string, unknown> | undefined): void {
  if (!record) return;
  for (const key of Object.keys(record)) {
    if (SECRET_FIELD_PATTERN.test(key)) {
      record[key] = '[Filtered]';
    }
  }
}

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
    // Without the beforeSend scrubber below, this would also capture
    // request bodies (passwords, reset tokens, OAuth exchange codes)
    // and the Cookie / Authorization headers — Sentry's default
    // pii_denylist doesn't catch our custom field names.
    sendDefaultPii: true,
    beforeSend(event) {
      // Strip secret-y fields from the request body.
      scrubRecord(event.request?.data as Record<string, unknown> | undefined);
      // Strip secret-y fields from query string (e.g. ?code=...).
      scrubRecord(event.request?.query_string as unknown as Record<string, unknown> | undefined);
      // Strip Cookie + Authorization headers (case varies by client).
      scrubRecord(event.request?.headers as Record<string, unknown> | undefined);
      return event;
    },
  });
  initialized = true;
}

export function isSentryEnabled(): boolean {
  return initialized;
}

export { Sentry };
