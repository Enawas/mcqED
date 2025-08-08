/**
 * Purpose: Authorization policy for creating questions. Allows certain
 * roles to add questions to a page. In v1, editors and admins are
 * permitted.
 * Inputs: A user role string.
 * Outputs: Boolean indicating permission.
 */

export function canCreateQuestion(role: string): boolean {
  return role === 'editor' || role === 'admin';
}