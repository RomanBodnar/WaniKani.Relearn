-- =============================================================================
-- Migration: Add combined_form to sentence morphemes
-- Table: sentence_morphemes
-- =============================================================================

ALTER TABLE sentence_morphemes
    ADD COLUMN IF NOT EXISTS combined_form VARCHAR(255) NULL;