import type { FastifyInstance } from 'fastify';
import { randomBytes, createHash } from 'node:crypto';
import bcrypt from 'bcrypt';
import {
  passwordResetRequestSchema,
  passwordResetConfirmSchema,
} from '@learncode/validators';
import { env } from '../config/env.js';
import { revokeAllForUser } from '../lib/auth.js';
import {
  sendOAuthOnlyExplainer,
  sendPasswordResetEmail,
} from '../lib/email.js';

const BCRYPT_COST = 12;
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const TOKEN_BYTES = 32; // 256 bits of entropy

function hashToken(plaintext: string): string {
  return createHash('sha256').update(plaintext).digest('hex');
}

export async function passwordResetRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/auth/password-reset/request',
    { config: { rateLimit: { max: 5, timeWindow: '1 minute' } } },
    async (request, reply) => {
      const parsed = passwordResetRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }
      const { email } = parsed.data;

      // Look up the user, but return 204 either way — no account enumeration.
      const user = await fastify.prisma.user.findUnique({
        where: { email },
        include: { oauthAccounts: { select: { provider: true } } },
      });

      if (!user) {
        request.log.info({ email }, 'Password reset requested for unknown email');
        return reply.status(204).send();
      }

      // OAuth-only user: send a friendlier explainer instead of a reset link.
      if (!user.passwordHash) {
        try {
          const providers = user.oauthAccounts.map((a) => a.provider);
          if (providers.length > 0) {
            await sendOAuthOnlyExplainer({ to: email, providers, log: request.log });
          }
        } catch (err) {
          request.log.error({ err }, 'Failed to send OAuth-only explainer email');
        }
        return reply.status(204).send();
      }

      const plaintext = randomBytes(TOKEN_BYTES).toString('base64url');
      const tokenHash = hashToken(plaintext);
      const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

      await fastify.prisma.passwordReset.create({
        data: { userId: user.id, tokenHash, expiresAt },
      });

      const frontendBase =
        env.WEB_ORIGINS[0] ?? 'http://localhost:5173';
      const resetUrl = `${frontendBase}/auth/reset-password?token=${encodeURIComponent(plaintext)}`;

      try {
        await sendPasswordResetEmail({ to: email, resetUrl, log: request.log });
      } catch (err) {
        request.log.error({ err }, 'Failed to send password-reset email');
        // Don't reveal the failure — the user gets the same 204 either way
        // to keep response shape identical across all branches.
      }

      return reply.status(204).send();
    },
  );

  fastify.post(
    '/auth/password-reset/confirm',
    { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } },
    async (request, reply) => {
      const parsed = passwordResetConfirmSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }
      const { token, newPassword } = parsed.data;

      const record = await fastify.prisma.passwordReset.findUnique({
        where: { tokenHash: hashToken(token) },
      });

      if (!record || record.usedAt || record.expiresAt < new Date()) {
        return reply.status(400).send({ error: 'Reset link is invalid or expired' });
      }

      const passwordHash = await bcrypt.hash(newPassword, BCRYPT_COST);

      // Mark token used and update password atomically. Also revoke all of
      // the user's refresh-token families: the reset implies "lock everyone
      // else out", since whoever requested this presumably lost the device
      // or had it compromised.
      await fastify.prisma.$transaction(async (tx) => {
        await tx.passwordReset.update({
          where: { id: record.id },
          data: { usedAt: new Date() },
        });
        await tx.user.update({
          where: { id: record.userId },
          data: { passwordHash },
        });
      });
      await revokeAllForUser(fastify.prisma, record.userId);

      return reply.status(204).send();
    },
  );
}
