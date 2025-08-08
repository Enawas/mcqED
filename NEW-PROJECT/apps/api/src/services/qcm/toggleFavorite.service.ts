/**
 * Purpose: Service to toggle the favourite status of a QCM. Looks up the QCM
 * by its identifier, flips the boolean `isFavorite` flag, persists the
 * change to the database and returns the fully populated QCM object.
 * Inputs: QCM identifier (string).
 * Outputs: A promise resolving to an updated QcmRead object.
 * Events: None (auditing will be added in future iterations).
 * Errors: Throws an error if the QCM is not found.
 */

import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { qcm as qcmTable } from '@packages/db/src/schema/qcm';
import { qcmPage } from '@packages/db/src/schema/page';
import { question } from '@packages/db/src/schema/question';
import { QcmRead, QcmPageRead } from '@packages/schemas/src/qcm';
import { QuestionRead } from '@packages/schemas/src/question';

/**
 * Retrieves a full QCM (with pages and questions) by its ID. Returns
 * undefined if the QCM does not exist.
 */
async function getFullQcm(id: string): Promise<QcmRead | undefined> {
  const rows = await db.select().from(qcmTable).where(eq(qcmTable.id, id));
  const qcmRow = rows[0];
  if (!qcmRow) return undefined;
  // Load pages
  const pages = await db.select().from(qcmPage).where(eq(qcmPage.qcmId, id));
  const pageObjects: QcmPageRead[] = [];
  for (const page of pages) {
    const questions = await db.select().from(question).where(eq(question.pageId, page.id));
    const questionObjects: QuestionRead[] = questions.map((q) => ({
      id: q.id,
      text: q.text,
      type: q.type as QuestionRead['type'],
      options: q.options as any,
      correctAnswers: q.correctAnswers as any,
      explanation: q.explanation ?? undefined,
    }));
    pageObjects.push({
      id: page.id,
      name: page.name,
      questions: questionObjects,
    });
  }
  return {
    id: qcmRow.id,
    title: qcmRow.title,
    description: qcmRow.description ?? undefined,
    iconClass: qcmRow.iconClass ?? undefined,
    status: qcmRow.status as any,
    difficultyLevel: qcmRow.difficultyLevel ?? undefined,
    passingThreshold: qcmRow.passingThreshold ?? undefined,
    createdAt: (qcmRow.createdAt instanceof Date
      ? qcmRow.createdAt.toISOString()
      : (qcmRow.createdAt as any)) as string,
    lastScore: qcmRow.lastScore ?? undefined,
    lastTime: qcmRow.lastTime ?? undefined,
    isFavorite: qcmRow.isFavorite ?? undefined,
    pages: pageObjects,
  };
}

export async function toggleFavoriteQcm(id: string): Promise<QcmRead> {
  // Find the QCM to determine current favourite status
  const existingRows = await db.select().from(qcmTable).where(eq(qcmTable.id, id));
  const existing = existingRows[0];
  if (!existing) {
    throw new Error('QCM_NOT_FOUND');
  }
  const newValue = !existing.isFavorite;
  await db.update(qcmTable).set({ isFavorite: newValue }).where(eq(qcmTable.id, id));
  const updated = await getFullQcm(id);
  if (!updated) {
    throw new Error('QCM_NOT_FOUND');
  }
  return updated;
}