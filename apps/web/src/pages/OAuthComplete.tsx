import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@learncode/types';
import { api } from '@/lib/api';
import { identifyUser } from '@/lib/sentry';
import { useAuthStore } from '@/store/authStore';

export function OAuthComplete() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  // StrictMode invokes effects twice in dev; guard so we only consume the
  // fragment once.
  const consumed = useRef(false);

  useEffect(() => {
    if (consumed.current) return;
    consumed.current = true;

    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get('access');

    // Strip the token from the URL bar immediately so refresh/back-button
    // can't re-leak it.
    window.history.replaceState(null, '', '/auth/oauth-complete');

    if (!accessToken) {
      navigate('/login?oauth_error=missing_token', { replace: true });
      return;
    }

    (async () => {
      try {
        // Hydrate the auth store with the access token so the next /auth/me
        // call carries it in the Authorization header.
        useAuthStore.setState({ accessToken });
        const user = await api.get<User>('/auth/me');
        setSession(accessToken, user);
        identifyUser(user);
        navigate('/dashboard', { replace: true });
      } catch {
        useAuthStore.getState().clearSession();
        navigate('/login?oauth_error=session_fetch_failed', { replace: true });
      }
    })();
  }, [navigate, setSession]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-sm text-slate-500">Signing you in…</p>
    </div>
  );
}
