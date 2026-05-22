import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RefreshCw } from 'lucide-react';
import { runPythonCode } from '@/lib/pyodide';

interface TryItExerciseProps {
  initialCode: string;
}

export function TryItExercise({ initialCode }: TryItExerciseProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    setIsError(false);
    try {
      const result = await runPythonCode(code);
      if (result.error) {
        setOutput(result.error);
        setIsError(true);
      } else {
        setOutput(result.output || '(no output)');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setOutput(message);
      setIsError(true);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    setIsError(false);
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-md border border-purple-200 bg-white dark:bg-slate-900">
        <Editor
          height="160px"
          language="python"
          value={code}
          onChange={(v) => setCode(v ?? '')}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 8, bottom: 8 },
            lineNumbers: 'on',
            automaticLayout: true,
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-2 rounded-md bg-purple-600 px-3 py-1.5 text-sm text-white hover:bg-purple-700 disabled:opacity-50"
        >
          <Play className="h-3.5 w-3.5" />
          {isRunning ? 'Running…' : 'Run'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 rounded-md border bg-white dark:bg-slate-900 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:bg-slate-950"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {output && (
        <pre
          className={
            isError
              ? 'whitespace-pre-wrap rounded-md bg-red-950 p-3 text-xs font-mono text-red-100'
              : 'whitespace-pre-wrap rounded-md bg-slate-950 p-3 text-xs font-mono text-slate-100'
          }
        >
          {output}
        </pre>
      )}
    </div>
  );
}
