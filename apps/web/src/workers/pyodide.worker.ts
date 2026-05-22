/// <reference lib="webworker" />

// Self-hosted Pyodide v0.25.0. Files live in apps/web/public/pyodide/
// and are served by Cloudflare Pages from the same origin as the app.
// This eliminates the jsdelivr supply-chain risk that came with
// importScripts('https://cdn.jsdelivr.net/...') — see TO_UPGRADE.md P0 #4.
//
// loadPyodide() needs to know where its companion files (asm.js,
// asm.wasm, python_stdlib.zip, pyodide-lock.json) live; the indexURL
// option tells it to look at /pyodide/ instead of the CDN default.
const PYODIDE_BASE = '/pyodide/';
importScripts(`${PYODIDE_BASE}pyodide.js`);

interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdin?: (config: { stdin: () => string | null }) => void;
}

let pyodide: PyodideInstance | null = null;

async function loadPyodideOnce(): Promise<PyodideInstance> {
  if (!pyodide) {
    pyodide = await (
      self as unknown as {
        loadPyodide: (opts: { indexURL: string }) => Promise<PyodideInstance>;
      }
    ).loadPyodide({ indexURL: PYODIDE_BASE });
  }
  return pyodide;
}

interface TestCaseMsg {
  expected: string;
  isHidden: boolean;
  inputData: string;
}

self.onmessage = async (event: MessageEvent) => {
  const { requestId, code, testCases, runOnly, stdin } = event.data as {
    requestId: number;
    code: string;
    testCases: TestCaseMsg[];
    runOnly?: boolean;
    stdin?: string[];
  };

  try {
    const py = await loadPyodideOnce();
    if (!py) throw new Error('Failed to load Pyodide');

    if (runOnly) {
      // Feed input() from a fixed list of lines provided by the user via
      // the stdin panel. Each input() call consumes the next entry.
      // When the queue is empty, returning null raises EOFError in Python
      // — which is what the CPython runtime does at end-of-stdin too.
      const stdinLines = stdin ?? [];
      let stdinIndex = 0;
      py.setStdin?.({
        stdin: () => {
          if (stdinIndex >= stdinLines.length) return null;
          return stdinLines[stdinIndex++];
        },
      });

      // Redirect both stdout and stderr to StringIO buffers so we can
      // post them back separately. Anything Python writes via print()
      // ends up in stdout; tracebacks formatted by sys.excepthook end
      // up in stderr.
      await py.runPythonAsync(`
import sys, io
_stdout, _stderr = sys.stdout, sys.stderr
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

      let runtimeError: string | null = null;
      try {
        await py.runPythonAsync(code);
      } catch (e) {
        // Pyodide turns Python exceptions into JS Errors whose .message
        // is the formatted traceback — perfect for the terminal panel.
        runtimeError = e instanceof Error ? e.message : String(e);
      }

      const stdoutRaw = await py.runPythonAsync('sys.stdout.getvalue()');
      const stderrRaw = await py.runPythonAsync('sys.stderr.getvalue()');
      await py.runPythonAsync('sys.stdout, sys.stderr = _stdout, _stderr');

      // Prefer the traceback from the thrown exception; fall back to
      // whatever the user explicitly wrote to sys.stderr.
      const stderr =
        runtimeError ?? (String(stderrRaw).length > 0 ? String(stderrRaw) : null);

      self.postMessage({
        requestId,
        output: String(stdoutRaw),
        stderr,
        error: null,
      });
      return;
    }

    await py.runPythonAsync(code);

    const results = [];
    for (const tc of testCases) {
      try {
        const actual = String(await py.runPythonAsync(tc.inputData));
        const passed = actual === tc.expected;
        results.push({ passed, expected: tc.expected, actual, hidden: tc.isHidden });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        results.push({ passed: false, expected: tc.expected, actual: message, hidden: tc.isHidden });
      }
    }

    const allPassed = results.every((r) => r.passed);
    self.postMessage({ requestId, passed: allPassed, results, error: null, output: '' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    self.postMessage({ requestId, passed: false, results: [], error: message, output: '' });
  }
};
