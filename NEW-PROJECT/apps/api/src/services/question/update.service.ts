/**
 * Purpose: Service to update the properties of an existing question.
 * Accepts a partial QuestionUpdateInput (without the ID) and applies
 * any provided changes to the database. Returns the fully populated
 * QuestionRead object after the update.
 * Inputs: Question identifier (UUID) and QuestionUpdateInput containing
 * optional fields (text, type, options, correctAnswers, explanation).
 * Outputs: A promise resolving to a QuestionRead object representing
 * the updated question.
 * Events: None (audit logging to be added in later iterations).
 * Errors: Throws an error with message 'QUESTION_NOT_FOUND' if the
 * question does not exist.
 */

import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { question } from '@packages/db/src/schema/question';
import {
  QuestionUpdateInput,
  QuestionRead,
} from '@packages/schemas/src/question';
import { getQuestion } from './get.service';

export async function updateQuestion(
  id: string,
  input: Omit<QuestionUpdateInput, 'id'>,
): Promise<QuestionRead> {
  // Verify that the question exists
  const rows = await db.select().from(question).where(eq(question.id, id));
  if (rows.length === 0) {
    throw new Error('QUESTION_NOT_FOUND');
  }
  // Build the update object from provided fields
  const updateObject: Partial<typeof question.$inferInsert> = {};
  if (input.text !== undefined) updateObject.text = input.text;
  if (input.type !== undefined) updateObject.type = input.type as any;
  if (input.options !== undefined) updateObject.options = input.options as any;
  if (input.correctAnswers !== undefined)
    updateObject.correctAnswers = input.correctAnswers as any;
  if (input.explanation !== undefined) updateObject.explanation = input.explanation;
  // Apply the update if at least one field is provided
  if (Object.keys(updateObject).length > 0) {
    await db.update(question).set(updateObject).where(eq(question.id, id));
  }
  // Retrieve and return the updated record
  const updated = await getQuestion(id);
  if (!updated) {
    throw new Error('QUESTION_NOT_FOUND');
  }
  return updated;
}