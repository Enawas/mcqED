/**
 * Purpose: Fastify plugin to retrieve a single question by ID. This
 * plugin registers the GET /question/:id route and validates the
 * request using Zod schemas. It returns a QuestionRead object on
 * success or a 404 error if the question does not exist.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler.
 * Events: None.
 * Errors: Responds with 404 if the question is not found; propagates
 * internal errors otherwise.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { questionReadSchema } from '@packages/schemas/src/question';
import { getQuestion } from '../../../services/question/get.service';

export async function questionGetPlugin(fastify: FastifyInstance) {
  fastify.get(
    '/question/:id',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: questionReadSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const question = await getQuestion(id);
      if (!question) {
        return reply.status(404).send({ error: 'NOT_FOUND' });
      }
      return question;
    },
  );
}