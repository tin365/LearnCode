import type { RunResult, TestResult } from '@learncode/types';

export interface TestCasePayload {
  expected: string;
  isHidden: boolean;
  inputData: string;
}

let worker: Worker | null = null;

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('../workers/pyodide.worker.ts', import.meta.url), {
      type: 'classic',
    });
  }
  return worker;
}

export function runPythonInWorker(
  code: string,
  testCases: TestCasePayload[],
): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const w = getWorker();

    const handler = (event: MessageEvent) => {
      w.removeEventListener('message', handler);
      w.removeEventListener('error', onError);

      const { passed, results, error, output } = event.data;
      const testResults: TestResult[] = (results || []).map(
        (r: { passed: boolean; expected: string; actual: string; hidden: boolean }) => ({
          passed: r.passed,
          expected: r.expected,
          actual: r.actual,
          hidden: r.hidden,
        }),
      );

      resolve({
        passed: !!passed,
        output: output || '',
        error: error || null,
        testResults,
        score: 0,
      });
    };

    const onError = (err: ErrorEvent) => {
      w.removeEventListener('message', handler);
      reject(err);
    };

    w.addEventListener('message', handler);
    w.addEventListener('error', onError);
    w.postMessage({ code, testCases });
  });
}

export function runPythonCode(code: string): Promise<{ output: string; error: string | null }> {
  return new Promise((resolve, reject) => {
    const w = getWorker();

    const handler = (event: MessageEvent) => {
      w.removeEventListener('message', handler);
      resolve({ output: event.data.output || '', error: event.data.error || null });
    };

    w.addEventListener('message', handler);
    w.addEventListener('error', reject);
    w.postMessage({ code, testCases: [], runOnly: true });
  });
}
