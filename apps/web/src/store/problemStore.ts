import { create } from 'zustand';
import type { Problem } from '@learncode/types';

interface ProblemState {
  current: Problem | null;
  code: string;
  revealedHintIds: number[];
  setProblem: (problem: Problem) => void;
  setCode: (code: string) => void;
  /** Discard any saved draft and return to the problem's starter code. */
  resetToStarter: () => void;
  revealHint: (hintId: number) => void;
  syncHintsFromProgress: (hints: Problem['hints'], hintsUsed: number) => void;
  reset: () => void;
}

// Per-problem code drafts are stashed in localStorage so a tab close /
// laptop sleep / browser crash doesn't wipe the user's in-progress
// work. Key shape: lc:code:<problemId>. We never persist drafts that
// match the problem's starter code (would just be noise).
const CODE_STORAGE_PREFIX = 'lc:code:';

function loadDraft(problemId: number): string | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    return localStorage.getItem(CODE_STORAGE_PREFIX + problemId);
  } catch {
    return null;
  }
}

function saveDraft(problemId: number, code: string, starter: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    if (code === starter || code === '') {
      localStorage.removeItem(CODE_STORAGE_PREFIX + problemId);
    } else {
      localStorage.setItem(CODE_STORAGE_PREFIX + problemId, code);
    }
  } catch {
    // Quota or disabled storage — silently drop.
  }
}

export const useProblemStore = create<ProblemState>((set, get) => ({
  current: null,
  code: '',
  revealedHintIds: [],
  setProblem: (problem) => {
    // Prefer a saved draft over the starter so the user resumes exactly
    // where they left off. New problems (no draft) fall back to starter.
    const draft = loadDraft(problem.id);
    set({
      current: problem,
      code: draft ?? problem.starterCode,
      revealedHintIds: [],
    });
  },
  setCode: (code) => {
    set({ code });
    const current = get().current;
    if (current) saveDraft(current.id, code, current.starterCode);
  },
  resetToStarter: () => {
    const current = get().current;
    if (!current) return;
    set({ code: current.starterCode });
    saveDraft(current.id, current.starterCode, current.starterCode);
  },
  revealHint: (hintId) =>
    set((s) => ({
      revealedHintIds: s.revealedHintIds.includes(hintId)
        ? s.revealedHintIds
        : [...s.revealedHintIds, hintId],
    })),
  syncHintsFromProgress: (hints, hintsUsed) =>
    set({
      revealedHintIds: [...hints]
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .slice(0, hintsUsed)
        .map((h) => h.id),
    }),
  reset: () => set({ current: null, code: '', revealedHintIds: [] }),
}));
