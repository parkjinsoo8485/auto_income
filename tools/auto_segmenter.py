# -*- coding: utf-8 -*-
import sys, re, json
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

FONT_PATH = 'assets/fonts/GowunDodum.ttf'
font = TTFont(FONT_PATH)
cmap = font.getBestCmap()
glyphSet = font.getGlyphSet()

CHOS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
JUNGS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ']
JONGS = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']

# 겹받침 분해 매핑 (1차 자음, 2차 자음)
DOUBLE_JONGS = {
    'ㄳ': ('ㄱ', 'ㅅ'), 'ㄵ': ('ㄴ', 'ㅈ'), 'ㄶ': ('ㄴ', 'ㅎ'),
    'ㄺ': ('ㄹ', 'ㄱ'), 'ㄻ': ('ㄹ', 'ㅁ'), 'ㄼ': ('ㄹ', 'ㅂ'),
    'ㄽ': ('ㄹ', 'ㅅ'), 'ㄾ': ('ㄹ', 'ㅌ'), 'ㄿ': ('ㄹ', 'ㅍ'),
    'ㅀ': ('ㄹ', 'ㅎ'), 'ㅄ': ('ㅂ', 'ㅅ'), 'ㄲ': ('ㄱ', 'ㄱ'), 'ㅆ': ('ㅅ', 'ㅅ')
}

def get_glyph_path(char):
    cp = ord(char)
    gname = cmap.get(cp)
    if not gname or gname not in glyphSet:
        return None
    glyph = glyphSet[gname]
    pen = SVGPathPen(glyphSet)
    glyph.draw(pen)
    return pen.getCommands()

def parse_subpaths(path_str):
    cmds = re.findall(r'([A-Za-z])([^A-Za-z]*)', path_str)
    subpaths = []
    curr_pts = []
    curr_cmds = []
    for cmd, args in cmds:
        curr_cmds.append(cmd + args)
        nums = [float(x) for x in re.findall(r'[-+]?[0-9]*\.?[0-9]+', args)]
        for i in range(0, len(nums), 2):
            if i + 1 < len(nums):
                curr_pts.append((nums[i], nums[i+1]))
        if cmd.upper() == 'Z':
            if curr_pts:
                xs = [p[0] for p in curr_pts]
                ys = [p[1] for p in curr_pts]
                subpaths.append({
                    'd': ''.join(curr_cmds),
                    'minX': min(xs), 'maxX': max(xs),
                    'minY': min(ys), 'maxY': max(ys),
                    'cx': (min(xs) + max(xs)) / 2.0,
                    'cy': (min(ys) + max(ys)) / 2.0,
                    'w': max(xs) - min(xs),
                    'h': max(ys) - min(ys)
                })
            curr_pts = []
            curr_cmds = []
    return subpaths

