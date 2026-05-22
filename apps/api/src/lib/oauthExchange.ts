import { createHash, randomBytes } from 'node:crypto';
import type { PrismaClient } from '@prisma/client';

// One-time codes used by the OAuth flow to hand off the freshly-issued
// session to the SPA without putting the JWT in a URL fragment.
//
// Lifecycle:
//   1. After the provider callback authenticates the user, the API
//      creates a code (32 random bytes), stores SHA-256 of it in
//      oauth_exchange_codes with a 60 s TTL.
//   2. API redirects the browser to /auth/oauth-complete?code=<plain>.
//   3. SPA POSTs the plain code to /auth/oauth-exchange; API marks the
//      row usedAt, then issues the access token + refresh cookie.
//
// We never persist the plaintext, only the SHA-256 hash — matches the
// pattern used for password-reset tokens.

const CODE_BYTES = 32;
const TTL_MS = 60 * 1000;

export function hashExchangeCode(plaintext: string): string {
  return createHash('sha256').update(plaintext).digest('hex');
}

export async function issueExchangeCode(
  prisma: PrismaClient,
  userId: number,
): Promise<string> {
  const plaintext = randomBytes(CODE_BYTES).toString('base64url');
  await prisma.oAuthExchangeCode.create({
    data: {
      userId,
      codeHash: hashExchangeCode(plaintext),
      expiresAt: new Date(Date.now() + TTL_MS),
    },
  });
  return plaintext;
}

export interface ConsumeOutcome {
  kind: 'ok' | 'invalid';
  userId?: number;
}

export async function consumeExchangeCode(
  prisma: PrismaClient,
  plaintext: string,
): Promise<ConsumeOutcome> {
  const codeHash = hashExchangeCode(plaintext);
  // Atomic find-and-mark-used so two concurrent SPA requests with the
  // same code can't both succeed (browser back-button + refresh + …).
  return prisma.$transaction(async (tx) => {
    const row = await tx.oAuthExchangeCode.findUnique({ where: { codeHash } });
    if (!row) return { kind: 'invalid' as const };
    if (row.usedAt) return { kind: 'invalid' as const };
    if (row.expiresAt.getTime() <= Date.now()) return { kind: 'invalid' as const };
    await tx.oAuthExchangeCode.update({
      where: { id: row.id },
      data: { usedAt: new Date() },
    });
    return { kind: 'ok' as const, userId: row.userId };
  });
}
