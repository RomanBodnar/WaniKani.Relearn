-- =============================================================================
-- Migration: Make voice_actor_id and voice_actor_name nullable
-- Table: vocabulary_pronunciation_audios
-- =============================================================================

ALTER TABLE vocabulary_pronunciation_audios
    ALTER COLUMN voice_actor_id DROP NOT NULL,
    ALTER COLUMN voice_actor_name DROP NOT NULL;
