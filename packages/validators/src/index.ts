import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const submitProgressSchema = z.object({
  problemId: z.number().int().positive(),
  code: z.string().min(1),
});

export const hintRevealSchema = z.object({
  problemId: z.number().int().positive(),
});

export const oauthExchangeSchema = z.object({
  code: z.string().min(1).max(200),
});

export const runCodeSchema = z.object({
  language: z.enum(['python', 'javascript', 'java', 'rust']),
  // Cap size to keep the server from accepting megabytes of bytecode-sized
  // submissions. 100 KB is plenty for any educational program.
  code: z.string().min(1).max(100_000),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SubmitProgressInput = z.infer<typeof submitProgressSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmInput = z.infer<typeof passwordResetConfirmSchema>;
export type RunCodeInput = z.infer<typeof runCodeSchema>;
export type OAuthExchangeInput = z.infer<typeof oauthExchangeSchema>;
