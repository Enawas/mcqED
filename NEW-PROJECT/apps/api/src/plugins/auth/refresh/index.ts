/**
 * Purpose: Fastify plugin to handle refresh of JWT tokens. Registers
 * the POST /auth/refresh route, validates input using Zod schemas,
 * invokes the refreshTokens service, and returns new tokens. If
 * verification fails, responds with a 401 error.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler.
 * Events: None.
 * Errors: Responds with 401 Unauthorized for invalid refresh tokens.
 */

import { FastifyInstance } from 'fastify';
import {
  refreshInputSchema,
  refreshResponseSchema,
} from '@packages/schemas/src/users/auth.refresh';
import { refreshTokens } from '../../../services/auth/refresh.service';

export async function authRefreshPlugin(fastify: FastifyInstance) {
  fastify.post(
    '/auth/refresh',
    {
      schema: {
        body: refreshInputSchema,
        response: {
          200: refreshResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const input = request.body as any;
      try {
        const tokens = await refreshTokens(input);
        return tokens;
      } catch (err: any) {
        return reply.status(401).send({ error: 'INVALID_REFRESH_TOKEN' });
      }
    },
  );
}