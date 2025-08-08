/**
 * Purpose: Fastify plugin to delete an existing page. Registers
 * the DELETE /page/:id endpoint. Checks authorization via
 * canDeletePage, invokes the deletePage service, and returns 204
 * on success. Responds with 403 for unauthorized roles and 404
 * if the page does not exist.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler.
 * Events: None.
 * Errors: Responds with 404 when the page is missing; 403 for
 * unauthorized users; propagates unexpected errors.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { deletePage } from '../../../services/page/delete.service';
import { canDeletePage } from '../../../policies/page/delete.policy';
import { recordAudit } from '../../../observability/auditWriter';
import { getPage } from '../../../services/page/get.service';

export async function pageDeletePlugin(fastify: FastifyInstance) {
  fastify.delete(
    '/page/:id',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        response: {
          204: z.any(),
        },
      },
    },
    async (request, reply) => {
      const role = (request as any).user?.role ?? 'guest';
      if (!canDeletePage(role)) {
        return reply.status(403).send({ error: 'FORBIDDEN' });
      }
      const { id } = request.params as { id: string };
      try {
        // Retrieve page before deletion for audit
        let beforePage;
        try {
          beforePage = await getPage(id);
        } catch (_) {
          beforePage = undefined;
        }
        await deletePage(id);
        // Record audit event for page deletion
        const userId = (request as any).user?.id ?? null;
        await recordAudit('page.deleted', 'page', id, userId, beforePage, undefined);
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