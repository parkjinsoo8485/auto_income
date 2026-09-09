import json, os, subprocess

font_data = json.load(open('assets/hangul_font_vectors.json', encoding='utf-8'))

CHOS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
JUNGS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ']
JONGS = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']

DOUBLE_JONGS = {
  'ㄳ': ['ㄱ','ㅅ'], 'ㄵ': ['ㄴ','ㅈ'], 'ㄶ': ['ㄴ','ㅎ'],
  'ㄺ': ['ㄹ','ㄱ'], 'ㄻ': ['ㄹ','ㅁ'], 'ㄼ': ['ㄹ','ㅂ'],
  'ㄽ': ['ㄹ','ㅅ'], 'ㄾ': ['ㄹ','ㅌ'], 'ㄿ': ['ㄹ','ㅍ'],
  'ㅀ': ['ㄹ','ㅎ'], 'ㅄ': ['ㅂ','ㅅ'],
  'ㄲ': ['ㄱ','ㄱ'], 'ㅆ': ['ㅅ','ㅅ']
}

COMPOSITE_VOWELS = {
    'ㅘ': ['ㅗ', 'ㅏ'], 'ㅙ': ['ㅗ', 'ㅐ'], 'ㅚ': ['ㅗ', 'ㅣ'],
    'ㅝ': ['ㅜ', 'ㅓ'], 'ㅞ': ['ㅜ', 'ㅔ'], 'ㅟ': ['ㅜ', 'ㅣ'],
    'ㅢ': ['ㅡ', 'ㅣ']
}

