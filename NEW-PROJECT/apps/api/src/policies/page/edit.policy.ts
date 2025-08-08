/**
 * Purpose: Authorization policy for editing pages. Determines
 * whether a given user role is permitted to rename pages. At
 * present, only 'editor' and 'admin' roles are allowed.
 * Inputs: A user role string.
 * Outputs: Boolean indicating permission.
 */

export function canEditPage(role: string): boolean {
  return role === 'editor' || role === 'admin';
}