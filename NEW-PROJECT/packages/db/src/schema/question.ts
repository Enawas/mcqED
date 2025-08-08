/**
 * Purpose: Define the database schema for questions in a QCM. Each question
 * belongs to a page and optionally references the parent QCM directly.
 * Questions store their options and correct answers as JSONB arrays to
 * accommodate arbitrary numbers of choices without a join table. The
 * explanation column holds optional explanatory text shown after answering.
 * Inputs: None (schema definitions only).
 * Outputs: Table definition for question exported for migrations and queries.
 * Events: None.
 * Errors: None.
 */

import {
  pgTable,
  uuid,
  text,
  varchar,
  jsonb,
} from 'drizzle-orm/pg-core';
import { qcm } from './qcm';
import { qcmPage } from './page';

/**
 * Table definition for questions. Options and correct answers are stored as
 * JSONB arrays. The structure for `options` follows the shape
 * `{ id: string; text: string }[]`, while `correctAnswers` is an array of
 * option IDs that are correct. Both arrays are required, matching the
 * validation rules in the Zod schemas.
 */
export const question = pgTable('question', {
  id: uuid('id').defaultRandom().primaryKey(),
  qcmId: uuid('qcm_id')
    .references(() => qcm.id, { onDelete: 'cascade' }),
  pageId: uuid('page_id')
    .references(() => qcmPage.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  options: jsonb('options').$type<{ id: string; text: string }[]>().notNull(),
  correctAnswers: jsonb('correct_answers').$type<string[]>().notNull(),
  explanation: text('explanation'),
});

export type QuestionModel = typeof question;