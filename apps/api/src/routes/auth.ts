import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import { registerSchema, loginSchema, oauthExchangeSchema } from '@learncode/validators';
import type { AuthResponse, RefreshResponse } from '@learncode/types';
import {
  COOKIE_NAME,
  type ClientKind,
  type IssuedRefresh,
  isClientKind,
  issueRefreshToken,
  refreshLifetimeMs,
  revokeByPlaintext,
  revokeFamily,
  rotateRefreshToken,
} from '../lib/auth.js';
import { consumeExchangeCode } from '../lib/oauthExchange.js';
import { env } from '../config/env.js';

const BCRYPT_COST = 12;

function readClientKind(request: FastifyRequest): ClientKind {
  const raw = request.headers['x-client-kind'];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return isClientKind(value) ? value : 'web';
}

function setRefreshCookie(
  reply: FastifyReply,
  plaintext: string,
  clientKind: ClientKind,
) {
  reply.setCookie(COOKIE_NAME, plaintext, {
    path: '/auth',
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    signed: true,
    maxAge: Math.floor(refreshLifetimeMs(clientKind) / 1000),
  });
}

function clearRefreshCookie(reply: FastifyReply) {
  reply.clearCookie(COOKIE_NAME, { path: '/auth' });
}

function presentedRefreshToken(request: FastifyRequest): string | null {
  const cookie = request.cookies[COOKIE_NAME];
  if (cookie) {
    const unsigned = request.unsignCookie(cookie);
    if (unsigned.valid && unsigned.value) return unsigned.value;
  }
  const header = request.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  if (typeof request.body === 'object' && request.body !== null) {
    const fromBody = (request.body as { refreshToken?: unknown }).refreshToken;
    if (typeof fromBody === 'string' && fromBody.length > 0) return fromBody;
  }
  return null;
}

function buildAuthResponse(
  fastify: FastifyInstance,
  user: { id: number; email: string; createdAt: Date; isAdmin: boolean },
  refresh: IssuedRefresh,
  clientKind: ClientKind,
): AuthResponse {
  const accessToken = fastify.jwt.sign({
    userId: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
  });
  return {
    accessToken,
    refreshToken: clientKind === 'desktop' ? refresh.plaintext : undefined,
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      isAdmin: user.isAdmin,
    },
  };
}

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/auth/register',
    { config: { rateLimit: { max: 5, timeWindow: '1 minute' } } },
    async (request, reply) => {
      const parsed = registerSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }

      const { email, password } = parsed.data;
      const existing = await fastify.prisma.user.findUnique({ where: { email } });
      if (existing) {
        return reply.status(409).send({ error: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
      const user = await fastify.prisma.user.create({
        data: { email, passwordHash },
      });

      const clientKind = readClientKind(request);
      const refresh = await issueRefreshToken(fastify.prisma, {
        userId: user.id,
        clientKind,
        userAgent: request.headers['user-agent'] ?? null,
        ipAddress: request.ip,
      });

      if (clientKind === 'web') setRefreshCookie(reply, refresh.plaintext, clientKind);
      return buildAuthResponse(fastify, user, refresh, clientKind);
    },
  );

  fastify.post(
    '/auth/login',
    { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } },
    async (request, reply) => {
      const parsed = loginSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }

      const { email, password } = parsed.data;
      const user = await fastify.prisma.user.findUnique({ where: { email } });
      // Generic error for both "no user" and "OAuth-only user with no password"
      // to avoid disclosing account existence or auth method.
      if (!user || !user.passwordHash) {
        return reply.status(401).send({ error: 'Invalid email or password' });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return reply.status(401).send({ error: 'Invalid email or password' });
      }

      const clientKind = readClientKind(request);
      const refresh = await issueRefreshToken(fastify.prisma, {
        userId: user.id,
        clientKind,
        userAgent: request.headers['user-agent'] ?? null,
        ipAddress: request.ip,
      });

      if (clientKind === 'web') setRefreshCookie(reply, refresh.plaintext, clientKind);
      return buildAuthResponse(fastify, user, refresh, clientKind);
    },
  );

  fastify.post(
    '/auth/refresh',
    { config: { rateLimit: { max: 30, timeWindow: '1 minute' } } },
    async (request, reply) => {
      const presented = presentedRefreshToken(request);
      if (!presented) {
        return reply.status(401).send({ error: 'No refresh token provided' });
      }

      const clientKind = readClientKind(request);
      const result = await rotateRefreshToken(fastify.prisma, presented, {
        clientKind,
        userAgent: request.headers['user-agent'] ?? null,
        ipAddress: request.ip,
      });

      if (result.kind === 'invalid') {
        clearRefreshCookie(reply);
        return reply.status(401).send({ error: 'Invalid or expired refresh token' });
      }

      if (result.kind === 'replay') {
        // Refresh-token reuse → revoke the whole family. Either an
        // attacker replayed a stolen token, or a buggy/double-firing
        // client made a duplicate request. Either way, force a fresh
        // login so the user re-establishes a clean session.
        await revokeFamily(fastify.prisma, result.family);
        request.log.warn(
          { userId: result.userId, family: result.family },
          'Refresh token replay detected, family revoked',
        );
        clearRefreshCookie(reply);
        return reply
          .status(401)
          .send({ error: 'Refresh token reuse detected — please log in again' });
      }

      const user = await fastify.prisma.user.findUnique({
        where: { id: result.record.userId },
      });
      if (!user) {
        clearRefreshCookie(reply);
        return reply.status(401).send({ error: 'User no longer exists' });
      }

      if (clientKind === 'web') setRefreshCookie(reply, result.plaintext, clientKind);

      const accessToken = fastify.jwt.sign({
        userId: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      });
      const response: RefreshResponse = {
        accessToken,
        refreshToken: clientKind === 'desktop' ? result.plaintext : undefined,
      };
      return response;
    },
  );

  fastify.post(
    '/auth/oauth-exchange',
    { config: { rateLimit: { max: 20, timeWindow: '1 minute' } } },
    async (request, reply) => {
      const parsed = oauthExchangeSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }

      // The exchange code was issued at the OAuth callback (Google /
      // Facebook). Consume it atomically — a second tab racing the
      // first will lose, no double-session issue.
      const outcome = await consumeExchangeCode(fastify.prisma, parsed.data.code);
      if (outcome.kind !== 'ok' || !outcome.userId) {
        return reply
          .status(400)
          .send({ error: 'Invalid or expired exchange code' });
      }

      const user = await fastify.prisma.user.findUnique({
        where: { id: outcome.userId },
      });
      if (!user) {
        return reply.status(400).send({ error: 'User no longer exists' });
      }

      const clientKind = readClientKind(request);
      const refresh = await issueRefreshToken(fastify.prisma, {
        userId: user.id,
        clientKind,
        userAgent: request.headers['user-agent'] ?? null,
        ipAddress: request.ip,
      });
      if (clientKind === 'web') setRefreshCookie(reply, refresh.plaintext, clientKind);
      return buildAuthResponse(fastify, user, refresh, clientKind);
    },
  );

  fastify.post('/auth/logout', async (request, reply) => {
    const presented = presentedRefreshToken(request);
    if (presented) await revokeByPlaintext(fastify.prisma, presented);
    clearRefreshCookie(reply);
    return reply.status(204).send();
  });

  fastify.get(
    '/auth/me',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const userId = (request.user as { userId: number }).userId;
      const user = await fastify.prisma.user.findUnique({ where: { id: userId } });
      if (!user) return reply.status(401).send({ error: 'User no longer exists' });
      return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        isAdmin: user.isAdmin,
      };
    },
  );
}
