/**
 * Purpose: Service to update an existing page. Currently supports
 * updating the page name only. Returns the fully populated
 * QcmPageRead object after the update. If the page does not exist,
 * throws PAGE_NOT_FOUND.
 *
 * Inputs: Page identifier (UUID string) and a new name string.
 * Outputs: Promise resolving to a QcmPageRead representing the
 * updated page.
 * Events: None (audit logging can be added later).
 * Errors: Throws PAGE_NOT_FOUND if the page cannot be found.
 */

import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { qcmPage } from '@packages/db/src/schema/page';
import { QcmPageRead } from '@packages/schemas/src/qcm';
import { getPage } from './get.service';

export async function updatePage(
  id: string,
  name: string,
): Promise<QcmPageRead> {
  // Ensure page exists before updating
  const pages = await db.select().from(qcmPage).where(eq(qcmPage.id, id));
  if (pages.length === 0) {
    throw new Error('PAGE_NOT_FOUND');
  }
  // Perform update if the name is provided
  await db.update(qcmPage).set({ name }).where(eq(qcmPage.id, id));
  // Reload and return updated page
  const updated = await getPage(id);
  if (!updated) {
    throw new Error('PAGE_NOT_FOUND');
  }
  return updated;
}