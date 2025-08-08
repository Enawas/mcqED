/**
 * Purpose: Authorization policy for listing audit logs. Only
 * privileged roles should be allowed to access the audit history.
 * Inputs: A user role string.
 * Outputs: Boolean indicating whether listing is permitted.
 */

export function canListAudit(role: string): boolean {
  // In this implementation, only 'admin' roles may view audit logs.
  // Additional roles such as 'auditor' could be added in the future.
  return role === 'admin';
}