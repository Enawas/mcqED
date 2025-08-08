/**
 * Purpose: Fastify plugin to create a new page within a given QCM.
 * Registers the POST /qcm/:id/page route. Validates the request
 * body against the pageCreateSchema, checks authorization via
 * canCreatePage, invokes the createPage service, and returns the
 * created page. Responds with 403 for unauthorized roles and 404
 * when the parent QCM does not exist.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler for creating pages.
 * Events: None (audit logging can be added later).
 * Errors: Responds with 404 if the parent QCM is not found; 403
 * for unauthorized roles.
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { pageCreateSchema } from '@packages/schemas/src/page/page.write';
import { qcmPageReadSchema } from '@packages/schemas/src/qcm/qcm.read';
import { createPage } from '../../../services/page/create.service';
import { canCreatePage } from '../../../policies/page/create.policy';

export async function pageCreatePlugin(fastify: FastifyInstance) {
  fastify.post(
    '/qcm/:id/page',
    {
      schema: {
        params: z.object({ id: z.string().uuid() }),
        body: pageCreateSchema,
        response: {
          200: qcmPageReadSchema,
        },
      },
    },
    async (request, reply) => {
      const role = (request as any).user?.role ?? 'guest';
      if (!canCreatePage(role)) {
        return reply.status(403).send({ error: 'FORBIDDEN' });
      }
      const { id } = request.params as { id: string };
      const body = request.body as any;
      try {
        const page = await createPage(id, body);
        return page;
      } catch (err: any) {
        if (err.message === 'QCM_NOT_FOUND') {
          return reply.status(404).send({ error: 'NOT_FOUND' });
        }
        throw err;
      }
    },
  );
}