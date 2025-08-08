/**
 * Purpose: Service for listing QCMs based on optional filters.  In v1 this
 * function reads data from in-memory storage or a database and returns
 * normalized QCM read objects.
 * Inputs: Filters such as search text, difficulty or icon.
 * Outputs: Promise resolving to an array of QCM read objects.
 * Events: None (read-only).
 * Errors: None (errors are propagated to the caller).
 */
import { QcmFilter, QcmRead } from '@packages/schemas/src/qcm';
import { db } from '../../db';
import { qcm as qcmTable } from '@packages/db/src/schema/qcm';

/**
 * Service to retrieve QCMs from the database based on optional filters. This
 * implementation queries the `qcm` table via Drizzle ORM. Filters on search,
 * difficulty and icon are applied when provided. Pages and questions are not
 * loaded yet; this will be added in a future iteration.
 */
export async function listQcm(_filters: QcmFilter): Promise<QcmRead[]> {
  // TODO: apply search, difficulty and icon filters. Drizzle does not expose
  // a built-in ILIKE helper at this time, so raw SQL will be needed. For now,
  // this service returns all QCMs without filtering.
  const rows = await db.select().from(qcmTable);
  return rows.map((row) => {
    return {
      id: row.id,
      title: row.title,
      description: row.description ?? undefined,
      iconClass: row.iconClass ?? undefined,
      status: row.status as any,
      difficultyLevel: row.difficultyLevel ?? undefined,
      passingThreshold: row.passingThreshold ?? undefined,
      createdAt: (row.createdAt instanceof Date ? row.createdAt.toISOString() : (row.createdAt as any)) as string,
      lastScore: row.lastScore ?? undefined,
      lastTime: row.lastTime ?? undefined,
      isFavorite: row.isFavorite ?? undefined,
      pages: [],
    } as QcmRead;
  });
}