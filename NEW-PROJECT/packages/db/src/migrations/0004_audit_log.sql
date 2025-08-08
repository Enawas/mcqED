-- Migration: Create audit_log table
-- Purpose: Define the relational structure for audit logs. Each entry records
-- a mutative event in the system along with optional before and after
-- snapshots for later analysis or compliance.

CREATE TABLE IF NOT EXISTS "audit_log" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "event" VARCHAR(50) NOT NULL,
    "entity" VARCHAR(50) NOT NULL,
    "entity_id" UUID,
    "user_id" UUID,
    "before" JSONB,
    "after" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes to speed up filtering by entity and entity_id
CREATE INDEX IF NOT EXISTS idx_audit_log_entity_id ON "audit_log" ("entity_id");
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON "audit_log" ("entity");