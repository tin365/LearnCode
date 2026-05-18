import type { FastifyInstance } from 'fastify';
import type { Lesson, ModuleWithProgress, SectionType } from '@learncode/types';

export async function moduleRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/modules',
    { preHandler: [fastify.authenticate] },
    async (req): Promise<ModuleWithProgress[]> => {
      const userId = (req.user as { userId: number }).userId;

      const modules = await fastify.prisma.module.findMany({
        orderBy: { orderIndex: 'asc' },
        include: {
          problems: {
            orderBy: { orderIndex: 'asc' },
            select: {
              id: true,
              title: true,
              difficulty: true,
              orderIndex: true,
              type: true,
              progress: {
                where: { userId },
                select: { passed: true, score: true },
              },
            },
          },
          lesson: {
            select: {
              id: true,
              progress: {
                where: { userId },
                select: { readAt: true },
              },
            },
          },
        },
      });

      let prevModuleComplete = true;
      const enriched: ModuleWithProgress[] = modules.map((mod) => {
        const totalCount = mod.problems.length;
        const completedCount = mod.problems.filter((p) => p.progress[0]?.passed).length;
        const allPassed = totalCount > 0 && completedCount === totalCount;
        const lessonRead = !!mod.lesson?.progress[0]?.readAt;
        // Wave 2 will populate problems for modules M2, M3, M4, M9, M11.
        // Until then they are transparent to the unlock chain: they neither
        // block forward progress nor reset it.
        const isEmptyPlaceholder = !mod.isFoundational && totalCount === 0;

        const isComplete = mod.isFoundational
          ? lessonRead
          : isEmptyPlaceholder
            ? false
            : allPassed;

        const isUnlocked = mod.isFoundational || prevModuleComplete;

        const result: ModuleWithProgress = {
          id: mod.id,
          orderIndex: mod.orderIndex,
          title: mod.title,
          description: mod.description,
          estimatedMinutes: mod.estimatedMinutes,
          isFoundational: mod.isFoundational,
          isUnlocked,
          isComplete,
          completedCount,
          totalCount,
          problems: mod.problems.map((p) => ({
            id: p.id,
            title: p.title,
            difficulty: p.difficulty as 'easy' | 'medium' | 'hard',
            orderIndex: p.orderIndex,
            type: p.type as 'STANDARD' | 'DEBUG' | 'CONCEPT_ONLY',
            progress: p.progress.map((pr) => ({ passed: pr.passed, score: pr.score })),
          })),
          lesson: mod.lesson
            ? {
                id: mod.lesson.id,
                progress: mod.lesson.progress.map((lp) => ({
                  readAt: lp.readAt.toISOString(),
                })),
              }
            : null,
        };

        if (!isEmptyPlaceholder) {
          prevModuleComplete = isComplete;
        }
        return result;
      });

      return enriched;
    },
  );

  fastify.get<{ Params: { moduleId: string } }>(
    '/modules/:moduleId/lesson',
    { preHandler: [fastify.authenticate] },
    async (req, reply): Promise<Lesson | void> => {
      const userId = (req.user as { userId: number }).userId;
      const moduleId = Number(req.params.moduleId);
      if (!Number.isInteger(moduleId) || moduleId <= 0) {
        return reply.status(400).send({ error: 'Invalid module id' });
      }

      const lesson = await fastify.prisma.lesson.findUnique({
        where: { moduleId },
        include: {
          sections: { orderBy: { orderIndex: 'asc' } },
          progress: { where: { userId }, select: { readAt: true } },
        },
      });

      if (!lesson) {
        return reply.status(404).send({ error: 'Lesson not found' });
      }

      return {
        id: lesson.id,
        moduleId: lesson.moduleId,
        title: lesson.title,
        estimatedMinutes: lesson.estimatedMinutes,
        concepts: lesson.concepts,
        sections: lesson.sections.map((s) => ({
          id: s.id,
          orderIndex: s.orderIndex,
          type: s.type as SectionType,
          title: s.title,
          content: s.content,
          code: s.code,
        })),
        readAt: lesson.progress[0]?.readAt.toISOString() ?? null,
      };
    },
  );

  fastify.post<{ Params: { moduleId: string } }>(
    '/modules/:moduleId/lesson/complete',
    { preHandler: [fastify.authenticate] },
    async (req, reply) => {
      const userId = (req.user as { userId: number }).userId;
      const moduleId = Number(req.params.moduleId);
      if (!Number.isInteger(moduleId) || moduleId <= 0) {
        return reply.status(400).send({ error: 'Invalid module id' });
      }

      const lesson = await fastify.prisma.lesson.findUnique({
        where: { moduleId },
        select: { id: true },
      });
      if (!lesson) {
        return reply.status(404).send({ error: 'Lesson not found' });
      }

      const progress = await fastify.prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: lesson.id } },
        update: {},
        create: { userId, lessonId: lesson.id },
        select: { readAt: true },
      });

      return { readAt: progress.readAt.toISOString() };
    },
  );
}
