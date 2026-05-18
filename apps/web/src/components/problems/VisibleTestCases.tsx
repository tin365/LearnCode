interface VisibleTestCasesProps {
  testCases: { inputData: string; expected: string }[];
}

export function VisibleTestCases({ testCases }: VisibleTestCasesProps) {
  if (!testCases.length) return null;

  return (
    <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Sample Test Cases</h3>
      <div className="space-y-2 font-mono text-xs">
        {testCases.map((tc, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400">→</span>
            <code className="text-slate-800">{tc.inputData}</code>
            <span className="text-slate-400">should return</span>
            <code className="font-medium text-emerald-700">{tc.expected}</code>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">Hidden tests will also run when you submit.</p>
    </section>
  );
}
