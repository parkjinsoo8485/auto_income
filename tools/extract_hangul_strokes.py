import os
import json
import re

svg_dir = r"c:\Myproject\auto_income\assets\hangul_stroke_svg"
files = sorted(os.listdir(svg_dir))

name_to_jamo = {
    'giyeok': 'ㄱ', 'nieun': 'ㄴ', 'digeut': 'ㄷ', 'rieul': 'ㄹ', 'mieum': 'ㅁ',
    'bieup': 'ㅂ', 'siot': 'ㅅ', 'ieung': 'ㅇ', 'jieut': 'ㅈ', 'chieut': 'ㅊ',
    'kieuk': 'ㅋ', 'tieut': 'ㅌ', 'pieup': 'ㅍ', 'hieut': 'ㅎ',
    'a': 'ㅏ', 'ya': 'ㅑ', 'eo': 'ㅓ', 'yeo': 'ㅕ', 'o': 'ㅗ', 'yo': 'ㅛ',
    'u': 'ㅜ', 'yu': 'ㅠ', 'eu': 'ㅡ', 'i': 'ㅣ',
    'ae': 'ㅐ', 'yae': 'ㅒ', 'e': 'ㅔ', 'ye': 'ㅖ', 'oe': 'ㅚ', 'wi': 'ㅟ', 'ui': 'ㅢ',
    'wa': 'ㅘ', 'wo': 'ㅝ', 'wae': 'ㅙ', 'we': 'ㅞ'
}

data = {}

for f in files:
    if not f.endswith('.svg'):
        continue
    base = f.replace('.svg', '')
    parts = base.split('_', 1)
    roman = parts[1] if len(parts) > 1 else base
    jamo = name_to_jamo.get(roman, '')
    
    with open(os.path.join(svg_dir, f), 'r', encoding='utf-8') as fp:
        content = fp.read()
        
    num_strokes = len(re.findall(r'id=["\']arrow-\d+["\']', content))
    
    data[jamo or roman] = {
        'id': base,
        'jamo': jamo,
        'roman': roman,
        'strokes': num_strokes,
        'file': f,
        'svg': content
    }

out_json = r"c:\Myproject\auto_income\assets\hangul_stroke_data.json"
out_js = r"c:\Myproject\auto_income\assets\hangul_stroke_data.js"

with open(out_json, 'w', encoding='utf-8') as fp:
    json.dump(data, fp, ensure_ascii=False, indent=2)

with open(out_js, 'w', encoding='utf-8') as fp:
    fp.write("window.HANGUL_STROKE_DATA = " + json.dumps(data, ensure_ascii=False) + ";\n")

print(f"Processed {len(data)} jamo records.")
for k, v in data.items():
    print(f"{k} ({v['roman']}): {v['strokes']} strokes")
