import { create } from 'zustand';
import type { RunResult } from '@learncode/types';

interface ExecutionState {
  running: boolean;
  output: string;
  lastResult: RunResult | null;
  successScore: number | null;
  submitError: string | null;
  statusMessage: string | null;
  setRunning: (running: boolean) => void;
  setOutput: (output: string) => void;
  setResult: (result: RunResult | null) => void;
  setSuccessScore: (score: number | null) => void;
  setSubmitError: (submitError: string | null) => void;
  setStatusMessage: (statusMessage: string | null) => void;
  reset: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  running: false,
  output: '',
  lastResult: null,
  successScore: null,
  submitError: null,
  statusMessage: null,
  setRunning: (running) => set({ running }),
  setOutput: (output) => set({ output }),
  setResult: (lastResult) => set({ lastResult }),
  setSuccessScore: (successScore) => set({ successScore }),
  setSubmitError: (submitError) => set({ submitError }),
  setStatusMessage: (statusMessage) => set({ statusMessage }),
  reset: () =>
    set({
      running: false,
      output: '',
      lastResult: null,
      successScore: null,
      submitError: null,
      statusMessage: null,
    }),
}));
