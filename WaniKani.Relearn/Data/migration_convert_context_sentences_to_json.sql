-- Migration: Convert context_sentences to store sentence details as JSON (jsonb)
-- 
-- IMPORTANT FOR COCKROACHDB:
-- CockroachDB parses all statements in a single file batch before executing them.
-- Therefore, ALTER TABLE and UPDATE referencing the new column MUST be executed
-- in separate steps/queries.
--
-- Please execute:
-- 1. migration_step1_add_column.sql
-- 2. migration_step2_convert_data.sql

ALTER TABLE context_sentences
    ADD COLUMN IF NOT EXISTS data_json JSONB NULL;
