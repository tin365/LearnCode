export interface User {
  id: number;
  email: string;
  createdAt: string;
  isAdmin: boolean;
}

export type ProblemLanguage = 'python' | 'javascript';

export interface Problem {
  id: number;
  title: string;
  description: string;
  starterCode: string;
  difficulty: 'easy' | 'medium' | 'hard';
  orderIndex: number;
  moduleId: number;
  /** Mirrors Module.language so the frontend can pick a runtime + syntax. */
  language: ProblemLanguage;
  type: 'STANDARD' | 'DEBUG' | 'CONCEPT_ONLY';
  hints: Hint[];
  testCases?: { inputData: string; expected: string }[];
}

export interface Hint {
  id: number;
  orderIndex: number;
  content: string;
}

export interface Progress {
  problemId: number;
  passed: boolean;
  score: number;
  attempts: number;
  hintsUsed: number;
  completedAt: string | null;
}

export interface RunResult {
  passed: boolean;
  output: string;
  error: string | null;
  testResults: TestResult[];
  score: number;
}

export interface TestResult {
  passed: boolean;
  expected: string;
  actual: string;
  hidden: boolean;
}

export interface AuthResponse {
  accessToken: string;
  /**
   * Present only when the request identified itself as a desktop client
   * (X-Client-Kind: desktop). For web, the refresh token is delivered as
   * an HttpOnly cookie and is not exposed to JavaScript.
   */
  refreshToken?: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface ProblemInModule {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  orderIndex: number;
  type: 'STANDARD' | 'DEBUG' | 'CONCEPT_ONLY';
  progress: { passed: boolean; score: number }[];
}

export interface ModuleLessonRef {
  id: number;
  progress: { readAt: string }[];
}

export type SectionType =
  | 'why_you_need_this'
  | 'the_basics'
  | 'syntax_reference'
  | 'worked_example'
  | 'try_it_yourself'
  | 'common_mistakes';

export interface LessonSection {
  id: number;
  orderIndex: number;
  type: SectionType;
  title: string | null;
  content: string;
  code: string | null;
}

export interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  estimatedMinutes: number;
  concepts: string[];
  sections: LessonSection[];
  readAt: string | null;
}

export interface HintsState {
  total: number;
  used: number;
}

export interface ModuleWithProgress {
  id: number;
  orderIndex: number;
  /** Per-language curriculum slot — JS module 1 is orderIndex 101, displayed as M1. */
  language: ProblemLanguage;
  title: string;
  description: string;
  estimatedMinutes: number;
  isFoundational: boolean;
  isUnlocked: boolean;
  isComplete: boolean;
  completedCount: number;
  totalCount: number;
  problems: ProblemInModule[];
  lesson: ModuleLessonRef | null;
}
