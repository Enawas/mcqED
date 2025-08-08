/**
 * Purpose: Service to authenticate a user and generate JWT tokens. This
 * service verifies credentials against the database, hashes passwords
 * using bcryptjs, and issues signed JWT tokens using secrets from
 * environment variables. It throws an error if credentials are invalid.
 * Inputs: LoginInput containing email and password.
 * Outputs: Object with accessToken and refreshToken.
 * Events: None (authentication audit could be added in the future).
 * Errors: Throws an Error with message 'INVALID_CREDENTIALS' for invalid
 * credentials.
 */

import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '@packages/db/src/schema/users';
import { LoginInput, LoginResponse } from '@packages/schemas/src/users';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function loginUser(input: LoginInput): Promise<LoginResponse> {
  // Lookup user by email
  const rows = await db.select().from(users).where(eq(users.email, input.email));
  const user = rows[0];
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }
  // Verify password using bcrypt
  const passwordMatches = await bcrypt.compare(input.password, user.password);
  if (!passwordMatches) {
    throw new Error('INVALID_CREDENTIALS');
  }
  // Prepare JWT payload with user id and role
  const payload = { id: user.id, role: user.role };
  // Sign access token (1h expiry) and refresh token (7d expiry)
  const jwtSecret = process.env.JWT_SECRET;
  const refreshSecret = process.env.REFRESH_SECRET;
  if (!jwtSecret || !refreshSecret) {
    throw new Error('JWT_SECRET_NOT_CONFIGURED');
  }
  const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}