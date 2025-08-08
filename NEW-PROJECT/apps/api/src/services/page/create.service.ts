/**
 * Purpose: Service to create a new page within an existing QCM. Validates
 * that the QCM exists, generates a new UUID for the page, inserts it
 * into the database, and returns the created page object with an empty
 * questions list.
 * Inputs: QCM identifier (UUID string) and a PageCreateInput
 * Outputs: Promise resolving to a QcmPageRead object representing the
 * new page.
 * Events: None (audit logging can be added later).
 * Errors: Throws QCM_NOT_FOUND if the parent QCM does not exist.
 */

import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { qcm as qcmTable } from '@packages/db/src/schema/qcm';
import { qcmPage } from '@packages/db/src/schema/page';
import { PageCreateInput } from '@packages/schemas/src/page';
import { QcmPageRead } from '@packages/schemas/src/qcm';

export async function createPage(
  qcmId: string,
  input: PageCreateInput,
): Promise<QcmPageRead> {
  // Ensure the parent QCM exists
  const qcms = await db.select().from(qcmTable).where(eq(qcmTable.id, qcmId));
  if (qcms.length === 0) {
    throw new Error('QCM_NOT_FOUND');
  }
  const pageId = randomUUID();
  // Determine the next position for the new page. We find the maximum
  // existing position for this QCM and add 1. If no pages exist, the
  // position starts at 1.
  const existing = await db
    .select({ pos: qcmPage.position })
    .from(qcmPage)
    .where(eq(qcmPage.qcmId, qcmId));
  const maxPos = existing.reduce((max, row) => (row.pos > max ? row.pos : max), 0);
  const nextPos = maxPos + 1;
  await db.insert(qcmPage).values({ id: pageId, qcmId, name: input.name, position: nextPos });
  return { id: pageId, name: input.name, questions: [] };
}