import type { RunResult, TestResult } from '@learncode/types';

export interface TestCasePayload {
  expected: string;
  isHidden: boolean;
  inputData: string;
}

let worker: Worker | null = null;
let nextRequestId = 0;
// Track in-flight requests so terminateWorker() can reject them all
// cleanly instead of leaving callers' Promises pending forever.
const pendingRejects = new Map<number, (err: Error) => void>();

export class ExecutionStoppedError extends Error {
  constructor() {
    super('Execution stopped');
    this.name = 'ExecutionStoppedError';
  }
}

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('../workers/pyodide.worker.ts', import.meta.url), {
      type: 'classic',
    });
  }
  return worker;
}

// Kill the worker mid-run. Used to escape infinite loops in user code:
// Web Workers expose no cooperative cancellation, so the only way out
// is to terminate and let the next call spin up a fresh worker.
//
// Pyodide cold-start takes ~3s on first use after termination — that's
// the cost of the rescue, and it's still much better than waiting for
// a runaway loop to never finish.
export function terminateWorker(): void {
  if (!worker) return;
  worker.terminate();
  worker = null;
  const err = new ExecutionStoppedError();
  for (const reject of pendingRejects.values()) reject(err);
  pendingRejects.clear();
}

// Shared request/response over the singleton Pyodide worker. Each call
// gets its own requestId so concurrent in-flight requests don't see each
// other's responses (the worker echoes the id back).
function sendWorkerRequest<T>(
  payload: Record<string, unknown>,
  parse: (data: {
    passed?: boolean;
    results?: unknown[];
    output?: string;
    error?: string | null;
    stderr?: string | null;
  }) => T,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const w = getWorker();
    const requestId = ++nextRequestId;

    const cleanup = () => {
      w.removeEventListener('message', onMessage);
      w.removeEventListener('error', onError);
      pendingRejects.delete(requestId);
    };

    const onMessage = (event: MessageEvent) => {
      if (event.data?.requestId !== requestId) return;
      cleanup();
      resolve(parse(event.data));
    };

    const onError = (err: ErrorEvent) => {
      cleanup();
      reject(err);
    };

    pendingRejects.set(requestId, reject);
    w.addEventListener('message', onMessage);
    w.addEventListener('error', onError);
    w.postMessage({ requestId, ...payload });
  });
}

export function runPythonInWorker(
  code: string,
  testCases: TestCasePayload[],
): Promise<RunResult> {
  return sendWorkerRequest({ code, testCases }, (data) => {
    const testResults: TestResult[] = (data.results ?? []).map(
      (r) => r as TestResult,
    );
    return {
      passed: !!data.passed,
      output: data.output || '',
      error: data.error || null,
      testResults,
      score: 0,
    };
  });
}

export interface RunPythonCodeResult {
  output: string;
  /** Worker-level fatal (e.g. Pyodide failed to load). */
  error: string | null;
  /** Python traceback or whatever the user wrote to sys.stderr. */
  stderr: string | null;
}

export function runPythonCode(
  code: string,
  stdin?: string[],
): Promise<RunPythonCodeResult> {
  return sendWorkerRequest({ code, testCases: [], runOnly: true, stdin }, (data) => ({
    output: data.output || '',
    error: data.error || null,
    stderr: data.stderr || null,
  }));
}
