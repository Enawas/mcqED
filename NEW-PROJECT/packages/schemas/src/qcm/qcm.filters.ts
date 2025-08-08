/**
 * Purpose: Define filter schemas for querying QCMs.  These schemas are used
 * in query parameters to filter lists by title, difficulty or icon.
 * Inputs: Query parameters from the client.
 * Outputs: Zod schemas for validation.
 * Events: None.
 * Errors: Validation errors.
 */
import { z } from 'zod';
import { qcmDifficultySchema } from './qcm.read';

export const qcmFilterSchema = z.object({
  search: z.string().optional(),
  difficulty: qcmDifficultySchema.optional(),
  icon: z.string().optional(),
});

export type QcmFilter = z.infer<typeof qcmFilterSchema>;