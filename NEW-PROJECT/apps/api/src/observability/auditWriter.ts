/**
 * Purpose: Utility for recording audit log entries.  Services and
 * plugins can call this function to persist information about
 * mutative operations to the database. It abstracts away the
 * underlying database implementation.
 * Inputs: Event name (e.g. 'qcm.created'), entity type (e.g. 'qcm'),
 * entity identifier (UUID or null), user identifier (UUID or null),
 * and optional before/after snapshots capturing the state change.
 * Outputs: Promise resolved when the log entry has been persisted.
 * Events: Writes to the audit_log table.
 * Errors: Propagates database errors.
 */

import { db } from '../db';
import { auditLog } from '@packages/db/src/schema/audit';

export async function recordAudit(
  event: string,
  entity: string,
  entityId: string | null,
  userId: string | null,
  before?: any,
  after?: any,
): Promise<void> {
  await db.insert(auditLog).values({
    event,
    entity,
    entityId: entityId ?? null,
    userId: userId ?? null,
    before: before ?? null,
    after: after ?? null,
  });
}