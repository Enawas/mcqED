/**
 * Purpose: Authorization policy to determine whether a given user role
 * may edit QCM metadata. Editing includes updating the title,
 * description, icon, status, difficulty and passing threshold. This
 * policy does not govern deletion or creation of QCMs.
 * Inputs: User role as a string.
 * Outputs: Boolean indicating whether the role is allowed to edit.
 */

export function canEditQcm(role: string): boolean {
  // Allow editing for users with 'editor' or 'admin' roles. Guests and
  // other roles are denied.
  return role === 'editor' || role === 'admin';
}