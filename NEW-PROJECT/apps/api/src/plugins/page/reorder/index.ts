/**
 * Purpose: Fastify plugin to reorder a page within its QCM. Registers the
 * PATCH /page/:id/reorder endpoint, validates input, checks RBAC via
 * canEditPage, and invokes the reorderPage service. Responds with 204
 * (No Content) on success or an error code on failure.
 *
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler.
 * Events: None (audit could be added later).
 * Errors: 403 for unauthorized roles; 404 if the page does not exist.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { reorderPage } from '../../../services/page/reorder.service';
import { canEditPage } from '../../../policies/page/edit.policy';

export async function pageReorderPlugin(fastify: FastifyInstance) {
  fastify.patch(
    '/page/:id/reorder',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({ direction: z.enum(['up', 'down']) }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const role = (request as any).user?.role ?? 'guest';
      if (!canEditPage(role)) {
        return reply.status(403).send({ error: 'FORBIDDEN' });
      }
      const { id } = request.params as { id: string };
      const { direction } = request.body as { direction: 'up' | 'down' };
      try {
        await reorderPage(id, direction);
        return reply.status(204).send();
      } catch (err: any) {
        if (err.message === 'PAGE_NOT_FOUND') {
          return reply.status(404).send({ error: 'NOT_FOUND' });
        }
        throw err;
      }
    },
  );
}