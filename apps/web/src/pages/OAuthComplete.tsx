import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthResponse } from '@learncode/types';
import { api } from '@/lib/api';
import { identifyUser } from '@/lib/sentry';
import { useAuthStore } from '@/store/authStore';

// Lands at /auth/oauth-complete?code=… after a successful OAuth flow.
// Swaps the one-time `code` for an access token via POST
// /auth/oauth-exchange. Replaces the previous fragment-based hand-off
// (TO_UPGRADE.md P0 #2) so the access token never appears in URLs,
// history, screenshots, or browser extensions.

export function OAuthComplete() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  // StrictMode invokes effects twice in dev; the exchange code is
  // one-time-use server-side and the second call would always fail,
  // so guard the first one explicitly.
  const consumed = useRef(false);

  useEffect(() => {
    if (consumed.current) return;
    consumed.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    // Strip the code from the address bar so refresh / back-button
    // can't re-attempt the (already-consumed) exchange and trigger an
    // error toast for no reason.
    window.history.replaceState(null, '', '/auth/oauth-complete');

    if (!code) {
      navigate('/login?oauth_error=missing_code', { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await api.post<AuthResponse>('/auth/oauth-exchange', { code });
        setSession(res.accessToken, res.user);
        identifyUser(res.user);
        navigate('/dashboard', { replace: true });
      } catch {
        useAuthStore.getState().clearSession();
        navigate('/login?oauth_error=exchange_failed', { replace: true });
      }
    })();
  }, [navigate, setSession]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-sm text-slate-500">Signing you in…</p>
    </div>
  );
}
