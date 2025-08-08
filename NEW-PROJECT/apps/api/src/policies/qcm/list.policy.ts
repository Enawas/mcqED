/**
 * Purpose: Authorization policy for listing QCMs.  Determines whether
 * a given user role is permitted to list QCMs.
 * Inputs: User role string.
 * Outputs: Boolean indicating permission.
 * Events: None.
 * Errors: None.
 */
export function canListQcm(role: string): boolean {
  // TODO: implement real RBAC logic.  For v1, all roles including guests
  // are allowed to list QCMs.
  return true;
}