import json
import os

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "..", "static")

RADICAL_PATH = os.path.join(STATIC_DIR, "subjects-radical.json")
KANJI_PATH = os.path.join(STATIC_DIR, "subjects-kanji.json")
VOCAB_PATH = os.path.join(STATIC_DIR, "subjects-vocabulary.json")

OUTPUT_SEED_SQL = os.path.join(BASE_DIR, "seed_data.sql")

def sql_str(val):
    if val is None:
        return "NULL"
    escaped = str(val).replace("'", "''")
    return f"'{escaped}'"

def sql_bool(val):
    if val is None:
        return "FALSE"
    return "TRUE" if val else "FALSE"

def sql_int(val):
    if val is None:
        return "NULL"
    return str(int(val))

def sql_json(val):
    if val is None:
        return "NULL"
    escaped = json.dumps(val).replace("'", "''")
    return f"'{escaped}'::jsonb"

def generate_batched_inserts(table_name, columns, rows, batch_size=1000):
    if not rows:
        return []
    
    statements = []
    cols_str = ", ".join(columns)
    
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        values_str = ",\n".join(f"({', '.join(row)})" for row in batch)
        stmt = f"INSERT INTO {table_name} ({cols_str}) VALUES\n{values_str}\nON CONFLICT DO NOTHING;"
        statements.append(stmt)
        
    return statements

