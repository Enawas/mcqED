/**
 * Purpose: Service to delete an existing question. Ensures that the
 * question exists and removes it from the database. This will also
 * remove the question from any related QCM statistics in future
 * iterations (if implemented).
 *
 * Inputs: Question identifier (UUID string).
 * Outputs: Promise resolving to void upon successful deletion.
 * Events: None (audit logging can be added later).
 * Errors: Throws QUESTION_NOT_FOUND if the question does not exist.
 */

import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { question as questionTable } from '@packages/db/src/schema/question';

export async function deleteQuestion(id: string): Promise<void> {
  // Verify the question exists
  const existing = await db
    .select()
    .from(questionTable)
    .where(eq(questionTable.id, id));
  if (existing.length === 0) {
    throw new Error('QUESTION_NOT_FOUND');
  }
  // Delete the question
  await db.delete(questionTable).where(eq(questionTable.id, id));
}