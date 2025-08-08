/**
 * Purpose: Define the database schema for audit logs. Each log entry
 * records a mutative event (create, update, delete, import, etc.) for
 * later analysis or compliance. The schema includes the event name,
 * entity type, entity identifier, user identifier, optional before
 * and after states, and a timestamp.
 * Inputs: None (schema definitions only).
 * Outputs: Table definition for audit_log exported for migrations and queries.
 * Events: None.
 * Errors: None.
 */

import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';

/**
 * Table definition for audit logs. Each entry captures a single event
 * occurring in the system. `event` names follow the pattern
 * `<entity>.<action>` (e.g., 'qcm.created'). `entity` is the top-level
 * entity type (e.g., 'qcm', 'page', 'question'). Both before and
 * after fields are stored as JSONB to allow flexible snapshots of
 * mutated objects. The `userId` field may be null if the action
 * occurred without authentication (e.g., anonymous import).
 */
export const auditLog = pgTable('audit_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  event: varchar('event', { length: 50 }).notNull(),
  entity: varchar('entity', { length: 50 }).notNull(),
  entityId: uuid('entity_id'),
  userId: uuid('user_id'),
  before: jsonb('before'),
  after: jsonb('after'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type AuditLogModel = typeof auditLog;