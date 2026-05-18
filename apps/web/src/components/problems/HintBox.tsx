import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Lightbulb } from 'lucide-react';
import type { Hint } from '@learncode/types';
import { api } from '@/lib/api';
import { useProblemStore } from '@/store/problemStore';

interface HintBoxProps {
  problemId: number;
  hints: Hint[];
  hintsUsed: number;
}

export function HintBox({ problemId, hints, hintsUsed }: HintBoxProps) {
  const [confirming, setConfirming] = useState(false);
  const revealHint = useProblemStore((s) => s.revealHint);
  const revealedHintIds = useProblemStore((s) => s.revealedHintIds);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => api.post<{ hint: Hint; hintsUsed: number }>('/progress/hint', { problemId }),
    onSuccess: (data) => {
      revealHint(data.hint.id);
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      setConfirming(false);
    },
  });

  const nextHint = hints.find((h) => !revealedHintIds.includes(h.id));
  const canReveal = hintsUsed < 3 && !!nextHint;
  const revealedHints = hints.filter((h) => revealedHintIds.includes(h.id));

  return (
    <section className="rounded-md border border-amber-200 bg-amber-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-amber-900">
          <Lightbulb className="h-4 w-4" />
          Hints
        </h3>
        <span className="text-xs text-amber-700">{hintsUsed} / {hints.length} used</span>
      </div>

      {revealedHints.map((h, i) => (
        <div key={h.id} className="mb-2 rounded border border-amber-100 bg-white p-3 text-sm">
          <div className="mb-1 text-xs font-medium text-amber-700">Hint {i + 1}</div>
          <p className="text-slate-700">{h.content}</p>
        </div>
      ))}

      {canReveal && !confirming && (
        <button
          onClick={() => setConfirming(true)}
          className="mt-1 w-full rounded-md border border-amber-300 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-200"
        >
          Reveal next hint (−10 pts)
        </button>
      )}

      {confirming && (
        <div className="mt-1 rounded border border-amber-300 bg-white p-3">
          <p className="mb-3 text-sm text-slate-700">
            Using this hint will deduct <strong>10 points</strong> from your score. Continue?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="rounded px-3 py-1.5 text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
            >
              Yes, reveal it
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="rounded px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!canReveal && hintsUsed > 0 && (
        <p className="mt-1 text-xs italic text-amber-700">All hints revealed. You've got this!</p>
      )}
    </section>
  );
}
