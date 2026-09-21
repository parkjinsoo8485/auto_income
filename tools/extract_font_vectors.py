# -*- coding: utf-8 -*-
"""
tools/extract_font_vectors.py
Extracts vector outlines from any Korean TTF font (e.g. GowunDodum.ttf)
Outputs assets/hangul_font_vectors.json and assets/hangul_font_vectors.js
"""

import json, re, os, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

FONT_PATH = sys.argv[1] if len(sys.argv) > 1 else 'assets/fonts/GowunDodum.ttf'
FONT_NAME = os.path.splitext(os.path.basename(FONT_PATH))[0]

print(f"Loading font: {FONT_PATH} ({FONT_NAME})")
font = TTFont(FONT_PATH)
cmap = font.getBestCmap()
glyphSet = font.getGlyphSet()

# Collect all unique Hangul syllables from html files
unique_chars = set()
for hf in ['index.html', 'web_simulator.html']:
    if os.path.exists(hf):
        with open(hf, 'r', encoding='utf-8') as f:
            unique_chars.update(re.findall(r'[\uac00-\ud7a3]', f.read()))

test_chars = ['가', '고', '과', '강', '곰', '광', '닭', '한', '꽃', '물', '밥', '산', '학', '교', '책', '집', '눈', '비', '달', '손', '돈', '봄', '온', '왕', '글', '말', '빛', '꿈']
unique_chars.update(test_chars)
unique_chars = sorted(list(unique_chars))
print(f"Found {len(unique_chars)} unique syllables to extract.")

CHOS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
JUNGS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ']
JONGS = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']

jamo_compat_map = {
    'ㄱ': 0x3131, 'ㄲ': 0x3132, 'ㄳ': 0x3133, 'ㄴ': 0x3134, 'ㄵ': 0x3135, 'ㄶ': 0x3136,
    'ㄷ': 0x3137, 'ㄸ': 0x3138, 'ㄹ': 0x3139, 'ㄺ': 0x313A, 'ㄻ': 0x313B, 'ㄼ': 0x313C,
    'ㄽ': 0x313D, 'ㄾ': 0x313E, 'ㄿ': 0x313F, 'ㅀ': 0x3140, 'ㅁ': 0x3141, 'ㅂ': 0x3142,
    'ㅃ': 0x3143, 'ㅄ': 0x3144, 'ㅅ': 0x3145, 'ㅆ': 0x3146, 'ㅇ': 0x3147, 'ㅈ': 0x3148,
    'ㅉ': 0x3149, 'ㅊ': 0x314A, 'ㅋ': 0x314B, 'ㅌ': 0x314C, 'ㅍ': 0x314D, 'ㅎ': 0x314E,
    'ㅏ': 0x314F, 'ㅐ': 0x3150, 'ㅑ': 0x3151, 'ㅒ': 0x3152, 'ㅓ': 0x3153, 'ㅔ': 0x3154,
    'ㅕ': 0x3155, 'ㅖ': 0x3156, 'ㅗ': 0x3157, 'ㅘ': 0x3158, 'ㅙ': 0x3159, 'ㅚ': 0x315A,
    'ㅛ': 0x315B, 'ㅜ': 0x315C, 'ㅝ': 0x315D, 'ㅞ': 0x315E, 'ㅟ': 0x315F, 'ㅠ': 0x3160,
    'ㅡ': 0x3161, 'ㅢ': 0x3162, 'ㅣ': 0x3163
}

def extract_glyph_compact(gname):
    if gname not in glyphSet:
        return None
    glyph = glyphSet[gname]
    pen = SVGPathPen(glyphSet)
    glyph.draw(pen)
    bpen = BoundsPen(glyphSet)
    glyph.draw(bpen)
    bounds = bpen.bounds
    if bounds is None:
        bounds = [0, 0, 0, 0]
    else:
        bounds = [round(b, 1) for b in bounds]
    return {
        'path': pen.getCommands(),
        'bbox': bounds
    }

upm = font['head'].unitsPerEm
scale = round(170.0 / upm, 4)
output_data = {
    'meta': {
        'font': FONT_NAME,
        'upm': upm,
        'viewport': 200,
        'matrix': [scale, 0, 0, -scale, 18.0, 168.0]
    },
    'choseong': {},
    'jungseong': {},
    'jongseong': {},
    'jamo': {},
    'syllables': {}
}

# 1. Choseong
for i, ch in enumerate(CHOS):
    cp = 0x1100 + i
    gname = cmap.get(cp) or cmap.get(jamo_compat_map.get(ch))
    if gname:
        res = extract_glyph_compact(gname)
        if res: output_data['choseong'][ch] = res

# 2. Jungseong
for i, j in enumerate(JUNGS):
    cp = 0x1161 + i
    gname = cmap.get(cp) or cmap.get(jamo_compat_map.get(j))
    if gname:
        res = extract_glyph_compact(gname)
        if res: output_data['jungseong'][j] = res

# 3. Jongseong
for i, jg in enumerate(JONGS[1:], 1):
    cp = 0x11A7 + i
    gname = cmap.get(cp) or cmap.get(jamo_compat_map.get(jg))
    if gname:
        res = extract_glyph_compact(gname)
        if res: output_data['jongseong'][jg] = res

# 4. Compat Jamo
for k, cp in jamo_compat_map.items():
    gname = cmap.get(cp)
    if gname:
        res = extract_glyph_compact(gname)
        if res: output_data['jamo'][k] = res

# 5. Syllables
extracted_count = 0
for syl in unique_chars:
    cp = ord(syl)
    gname = cmap.get(cp)
    if gname:
        res = extract_glyph_compact(gname)
        if res:
            output_data['syllables'][syl] = res
            extracted_count += 1

print(f"Extracted: choseong={len(output_data['choseong'])}, jungseong={len(output_data['jungseong'])}, jongseong={len(output_data['jongseong'])}, jamo={len(output_data['jamo'])}, syllables={extracted_count}")

with open('assets/hangul_font_vectors.json', 'w', encoding='utf-8') as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

js_content = "window.HANGUL_FONT_VECTORS = " + json.dumps(output_data, ensure_ascii=False, separators=(',', ':')) + ";\n"
with open('assets/hangul_font_vectors.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Saved assets/hangul_font_vectors.json ({os.path.getsize('assets/hangul_font_vectors.json'):,} bytes)")
print(f"Saved assets/hangul_font_vectors.js ({os.path.getsize('assets/hangul_font_vectors.js'):,} bytes)")
