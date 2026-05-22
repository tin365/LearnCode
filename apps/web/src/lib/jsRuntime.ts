import { ExecutionStoppedError } from './pyodide';

// Mirrors the singleton-worker pattern from pyodide.ts. Each runtime
// owns its own worker so terminating one doesn't kill the other.

let worker: Worker | null = null;
let nextRequestId = 0;
const pendingRejects = new Map<number, (err: Error) => void>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('../workers/js.worker.ts', import.meta.url), {
      type: 'module',
    });
  }
  return worker;
}

export function terminateJsWorker(): void {
  if (!worker) return;
  worker.terminate();
  worker = null;
  const err = new ExecutionStoppedError();
  for (const reject of pendingRejects.values()) reject(err);
  pendingRejects.clear();
}

export interface RunJsCodeResult {
  output: string;
  error: string | null;
  stderr: string | null;
}

export function runJsCode(code: string): Promise<RunJsCodeResult> {
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
      resolve({
        output: event.data.output ?? '',
        error: event.data.error ?? null,
        stderr: event.data.stderr ?? null,
      });
    };

    const onError = (err: ErrorEvent) => {
      cleanup();
      reject(err);
    };

    pendingRejects.set(requestId, reject);
    w.addEventListener('message', onMessage);
    w.addEventListener('error', onError);
    w.postMessage({ requestId, code });
  });
}
