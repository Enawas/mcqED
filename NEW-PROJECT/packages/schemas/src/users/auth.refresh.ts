/**
 * Purpose: Define input and response schemas for token refresh
 * operations. These schemas validate the refresh token provided
 * by the client and the new tokens returned by the server.
 * Inputs: None (schemas define structure for Fastify/Zod).
 * Outputs: Zod schemas for refresh input and response.
 * Events: None.
 * Errors: Validation errors if the input does not conform.
 */

import { z } from 'zod';

// Input schema requires a non-empty refreshToken string
export const refreshInputSchema = z.object({
  refreshToken: z.string().min(1),
});

// Response schema includes a new accessToken and optionally a new refreshToken
export const refreshResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
});

export type RefreshInput = z.infer<typeof refreshInputSchema>;
export type RefreshResponse = z.infer<typeof refreshResponseSchema>;