# Fine-tuned Stroke Database (0~100 normalized) to match NanumGothic glyph stems
STROKE_DB = {
    'ㄱ': [
      {'d': 'M 18,22 L 82,22 L 82,85', 'desc': '1획: 가로 후 세로 꺾임'}
    ],
    'ㄲ': [
      {'d': 'M 14,22 L 46,22 L 46,82', 'desc': '1획: 앞 ㄱ'},
      {'d': 'M 54,22 L 86,22 L 86,82', 'desc': '2획: 뒤 ㄱ'}
    ],
    'ㄴ': [
      {'d': 'M 24,18 L 24,80 L 86,80', 'desc': '1획: 세로 후 가로'}
    ],
    'ㄷ': [
      {'d': 'M 18,22 L 84,22',         'desc': '1획: 위 가로'},
      {'d': 'M 22,22 L 22,82 L 86,82', 'desc': '2획: 세로 후 아래 가로'}
    ],
    'ㄸ': [
      {'d': 'M 10,22 L 46,22',         'desc': '1획: 앞 ㄷ 위'},
      {'d': 'M 14,22 L 14,82 L 46,82', 'desc': '2획: 앞 ㄷ 아래'},
      {'d': 'M 54,22 L 90,22',         'desc': '3획: 뒤 ㄷ 위'},
      {'d': 'M 58,22 L 58,82 L 90,82', 'desc': '4획: 뒤 ㄷ 아래'}
    ],
    'ㄹ': [
      {'d': 'M 20,20 L 82,20 L 82,48', 'desc': '1획: ㄱ'},
      {'d': 'M 20,48 L 82,48',         'desc': '2획: 중간 가로'},
      {'d': 'M 20,48 L 20,82 L 86,82', 'desc': '3획: ㄴ'}
    ],
    'ㅁ': [
      {'d': 'M 22,18 L 22,84',         'desc': '1획: 왼 세로'},
      {'d': 'M 22,20 L 82,20 L 82,84', 'desc': '2획: 위 가로 후 오른 세로'},
      {'d': 'M 20,82 L 84,82',         'desc': '3획: 아래 가로'}
    ],
    'ㅂ': [
      {'d': 'M 24,18 L 24,82', 'desc': '1획: 왼 세로'},
      {'d': 'M 78,18 L 78,82', 'desc': '2획: 오른 세로'},
      {'d': 'M 22,50 L 80,50', 'desc': '3획: 중간 가로'},
      {'d': 'M 22,82 L 80,82', 'desc': '4획: 아래 가로'}
    ],
    'ㅃ': [
      {'d': 'M 12,18 L 12,82', 'desc': '1획: 앞 ㅂ 왼 세로'},
      {'d': 'M 44,18 L 44,82', 'desc': '2획: 앞 ㅂ 오른 세로'},
      {'d': 'M 10,50 L 46,50', 'desc': '3획: 앞 ㅂ 중간 가로'},
      {'d': 'M 10,82 L 46,82', 'desc': '4획: 앞 ㅂ 아래 가로'},
      {'d': 'M 56,18 L 56,82', 'desc': '5획: 뒤 ㅂ 왼 세로'},
      {'d': 'M 88,18 L 88,82', 'desc': '6획: 뒤 ㅂ 오른 세로'},
      {'d': 'M 54,50 L 90,50', 'desc': '7획: 뒤 ㅂ 중간 가로'},
      {'d': 'M 54,82 L 90,82', 'desc': '8획: 뒤 ㅂ 아래 가로'}
    ],
    'ㅅ': [
      {'d': 'M 50,18 L 18,84', 'desc': '1획: 왼 사선'},
      {'d': 'M 44,44 L 84,84', 'desc': '2획: 오른 사선'}
    ],
    'ㅆ': [
      {'d': 'M 32,18 L 10,82', 'desc': '1획: 앞 ㅅ 왼 사선'},
      {'d': 'M 28,44 L 46,82', 'desc': '2획: 앞 ㅅ 오른 사선'},
      {'d': 'M 70,18 L 52,82', 'desc': '3획: 뒤 ㅅ 왼 사선'},
      {'d': 'M 66,44 L 90,82', 'desc': '4획: 뒤 ㅅ 오른 사선'}
    ],
    'ㅇ': [
      {'d': 'M 50,16 C 30,16 16,31 16,50 C 16,69 30,84 50,84 C 70,84 84,69 84,50 C 84,31 70,16 50,16 Z', 'desc': '1획: 반시계 방향 원'}
    ],
    'ㅈ': [
      {'d': 'M 18,22 L 82,22 L 50,56 L 18,84', 'desc': '1획: 가로 후 왼 사선'},
      {'d': 'M 48,50 L 84,84',                 'desc': '2획: 오른 사선'}
    ],
    'ㅉ': [
      {'d': 'M 10,22 L 46,22 L 28,52 L 10,82', 'desc': '1획: 앞 ㅈ 꺾임'},
      {'d': 'M 26,48 L 46,82',                 'desc': '2획: 앞 ㅈ 오른 사선'},
      {'d': 'M 54,22 L 90,22 L 72,52 L 54,82', 'desc': '3획: 뒤 ㅈ 꺾임'},
      {'d': 'M 70,48 L 90,82',                 'desc': '4획: 뒤 ㅈ 오른 사선'}
    ],
    'ㅊ': [
      {'d': 'M 36,12 L 64,12',                 'desc': '1획: 꼭지 점획'},
      {'d': 'M 18,30 L 82,30 L 50,60 L 18,85', 'desc': '2획: 가로 후 왼 사선'},
      {'d': 'M 48,54 L 84,85',                 'desc': '3획: 오른 사선'}
    ],
    'ㅋ': [
      {'d': 'M 18,20 L 82,20 L 82,84', 'desc': '1획: ㄱ'},
      {'d': 'M 18,50 L 80,50',         'desc': '2획: 중간 가로'}
    ],
    'ㅌ': [
      {'d': 'M 18,20 L 84,20',         'desc': '1획: 상 가로'},
      {'d': 'M 18,50 L 80,50',         'desc': '2획: 중 가로'},
      {'d': 'M 22,20 L 22,82 L 86,82', 'desc': '3획: 세로 후 하 가로'}
    ],
    'ㅍ': [
      {'d': 'M 18,25 L 84,25', 'desc': '1획: 위 가로'},
      {'d': 'M 36,25 L 36,80', 'desc': '2획: 왼 세로'},
      {'d': 'M 64,25 L 64,80', 'desc': '3획: 오른 세로'},
      {'d': 'M 16,80 L 86,80', 'desc': '4획: 아래 가로'}
    ],
    'ㅎ': [
      {'d': 'M 36,14 L 64,14', 'desc': '1획: 꼭지 점획'},
      {'d': 'M 18,30 L 82,30', 'desc': '2획: 가로'},
      {'d': 'M 50,44 C 34,44 22,55 22,70 C 22,85 34,94 50,94 C 66,94 78,85 78,70 C 78,55 66,44 50,44 Z', 'desc': '3획: 원'}
    ],

    # 모음 (세로 모음의 기둥 stem을 NanumGothic 비례에 맞춰 x=46~50으로 정밀 조정)
    'ㅏ': [
      {'d': 'M 46,14 L 46,86', 'desc': '1획: 세로'},
      {'d': 'M 46,50 L 86,50', 'desc': '2획: 가로'}
    ],
    'ㅐ': [
      {'d': 'M 32,14 L 32,86', 'desc': '1획: 왼 세로'},
      {'d': 'M 32,50 L 68,50', 'desc': '2획: 중간 가로'},
      {'d': 'M 68,14 L 68,86', 'desc': '3획: 오른 세로'}
    ],
    'ㅑ': [
      {'d': 'M 46,14 L 46,86', 'desc': '1획: 세로'},
      {'d': 'M 46,36 L 86,36', 'desc': '2획: 위 가로'},
      {'d': 'M 46,62 L 86,62', 'desc': '3획: 아래 가로'}
    ],
    'ㅒ': [
      {'d': 'M 32,14 L 32,86', 'desc': '1획: 왼 세로'},
      {'d': 'M 32,36 L 68,36', 'desc': '2획: 위 가로'},
      {'d': 'M 32,62 L 68,62', 'desc': '3획: 아래 가로'},
      {'d': 'M 68,14 L 68,86', 'desc': '4획: 오른 세로'}
    ],
    'ㅓ': [
      {'d': 'M 16,50 L 54,50', 'desc': '1획: 가로'},
      {'d': 'M 54,14 L 54,86', 'desc': '2획: 세로'}
    ],
    'ㅔ': [
      {'d': 'M 26,50 L 58,50', 'desc': '1획: 가로'},
      {'d': 'M 58,14 L 58,86', 'desc': '2획: 왼 세로'},
      {'d': 'M 80,14 L 80,86', 'desc': '3획: 오른 세로'}
    ],
    'ㅕ': [
      {'d': 'M 16,36 L 54,36', 'desc': '1획: 위 가로'},
      {'d': 'M 16,62 L 54,62', 'desc': '2획: 아래 가로'},
      {'d': 'M 54,14 L 54,86', 'desc': '3획: 세로'}
    ],
    'ㅖ': [
      {'d': 'M 26,36 L 58,36', 'desc': '1획: 위 가로'},
      {'d': 'M 26,62 L 58,62', 'desc': '2획: 아래 가로'},
      {'d': 'M 58,14 L 58,86', 'desc': '3획: 왼 세로'},
      {'d': 'M 80,14 L 80,86', 'desc': '4획: 오른 세로'}
    ],
    'ㅗ': [
      {'d': 'M 50,18 L 50,62', 'desc': '1획: 세로'},
      {'d': 'M 14,62 L 86,62', 'desc': '2획: 가로'}
    ],
    'ㅛ': [
      {'d': 'M 36,18 L 36,62', 'desc': '1획: 왼 세로'},
      {'d': 'M 64,18 L 64,62', 'desc': '2획: 오른 세로'},
      {'d': 'M 14,62 L 86,62', 'desc': '3획: 가로'}
    ],
    'ㅜ': [
      {'d': 'M 14,40 L 86,40', 'desc': '1획: 가로'},
      {'d': 'M 50,40 L 50,84', 'desc': '2획: 세로'}
    ],
    'ㅠ': [
      {'d': 'M 14,40 L 86,40', 'desc': '1획: 가로'},
      {'d': 'M 36,40 L 36,84', 'desc': '2획: 왼 세로'},
      {'d': 'M 64,40 L 64,84', 'desc': '3획: 오른 세로'}
    ],
    'ㅡ': [
      {'d': 'M 14,50 L 86,50', 'desc': '1획: 가로'}
    ],
    'ㅣ': [
      {'d': 'M 50,14 L 50,86', 'desc': '1획: 세로'}
    ]
}

