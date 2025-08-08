-- Migration: Add position column to question table
ALTER TABLE question ADD COLUMN position INTEGER;

-- Assign default position value to existing questions. We set the
-- position to 1 for all existing records. In future migrations, we
-- might calculate row numbers within each page, but for now this
-- simple default suffices.
UPDATE question SET position = 1;

-- Ensure the position column is not null going forward
ALTER TABLE question ALTER COLUMN position SET NOT NULL;