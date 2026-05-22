import { Loader2 } from 'lucide-react';
import type { TestResult } from '@learncode/types';
import { TestResultsBlock } from './TestResultsBlock';

interface TerminalProps {
  output: string;
  error?: string | null;
  testResults?: TestResult[] | null;
  isRunning?: boolean;
}

export function Terminal({ output, error, testResults, isRunning }: TerminalProps) {
  const hasContent = output || error || (testResults && testResults.length > 0);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-950 font-mono text-sm text-slate-100">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-3 py-2">
        <span className="text-xs uppercase tracking-wide text-slate-400">Output</span>
        {isRunning && (
          <span className="flex items-center gap-1 text-xs text-blue-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            Running…
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto overscroll-contain p-3">
        {!hasContent && !isRunning && (
          <p className="italic text-slate-500">
            Click <strong className="font-semibold text-slate-400">Run</strong> to test your code, or{' '}
            <strong className="font-semibold text-slate-400">Submit</strong> when ready.
          </p>
        )}
        {output && !testResults?.length && (
          <pre className="whitespace-pre-wrap text-slate-100">{output}</pre>
        )}
        {error && <ErrorBlock raw={error} />}
        {testResults && testResults.length > 0 && (
          <TestResultsBlock results={testResults} />
        )}
      </div>
    </div>
  );
}

// Renders a Python traceback (or any error string) with the exception
// line emphasised. Python tracebacks look like:
//
//   Traceback (most recent call last):
//     File "<exec>", line 3, in <module>
//       x = int("hello")
//   ValueError: invalid literal for int() with base 10: 'hello'
//
// The last non-empty line is the exception type + message. The
// "File "..."  line N" lines locate where it happened. Everything else
// is the call stack.
function ErrorBlock({ raw }: { raw: string }) {
  const lines = raw.replace(/\s+$/, '').split('\n');
  if (lines.length === 0) return null;

  const lastIdx = lines.length - 1;
  const last = lines[lastIdx];
  const isPythonException = /^[A-Z][A-Za-z_0-9]*(?:Error|Exception|Warning|Interrupt|Exit):\s/.test(last);

  return (
    <pre className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-red-300">
      {lines.map((line, i) => {
        if (i === lastIdx && isPythonException) {
          return (
            <span key={i} className="block font-semibold text-red-400">
              {line}
            </span>
          );
        }
        const fileLineMatch = line.match(/^(\s*)(File ".+?", line \d+)(.*)$/);
        if (fileLineMatch) {
          const [, indent, location, rest] = fileLineMatch;
          return (
            <span key={i} className="block">
              {indent}
              <span className="text-amber-300">{location}</span>
              <span className="text-slate-400">{rest}</span>
            </span>
          );
        }
        return (
          <span key={i} className="block">
            {line || ' '}
          </span>
        );
      })}
    </pre>
  );
}
