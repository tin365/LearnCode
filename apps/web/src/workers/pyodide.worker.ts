/// <reference lib="webworker" />

importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');

let pyodide: { runPythonAsync: (code: string) => Promise<unknown> } | null = null;

async function loadPyodideOnce() {
  if (!pyodide) {
    pyodide = await (self as unknown as { loadPyodide: () => Promise<typeof pyodide> }).loadPyodide();
  }
  return pyodide;
}

interface TestCaseMsg {
  expected: string;
  isHidden: boolean;
  inputData: string;
}

self.onmessage = async (event: MessageEvent) => {
  const { code, testCases, runOnly } = event.data as {
    code: string;
    testCases: TestCaseMsg[];
    runOnly?: boolean;
  };

  try {
    const py = await loadPyodideOnce();
    if (!py) throw new Error('Failed to load Pyodide');

    if (runOnly) {
      let output = '';
      py.runPythonAsync = py.runPythonAsync.bind(py);
      await py.runPythonAsync(`
import sys
from io import StringIO
_stdout = sys.stdout
sys.stdout = StringIO()
`);
      try {
        await py.runPythonAsync(code);
        const captured = await py.runPythonAsync('sys.stdout.getvalue()');
        output = String(captured);
      } finally {
        await py.runPythonAsync('sys.stdout = _stdout');
      }
      self.postMessage({ output, error: null });
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
    self.postMessage({ passed: allPassed, results, error: null, output: '' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    self.postMessage({ passed: false, results: [], error: message, output: '' });
  }
};
