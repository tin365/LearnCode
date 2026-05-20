import { useAuthStore } from '@/store/authStore';
import { clearUser, identifyUser } from '@/lib/sentry';
import type { RefreshResponse, User } from '@learncode/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let inflightRefresh: Promise<boolean> | null = null;

/**
 * Hit /auth/refresh once. If two concurrent requests both get a 401, they
 * await the same in-flight Promise — calling /auth/refresh twice would
 * trigger the server's replay-detection and log the user out spuriously.
 */
async function refreshAccessToken(): Promise<boolean> {
  if (inflightRefresh) return inflightRefresh;
  inflightRefresh = (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) return false;
      const body = (await res.json()) as RefreshResponse;
      useAuthStore.getState().setAccessToken(body.accessToken);
      return true;
    } catch {
      return false;
    } finally {
      inflightRefresh = null;
    }
  })();
  return inflightRefresh;
}

function extractErrorMessage(body: unknown, fallback: string): string {
  if (typeof body !== 'object' || body === null) return fallback;
  const b = body as Record<string, unknown>;
  // Fastify default 500 shape used `message`; our central handler uses `error`.
  if (typeof b.message === 'string' && b.message !== 'Internal Server Error') {
    return b.message;
  }
  const err = b.error;
  if (typeof err === 'string') return err;
  if (typeof err === 'object' && err !== null) {
    const e = err as Record<string, unknown>;
    if (typeof e.message === 'string') return e.message;
    if (typeof e.fieldErrors === 'object' && e.fieldErrors !== null) {
      const fields = Object.values(e.fieldErrors as Record<string, unknown>).flat();
      if (fields.length > 0) return fields.join(', ');
    }
    return JSON.stringify(err);
  }
  return fallback;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (options.body != null && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (res.status === 401 && !isRetry && path !== '/auth/refresh') {
    const refreshed = await refreshAccessToken();
    if (refreshed) return request<T>(path, options, true);
    useAuthStore.getState().clearSession();
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(extractErrorMessage(body, res.statusText || 'Request failed'));
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
};

/**
 * Run on app start. Tries to recover a session from the HttpOnly refresh
 * cookie. Always resolves — failure just means the user goes to /login.
 */
export async function bootstrapSession(): Promise<void> {
  const refreshed = await refreshAccessToken();
  if (!refreshed) return;
  try {
    const user = await api.get<User>('/auth/me');
    useAuthStore.getState().setUser(user);
    identifyUser(user);
  } catch {
    useAuthStore.getState().clearSession();
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch {
    // Best-effort. Server-side revocation may fail (network down,
    // expired cookie) but we still want to log out locally.
  }
  useAuthStore.getState().clearSession();
  clearUser();
}
