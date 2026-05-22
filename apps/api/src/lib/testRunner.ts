import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

export type Language = 'python' | 'javascript' | 'java' | 'rust';

const KNOWN_LANGUAGES: ReadonlySet<Language> = new Set(['python', 'javascript', 'java', 'rust']);

function normaliseLanguage(value: string | null | undefined): Language {
  // Defensive: anything we don't recognise falls back to Python (the
  // historical default) so a typo'd seed file can't crash the grader.
  return value && KNOWN_LANGUAGES.has(value as Language) ? (value as Language) : 'python';
}

export function asLanguage(value: string | null | undefined): Language {
  return normaliseLanguage(value);
}

function formatPythonValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  if (value === null || value === undefined) return 'None';
  if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, "'");
  return String(value);
}

// Common spawnSync options for every subprocess. Centralising them so
// the env-stripping and cwd-confinement rules can't drift between call
// sites. Subprocess attacks via absolute paths aren't prevented by
// either knob — they need a real sandbox.
const subprocessSpawnOptions = {
  encoding: 'utf-8' as const,
  timeout: 5000,
  maxBuffer: 1024 * 1024,
  // Strip parent env (DATABASE_URL, JWT_SECRET, etc.) but keep PATH so
  // the interpreter starts up quickly without scanning the whole filesystem.
  env: { PATH: process.env.PATH ?? '' },
  // Confine relative file operations to /tmp.
  cwd: '/tmp',
};

// Compilation (javac, rustc) needs longer than interpreted execution.
// 20s is generous for tiny educational programs even on Render free tier.
const compileSpawnOptions = {
  ...subprocessSpawnOptions,
  timeout: 20000,
  maxBuffer: 4 * 1024 * 1024,
};

// ---------------------------------------------------------------------------
// Python
// ---------------------------------------------------------------------------

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

  const proc = spawnSync('python3', ['-c', script], subprocessSpawnOptions);

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
  const proc = spawnSync('python3', ['-c', userCode], subprocessSpawnOptions);

  if (proc.status !== 0) {
    return { output: proc.stdout || '', error: (proc.stderr || 'Execution failed').trim() };
  }
  return { output: (proc.stdout || '').trim(), error: null };
}

// ---------------------------------------------------------------------------
// JavaScript
// ---------------------------------------------------------------------------

function runJsSnippet(userCode: string, expression: string): { ok: boolean; value: string; error?: string } {
  // Wrap the user expression so a thrown error is captured cleanly
  // (exit 1 + stderr message) instead of taking the whole test batch
  // down. Use process.stdout.write — no trailing newline — because the
  // value IS the entire output we're comparing.
  // JSON.stringify(undefined) returns the value `undefined`, not the
  // string; the `?? "undefined"` keeps the protocol round-tripable.
  const script = `${userCode}
try {
  const __result__ = (${expression});
  const __json__ = JSON.stringify(__result__);
  process.stdout.write(__json__ === undefined ? "undefined" : __json__);
} catch (err) {
  process.stderr.write(err && err.message ? err.message : String(err));
  process.exit(1);
}
`;
  // --max-old-space-size caps the V8 heap so a runaway user program
  // (e.g., `let a = []; while (true) a.push(1);`) hits an OOM and
  // dies cleanly instead of pressuring the API container's RAM.
  // 128 MB is plenty for any educational program.
  const proc = spawnSync('node', ['--max-old-space-size=128', '-e', script], subprocessSpawnOptions);

  if (proc.error) {
    return { ok: false, value: '', error: proc.error.message };
  }
  if (proc.status !== 0) {
    return { ok: false, value: '', error: (proc.stderr || proc.stdout || 'Execution failed').trim() };
  }
  return { ok: true, value: proc.stdout.trim() };
}

function runJsCodeOnly(userCode: string): { output: string; error: string | null } {
  const proc = spawnSync('node', ['--max-old-space-size=128', '-e', userCode], subprocessSpawnOptions);

  if (proc.status !== 0) {
    return { output: proc.stdout || '', error: (proc.stderr || 'Execution failed').trim() };
  }
  return { output: (proc.stdout || '').trim(), error: null };
}

// ---------------------------------------------------------------------------
// Java
// ---------------------------------------------------------------------------
// Per the authoring brief, user code is always
//     public class Solution { public static T method(...) { ... } }
// and test inputData calls it like Solution.method(args). The harness
// wraps the call in String.valueOf((Object)(...)) so primitives are
// boxed and printed identically to Object.toString().

