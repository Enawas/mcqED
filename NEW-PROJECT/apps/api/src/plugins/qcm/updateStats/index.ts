/**
 * Purpose: Fastify plugin to update statistics (lastScore and lastTime)
 * for a given QCM. Registers the PATCH /qcm/:id/stats endpoint,
 * validates the request body using Zod, checks authorization via
 * canUpdateStats, invokes the updateStats service, and returns the
 * updated QCM on success. Responds with appropriate error codes on
 * failure.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler for updating QCM stats.
 * Events: None (audit logging to be added later).
 * Errors: Responds with 403 for unauthorized roles, 404 if the QCM
 * is not found, and propagates internal errors.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { qcmReadSchema } from '@packages/schemas/src/qcm';
import { updateStats } from '../../../services/qcm/updateStats.service';
import { recordAudit } from '../../../observability/auditWriter';
import { canUpdateStats } from '../../../policies/qcm/updateStats.policy';

export async function qcmUpdateStatsPlugin(fastify: FastifyInstance) {
  fastify.patch(
    '/qcm/:id/stats',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          score: z.number().int().min(0).max(100),
          time: z.number().int().min(0),
        }),
        response: {
          200: qcmReadSchema,
        },
      },
    },
    async (request, reply) => {
      const role = (request as any).user?.role ?? 'guest';
      if (!canUpdateStats(role)) {
        return reply.status(403).send({ error: 'FORBIDDEN' });
      }
      const { id } = request.params as { id: string };
      const { score, time } = request.body as { score: number; time: number };
      try {
        const updated = await updateStats(id, score, time);
        // Record audit event for stats update
        const userId = (request as any).user?.id ?? null;
        await recordAudit('qcm.stats_updated', 'qcm', updated.id, userId, undefined, updated);
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