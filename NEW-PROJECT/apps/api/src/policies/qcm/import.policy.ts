/**
 * Purpose: Authorization policy for QCM import.  Determines whether a
 * given user role is permitted to import a new QCM from external data.
 * Inputs: User role string.
 * Outputs: Boolean indicating permission.
 */

export function canImportQcm(role: string): boolean {
  // Only editors and administrators may import QCMs.  This prevents
  // anonymous users from injecting content into the system.
  return role === 'editor' || role === 'admin';
}