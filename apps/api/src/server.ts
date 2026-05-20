import Fastify from 'fastify';
import { randomUUID } from 'node:crypto';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import { env } from './config/env.js';
import { Sentry, isSentryEnabled } from './lib/sentry.js';
import prismaPlugin from './plugins/prisma.js';
import corsPlugin from './plugins/cors.js';
import jwtPlugin from './plugins/jwt.js';
import cookiePlugin from './plugins/cookie.js';
import { authRoutes } from './routes/auth.js';
import { problemRoutes } from './routes/problems.js';
import { progressRoutes } from './routes/progress.js';
import { moduleRoutes } from './routes/modules.js';

const BODY_LIMIT_BYTES = 100 * 1024;

export async function buildServer() {
  const fastify = Fastify({
    logger: true,
    bodyLimit: BODY_LIMIT_BYTES,
    // Respect a trusted upstream request id if present, otherwise generate
    // a UUID. Lets traces span the load balancer + app process.
    requestIdHeader: 'x-request-id',
    genReqId: () => randomUUID(),
  });

  await fastify.register(helmet, {
    // API serves JSON only; CSP is irrelevant for JSON responses and can
    // collide with Fastify's HTML error pages during local debugging.
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });
  await fastify.register(prismaPlugin);
  await fastify.register(cookiePlugin);
  await fastify.register(corsPlugin);
  await fastify.register(jwtPlugin);
  await fastify.register(rateLimit, {
    max: 300,
    timeWindow: '1 minute',
  });

  fastify.addHook('onSend', async (request, reply) => {
    reply.header('x-request-id', request.id);
  });

  fastify.setErrorHandler((error, request, reply) => {
    const status = error.statusCode ?? 500;
    const isServerError = status >= 500;

    if (isServerError) {
      request.log.error({ err: error, reqId: request.id }, 'Unhandled error');
      if (isSentryEnabled()) {
        const authed = request.user as
          | { userId?: number; email?: string }
          | undefined;
        Sentry.captureException(error, {
          tags: {
            requestId: request.id,
            method: request.method,
            route: request.routeOptions?.url ?? request.url,
          },
          user: authed?.userId
            ? { id: String(authed.userId), email: authed.email }
            : undefined,
        });
      }
    } else {
      request.log.warn({ err: error, reqId: request.id }, 'Client error');
    }

    // Never leak internal error details in production for 5xx — those
    // commonly include DB messages, stack frames, and other sensitive info.
    const message =
      isServerError && env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : error.message || 'Error';

    return reply.status(status).send({
      error: message,
      requestId: request.id,
    });
  });

  fastify.setNotFoundHandler((request, reply) => {
    return reply
      .status(404)
      .send({ error: 'Not Found', requestId: request.id });
  });

  await fastify.register(authRoutes);
  await fastify.register(problemRoutes);
  await fastify.register(progressRoutes);
  await fastify.register(moduleRoutes);

  fastify.get('/health', async (_request, reply) => {
    try {
      await fastify.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok' };
    } catch (err) {
      fastify.log.error({ err }, 'Health check: DB unreachable');
      return reply
        .status(503)
        .send({ status: 'error', database: 'unreachable' });
    }
  });

  return fastify;
}
