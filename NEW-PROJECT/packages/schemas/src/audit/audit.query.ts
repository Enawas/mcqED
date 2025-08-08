/**
 * Purpose: Define the schema for filtering audit logs when listing.
 * Allows clients to specify optional filters such as entity type,
 * entity ID, user ID, and pagination parameters.  The default
 * behaviour when no filters are provided is to return all entries
 * ordered by creation time.
 * Inputs: Query parameters from HTTP requests.
 * Outputs: Zod schema and TypeScript type representing the query.
 * Events: None.
 * Errors: Validation errors when parameters are invalid.
 */

import { z } from 'zod';

/**
 * Schema for listing audit logs.  Each field is optional; when
 * provided, the corresponding filter is applied.  Limits are
 * constrained to avoid excessive resource use.
 */
export const auditQuerySchema = z.object({
  entity: z.string().optional(),
  entityId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional(),
  offset: z
    .number()
    .int()
    .min(0)
    .optional(),
});

export type AuditQuery = z.infer<typeof auditQuerySchema>;