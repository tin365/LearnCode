import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, Trash2 } from 'lucide-react';
import type { AuthResponse, UserProfile } from '@learncode/types';
import { passwordChangeSchema } from '@learncode/validators';
import { api } from '@/lib/api';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PROVIDER_LABEL: Record<string, string> = {
  google: 'Google',
  facebook: 'Facebook',
};

export function Settings() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  const { data: profile, isLoading, refetch } = useQuery<UserProfile>({
    queryKey: ['auth-me-profile'],
    queryFn: () => api.get<UserProfile>('/auth/me'),
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <MobileHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 md:py-12">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">Settings</h1>

        {isLoading || !profile ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="mt-8 space-y-6">
            <AccountSection profile={profile} />
            <ConnectedProvidersSection profile={profile} />
            {profile.hasPassword && (
              <ChangePasswordSection
                onSuccess={(res) => {
                  setSession(res.accessToken, res.user);
                  toast.success('Password updated. Other devices signed out.');
                }}
              />
            )}
            <DangerZoneSection
              profile={profile}
              onDeleted={() => {
                clearSession();
                navigate('/login?account=deleted', { replace: true });
              }}
              refetch={refetch}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function AccountSection({ profile }: { profile: UserProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-slate-500">Email</span>
          <span className="truncate font-medium">{profile.email}</span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-slate-500">Member since</span>
          <span className="font-medium">
            {new Date(profile.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        {profile.isAdmin && (
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-slate-500">Role</span>
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
              Admin
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ConnectedProvidersSection({ profile }: { profile: UserProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Sign-in methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <Row
          label="Password"
          status={profile.hasPassword ? 'Set' : 'Not set'}
          dim={!profile.hasPassword}
        />
        {(['google', 'facebook'] as const).map((p) => (
          <Row
            key={p}
            label={PROVIDER_LABEL[p]}
            status={profile.connectedProviders.includes(p) ? 'Connected' : 'Not connected'}
            dim={!profile.connectedProviders.includes(p)}
          />
        ))}
        <p className="pt-2 text-xs text-muted-foreground">
          To add or remove a sign-in method, sign in with the provider you want to add, or
          contact support to remove one.
        </p>
      </CardContent>
    </Card>
  );
}

function Row({ label, status, dim }: { label: string; status: string; dim?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-slate-700">{label}</span>
      <span className={dim ? 'text-slate-400' : 'font-medium text-emerald-700'}>
        {status}
      </span>
    </div>
  );
}

function ChangePasswordSection({
  onSuccess,
}: {
  onSuccess: (res: AuthResponse) => void;
}) {
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (newPassword !== confirm) {
      setError("New passwords don't match");
      return;
    }
    const parsed = passwordChangeSchema.safeParse({ currentPassword, newPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Invalid input');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post<AuthResponse>('/auth/password-change', parsed.data);
      onSuccess(res);
      setCurrent('');
      setNew('');
      setConfirm('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Change failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Change password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="current">Current password</Label>
            <Input
              id="current"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrent(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new">New password</Label>
            <Input
              id="new"
              type="password"
              value={newPassword}
              onChange={(e) => setNew(e.target.value)}
              required
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground">
              At least 8 characters, mixing two of: lowercase, uppercase, digits, symbols.
            </p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Update password'}
          </Button>
          <p className="text-xs text-muted-foreground">
            Updating your password signs you out from all other devices.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

function DangerZoneSection({
  profile,
  onDeleted,
  refetch,
}: {
  profile: UserProfile;
  onDeleted: () => void;
  refetch: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const CONFIRM_PHRASE = 'delete my account';

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (confirmText.trim().toLowerCase() !== CONFIRM_PHRASE) {
      setError(`Type "${CONFIRM_PHRASE}" to confirm.`);
      return;
    }
    if (profile.hasPassword && !password) {
      setError('Password is required to delete the account.');
      return;
    }
    setSubmitting(true);
    try {
      await api.del('/auth/me', profile.hasPassword ? { password } : undefined);
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      refetch();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-slate-600">
          Deleting your account removes your profile, all progress, sign-in methods, and
          revealed hints. This is permanent.
        </p>
        {!confirmOpen ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setConfirmOpen(true)}
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete my account
          </Button>
        ) : (
          <form onSubmit={handleDelete} className="space-y-3 rounded-md border border-destructive/30 bg-destructive/5 p-4">
            <div className="space-y-1">
              <Label htmlFor="confirm-text" className="text-destructive">
                Type "{CONFIRM_PHRASE}" to confirm
              </Label>
              <Input
                id="confirm-text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                autoComplete="off"
              />
            </div>
            {profile.hasPassword && (
              <div className="space-y-1">
                <Label htmlFor="delete-password" className="text-destructive">
                  Password
                </Label>
                <Input
                  id="delete-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {submitting ? 'Deleting…' : 'Permanently delete'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setConfirmOpen(false);
                  setConfirmText('');
                  setPassword('');
                  setError('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
