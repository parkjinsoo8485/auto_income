import json, os, subprocess

# Load font vector data
font_data = json.load(open('assets/hangul_font_vectors.json', encoding='utf-8'))

CHOS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
JUNGS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ']
JONGS = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']

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

COMPOSITE_VOWELS = {
    'ㅘ': ['ㅗ', 'ㅏ'], 'ㅙ': ['ㅗ', 'ㅐ'], 'ㅚ': ['ㅗ', 'ㅣ'],
    'ㅝ': ['ㅜ', 'ㅓ'], 'ㅞ': ['ㅜ', 'ㅔ'], 'ㅟ': ['ㅜ', 'ㅣ'],
    'ㅢ': ['ㅡ', 'ㅣ']
}

# Tightly tuned layout slots (200x200 viewBox)
def get_tuned_slots(dec):
    if not dec['isHangul'] or not dec['jung']:
        return [{'jamo': dec['cho'], 'role': 'single', 'x': 25, 'y': 25, 'w': 150, 'h': 150}]

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
            # [Type 1] 받침 없는 세로 모음 (가, 나, 다, 라, 마, 바, 사, 아, 자, 차, 카, 타, 파, 하)
            # 초성과 중성을 밀착시켜 단단하고 균형 잡힌 글자 형성
            slots.append({'jamo': cho, 'role': 'cho', 'x': 24, 'y': 24, 'w': 82, 'h': 148, 'type': 1})
            slots.append({'jamo': jung, 'role': 'jung', 'x': 102, 'y': 22, 'w': 74, 'h': 156, 'type': 1})
        else:
            # [Type 4] 받침 있는 세로 모음 (강, 날, 달, 람, 밥, 산, 앙, 장, 창, 칼, 탑, 한, 닭)
            # 상단 초성과 중성이 좌우로 컴팩트하게 붙고, 하단 종성이 전체를 받침
            slots.append({'jamo': cho, 'role': 'cho', 'x': 26, 'y': 20, 'w': 78, 'h': 76, 'type': 4})
            slots.append({'jamo': jung, 'role': 'jung', 'x': 102, 'y': 18, 'w': 72, 'h': 82, 'type': 4})
            slots.append({'jamo': jong, 'role': 'jong', 'x': 32, 'y': 100, 'w': 136, 'h': 78, 'type': 4})
    elif isHoriz:
        if not hasJong:
            # [Type 2] 받침 없는 가로 모음 (고, 노, 도, 로, 모, 보, 소, 오, 조, 초, 코, 토, 포, 호)
            # 초성이 위에 안정적으로 앉고, 가로 모음이 바로 아래에 받침 (상하 간격 최소화)
            slots.append({'jamo': cho, 'role': 'cho', 'x': 36, 'y': 22, 'w': 128, 'h': 74, 'type': 2})
            slots.append({'jamo': jung, 'role': 'jung', 'x': 22, 'y': 92, 'w': 156, 'h': 86, 'type': 2})
        else:
            # [Type 5] 받침 있는 가로 모음 (곰, 국, 눈, 돈, 록, 문, 볼, 송, 옷, 종, 총, 콩, 통, 풀, 홍)
            # 3단 층 쌓기: 초성 - 가로모음 - 종성이 매끄럽게 연결
            slots.append({'jamo': cho, 'role': 'cho', 'x': 38, 'y': 16, 'w': 124, 'h': 54, 'type': 5})
            slots.append({'jamo': jung, 'role': 'jung', 'x': 24, 'y': 68, 'w': 152, 'h': 50, 'type': 5})
            slots.append({'jamo': jong, 'role': 'jong', 'x': 34, 'y': 116, 'w': 132, 'h': 68, 'type': 5})
    else:
        # 복합 모음: ㅘ, ㅙ, ㅚ, ㅝ, ㅞ, ㅟ, ㅢ
        subH, subV = COMPOSITE_VOWELS.get(jung, ['ㅡ', 'ㅣ'])
        if not hasJong:
            # [Type 3] 받침 없는 복합 모음 (과, 궈, 귀, 의, 왜, 웨, 쇠)
            slots.append({'jamo': cho, 'role': 'cho', 'x': 26, 'y': 22, 'w': 76, 'h': 72, 'type': 3})
            slots.append({'jamo': subH, 'role': 'jung_h', 'x': 22, 'y': 92, 'w': 84, 'h': 82, 'type': 3})
            slots.append({'jamo': subV, 'role': 'jung_v', 'x': 106, 'y': 22, 'w': 70, 'h': 154, 'type': 3})
        else:
            # [Type 6] 받침 있는 복합 모음 (광, 권, 꿩, 환, 황, 괄, 괉)
            slots.append({'jamo': cho, 'role': 'cho', 'x': 28, 'y': 18, 'w': 74, 'h': 54, 'type': 6})
            slots.append({'jamo': subH, 'role': 'jung_h', 'x': 24, 'y': 70, 'w': 80, 'h': 48, 'type': 6})
            slots.append({'jamo': subV, 'role': 'jung_v', 'x': 104, 'y': 18, 'w': 68, 'h': 102, 'type': 6})
            slots.append({'jamo': jong, 'role': 'jong', 'x': 34, 'y': 120, 'w': 132, 'h': 62, 'type': 6})

    return slots

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
    dec = decompose(word)
    slots = get_tuned_slots(dec)
    
    underlay_paths = []
    slot_boxes = []
    
    for s in slots:
        glyph = get_glyph(s['role'], s['jamo'])
        if glyph:
            t = get_transform(glyph, s)
            g_path = glyph['path']
            underlay_paths.append(f'<path d="{g_path}" transform="{t}" fill="rgba(255,255,255,0.18)" />')
        sx, sy, sw, sh = s['x'], s['y'], s['w'], s['h']
        slot_boxes.append(f'<rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" fill="none" stroke="rgba(56,189,248,0.25)" stroke-dasharray="2,2"/>')

    svg_content = f'''
    <svg viewBox="0 0 200 200" width="180" height="180" style="background:#0f172a;border-radius:16px;border:1px solid #334155;">
      <!-- Grid -->
      <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      
      <!-- Slot BBoxes -->
      {''.join(slot_boxes)}

      <!-- Vector Font Underlay (Gray) -->
      <g class="vector-font-underlay">
        {''.join(underlay_paths)}
      </g>
    </svg>
    '''
    html_cards.append(f'''
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
      <div style="font-weight:800;color:#38bdf8;font-size:18px;">{word} (Type {slots[0].get('type', '-')})</div>
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
<h1>한글 6대 결합규칙 및 벡터 폰트 밑그림 테스트</h1>
{''.join(html_cards)}
</body>
</html>
'''

with open('test/test_tuned_layout.html', 'w', encoding='utf-8') as f:
    f.write(full_html)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
screenshot_path = os.path.abspath("test/screenshot_tuned_layout.png")
html_url = "file:///" + os.path.abspath("test/test_tuned_layout.html").replace("\\", "/")
subprocess.run([edge_path, "--headless", "--disable-gpu", f"--screenshot={screenshot_path}", "--window-size=1200,600", html_url])
print("Screenshot captured at:", screenshot_path)
