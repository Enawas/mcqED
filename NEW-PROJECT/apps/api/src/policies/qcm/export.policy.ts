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
  // Permit all roles (including guests) to export QCMs.  Modify
  // this logic if you wish to restrict exports to specific roles.
  return true;
}