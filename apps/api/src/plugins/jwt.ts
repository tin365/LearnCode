import fp from 'fastify-plugin';
import fjwt from '@fastify/jwt';
import { env } from '../config/env.js';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: number; email: string; isAdmin: boolean };
    user: { userId: number; email: string; isAdmin: boolean };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: import('fastify').FastifyRequest, reply: import('fastify').FastifyReply) => Promise<void>;
  }
}

// Access-token lifetime. Refresh tokens take over for long sessions —
// see lib/auth.ts.
const ACCESS_TOKEN_TTL = '15m';

export default fp(async (fastify) => {
  await fastify.register(fjwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: ACCESS_TOKEN_TTL },
  });

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  });
});
