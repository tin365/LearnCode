import { useState } from 'react';
import { Link } from 'react-router-dom';
import { passwordResetRequestSchema } from '@learncode/validators';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const parsed = passwordResetRequestSchema.safeParse({ email });
    if (!parsed.success) {
      setError('Enter a valid email');
      return;
    }
    try {
      await api.post('/auth/password-reset/request', parsed.data);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="space-y-3 text-sm text-slate-600">
              <p>
                If an account exists for <strong>{email}</strong>, we've sent a reset link
                that expires in 1 hour. Check your inbox (and spam folder).
              </p>
              <p>
                Don't see it? You may have signed up with Google or Facebook — try the{' '}
                <Link to="/login" className="text-primary hover:underline">
                  login page
                </Link>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Send reset link
              </Button>
            </form>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
