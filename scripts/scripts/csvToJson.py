import csv
import json

with open('../../4500 Japanese Sentences.csv', 'r', encoding='utf-8') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    data = [row for row in csv_reader]
    word_data = [{'word': row['単語'], 'sentence': row['Sentence']} for row in data]
    print(word_data)
    with open('../../4500 Japanese Sentences.json', 'w', encoding='utf-8') as json_file:
        json.dump(word_data, json_file, ensure_ascii=False, indent=4)