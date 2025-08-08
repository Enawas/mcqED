/**
 * Purpose: Define input schema for creating a new page within a QCM.
 * Inputs: None directly; this schema is used to validate incoming
 * request bodies when creating pages via the API.
 * Outputs: Zod schema and inferred TypeScript type.
 * Events: None.
 * Errors: Validation errors are thrown by Zod if the structure does
 * not conform.
 */
import { z } from 'zod';

// Schema for creating a new page; requires a non-empty name
export const pageCreateSchema = z.object({
  name: z.string().min(1),
});

export type PageCreateInput = z.infer<typeof pageCreateSchema>;