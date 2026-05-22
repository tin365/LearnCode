import type { FastifyInstance } from 'fastify';
import { runCodeSchema } from '@learncode/validators';
import { runFreeForm } from '../lib/testRunner.js';

// Free-form code-runner endpoint used by the web app's Run button for
// languages that can't execute in the browser (Java, Rust). Python and
// JavaScript still execute client-side in their respective workers and
// don't normally hit this route, but the route accepts all four
// languages for parity and so the same dispatcher works as a fallback.
export async function runRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/run',
    {
      preHandler: [fastify.authenticate],
      // Compilation is expensive; cap to 12 per minute per user. Submit
      // uses the same envelope.
      config: { rateLimit: { max: 12, timeWindow: '1 minute' } },
    },
    async (request, reply) => {
      const parsed = runCodeSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }
      const { language, code } = parsed.data;

      try {
        const { output, stderr } = runFreeForm(language, code);
        return { output, stderr };
      } catch (err) {
        request.log.error({ err, language }, 'POST /run dispatch failed');
        return reply.status(500).send({ error: 'Internal error running code' });
      }
    },
  );
}
