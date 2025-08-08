/**
 * Purpose: Service to reorder a page within its QCM by moving it up or down
 * relative to its current position. Swaps the page's position with the
 * adjacent page in the specified direction. If the page is already at
 * the start or end of the list, the function returns without modifying
 * anything. Does not return a value; the caller can reload the QCM
 * after reordering to get updated ordering.
 *
 * Inputs: Page identifier (UUID string) and a direction ('up' | 'down').
 * Outputs: Promise resolved when the operation completes.
 * Events: None (audit could be added in future iterations).
 * Errors: Throws PAGE_NOT_FOUND if the page does not exist.
 */

import { asc, desc, eq, gt, lt } from 'drizzle-orm';
import { db } from '../../db';
import { qcmPage } from '@packages/db/src/schema/page';

export async function reorderPage(
  pageId: string,
  direction: 'up' | 'down',
): Promise<void> {
  // Fetch the page row
  const pages = await db.select().from(qcmPage).where(eq(qcmPage.id, pageId));
  const page = pages[0];
  if (!page) {
    throw new Error('PAGE_NOT_FOUND');
  }
  // Find the adjacent page depending on the direction
  let sibling;
  if (direction === 'up') {
    sibling = (
      await db
        .select()
        .from(qcmPage)
        .where(eq(qcmPage.qcmId, page.qcmId))
        .and(lt(qcmPage.position, page.position))
        .orderBy(desc(qcmPage.position))
        .limit(1)
    )[0];
  } else {
    sibling = (
      await db
        .select()
        .from(qcmPage)
        .where(eq(qcmPage.qcmId, page.qcmId))
        .and(gt(qcmPage.position, page.position))
        .orderBy(asc(qcmPage.position))
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
      .update(qcmPage)
      .set({ position: sibling.position })
      .where(eq(qcmPage.id, page.id));
    await trx
      .update(qcmPage)
      .set({ position: page.position })
      .where(eq(qcmPage.id, sibling.id));
  });
}