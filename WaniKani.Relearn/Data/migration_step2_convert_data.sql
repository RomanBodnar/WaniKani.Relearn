-- Step 2 of Migration: Populate data_json and drop obsolete child tables.
-- Run this file SECOND after Step 1 has completed.

UPDATE context_sentences cs
SET data_json = jsonb_build_object(
    'Ja', cs.ja,
    'En', cs.en,
    'Level', cs.level,
    'SourceVocabulary', COALESCE((
        SELECT jsonb_agg(
            jsonb_build_object(
                'SubjectId', ssr.subject_id,
                'Characters', COALESCE(s.characters, '')
            )
        )
        FROM sentence_subject_references ssr
        LEFT JOIN subjects s ON s.id = ssr.subject_id
        WHERE ssr.sentence_id = cs.id AND ssr.reference_type = 'source_vocabulary'
    ), '[]'::jsonb),
    'KanjiInSentence', COALESCE((
        SELECT jsonb_agg(
            jsonb_build_object(
                'SubjectId', ssr.subject_id,
                'Characters', COALESCE(s.characters, '')
            )
        )
        FROM sentence_subject_references ssr
        LEFT JOIN subjects s ON s.id = ssr.subject_id
        WHERE ssr.sentence_id = cs.id AND ssr.reference_type = 'kanji_in_sentence'
    ), '[]'::jsonb),
    'Morphemes', COALESCE((
        SELECT jsonb_agg(
            jsonb_build_object(
                'SubjectId', sm.subject_id,
                'CombinedForm', NULL,
                'surface', sm.surface,
                'lemma', sm.lemma,
                'lemma_reading', sm.lemma_reading,
                'orth', sm.orth,
                'pron', sm.pron,
                'conjugation_type', sm.conjugation_type,
                'conjugation_form', sm.conjugation_form,
                'Pos1', jsonb_build_object('Ja', COALESCE(sm.pos1_ja, ''), 'En', COALESCE(sm.pos1_en, '')),
                'Pos2', jsonb_build_object('Ja', COALESCE(sm.pos2_ja, ''), 'En', COALESCE(sm.pos2_en, '')),
                'Pos3', jsonb_build_object('Ja', COALESCE(sm.pos3_ja, ''), 'En', COALESCE(sm.pos3_en, '')),
                'Pos4', jsonb_build_object('Ja', COALESCE(sm.pos4_ja, ''), 'En', COALESCE(sm.pos4_en, ''))
            ) ORDER BY sm.sequence_order
        )
        FROM sentence_morphemes sm
        WHERE sm.sentence_id = cs.id
    ), '[]'::jsonb)
);

DROP TABLE IF EXISTS sentence_subject_references CASCADE;
DROP TABLE IF EXISTS sentence_morphemes CASCADE;
