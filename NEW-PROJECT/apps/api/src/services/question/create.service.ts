/**
 * Purpose: Service to create a new question within a given page. Validates
 * that the parent page exists, generates a new UUID, inserts the new
 * question into the database and returns the created QuestionRead
 * object. This function does not handle updating the order of questions
 * within the page; ordering will follow insertion order.
 *
 * Inputs: Page identifier (UUID string) and a QuestionCreateInput
 * Outputs: Promise resolving to a QuestionRead object representing the
 * newly created question.
 * Events: None (audit logging can be added later).
 * Errors: Throws PAGE_NOT_FOUND if the parent page does not exist.
 */

import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { qcmPage } from '@packages/db/src/schema/page';
import { question as questionTable } from '@packages/db/src/schema/question';
import {
  QuestionCreateInput,
  QuestionRead,
} from '@packages/schemas/src/question';

/**
 * Creates a new question for a given page. Ensures the page exists,
 * generates a new UUID for the question, inserts it, and returns the
 * question in read format.
 */
export async function createQuestion(
  pageId: string,
  input: QuestionCreateInput,
): Promise<QuestionRead> {
  // Verify that the parent page exists
  const pages = await db.select().from(qcmPage).where(eq(qcmPage.id, pageId));
  if (pages.length === 0) {
    throw new Error('PAGE_NOT_FOUND');
  }
  const pageRow = pages[0];
  // Determine next position for question within the page
  const existingQuestions = await db
    .select()
    .from(questionTable)
    .where(eq(questionTable.pageId, pageId));
  const maxPos = existingQuestions.reduce(
    (max, q) => (typeof q.position === 'number' && q.position > max ? q.position : max),
    0,
  );
  const newPosition = maxPos + 1;
  const id = randomUUID();
  await db.insert(questionTable).values({
    id,
    pageId,
    qcmId: pageRow.qcmId,
    text: input.text,
    type: input.type,
    options: input.options,
    correctAnswers: input.correctAnswers,
    explanation: input.explanation,
    position: newPosition,
  });
  return {
    id,
    text: input.text,
    type: input.type,
    options: input.options,
    correctAnswers: input.correctAnswers,
    explanation: input.explanation,
    position: newPosition,
  };
}