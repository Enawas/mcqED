/**
 * Purpose: Authorization policy for editing questions. Determines
 * whether a given user role is permitted to edit questions in the
 * system. This policy does not apply to creating or deleting
 * questions.
 * Inputs: A user role string.
 * Outputs: Boolean indicating permission.
 */

export function canEditQuestion(role: string): boolean {
  // In v1, only users with 'editor' or 'admin' roles may edit questions.
  return role === 'editor' || role === 'admin';
}