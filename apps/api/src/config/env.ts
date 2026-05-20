import { config as loadDotenv } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

// Walk up from CWD looking for the monorepo .env. tsx/turbo both run
// this file with CWD=apps/api/, where there is no .env — the real one
// lives at the repo root. In production (Docker / Render), no .env file
// exists and we just rely on the runtime environment.
function findRepoEnv(): string | null {
  let dir = process.cwd();
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, '.env');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}
const envFile = findRepoEnv();
if (envFile) loadDotenv({ path: envFile });

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    COOKIE_SECRET: z.string().min(1, 'COOKIE_SECRET is required'),
    API_PORT: z.coerce.number().int().positive().default(3001),
    API_HOST: z.string().default('0.0.0.0'),
    WEB_ORIGINS: z
      .string()
      .default('http://localhost:5173')
      .transform((s) =>
        s
          .split(',')
          .map((o) => o.trim())
          .filter(Boolean),
      ),
    SENTRY_DSN: z.string().optional(),
    SENTRY_ENVIRONMENT: z.string().optional(),
    SENTRY_RELEASE: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV !== 'production') return;
    const weakJwt =
      data.JWT_SECRET.length < 32 ||
      /change-this/i.test(data.JWT_SECRET) ||
      data.JWT_SECRET === 'dev-secret-change-in-production';
    if (weakJwt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['JWT_SECRET'],
        message:
          'JWT_SECRET must be a strong, non-default value (>= 32 chars) in production',
      });
    }
    const weakCookie =
      data.COOKIE_SECRET.length < 32 ||
      /change-this/i.test(data.COOKIE_SECRET);
    if (weakCookie) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['COOKIE_SECRET'],
        message:
          'COOKIE_SECRET must be a strong, non-default value (>= 32 chars) in production',
      });
    }
    if (data.JWT_SECRET === data.COOKIE_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['COOKIE_SECRET'],
        message: 'COOKIE_SECRET must differ from JWT_SECRET',
      });
    }
  });

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:');
  for (const issue of parsed.error.issues) {
    const key = issue.path.join('.') || '(root)';
    console.error(`  - ${key}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
