import { create } from 'zustand';
import type { User } from '@learncode/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  hydrated: boolean;
  setSession: (accessToken: string, user: User) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  setHydrated: (hydrated: boolean) => void;
  clearSession: () => void;
}

// Stale data from the old single-JWT storage scheme. Remove on module
// load so old sessions never resurface after the auth refactor.
if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  hydrated: false,
  setSession: (accessToken, user) => set({ accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  setHydrated: (hydrated) => set({ hydrated }),
  clearSession: () => set({ accessToken: null, user: null }),
}));
