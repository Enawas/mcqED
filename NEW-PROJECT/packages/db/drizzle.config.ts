import type { Config } from 'drizzle-kit';

/**
 * Drizzle configuration for the MCQ project's database package. This
 * configuration points the CLI to the TypeScript schema directory and
 * instructs it to emit migrations into the `src/migrations` folder. The
 * database connection string is read from the `DATABASE_URL` environment
 * variable when running migrations or generating schema.
 */
export default {
  schema: './src/schema',
  out: './src/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? '',
  },
} as Config;