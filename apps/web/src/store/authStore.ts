import { create } from 'zustand';
import type { User } from '@learncode/types';

interface AuthState {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrated: false,
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
  hydrate: () => {
    const token = localStorage.getItem('token');
    const raw = localStorage.getItem('user');
    const user = raw ? (JSON.parse(raw) as User) : null;
    set({ token, user, hydrated: true });
  },
}));
