const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  // Only declare a JSON content type when we actually send a body —
  // Fastify rejects an empty JSON body when this header is set.
  if (options.body != null && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    // Fastify 500s set body.error = "Internal Server Error" (generic) and body.message = actual detail.
    // Check body.message first, then fall back to body.error for 4xx validation errors.
    const err = body.error;
    const message =
      (typeof body.message === 'string' && body.message !== 'Internal Server Error' ? body.message : null) ||
      (typeof err === 'string' ? err : null) ||
      err?.message ||
      (Array.isArray(err?.fieldErrors)
        ? Object.values(err.fieldErrors).flat().join(', ')
        : null) ||
      (typeof err === 'object' ? JSON.stringify(err) : null) ||
      body.message ||
      res.statusText ||
      'Request failed';
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
};
