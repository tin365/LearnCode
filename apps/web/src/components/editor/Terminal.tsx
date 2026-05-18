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

      <div className="flex-1 overflow-auto p-3">
        {!hasContent && !isRunning && (
          <p className="italic text-slate-500">
            Click <strong className="font-semibold text-slate-400">Run</strong> to test your code, or{' '}
            <strong className="font-semibold text-slate-400">Submit</strong> when ready.
          </p>
        )}
        {error && (
          <pre className="mb-2 whitespace-pre-wrap text-red-400">{error}</pre>
        )}
        {output && !testResults?.length && (
          <pre className="whitespace-pre-wrap text-slate-100">{output}</pre>
        )}
        {testResults && testResults.length > 0 && (
          <TestResultsBlock results={testResults} />
        )}
      </div>
    </div>
  );
}
