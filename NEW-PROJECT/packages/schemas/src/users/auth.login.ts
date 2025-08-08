/**
 * Purpose: Define input and output schemas for user authentication (login).
 * Inputs: None (Zod schemas define the structure of expected inputs and outputs).
 * Outputs: Zod schemas and TypeScript types for login operations.
 * Events: None.
 * Errors: None (validation errors are handled by Zod).
 */

import { z } from 'zod';

/**
 * Schema for login request body. Users must provide a valid email and a
 * non-empty password. Additional fields will be stripped.
 */
export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Schema for login response. The API returns an access token and optionally
 * a refresh token. These tokens are JWT strings.
 */
export const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;