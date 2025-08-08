/**
 * Purpose: Fastify plugin to list audit logs.  Registers the GET /audit
 * endpoint, validates query parameters using Zod, enforces RBAC via
 * canListAudit and returns an array of AuditEvent objects. This
 * endpoint is read-only and supports optional filters and
 * pagination.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler for listing audit logs.
 * Events: None (read-only).
 * Errors: Responds with 403 for unauthorized roles and propagates
 * internal errors.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { auditEventSchema, auditQuerySchema } from '@packages/schemas/src/audit';
import { listAuditLogs } from '../../../services/audit/list.service';
import { canListAudit } from '../../../policies/audit/list.policy';

export async function auditListPlugin(fastify: FastifyInstance) {
  fastify.get(
    '/audit',
    {
      schema: {
        querystring: auditQuerySchema,
        response: {
          200: z.array(auditEventSchema),
        },
      },
    },
    async (request, reply) => {
      const role = (request as any).user?.role ?? 'guest';
      if (!canListAudit(role)) {
        return reply.status(403).send({ error: 'FORBIDDEN' });
      }
      const query = request.query as any;
      const logs = await listAuditLogs(query);
      return logs;
    },
  );
}