/**
 * Purpose: Fastify plugin to retrieve a single page by its ID.
 * Registers GET /page/:id route and validates the request using
 * Zod. Responds with the page data or 404 if the page does not exist.
 * Inputs: Fastify instance.
 * Outputs: Registers route handler.
 * Events: None (read-only endpoint).
 * Errors: Responds with 404 if the page is not found; propagates
 * internal errors otherwise.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { qcmPageReadSchema } from '@packages/schemas/src/qcm/qcm.read';
import { getPage } from '../../../services/page/get.service';

export async function pageGetPlugin(fastify: FastifyInstance) {
  fastify.get(
    '/page/:id',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: qcmPageReadSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const page = await getPage(id);
      if (!page) {
        return reply.status(404).send({ error: 'NOT_FOUND' });
      }
      return page;
    },
  );
}