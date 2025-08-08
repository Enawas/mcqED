/**
 * Purpose: Fastify plugin to create a new QCM. Registers the POST /qcm
 * endpoint which validates input, checks authorization and returns the
 * created QCM. This plugin delegates business logic to the create service
 * and enforces RBAC via the create policy.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler for creating a QCM.
 * Events: TODO: emit "qcm.created" audit event.
 * Errors: Validation errors are handled by Fastify/Zod, unauthorized
 * requests result in 403 responses.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { qcmCreateSchema, qcmReadSchema, QcmCreateInput } from '@packages/schemas/src/qcm';
import { recordAudit } from '../../../observability/auditWriter';
import { createQcm } from '../../../services/qcm/create.service';
import { canCreateQcm } from '../../../policies/qcm/create.policy';

export async function qcmCreatePlugin(fastify: FastifyInstance) {
  fastify.post(
    '/qcm',
    {
      schema: {
        body: qcmCreateSchema,
        response: {
          201: qcmReadSchema,
        },
      },
    },
    async (request, reply) => {
      // Determine the user role; fall back to 'guest' if not authenticated
      const userRole = (request as any).user?.role ?? 'guest';
      if (!canCreateQcm(userRole)) {
        return reply.status(403).send({ error: 'FORBIDDEN' });
      }
      const input = request.body as unknown as QcmCreateInput;
      const qcm = await createQcm(input);
      // Record audit event for created QCM.  Use user ID if available, null otherwise.
      const userId = (request as any).user?.id ?? null;
      await recordAudit('qcm.created', 'qcm', qcm.id, userId, undefined, qcm);
      return reply.status(201).send(qcm);
    },
  );
}