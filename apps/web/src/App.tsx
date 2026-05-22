import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { bootstrapSession } from '@/lib/api';
import { AppShell } from '@/components/layout/AppShell';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Landing } from '@/pages/Landing';
import { Languages } from '@/pages/Languages';
import { LanguageView } from '@/pages/LanguageView';
import { Workspace } from '@/pages/Workspace';
import { ModuleLesson } from '@/pages/ModuleLesson';
import { OAuthComplete } from '@/pages/OAuthComplete';
import { OAuthError } from '@/pages/OAuthError';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword';

const queryClient = new QueryClient();

function PublicOnly({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrated = useAuthStore((s) => s.hydrated);
  if (!hydrated) return null;
  if (accessToken) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    bootstrapSession().finally(() => setHydrated(true));
  }, [setHydrated]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors closeButton />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnly>
                <Login />
              </PublicOnly>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnly>
                <Register />
              </PublicOnly>
            }
          />
          <Route path="/auth/oauth-complete" element={<OAuthComplete />} />
          <Route path="/auth/oauth-error" element={<OAuthError />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route element={<AppShell />}>
            {/* Landing → Languages → Module-view drill-down */}
            <Route path="/dashboard" element={<Landing />} />
            <Route path="/languages" element={<Languages />} />
            <Route path="/learn/:language" element={<LanguageView />} />
            <Route path="/workspace/:id" element={<Workspace />} />
            <Route path="/module/:moduleId/lesson" element={<ModuleLesson />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
