/**
 * Purpose: Define the input schema for QCM import operations.  This
 * schema validates the incoming request body when importing a QCM from
 * JSON or XML.  It ensures that the `format` field is one of the
 * supported formats and that the `data` field contains the raw
 * contents of the QCM as a string.
 * Inputs: Request body for importQcm API.
 * Outputs: Zod schema for validation.
 * Events: None.
 * Errors: Validation errors.
 */

import { z } from 'zod';

/**
 * Schema describing the import payload.  `format` denotes the format
 * of the provided data (`json` or `xml`).  `data` contains the raw
 * serialized QCM content.  Clients are responsible for encoding
 * binary data (e.g. files) into a string before sending.
 */
export const qcmImportSchema = z.object({
  format: z.enum(['json', 'xml']),
  data: z.string(),
});

export type QcmImportInput = z.infer<typeof qcmImportSchema>;