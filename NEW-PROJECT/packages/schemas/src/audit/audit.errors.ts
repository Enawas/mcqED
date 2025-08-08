/**
 * Purpose: Centralize string constants for audit-related error codes.
 * These codes should be used in services and plugins when throwing
 * or responding to known error conditions. Having a single source of
 * truth helps maintain consistency across the codebase.
 * Inputs: None.
 * Outputs: Enum-like object for error codes and an associated type.
 * Events: None.
 * Errors: None.
 */

export const AuditErrors = {
  NOT_FOUND: 'AUDIT_NOT_FOUND',
  INVALID_INPUT: 'AUDIT_INVALID_INPUT',
} as const;

export type AuditErrorCode = (typeof AuditErrors)[keyof typeof AuditErrors];