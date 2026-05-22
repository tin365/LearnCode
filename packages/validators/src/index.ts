import { z } from 'zod';

// Inline banlist of the most-abused passwords. Drawn from the top
// of the rockyou.txt-style breach corpus; intentionally small so this
// file stays lightweight and bundle-friendly. Caught matches are
// case-insensitive. A heavier check (zxcvbn) is wishlisted in
// docs/TO_UPGRADE.md but adds ~1.5 MB to whatever bundle imports it.
const BANNED_PASSWORDS = new Set([
  'password', 'password1', 'password123', '12345678', '123456789', '1234567890',
  'qwerty', 'qwerty123', 'qwertyuiop', '1qaz2wsx', 'asdf1234', 'abc12345',
  'iloveyou', 'admin', 'admin123', 'administrator', 'welcome', 'welcome1',
  'monkey', 'dragon', 'master', 'letmein', 'sunshine', 'princess',
  'baseball', 'football', 'shadow', 'superman', 'batman', 'starwars',
  'trustno1', 'changeme', 'passw0rd', 'p@ssw0rd', 'p@ssword',
]);

// Strong-password rule used by /auth/register and /auth/password-reset
// confirm. Rejects: short (handled by .min above), in-banlist, or
// composed of fewer than 2 character classes (lowercase, uppercase,
// digit, symbol). Intentionally lenient — a learner who wants
// "MyDog2026" should pass.
function isPasswordStrongEnough(pwd: string): boolean {
  if (BANNED_PASSWORDS.has(pwd.toLowerCase())) return false;
  const classes = [
    /[a-z]/.test(pwd),
    /[A-Z]/.test(pwd),
    /\d/.test(pwd),
    /[^a-zA-Z0-9]/.test(pwd),
  ].filter(Boolean).length;
  return classes >= 2;
}

const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine(isPasswordStrongEnough, {
    message:
      'Pick a stronger password — mix at least two of: lowercase, uppercase, digits, symbols. Common passwords are not allowed.',
  });

export const registerSchema = z.object({
  email: z.string().email(),
  password: passwordField,
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
  newPassword: passwordField,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SubmitProgressInput = z.infer<typeof submitProgressSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmInput = z.infer<typeof passwordResetConfirmSchema>;
export type RunCodeInput = z.infer<typeof runCodeSchema>;
export type OAuthExchangeInput = z.infer<typeof oauthExchangeSchema>;
