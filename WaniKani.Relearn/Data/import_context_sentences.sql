-- Imports every context-sentences-*.json file in the directory supplied to psql.
-- Usage:
--   psql "$DATABASE_URL" -v static_dir='C:/code/WaniKani.Relearn/WaniKani.Relearn/static' \
--     -f Data/import_context_sentences.sql
--
-- The PostgreSQL server must be able to read static_dir, and the executing role
-- needs permission to call pg_ls_dir and pg_read_file.

\if :{?static_dir}
\else
\echo 'Pass the static directory with -v static_dir=...'
\quit
\endif

BEGIN;

ALTER TABLE sentence_morphemes
    ADD COLUMN IF NOT EXISTS combined_form VARCHAR(255) NULL;

CREATE TEMP TABLE context_sentence_import_files AS
SELECT :'static_dir' || '/' || file_name AS file_path
FROM pg_ls_dir(:'static_dir') AS file_name
WHERE file_name ~ '^context-sentences-[0-9]+\.json$';

DO $$
DECLARE
    import_file RECORD;
    sentence_data JSONB;
    reference_data JSONB;
    morpheme_data JSONB;
    sentence_id BIGINT;
    sequence_order INT;
BEGIN
    FOR import_file IN
        SELECT file_path
        FROM context_sentence_import_files
        ORDER BY file_path
    LOOP
        FOR sentence_data IN
            SELECT value
            FROM jsonb_array_elements(pg_read_file(import_file.file_path)::JSONB)
        LOOP
            INSERT INTO context_sentences (ja, en, level)
            VALUES (
                sentence_data ->> 'Ja',
                sentence_data ->> 'En',
                (sentence_data ->> 'Level')::INT
            )
            RETURNING id INTO sentence_id;

            FOR reference_data IN
                SELECT value
                FROM jsonb_array_elements(COALESCE(sentence_data -> 'SourceVocabulary', '[]'::JSONB))
            LOOP
                INSERT INTO sentence_subject_references (sentence_id, subject_id, reference_type)
                VALUES (
                    sentence_id,
                    (reference_data ->> 'SubjectId')::INT,
                    'source_vocabulary'
                );
            END LOOP;

            FOR reference_data IN
                SELECT value
                FROM jsonb_array_elements(COALESCE(sentence_data -> 'KanjiInSentence', '[]'::JSONB))
            LOOP
                INSERT INTO sentence_subject_references (sentence_id, subject_id, reference_type)
                VALUES (
                    sentence_id,
                    (reference_data ->> 'SubjectId')::INT,
                    'kanji_in_sentence'
                );
            END LOOP;

            sequence_order := 0;
            FOR morpheme_data IN
                SELECT value
                FROM jsonb_array_elements(COALESCE(sentence_data -> 'Morphemes', '[]'::JSONB))
            LOOP
                INSERT INTO sentence_morphemes (
                    sentence_id,
                    sequence_order,
                    subject_id,
                    combined_form,
                    surface,
                    lemma,
                    lemma_reading,
                    orth,
                    pron,
                    conjugation_type,
                    conjugation_form,
                    pos1_ja,
                    pos1_en,
                    pos2_ja,
                    pos2_en,
                    pos3_ja,
                    pos3_en,
                    pos4_ja,
                    pos4_en
                )
                VALUES (
                    sentence_id,
                    sequence_order,
                    (morpheme_data ->> 'SubjectId')::INT,
                    morpheme_data ->> 'CombinedForm',
                    morpheme_data ->> 'surface',
                    morpheme_data ->> 'lemma',
                    morpheme_data ->> 'lemma_reading',
                    morpheme_data ->> 'orth',
                    morpheme_data ->> 'pron',
                    morpheme_data ->> 'conjugation_type',
                    morpheme_data ->> 'conjugation_form',
                    morpheme_data #>> '{Pos1,Ja}',
                    morpheme_data #>> '{Pos1,En}',
                    morpheme_data #>> '{Pos2,Ja}',
                    morpheme_data #>> '{Pos2,En}',
                    morpheme_data #>> '{Pos3,Ja}',
                    morpheme_data #>> '{Pos3,En}',
                    morpheme_data #>> '{Pos4,Ja}',
                    morpheme_data #>> '{Pos4,En}'
                );

                sequence_order := sequence_order + 1;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

COMMIT;