import json
import glob
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "..", "static")
OUTPUT_SQL = os.path.join(BASE_DIR, "import_context_sentences.sql")

def sql_str(val):
    if val is None:
        return "NULL"
    escaped = str(val).replace("'", "''")
    return f"'{escaped}'"

def sql_int(val):
    if val is None:
        return "NULL"
    return str(int(val))

def sql_json(val):
    if val is None:
        return "NULL"
    escaped = json.dumps(val, ensure_ascii=False).replace("'", "''")
    return f"'{escaped}'::jsonb"

def main():
    pattern = os.path.join(STATIC_DIR, "context-sentences-*.json")
    files = sorted(glob.glob(pattern))
    
    context_sentences_files = [f for f in files if "old" not in f and "processed" not in f]
    print(f"Found {len(context_sentences_files)} context sentence JSON files.")
    
    sentences = []
    seen_ja = set()
    
    for fpath in context_sentences_files:
        with open(fpath, "r", encoding="utf-8") as fp:
            items = json.load(fp)
            for item in items:
                ja = item.get("Ja")
                if not ja or ja in seen_ja:
                    continue
                seen_ja.add(ja)
                sentences.append(item)
                
    print(f"Loaded {len(sentences)} unique context sentences.")
    
    sql_lines = [
        "-- =============================================================================",
        "-- Clean and Seed Context Sentences Data",
        "-- Source: WaniKani.Relearn/static/context-sentences-*.json (Levels 1-60)",
        "-- =============================================================================\n",
        "BEGIN;\n",
        "-- Clean existing context sentences data",
        "TRUNCATE TABLE context_sentences CASCADE;\n"
    ]
    
    batch_size = 50
    columns = ["subject_id", "ja", "en", "level", "data_json"]
    cols_str = ", ".join(columns)
    
    # Clean statement header
    header = [
        "-- =============================================================================",
        "-- Clean and Seed Context Sentences Data",
        "-- Source: WaniKani.Relearn/static/context-sentences-*.json (Levels 1-60)",
        "-- Batch size: 50 rows per statement to stay well below CockroachDB 16MB gRPC limit",
        "-- =============================================================================\n",
        "TRUNCATE TABLE context_sentences CASCADE;\n"
    ]
    
    sql_lines = list(header)
    
    for i in range(0, len(sentences), batch_size):
        batch = sentences[i:i + batch_size]
        value_rows = []
        for s in batch:
            source_vocab = s.get("SourceVocabulary") or []
            subject_id = source_vocab[0].get("SubjectId") if source_vocab else None
            ja = s.get("Ja", "")
            en = s.get("En", "")
            level = s.get("Level", 1)
            
            row_str = f"({sql_int(subject_id)}, {sql_str(ja)}, {sql_str(en)}, {sql_int(level)}, {sql_json(s)})"
            value_rows.append(row_str)
            
        stmt = "BEGIN;\nINSERT INTO context_sentences (" + cols_str + ") VALUES\n" + ",\n".join(value_rows) + ";\nCOMMIT;\n"
        sql_lines.append(stmt)
        
    with open(OUTPUT_SQL, "w", encoding="utf-8") as fp:
        fp.write("\n".join(sql_lines))
        
    print(f"Successfully generated {OUTPUT_SQL} with {len(sentences)} sentences in {len(range(0, len(sentences), batch_size))} transaction batches!")

    # Also generate multi-part SQL files (~3,200 sentences / ~17MB per part) so SQL clients don't load 88MB at once
    part_size = 3200
    total_parts = (len(sentences) + part_size - 1) // part_size
    for p in range(total_parts):
        part_sentences = sentences[p * part_size : (p + 1) * part_size]
        part_file = os.path.join(BASE_DIR, f"import_context_sentences_part{p+1}.sql")
        part_lines = [
            f"-- Part {p+1} of {total_parts} ({len(part_sentences)} sentences)\n",
        ]
        if p == 0:
            part_lines.append("TRUNCATE TABLE context_sentences CASCADE;\n")
        
        for i in range(0, len(part_sentences), batch_size):
            batch = part_sentences[i:i + batch_size]
            value_rows = []
            for s in batch:
                source_vocab = s.get("SourceVocabulary") or []
                subject_id = source_vocab[0].get("SubjectId") if source_vocab else None
                ja = s.get("Ja", "")
                en = s.get("En", "")
                level = s.get("Level", 1)
                
                row_str = f"({sql_int(subject_id)}, {sql_str(ja)}, {sql_str(en)}, {sql_int(level)}, {sql_json(s)})"
                value_rows.append(row_str)
                
            stmt = "BEGIN;\nINSERT INTO context_sentences (" + cols_str + ") VALUES\n" + ",\n".join(value_rows) + ";\nCOMMIT;\n"
            part_lines.append(stmt)
            
        with open(part_file, "w", encoding="utf-8") as fp:
            fp.write("\n".join(part_lines))
        print(f"  Generated {os.path.basename(part_file)} with {len(part_sentences)} sentences.")

if __name__ == "__main__":
    main()

