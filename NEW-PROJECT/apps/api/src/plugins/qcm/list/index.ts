/**
 * Purpose: Fastify plugin to list QCMs.  Registers the GET /qcm endpoint
 * which accepts query filters and returns an array of QCMs.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler.
 * Events: None (read-only endpoint).
 * Errors: Responds with validation errors or internal errors.
 */
import { FastifyInstance } from 'fastify';
import { qcmFilterSchema, qcmReadSchema, QcmFilter } from '@packages/schemas/src/qcm';
import { z } from 'zod';
import { listQcm } from '../../../services/qcm/list.service';
import { canListQcm } from '../../../policies/qcm/list.policy';

export async function qcmListPlugin(fastify: FastifyInstance) {
  fastify.get('/qcm', {
    schema: {
      querystring: qcmFilterSchema,
      response: {
        200: z.array(qcmReadSchema),
      },
    },
  }, async (request, reply) => {
    const userRole = request.user?.role ?? 'guest';
    if (!canListQcm(userRole)) {
      return reply.status(403).send({ error: 'FORBIDDEN' });
    }
    const filters = request.query as QcmFilter;
    const qcms = await listQcm(filters);
    return qcms;
  });
}