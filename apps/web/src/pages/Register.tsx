import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { AuthResponse } from '@learncode/types';
import { registerSchema } from '@learncode/validators';
import { api } from '@/lib/api';
import { identifyUser } from '@/lib/sentry';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthShell } from '@/components/auth/AuthShell';
import { ContinueWithGoogle } from '@/components/auth/ContinueWithGoogle';
import { ContinueWithFacebook } from '@/components/auth/ContinueWithFacebook';
import { InAppBrowserNotice } from '@/components/auth/InAppBrowserNotice';

export function Register() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const parsed = registerSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Invalid input');
      return;
    }
    try {
      const res = await api.post<AuthResponse>('/auth/register', parsed.data);
      setSession(res.accessToken, res.user);
      identifyUser(res.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <AuthShell
      eyebrow="Free, forever"
      headline={
        <>
          Start free today.
          <br />
          Stay free as we grow.
        </>
      }
      subheadline="Create an account in seconds. Get every current and future track at zero cost — and an email the day each new track lands."
    >
      <Card className="w-full shadow-xl shadow-blue-500/5">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create your free account</CardTitle>
          <p className="text-sm text-muted-foreground">
            No credit card. No trial timer. Just learning.
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
            or sign up with email
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <p className="text-xs text-muted-foreground">
                At least 8 characters with a mix of letter types
              </p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Create my account
            </Button>
            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              By signing up you agree to our{' '}
              <Link to="/terms" className="underline hover:text-foreground">Terms</Link>{' '}and{' '}
              <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
            </p>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
