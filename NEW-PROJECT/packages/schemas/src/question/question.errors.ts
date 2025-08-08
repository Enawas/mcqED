/**
 * Purpose: Enumerate standardized error codes related to question operations.
 * Inputs: None.
 * Outputs: Enum object for error handling in services and API.
 * Events: None.
 * Errors: None (this file defines error constants).
 */
export const QuestionErrors = {
  NOT_FOUND: 'QUESTION_NOT_FOUND',
  INVALID_INPUT: 'QUESTION_INVALID_INPUT',
  CONFLICT: 'QUESTION_CONFLICT',
} as const;

export type QuestionErrorCode = (typeof QuestionErrors)[keyof typeof QuestionErrors];