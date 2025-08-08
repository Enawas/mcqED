/**
 * Purpose: Enumerate standardized error codes for QCM operations.
 * Inputs: None.
 * Outputs: Enum object for error handling.
 * Events: None.
 * Errors: None.
 */
export const QcmErrors = {
  NOT_FOUND: 'QCM_NOT_FOUND',
  INVALID_INPUT: 'QCM_INVALID_INPUT',
  CONFLICT: 'QCM_CONFLICT',
} as const;

export type QcmErrorCode = (typeof QcmErrors)[keyof typeof QcmErrors];