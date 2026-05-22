import { useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronRight, Keyboard, Loader2, Play, Send, Square } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RunResult } from '@learncode/types';
import { api } from '@/lib/api';
import { ExecutionStoppedError, runPythonCode, terminateWorker } from '@/lib/pyodide';
import { runJsCode, terminateJsWorker } from '@/lib/jsRuntime';
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
  const [stdinOpen, setStdinOpen] = useState(false);
  const [stdinText, setStdinText] = useState('');

  const code = useProblemStore((s) => s.code);
  const setCode = useProblemStore((s) => s.setCode);
  const language = useProblemStore((s) => s.current?.language ?? 'python');
  const running = useExecutionStore((s) => s.running);
  const output = useExecutionStore((s) => s.output);
  const lastResult = useExecutionStore((s) => s.lastResult);
  const submitError = useExecutionStore((s) => s.submitError);
  const runStderr = useExecutionStore((s) => s.runStderr);
  const statusMessage = useExecutionStore((s) => s.statusMessage);
  const setRunning = useExecutionStore((s) => s.setRunning);
  const setOutput = useExecutionStore((s) => s.setOutput);
  const setResult = useExecutionStore((s) => s.setResult);
  const setSuccessScore = useExecutionStore((s) => s.setSuccessScore);
  const setSubmitError = useExecutionStore((s) => s.setSubmitError);
  const setRunStderr = useExecutionStore((s) => s.setRunStderr);
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
    // Java and Rust have no in-browser runtime — they're compiled.
    // Until phase 4 wires up a server-side /run endpoint for them,
    // tell the user explicitly rather than fail mysteriously.
    if (language === 'java' || language === 'rust') {
      setOutput('');
      setRunStderr(
        `${language === 'java' ? 'Java' : 'Rust'} runs on the server — click Submit to compile and test against the problem's test cases.`,
      );
      setStatusMessage('Server-only language');
      return;
    }

    setRunning(true);
    setResult(null);
    setSuccessScore(null);
    setSubmitError(null);
    setRunStderr(null);
    const isJs = language === 'javascript';
    setStatusMessage(
      isJs
        ? 'Running code locally…'
        : pyodideReady
          ? 'Running code locally…'
          : 'Setting up Python environment…',
    );
    // Split the stdin textarea into lines, dropping a single trailing empty
    // line (a typical artifact of pressing Enter after the last value).
    const stdinLines = stdinText.replace(/\n$/, '').split('\n');
    try {
      const { output: out, error, stderr } = isJs
        ? await runJsCode(code)
        : await runPythonCode(code, stdinLines);
      if (!isJs) setPyodideReady(true);
      if (error) {
        // Worker-level fatal (Pyodide failed to load, etc.) — show in error pane.
        setRunStderr(error);
        setOutput('');
        setStatusMessage('Run failed');
      } else if (stderr) {
        // Python raised. Show whatever it captured on stdout up to the point
        // of the exception, plus the traceback in the error pane.
        setOutput(out);
        setRunStderr(stderr);
        setStatusMessage('Run finished with an error');
      } else {
        setOutput(out || '(no output)');
        setStatusMessage('Run finished');
      }
    } catch (err) {
      // handleStop already wrote the "Stopped" state synchronously, so
      // this branch just swallows the rejection — no need to re-render.
      if (err instanceof ExecutionStoppedError) return;
      const message = err instanceof Error ? err.message : 'Run failed';
      setRunStderr(message);
      setStatusMessage('Run failed');
    } finally {
      setRunning(false);
    }
  }

  function handleStop() {
    // Set the final state synchronously so the UI flips immediately,
    // not on the next microtask when the rejected Promise propagates.
    // Terminate both runtimes — cheap if either isn't alive — so users
    // who flip between Python and JS problems can't end up with a
    // dangling worker mid-run.
    terminateWorker();
    terminateJsWorker();
    setPyodideReady(false);
    setRunning(false);
    setResult(null);
    setSuccessScore(null);
    setSubmitError(null);
    setRunStderr(null);
    setOutput('⏹ Stopped');
    setStatusMessage('Stopped');
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
  // submit > tests > local-run errors, in priority order.
  const terminalError = submitError || lastResult?.error || runStderr || null;
  const displayOutput = lastResult?.output || output;
  const isSubmitting = submitMutation.isPending;
  const stdinLineCount = stdinText
    ? stdinText.replace(/\n$/, '').split('\n').filter(Boolean).length
    : 0;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b px-3 py-2">
        {leftAction}
        {running && !isSubmitting ? (
          <button
            onClick={handleStop}
            title="Stop the running code (kills the Pyodide worker)"
            className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            <Square className="h-4 w-4 fill-current" />
            Stop
          </button>
        ) : (
          <button
            onClick={handleRun}
            disabled={isBusy}
            title="Run your code in the terminal — no scoring"
            className="flex items-center gap-2 rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            Run
          </button>
        )}
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
          <CodeEditor value={code} onChange={setCode} language={language} />
        </Panel>
        <PanelResizeHandle className="group relative flex h-3 items-center justify-center bg-border hover:bg-primary/30 md:h-1">
          {/* Drag indicator — only visible on mobile where the handle is thick. */}
          <span className="h-0.5 w-8 rounded-full bg-slate-400 md:hidden" />
        </PanelResizeHandle>
        <Panel defaultSize={35} minSize={15}>
          <div ref={resultsRef} className="flex h-full flex-col overflow-hidden">
            <StdinPanel
              open={stdinOpen}
              onToggle={() => setStdinOpen((v) => !v)}
              value={stdinText}
              onChange={setStdinText}
              lineCount={stdinLineCount}
            />
            <div className="min-h-0 flex-1">
              <Terminal
                output={displayOutput}
                error={terminalError}
                testResults={lastResult?.testResults ?? null}
                isRunning={isBusy}
              />
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

interface StdinPanelProps {
  open: boolean;
  onToggle: () => void;
  value: string;
  onChange: (v: string) => void;
  lineCount: number;
}

function StdinPanel({ open, onToggle, value, onChange, lineCount }: StdinPanelProps) {
  return (
    <div className="shrink-0 border-y bg-slate-50">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium text-slate-600 hover:bg-slate-100"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        <Keyboard className="h-3.5 w-3.5" />
        <span>Input (stdin)</span>
        {lineCount > 0 && (
          <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
            {lineCount} line{lineCount === 1 ? '' : 's'}
          </span>
        )}
        {!open && (
          <span className="ml-auto text-[11px] text-slate-400">
            One value per line — used when your code calls input()
          </span>
        )}
      </button>
      {open && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={'Alice\n30\nyes'}
          spellCheck={false}
          className="block w-full resize-y border-t bg-white px-3 py-2 font-mono text-[13px] leading-relaxed text-slate-900 outline-none focus:bg-blue-50/30 md:text-sm"
          rows={4}
        />
      )}
    </div>
  );
}
