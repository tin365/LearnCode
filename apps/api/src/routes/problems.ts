import type { FastifyInstance } from 'fastify';
import type { Problem, Hint, HintsState } from '@learncode/types';

function mapProblem(
  p: {
    id: number;
    title: string;
    description: string;
    starterCode: string;
    difficulty: string;
    orderIndex: number;
    moduleId: number;
    type: string;
    hints?: { id: number; orderIndex: number; content: string }[];
    testCases?: { inputData: string; expected: string }[];
  },
  includeHints: boolean,
): Problem {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    starterCode: p.starterCode,
    difficulty: p.difficulty as Problem['difficulty'],
    orderIndex: p.orderIndex,
    moduleId: p.moduleId,
    type: p.type as Problem['type'],
    hints: includeHints
      ? (p.hints ?? []).map(
          (h): Hint => ({
            id: h.id,
            orderIndex: h.orderIndex,
            content: h.content,
          }),
        )
      : [],
    testCases: p.testCases?.map((tc) => ({ inputData: tc.inputData, expected: tc.expected })),
  };
}

export async function problemRoutes(fastify: FastifyInstance) {
  fastify.get('/problems', { preHandler: [fastify.authenticate] }, async () => {
    const problems = await fastify.prisma.problem.findMany({
      orderBy: { orderIndex: 'asc' },
    });
    return problems.map((p) => mapProblem(p, false));
  });

  fastify.get<{ Params: { id: string } }>(
    '/problems/:id',
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      if (isNaN(id)) {
        return reply.status(400).send({ error: 'Invalid problem id' });
      }

      const problem = await fastify.prisma.problem.findUnique({
        where: { id },
        include: {
          hints: { orderBy: { orderIndex: 'asc' } },
          testCases: {
            where: { isHidden: false },
            select: { id: true, inputData: true, expected: true, isHidden: true },
          },
        },
      });

      if (!problem) {
        return reply.status(404).send({ error: 'Problem not found' });
      }

      return mapProblem(problem, true);
    },
  );

  fastify.get<{ Params: { problemId: string } }>(
    '/problems/:problemId/hints-state',
    { preHandler: [fastify.authenticate] },
    async (request, reply): Promise<HintsState | void> => {
      const userId = (request.user as { userId: number }).userId;
      const problemId = parseInt(request.params.problemId, 10);
      if (isNaN(problemId)) {
        return reply.status(400).send({ error: 'Invalid problem id' });
      }

      const [hintCount, progress] = await Promise.all([
        fastify.prisma.hint.count({ where: { problemId } }),
        fastify.prisma.progress.findUnique({
          where: { userId_problemId: { userId, problemId } },
          select: { hintsUsed: true },
        }),
      ]);

      return {
        total: hintCount,
        used: progress?.hintsUsed ?? 0,
      };
    },
  );
}
