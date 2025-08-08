/**
 * Purpose: Define the shape of an audit log entry returned by the API.
 * Each event captures a change in the system, including the entity type,
 * the action performed, optional before/after snapshots, and a timestamp.
 * Inputs: None (schema definitions only).
 * Outputs: Zod schema and TypeScript type for audit events.
 * Events: None.
 * Errors: None.
 */

import { z } from 'zod';

/**
 * Schema representing a single audit log event.  The `entityId` and
 * `userId` fields are nullable because some operations may not be
 * associated with a specific entity or user (e.g., anonymous imports).
 * The `before` and `after` fields store arbitrary JSON values capturing
 * the state before and after the operation, respectively.
 */
export const auditEventSchema = z.object({
  id: z.string().uuid(),
  event: z.string(),
  entity: z.string(),
  entityId: z.string().uuid().nullable().optional(),
  userId: z.string().uuid().nullable().optional(),
  before: z.any().optional(),
  after: z.any().optional(),
  createdAt: z.string(),
});

export type AuditEvent = z.infer<typeof auditEventSchema>;