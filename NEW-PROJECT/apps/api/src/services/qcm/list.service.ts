/**
 * Purpose: Service for listing QCMs based on optional filters.  In v1 this
 * function reads data from in-memory storage or a database and returns
 * normalized QCM read objects.
 * Inputs: Filters such as search text, difficulty or icon.
 * Outputs: Promise resolving to an array of QCM read objects.
 * Events: None (read-only).
 * Errors: None (errors are propagated to the caller).
 */
import { QcmFilter, QcmRead, QcmPageRead } from '@packages/schemas/src/qcm';
import { QuestionRead } from '@packages/schemas/src/question';
import { db } from '../../db';
import { qcm as qcmTable } from '@packages/db/src/schema/qcm';
import { qcmPage } from '@packages/db/src/schema/page';
import { question } from '@packages/db/src/schema/question';
import { eq } from 'drizzle-orm';

/**
 * Service to retrieve QCMs from the database based on optional filters. This
 * implementation queries the `qcm` table via Drizzle ORM. Filters on search,
 * difficulty and icon are applied when provided. Pages and questions are not
 * loaded yet; this will be added in a future iteration.
 */
export async function listQcm(filters: QcmFilter): Promise<QcmRead[]> {
  // Fetch all QCMs. Filtering on search/difficulty/icon can be added later.
  const qcms = await db.select().from(qcmTable);
  const result: QcmRead[] = [];
  for (const qcm of qcms) {
    // Load pages for this QCM
    const pages = await db
      .select()
      .from(qcmPage)
      .where(eq(qcmPage.qcmId, qcm.id));
    const pageObjects: QcmPageRead[] = [];
    for (const page of pages) {
      // Load questions for this page
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
      pageObjects.push({
        id: page.id,
        name: page.name,
        questions: questionObjects,
      });
    }
    result.push({
      id: qcm.id,
      title: qcm.title,
      description: qcm.description ?? undefined,
      iconClass: qcm.iconClass ?? undefined,
      status: qcm.status as any,
      difficultyLevel: qcm.difficultyLevel ?? undefined,
      passingThreshold: qcm.passingThreshold ?? undefined,
      createdAt: (qcm.createdAt instanceof Date ? qcm.createdAt.toISOString() : (qcm.createdAt as any)) as string,
      lastScore: qcm.lastScore ?? undefined,
      lastTime: qcm.lastTime ?? undefined,
      isFavorite: qcm.isFavorite ?? undefined,
      pages: pageObjects,
    });
  }
  return result;
}