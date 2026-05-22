# Step 6 — Module 0 Special View

**Goal:** Module 0 is concept-only, no problems. Build a single-panel reading view for it.

**Estimated time:** 45 min

**Prerequisite:** Steps 1–5 complete.

## Behavior

When a user clicks "Module 0" in the sidebar:
- Route to `/module/0/lesson` (or `/module/:moduleId/lesson` where the module is foundational)
- Show a **single-panel reading view** (not the 3-panel workspace)
- After reading the last section, show "Continue to Module 1" CTA
- Mark the lesson as complete when "Continue" is clicked

## New page route

Create `apps/web/src/pages/ModuleLesson.tsx`:

```tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon, ArrowRightIcon, ClockIcon, BookOpenIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { SectionRenderer } from '@/components/lessons/SectionRenderer';

export function ModuleLesson() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  
  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', moduleId],
    queryFn: () => api.get(`/modules/${moduleId}/lesson`).then(r => r.data),
  });
  
  const { data: modules } = useQuery({
    queryKey: ['modules'],
    queryFn: () => api.get('/modules').then(r => r.data),
  });
  
  const completeLesson = useMutation({
    mutationFn: () => api.post(`/modules/${moduleId}/lesson/complete`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lesson', moduleId] });
      qc.invalidateQueries({ queryKey: ['modules'] });
    },
  });
  
  if (isLoading) return <ReadingViewSkeleton />;
  if (!lesson) return <p className="p-6">Lesson not found.</p>;
  
  // Find next module for "Continue" CTA
  const currentMod = modules?.find((m: any) => m.id === Number(moduleId));
  const nextMod    = modules?.find((m: any) => m.orderIndex === (currentMod?.orderIndex ?? -1) + 1);
  
  const handleContinue = async () => {
    await completeLesson.mutateAsync();
    if (nextMod && nextMod.problems.length > 0) {
      navigate(`/problem/${nextMod.problems[0].id}`);
    } else if (nextMod) {
      navigate(`/module/${nextMod.id}/lesson`);
    } else {
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Top bar */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to dashboard
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <BookOpenIcon className="w-4 h-4" />
            <span>Reading: {lesson.title}</span>
          </div>
        </div>
      </header>
      
      {/* Reading area */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        
        <div className="mb-8">
          <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
            <ClockIcon className="w-4 h-4" />
            <span>{lesson.estimatedMinutes} minute read</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">{lesson.title}</h1>
          {lesson.concepts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {lesson.concepts.map((c: string) => (
                <span key={c} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-8">
          {lesson.sections.map((section: any) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </div>
        
        {/* Continue CTA */}
        <div className="mt-12 p-6 bg-white border rounded-lg flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">
              {nextMod ? `Up next: ${nextMod.title}` : 'You\'ve finished the curriculum!'}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {nextMod
                ? `Ready to start the first problem in ${nextMod.title}?`
                : 'Amazing work — you\'ve completed every module.'}
            </p>
          </div>
          <button
            onClick={handleContinue}
            disabled={completeLesson.isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-md"
          >
            {nextMod ? 'Continue' : 'Back to dashboard'}
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}

function ReadingViewSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-10 max-w-4xl mx-auto space-y-6 animate-pulse">
      <div className="h-10 bg-slate-100 rounded w-2/3"></div>
      <div className="h-4 bg-slate-100 rounded w-1/4"></div>
      <div className="space-y-3">
        <div className="h-32 bg-slate-100 rounded"></div>
        <div className="h-32 bg-slate-100 rounded"></div>
        <div className="h-32 bg-slate-100 rounded"></div>
      </div>
    </div>
  );
}
```

## Add the route

In `apps/web/src/App.tsx`, add the route:

```tsx
<Route path="/module/:moduleId/lesson" element={<ModuleLesson />} />
```

## Update sidebar behavior

The sidebar from step 3 already routes foundational modules (Module 0) to `/module/:moduleId/lesson` instead of expanding. Confirm this works.

For non-foundational modules, clicking the module itself just expands/collapses. To open the lesson for those modules, the user clicks the "Lesson" sub-item under the expanded module.

## Wave 1 lesson content for Module 0

Module 0 needs actual content NOW since it has no problems to seed. Use the template in `templates/content-templates.md` and write 5 sections.

Here's the lesson skeleton:

```typescript
const MODULE_0_LESSON = {
  title: 'How Programming Works',
  estimatedMinutes: 15,
  concepts: ['programming', 'python', 'code execution'],
  sections: [
    {
      orderIndex: 1,
      type: 'why_you_need_this',
      title: 'Why Learn to Code?',
      content: `Imagine you could give your computer step-by-step instructions for any task...`,
    },
    {
      orderIndex: 2,
      type: 'the_basics',
      title: 'What is a Program?',
      content: `A program is just a list of instructions a computer follows in order...`,
    },
    {
      orderIndex: 3,
      type: 'syntax_reference',
      title: 'Meet Python',
      content: `Python is a popular programming language designed to be readable...`,
      code: `# This is a Python program\nprint("Hello, World!")`,
    },
    {
      orderIndex: 4,
      type: 'worked_example',
      title: 'How LearnCode Works',
      content: `The interface has three panels:\n\n- Left: the module sidebar\n- Middle: lessons and problem descriptions\n- Right: the code editor and output`,
    },
    {
      orderIndex: 5,
      type: 'common_mistakes',
      title: 'Tips for Learning to Code',
      content: `- **Type code by hand**, don't copy-paste\n- **Read error messages** carefully\n- **It's okay to use hints** when stuck\n- **Practice every day**, even just 15 minutes`,
    },
  ],
};
```

Write a seed script that inserts this lesson and link it to Module 0 (the module with `orderIndex: 0`).

## Verification

- [ ] Clicking Module 0 in the sidebar navigates to `/module/:id/lesson`
- [ ] Reading view shows single-panel layout (no editor, no sidebar tabs)
- [ ] All 5 sections of Module 0 render with proper styling
- [ ] "Continue" button appears at the bottom
- [ ] Clicking Continue marks the lesson complete in DB
- [ ] Clicking Continue navigates to Module 1's first problem
- [ ] Sidebar shows Module 0 with a green check after completion
- [ ] Module 1 becomes unlocked after Module 0 is read

## STOP

Verify Module 0 flow end-to-end before step 7 (writing lesson content for remaining modules).
