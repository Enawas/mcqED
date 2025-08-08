/**
 * Purpose: Service to delete an existing page and its associated questions.
 * Inputs: Page identifier (UUID string).
 * Outputs: Promise resolving to void when deletion is complete.
 * Events: None (audit logging can be added later).
 * Errors: Throws PAGE_NOT_FOUND if the page does not exist.
 */

import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { qcmPage } from '@packages/db/src/schema/page';
import { question } from '@packages/db/src/schema/question';

export async function deletePage(id: string): Promise<void> {
  // Check that the page exists
  const pages = await db.select().from(qcmPage).where(eq(qcmPage.id, id));
  if (pages.length === 0) {
    throw new Error('PAGE_NOT_FOUND');
  }
  // Delete questions associated with the page
  await db.delete(question).where(eq(question.pageId, id));
  // Delete the page itself
  await db.delete(qcmPage).where(eq(qcmPage.id, id));
}