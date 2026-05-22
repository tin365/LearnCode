import type { FastifyInstance } from 'fastify';
import { Prisma } from '@prisma/client';
import { submitProgressSchema, hintRevealSchema } from '@learncode/validators';
import { runTests, calculateScore, asLanguage } from '../lib/testRunner.js';
import type { Progress, RunResult } from '@learncode/types';

export async function progressRoutes(fastify: FastifyInstance) {
  fastify.get('/progress', { preHandler: [fastify.authenticate] }, async (request) => {
    const userId = (request.user as { userId: number }).userId;
    const rows = await fastify.prisma.progress.findMany({
      where: { userId },
    });

    return rows.map(
      (r): Progress => ({
        problemId: r.problemId,
        passed: r.passed,
        score: r.score,
        attempts: r.attempts,
        hintsUsed: r.hintsUsed,
        completedAt: r.completedAt?.toISOString() ?? null,
      }),
    );
  });

  fastify.post(
    '/progress/submit',
    {
      config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const parsed = submitProgressSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }

      const userId = (request.user as { userId: number }).userId;
      const { problemId, code } = parsed.data;

      const problem = await fastify.prisma.problem.findUnique({
        where: { id: problemId },
        // module.language is needed so runTests dispatches the right
        // interpreter (python3 vs node).
        include: { testCases: true, module: { select: { language: true } } },
      });

      if (!problem) {
        return reply.status(404).send({ error: 'Problem not found' });
      }

      // Baseline hintsUsed for score calc. Read outside the tx because the
      // runTests call below takes ~5s (python3 spawn) and we don't want to
      // hold a DB connection that long.
      const baseline = await fastify.prisma.progress.findUnique({
        where: { userId_problemId: { userId, problemId } },
      });
      const hintsUsed = baseline?.hintsUsed ?? 0;

      const runOutput = runTests(
        code,
        problem.testCases.map((tc) => ({
          expected: tc.expected,
          isHidden: tc.isHidden,
          inputData: tc.inputData,
        })),
        asLanguage(problem.module.language),
      );

      const newScore = calculateScore(runOutput.passed, hintsUsed);

      try {
        // Re-read inside the tx so concurrent submits don't lose attempts
        // increments. Keeps score monotonically best-ever (Math.max).
        await fastify.prisma.$transaction(async (tx) => {
          const current = await tx.progress.findUnique({
            where: { userId_problemId: { userId, problemId } },
          });

          const passed = runOutput.passed || (current?.passed ?? false);
          const score = passed
            ? Math.max(current?.score ?? 0, runOutput.passed ? newScore : 0)
            : 0;
          const attempts = (current?.attempts ?? 0) + 1;
          const completedAt = passed
            ? current?.completedAt ?? (runOutput.passed ? new Date() : null)
            : null;

          await tx.progress.upsert({
            where: { userId_problemId: { userId, problemId } },
            create: {
              userId,
              problemId,
              passed: runOutput.passed,
              score: runOutput.passed ? newScore : 0,
              attempts,
              hintsUsed,
              completedAt: runOutput.passed ? new Date() : null,
            },
            update: {
              passed,
              score,
              attempts,
              completedAt,
            },
          });
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
          return reply
            .status(401)
            .send({ error: 'Session expired — please log out and log in again' });
        }
        throw err;
      }

      const result: RunResult = {
        passed: runOutput.passed,
        output: runOutput.output,
        error: runOutput.error,
        testResults: runOutput.testResults,
        score: runOutput.passed ? newScore : 0,
      };

      return result;
    },
  );

  fastify.post(
    '/progress/hint',
    {
      config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const parsed = hintRevealSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.flatten() });
      }

      const userId = (request.user as { userId: number }).userId;
      const { problemId } = parsed.data;

      try {
        // Read + max-3 check + hint lookup + upsert all inside one tx so
        // two concurrent hint clicks can't both pass the max-3 check.
        const result = await fastify.prisma.$transaction(async (tx) => {
          const existing = await tx.progress.findUnique({
            where: { userId_problemId: { userId, problemId } },
          });
          const hintsUsed = (existing?.hintsUsed ?? 0) + 1;
          if (hintsUsed > 3) {
            return { kind: 'max' as const };
          }

          const hint = await tx.hint.findFirst({
            where: { problemId, orderIndex: hintsUsed },
          });
          if (!hint) {
            return { kind: 'notfound' as const };
          }

          await tx.progress.upsert({
            where: { userId_problemId: { userId, problemId } },
            create: {
              userId,
              problemId,
              hintsUsed,
              attempts: 0,
              passed: false,
              score: 0,
            },
            update: { hintsUsed },
          });

          return { kind: 'ok' as const, hint, hintsUsed };
        });

        if (result.kind === 'max') {
          return reply.status(400).send({ error: 'Maximum hints reached' });
        }
        if (result.kind === 'notfound') {
          return reply.status(404).send({ error: 'Hint not found' });
        }
        return { hint: result.hint, hintsUsed: result.hintsUsed };
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
          return reply
            .status(401)
            .send({ error: 'Session expired — please log out and log in again' });
        }
        throw err;
      }
    },
  );
}
