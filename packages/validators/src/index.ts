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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SubmitProgressInput = z.infer<typeof submitProgressSchema>;
