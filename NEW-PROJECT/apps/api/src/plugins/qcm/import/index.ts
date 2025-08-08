/**
 * Purpose: Fastify plugin for importing QCMs.  Registers the POST
 * /qcm/import endpoint which accepts QCM data in JSON or XML format,
 * validates the payload, enforces RBAC, delegates to the import
 * service and returns the newly created QCM.  Responds with
 * appropriate error codes on failure.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler for QCM imports.
 * Events: None (audit logging can be added later).
 * Errors: Responds with 403 for unauthorized roles, 400 for
 * invalid format, and propagates internal errors.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { qcmImportSchema, qcmReadSchema } from '@packages/schemas/src/qcm';
import { importQcm } from '../../../services/qcm/import.service';
import { recordAudit } from '../../../observability/auditWriter';
import { canImportQcm } from '../../../policies/qcm/import.policy';

export async function qcmImportPlugin(fastify: FastifyInstance) {
  fastify.post(
    '/qcm/import',
    {
      schema: {
        body: qcmImportSchema,
        response: {
          201: qcmReadSchema,
        },
      },
    },
    async (request, reply) => {
      const role = (request as any).user?.role ?? 'guest';
      if (!canImportQcm(role)) {
        return reply.status(403).send({ error: 'FORBIDDEN' });
      }
      const { format, data } = request.body as { format: 'json' | 'xml'; data: string };
      try {
        const qcm = await importQcm(format, data);
        // Record audit event for QCM import
        const userId = (request as any).user?.id ?? null;
        await recordAudit('qcm.imported', 'qcm', qcm.id, userId, undefined, qcm);
        reply.code(201).send(qcm);
      } catch (err: any) {
        if (err.message === 'INVALID_FORMAT') {
          return reply.status(400).send({ error: 'INVALID_FORMAT' });
        }
        throw err;
      }
    },
  );
}