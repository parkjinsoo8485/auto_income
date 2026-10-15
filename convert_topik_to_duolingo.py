#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
convert_topik_to_duolingo.py
Transforms HRD-Korea EPS-TOPIK 60 Lessons into standard Duolingo-style gamified curriculum.
Generates: duolingo_korean_course.js and data/duolingo_course.json
"""

import json
import re
import random
import os

DISTRACTORS_POOL = [
    "사과", "물", "친구", "학교", "집", "선생님", "회사", "한국", "밥", "오늘", "내일", "가방", "책"
]

def clean_js_to_json(js_content):
    # Remove JS variable assignment and trailing comments
    match = re.search(r'const\s+EPSTOPIK_TEXTBOOK_60\s*=\s*(\[[\s\S]*\]);?', js_content)
    if not match:
        raise ValueError("Could not find EPSTOPIK_TEXTBOOK_60 array in file.")
    raw_json = match.group(1).strip()
    if raw_json.endswith(';'):
        raw_json = raw_json[:-1]
    return json.loads(raw_json)

def build_duolingo_course():
    with open('epstopik_textbook_60.js', 'r', encoding='utf-8') as f:
        lessons_data = clean_js_to_json(f.read())

    course_units = []

    for lesson in lessons_data:
        lesson_id = lesson.get('id', 1)
        title_ko = lesson.get('title', f"제 {lesson_id}과")
        title_en = lesson.get('titleEng', f"Lesson {lesson_id}")
        category = lesson.get('category', '한국어 기초')
        vocabs = lesson.get('vocabulary', [])
        grammar_list = lesson.get('grammar', [])

        challenges = []

        # 1. Match Pairs Challenge (4 items)
        if len(vocabs) >= 4:
            sampled_vocabs = vocabs[:4]
            pairs = []
            for v in sampled_vocabs:
                pairs.append({
                    "korean": v['word'],
                    "meaning": v['meaning']
                })
            challenges.append({
                "id": f"u{lesson_id}_c1_match",
                "type": "match_pairs",
                "prompt": "단어와 알맞은 뜻의 짝을 맞추세요 (Tap the matching pairs)",
                "pairs": pairs
            })

        # 2. Translate Tokens (Word Bank Assembly)
        # Find sentence from vocab or grammar
        sample_sentence = None
        meaning_sentence = None
        for v in vocabs:
            if v.get('example'):
                sample_sentence = v['example']
                meaning_sentence = f"Meaning of: {v['word']} ({v['meaning']})"
                break
        
        if not sample_sentence and grammar_list and grammar_list[0].get('examples'):
            sample_sentence = grammar_list[0]['examples'][0]
            meaning_sentence = "Example Korean sentence"

        if sample_sentence:
            # Tokenize into words or syllables
            tokens = [t for t in re.split(r'(\s+)', sample_sentence) if t.strip()]
            correct_seq = list(tokens)
            
            # Add 2-3 distractors
            extra = [d for d in DISTRACTORS_POOL if d not in correct_seq][:2]
            all_tokens = list(correct_seq) + extra
            random.seed(lesson_id)
            random.shuffle(all_tokens)

            challenges.append({
                "id": f"u{lesson_id}_c2_tokens",
                "type": "translate_tokens",
                "prompt": "다음 문장을 단어 카드를 순서대로 눌러 완성하세요",
                "targetText": sample_sentence,
                "meaning": meaning_sentence or sample_sentence,
                "tokens": all_tokens,
                "correctSequence": correct_seq
            })

        # 3. Listening Comprehension Challenge
        if vocabs:
            target_v = vocabs[0]
            options = [target_v['meaning']]
            other_meanings = [v['meaning'] for v in vocabs[1:] if v['meaning'] != target_v['meaning']]
            random.seed(lesson_id * 7)
            random.shuffle(other_meanings)
            options.extend(other_meanings[:3])
            while len(options) < 4:
                options.append(f"Other option {len(options)+1}")
            
            correct_meaning = target_v['meaning']
            random.shuffle(options)
            correct_idx = options.index(correct_meaning)

            challenges.append({
                "id": f"u{lesson_id}_c3_listen",
                "type": "listen_comprehension",
                "prompt": "음성을 듣고 올바른 의미를 선택하세요",
                "spokenText": target_v['word'],
                "pronunciation": target_v.get('pron', ''),
                "options": options,
                "correctIndex": correct_idx,
                "wordKo": target_v['word']
            })

        # 4. Character Trace / Syllable Challenge (Interactive stroke practice)
        if vocabs:
            first_word = vocabs[0]['word']
            first_char = first_word[0] if first_word else "가"
            challenges.append({
                "id": f"u{lesson_id}_c4_trace",
                "type": "character_trace",
                "prompt": f"'{first_char}' 글자를 획순에 맞추어 따라 써보세요",
                "character": first_char,
                "word": first_word,
                "meaning": vocabs[0]['meaning']
            })

        # 5. Multiple Choice Grammar / Context Challenge
        if len(vocabs) >= 2:
            q_vocab = vocabs[1]
            distractor_words = [v['word'] for v in vocabs if v['word'] != q_vocab['word']][:3]
            opts = [q_vocab['word']] + distractor_words
            random.seed(lesson_id * 13)
            random.shuffle(opts)
            correct_idx = opts.index(q_vocab['word'])

            challenges.append({
                "id": f"u{lesson_id}_c5_mcq",
                "type": "multiple_choice",
                "prompt": f"다음 뜻에 해당하는 한국어 단어는 무엇일까요?\n👉 \"{q_vocab['meaning']}\"",
                "options": opts,
                "correctIndex": correct_idx,
                "explanation": f"{q_vocab['word']} = {q_vocab['meaning']} (발음: {q_vocab.get('pron', '')})"
            })

        unit_node = {
            "unitId": lesson_id,
            "book": lesson.get('book', 1),
            "lessonNum": lesson.get('lessonNum', lesson_id),
            "title": title_ko,
            "titleEng": title_en,
            "category": category,
            "categoryColor": lesson.get('categoryColor', '#58cc02'),
            "xpReward": 15,
            "crowns": 0,
            "status": "unlocked" if lesson_id == 1 else "locked",
            "challenges": challenges
        }
        course_units.append(unit_node)

    os.makedirs('data', exist_ok=True)
    
    # Save JSON
    with open('data/duolingo_course.json', 'w', encoding='utf-8') as f:
        json.dump(course_units, f, ensure_ascii=False, indent=2)

    # Save JS for direct browser inclusion
    with open('duolingo_korean_course.js', 'w', encoding='utf-8') as f:
        f.write('/* Auto-generated Duolingo Korean Course from EPS-TOPIK 60 Lessons */\n')
        f.write('window.DUOLINGO_COURSE = ' + json.dumps(course_units, ensure_ascii=False, indent=2) + ';\n')

    print(f"Successfully generated Duolingo course with {len(course_units)} units!")

if __name__ == '__main__':
    build_duolingo_course()
