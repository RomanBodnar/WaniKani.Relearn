-- =============================================================================
-- Bonpom - Complete PostgreSQL Database Schema
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. AUTHENTICATION & USERS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_credentials (
    user_id VARCHAR(36) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    password_last_changed TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- -----------------------------------------------------------------------------
-- 2. SUBJECTS CORE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS subjects (
    id INT PRIMARY KEY, -- WaniKani Subject ID
    object_type VARCHAR(32) NOT NULL, -- 'radical', 'kanji', 'vocabulary'
    slug VARCHAR(255) NOT NULL,
    characters VARCHAR(255) NULL,
    meaning_mnemonic TEXT NOT NULL,
    wanikani_api_url TEXT NULL,
    wanikani_document_url TEXT NOT NULL,
    level INT NOT NULL,
    spaced_repetition_system_id INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    hidden_at TIMESTAMP WITH TIME ZONE NULL,
    data_updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subjects_object_type ON subjects(object_type);
CREATE INDEX IF NOT EXISTS idx_subjects_level ON subjects(level);
CREATE INDEX IF NOT EXISTS idx_subjects_slug ON subjects(slug);

-- Subject Meanings
CREATE TABLE IF NOT EXISTS subject_meanings (
    id BIGSERIAL PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    meaning VARCHAR(255) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    accepted_answer BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_subject_meanings_subject ON subject_meanings(subject_id);

-- Auxiliary Meanings (whitelist / blacklist)
CREATE TABLE IF NOT EXISTS subject_auxiliary_meanings (
    id BIGSERIAL PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    meaning VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL -- 'whitelist', 'blacklist'
);

CREATE INDEX IF NOT EXISTS idx_subject_aux_meanings_subject ON subject_auxiliary_meanings(subject_id);

-- -----------------------------------------------------------------------------
-- 3. KANJI DETAILS & READINGS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS kanji_details (
    subject_id INT PRIMARY KEY REFERENCES subjects(id) ON DELETE CASCADE,
    meaning_hint TEXT NULL,
    reading_hint TEXT NULL,
    reading_mnemonic TEXT NOT NULL,
    jlpt_level VARCHAR(10) NULL,
    joyo_grade VARCHAR(10) NULL
);

CREATE TABLE IF NOT EXISTS kanji_readings (
    id BIGSERIAL PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    reading VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL, -- 'onyomi', 'kunyomi', 'nanori'
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    accepted_answer BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_kanji_readings_subject ON kanji_readings(subject_id);

-- -----------------------------------------------------------------------------
-- 4. VOCABULARY DETAILS, READINGS, AUDIO & POS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS vocabulary_details (
    subject_id INT PRIMARY KEY REFERENCES subjects(id) ON DELETE CASCADE,
    reading_mnemonic TEXT NULL
);

CREATE TABLE IF NOT EXISTS vocabulary_readings (
    id BIGSERIAL PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    reading VARCHAR(255) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    accepted_answer BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_vocab_readings_subject ON vocabulary_readings(subject_id);

CREATE TABLE IF NOT EXISTS vocabulary_parts_of_speech (
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    part_of_speech VARCHAR(100) NOT NULL,
    PRIMARY KEY (subject_id, part_of_speech)
);

CREATE TABLE IF NOT EXISTS vocabulary_pronunciation_audios (
    id BIGSERIAL PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    source_id INT NOT NULL,
    pronunciation VARCHAR(255) NOT NULL,
    voice_actor_id VARCHAR(100) NULL,
    voice_actor_name VARCHAR(255) NULL,
    voice_description TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_vocab_audio_subject ON vocabulary_pronunciation_audios(subject_id);

-- -----------------------------------------------------------------------------
-- 5. RADICAL CHARACTER IMAGES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS radical_character_images (
    id BIGSERIAL PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    metadata_json JSONB NULL
);

CREATE INDEX IF NOT EXISTS idx_radical_images_subject ON radical_character_images(subject_id);

-- -----------------------------------------------------------------------------
-- 6. SUBJECT RELATIONSHIPS (Amalgamations, Components, Visually Similar)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS subject_relationships (
    parent_subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    child_subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    relationship_type VARCHAR(32) NOT NULL, -- 'amalgamation', 'component', 'visually_similar'
    PRIMARY KEY (parent_subject_id, child_subject_id, relationship_type)
);

CREATE INDEX IF NOT EXISTS idx_subject_rel_parent ON subject_relationships(parent_subject_id);
CREATE INDEX IF NOT EXISTS idx_subject_rel_child ON subject_relationships(child_subject_id);

-- -----------------------------------------------------------------------------
-- 7. CONTEXT SENTENCES & MORPHEMES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS context_sentences (
    id BIGSERIAL PRIMARY KEY,
    subject_id INT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    ja TEXT NOT NULL,
    en TEXT NOT NULL,
    level INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_sentences_subject ON context_sentences(subject_id);
CREATE INDEX IF NOT EXISTS idx_sentences_level ON context_sentences(level);

CREATE TABLE IF NOT EXISTS sentence_subject_references (
    sentence_id BIGINT NOT NULL REFERENCES context_sentences(id) ON DELETE CASCADE,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    reference_type VARCHAR(32) NOT NULL, -- 'source_vocabulary', 'kanji_in_sentence'
    PRIMARY KEY (sentence_id, subject_id, reference_type)
);

CREATE TABLE IF NOT EXISTS sentence_morphemes (
    id BIGSERIAL PRIMARY KEY,
    sentence_id BIGINT NOT NULL REFERENCES context_sentences(id) ON DELETE CASCADE,
    sequence_order INT NOT NULL,
    subject_id INT NULL REFERENCES subjects(id) ON DELETE SET NULL,
    combined_form VARCHAR(255) NULL,
    surface VARCHAR(255) NOT NULL,
    lemma VARCHAR(255) NULL,
    lemma_reading VARCHAR(255) NULL,
    orth VARCHAR(255) NULL,
    pron VARCHAR(255) NULL,
    conjugation_type VARCHAR(100) NULL,
    conjugation_form VARCHAR(100) NULL,
    pos1_ja VARCHAR(100) NULL,
    pos1_en VARCHAR(100) NULL,
    pos2_ja VARCHAR(100) NULL,
    pos2_en VARCHAR(100) NULL,
    pos3_ja VARCHAR(100) NULL,
    pos3_en VARCHAR(100) NULL,
    pos4_ja VARCHAR(100) NULL,
    pos4_en VARCHAR(100) NULL
);

CREATE INDEX IF NOT EXISTS idx_morphemes_sentence ON sentence_morphemes(sentence_id, sequence_order);
CREATE INDEX IF NOT EXISTS idx_morphemes_subject ON sentence_morphemes(subject_id);

-- -----------------------------------------------------------------------------
-- 8. USER FEATURES: MY BOX, PRACTICED SENTENCES & TRANSLATION HISTORY
-- -----------------------------------------------------------------------------

-- Feature 1: My Box (Bookmarked Subjects)
CREATE TABLE IF NOT EXISTS user_my_box (
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id INT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    bookmarked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT NULL,
    PRIMARY KEY (user_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_my_box_user ON user_my_box(user_id, bookmarked_at DESC);

-- Feature 2: Mark Sentences as Practiced (for filtering)
CREATE TABLE IF NOT EXISTS user_practiced_sentences (
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sentence_id BIGINT NOT NULL REFERENCES context_sentences(id) ON DELETE CASCADE,
    marked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    practice_count INT NOT NULL DEFAULT 1,
    last_practiced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, sentence_id)
);

CREATE INDEX IF NOT EXISTS idx_practiced_sentences_user ON user_practiced_sentences(user_id);

-- Feature 3: Attempted Translations History
CREATE TABLE IF NOT EXISTS user_translation_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sentence_id BIGINT NOT NULL REFERENCES context_sentences(id) ON DELETE CASCADE,
    user_translation TEXT NOT NULL,
    reference_translation TEXT NULL,
    is_correct BOOLEAN NULL,
    similarity_score NUMERIC(5,2) NULL,
    feedback TEXT NULL,
    attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_translation_attempts_user_sent ON user_translation_attempts(user_id, sentence_id, attempted_at DESC);
CREATE INDEX IF NOT EXISTS idx_translation_attempts_user_time ON user_translation_attempts(user_id, attempted_at DESC);

-- -----------------------------------------------------------------------------
-- 9. USEFUL HELPER VIEWS
-- -----------------------------------------------------------------------------

CREATE OR REPLACE VIEW view_unpracticed_sentences AS
SELECT 
    cs.id AS sentence_id,
    cs.subject_id,
    cs.ja,
    cs.en,
    cs.level,
    u.id AS user_id
FROM context_sentences cs
CROSS JOIN users u
LEFT JOIN user_practiced_sentences ups 
    ON cs.id = ups.sentence_id AND u.id = ups.user_id
WHERE ups.sentence_id IS NULL;
