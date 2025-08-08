/**
 * Purpose: Fastify plugin to create a new question on a given page.
 * Registers POST /page/:id/question endpoint. Validates the request
 * body against questionCreateSchema, checks authorization via
 * canCreateQuestion, calls the createQuestion service and returns
 * the created question. Responds with 403 for unauthorized roles
 * and 404 when the page is not found.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler.
 * Events: None (audit will be added later).
 * Errors: Responds with 404 for missing pages; 403 for unauthorized roles.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  questionCreateSchema,
  questionReadSchema,
} from '@packages/schemas/src/question';
import { createQuestion } from '../../../services/question/create.service';
import { canCreateQuestion } from '../../../policies/question/create.policy';

export async function questionCreatePlugin(fastify: FastifyInstance) {
  fastify.post(
    '/page/:id/question',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: questionCreateSchema,
        response: {
          200: questionReadSchema,
        },
      },
    },
    async (request, reply) => {
      const role = (request as any).user?.role ?? 'guest';
      if (!canCreateQuestion(role)) {
        return reply.status(403).send({ error: 'FORBIDDEN' });
      }
      const { id } = request.params as { id: string };
      const body = request.body as any;
      try {
        const question = await createQuestion(id, body);
        return question;
      } catch (err: any) {
        if (err.message === 'PAGE_NOT_FOUND') {
          return reply.status(404).send({ error: 'NOT_FOUND' });
        }
        throw err;
      }
    },
  );
}