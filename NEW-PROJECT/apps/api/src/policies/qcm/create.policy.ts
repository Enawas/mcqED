/**
 * Purpose: Authorization policy for creating QCMs. Determines whether a
 * given user role has sufficient privileges to create a new QCM in the
 * system. Roles such as 'editor' and 'admin' are allowed by default.
 * Inputs: A role string from the authenticated user context.
 * Outputs: Boolean indicating whether the operation is permitted.
 * Events: None.
 * Errors: None.
 */

export function canCreateQcm(role: string): boolean {
  // In v1, we restrict creation to editor and admin roles. Guests are
  // explicitly denied.  This logic can be extended or replaced with a
  // database-driven RBAC mechanism in the future.
  return role === 'editor' || role === 'admin';
}