def decompose_char(ch):
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
    if not dec['isHangul'] or not dec['jung']:
        return [{'jamo': dec['cho'], 'role': 'single', 'x': 25, 'y': 25, 'w': 150, 'h': 150, 'type': 0}]

    cho = dec['cho']
    jung = dec['jung']
    jong = dec['jong']
    jungIdx = dec['jungIdx']
    hasJong = bool(jong)

    isVert = jungIdx in [0, 1, 2, 3, 4, 5, 6, 7, 20] # ㅏ,ㅐ,ㅑ,ㅒ,ㅓ,ㅔ,ㅕ,ㅖ,ㅣ
    isHoriz = jungIdx in [8, 12, 13, 17, 18]         # ㅗ,ㅛ,ㅜ,ㅠ,ㅡ

    slots = []
    if isVert:
        if not hasJong:
            # Type 1: 받침 없는 세로 모음 (가, 나, 다)
            slots.append({'jamo': cho, 'role': 'cho', 'x': 26, 'y': 25, 'w': 74, 'h': 146, 'type': 1})
            slots.append({'jamo': jung, 'role': 'jung', 'x': 104, 'y': 22, 'w': 72, 'h': 154, 'type': 1})
        else:
            # Type 4: 받침 있는 세로 모음 (강, 날, 달, 한, 닭)
            slots.append({'jamo': cho, 'role': 'cho', 'x': 28, 'y': 20, 'w': 72, 'h': 76, 'type': 4})
            slots.append({'jamo': jung, 'role': 'jung', 'x': 104, 'y': 18, 'w': 70, 'h': 82, 'type': 4})
            slots.append({'jamo': jong, 'role': 'jong', 'x': 32, 'y': 100, 'w': 136, 'h': 76, 'type': 4})
    elif isHoriz:
        if not hasJong:
            # Type 2: 받침 없는 가로 모음 (고, 노, 도)
            slots.append({'jamo': cho, 'role': 'cho', 'x': 36, 'y': 22, 'w': 128, 'h': 72, 'type': 2})
            slots.append({'jamo': jung, 'role': 'jung', 'x': 22, 'y': 92, 'w': 156, 'h': 86, 'type': 2})
        else:
            # Type 5: 받침 있는 가로 모음 (곰, 국, 눈, 꽃, 물)
            slots.append({'jamo': cho, 'role': 'cho', 'x': 38, 'y': 16, 'w': 124, 'h': 54, 'type': 5})
            slots.append({'jamo': jung, 'role': 'jung', 'x': 24, 'y': 68, 'w': 152, 'h': 48, 'type': 5})
            slots.append({'jamo': jong, 'role': 'jong', 'x': 34, 'y': 116, 'w': 132, 'h': 68, 'type': 5})
    else:
        # Type 3 & 6: 복합 모음 (과, 광)
        subH, subV = COMPOSITE_VOWELS.get(jung, ['ㅡ', 'ㅣ'])
        if not hasJong:
            slots.append({'jamo': cho, 'role': 'cho', 'x': 26, 'y': 22, 'w': 74, 'h': 72, 'type': 3})
            slots.append({'jamo': subH, 'role': 'jung_h', 'x': 22, 'y': 92, 'w': 84, 'h': 82, 'type': 3})
            slots.append({'jamo': subV, 'role': 'jung_v', 'x': 104, 'y': 22, 'w': 70, 'h': 154, 'type': 3})
        else:
            slots.append({'jamo': cho, 'role': 'cho', 'x': 28, 'y': 18, 'w': 72, 'h': 54, 'type': 6})
            slots.append({'jamo': subH, 'role': 'jung_h', 'x': 24, 'y': 70, 'w': 78, 'h': 48, 'type': 6})
            slots.append({'jamo': subV, 'role': 'jung_v', 'x': 104, 'y': 18, 'w': 68, 'h': 102, 'type': 6})
            slots.append({'jamo': jong, 'role': 'jong', 'x': 34, 'y': 120, 'w': 132, 'h': 62, 'type': 6})

    return slots

