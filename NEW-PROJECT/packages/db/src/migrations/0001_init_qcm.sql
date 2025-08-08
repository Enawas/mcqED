-- Migration: initial QCM table
-- Purpose: Create the qcm table to store questionnaire definitions.
-- This table mirrors the structure defined in Drizzle ORM schema
-- (packages/db/src/schema/qcm.ts) and corresponds to the QcmMeta and
-- related fields in packages/schemas.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS qcm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon_class VARCHAR(255),
  status VARCHAR(20) NOT NULL,
  difficulty_level VARCHAR(20),
  passing_threshold INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_score INTEGER,
  last_time INTEGER,
  is_favorite BOOLEAN DEFAULT FALSE
);