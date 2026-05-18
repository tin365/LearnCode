import type { FastifyInstance } from 'fastify';
import { Prisma } from '@prisma/client';
import { submitProgressSchema, hintRevealSchema } from '@learncode/validators';
import { runTests, calculateScore } from '../lib/testRunner.js';
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

  fastify.post('/progress/submit', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const parsed = submitProgressSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    const userId = (request.user as { userId: number }).userId;
    const { problemId, code } = parsed.data;

    const problem = await fastify.prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      return reply.status(404).send({ error: 'Problem not found' });
    }

    const existing = await fastify.prisma.progress.findUnique({
      where: { userId_problemId: { userId, problemId } },
    });

    const hintsUsed = existing?.hintsUsed ?? 0;

    const runOutput = runTests(
      code,
      problem.testCases.map((tc) => ({
        expected: tc.expected,
        isHidden: tc.isHidden,
        inputData: tc.inputData,
      })),
    );

    const score = calculateScore(runOutput.passed, hintsUsed);
    const attempts = (existing?.attempts ?? 0) + 1;

    try {
      await fastify.prisma.progress.upsert({
        where: { userId_problemId: { userId, problemId } },
        create: {
          userId,
          problemId,
          passed: runOutput.passed,
          score: runOutput.passed ? score : existing?.score ?? 0,
          attempts,
          hintsUsed,
          completedAt: runOutput.passed ? new Date() : null,
        },
        update: {
          passed: runOutput.passed || (existing?.passed ?? false),
          score: runOutput.passed ? score : existing?.score ?? 0,
          attempts,
          completedAt:
            runOutput.passed || existing?.passed
              ? existing?.completedAt ?? (runOutput.passed ? new Date() : null)
              : null,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
        return reply.status(401).send({ error: 'Session expired — please log out and log in again' });
      }
      throw err;
    }

    const result: RunResult = {
      passed: runOutput.passed,
      output: runOutput.output,
      error: runOutput.error,
      testResults: runOutput.testResults,
      score: runOutput.passed ? score : 0,
    };

    return result;
  });

  fastify.post('/progress/hint', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const parsed = hintRevealSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    const userId = (request.user as { userId: number }).userId;
    const { problemId } = parsed.data;

    const existing = await fastify.prisma.progress.findUnique({
      where: { userId_problemId: { userId, problemId } },
    });

    const hintsUsed = (existing?.hintsUsed ?? 0) + 1;
    if (hintsUsed > 3) {
      return reply.status(400).send({ error: 'Maximum hints reached' });
    }

    const hint = await fastify.prisma.hint.findFirst({
      where: { problemId, orderIndex: hintsUsed },
    });

    if (!hint) {
      return reply.status(404).send({ error: 'Hint not found' });
    }

    try {
      await fastify.prisma.progress.upsert({
        where: { userId_problemId: { userId, problemId } },
        create: {
          userId,
          problemId,
          hintsUsed,
          attempts: 0,
          passed: false,
          score: 0,
        },
        update: {
          hintsUsed,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
        return reply.status(401).send({ error: 'Session expired — please log out and log in again' });
      }
      throw err;
    }

    return { hint, hintsUsed };
  });
}
