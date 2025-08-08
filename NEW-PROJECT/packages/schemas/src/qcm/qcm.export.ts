/**
 * Purpose: Define the query schema for QCM export operations.  This
 * schema validates the `format` query parameter when exporting a
 * QCM.  Supported formats are `json` and `xml`.
 * Inputs: Query parameters for exportQcm API.
 * Outputs: Zod schema for validation.
 * Events: None.
 * Errors: Validation errors.
 */

import { z } from 'zod';

/**
 * Schema describing the query parameters when exporting a QCM.  Only
 * the `format` field is currently supported.  Future versions may
 * include additional flags (e.g. includeAnswers).
 */
export const qcmExportSchema = z.object({
  format: z.enum(['json', 'xml']).default('json'),
});

export type QcmExportInput = z.infer<typeof qcmExportSchema>;