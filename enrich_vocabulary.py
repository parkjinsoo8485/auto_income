import csv
import json
import re

print("Starting vocabulary enrichment...")

# 1. Load results_raw.tsv (combined_korean_vocabulary_list)
tsv_map = {}
with open('results_raw.tsv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, delimiter='\t')
    for row in reader:
        raw_word = row.get('word', '')
        clean_word = re.sub(r'\d+$', '', raw_word).strip('-').strip()
        if clean_word and clean_word not in tsv_map:
            tsv_map[clean_word] = {
                'part_of_speech': row.get('part_of_speech', ''),
                'hanja': row.get('hanja', ''),
                'nikl_level': row.get('nikl_level', ''),
                'topik_level': row.get('topik_level', ''),
                'explanation': row.get('explanation', '')
            }

print(f"Loaded {len(tsv_map)} unique dictionary words from TSV.")

# 2. Enrich all 6 TOPIK datasets (data/topik_level1~6.json)
for lvl in range(1, 7):
    path = f'data/topik_level{lvl}.json'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    words = data.get('words', [])
    updated_count = 0
    hanja_count = 0
    
    for w in words:
        term = w['term']
        info = tsv_map.get(term)
        if info:
            updated_count += 1
            if info['hanja']:
                w['hanja'] = info['hanja']
                hanja_count += 1
            else:
                w.setdefault('hanja', '')
            if info['part_of_speech']:
                w['part_of_speech'] = info['part_of_speech']
            if info['nikl_level']:
                w['nikl_level'] = info['nikl_level']
        else:
            w.setdefault('hanja', '')
            w.setdefault('part_of_speech', '')
            w.setdefault('nikl_level', '')

    data['words'] = words
    data['enriched_source'] = "국립국어원 표준국어대사전 + TOPIK 공인 목록 (combined_korean_vocabulary_list)"
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Level {lvl}: {len(words)} words processed (Matched: {updated_count}, Hanja: {hanja_count})")

print("Enrichment complete!")
