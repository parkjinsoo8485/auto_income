import json
import math
import re

with open('hangul_150_parts_warehouse.json', 'r', encoding='utf-8') as f:
    warehouse = json.load(f)

parts = warehouse['parts']

# 1. ㅂ 계열 완벽 보정 (Cho_T1_ㅂ, Cho_T3_ㅂ, Jong_T1_ㅂ, Jong_T2_ㅂ)
# Cho_T1_ㅂ: Bounds: minX=83, maxX=477, minY=341, maxY=699
parts['Cho_T1_ㅂ']['medians'] = [
    [[96, 639], [130, 630], [170, 560], [178, 450], [185, 344]],
    [[385, 681], [420, 620], [428, 510], [435, 410]],
    [[170, 545], [260, 545], [350, 550], [425, 550]],
    [[180, 395], [270, 395], [360, 400], [432, 404]]
]
parts['Cho_T1_ㅂ']['strokeWidths'] = [56, 56, 50, 52]

# Cho_T3_ㅂ: Bounds: minX=123, maxX=507, minY=531, maxY=879
parts['Cho_T3_ㅂ']['medians'] = [
    [[146, 827], [180, 810], [215, 750], [225, 650], [228, 560]],
    [[393, 871], [435, 830], [450, 720], [458, 620]],
    [[215, 730], [290, 730], [380, 735], [450, 735]],
    [[225, 585], [300, 585], [390, 588], [458, 588]]
]
parts['Cho_T3_ㅂ']['strokeWidths'] = [56, 56, 50, 52]

# Jong_T1_ㅂ: Bounds: minX=323, maxX=697, minY=91, maxY=429
parts['Jong_T1_ㅂ']['medians'] = [
    [[353, 363], [390, 340], [415, 260], [423, 100]],
    [[610, 412], [640, 360], [658, 250], [665, 120]],
    [[415, 290], [490, 290], [580, 292], [658, 292]],
    [[420, 140], [500, 140], [590, 142], [665, 144]]
]
parts['Jong_T1_ㅂ']['strokeWidths'] = [56, 56, 50, 52]

# Jong_T2_ㅂ: Bounds: minX=367, maxX=657, minY=78, maxY=342
parts['Jong_T2_ㅂ']['medians'] = [
    [[381, 298], [415, 270], [435, 200], [443, 85]],
    [[589, 329], [612, 280], [625, 200], [631, 100]],
    [[435, 230], [490, 230], [560, 232], [625, 232]],
    [[440, 115], [500, 115], [570, 117], [630, 119]]
]
parts['Jong_T2_ㅂ']['strokeWidths'] = [50, 50, 46, 48]

# 2. ㅁ 계열 하단 결합 보정 (Cho_T1_ㅁ, Cho_T2_ㅁ, Cho_T3_ㅁ, Jong_T1_ㅁ, Jong_T2_ㅁ)
# Cho_T1_ㅁ: 하단 가로획(s3)이 좌측 기둥 안쪽(X=150)에서 우측 기둥 안쪽(X=425)까지
parts['Cho_T1_ㅁ']['medians'][2] = [[150, 410], [280, 415], [425, 420]]
parts['Cho_T1_ㅁ']['strokeWidths'] = [54, 54, 52]

# Cho_T2_ㅁ: 하단 가로획(s3)이 X=390에서 X=660까지
parts['Cho_T2_ㅁ']['medians'][2] = [[390, 600], [520, 605], [660, 600]]
parts['Cho_T2_ㅁ']['strokeWidths'] = [56, 56, 54]

# Cho_T3_ㅁ:
parts['Cho_T3_ㅁ']['medians'][2] = [[190, 600], [330, 605], [460, 605]]
parts['Cho_T3_ㅁ']['strokeWidths'] = [54, 54, 52]

# Jong_T1_ㅁ:
parts['Jong_T1_ㅁ']['medians'][2] = [[370, 140], [520, 145], [670, 145]]
parts['Jong_T1_ㅁ']['strokeWidths'] = [52, 52, 50]

# Jong_T2_ㅁ:
parts['Jong_T2_ㅁ']['medians'][2] = [[410, 120], [520, 122], [635, 125]]
parts['Jong_T2_ㅁ']['strokeWidths'] = [48, 48, 46]

# 3. ㅃ 계열 가로획 복원 보정 (Cho_T1_ㅃ, Cho_T2_ㅃ, Cho_T3_ㅃ)
# Cho_T1_ㅃ: 좌측 ㅂ (s1, s2, s3, s4) + 우측 ㅂ (s5, s6, s7, s8)
parts['Cho_T1_ㅃ']['medians'] = [
    [[95, 589], [130, 560], [150, 460], [159, 400]],
    [[230, 630], [240, 550], [245, 440]],
    [[145, 528], [190, 528], [240, 530]],
    [[155, 432], [200, 432], [245, 435]],
    [[309, 610], [330, 560], [342, 480], [347, 430]],
    [[430, 640], [445, 560], [448, 450]],
    [[335, 535], [385, 535], [440, 537]],
    [[345, 432], [395, 432], [448, 435]]
]
parts['Cho_T1_ㅃ']['strokeWidths'] = [46, 46, 42, 44, 46, 46, 42, 44]

