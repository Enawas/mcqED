/**
 * Purpose: Fastify plugin to retrieve a single QCM with pages and
 * questions. Registers the GET /qcm/:id endpoint, validates the ID
 * parameter and returns a QcmRead response. Returns 404 if the QCM
 * does not exist. No authorization is required for reading QCMs.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler for retrieving a QCM by ID.
 * Events: None.
 * Errors: Responds with 404 if not found and propagates internal errors.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { qcmReadSchema } from '@packages/schemas/src/qcm';
import { getQcm } from '../../../services/qcm/get.service';

export async function qcmGetPlugin(fastify: FastifyInstance) {
  fastify.get(
    '/qcm/:id',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: qcmReadSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const qcm = await getQcm(id);
      if (!qcm) {
        return reply.status(404).send({ error: 'NOT_FOUND' });
      }
      return qcm;
    },
  );
}