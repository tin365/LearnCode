import type { TestResult } from '@learncode/types';

export function TestResultsBlock({ results }: { results: TestResult[] }) {
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const visibleFailed = results.filter((r) => !r.passed && !r.hidden);
  const hiddenFailed = results.filter((r) => !r.passed && r.hidden).length;

  return (
    <div className="mt-3 space-y-2">
      <div
        className={`rounded-md px-3 py-2 font-medium ${
          passed === total
            ? 'bg-emerald-900/40 text-emerald-300'
            : 'bg-red-900/40 text-red-300'
        }`}
      >
        {passed === total
          ? `✓ All ${total} test${total !== 1 ? 's' : ''} passed!`
          : `✗ ${passed} of ${total} tests passed`}
      </div>

      {visibleFailed.map((r, i) => (
        <div key={i} className="rounded bg-red-950/30 px-3 py-2 text-xs">
          <div className="text-slate-400">Expected:</div>
          <div className="text-emerald-300">{r.expected}</div>
          <div className="mt-1 text-slate-400">Got:</div>
          <div className="text-red-300">{r.actual}</div>
        </div>
      ))}

      {hiddenFailed > 0 && (
        <div className="rounded bg-slate-800/50 px-3 py-2 text-xs text-slate-400">
          {hiddenFailed} hidden test{hiddenFailed > 1 ? 's' : ''} failed. Review your logic for edge cases.
        </div>
      )}
    </div>
  );
}
