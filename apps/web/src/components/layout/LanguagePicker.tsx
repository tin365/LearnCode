import type { ProblemLanguage } from '@learncode/types';
import { cn } from '@/lib/utils';

interface LanguagePickerProps {
  value: ProblemLanguage;
  onChange: (next: ProblemLanguage) => void;
  available: ProblemLanguage[];
}

const LABELS: Record<ProblemLanguage, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  java: 'Java',
  rust: 'Rust',
};

// Segmented toggle. Hides itself when there's only one language with
// any modules — keeps the dashboard clean for single-language users.
export function LanguagePicker({ value, onChange, available }: LanguagePickerProps) {
  if (available.length < 2) return null;

  return (
    <div
      role="tablist"
      aria-label="Curriculum language"
      className="inline-flex rounded-md border border-slate-200 bg-white dark:bg-slate-900 p-0.5 shadow-sm"
    >
      {available.map((lang) => {
        const active = lang === value;
        return (
          <button
            key={lang}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(lang)}
            className={cn(
              'rounded px-3 py-1 text-xs font-medium transition-colors',
              active ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100',
            )}
          >
            {LABELS[lang]}
          </button>
        );
      })}
    </div>
  );
}
