/**
 * Purpose: Service to refresh JWT tokens. Verifies a provided
 * refresh token using the configured REFRESH_SECRET, checks that
 * the associated user still exists, and issues a new access token
 * (and refresh token) signed with the appropriate secrets. Throws
 * an error for invalid tokens or missing configuration.
 * Inputs: RefreshInput containing the refresh token string.
 * Outputs: An object with a new accessToken and refreshToken.
 * Events: None.
 * Errors: Throws errors 'JWT_SECRET_NOT_CONFIGURED',
 * 'INVALID_REFRESH_TOKEN', or 'USER_NOT_FOUND' when appropriate.
 */

import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { db } from '../../db';
import { users } from '@packages/db/src/schema/users';
import { RefreshInput, RefreshResponse } from '@packages/schemas/src/users';

export async function refreshTokens(input: RefreshInput): Promise<RefreshResponse> {
  const refreshSecret = process.env.REFRESH_SECRET;
  const jwtSecret = process.env.JWT_SECRET;
  if (!refreshSecret || !jwtSecret) {
    throw new Error('JWT_SECRET_NOT_CONFIGURED');
  }
  // Verify the refresh token; throws if invalid
  let payload: any;
  try {
    payload = jwt.verify(input.refreshToken, refreshSecret) as any;
  } catch {
    throw new Error('INVALID_REFRESH_TOKEN');
  }
  // Ensure the user still exists (and get their role)
  const rows = await db.select().from(users).where(eq(users.id, payload.id));
  const user = rows[0];
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }
  const newPayload = { id: user.id, role: user.role };
  const accessToken = jwt.sign(newPayload, jwtSecret, { expiresIn: '1h' });
  const newRefreshToken = jwt.sign(newPayload, refreshSecret, { expiresIn: '7d' });
  return { accessToken, refreshToken: newRefreshToken };
}