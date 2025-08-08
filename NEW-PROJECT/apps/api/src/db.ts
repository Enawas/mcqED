/**
 * Purpose: Centralized database connection using Drizzle ORM. Creates a
 * PostgreSQL connection pool via `pg` and wraps it with Drizzle to provide
 * type-safe query building. The schema imported here ensures tables are
 * registered with Drizzle for inference.  Environment variables for
 * connection parameters should be defined in `.env` (PGHOST, PGPORT,
 * PGDATABASE, PGUSER, PGPASSWORD).
 * Inputs: None directly; uses process.env for configuration.
 * Outputs: A Drizzle database client (`db`) for use in services.
 * Events: Connections and queries to the database.
 * Errors: Propagated from `pg` or Drizzle if misconfigured.
 */

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// Import schema definitions to register tables with Drizzle. Note: relative
// imports reference compiled code or source depending on tsconfig paths.
import { qcm } from '@packages/db/src/schema/qcm';
import { qcmPage } from '@packages/db/src/schema/page';
import { question } from '@packages/db/src/schema/question';

// Create a PostgreSQL connection pool using environment variables. Defaults
// fall back to typical localhost settings if variables are undefined.
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

// Export a Drizzle client bound to the schema. Additional tables should be
// added to this object when they are defined.
export const db = drizzle(pool, {
  schema: {
    qcm,
    qcmPage,
    question,
  },
});