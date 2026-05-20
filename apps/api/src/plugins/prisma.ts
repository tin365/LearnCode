import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(async (fastify) => {
  const prisma = new PrismaClient();
  // Intentionally no $connect() at boot — Prisma lazy-connects on first
  // query. Eager connect blocks server.listen() during transient DB
  // slowness (deploy windows, provider incidents), which made early Fly
  // deploys silently hang. /health pings the DB explicitly and reports
  // 503 if it's unreachable, so liveness still surfaces DB issues.
  fastify.decorate('prisma', prisma);
  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
});
