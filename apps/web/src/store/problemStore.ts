import { create } from 'zustand';
import type { Problem } from '@learncode/types';

interface ProblemState {
  current: Problem | null;
  code: string;
  revealedHintIds: number[];
  setProblem: (problem: Problem) => void;
  setCode: (code: string) => void;
  revealHint: (hintId: number) => void;
  syncHintsFromProgress: (hints: Problem['hints'], hintsUsed: number) => void;
  reset: () => void;
}

export const useProblemStore = create<ProblemState>((set) => ({
  current: null,
  code: '',
  revealedHintIds: [],
  setProblem: (problem) =>
    set({ current: problem, code: problem.starterCode, revealedHintIds: [] }),
  setCode: (code) => set({ code }),
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
