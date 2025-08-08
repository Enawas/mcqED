/**
 * Purpose: Fastify plugin to handle user login. Registers the POST
 * /auth/login route, validates input using Zod, authenticates the
 * user via the login service, and returns JWT tokens. Returns a
 * 401 error if credentials are invalid. Secrets are pulled from
 * environment variables; missing secrets will throw an error.
 * Inputs: Fastify instance.
 * Outputs: HTTP route handler for authentication.
 * Events: None (audit logging can be added later).
 * Errors: Returns 401 Unauthorized for invalid credentials.
 */

import { FastifyInstance } from 'fastify';
import { loginInputSchema, loginResponseSchema } from '@packages/schemas/src/users/auth.login';
import { loginUser } from '../../../services/auth/login.service';

export async function authLoginPlugin(fastify: FastifyInstance) {
  fastify.post(
    '/auth/login',
    {
      schema: {
        body: loginInputSchema,
        response: {
          200: loginResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const input = request.body as any;
      try {
        const tokens = await loginUser(input);
        return tokens;
      } catch (err: any) {
        if (err.message === 'INVALID_CREDENTIALS') {
          return reply.status(401).send({ error: 'INVALID_CREDENTIALS' });
        }
        throw err;
      }
    },
  );
}