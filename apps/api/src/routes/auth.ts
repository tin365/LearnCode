import type { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { registerSchema, loginSchema } from '@learncode/validators';
import type { AuthResponse } from '@learncode/types';

// Cost 12 ≈ ~250ms on a modern server. bcrypt.compare reads the cost from
// the stored hash, so existing users with cost-10 hashes keep working.
const BCRYPT_COST = 12;

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

    const token = fastify.jwt.sign({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        isAdmin: user.isAdmin,
      },
    };
    return response;
  });

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
    if (!user) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    const token = fastify.jwt.sign({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        isAdmin: user.isAdmin,
      },
    };
    return response;
  });

  fastify.post('/auth/logout', { preHandler: [fastify.authenticate] }, async () => {
    return { success: true };
  });
}
