/**
 * Purpose: Define the database schema for QCMs using Drizzle ORM.  This file
 * maps the TypeScript definitions to SQL table structures.
 * Inputs: None (schema definitions only).
 * Outputs: Table definitions exported for use in migrations and queries.
 * Events: None.
 * Errors: None.
 */
// Import Drizzle ORM functions specific to PostgreSQL. These utilities
// define column types and table helpers for building typed database
// schemas. When adding new tables or columns, consult the Drizzle
// documentation for appropriate types (e.g., uuid, varchar, integer,
// boolean, timestamp).
import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

/**
 * Purpose: Define the database schema for QCMs using Drizzle ORM.  This file
 * maps the TypeScript definitions to SQL table structures. Each column
 * corresponds to a property of the QCM entity defined in the Zod schemas.
 * Inputs: None (schema definitions only).
 * Outputs: Table definitions exported for use in migrations and queries.
 * Events: None.
 * Errors: None.
 */

// Table definition for QCMs. Fields correspond to the QcmMeta and core
// attributes defined in packages/schemas. `id` is a UUID primary key. Text
// fields have a reasonable maximum length; `description` uses a TEXT column
// to allow longer content. The `createdAt` column defaults to the current
// timestamp on insertion. Nullable columns align with optional fields in
// the Zod definitions.
export const qcm = pgTable('qcm', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  iconClass: varchar('icon_class', { length: 255 }),
  status: varchar('status', { length: 20 }).notNull(),
  difficultyLevel: varchar('difficulty_level', { length: 20 }),
  passingThreshold: integer('passing_threshold'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  lastScore: integer('last_score'),
  lastTime: integer('last_time'),
  isFavorite: boolean('is_favorite').default(false),
});

export type QcmModel = typeof qcm;