import json, os, subprocess

font_data = json.load(open('assets/hangul_font_vectors.json', encoding='utf-8'))

CHOS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
JUNGS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ']
JONGS = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']

STROKE_DB = {
    'ㄱ': [{'d': 'M 18,22 L 82,22 L 82,85', 'desc': '1획'}],
    'ㄴ': [{'d': 'M 24,18 L 24,80 L 86,80', 'desc': '1획'}],
    'ㄷ': [{'d': 'M 18,22 L 84,22', 'desc': '1획'}, {'d': 'M 22,22 L 22,82 L 86,82', 'desc': '2획'}],
    'ㄹ': [{'d': 'M 20,20 L 82,20 L 82,48', 'desc': '1획'}, {'d': 'M 20,48 L 82,48', 'desc': '2획'}, {'d': 'M 20,48 L 20,82 L 86,82', 'desc': '3획'}],
    'ㅁ': [{'d': 'M 22,18 L 22,84', 'desc': '1획'}, {'d': 'M 22,20 L 82,20 L 82,84', 'desc': '2획'}, {'d': 'M 20,82 L 84,82', 'desc': '3획'}],
    'ㅂ': [{'d': 'M 24,18 L 24,82', 'desc': '1획'}, {'d': 'M 78,18 L 78,82', 'desc': '2획'}, {'d': 'M 22,50 L 80,50', 'desc': '3획'}, {'d': 'M 22,82 L 80,82', 'desc': '4획'}],
    'ㅅ': [{'d': 'M 50,18 L 18,84', 'desc': '1획'}, {'d': 'M 44,44 L 84,84', 'desc': '2획'}],
    'ㅇ': [{'d': 'M 50,16 C 30,16 16,31 16,50 C 16,69 30,84 50,84 C 70,84 84,69 84,50 C 84,31 70,16 50,16 Z', 'desc': '1획'}],
    'ㅈ': [{'d': 'M 18,22 L 82,22 L 50,56 L 18,84', 'desc': '1획'}, {'d': 'M 48,50 L 84,84', 'desc': '2획'}],
    'ㅊ': [{'d': 'M 36,12 L 64,12', 'desc': '1획'}, {'d': 'M 18,30 L 82,30 L 50,60 L 18,85', 'desc': '2획'}, {'d': 'M 48,54 L 84,85', 'desc': '3획'}],
    'ㅋ': [{'d': 'M 18,20 L 82,20 L 82,84', 'desc': '1획'}, {'d': 'M 18,50 L 80,50', 'desc': '2획'}],
    'ㅌ': [{'d': 'M 18,20 L 84,20', 'desc': '1획'}, {'d': 'M 18,50 L 80,50', 'desc': '2획'}, {'d': 'M 22,20 L 22,82 L 86,82', 'desc': '3획'}],
    'ㅍ': [{'d': 'M 18,25 L 84,25', 'desc': '1획'}, {'d': 'M 36,25 L 36,80', 'desc': '2획'}, {'d': 'M 64,25 L 64,80', 'desc': '3획'}, {'d': 'M 16,80 L 86,80', 'desc': '4획'}],
    'ㅎ': [{'d': 'M 36,14 L 64,14', 'desc': '1획'}, {'d': 'M 18,30 L 82,30', 'desc': '2획'}, {'d': 'M 50,44 C 34,44 22,55 22,70 C 22,85 34,94 50,94 C 66,94 78,85 78,70 C 78,55 66,44 50,44 Z', 'desc': '3획'}],
    'ㅏ': [{'d': 'M 46,14 L 46,86', 'desc': '1획'}, {'d': 'M 46,50 L 86,50', 'desc': '2획'}],
    'ㅗ': [{'d': 'M 50,18 L 50,62', 'desc': '1획'}, {'d': 'M 14,62 L 86,62', 'desc': '2획'}],
    'ㅡ': [{'d': 'M 14,50 L 86,50', 'desc': '1획'}],
    'ㅣ': [{'d': 'M 50,14 L 50,86', 'desc': '1획'}]
}

