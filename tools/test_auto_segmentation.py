# -*- coding: utf-8 -*-
import sys, re, json
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

font_data = json.load(open('assets/hangul_font_vectors.json', encoding='utf-8'))
syls = font_data.get('syllables', {})

def parse_svg_subpaths(path_str):
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
                    'path': ''.join(curr_cmds),
                    'minX': min(xs), 'maxX': max(xs),
                    'minY': min(ys), 'maxY': max(ys),
                    'cx': (min(xs) + max(xs)) / 2,
                    'cy': (min(ys) + max(ys)) / 2,
                    'w': max(xs) - min(xs),
                    'h': max(ys) - min(ys)
                })
            curr_pts = []
            curr_cmds = []
    return subpaths

CHOS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
JUNGS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ']
JONGS = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']

def decompose_char(ch):
    S = ord(ch) - 0xAC00
    if S < 0 or S > 11171:
        return None
    c_idx = S // 588
    j_idx = (S % 588) // 28
    g_idx = S % 28
    return {
        'cho': CHOS[c_idx], 'choIdx': c_idx,
        'jung': JUNGS[j_idx], 'jungIdx': j_idx,
        'jong': JONGS[g_idx], 'jongIdx': g_idx,
        'hasJong': g_idx > 0
    }

for test_ch in ['가', '고', '과', '강', '곰', '광', '값', '꽃', '닭', '한']:
    if test_ch in syls:
        dec = decompose_char(test_ch)
        sp = parse_svg_subpaths(syls[test_ch]['path'])
        print(f"=== {test_ch} ({dec['cho']}+{dec['jung']}+{dec['jong']}), subpaths: {len(sp)} ===")
        for i, p in enumerate(sp):
            print(f"  [{i}] X: {p['minX']:5.1f}~{p['maxX']:5.1f} (w={p['w']:4.1f}), Y: {p['minY']:5.1f}~{p['maxY']:5.1f} (h={p['h']:4.1f}), C=({p['cx']:5.1f}, {p['cy']:5.1f})")
    else:
        print(f"=== {test_ch}: not in syllables ===")