def transform_path(d, sx, sy, sw, sh):
    import re
    is_x = [True]
    def repl(m):
        val = float(m.group(0))
        if is_x[0]:
            res = sx + (val / 100.0) * sw
        else:
            res = sy + (val / 100.0) * sh
        is_x[0] = not is_x[0]
        return f"{res:.1f}"
    return re.sub(r'[+-]?\d+\.?\d*', repl, d)

PALETTE = ['#38bdf8', '#818cf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399', '#f87171', '#c084fc', '#2dd4bf', '#fb923c', '#e879f9']

def get_glyph(role, jamo):
    if role == 'cho':
        return font_data['choseong'].get(jamo) or font_data['jamo'].get(jamo)
    elif role in ['jung', 'jung_h', 'jung_v']:
        return font_data['jungseong'].get(jamo) or font_data['jamo'].get(jamo)
    elif role == 'jong':
        return font_data['jongseong'].get(jamo) or font_data['jamo'].get(jamo)
    return font_data['jamo'].get(jamo)

def get_transform(glyph, slot):
    minX, minY, maxX, maxY = glyph['bbox']
    bw = maxX - minX or 1
    bh = maxY - minY or 1
    sx = slot['w'] / bw
    sy = -slot['h'] / bh
    tx = slot['x'] - minX * sx
    ty = slot['y'] - maxY * sy
    return f"matrix({sx:.5f} 0 0 {sy:.5f} {tx:.3f} {ty:.3f})"

