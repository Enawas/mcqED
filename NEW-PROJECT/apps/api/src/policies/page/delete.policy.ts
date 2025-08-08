/**
 * Purpose: Authorization policy for deleting pages. Determines
 * whether a user role is permitted to delete a page. For now,
 * only editors and admins can delete pages.
 * Inputs: A user role string.
 * Outputs: Boolean indicating permission.
 */

export function canDeletePage(role: string): boolean {
  return role === 'editor' || role === 'admin';
}