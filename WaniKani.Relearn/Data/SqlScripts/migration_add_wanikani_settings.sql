-- =============================================================================
-- Migration: Create user_wanikani_settings table
-- =============================================================================

-- 1. Create user_wanikani_settings table
CREATE TABLE IF NOT EXISTS user_wanikani_settings (
    user_id VARCHAR(36) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    encrypted_wanikani_token TEXT NULL,
    max_allowed_level INT NULL,
    max_allowed_level_last_checked_at TIMESTAMP WITH TIME ZONE NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Drop hidden_at column from context_sentences table if it exists
ALTER TABLE context_sentences
    ALTER COLUMN hidden_at DROP NOT NULL;

ALTER TABLE user_wanikani_settings
    ADD COLUMN IF NOT EXISTS max_allowed_level_valid_until TIMESTAMP WITH TIME ZONE NULL;