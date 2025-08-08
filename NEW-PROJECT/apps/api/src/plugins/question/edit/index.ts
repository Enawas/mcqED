/**
 * Purpose: Fastify plugin to update an existing question. Registers
 * the PATCH /question/:id endpoint, validates input with Zod, checks
 * authorization via canEditQuestion, and invokes the updateQuestion
 * service. Returns the updated question on success or appropriate
 * error responses on failure.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler for question edits.
 * Events: None (audit will be added later).
 * Errors: Responds with 403 for unauthorized roles, 404 if the
 * question does not exist, and propagates internal errors.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  questionUpdateSchema,
  questionReadSchema,
} from '@packages/schemas/src/question';
import { updateQuestion } from '../../../services/question/update.service';
import { canEditQuestion } from '../../../policies/question/edit.policy';

export async function questionEditPlugin(fastify: FastifyInstance) {
  fastify.patch(
    '/question/:id',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: questionUpdateSchema.omit({ id: true }),
        response: {
          200: questionReadSchema,
        },
      },
    },
    async (request, reply) => {
      // Extract user role from request (default to guest)
      const role = (request as any).user?.role ?? 'guest';
      if (!canEditQuestion(role)) {
        return reply.status(403).send({ error: 'FORBIDDEN' });
      }
      const { id } = request.params as { id: string };
      const input = request.body as any;
      try {
        const updated = await updateQuestion(id, input);
        return updated;
      } catch (err: any) {
        if (err.message === 'QUESTION_NOT_FOUND') {
          return reply.status(404).send({ error: 'NOT_FOUND' });
        }
        throw err;
      }
    },
  );
}