function runJavaSnippet(userCode: string, expression: string): { ok: boolean; value: string; error?: string } {
  const dir = mkdtempSync(join(tmpdir(), 'lc-java-'));
  try {
    writeFileSync(join(dir, 'Solution.java'), userCode);
    writeFileSync(
      join(dir, 'Main.java'),
      `public class Main {
  public static void main(String[] args) {
    try {
      System.out.print(String.valueOf((Object)(${expression})));
    } catch (Throwable t) {
      System.err.print(t.getClass().getSimpleName() + ": " + t.getMessage());
      System.exit(1);
    }
  }
}
`,
    );

    const compile = spawnSync(
      'javac',
      ['-d', dir, join(dir, 'Solution.java'), join(dir, 'Main.java')],
      { ...compileSpawnOptions, cwd: dir },
    );
    if (compile.error) return { ok: false, value: '', error: compile.error.message };
    if (compile.status !== 0) {
      return { ok: false, value: '', error: (compile.stderr || 'Compilation failed').trim() };
    }

    // -Xmx caps the JVM heap; same OOM-as-clean-exit rationale as Node's
    // --max-old-space-size. 256 MB is generous for tiny student programs.
    const run = spawnSync('java', ['-Xmx256m', '-cp', dir, 'Main'], { ...subprocessSpawnOptions, cwd: dir });
    if (run.error) return { ok: false, value: '', error: run.error.message };
    if (run.status !== 0) {
      return { ok: false, value: '', error: (run.stderr || run.stdout || 'Execution failed').trim() };
    }
    return { ok: true, value: run.stdout.trim() };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function runJavaCodeOnly(userCode: string): { output: string; error: string | null } {
  // No expression to evaluate — Solution classes don't have main(). Just
  // compile to give the user a "does your syntax parse" signal; the
  // Submit path will run the actual tests.
  const dir = mkdtempSync(join(tmpdir(), 'lc-java-'));
  try {
    writeFileSync(join(dir, 'Solution.java'), userCode);
    const compile = spawnSync(
      'javac',
      ['-d', dir, join(dir, 'Solution.java')],
      { ...compileSpawnOptions, cwd: dir },
    );
    if (compile.status !== 0) {
      return { output: '', error: (compile.stderr || 'Compilation failed').trim() };
    }
    return { output: '', error: null };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Rust
// ---------------------------------------------------------------------------
// Per the brief, user code is always `fn name(...) -> T { ... }` and
// test inputData calls `name(args)`. Expected values are Debug
// formatted: strings are wrapped in quotes, ints/bools printed raw,
// matching what `println!("{:?}", value)` produces.

function runRustSnippet(userCode: string, expression: string): { ok: boolean; value: string; error?: string } {
  const dir = mkdtempSync(join(tmpdir(), 'lc-rust-'));
  try {
    const source = `${userCode}

fn main() {
    let __lc_result = ${expression};
    print!("{:?}", __lc_result);
}
`;
    writeFileSync(join(dir, 'main.rs'), source);

    const compile = spawnSync(
      'rustc',
      // --edition 2021 keeps Rust features predictable across rustc versions;
      // -O off because we want fast compile, not fast runtime.
      ['--edition', '2021', '-o', join(dir, 'main'), join(dir, 'main.rs')],
      { ...compileSpawnOptions, cwd: dir },
    );
    if (compile.error) return { ok: false, value: '', error: compile.error.message };
    if (compile.status !== 0) {
      return { ok: false, value: '', error: (compile.stderr || 'Compilation failed').trim() };
    }

    const run = spawnSync(join(dir, 'main'), [], { ...subprocessSpawnOptions, cwd: dir });
    if (run.error) return { ok: false, value: '', error: run.error.message };
    if (run.status !== 0) {
      // Rust panics print to stderr by default.
      return { ok: false, value: '', error: (run.stderr || run.stdout || 'Execution failed').trim() };
    }
    return { ok: true, value: run.stdout.trim() };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function runRustCodeOnly(userCode: string): { output: string; error: string | null } {
  // Try to compile the user code alone. If they didn't define main(),
  // we wrap in an empty main so rustc has an entry point. This is
  // primarily a "does your code parse" check.
  const dir = mkdtempSync(join(tmpdir(), 'lc-rust-'));
  try {
    const hasMain = /\bfn\s+main\s*\(/.test(userCode);
    const source = hasMain ? userCode : `${userCode}\n\nfn main() {}\n`;
    writeFileSync(join(dir, 'main.rs'), source);
    const compile = spawnSync(
      'rustc',
      ['--edition', '2021', '-o', join(dir, 'main'), join(dir, 'main.rs')],
      { ...compileSpawnOptions, cwd: dir },
    );
    if (compile.status !== 0) {
      return { output: '', error: (compile.stderr || 'Compilation failed').trim() };
    }
    if (!hasMain) {
      // User didn't define main, so there's nothing to run. Skip
      // execution and report a clean compile.
      return { output: '', error: null };
    }
    const run = spawnSync(join(dir, 'main'), [], { ...subprocessSpawnOptions, cwd: dir });
    if (run.status !== 0) {
      return { output: run.stdout || '', error: (run.stderr || 'Execution failed').trim() };
    }
    return { output: (run.stdout || '').trim(), error: null };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

function runSnippet(language: Language, userCode: string, expression: string) {
  switch (language) {
    case 'javascript':
      return runJsSnippet(userCode, expression);
    case 'java':
      return runJavaSnippet(userCode, expression);
    case 'rust':
      return runRustSnippet(userCode, expression);
    case 'python':
    default:
      return runPythonSnippet(userCode, expression);
  }
}

function runCodeOnly(language: Language, userCode: string) {
  switch (language) {
    case 'javascript':
      return runJsCodeOnly(userCode);
    case 'java':
      return runJavaCodeOnly(userCode);
    case 'rust':
      return runRustCodeOnly(userCode);
    case 'python':
    default:
      return runPythonCodeOnly(userCode);
  }
}

/**
 * Public wrapper used by the POST /run endpoint. Same dispatch as the
 * test-case grader, but returns just the program's combined output
 * with no test-case machinery. Renames `error` -> `stderr` to match the
 * conventional naming on the client.
 */
export function runFreeForm(
  language: Language,
  code: string,
): { output: string; stderr: string | null } {
  const result = runCodeOnly(language, code);
  return { output: result.output, stderr: result.error };
}

export function runTests(
  code: string,
  testCases: TestCaseInput[],
  language: Language = 'python',
): RunOutput {
  const { output, error } = runCodeOnly(language, code);
  if (error && testCases.length === 0) {
    return { passed: false, output, error, testResults: [] };
  }

  const testResults: TestResult[] = testCases.map((tc) => {
    const result = runSnippet(language, code, tc.inputData);
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
