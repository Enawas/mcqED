/**
 * Purpose: Service to update the lastScore and lastTime fields on a QCM.
 * Accepts a QCM identifier, a score (0–100) and an elapsed time in seconds,
 * applies the update in the database and returns the fully populated
 * QcmRead object after the update. Throws QCM_NOT_FOUND if the QCM
 * does not exist.
 *
 * Inputs: QCM id (string UUID), score (number), time (number seconds).
 * Outputs: Promise resolving to the updated QcmRead.
 * Events: None (audit logging could be added later).
 * Errors: Throws an Error with message 'QCM_NOT_FOUND' if the QCM
 * cannot be found.
 */

import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { qcm } from '@packages/db/src/schema/qcm';
import { getQcm } from './get.service';
import { QcmRead } from '@packages/schemas/src/qcm';

export async function updateStats(
  id: string,
  score: number,
  time: number,
): Promise<QcmRead> {
  // Verify that the QCM exists
  const existing = await db.select().from(qcm).where(eq(qcm.id, id));
  if (existing.length === 0) {
    throw new Error('QCM_NOT_FOUND');
  }
  // Perform the update; time is stored as integer seconds
  await db.update(qcm).set({ lastScore: score, lastTime: time }).where(eq(qcm.id, id));
  // Reload and return updated QCM
  const updated = await getQcm(id);
  if (!updated) {
    throw new Error('QCM_NOT_FOUND');
  }
  return updated;
}