import { CheckCircle2, Lock } from 'lucide-react';
import type { ModuleWithProgress } from '@learncode/types';
import { cn } from '@/lib/utils';

interface MobileModuleStripProps {
  modules: ModuleWithProgress[];
  selectedId: number | null;
  isAdmin: boolean;
  onSelect: (moduleId: number) => void;
}

export function MobileModuleStrip({
  modules,
  selectedId,
  isAdmin,
  onSelect,
}: MobileModuleStripProps) {
  const sorted = [...modules].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <nav
      aria-label="Modules"
      className="flex h-full w-14 shrink-0 flex-col gap-1 overflow-y-auto border-r bg-white py-2"
    >
      {sorted.map((mod) => {
        const locked = !isAdmin && !mod.isUnlocked;
        const active = selectedId === mod.id;
        const complete = mod.isComplete;

        return (
          <button
            type="button"
            key={mod.id}
            onClick={() => onSelect(mod.id)}
            disabled={locked}
            title={`M${mod.orderIndex} · ${mod.title}`}
            className={cn(
              'mx-1 flex flex-col items-center justify-center rounded-md py-2 text-[11px] font-semibold transition-colors',
              active && 'bg-blue-600 text-white',
              !active && !locked && 'text-slate-700 hover:bg-slate-100',
              locked && 'cursor-not-allowed text-slate-300',
            )}
          >
            <span>M{mod.orderIndex}</span>
            {locked ? (
              <Lock className="mt-0.5 h-3 w-3" />
            ) : complete ? (
              <CheckCircle2
                className={cn('mt-0.5 h-3 w-3', active ? 'text-white' : 'text-emerald-600')}
              />
            ) : (
              <span
                className={cn(
                  'mt-0.5 h-2 w-2 rounded-full',
                  active ? 'bg-white/60' : 'bg-slate-300',
                )}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
