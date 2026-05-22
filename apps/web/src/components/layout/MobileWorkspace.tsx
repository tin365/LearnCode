import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useExecutionStore } from '@/store/executionStore';
import { LearningPanel } from '@/components/layout/LearningPanel';
import { CodePanel } from '@/components/layout/CodePanel';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Terminal } from '@/components/editor/Terminal';

interface MobileWorkspaceProps {
  problemId: number;
  moduleId: number;
}

type Stage = 'reading' | 'coding';

export function MobileWorkspace({ problemId, moduleId }: MobileWorkspaceProps) {
  const [stage, setStage] = useState<Stage>('reading');

  return (
    // 100dvh (dynamic viewport height) instead of 100vh so the layout
    // shrinks when the mobile keyboard opens, keeping the toolbar in view.
    // overflow-hidden prevents the whole document from scrolling — each
    // inner panel handles its own scrolling.
    <div className="flex h-[100dvh] flex-col overflow-hidden overscroll-none bg-slate-50 dark:bg-slate-950">
      <MobileHeader />
      {stage === 'reading' ? (
        <ReadingStage
          problemId={problemId}
          moduleId={moduleId}
          onReadyToCode={() => setStage('coding')}
        />
      ) : (
        <CodingStage problemId={problemId} onBackToQuestions={() => setStage('reading')} />
      )}
    </div>
  );
}

function ReadingStage({
  problemId,
  moduleId,
  onReadyToCode,
}: {
  problemId: number;
  moduleId: number;
  onReadyToCode: () => void;
}) {
  const running = useExecutionStore((s) => s.running);
  const output = useExecutionStore((s) => s.output);
  const lastResult = useExecutionStore((s) => s.lastResult);
  const submitError = useExecutionStore((s) => s.submitError);
  const displayOutput = lastResult?.output || output;
  const terminalError = submitError || lastResult?.error || null;

  return (
    <>
      <div className="flex shrink-0 items-center justify-between border-b bg-white dark:bg-slate-900 px-3 py-2">
        <button
          type="button"
          onClick={onReadyToCode}
          className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
        >
          Ready to code
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <span className="text-[10px] uppercase tracking-wide text-slate-400">Reading</span>
      </div>
      <PanelGroup
        direction="vertical"
        className="min-h-0 flex-1"
        autoSaveId="mobile-workspace-split"
      >
        <Panel defaultSize={70} minSize={30}>
          <LearningPanel problemId={problemId} moduleId={moduleId} />
        </Panel>
        <PanelResizeHandle className="flex h-3 items-center justify-center bg-border hover:bg-primary/30">
          <span className="h-0.5 w-8 rounded-full bg-slate-400" />
        </PanelResizeHandle>
        <Panel defaultSize={30} minSize={15}>
          <Terminal
            output={displayOutput}
            error={terminalError}
            testResults={lastResult?.testResults ?? null}
            isRunning={running}
          />
        </Panel>
      </PanelGroup>
    </>
  );
}

function CodingStage({
  problemId,
  onBackToQuestions,
}: {
  problemId: number;
  onBackToQuestions: () => void;
}) {
  // min-h-0 + flex-1 lets CodePanel (which uses h-full internally) fill the
  // remaining vertical space inside the flex column instead of overflowing.
  return (
    <div className="min-h-0 flex-1">
      <CodePanel
        problemId={problemId}
        leftAction={
          <button
            type="button"
            onClick={onBackToQuestions}
            className="flex items-center gap-1 rounded-md border border-slate-300 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:bg-slate-950"
            title="Back to problem description"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Questions
          </button>
        }
      />
    </div>
  );
}
