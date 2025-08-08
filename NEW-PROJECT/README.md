# MCQED Monorepo – Setup Guide

This document describes how to install and run the MCQED application on a
Debian‑based Linux environment. The project is organised as a monorepo
with separate `web`, `api`, `worker`, `schemas` and `db` packages. It
relies on PostgreSQL for persistence, Redis for queues and Minio/S3 for
object storage. The instructions below focus on local development. For
production deployments you should adapt the service definitions and
configure secure credentials.

## Prerequisites

Before you begin, make sure the following software is installed:

* **Node.js** 18 or higher. Use your package manager (`apt`) or a
  version manager such as `nvm`.
* **pnpm** package manager. Install globally with:
  ```bash
  npm install -g pnpm
  ```
* **Docker** and **docker‑compose** (optional but recommended). These
  provide easy setup for PostgreSQL, Redis and Minio. If you prefer
  running PostgreSQL natively, ensure it is listening on port 5432.
* **git** for cloning the repository.

## Clone the repository

Clone the project and change into the working directory:

```bash
git clone https://github.com/Enawas/mcqED.git
cd mcqED/NEW-PROJECT
```

## Install dependencies

Install all Node.js dependencies for the monorepo:

```bash
pnpm install
```

This will install dependencies across packages using the workspace
configuration in `pnpm-workspace.yaml`.

## Configure environment variables

Create a `.env` file at the root of `NEW-PROJECT` based on the
provided `.env.example` and adjust the values to your environment:

```bash
cp .env.example .env
# Edit .env to set PGHOST, PGDATABASE, PGUSER, PGPASSWORD, etc.
```

At minimum you must set the PostgreSQL connection variables. If you
use the docker compose services described below, the default values in
`.env.example` will work out of the box.

## Start services with Docker (optional)

The `infra/docker-compose.yml` file defines services for PostgreSQL,
Redis, Minio and Nginx. To start the database and other dependencies,
run:

```bash
cd infra
docker-compose up -d postgres redis minio
cd ..
```

This will launch:

* **PostgreSQL** on port 5432
* **Redis** on port 6379
* **Minio** on ports 9000/9001

If you prefer to run PostgreSQL locally, create a database matching
`PGDATABASE` in your `.env` file and ensure the user has privileges to
create tables.

## Run database migrations

Once the database is running and environment variables are configured,
run the SQL migrations to create the necessary tables:

```bash
pnpm --filter @packages/db run migrate:up
```

This uses `drizzle-kit` and the migration scripts in
`packages/db/src/migrations` to apply the schema. If you need to
rollback the last migration, use `migrate:down`.

## Launch the application in development

To start the web client, API server and worker concurrently, run the
monorepo `dev` script from the root of `NEW-PROJECT`:

```bash
pnpm run dev
```

This command runs Vite for the front end, Fastify for the API and
BullMQ for background workers in parallel. The web UI will be served
at `http://localhost:3000` and the API will listen on the port
specified by the `PORT` variable (default 3001). Adjust ports as
needed in your `.env`.

## Building for production

To build all packages and applications, execute:

```bash
pnpm run build
```

This will compile the TypeScript sources, emit browser bundles and
place compiled output into each package’s `dist/` directory. You can
then use the `infra/docker-compose.yml` to run the built artifacts
inside containers by starting the `api`, `web` and `worker` services:

```bash
cd infra
docker-compose up -d api web worker nginx
```

The Nginx service proxies traffic to the web and API containers on
port 8080.

## Running tests

To execute unit and end‑to‑end tests defined in the monorepo, run:

```bash
pnpm test
```

Individual package test scripts can be invoked via the `--filter`
flag, for example:

```bash
pnpm --filter @apps/api run test
pnpm --filter @apps/web run test
```

## Additional notes

* This project uses an extreme modular architecture. Each feature lives
  in its own directory under `apps/web/src/features` for the front
  end and `apps/api/src/plugins` for the back end. Follow the
  AI_GUIDE when contributing new features.
* ### Roles and permissions (RBAC)

  The application implements Role‑Based Access Control to restrict
  certain operations to authorised users. Three roles are recognised:

  * **admin** – full access to all features. Admins can create,
    import, export and delete QCMs, pages and questions; view audit
    logs; and manage users.  
  * **editor** – can create and modify QCMs, pages and questions,
    import and export data, and view audit logs. Editors cannot
    manage other users.  
  * **viewer** – read‑only access. Viewers can list and play QCMs but
    cannot create, edit, import, export or view audit logs. Editing
    functions (add/delete/reorder pages or questions, rename pages,
    update QCM metadata) are hidden in the UI for viewers and
    rejected by the API.

  The role is encoded in the JWT access token issued at login. The
  front‑end decodes this token to determine which buttons and
  controls to display. The back‑end policies also validate the
  requester's role before performing any mutation. To assign roles to
  users, update the `role` column in the `users` table or seed the
  database accordingly.
* Environment variables control many aspects of the system, including
  CORS, JWT secrets and S3 credentials. See `.env.example` for the
  full list and adjust as needed.
* The `docs/AI_GUIDE.md` provides instructions for AI‑assisted
  development and should be consulted when extending the codebase.

With these steps, you should be able to set up and run the MCQED
application on a Debian system. If you encounter issues, ensure all
dependencies are installed and environment variables are correctly
configured.