def decompose(ch):
    code = ord(ch) - 0xAC00
    if code < 0 or code > 11171:
        return {'char': ch, 'cho': ch, 'jung': None, 'jong': None, 'isHangul': False}
    jong = code % 28
    jung = (code - jong) // 28 % 21
    cho = (code - jong) // 28 // 21
    return {
        'char': ch,
        'cho': CHOS[cho],
        'jung': JUNGS[jung],
        'jong': JONGS[jong] if jong else None,
        'choIdx': cho,
        'jungIdx': jung,
        'jongIdx': jong,
        'isHangul': True
    }

def get_slots(dec):
    cho = dec['cho']
    jung = dec['jung']
    jong = dec['jong']
    jungIdx = dec['jungIdx']
    hasJong = bool(jong)
    isVert = jungIdx in [0, 1, 2, 3, 4, 5, 6, 7, 20]
    isHoriz = jungIdx in [8, 12, 13, 17, 18]

    slots = []
    if isVert:
        if not hasJong:
            slots.append({'jamo': cho, 'role': 'cho', 'x': 26, 'y': 25, 'w': 74, 'h': 146})
            slots.append({'jamo': jung, 'role': 'jung', 'x': 104, 'y': 22, 'w': 72, 'h': 154})
        else:
            slots.append({'jamo': cho, 'role': 'cho', 'x': 28, 'y': 20, 'w': 72, 'h': 76})
            slots.append({'jamo': jung, 'role': 'jung', 'x': 104, 'y': 18, 'w': 70, 'h': 82})
            slots.append({'jamo': jong, 'role': 'jong', 'x': 32, 'y': 100, 'w': 136, 'h': 76})
    elif isHoriz:
        if not hasJong:
            slots.append({'jamo': cho, 'role': 'cho', 'x': 36, 'y': 22, 'w': 128, 'h': 72})
            slots.append({'jamo': jung, 'role': 'jung', 'x': 22, 'y': 92, 'w': 156, 'h': 86})
        else:
            slots.append({'jamo': cho, 'role': 'cho', 'x': 38, 'y': 16, 'w': 124, 'h': 54})
            slots.append({'jamo': jung, 'role': 'jung', 'x': 24, 'y': 68, 'w': 152, 'h': 48})
            slots.append({'jamo': jong, 'role': 'jong', 'x': 34, 'y': 116, 'w': 132, 'h': 68})
    return slots

def get_glyph(role, jamo):
    if role == 'cho' and jamo in font_data['choseong']: return font_data['choseong'][jamo]
    if role.startswith('jung') and jamo in font_data['jungseong']: return font_data['jungseong'][jamo]
    if role == 'jong' and jamo in font_data['jongseong']: return font_data['jongseong'][jamo]
    return None

def get_glyph_matrix(glyph, slot):
    minX, minY, maxX, maxY = glyph['bbox']
    bw = maxX - minX or 1
    bh = maxY - minY or 1
    sx = slot['w'] / bw
    sy = -slot['h'] / bh
    tx = slot['x'] - minX * sx
    ty = slot['y'] - maxY * sy
    return f"matrix({sx:.5f} 0 0 {sy:.5f} {tx:.3f} {ty:.3f})"

def transform_path(d, sx, sy, sw, sh):
    is_x = True
    parts = []
    import re
    tokens = re.split(r'([+-]?\d+\.?\d*)', d)
    for tok in tokens:
        if re.match(r'^[+-]?\d+\.?\d*$', tok):
            val = float(tok)
            res = (sx + (val / 100.0) * sw) if is_x else (sy + (val / 100.0) * sh)
            is_x = not is_x
            parts.append(f"{res:.1f}")
        else:
            parts.append(tok)
    return "".join(parts)

words = ['가', '강', '고', '한']
html_cards = []

PALETTE = ['#38bdf8', '#818cf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399', '#f87171']

