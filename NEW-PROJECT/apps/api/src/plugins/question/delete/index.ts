/**
 * Purpose: Fastify plugin to delete a question. Registers DELETE
 * /question/:id endpoint. Checks authorization via
 * canDeleteQuestion and calls deleteQuestion service. Responds
 * with 204 on success, 403 for unauthorized roles, and 404 if
 * the question is not found.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler.
 * Events: None.
 * Errors: 403 if unauthorized; 404 if missing; propagates other errors.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { deleteQuestion } from '../../../services/question/delete.service';
import { canDeleteQuestion } from '../../../policies/question/delete.policy';

export async function questionDeletePlugin(fastify: FastifyInstance) {
  fastify.delete(
    '/question/:id',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: {
          204: z.any(),
        },
      },
    },
    async (request, reply) => {
      const role = (request as any).user?.role ?? 'guest';
      if (!canDeleteQuestion(role)) {
        return reply.status(403).send({ error: 'FORBIDDEN' });
      }
      const { id } = request.params as { id: string };
      try {
        await deleteQuestion(id);
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