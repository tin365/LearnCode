import { useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Loader2, Play, Send } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RunResult } from '@learncode/types';
import { api } from '@/lib/api';
import { runPythonCode } from '@/lib/pyodide';
import { useProblemStore } from '@/store/problemStore';
import { useExecutionStore } from '@/store/executionStore';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Terminal } from '@/components/editor/Terminal';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { cn } from '@/lib/utils';

interface CodePanelProps {
  problemId: number;
  // Optional slot rendered at the left edge of the toolbar. Used on
  // mobile to inject a "Questions" button that flips back to the
  // problem-reading stage.
  leftAction?: ReactNode;
}

export function CodePanel({ problemId, leftAction }: CodePanelProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [pyodideReady, setPyodideReady] = useState(false);

  const code = useProblemStore((s) => s.code);
  const setCode = useProblemStore((s) => s.setCode);
  const running = useExecutionStore((s) => s.running);
  const output = useExecutionStore((s) => s.output);
  const lastResult = useExecutionStore((s) => s.lastResult);
  const submitError = useExecutionStore((s) => s.submitError);
  const statusMessage = useExecutionStore((s) => s.statusMessage);
  const setRunning = useExecutionStore((s) => s.setRunning);
  const setOutput = useExecutionStore((s) => s.setOutput);
  const setResult = useExecutionStore((s) => s.setResult);
  const setSuccessScore = useExecutionStore((s) => s.setSuccessScore);
  const setSubmitError = useExecutionStore((s) => s.setSubmitError);
  const setStatusMessage = useExecutionStore((s) => s.setStatusMessage);
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: () => api.post<RunResult>('/progress/submit', { problemId, code }),
    onSuccess: (result) => {
      setSubmitError(null);
      setResult(result);
      if (result.passed) {
        setSuccessScore(result.score);
        setStatusMessage(`All tests passed! Score: ${result.score} points`);
        setOutput(result.output || 'All tests passed!');
        queryClient.invalidateQueries({ queryKey: ['progress'] });
        toast.success(`All tests passed! Score: ${result.score} points`);
      } else {
        setStatusMessage('Some tests failed — see details below');
        setOutput(result.output || output);
        toast.error('Some tests failed — see details below');
      }
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    },
    onError: (err: Error) => {
      setResult(null);
      setSuccessScore(null);
      const message = err.message || 'Submit failed. Is the API running?';
      setSubmitError(message);
      setStatusMessage(message);
      setOutput(message);
      toast.error(message);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    },
  });

  async function handleRun() {
    setRunning(true);
    setResult(null);
    setSuccessScore(null);
    setSubmitError(null);
    setStatusMessage(pyodideReady ? 'Running code locally…' : 'Setting up Python environment…');
    try {
      const { output: out, error } = await runPythonCode(code);
      setPyodideReady(true);
      if (error) {
        setOutput(error);
        setStatusMessage('Run finished with an error');
      } else {
        setOutput(out || '(no output)');
        setStatusMessage('Run finished');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Run failed';
      setOutput(message);
      setStatusMessage(message);
    } finally {
      setRunning(false);
    }
  }

  async function handleSubmit() {
    setRunning(true);
    setResult(null);
    setSuccessScore(null);
    setSubmitError(null);
    setStatusMessage('Submitting to server…');
    try {
      await submitMutation.mutateAsync();
    } catch {
      // onError handler above
    } finally {
      setRunning(false);
    }
  }

  const isBusy = running || submitMutation.isPending;
  const terminalError = submitError || lastResult?.error || null;
  const displayOutput = lastResult?.output || output;
  const isSubmitting = submitMutation.isPending;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b px-3 py-2">
        {leftAction}
        <button
          onClick={handleRun}
          disabled={isBusy}
          title="Run your code in the terminal — no scoring"
          className="flex items-center gap-2 rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50"
        >
          {running && !isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Run
        </button>
        <button
          onClick={handleSubmit}
          disabled={isBusy}
          title="Check against all tests and earn your score"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Submit
        </button>
        <span
          className={cn(
            'ml-auto text-xs',
            submitError
              ? 'text-destructive'
              : lastResult?.passed
                ? 'text-emerald-700'
                : 'text-muted-foreground',
          )}
        >
          {statusMessage ?? 'Ready'}
        </span>
      </div>

      <PanelGroup direction="vertical" className="min-h-0 flex-1">
        <Panel defaultSize={65} minSize={30}>
          <CodeEditor value={code} onChange={setCode} />
        </Panel>
        <PanelResizeHandle className="group relative flex h-3 items-center justify-center bg-border hover:bg-primary/30 md:h-1">
          {/* Drag indicator — only visible on mobile where the handle is thick. */}
          <span className="h-0.5 w-8 rounded-full bg-slate-400 md:hidden" />
        </PanelResizeHandle>
        <Panel defaultSize={35} minSize={15}>
          <div ref={resultsRef} className="h-full">
            <Terminal
              output={displayOutput}
              error={terminalError}
              testResults={lastResult?.testResults ?? null}
              isRunning={isBusy}
            />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
