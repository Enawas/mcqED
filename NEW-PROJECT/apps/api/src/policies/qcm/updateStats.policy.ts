/**
 * Purpose: Authorization policy for updating the stats (lastScore/lastTime)
 * of a QCM. Determines whether a given user role is permitted to
 * record quiz results. In this version, all roles (including guest)
 * are allowed to update stats to ensure results are persisted
 * regardless of authentication status.
 * Inputs: User role string.
 * Outputs: Boolean indicating permission.
 */

export function canUpdateStats(role: string): boolean {
  // Allow any role to update stats; adjust as needed when RBAC
  // definitions become more stringent.
  return true;
}