/**
 * Purpose: Service to update the metadata of an existing QCM. Accepts a
 * partial QcmUpdateInput (excluding the ID) and applies any provided
 * changes to the database. Returns the fully populated QcmRead object
 * after the update.
 * Inputs: QCM identifier (string) and QcmUpdateInput containing optional
 * fields (title, description, iconClass, status, difficultyLevel,
 * passingThreshold). Pages and questions are not modified in this
 * iteration.
 * Outputs: A promise resolving to a QcmRead object representing the
 * updated QCM.
 * Events: None (audit logging to be added in future iterations).
 * Errors: Throws an error with message 'QCM_NOT_FOUND' if the QCM does
 * not exist.
 */

import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { qcm as qcmTable } from '@packages/db/src/schema/qcm';
import { qcmPage } from '@packages/db/src/schema/page';
import { question } from '@packages/db/src/schema/question';
import { QcmUpdateInput, QcmRead, QcmPageRead } from '@packages/schemas/src/qcm';
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

export async function updateQcm(id: string, input: QcmUpdateInput): Promise<QcmRead> {
  // Check existence of the QCM
  const existingRows = await db.select().from(qcmTable).where(eq(qcmTable.id, id));
  if (existingRows.length === 0) {
    throw new Error('QCM_NOT_FOUND');
  }
  // Build the update object from provided fields
  const updateObject: Partial<typeof qcmTable.$inferInsert> = {};
  if (input.title !== undefined) updateObject.title = input.title;
  if (input.description !== undefined) updateObject.description = input.description;
  if (input.iconClass !== undefined) updateObject.iconClass = input.iconClass;
  if (input.status !== undefined) updateObject.status = input.status as any;
  if (input.difficultyLevel !== undefined) updateObject.difficultyLevel = input.difficultyLevel;
  if (input.passingThreshold !== undefined) updateObject.passingThreshold = input.passingThreshold;
  // Apply update only if there are fields to update
  if (Object.keys(updateObject).length > 0) {
    await db.update(qcmTable).set(updateObject).where(eq(qcmTable.id, id));
  }
  // Pages and questions are not updated in this iteration
  const updated = await getFullQcm(id);
  if (!updated) {
    throw new Error('QCM_NOT_FOUND');
  }
  return updated;
}