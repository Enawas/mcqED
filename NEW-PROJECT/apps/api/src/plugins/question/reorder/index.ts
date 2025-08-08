/**
 * Purpose: Fastify plugin to reorder a question within its page. Registers
 * the PATCH /question/:id/reorder endpoint, validates the request body,
 * checks authorization via canEditQuestion, and invokes the reorderQuestion
 * service. Responds with 204 No Content on success. If the question
 * does not exist, responds with 404. If the user is unauthorized,
 * responds with 403. Internal errors are propagated.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler for question reordering.
 * Events: None (audit logging can be added later).
 * Errors: See above.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { reorderQuestion } from '../../../services/question/reorder.service';
import { canEditQuestion } from '../../../policies/question/edit.policy';
import { recordAudit } from '../../../observability/auditWriter';
import { getQuestion } from '../../../services/question/get.service';

export async function questionReorderPlugin(fastify: FastifyInstance) {
  fastify.patch(
    '/question/:id/reorder',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({ direction: z.enum(['up', 'down']) }),
        response: {
          204: z.any(),
        },
      },
    },
    async (request, reply) => {
      const role = (request as any).user?.role ?? 'guest';
      if (!canEditQuestion(role)) {
        return reply.status(403).send({ error: 'FORBIDDEN' });
      }
      const { id } = request.params as { id: string };
      const { direction } = request.body as { direction: 'up' | 'down' };
      try {
        await reorderQuestion(id, direction);
        // Record audit event for question reordering
        const userId = (request as any).user?.id ?? null;
        let questionAfter;
        try {
          questionAfter = await getQuestion(id);
        } catch (_) {
          questionAfter = undefined;
        }
        await recordAudit('question.reordered', 'question', id, userId, undefined, questionAfter);
        return reply.status(204).send();
      } catch (err: any) {
        if (err.message === 'QUESTION_NOT_FOUND') {
          return reply.status(404).send({ error: 'NOT_FOUND' });
        }
        throw err;
      }
    },
  );
}