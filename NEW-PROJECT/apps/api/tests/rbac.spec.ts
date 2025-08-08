/**
 * Purpose: API tests covering RBAC (Role‑Based Access Control) for
 * import/export and audit endpoints. These tests ensure that only
 * users with the roles "admin" or "editor" can perform sensitive
 * operations. Viewers should receive a 403 Forbidden response.
 *
 * Note: This is a skeleton test file using Vitest and Supertest. You
 * must implement the setup (creating users, obtaining JWT tokens) and
 * assertions for your environment. See the README for instructions.
 */

import { describe, it } from 'vitest';

// TODO: import your server and request library, e.g.:
// import { buildServer } from '../../src/server';
// import request from 'supertest';

describe('RBAC API endpoints', () => {
  it('should forbid import when role is viewer', async () => {
    // TODO: use request() to call POST /qcm/import with a viewer token
    // Expect HTTP 403
  });

  it('should allow import when role is editor', async () => {
    // TODO: call POST /qcm/import with an editor token
    // Expect HTTP 201
  });

  it('should forbid export when role is viewer', async () => {
    // TODO: call GET /qcm/:id/export with a viewer token
    // Expect HTTP 403
  });

  it('should allow export when role is admin', async () => {
    // TODO: call GET /qcm/:id/export with an admin token
    // Expect HTTP 200 and proper content type
  });

  it('should forbid access to audit logs for viewer', async () => {
    // TODO: call GET /audit with a viewer token
    // Expect HTTP 403
  });

  it('should allow access to audit logs for editor', async () => {
    // TODO: call GET /audit with an editor token
    // Expect HTTP 200 and list of events
  });
});