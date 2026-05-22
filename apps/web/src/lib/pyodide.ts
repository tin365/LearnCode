import type { RunResult, TestResult } from '@learncode/types';

export interface TestCasePayload {
  expected: string;
  isHidden: boolean;
  inputData: string;
}

let worker: Worker | null = null;
let nextRequestId = 0;

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('../workers/pyodide.worker.ts', import.meta.url), {
      type: 'classic',
    });
  }
  return worker;
}

// Shared request/response over the singleton Pyodide worker. Each call
// gets its own requestId so concurrent in-flight requests don't see each
// other's responses (the worker echoes the id back).
function sendWorkerRequest<T>(
  payload: Record<string, unknown>,
  parse: (data: { passed?: boolean; results?: unknown[]; output?: string; error?: string | null }) => T,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const w = getWorker();
    const requestId = ++nextRequestId;

    const onMessage = (event: MessageEvent) => {
      if (event.data?.requestId !== requestId) return;
      w.removeEventListener('message', onMessage);
      w.removeEventListener('error', onError);
      resolve(parse(event.data));
    };

    const onError = (err: ErrorEvent) => {
      w.removeEventListener('message', onMessage);
      w.removeEventListener('error', onError);
      reject(err);
    };

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

export function runPythonCode(code: string): Promise<{ output: string; error: string | null }> {
  return sendWorkerRequest({ code, testCases: [], runOnly: true }, (data) => ({
    output: data.output || '',
    error: data.error || null,
  }));
}
