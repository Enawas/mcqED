/**
 * Purpose: Service for retrieving audit log entries based on optional
 * filters. Supports filtering by entity type, entity identifier and
 * user identifier as well as pagination. Results are returned in
 * descending order of creation time. This service abstracts the
 * database layer from consumers such as plugins.
 *
 * Inputs: AuditQuery containing optional entity, entityId, userId,
 * limit and offset fields.
 * Outputs: Promise resolving to an array of AuditEvent objects.
 * Events: None (read-only operation).
 * Errors: Propagates database errors and validation is handled by
 * higher layers.
 */

import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../db';
import { auditLog } from '@packages/db/src/schema/audit';
import { AuditEvent, AuditQuery } from '@packages/schemas/src/audit';

export async function listAuditLogs(query: AuditQuery): Promise<AuditEvent[]> {
  // Start building the query
  let builder = db.select().from(auditLog);
  const conditions = [] as any[];
  if (query.entity) {
    conditions.push(eq(auditLog.entity, query.entity));
  }
  if (query.entityId) {
    conditions.push(eq(auditLog.entityId, query.entityId));
  }
  if (query.userId) {
    conditions.push(eq(auditLog.userId, query.userId));
  }
  if (conditions.length > 0) {
    builder = builder.where(and(...conditions));
  }
  builder = builder.orderBy(desc(auditLog.createdAt));
  if (query.limit !== undefined) {
    builder = builder.limit(query.limit);
  }
  if (query.offset !== undefined) {
    builder = builder.offset(query.offset);
  }
  const rows = await builder;
  return rows.map((row) => ({
    id: row.id,
    event: row.event,
    entity: row.entity,
    entityId: row.entityId ?? undefined,
    userId: row.userId ?? undefined,
    before: row.before ?? undefined,
    after: row.after ?? undefined,
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : (row.createdAt as any),
  }));
}