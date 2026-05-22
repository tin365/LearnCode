import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'lc:theme';
const DARK_MEDIA = '(prefers-color-scheme: dark)';

function read(): Theme {
  if (typeof window === 'undefined') return 'light';
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'light';
}

/** Resolve a Theme to the concrete light/dark string the page should
 *  actually render as. 'system' consults the user's OS preference. */
function resolve(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia(DARK_MEDIA).matches ? 'dark' : 'light';
  }
  return theme;
}

function applyToDocument(resolved: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

// Apply the persisted theme before React mounts so the first paint
// already matches user preference — avoids the "flash of light" you
// get if the dark class is added after hydration. Called from
// main.tsx. Exposed as a module-level side-effect-free function so
// it doesn't run automatically on import.
export function applyStoredTheme(): void {
  applyToDocument(resolve(read()));
}

/** Stateful theme accessor for components that want to render a
 *  toggle or read the current value. */
export function useTheme(): [Theme, (next: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(read);

  // Apply changes to <html>. Re-evaluate when 'system' is selected
  // and the OS preference flips (e.g. macOS auto-switches at sunset).
  useEffect(() => {
    applyToDocument(resolve(theme));
    if (theme !== 'system') return;
    const mql = window.matchMedia(DARK_MEDIA);
    const onChange = () => applyToDocument(resolve('system'));
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [theme]);

  // Cross-tab sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = e.newValue;
      setTheme(next === 'light' || next === 'dark' || next === 'system' ? next : 'system');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = useCallback((next: Theme) => {
    setTheme(next);
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return [theme, update];
}
