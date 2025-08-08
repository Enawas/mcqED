-- Migration: Create tables for QCM pages and questions
-- Purpose: Define relational structures for pages and questions linked to
-- existing qcm table. This migration adds two new tables: qcm_page and
-- question. Options and correct answers for questions are stored as JSONB
-- arrays to simplify the schema. On deletion of a parent QCM or page,
-- related pages and questions cascade accordingly.

CREATE TABLE IF NOT EXISTS "qcm_page" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "qcm_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT fk_qcm_page_qcm FOREIGN KEY ("qcm_id") REFERENCES "qcm" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "question" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "qcm_id" UUID,
    "page_id" UUID,
    "text" TEXT NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "options" JSONB NOT NULL,
    "correct_answers" JSONB NOT NULL,
    "explanation" TEXT,
    CONSTRAINT fk_question_qcm FOREIGN KEY ("qcm_id") REFERENCES "qcm" ("id") ON DELETE CASCADE,
    CONSTRAINT fk_question_page FOREIGN KEY ("page_id") REFERENCES "qcm_page" ("id") ON DELETE CASCADE
);