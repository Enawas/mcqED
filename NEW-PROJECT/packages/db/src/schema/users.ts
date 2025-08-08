/**
 * Purpose: Define the database schema for application users using Drizzle ORM.
 * Inputs: None (schema definitions only).
 * Outputs: Table definitions exported for use in migrations and queries.
 * Events: None.
 * Errors: None.
 */

import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

/**
 * Table definition for application users. Each user has a unique UUID primary key,
 * an email address (unique and required), a hashed password, a role indicating
 * their authorization level, and a creation timestamp. Roles might include
 * values such as 'guest', 'editor', or 'admin'.
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type UserModel = typeof users;