import json
import os

os.makedirs('configs', exist_ok=True)

levels = [
    (1, 'TOPIK Korean L1 - Basics', 'com.koreanmaster.topik.level1', '#10B981', 'grid', 'ko-KR-SunHiNeural'),
    (2, 'TOPIK Korean L2 - Daily', 'com.koreanmaster.topik.level2', '#06B6D4', 'list', 'ko-KR-InJoonNeural'),
    (3, 'TOPIK Korean L3 - Social', 'com.koreanmaster.topik.level3', '#8B5CF6', 'carousel', 'ko-KR-SunHiNeural'),
    (4, 'TOPIK Korean L4 - Advanced', 'com.koreanmaster.topik.level4', '#F59E0B', 'grid', 'ko-KR-InJoonNeural'),
    (5, 'TOPIK Korean L5 - Academic', 'com.koreanmaster.topik.level5', '#EF4444', 'list', 'ko-KR-SunHiNeural'),
    (6, 'TOPIK Korean L6 - Master', 'com.koreanmaster.topik.level6', '#7C3AED', 'carousel', 'ko-KR-InJoonNeural'),
]

data_map = {}
for i in range(1, 7):
    with open(f'data/topik_level{i}.json', encoding='utf-8') as f:
        data_map[i] = json.load(f)

for lvl, app_name, app_id, color, layout, voice in levels:
    data = data_map[lvl]
    wc = len(data['words'])
    desc_lines = [
        "Pass the TOPIK exam with confidence!",
        "Learn essential Korean vocabulary with native audio, smart flashcards, and quizzes.",
        "",
        "Key Features:",
        f"- {wc} TOPIK Level {lvl} essential words",
        "- Native Korean audio pronunciation",
        "- Smart spaced repetition flashcards",
        "- 4-choice quiz challenges",
        "- Daily streak tracking",
        "- Ad-supported free access"
    ]
    config = {
        'app_info': {
            'app_id': app_id,
            'app_name': app_name,
            'version_name': '1.0.0',
            'version_code': 1,
            'target_language': 'ko',
            'native_language': 'en'
        },
        'ui_theme': {
            'primary_color': color,
            'secondary_color': '#EC4899',
            'background_color': '#F8FAFC',
            'surface_color': '#FFFFFF',
            'text_color': '#1E293B',
            'font_family': 'Nunito',
            'layout_mode': layout
        },
        'modules': {
            'vocabulary_list': True,
            'flashcards': True,
            'quiz_multiple_choice': True,
            'stroke_order_animation': True,
            'audio_pronunciation': True
        },
        'monetization': {
            'ad_mode': 'test',
            'admob_app_id': 'ca-app-pub-3940256099942544~3347511713',
            'admob_banner_id': 'ca-app-pub-3940256099942544/6300978111',
            'admob_interstitial_id': 'ca-app-pub-3940256099942544/1033173712',
            'admob_rewarded_id': 'ca-app-pub-3940256099942544/5224354917',
            'remote_config_interstitial_cooldown_seconds': 90
        },
        'assets': {
            'icon_source_path': None,
            'tts_engine': 'edge-tts',
            'tts_voice': voice
        },
        'store_metadata': {
            'title': f'Learn Korean TOPIK Level {lvl} - Vocabulary',
            'short_description': f'Master TOPIK Level {lvl} Korean vocabulary with native audio, flashcards and quizzes!',
            'full_description': '\n'.join(desc_lines),
            'keywords': ['learn korean', f'topik level {lvl}', 'korean vocabulary', 'korean exam', 'hangul', 'korean quiz'],
            'screenshots_headlines': [
                f'Master TOPIK Level {lvl} Korean',
                'Native Audio Pronunciation',
                'Smart Flashcard System',
                'Challenge Quiz Mode',
                'Track Your Daily Streak'
            ]
        },
        'content_data': data['words']
    }
    fname = f'configs/topik_level{lvl}.json'
    with open(fname, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
    print(f'[OK] Generated: {fname} ({wc} words)')

print('\nAll 6 TOPIK configs generated successfully!')