def main():
    print("Loading JSON files...")
    with open(RADICAL_PATH, "r", encoding="utf-8") as f:
        radicals = json.load(f)
    with open(KANJI_PATH, "r", encoding="utf-8") as f:
        kanjis = json.load(f)
    with open(VOCAB_PATH, "r", encoding="utf-8") as f:
        vocabs = json.load(f)

    all_subjects = radicals + kanjis + vocabs
    valid_subject_ids = {s["Id"] for s in all_subjects}

    print(f"Total subjects loaded: {len(all_subjects)} (Radicals: {len(radicals)}, Kanji: {len(kanjis)}, Vocab: {len(vocabs)})")

    # Data collectors
    subjects_rows = []
    subject_meanings_rows = []
    subject_aux_meanings_rows = []
    
    kanji_details_rows = []
    kanji_readings_rows = []
    
    vocab_details_rows = []
    vocab_readings_rows = []
    vocab_pos_rows = []
    vocab_audio_rows = []
    
    radical_images_rows = []
    relationships_rows = []
    context_sentences_rows = []

    for item in all_subjects:
        sid = item["Id"]
        obj_type = item["Object"]
        slug = item["Slug"]
        chars = item.get("Characters")
        meaning_mnemonic = item["MeaningMnemonic"]
        api_url = item.get("WaniKaniApiUrl")
        doc_url = item["WaniKaniDocumentUrl"]
        level = item["Level"]
        srs_id = item["SpacedRepetitionSystemId"]
        created_at = item["CreatedAt"]
        hidden_at = item.get("HiddenAt")
        data_updated_at = item["DataUpdatedAt"]

        # 1. subjects table
        subjects_rows.append([
            sql_int(sid),
            sql_str(obj_type),
            sql_str(slug),
            sql_str(chars),
            sql_str(meaning_mnemonic),
            sql_str(api_url),
            sql_str(doc_url),
            sql_int(level),
            sql_int(srs_id),
            sql_str(created_at),
            sql_str(hidden_at),
            sql_str(data_updated_at)
        ])

        # 2. subject_meanings
        for m in item.get("Meanings", []):
            subject_meanings_rows.append([
                sql_int(sid),
                sql_str(m.get("Meaning")),
                sql_bool(m.get("Primary")),
                sql_bool(m.get("AcceptedAnswer"))
            ])

        # 3. subject_auxiliary_meanings
        for am in item.get("AuxiliaryMeanings", []):
            subject_aux_meanings_rows.append([
                sql_int(sid),
                sql_str(am.get("Meaning")),
                sql_str(am.get("Type"))
            ])

        # Type-specific processing
        if obj_type == "radical":
            for img in item.get("CharacterImages", []):
                radical_images_rows.append([
                    sql_int(sid),
                    sql_str(img.get("Url")),
                    sql_str(img.get("ContentType")),
                    sql_json(img.get("Metadata"))
                ])

        elif obj_type == "kanji":
            kanji_details_rows.append([
                sql_int(sid),
                sql_str(item.get("MeaningHint")),
                sql_str(item.get("ReadingHint")),
                sql_str(item.get("ReadingMnemonic")),
                sql_str(item.get("JlptLevel")),
                sql_str(item.get("JoyoGrade"))
            ])

            for r in item.get("Readings", []):
                kanji_readings_rows.append([
                    sql_int(sid),
                    sql_str(r.get("Reading")),
                    sql_str(r.get("Type")),
                    sql_bool(r.get("Primary")),
                    sql_bool(r.get("AcceptedAnswer"))
                ])

        elif obj_type == "vocabulary":
            vocab_details_rows.append([
                sql_int(sid),
                sql_str(item.get("ReadingMnemonic"))
            ])

            for r in item.get("Readings", []):
                vocab_readings_rows.append([
                    sql_int(sid),
                    sql_str(r.get("Reading")),
                    sql_bool(r.get("Primary")),
                    sql_bool(r.get("AcceptedAnswer"))
                ])

            for pos in item.get("PartsOfSpeech", []):
                vocab_pos_rows.append([
                    sql_int(sid),
                    sql_str(pos)
                ])

            for audio in item.get("PronunciationAudios", []):
                meta = audio.get("Metadata", {}) or {}
                vocab_audio_rows.append([
                    sql_int(sid),
                    sql_str(audio.get("Url")),
                    sql_str(audio.get("ContentType")),
                    sql_str(meta.get("Gender")),
                    sql_int(meta.get("SourceId")),
                    sql_str(meta.get("Pronunciation")),
                    sql_str(meta.get("VoiceActorId")),
                    sql_str(meta.get("VoiceActorName")),
                    sql_str(meta.get("VoiceDescription"))
                ])

            for cs in item.get("ContextSentences", []):
                context_sentences_rows.append([
                    sql_int(sid),
                    sql_str(cs.get("Ja")),
                    sql_str(cs.get("En")),
                    sql_int(level)
                ])

        # Relationships
        for child_id in item.get("AmalgamationSubjectIds", []):
            if child_id in valid_subject_ids:
                relationships_rows.append([sql_int(sid), sql_int(child_id), sql_str("amalgamation")])
        for child_id in item.get("ComponentSubjectIds", []):
            if child_id in valid_subject_ids:
                relationships_rows.append([sql_int(sid), sql_int(child_id), sql_str("component")])
        for child_id in item.get("VisuallySimilarSubjectIds", []):
            if child_id in valid_subject_ids:
                relationships_rows.append([sql_int(sid), sql_int(child_id), sql_str("visually_similar")])

    print("Generating SQL statements...")

    sql_sections = []
    sql_sections.append("-- =============================================================================")
    sql_sections.append("-- WaniKani Subjects Data Seeding Script")
    sql_sections.append("-- =============================================================================\n")

    sql_sections.append("BEGIN;\n")

    # 1. subjects
    sql_sections.append("-- 1. Subjects Core")
    sql_sections.extend(generate_batched_inserts(
        "subjects",
        ["id", "object_type", "slug", "characters", "meaning_mnemonic", "wanikani_api_url", "wanikani_document_url", "level", "spaced_repetition_system_id", "created_at", "hidden_at", "data_updated_at"],
        subjects_rows
    ))

    # 2. subject_meanings
    sql_sections.append("\n-- 2. Subject Meanings")
    sql_sections.extend(generate_batched_inserts(
        "subject_meanings",
        ["subject_id", "meaning", "is_primary", "accepted_answer"],
        subject_meanings_rows
    ))

    # 3. subject_auxiliary_meanings
    sql_sections.append("\n-- 3. Subject Auxiliary Meanings")
    sql_sections.extend(generate_batched_inserts(
        "subject_auxiliary_meanings",
        ["subject_id", "meaning", "type"],
        subject_aux_meanings_rows
    ))

    # 4. kanji_details
    sql_sections.append("\n-- 4. Kanji Details")
    sql_sections.extend(generate_batched_inserts(
        "kanji_details",
        ["subject_id", "meaning_hint", "reading_hint", "reading_mnemonic", "jlpt_level", "joyo_grade"],
        kanji_details_rows
    ))

    # 5. kanji_readings
    sql_sections.append("\n-- 5. Kanji Readings")
    sql_sections.extend(generate_batched_inserts(
        "kanji_readings",
        ["subject_id", "reading", "type", "is_primary", "accepted_answer"],
        kanji_readings_rows
    ))

    # 6. vocabulary_details
    sql_sections.append("\n-- 6. Vocabulary Details")
    sql_sections.extend(generate_batched_inserts(
        "vocabulary_details",
        ["subject_id", "reading_mnemonic"],
        vocab_details_rows
    ))

    # 7. vocabulary_readings
    sql_sections.append("\n-- 7. Vocabulary Readings")
    sql_sections.extend(generate_batched_inserts(
        "vocabulary_readings",
        ["subject_id", "reading", "is_primary", "accepted_answer"],
        vocab_readings_rows
    ))

    # 8. vocabulary_parts_of_speech
    sql_sections.append("\n-- 8. Vocabulary Parts of Speech")
    sql_sections.extend(generate_batched_inserts(
        "vocabulary_parts_of_speech",
        ["subject_id", "part_of_speech"],
        vocab_pos_rows
    ))

    # 9. vocabulary_pronunciation_audios
    sql_sections.append("\n-- 9. Vocabulary Pronunciation Audios")
    sql_sections.extend(generate_batched_inserts(
        "vocabulary_pronunciation_audios",
        ["subject_id", "url", "content_type", "gender", "source_id", "pronunciation", "voice_actor_id", "voice_actor_name", "voice_description"],
        vocab_audio_rows
    ))

    # 10. radical_character_images
    sql_sections.append("\n-- 10. Radical Character Images")
    sql_sections.extend(generate_batched_inserts(
        "radical_character_images",
        ["subject_id", "url", "content_type", "metadata_json"],
        radical_images_rows
    ))

    # 11. subject_relationships
    sql_sections.append("\n-- 11. Subject Relationships")
    sql_sections.extend(generate_batched_inserts(
        "subject_relationships",
        ["parent_subject_id", "child_subject_id", "relationship_type"],
        relationships_rows
    ))

    # 12. context_sentences
    sql_sections.append("\n-- 12. Context Sentences")
    sql_sections.extend(generate_batched_inserts(
        "context_sentences",
        ["subject_id", "ja", "en", "level"],
        context_sentences_rows
    ))

    sql_sections.append("\nCOMMIT;\n")

    print(f"Writing SQL script to {OUTPUT_SEED_SQL}...")
    with open(OUTPUT_SEED_SQL, "w", encoding="utf-8") as f:
        f.write("\n\n".join(sql_sections))

    print(f"Successfully generated {OUTPUT_SEED_SQL}!")

if __name__ == "__main__":
    main()
