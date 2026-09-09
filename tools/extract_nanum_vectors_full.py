# -*- coding: utf-8 -*-
"""
tools/extract_nanum_vectors_full.py
Extracts:
1. Choseong (19), Jungseong (21), Jongseong (27), Compat Jamo (51)
2. All unique Hangul syllables used across the Korean Master vocab app (~611 chars)
from C:\\Windows\\Fonts\\NanumGothic.ttf and saves to assets/hangul_font_vectors.json & .js
"""

import json, re, os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

font_path = r'C:\Windows\Fonts\NanumGothic.ttf'
font = TTFont(font_path)
cmap = font.getBestCmap()
glyphSet = font.getGlyphSet()

# 1. Collect all Hangul syllables from index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# All syllables between AC00 and D7A3
unique_chars = sorted(list(set(re.findall(r'[\uac00-\ud7a3]', html_content))))
print(f"Found {len(unique_chars)} unique syllables in index.html.")

# Also ensure common benchmark chars are included
test_chars = ['가', '고', '과', '강', '곰', '광', '닭', '한', '꽃', '물', '밥', '산', '학', '교', '책', '집', '눈', '비']
for tc in test_chars:
    if tc not in unique_chars:
        unique_chars.append(tc)
unique_chars = sorted(unique_chars)

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

def extract_glyph_compact(gname, cp=None):
    if gname not in glyphSet: return None
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

output_data = {
    'meta': {
        'font': 'NanumGothic',
        'upm': font['head'].unitsPerEm,
        'viewport': 200,
        'matrix': [0.175, 0, 0, -0.175, 15.0, 150.0]
    },
    'choseong': {},
    'jungseong': {},
    'jongseong': {},
    'jamo': {},
    'syllables': {}
}

for i, ch in enumerate(CHOS):
    cp = 0x1100 + i
    gname = cmap.get(cp)
    if gname:
        res = extract_glyph_compact(gname, cp)
        if res: output_data['choseong'][ch] = res

for i, j in enumerate(JUNGS):
    cp = 0x1161 + i
    gname = cmap.get(cp)
    if gname:
        res = extract_glyph_compact(gname, cp)
        if res: output_data['jungseong'][j] = res

for i, jg in enumerate(JONGS[1:], 1):
    cp = 0x11A7 + i
    gname = cmap.get(cp)
    if gname:
        res = extract_glyph_compact(gname, cp)
        if res: output_data['jongseong'][jg] = res

for k, cp in jamo_compat_map.items():
    gname = cmap.get(cp)
    if gname:
        res = extract_glyph_compact(gname, cp)
        if res: output_data['jamo'][k] = res

# Extract syllables
extracted_syl_count = 0
for syl in unique_chars:
    cp = ord(syl)
    gname = cmap.get(cp)
    if gname:
        res = extract_glyph_compact(gname, cp)
        if res:
            output_data['syllables'][syl] = res
            extracted_syl_count += 1

print(f"Extracted {extracted_syl_count} syllable outlines.")

with open('assets/hangul_font_vectors.json', 'w', encoding='utf-8') as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

js_content = "window.HANGUL_FONT_VECTORS = " + json.dumps(output_data, ensure_ascii=False, separators=(',', ':')) + ";\n"
with open('assets/hangul_font_vectors.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

json_size = os.path.getsize('assets/hangul_font_vectors.json')
js_size = os.path.getsize('assets/hangul_font_vectors.js')
print(f"hangul_font_vectors.json: {json_size:,} bytes")
print(f"hangul_font_vectors.js: {js_size:,} bytes")
