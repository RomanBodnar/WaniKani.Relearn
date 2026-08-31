-- Step 1 of Migration: Add data_json column
-- Run this file FIRST in CockroachDB / PostgreSQL.

ALTER TABLE context_sentences
    ADD COLUMN IF NOT EXISTS data_json JSONB NULL;