for w in words:
    dec = decompose(w)
    slots = get_slots(dec)
    
    underlay_paths = []
    stroke_paths_old = []
    
    st_idx = 0
    all_strokes_for_word = []
    
    for s in slots:
        glyph = get_glyph(s['role'], s['jamo'])
        matrix = get_glyph_matrix(glyph, s) if glyph else ""
        if glyph:
            underlay_paths.append(f'<path d="{glyph["path"]}" transform="{matrix}" fill="rgba(255,255,255,0.14)"/>')

        raw_strokes = STROKE_DB.get(s['jamo'], [])
        for st in raw_strokes:
            t_d = transform_path(st['d'], s['x'], s['y'], s['w'], s['h'])
            col = PALETTE[st_idx % len(PALETTE)]
            stroke_paths_old.append(f'<path d="{t_d}" stroke="{col}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/>')
            all_strokes_for_word.append({
                'd': t_d,
                'color': col,
                'glyph_path': glyph['path'] if glyph else '',
                'matrix': matrix,
                'idx': st_idx
            })
            st_idx += 1

    svg_old = f'''
    <svg viewBox="0 0 200 200" width="160" height="160" style="background:#0f172a;border-radius:14px;">
      <g>{''.join(underlay_paths)}</g>
      <g>{''.join(stroke_paths_old)}</g>
    </svg>
    '''

    # Now create the exact font mask svg:
    # Each stroke reveals that part of the glyph with its stroke color!
    revealed_groups = []
    defs_masks = []
    for item in all_strokes_for_word:
        m_id = f"m_{w}_{item['idx']}"
        defs_masks.append(f'''
        <mask id="{m_id}" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
          <rect x="0" y="0" width="200" height="200" fill="black"/>
          <path d="{item['d']}" stroke="white" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </mask>
        ''')
        revealed_groups.append(f'''
        <g mask="url(#{m_id})">
          <path d="{item['glyph_path']}" transform="{item['matrix']}" fill="{item['color']}"/>
        </g>
        ''')

    svg_mask = f'''
    <svg viewBox="0 0 200 200" width="160" height="160" style="background:#0f172a;border-radius:14px;">
      <defs>
        {''.join(defs_masks)}
      </defs>
      <!-- 회색 폰트 밑그림 -->
      <g>{''.join(underlay_paths)}</g>
      <!-- 폰트 글씨체 100% 동일하게 획별 색상으로 마스킹 채움 -->
      <g>{''.join(revealed_groups)}</g>
    </svg>
    '''

    html_cards.append(f'''
    <div style="background:#1e293b;padding:16px;border-radius:16px;display:flex;gap:24px;align-items:center;">
      <div style="text-align:center;">
        <div style="font-size:12px;color:#94a3b8;margin-bottom:6px;">현재 방식 (회색 폰트 + 둥근 막대선)</div>
        {svg_old}
      </div>
      <div style="font-size:24px;color:#64748b;">➔</div>
      <div style="text-align:center;">
        <div style="font-size:12px;color:#38bdf8;font-weight:700;margin-bottom:6px;">요청하신 방식 (바탕 회색 폰트체 그대로 100% 일치)</div>
        {svg_mask}
      </div>
    </div>
    ''')

full_html = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body {{ background:#020617; color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,sans-serif; margin:0; padding:30px; display:flex; flex-direction:column; align-items:center; gap:20px; }}
h2 {{ margin:0 0 10px 0; color:#38bdf8; }}
</style>
</head>
<body>
<h2>비교: 현재 둥근 막대선 획순 vs 바탕 회색 폰트와 100% 동일한 글씨체 획순</h2>
{''.join(html_cards)}
</body>
</html>
'''

with open('test/test_font_mask_compare.html', 'w', encoding='utf-8') as f:
    f.write(full_html)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
screenshot_path = os.path.abspath("test/screenshot_font_mask_compare.png")
html_url = "file:///" + os.path.abspath("test/test_font_mask_compare.html").replace("\\", "/")
subprocess.run([edge_path, "--headless", "--disable-gpu", f"--screenshot={screenshot_path}", "--window-size=900,900", html_url])
print("Screenshot captured at:", screenshot_path)
