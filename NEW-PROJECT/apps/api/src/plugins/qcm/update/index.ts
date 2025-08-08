/**
 * Purpose: Fastify plugin to update an existing QCM's metadata. Registers
 * the PATCH /qcm/:id endpoint, validates the request body against the
 * QcmUpdate schema (excluding id and pages), checks authorization via
 * canEditQcm, and invokes the update service. Returns the updated QCM on
 * success or an appropriate error response.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler for updating QCMs.
 * Events: None (audit logging can be added later).
 * Errors: Responds with 403 for unauthorized roles, 404 if the QCM
 * does not exist, and propagates internal errors.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  qcmUpdateSchema,
  qcmReadSchema,
  QcmUpdateInput,
} from '@packages/schemas/src/qcm';
import { updateQcm } from '../../../services/qcm/update.service';
import { canEditQcm } from '../../../policies/qcm/edit.policy';

export async function qcmUpdatePlugin(fastify: FastifyInstance) {
  fastify.patch(
    '/qcm/:id',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        // Exclude id and pages from the body; pages will be handled in a
        // dedicated feature when implemented.
        body: qcmUpdateSchema.omit({ id: true, pages: true }),
        response: {
          200: qcmReadSchema,
        },
      },
    },
    async (request, reply) => {
      const role = (request as any).user?.role ?? 'guest';
      if (!canEditQcm(role)) {
        return reply.status(403).send({ error: 'FORBIDDEN' });
      }
      const { id } = request.params as { id: string };
      const input = request.body as unknown as Omit<QcmUpdateInput, 'id' | 'pages'>;
      try {
        const updated = await updateQcm(id, input as any);
        return updated;
      } catch (err: any) {
        if (err.message === 'QCM_NOT_FOUND') {
          return reply.status(404).send({ error: 'NOT_FOUND' });
        }
        throw err;
      }
    },
  );
}