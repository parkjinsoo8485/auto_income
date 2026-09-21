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

    # 2. 종성 분리 (has_jong 일 때)
    # 종성은 글리프 전체 Y 기준 하단에 위치함. 중심점(cy)이 전체 높이의 하위 45% 이하인 경우 종성으로 배정
    jong_split_cy = total_min_y + total_h * 0.45 if has_jong else -9999

    remaining_groups = []
    for g in groups:
        if has_jong and g['cy'] <= jong_split_cy and g['maxY'] <= total_min_y + total_h * 0.55:
            jong_groups.append(g)
        else:
            remaining_groups.append(g)

    # 3. 중성(모음) 분리
    if v_type == 1:
        # 세로 모음: 우측에 위치하는 그룹 (X_min > 초성 경계선 또는 X_cx > total_min_x + total_w * 0.6)
        jung_candidates = []
        non_jung = []
        for g in remaining_groups:
            if g['cx'] > total_min_x + total_w * 0.55 and g['h'] > total_h * 0.35:
                jung_candidates.append(g)
            else:
                non_jung.append(g)
        jung_groups = jung_candidates
        cho_groups = non_jung

    elif v_type == 2:
        # 가로 모음: 상단 초성과 하단(또는 바닥) 사이의 가로형 그룹 (w > total_w * 0.5)
        # 초성은 그 위에 위치함
        remaining_groups.sort(key=lambda g: g['cy'])
        if len(remaining_groups) >= 2:
            # 가장 가로 비율(w/h)이 크거나 가로로 넓은 것을 중성으로 선택
            jung_cand = max(remaining_groups, key=lambda g: g['w'] if g['cy'] < total_max_y - 150 else 0)
            jung_groups = [jung_cand]
            cho_groups = [g for g in remaining_groups if g != jung_cand]
        else:
            cho_groups = remaining_groups

    else:
        # 복합 모음: 우측 세로 요소 + 중앙 가로 요소
        remaining_groups.sort(key=lambda g: g['cx'])
        jung_cands = []
        cho_cands = []
        for g in remaining_groups:
            # 우측 끝자락 세로획
            if g['cx'] > total_min_x + total_w * 0.65 and g['h'] > total_h * 0.35:
                jung_cands.append(g)
            elif g['cy'] < total_min_y + total_h * 0.60 and g['w'] > total_w * 0.40:
                # 아래쪽에 깔린 가로 요소
                jung_cands.append(g)
            else:
                cho_cands.append(g)
        jung_groups = jung_cands
        cho_groups = cho_cands

    # 종성 겹받침 정렬 (좌측 자음 -> 우측 자음)
    if len(jong_groups) > 1:
        jong_groups.sort(key=lambda g: g['cx'])

    return {
        'char': char,
        'cho': cho, 'jung': jung, 'jong': jong,
        'choPath': ''.join(g['d'] for g in cho_groups),
        'jungPath': ''.join(g['d'] for g in jung_groups),
        'jongPaths': [g['d'] for g in jong_groups],
        'totalPath': path_str,
        'counts': {
            'cho': len(cho_groups),
            'jung': len(jung_groups),
            'jong': len(jong_groups)
        }
    }

# 검증
test_list = ['가', '고', '과', '강', '곰', '광', '값', '꽃', '닭', '한', '빛', '꿈', '책', '집']
print(f"{'글자':^4} | {'초':^2} {'중':^2} {'종':^3} | {'초그룹':^5} {'중그룹':^5} {'종그룹':^5} | {'결과':^4}")
print("-" * 50)
for ch in test_list:
    res = segment_hangul(ch)
    if res:
        c = res['counts']
        valid = (c['cho'] > 0 and c['jung'] > 0 and (not res['jong'] or c['jong'] > 0))
        mark = "OK" if valid else "FAIL"
        print(f"{ch:^4} | {res['cho']:^2} {res['jung']:^2} {res['jong'] or '-':^3} | {c['cho']:^5} {c['jung']:^5} {c['jong']:^5} | {mark:^4}")
    else:
        print(f"{ch:^4} | NOT FOUND")
