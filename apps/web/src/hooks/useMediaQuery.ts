import { useEffect, useState } from 'react';

// SSR-safe matchMedia wrapper. Returns `false` during the server render
// (Vite serves from `npm run build` SPA, so this only matters in
// non-browser contexts like test runners).
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false,
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    // Resync once on mount in case the initial value drifted (e.g.
    // React strict-mode double-invoke).
    setMatches(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Tailwind's md: breakpoint = 768px. Reuse this constant rather than
// re-typing the query string at every call site so changing the
// breakpoint (and matching the Tailwind config) stays a one-line edit.
export const MOBILE_QUERY = '(max-width: 767px)';