def segment_hangul(char):
    S = ord(char) - 0xAC00
    if S < 0 or S > 11171:
        return None
    c_idx = S // 588
    j_idx = (S % 588) // 28
    g_idx = S % 28
    
    cho = CHOS[c_idx]
    jung = JUNGS[j_idx]
    jong = JONGS[g_idx]
    has_jong = g_idx > 0
    
    path_str = get_glyph_path(char)
    if not path_str:
        return None
        
    subs = parse_subpaths(path_str)
    if not subs:
        return None
        
    # 전체 바운딩 박스
    total_min_y = min(s['minY'] for s in subs)
    total_max_y = max(s['maxY'] for s in subs)
    total_min_x = min(s['minX'] for s in subs)
    total_max_x = max(s['maxX'] for s in subs)
    total_h = total_max_y - total_min_y
    total_w = total_max_x - total_min_x

    # 1. 서브패스 그룹화 (외곽선 + 내부 Hole 페어링)
    # 다른 서브패스의 바운딩 박스 안에 완전히 포함되는 것은 자식(Hole)으로 병합
    parents = []
    children = []
    for i, s1 in enumerate(subs):
        is_child = False
        for j, s2 in enumerate(subs):
            if i != j:
                # s1이 s2 안에 완전히 포함되는지 체크
                if (s2['minX'] <= s1['minX'] and s1['maxX'] <= s2['maxX'] and
                    s2['minY'] <= s1['minY'] and s1['maxY'] <= s2['maxY']):
                    is_child = True
                    break
        if is_child:
            children.append(s1)
        else:
            parents.append({'main': s1, 'holes': [], 'all': [s1]})

    for c in children:
        # 가장 작은 부모에게 귀속
        best_p = None
        best_area = 1e9
        for p in parents:
            s2 = p['main']
            if (s2['minX'] <= c['minX'] and c['maxX'] <= s2['maxX'] and
                s2['minY'] <= c['minY'] and c['maxY'] <= s2['maxY']):
                area = s2['w'] * s2['h']
                if area < best_area:
                    best_area = area
                    best_p = p
        if best_p:
            best_p['holes'].append(c)
            best_p['all'].append(c)
        else:
            parents.append({'main': c, 'holes': [], 'all': [c]})

    # 각 그룹의 복합 패스 d와 중심 정보
    groups = []
    for p in parents:
        d = ''.join(item['d'] for item in p['all'])
        m = p['main']
        groups.append({
            'd': d,
            'minX': m['minX'], 'maxX': m['maxX'],
            'minY': m['minY'], 'maxY': m['maxY'],
            'cx': m['cx'], 'cy': m['cy'],
            'w': m['w'], 'h': m['h'],
            'items': p['all']
        })

    # 모음 분류 (1: 세로, 2: 가로, 3: 복합)
    # 세로 모음: ㅏ, ㅐ, ㅑ, ㅒ, ㅓ, ㅔ, ㅕ, ㅖ, ㅣ
    # 가로 모음: ㅗ, ㅛ, ㅜ, ㅠ, ㅡ
    # 복합 모음: ㅘ, ㅙ, ㅚ, ㅝ, ㅞ, ㅟ, ㅢ
    v_type = 1
    if j_idx in [8, 12, 13, 17, 18]:
        v_type = 2
    elif j_idx in [9, 10, 11, 14, 15, 16, 19]:
        v_type = 3

    jong_groups = []
    jung_groups = []
    cho_groups = []

    # ── 2. 가로 모음(ㅗ, ㅛ, ㅜ, ㅠ, ㅡ)의 절대 경계선 분리 ──
    if v_type == 2:
        # 가로막대(Horizontal stem)는 groups 중 가로폭(w)이 가장 넓은 패스
        h_bar = max(groups, key=lambda g: g['w'])
        bar_min_y = h_bar['minY']
        bar_max_y = h_bar['maxY']

        jung_groups = [h_bar]
        cho_groups = []
        jong_groups = []

        for g in groups:
            if g == h_bar:
                continue
            if has_jong and g['maxY'] <= bar_min_y + 15:
                # 가로막대 아래에 완전히 위치하는 요소 -> 종성(받침)
                jong_groups.append(g)
            elif g['minY'] >= bar_max_y - 15:
                # 가로막대 위에 완전히 위치하는 요소 -> 초성
                cho_groups.append(g)
            else:
                # 가로막대와 Y축이 겹치는 돌기 ('ㅗ'의 상단 기둥 등)
                if g['cy'] > h_bar['cy']:
                    cho_groups.append(g)
                else:
                    if has_jong:
                        jong_groups.append(g)
                    else:
                        jung_groups.append(g)

    # ── 3. 세로 모음(ㅏ, ㅐ, ㅑ, ㅒ, ㅓ, ㅔ, ㅕ, ㅖ, ㅣ)의 절대 경계선 분리 ──
    elif v_type == 1:
        # 우측 세로 기둥 후보군: 우측에 위치하며 글리프 상단(maxY > 60%)까지 연장된 요소
        jung_groups = []
        non_jung = []
        for g in groups:
            if g['cx'] > total_min_x + total_w * 0.50 and g['maxY'] > total_min_y + total_h * 0.60:
                jung_groups.append(g)
            else:
                non_jung.append(g)

        # non_jung 중에서 종성(하단)과 초성(상단) 분리
        jong_groups = []
        cho_groups = []
        if has_jong:
            jong_split_cy = total_min_y + total_h * 0.45
            for g in non_jung:
                if g['cy'] <= jong_split_cy and g['maxY'] <= total_min_y + total_h * 0.55:
                    jong_groups.append(g)
                else:
                    cho_groups.append(g)
        else:
            cho_groups = non_jung

    # ── 4. 복합 모음(ㅘ, ㅙ, ㅚ, ㅝ, ㅞ, ㅟ, ㅢ) 분리 ──
    else:
        # 우측 세로 기둥(상단 연장) + 중간 가로 요소
        jung_groups = []
        non_jung = []
        for g in groups:
            if g['cx'] > total_min_x + total_w * 0.60 and g['maxY'] > total_min_y + total_h * 0.60:
                # 우측 세로 기둥
                jung_groups.append(g)
            elif (g['cx'] > total_min_x + total_w * 0.25 and
                  g['cy'] > total_min_y + total_h * 0.25 and 
                  g['cy'] < total_min_y + total_h * 0.65 and 
                  g['w'] > total_w * 0.42):
                # 중간에 위치한 가로 요소 ('ㅗ', 'ㅜ')
                jung_groups.append(g)
            else:
                non_jung.append(g)

        jong_groups = []
        cho_groups = []
        if has_jong:
            jong_split_cy = total_min_y + total_h * 0.40
            for g in non_jung:
                if g['cy'] <= jong_split_cy and g['maxY'] <= total_min_y + total_h * 0.50:
                    jong_groups.append(g)
                else:
                    cho_groups.append(g)
        else:
            cho_groups = non_jung

    # 4. 특수 케이스: 폰트 외곽선에서 중성('ㅜ'/'ㅠ')과 종성('ㅁ'/'ㄹ'/'ㅂ' 등)이 물리적으로 합쳐진 경우
    is_unified = False
    unified_path = ""
    split_y_ratio = 0.58 # 200px 기준 약 116~120px 지점

    if has_jong and len(jong_groups) == 0:
        # 중성 그룹 중 하단(total_min_y 근처)까지 연장되어 있는 큰 서브패스가 있는지 확인
        for jg in list(jung_groups):
            if jg['minY'] <= total_min_y + 50 and jg['h'] >= total_h * 0.45:
                # 중성과 종성이 결합된 패스로 판정
                is_unified = True
                unified_path = jg['d']
                # 슬롯 구조상 중성 하단과 종성 상단 사이 분할선 계산
                # 폰트 좌표계에서 Y 분할선 (스크린 변환 시 대략 58% 지점)
                split_y_ratio = 0.58
                break

    # 종성 겹받침 정렬 (좌측 자음 -> 우측 자음)
    if len(jong_groups) > 1:
        jong_groups.sort(key=lambda g: g['cx'])

    return {
        'char': char,
        'cho': cho, 'jung': jung, 'jong': jong,
        'choPath': ''.join(g['d'] for g in cho_groups),
        'jungPath': ''.join(g['d'] for g in jung_groups),
        'jongPaths': [g['d'] for g in jong_groups],
        'choPaths': [g['d'] for g in cho_groups],
        'jungPaths': [g['d'] for g in jung_groups],
        'totalPath': path_str,
        'isUnifiedJungJong': is_unified,
        'unifiedPath': unified_path,
        'splitY_ratio': split_y_ratio,
        'counts': {
            'cho': len(cho_groups),
            'jung': len(jung_groups),
            'jong': len(jong_groups) if not is_unified else 1
        }
    }

if __name__ == '__main__':
    # 대표 15개 음절 검증
    test_list = ['가', '고', '과', '강', '곰', '광', '값', '꽃', '닭', '한', '빛', '꿈', '책', '집', '물']
    print(f"{'글자':^4} | {'초':^2} {'중':^2} {'종':^3} | {'초그룹':^5} {'중그룹':^5} {'종그룹':^5} | {'결합여부':^6} | {'결과':^4}")
    print("-" * 65)
    for ch in test_list:
        res = segment_hangul(ch)
        if res:
            c = res['counts']
            valid = (c['cho'] > 0 and c['jung'] > 0 and (not res['jong'] or c['jong'] > 0))
            mark = "OK" if valid else "FAIL"
            unif = "UNIFIED" if res['isUnifiedJungJong'] else "SEPARATE"
            print(f"{ch:^4} | {res['cho']:^2} {res['jung']:^2} {res['jong'] or '-':^3} | {c['cho']:^5} {c['jung']:^5} {c['jong']:^5} | {unif:^8} | {mark:^4}")
        else:
            print(f"{ch:^4} | NOT FOUND")
