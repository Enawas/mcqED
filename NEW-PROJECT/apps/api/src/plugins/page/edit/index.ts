/**
 * Purpose: Fastify plugin to edit an existing page (rename). Registers
 * the PATCH /page/:id endpoint, validates the request body, checks
 * authorization via canEditPage, and invokes the updatePage service.
 * Responds with the updated page or appropriate errors.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler.
 * Events: None (audit logging may be added later).
 * Errors: Responds with 403 for unauthorized roles, 404 if page not
 * found, and propagates unexpected errors.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { qcmPageReadSchema } from '@packages/schemas/src/qcm/qcm.read';
import { updatePage } from '../../../services/page/update.service';
import { canEditPage } from '../../../policies/page/edit.policy';
import { recordAudit } from '../../../observability/auditWriter';

export async function pageEditPlugin(fastify: FastifyInstance) {
  fastify.patch(
    '/page/:id',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: z.object({ name: z.string().min(1) }),
        response: {
          200: qcmPageReadSchema,
        },
      },
    },
    async (request, reply) => {
      // Determine user role (default to guest)
      const role = (request as any).user?.role ?? 'guest';
      if (!canEditPage(role)) {
        return reply.status(403).send({ error: 'FORBIDDEN' });
      }
      const { id } = request.params as { id: string };
      const { name } = request.body as { name: string };
      try {
        const updated = await updatePage(id, name);
        // Record audit event for page update
        const userId = (request as any).user?.id ?? null;
        await recordAudit('page.updated', 'page', updated.id, userId, undefined, updated);
        return updated;
      } catch (err: any) {
        if (err.message === 'PAGE_NOT_FOUND') {
          return reply.status(404).send({ error: 'NOT_FOUND' });
        }
        throw err;
      }
    },
  );
}