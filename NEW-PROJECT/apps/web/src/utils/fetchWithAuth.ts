/**
 * Purpose: Provide a unified helper for making authenticated HTTP
 * requests from the frontend. Automatically adds the Authorization
 * header if an access token is present, attempts to refresh the
 * token on a 401 response using the stored refresh token, and
 * retries the original request once. If refresh fails, tokens are
 * removed from localStorage and the original response is returned.
 * Inputs: URL string and optional RequestInit options.
 * Outputs: A Promise resolving to a Response object.
 * Errors: Network errors are propagated to the caller.
 */

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  retry: boolean = true,
): Promise<Response> {
  // Clone options and headers to avoid mutating caller's object
  const opts: RequestInit = { ...options };
  const headers = new Headers(opts.headers || {});
  const token = localStorage.getItem('accessToken');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  opts.headers = headers;
  let response: Response;
  try {
    response = await fetch(url, opts);
  } catch (err) {
    // Propagate network errors
    throw err;
  }
  // If unauthorized and retry is allowed, attempt refresh
  if (response.status === 401 && retry) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshResp = await fetch('http://localhost:3000/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (refreshResp.ok) {
          const data = await refreshResp.json();
          // Save new tokens
          localStorage.setItem('accessToken', data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }
          // Retry original request with new token; disable further retries
          return fetchWithAuth(url, options, false);
        }
      } catch {
        // Ignore refresh errors
      }
    }
    // On failure, remove tokens and return original response
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  return response;
}