/**
 * Purpose: Fastify plugin for exporting QCMs.  Registers the GET
 * /qcm/:id/export endpoint which serializes the specified QCM into
 * JSON or XML format.  Validates query parameters, enforces RBAC,
 * delegates to the export service, and returns the serialized data
 * with appropriate content type.  Responds with error codes on
 * failure.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler for QCM exports.
 * Events: None (audit logging can be added later).
 * Errors: Responds with 403 for unauthorized roles, 404 if the QCM
 * does not exist, 400 for invalid format, and propagates internal
 * errors.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { qcmExportSchema } from '@packages/schemas/src/qcm';
import { exportQcm } from '../../../services/qcm/export.service';
import { recordAudit } from '../../../observability/auditWriter';
import { canExportQcm } from '../../../policies/qcm/export.policy';

export async function qcmExportPlugin(fastify: FastifyInstance) {
  fastify.get(
    '/qcm/:id/export',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        querystring: qcmExportSchema,
        response: {
          200: z.any(),
        },
      },
    },
    async (request, reply) => {
      const role = (request as any).user?.role ?? 'guest';
      if (!canExportQcm(role)) {
        return reply.status(403).send({ error: 'FORBIDDEN' });
      }
      const { id } = request.params as { id: string };
      const { format } = request.query as { format?: string };
      const fmt: 'json' | 'xml' = (format as any) || 'json';
      try {
        const data = await exportQcm(id, fmt);
        // Record audit event for QCM export
        const userId = (request as any).user?.id ?? null;
        await recordAudit('qcm.exported', 'qcm', id, userId, undefined, { format: fmt });
        if (fmt === 'json') {
          reply.header('Content-Type', 'application/json');
        } else {
          reply.header('Content-Type', 'application/xml');
        }
        return data;
      } catch (err: any) {
        if (err.message === 'QCM_NOT_FOUND') {
          return reply.status(404).send({ error: 'NOT_FOUND' });
        }
        if (err.message === 'INVALID_FORMAT') {
          return reply.status(400).send({ error: 'INVALID_FORMAT' });
        }
        throw err;
      }
    },
  );
}