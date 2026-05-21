import { randomBytes, createHash, randomUUID } from 'node:crypto';
import type { PrismaClient, RefreshToken } from '@prisma/client';

export type ClientKind = 'web' | 'desktop';

const REFRESH_TOKEN_BYTES = 32;

const LIFETIMES_MS: Record<ClientKind, number> = {
  web: 30 * 24 * 60 * 60 * 1000,
  desktop: 90 * 24 * 60 * 60 * 1000,
};

export const COOKIE_NAME = 'lc_rt';

export function isClientKind(value: unknown): value is ClientKind {
  return value === 'web' || value === 'desktop';
}

export function refreshLifetimeMs(clientKind: ClientKind): number {
  return LIFETIMES_MS[clientKind];
}

export function generateRefreshTokenPlaintext(): string {
  return randomBytes(REFRESH_TOKEN_BYTES).toString('base64url');
}

export function hashRefreshToken(plaintext: string): string {
  return createHash('sha256').update(plaintext).digest('hex');
}

export interface IssueContext {
  userId: number;
  clientKind: ClientKind;
  userAgent?: string | null;
  ipAddress?: string | null;
  family?: string;
}

export interface IssuedRefresh {
  plaintext: string;
  record: RefreshToken;
}

export async function issueRefreshToken(
  prisma: PrismaClient,
  ctx: IssueContext,
): Promise<IssuedRefresh> {
  const plaintext = generateRefreshTokenPlaintext();
  const tokenHash = hashRefreshToken(plaintext);
  const family = ctx.family ?? randomUUID();
  const expiresAt = new Date(Date.now() + refreshLifetimeMs(ctx.clientKind));

  const record = await prisma.refreshToken.create({
    data: {
      userId: ctx.userId,
      tokenHash,
      family,
      clientKind: ctx.clientKind,
      userAgent: ctx.userAgent ?? null,
      ipAddress: ctx.ipAddress ?? null,
      expiresAt,
    },
  });

  return { plaintext, record };
}

export type RotateOutcome =
  | { kind: 'ok'; plaintext: string; record: RefreshToken }
  | { kind: 'invalid' }
  | { kind: 'replay'; userId: number; family: string };

export async function rotateRefreshToken(
  prisma: PrismaClient,
  presentedPlaintext: string,
  ctx: { clientKind: ClientKind; userAgent?: string | null; ipAddress?: string | null },
): Promise<RotateOutcome> {
  const tokenHash = hashRefreshToken(presentedPlaintext);
  const existing = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!existing) return { kind: 'invalid' };
  if (existing.expiresAt.getTime() <= Date.now()) return { kind: 'invalid' };

  // Reuse of a token that's already been rotated is the canonical signal
  // of replay/theft. The caller is expected to revoke the whole family.
  if (existing.revokedAt) {
    return { kind: 'replay', userId: existing.userId, family: existing.family };
  }

  const newPlaintext = generateRefreshTokenPlaintext();
  const newHash = hashRefreshToken(newPlaintext);
  const newExpiry = new Date(Date.now() + refreshLifetimeMs(ctx.clientKind));

  const record = await prisma.$transaction(async (tx) => {
    const created = await tx.refreshToken.create({
      data: {
        userId: existing.userId,
        tokenHash: newHash,
        family: existing.family,
        clientKind: ctx.clientKind,
        userAgent: ctx.userAgent ?? null,
        ipAddress: ctx.ipAddress ?? null,
        expiresAt: newExpiry,
      },
    });
    await tx.refreshToken.update({
      where: { id: existing.id },
      data: { revokedAt: new Date(), replacedById: created.id },
    });
    return created;
  });

  return { kind: 'ok', plaintext: newPlaintext, record };
}

export async function revokeFamily(
  prisma: PrismaClient,
  family: string,
): Promise<number> {
  const result = await prisma.refreshToken.updateMany({
    where: { family, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return result.count;
}

export async function revokeByPlaintext(
  prisma: PrismaClient,
  plaintext: string,
): Promise<boolean> {
  const tokenHash = hashRefreshToken(plaintext);
  const result = await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return result.count > 0;
}

// Used after a password reset: invalidate every active session for this
// user across all devices, so a stolen device or shared browser can't keep
// the old session after the password changes.
export async function revokeAllForUser(
  prisma: PrismaClient,
  userId: number,
): Promise<number> {
  const result = await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return result.count;
}
