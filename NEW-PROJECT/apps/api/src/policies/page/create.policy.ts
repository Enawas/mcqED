/**
 * Purpose: Authorization policy for creating pages. Determines
 * whether a user role is permitted to create a new page within a QCM.
 * Inputs: A user role string.
 * Outputs: Boolean indicating permission.
 */

export function canCreatePage(role: string): boolean {
  // Allow editors and admins to create pages. Guests are forbidden.
  return role === 'editor' || role === 'admin';
}