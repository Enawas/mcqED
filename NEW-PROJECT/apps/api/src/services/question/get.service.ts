/**
 * Purpose: Service for retrieving a single question along with its
 * metadata from the database. Returns undefined if no question is
 * found. This function isolates database access from the rest of
 * the application logic.
 * Inputs: Question identifier as a UUID string.
 * Outputs: A promise resolving to a QuestionRead object or undefined.
 * Events: None (read-only operation).
 * Errors: Propagates database errors to the caller.
 */

import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { question } from '@packages/db/src/schema/question';
import { QuestionRead } from '@packages/schemas/src/question';

export async function getQuestion(id: string): Promise<QuestionRead | undefined> {
  // Retrieve the question row matching the provided ID
  const rows = await db.select().from(question).where(eq(question.id, id));
  const row = rows[0];
  if (!row) return undefined;
  // Map the database row to the QuestionRead shape
  return {
    id: row.id,
    text: row.text,
    type: row.type as QuestionRead['type'],
    options: row.options as any,
    correctAnswers: row.correctAnswers as any,
    explanation: row.explanation ?? undefined,
  };
}