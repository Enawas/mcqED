/**
 * Purpose: Fastify plugin to toggle the favourite status of a QCM. Registers
 * the PATCH /qcm/:id/favorite endpoint, validates the ID parameter, checks
 * authorization via a policy and toggles the flag via a service. Returns
 * the updated QCM object.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler for toggling favourites.
 * Events: None (audit logging to be added later).
 * Errors: Responds with 404 if the QCM does not exist or 403 if
 * unauthorized.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { qcmReadSchema } from '@packages/schemas/src/qcm';
import { toggleFavoriteQcm } from '../../../services/qcm/toggleFavorite.service';
import { canToggleFavorite } from '../../../policies/qcm/toggleFavorite.policy';

export async function qcmToggleFavoritePlugin(fastify: FastifyInstance) {
  fastify.patch(
    '/qcm/:id/favorite',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: qcmReadSchema,
        },
      },
    },
    async (request, reply) => {
      const role = (request as any).user?.role ?? 'guest';
      if (!canToggleFavorite(role)) {
        return reply.status(403).send({ error: 'FORBIDDEN' });
      }
      const { id } = request.params as { id: string };
      try {
        const updated = await toggleFavoriteQcm(id);
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