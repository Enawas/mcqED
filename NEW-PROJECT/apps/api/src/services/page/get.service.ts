/**
 * Purpose: Service for retrieving a single page and its questions from
 * the database. Returns undefined if the page does not exist.
 * Inputs: Page identifier (UUID string).
 * Outputs: A promise resolving to a QcmPageRead object or undefined.
 * Events: None (read-only operation).
 * Errors: Propagates database errors to the caller.
 */

import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { qcmPage } from '@packages/db/src/schema/page';
import { question } from '@packages/db/src/schema/question';
import { QcmPageRead } from '@packages/schemas/src/qcm';
import { QuestionRead } from '@packages/schemas/src/question';

export async function getPage(id: string): Promise<QcmPageRead | undefined> {
  // Fetch the page row
  const pages = await db.select().from(qcmPage).where(eq(qcmPage.id, id));
  const page = pages[0];
  if (!page) return undefined;
  // Fetch questions belonging to this page
  // Fetch questions belonging to this page and sort by position ascending
  const qs = await db
    .select()
    .from(question)
    .where(eq(question.pageId, id))
    .orderBy(question.position);
  const questionObjects: QuestionRead[] = qs.map((q) => ({
    id: q.id,
    text: q.text,
    type: q.type as QuestionRead['type'],
    options: q.options as any,
    correctAnswers: q.correctAnswers as any,
    explanation: q.explanation ?? undefined,
    position: q.position,
  }));
  return {
    id: page.id,
    name: page.name,
    questions: questionObjects,
  };
}