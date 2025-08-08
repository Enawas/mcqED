/**
 * Purpose: Authorization policy for toggling the favourite status of a QCM.
 * Inputs: Role string representing the authenticated user's role.
 * Outputs: Boolean indicating whether the action is permitted.
 * Events: None.
 * Errors: None.
 */

export function canToggleFavorite(role: string): boolean {
  // In this initial implementation, allow editors and admins to toggle
  // favourites. Guests may not modify server state.
  return role === 'editor' || role === 'admin';
}