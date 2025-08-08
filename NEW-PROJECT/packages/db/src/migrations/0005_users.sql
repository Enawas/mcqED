-- Migration 0005: Create users table
-- Purpose: Introduce a users table to store application accounts. This table
-- includes fields for email, hashed password, role and creation timestamp.
-- The UUID primary key uses pgcrypto's gen_random_uuid() function. Ensure
-- pgcrypto is enabled before creating the table.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "users" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
