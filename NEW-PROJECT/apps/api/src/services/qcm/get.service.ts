/**
 * Purpose: Service for retrieving a single QCM along with its pages and
 * questions from the database. This function hides the persistence logic
 * behind a simple API and returns undefined if the QCM is not found.
 * Inputs: QCM identifier (UUID string).
 * Outputs: Promise resolving to a QcmRead or undefined.
 * Events: None.
 * Errors: Propagates database errors to the caller.
 */

import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { qcm } from '@packages/db/src/schema/qcm';
import { qcmPage } from '@packages/db/src/schema/page';
import { question } from '@packages/db/src/schema/question';
import { QcmRead, QcmPageRead } from '@packages/schemas/src/qcm';
import { QuestionRead } from '@packages/schemas/src/question';

export async function getQcm(id: string): Promise<QcmRead | undefined> {
  // Fetch the QCM row
  const qRows = await db.select().from(qcm).where(eq(qcm.id, id));
  const qcmRow = qRows[0];
  if (!qcmRow) return undefined;
  // Load all pages belonging to this QCM
  const pages = await db.select().from(qcmPage).where(eq(qcmPage.qcmId, id));
  const pageObjects: QcmPageRead[] = [];
  for (const page of pages) {
    // Load questions for each page
    const questions = await db
      .select()
      .from(question)
      .where(eq(question.pageId, page.id));
    const questionObjects: QuestionRead[] = questions.map((q) => ({
      id: q.id,
      text: q.text,
      type: q.type as QuestionRead['type'],
      options: q.options as any,
      correctAnswers: q.correctAnswers as any,
      explanation: q.explanation ?? undefined,
    }));
    pageObjects.push({ id: page.id, name: page.name, questions: questionObjects });
  }
  return {
    id: qcmRow.id,
    title: qcmRow.title,
    description: qcmRow.description ?? undefined,
    iconClass: qcmRow.iconClass ?? undefined,
    status: qcmRow.status as any,
    difficultyLevel: qcmRow.difficultyLevel ?? undefined,
    passingThreshold: qcmRow.passingThreshold ?? undefined,
    createdAt:
      qcmRow.createdAt instanceof Date
        ? qcmRow.createdAt.toISOString()
        : (qcmRow.createdAt as any),
    lastScore: qcmRow.lastScore ?? undefined,
    lastTime: qcmRow.lastTime ?? undefined,
    isFavorite: qcmRow.isFavorite ?? undefined,
    pages: pageObjects,
  };
}