import { api } from './api';
import type { ProblemLanguage } from '@learncode/types';

export interface RunCodeResult {
  output: string;
  /** Compile error, runtime panic, or sys.stderr content from the user's run. */
  stderr: string | null;
}

// Calls POST /run for languages that can't execute in the browser
// (Java, Rust). The route runs the user's code on the API server via
// the same dispatcher used by /progress/submit, but without test
// cases — just `output` + `stderr` back.
export function runOnServer(language: ProblemLanguage, code: string): Promise<RunCodeResult> {
  return api.post<RunCodeResult>('/run', { language, code });
}
