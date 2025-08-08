/**
 * Purpose: Authorization policy for listing audit logs. Only
 * privileged roles should be allowed to access the audit history.
 * Inputs: A user role string.
 * Outputs: Boolean indicating whether listing is permitted.
 */

export function canListAudit(role: string): boolean {
  // Only administrators and editors may view audit logs. Expanding
  // access to editors facilitates debugging and monitoring while
  // maintaining restrictions on less privileged roles.
  return role === 'admin' || role === 'editor';
}