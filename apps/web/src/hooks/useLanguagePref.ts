import { useCallback, useEffect, useState } from 'react';
import type { ProblemLanguage } from '@learncode/types';

const STORAGE_KEY = 'lc:language';

const VALID = new Set<ProblemLanguage>(['python', 'javascript', 'java', 'rust']);

function read(): ProblemLanguage {
  if (typeof window === 'undefined') return 'python';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && VALID.has(stored as ProblemLanguage) ? (stored as ProblemLanguage) : 'python';
}

// Returns the user's currently-selected curriculum language and a
// setter that persists across reloads (and across tabs — the storage
// event keeps multiple tabs in sync).
export function useLanguagePref(): [ProblemLanguage, (next: ProblemLanguage) => void] {
  const [value, setValue] = useState<ProblemLanguage>(read);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = e.newValue;
      setValue(next && VALID.has(next as ProblemLanguage) ? (next as ProblemLanguage) : 'python');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = useCallback((next: ProblemLanguage) => {
    setValue(next);
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return [value, update];
}

// Display the M-number relative to the language's own curriculum,
// stripping the 100-block offset used to keep JS modules from
// colliding with Python in the global @@unique([orderIndex]) on Module.
export function displayOrderIndex(orderIndex: number): number {
  return orderIndex % 100;
}
