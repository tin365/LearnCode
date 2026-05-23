import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { AuthResponse } from '@learncode/types';
import { loginSchema } from '@learncode/validators';
import { api } from '@/lib/api';
import { identifyUser } from '@/lib/sentry';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthShell, ComingSoonStrip } from '@/components/auth/AuthShell';
import { ContinueWithGoogle } from '@/components/auth/ContinueWithGoogle';
import { ContinueWithFacebook } from '@/components/auth/ContinueWithFacebook';
import { InAppBrowserNotice } from '@/components/auth/InAppBrowserNotice';

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const oauthError = searchParams.get('oauth_error');
  const passwordReset = searchParams.get('password_reset');
  const accountState = searchParams.get('account');
  const [error, setError] = useState(
    oauthError ? 'Google sign in failed. Try again or use email and password.' : '',
  );
  const notice =
    passwordReset === 'ok'
      ? 'Password updated. Log in with your new password.'
      : accountState === 'deleted'
        ? 'Your account has been permanently deleted. Thanks for trying LearnCode.'
        : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError('Invalid email or password');
      return;
    }
    try {
      const res = await api.post<AuthResponse>('/auth/login', parsed.data);
      setSession(res.accessToken, res.user);
      identifyUser(res.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <AuthShell>
      <Card className="w-full max-w-md shadow-2xl shadow-blue-500/10">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl tracking-tight">Welcome back</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in to pick up where you left off.
          </p>
        </CardHeader>
        <CardContent>
          <InAppBrowserNotice />
          <div className="space-y-2">
            <ContinueWithGoogle />
            <ContinueWithFacebook />
          </div>
          <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            or
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {notice && <p className="text-sm text-emerald-700 dark:text-emerald-400">{notice}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Log in
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            New here?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create a free account
            </Link>
          </p>

          <ComingSoonStrip />
        </CardContent>
      </Card>
    </AuthShell>
  );
}