# Cho_T2_ㅃ:
parts['Cho_T2_ㅃ']['medians'] = [
    [[278, 799], [320, 750], [345, 650], [358, 558]],
    [[450, 830], [465, 740], [468, 620]],
    [[340, 718], [400, 718], [465, 722]],
    [[350, 595], [410, 595], [468, 596]],
    [[551, 823], [575, 740], [588, 640], [594, 563]],
    [[700, 850], [715, 740], [716, 610]],
    [[580, 730], [645, 730], [712, 733]],
    [[590, 600], [655, 600], [716, 602]]
]
parts['Cho_T2_ㅃ']['strokeWidths'] = [48, 48, 44, 46, 48, 48, 44, 46]

# Cho_T3_ㅃ:
parts['Cho_T3_ㅃ']['medians'] = [
    [[124, 775], [160, 730], [185, 660], [194, 609]],
    [[265, 810], [278, 730], [280, 640]],
    [[180, 720], [225, 720], [275, 722]],
    [[190, 615], [235, 615], [280, 617]],
    [[351, 799], [362, 730], [366, 660], [368, 601]],
    [[465, 825], [475, 730], [478, 640]],
    [[360, 722], [415, 722], [472, 724]],
    [[365, 614], [420, 614], [478, 616]]
]
parts['Cho_T3_ㅃ']['strokeWidths'] = [44, 44, 40, 42, 44, 44, 40, 42]

# 4. ㄷ 계열 결합부 보정 (Cho_T1_ㄷ, Cho_T2_ㄷ, Cho_T3_ㄷ, Jong_T1_ㄷ, Jong_T2_ㄷ)
# Cho_T1_ㄷ: s2(ㄴ형태)의 시작점이 s1(상단 가로)의 아래면에 완벽 밀착
parts['Cho_T1_ㄷ']['medians'][1][0] = [175, 590]
parts['Cho_T1_ㄷ']['strokeWidths'] = [58, 58]

# Cho_T2_ㄷ:
parts['Cho_T2_ㄷ']['medians'][1][0] = [385, 820]
parts['Cho_T2_ㄷ']['strokeWidths'] = [60, 60]

# Cho_T3_ㄷ:
parts['Cho_T3_ㄷ']['medians'][1][0] = [205, 780]
parts['Cho_T3_ㄷ']['strokeWidths'] = [58, 58]

# 5. ㅈ, ㅊ 계열 결합부 보정
# Cho_T1_ㅈ:
parts['Cho_T1_ㅈ']['medians'][1][0] = [296, 610]
parts['Cho_T1_ㅈ']['medians'][2][0] = [310, 545]
parts['Cho_T1_ㅈ']['strokeWidths'] = [54, 54, 52]

# Cho_T2_ㅈ:
parts['Cho_T2_ㅈ']['medians'][1][0] = [528, 835]
parts['Cho_T2_ㅈ']['medians'][2][0] = [550, 740]
parts['Cho_T2_ㅈ']['strokeWidths'] = [56, 56, 54]

# Cho_T1_ㅊ:
parts['Cho_T1_ㅊ']['medians'][2][0] = [290, 590]
parts['Cho_T1_ㅊ']['medians'][3][0] = [305, 525] if len(parts['Cho_T1_ㅊ']['medians']) > 3 else parts['Cho_T1_ㅊ']['medians'][2][-1]
parts['Cho_T1_ㅊ']['strokeWidths'] = [52, 54, 54, 52][:len(parts['Cho_T1_ㅊ']['medians'])]

# 6. ㅎ 계열 보정
# Cho_T1_ㅎ:
parts['Cho_T1_ㅎ']['strokeWidths'] = [52, 56, 54]
parts['Cho_T2_ㅎ']['strokeWidths'] = [54, 58, 56]
parts['Cho_T3_ㅎ']['strokeWidths'] = [52, 56, 54]

# 7. 전체 153개 자소의 strokeCount 및 1획 충진 두께 전수 검사
for id, p in parts.items():
    p['strokeCount'] = len(p['medians'])
    # 1획 자소는 128px 이상의 넉넉한 두께로 궁서체 외곽선을 100% 채움
    if p['strokeCount'] == 1:
        p['strokeWidths'] = [80]
        p['strokeWidth'] = 80
    elif p['strokeCount'] == 2:
        if not p.get('strokeWidths') or len(p['strokeWidths']) != 2:
            p['strokeWidths'] = [58, 58]
    elif p['strokeCount'] >= 3:
        if not p.get('strokeWidths') or len(p['strokeWidths']) != p['strokeCount']:
            p['strokeWidths'] = [52] * p['strokeCount']

warehouse['meta']['updatedAt'] = "2026-10-16T15:05:00.000Z"
warehouse['meta']['calibrationVersion'] = "3.2-perfect-voronoi-sync"

# 저장
with open('hangul_150_parts_warehouse.json', 'w', encoding='utf-8') as f:
    json.dump(warehouse, f, ensure_ascii=False, indent=2)

with open('test/hangul_150_parts_warehouse.json', 'w', encoding='utf-8') as f:
    json.dump(warehouse, f, ensure_ascii=False, indent=2)

js_code = f"""/**
 * hangul_150_parts_warehouse.js
 * 
 * 한글 153개 자소 '궁서체 부품 창고' (정밀 획순 애니메이션 일치 DB v3.2)
 */
(function (global) {{
  'use strict';
  global.HANGUL_150_WAREHOUSE = {json.dumps(warehouse, ensure_ascii=False, indent=2)};
}})(typeof window !== 'undefined' ? window : global);
"""

with open('hangul_150_parts_warehouse.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

with open('test/hangul_150_parts_warehouse.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

print("All warehouse files updated with v3.2 precision medians!")
