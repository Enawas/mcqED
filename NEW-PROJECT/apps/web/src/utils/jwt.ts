/**
 * Utility functions for working with JWT tokens on the client. Provides
 * helpers to decode a JWT payload and extract the user role from the
 * locally stored access token. If decoding fails, returns null.
 */

/**
 * Decodes a JWT and returns its payload as an object. This helper
 * decodes the base64url-encoded payload segment of the token. If
 * decoding fails or the token is malformed, undefined is returned.
 *
 * @param token The JWT string to decode.
 * @returns The decoded payload object or undefined on error.
 */
export function parseJwt(token: string): any | undefined {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return undefined;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Error decoding JWT', err);
    return undefined;
  }
}

/**
 * Retrieves the current user's role from the stored access token. Returns
 * null if no valid token is present or the role field is missing.
 *
 * @returns The role string (e.g. 'admin', 'editor', 'user') or null.
 */
export function getUserRole(): string | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  const payload = parseJwt(token);
  if (payload && typeof payload.role === 'string') {
    return payload.role;
  }
  return null;
}