test_words = ['가', '고', '과', '강', '곰', '광', '닭', '한', '꽃', '물']
html_cards = []

for word in test_words:
    dec = decompose_char(word)
    slots = get_slots(dec)
    
    underlay_paths = []
    stroke_paths = []
    marker_elements = []
    
    stroke_idx = 0
    
    for s in slots:
        # 1. Underlay Vector Font Path
        glyph = get_glyph(s['role'], s['jamo'])
        if glyph:
            t = get_transform(glyph, s)
            g_path = glyph['path']
            underlay_paths.append(f'<path d="{g_path}" transform="{t}" fill="rgba(255,255,255,0.14)" />')
        
        # 2. Stroke Paths
        jamo_list = [s['jamo']]
        if DOUBLE_JONGS.get(s['jamo']):
            jamo_list = DOUBLE_JONGS[s['jamo']]
            
        for sub_idx, j in enumerate(jamo_list):
            sx, sy, sw, sh = s['x'], s['y'], s['w'], s['h']
            if len(jamo_list) > 1:
                sw = s['w'] * 0.48
                sx = s['x'] if sub_idx == 0 else s['x'] + s['w'] * 0.52
                
            raw_strokes = STROKE_DB.get(j, [])
            for st in raw_strokes:
                col = PALETTE[stroke_idx % len(PALETTE)]
                t_path = transform_path(st['d'], sx, sy, sw, sh)
                stroke_paths.append(f'<path d="{t_path}" stroke="{col}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/>')
                
                coords = [float(x) for x in t_path.replace('M',' ').replace('L',' ').replace('C',' ').replace('Z',' ').replace(',',' ').split() if x]
                if coords:
                    bx, by = coords[0], coords[1]
                    marker_elements.append(f'''
                    <g>
                      <circle cx="{bx}" cy="{by}" r="7.5" fill="#0f172a" stroke="{col}" stroke-width="2"/>
                      <text x="{bx}" y="{by}" fill="{col}" font-size="8.5" font-weight="900" text-anchor="middle" dominant-baseline="central" font-family="sans-serif">{stroke_idx + 1}</text>
                    </g>
                    ''')
                stroke_idx += 1

    svg_content = f'''
    <svg viewBox="0 0 200 200" width="180" height="180" style="background:#0f172a;border-radius:16px;border:1px solid #334155;">
      <!-- Grid -->
      <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>

      <!-- Vector Font Underlay (Gray Font Vector Data) -->
      <g class="vector-font-underlay">
        {''.join(underlay_paths)}
      </g>
      
      <!-- Colored Stroke Lines -->
      <g class="stroke-lines">
        {''.join(stroke_paths)}
      </g>

      <!-- Number Badges -->
      <g class="stroke-numbers">
        {''.join(marker_elements)}
      </g>
    </svg>
    '''
    html_cards.append(f'''
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
      <div style="font-weight:800;color:#38bdf8;font-size:18px;">{word} ({stroke_idx}획)</div>
      {svg_content}
    </div>
    ''')

full_html = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body {{ background:#020617; color:#f8fafc; font-family:sans-serif; margin:0; padding:24px; display:flex; flex-wrap:wrap; gap:20px; justify-content:center; }}
h1 {{ width:100%; text-align:center; color:#38bdf8; margin-bottom:16px; }}
</style>
</head>
<body>
<h1>한글 6대 결합규칙 + 회색 폰트 벡터 밑그림 + 획순 정밀 튜닝</h1>
{''.join(html_cards)}
</body>
</html>
'''

with open('test/test_strokes_with_underlay2.html', 'w', encoding='utf-8') as f:
    f.write(full_html)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
screenshot_path = os.path.abspath("test/screenshot_strokes_underlay2.png")
html_url = "file:///" + os.path.abspath("test/test_strokes_with_underlay2.html").replace("\\", "/")
subprocess.run([edge_path, "--headless", "--disable-gpu", f"--screenshot={screenshot_path}", "--window-size=1200,600", html_url])
print("Screenshot captured at:", screenshot_path)
