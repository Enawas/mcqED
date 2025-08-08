/**
 * Purpose: Service to reorder a question within its page by moving it up or down
 * relative to its current position. Swaps the question's position with the
 * adjacent question in the specified direction. If the question is already at
 * the start or end of the list, the function returns without modifying
 * anything. Does not return a value; the caller can reload the page
 * after reordering to get updated ordering.
 *
 * Inputs: Question identifier (UUID string) and a direction ('up' | 'down').
 * Outputs: Promise resolved when the operation completes.
 * Events: None (audit could be added in future iterations).
 * Errors: Throws QUESTION_NOT_FOUND if the question does not exist.
 */

import { asc, desc, eq, gt, lt } from 'drizzle-orm';
import { db } from '../../db';
import { question as questionTable } from '@packages/db/src/schema/question';

export async function reorderQuestion(
  questionId: string,
  direction: 'up' | 'down',
): Promise<void> {
  // Fetch the question row
  const rows = await db.select().from(questionTable).where(eq(questionTable.id, questionId));
  const q = rows[0];
  if (!q) {
    throw new Error('QUESTION_NOT_FOUND');
  }
  // Determine the adjacent question depending on direction
  let sibling;
  if (direction === 'up') {
    sibling = (
      await db
        .select()
        .from(questionTable)
        .where(eq(questionTable.pageId, q.pageId))
        .and(lt(questionTable.position, q.position))
        .orderBy(desc(questionTable.position))
        .limit(1)
    )[0];
  } else {
    sibling = (
      await db
        .select()
        .from(questionTable)
        .where(eq(questionTable.pageId, q.pageId))
        .and(gt(questionTable.position, q.position))
        .orderBy(asc(questionTable.position))
        .limit(1)
    )[0];
  }
  if (!sibling) {
    // Cannot move further; nothing to do
    return;
  }
  // Swap positions atomically
  await db.transaction(async (trx) => {
    await trx
      .update(questionTable)
      .set({ position: sibling.position })
      .where(eq(questionTable.id, q.id));
    await trx
      .update(questionTable)
      .set({ position: q.position })
      .where(eq(questionTable.id, sibling.id));
  });
}