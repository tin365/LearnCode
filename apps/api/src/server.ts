import Fastify from 'fastify';
import prismaPlugin from './plugins/prisma.js';
import corsPlugin from './plugins/cors.js';
import jwtPlugin from './plugins/jwt.js';
import { authRoutes } from './routes/auth.js';
import { problemRoutes } from './routes/problems.js';
import { progressRoutes } from './routes/progress.js';
import { moduleRoutes } from './routes/modules.js';

export async function buildServer() {
  const fastify = Fastify({ logger: true });

  await fastify.register(prismaPlugin);
  await fastify.register(corsPlugin);
  await fastify.register(jwtPlugin);

  await fastify.register(authRoutes);
  await fastify.register(problemRoutes);
  await fastify.register(progressRoutes);
  await fastify.register(moduleRoutes);

  fastify.get('/health', async () => ({ status: 'ok' }));

  return fastify;
}
