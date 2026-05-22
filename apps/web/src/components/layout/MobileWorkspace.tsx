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
    <div className="flex h-screen flex-col bg-slate-50">
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
      <div className="flex shrink-0 items-center justify-between border-b bg-white px-3 py-2">
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
        <PanelResizeHandle className="h-1 bg-border hover:bg-primary/30" />
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
  return (
    <CodePanel
      problemId={problemId}
      leftAction={
        <button
          type="button"
          onClick={onBackToQuestions}
          className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          title="Back to problem description"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Questions
        </button>
      }
    />
  );
}
