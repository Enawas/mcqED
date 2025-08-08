/**
 * Purpose: Fastify preHandler plugin to verify JWT tokens and attach
 * user information to the request object. It inspects the
 * Authorization header for a Bearer token, verifies it using the
 * configured JWT secret, and populates request.user with id and role.
 * If verification fails, the request proceeds without a user.
 * Inputs: Fastify instance.
 * Outputs: Adds a preHandler hook.
 * Events: None.
 * Errors: None (invalid tokens are silently ignored).
 */

import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';

export async function jwtAuthPlugin(fastify: FastifyInstance) {
  fastify.addHook('preHandler', async (request) => {
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring('Bearer '.length);
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        // If JWT secret isn't set, we cannot verify; skip assignment.
        return;
      }
      try {
        const payload = jwt.verify(token, secret) as any;
        // Attach user data to request. Use id and role if present.
        (request as any).user = { id: payload.id, role: payload.role };
      } catch {
        // Ignore errors; treat as unauthenticated.
      }
    }
  });
}