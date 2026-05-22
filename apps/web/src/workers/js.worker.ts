/// <reference lib="webworker" />

// Client-side JavaScript runner. Mirrors the message protocol of
// pyodide.worker.ts: payload arrives with { requestId, code }, response
// posts { requestId, output, stderr, error }. The worker is sandboxed
// from the main thread (no DOM, no parent storage), so user code
// running here can't touch the rest of the app. It CAN still do
// network calls via fetch/XHR — that's the same risk envelope as the
// Pyodide worker.

function stringify(v: unknown): string {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

self.onmessage = async (event: MessageEvent) => {
  const { requestId, code } = event.data as { requestId: number; code: string };

  let stdout = '';
  let stderr: string | null = null;

  // Capture console.* by shadowing the worker's console inside the
  // user's evaluation scope. We only intercept the four most-used
  // methods; everything else (assert, trace, etc.) is rare in learner
  // code and can be added later.
  const captureConsole = {
    log: (...args: unknown[]) => {
      stdout += args.map(stringify).join(' ') + '\n';
    },
    info: (...args: unknown[]) => {
      stdout += args.map(stringify).join(' ') + '\n';
    },
    warn: (...args: unknown[]) => {
      stderr = (stderr ?? '') + args.map(stringify).join(' ') + '\n';
    },
    error: (...args: unknown[]) => {
      stderr = (stderr ?? '') + args.map(stringify).join(' ') + '\n';
    },
  };

  try {
    // new Function(...) gives a fresh global-like scope and a name for
    // the error stack ("Function" / <anonymous>) rather than leaking
    // the worker's own filename.
    const fn = new Function('console', code);
    const result = fn(captureConsole);
    // Support top-level await indirectly: if the body returned a thenable,
    // wait for it before we report success.
    if (result && typeof (result as { then?: unknown }).then === 'function') {
      await result;
    }
    self.postMessage({ requestId, output: stdout, stderr, error: null });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? (err.stack ?? err.message) : String(err);
    self.postMessage({
      requestId,
      output: stdout,
      stderr: (stderr ? stderr + '\n' : '') + message,
      error: null,
    });
  }
};
