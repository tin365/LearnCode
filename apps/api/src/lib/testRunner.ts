import { spawnSync } from 'node:child_process';
import type { TestResult } from '@learncode/types';

export interface TestCaseInput {
  expected: string;
  isHidden: boolean;
  inputData: string;
}

export interface RunOutput {
  passed: boolean;
  output: string;
  error: string | null;
  testResults: TestResult[];
}

function formatPythonValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  if (value === null || value === undefined) return String(value);
  if (Array.isArray(value)) return JSON.stringify(value).replace(/"/g, "'");
  return String(value);
}

function runPythonSnippet(userCode: string, expression: string): { ok: boolean; value: string; error?: string } {
  // Use json.dumps directly on the result so the output is proper JSON, not repr().
  // Falls back to str() for non-serializable types (set, tuple, custom objects).
  const script = [
    userCode,
    'import json as __json__',
    '__result__ = ' + expression,
    '__type__ = type(__result__).__name__',
    'try:',
    '    print(__json__.dumps({"v": __result__, "__type__": __type__}))',
    'except TypeError:',
    '    print(__json__.dumps({"v": str(__result__), "__type__": __type__, "__str__": True}))',
  ].join('\n');

  const proc = spawnSync('python3', ['-c', script], {
    encoding: 'utf-8',
    timeout: 5000,
    maxBuffer: 1024 * 1024,
  });

  if (proc.error) {
    return { ok: false, value: '', error: proc.error.message };
  }

  if (proc.status !== 0) {
    return { ok: false, value: '', error: (proc.stderr || proc.stdout || 'Execution failed').trim() };
  }

  const lines = proc.stdout.trim().split('\n').filter(Boolean);
  const jsonLine = [...lines].reverse().find((l) => l.startsWith('{'));

  try {
    const parsed = JSON.parse(jsonLine ?? proc.stdout.trim()) as { v: unknown; __type__: string };
    if (parsed.v === null && parsed.__type__ === 'NoneType' && lines.length > 1) {
      return {
        ok: true,
        value: 'None (function printed instead of returning — use return)',
      };
    }
    return { ok: true, value: formatPythonValue(parsed.v) };
  } catch {
    return { ok: true, value: proc.stdout.trim() };
  }
}

function runPythonCodeOnly(userCode: string): { output: string; error: string | null } {
  const script = `${userCode}`;
  const proc = spawnSync('python3', ['-c', script], {
    encoding: 'utf-8',
    timeout: 5000,
    maxBuffer: 1024 * 1024,
  });

  if (proc.status !== 0) {
    return { output: proc.stdout || '', error: (proc.stderr || 'Execution failed').trim() };
  }
  return { output: (proc.stdout || '').trim(), error: null };
}

export function runTests(code: string, testCases: TestCaseInput[]): RunOutput {
  const { output, error } = runPythonCodeOnly(code);
  if (error && testCases.length === 0) {
    return { passed: false, output, error, testResults: [] };
  }

  const testResults: TestResult[] = testCases.map((tc) => {
    const result = runPythonSnippet(code, tc.inputData);
    if (!result.ok) {
      return {
        passed: false,
        expected: tc.expected,
        actual: result.error || 'Error',
        hidden: tc.isHidden,
      };
    }
    const passed =
      result.value === tc.expected ||
      normalize(result.value) === normalize(tc.expected);
    return {
      passed,
      expected: tc.expected,
      actual: result.value,
      hidden: tc.isHidden,
    };
  });

  const allPassed = testResults.every((r) => r.passed);
  return {
    passed: allPassed,
    output,
    error: error && !allPassed ? error : null,
    testResults,
  };
}

function normalize(s: string): string {
  return s.replace(/\s/g, '').replace(/'/g, '"').toLowerCase();
}

export function calculateScore(passed: boolean, hintsUsed: number): number {
  if (!passed) return 0;
  const deduction = hintsUsed * 10;
  return Math.max(70, 100 - deduction);
}
