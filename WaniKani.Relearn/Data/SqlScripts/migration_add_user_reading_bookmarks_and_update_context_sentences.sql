-- =============================================================================
-- Migration: Add hidden_at and updated_at to context_sentences table
--            Create user_reading_bookmarks table
-- =============================================================================

-- 1. Update context_sentences table
ALTER TABLE context_sentences
    
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 2. Create user_reading_bookmarks table
CREATE TABLE IF NOT EXISTS user_reading_bookmarks (
    user_id VARCHAR(36) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    page INT NOT NULL,
    sentence_index INT NOT NULL,
    min_level INT NULL,
    max_level INT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
