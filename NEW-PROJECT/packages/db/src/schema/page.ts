/**
 * Purpose: Define the database schema for QCM pages using Drizzle ORM.
 * Each page belongs to a specific QCM and has an order within that quiz.
 * Inputs: None (schema definitions only).
 * Outputs: Table definition for qcm_page exported for migrations and queries.
 * Events: None.
 * Errors: None.
 */

import {
  pgTable,
  uuid,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';
import { qcm } from './qcm';

/**
 * Table definition for QCM pages. Each page is associated with a QCM via the
 * `qcmId` foreign key. The `position` column stores the order of the page
 * within a QCM; this may be used when rendering pages in sequence.
 */
export const qcmPage = pgTable('qcm_page', {
  id: uuid('id').defaultRandom().primaryKey(),
  qcmId: uuid('qcm_id')
    .notNull()
    .references(() => qcm.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  position: integer('position').notNull(),
});

export type QcmPageModel = typeof qcmPage;