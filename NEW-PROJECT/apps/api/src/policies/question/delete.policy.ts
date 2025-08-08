/**
 * Purpose: Authorization policy for deleting questions. Allows
 * specified roles to remove questions from a page. In v1, only
 * editors and admins are allowed.
 * Inputs: A user role string.
 * Outputs: Boolean indicating permission.
 */

export function canDeleteQuestion(role: string): boolean {
  return role === 'editor' || role === 'admin';
}