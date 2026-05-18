import ReactMarkdown from 'react-markdown';
import {
  AlertTriangle,
  BookOpen,
  Code,
  FlaskConical,
  Lightbulb,
  PlayCircle,
  type LucideIcon,
} from 'lucide-react';
import type { LessonSection, SectionType } from '@learncode/types';
import { markdownComponents } from '@/lib/markdownComponents';
import { TryItExercise } from './TryItExercise';

type Tone = 'amber' | 'blue' | 'slate' | 'emerald' | 'purple' | 'red';

interface SectionMeta {
  icon: LucideIcon;
  label: string;
  tone: Tone;
}

const SECTION_META: Record<SectionType, SectionMeta> = {
  why_you_need_this: { icon: Lightbulb, label: 'Why You Need This', tone: 'amber' },
  the_basics: { icon: BookOpen, label: 'The Basics', tone: 'blue' },
  syntax_reference: { icon: Code, label: 'Syntax', tone: 'slate' },
  worked_example: { icon: FlaskConical, label: 'Example', tone: 'emerald' },
  try_it_yourself: { icon: PlayCircle, label: 'Try It Yourself', tone: 'purple' },
  common_mistakes: { icon: AlertTriangle, label: 'Common Mistakes', tone: 'red' },
};

const TONE_CONTAINER: Record<Tone, string> = {
  amber: 'border-amber-200 bg-amber-50',
  blue: 'border-blue-200 bg-blue-50',
  slate: 'border-slate-200 bg-slate-50',
  emerald: 'border-emerald-200 bg-emerald-50',
  purple: 'border-purple-200 bg-purple-50',
  red: 'border-red-200 bg-red-50',
};

const TONE_HEADING: Record<Tone, string> = {
  amber: 'text-amber-900',
  blue: 'text-blue-900',
  slate: 'text-slate-900',
  emerald: 'text-emerald-900',
  purple: 'text-purple-900',
  red: 'text-red-900',
};

interface SectionRendererProps {
  section: LessonSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const meta = SECTION_META[section.type];
  if (!meta) return null;
  const Icon = meta.icon;
  const heading = section.title ?? meta.label;
  const isTryIt = section.type === 'try_it_yourself';
  const isSyntax = section.type === 'syntax_reference';

  return (
    <section className={`rounded-lg border p-5 ${TONE_CONTAINER[meta.tone]}`}>
      <div className={`mb-3 flex items-center gap-2 ${TONE_HEADING[meta.tone]}`}>
        <Icon className="h-5 w-5" />
        <h3 className="font-semibold">{heading}</h3>
      </div>

      {section.content && (
        <div className="prose prose-sm max-w-none text-sm leading-relaxed">
          <ReactMarkdown components={markdownComponents}>{section.content}</ReactMarkdown>
        </div>
      )}

      {isTryIt && section.code && (
        <div className="mt-4">
          <TryItExercise initialCode={section.code} />
        </div>
      )}

      {!isTryIt && section.code && (
        <pre
          className={
            isSyntax
              ? 'mt-3 overflow-x-auto rounded-md border bg-white p-3 font-mono text-sm leading-relaxed'
              : 'mt-3 overflow-x-auto rounded-md bg-slate-900 p-3 font-mono text-sm leading-relaxed text-slate-100'
          }
        >
          {section.code}
        </pre>
      )}
    </section>
  );
}
