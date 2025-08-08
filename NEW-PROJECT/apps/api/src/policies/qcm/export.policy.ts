/**
 * Purpose: Authorization policy for QCM export.  Determines whether a
 * given user role is permitted to export a QCM.  By default, all
 * authenticated and anonymous users may export QCMs for viewing or
 * backup.  Adjust this logic if sensitive information must be
 * restricted.
 * Inputs: User role string.
 * Outputs: Boolean indicating permission.
 */

export function canExportQcm(role: string): boolean {
  // Only editors and administrators are permitted to export QCMs.
  // Restricting exports prevents unauthorized access to potentially
  // sensitive data and aligns with stricter RBAC requirements.
  return role === 'editor' || role === 'admin';
}