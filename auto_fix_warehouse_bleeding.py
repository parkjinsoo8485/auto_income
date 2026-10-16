import os
import json
import math
import re

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_DIR = os.path.join(ROOT_DIR, 'test')

JSON_PATHS = [
    os.path.join(ROOT_DIR, 'hangul_150_parts_warehouse.json'),
    os.path.join(TEST_DIR, 'hangul_150_parts_warehouse.json')
]
JS_PATHS = [
    os.path.join(ROOT_DIR, 'hangul_150_parts_warehouse.js'),
    os.path.join(TEST_DIR, 'hangul_150_parts_warehouse.js')
]

def map_subpaths_to_medians(subpaths, medians, default_outline):
    if not subpaths or not medians or len(subpaths) <= 1:
        return [default_outline] * len(medians)

    sub_infos = []
    for s in subpaths:
        nums = re.findall(r'[-+]?\d*\.?\d+', s)
        if len(nums) < 2:
            continue
        xs = [float(nums[i]) for i in range(0, len(nums), 2)]
        ys = [float(nums[i]) for i in range(1, len(nums), 2)]
        sub_infos.append({
            'minX': min(xs), 'maxX': max(xs),
            'minY': min(ys), 'maxY': max(ys),
            'path': s.strip()
        })

    if not sub_infos:
        return [default_outline] * len(medians)

    # 내부 구멍(Hole) 서브패스를 외곽 컨테이너와 합성
    components = []
    is_inner = [False] * len(sub_infos)
    for i in range(len(sub_infos)):
        for j in range(len(sub_infos)):
            if i == j:
                continue
            if (sub_infos[i]['minX'] >= sub_infos[j]['minX'] - 1 and
                sub_infos[i]['maxX'] <= sub_infos[j]['maxX'] + 1 and
                sub_infos[i]['minY'] >= sub_infos[j]['minY'] - 1 and
                sub_infos[i]['maxY'] <= sub_infos[j]['maxY'] + 1):
                is_inner[i] = True
                break

    for i in range(len(sub_infos)):
        if not is_inner[i]:
            comp_path = sub_infos[i]['path']
            for j in range(len(sub_infos)):
                if is_inner[j] and (
                    sub_infos[j]['minX'] >= sub_infos[i]['minX'] - 1 and
                    sub_infos[j]['maxX'] <= sub_infos[i]['maxX'] + 1 and
                    sub_infos[j]['minY'] >= sub_infos[i]['minY'] - 1 and
                    sub_infos[j]['maxY'] <= sub_infos[i]['maxY'] + 1):
                    comp_path += ' ' + sub_infos[j]['path']
            components.append({
                'minX': sub_infos[i]['minX'],
                'maxX': sub_infos[i]['maxX'],
                'minY': sub_infos[i]['minY'],
                'maxY': sub_infos[i]['maxY'],
                'path': comp_path
            })

    if len(components) <= 1:
        return [default_outline] * len(medians)

    result = []
    for m in medians:
        if not m:
            result.append(default_outline)
            continue
        cx = sum(p[0] for p in m) / len(m)
        cy = sum(p[1] for p in m) / len(m)

        best_dist = float('inf')
        best_path = components[0]['path']
        for comp in components:
            dx = max(0, comp['minX'] - cx, cx - comp['maxX'])
            dy = max(0, comp['minY'] - cy, cy - comp['maxY'])
            d2 = dx * dx + dy * dy
            if d2 < best_dist:
                best_dist = d2
                best_path = comp['path']
        result.append(best_path)

    return result

def separate_junction_medians(medians, safety_margin=16):
    if not medians or len(medians) <= 1:
        return medians, 0

    new_medians = [list(map(list, m)) for m in medians]
    modified_count = 0

    for i in range(len(new_medians)):
        for j in range(len(new_medians)):
            if i == j:
                continue
            mA = new_medians[i]
            mB = new_medians[j]
            if len(mA) < 2 or len(mB) < 2:
                continue

            # 케이스 1: 획 j의 시작점이 획 i의 선분과 너무 가까운 경우 (T자 접합)
            startB = mB[0]
            for s in range(len(mA) - 1):
                p1 = mA[s]
                p2 = mA[s + 1]
                dx = p2[0] - p1[0]
                dy = p2[1] - p1[1]
                l2 = dx * dx + dy * dy
                if l2 < 1e-4:
                    continue

                u = max(0.0, min(1.0, ((startB[0] - p1[0]) * dx + (startB[1] - p1[1]) * dy) / l2))
                proj = [p1[0] + u * dx, p1[1] + u * dy]
                d = math.hypot(startB[0] - proj[0], startB[1] - proj[1])

                if d < safety_margin:
                    dirB = [mB[1][0] - startB[0], mB[1][1] - startB[1]]
                    dirB_len = math.hypot(dirB[0], dirB[1])
                    if dirB_len > 1e-4:
                        shift = safety_margin - d + 4
                        mB[0] = [
                            round(startB[0] + (dirB[0] / dirB_len) * shift),
                            round(startB[1] + (dirB[1] / dirB_len) * shift)
                        ]
                        modified_count += 1

            # 케이스 2: 획 i의 끝점이 획 j의 시작점과 겹치는 경우
            endA = mA[-1]
            startB2 = mB[0]
            if math.hypot(endA[0] - startB2[0], endA[1] - startB2[1]) < safety_margin:
                prevA = mA[-2]
                dirA = [endA[0] - prevA[0], endA[1] - prevA[1]]
                dirA_len = math.hypot(dirA[0], dirA[1])
                if dirA_len > 20:
                    shift = min(12, dirA_len * 0.25)
                    mA[-1] = [
                        round(endA[0] - (dirA[0] / dirA_len) * shift),
                        round(endA[1] - (dirA[1] / dirA_len) * shift)
                    ]
                    modified_count += 1

    return new_medians, modified_count

def optimize_all_parts():
    src_json = JSON_PATHS[0]
    with open(src_json, 'r', encoding='utf-8') as f:
        data = json.load(f)

    parts = data.get('parts', {})
    total_modified = 0
    double_jongs = ['ㄳ','ㄵ','ㄶ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅄ']

    for p_id, p_data in parts.items():
        medians = p_data.get('medians', [])
        stroke_count = len(medians)
        outline = p_data.get('gungsuhOutline') or (p_data.get('strokes') and p_data['strokes'][0])
        role = p_data.get('role', '')
        char = p_data.get('char', '')
        is_double = (role == 'jong') and (char in double_jongs or len(char) > 1 or stroke_count >= 5)

        modified = False

        # 1. 서브패스 분리
        if outline and stroke_count > 1:
            subpaths = re.findall(r'M[\s\S]*?(?=M|$)', outline)
            if len(subpaths) > 1:
                separated = map_subpaths_to_medians(subpaths, medians, outline)
                if len(separated) == stroke_count and separated != p_data.get('strokes'):
                    p_data['strokes'] = separated
                    modified = True

        # 2. 접합부 분리
        if stroke_count > 1:
            new_medians, m_count = separate_junction_medians(medians, safety_margin=16)
            if m_count > 0:
                p_data['medians'] = new_medians
                medians = new_medians
                modified = True

            # 3. 안전 두께 계산
            safe_widths = []
            for s_idx, m in enumerate(medians):
                min_d = float('inf')
                for o_idx, other_m in enumerate(medians):
                    if o_idx == s_idx:
                        continue
                    for pA in m:
                        for pB in other_m:
                            d = math.hypot(pA[0] - pB[0], pA[1] - pB[1])
                            if d < min_d:
                                min_d = d
                if is_double:
                    w = max(18, min(24, round(min_d * 0.65)))
                else:
                    w = max(20, min(32, round(min_d * 0.72)))
                safe_widths.append(w)

            cur_widths = p_data.get('strokeWidths')
            if cur_widths != safe_widths:
                p_data['strokeWidths'] = safe_widths
                p_data['strokeWidth'] = safe_widths[0]
                modified = True
        else:
            # 단일 획: 36px
            if p_data.get('strokeWidths') != [36]:
                p_data['strokeWidths'] = [36]
                p_data['strokeWidth'] = 36
                modified = True

        if modified:
            total_modified += 1

    data['meta']['calibrationVersion'] = "3.3-anti-bleeding-optimized"
    data['meta']['modifiedCount'] = len(parts)

    json_str = json.dumps(data, ensure_ascii=False, indent=2)
    js_content = f"""/**
 * hangul_150_parts_warehouse.js
 * 
 * 한글 153개 자소 '궁서체 부품 창고' (획 번짐 방지 3.3 정밀 일치 데이터베이스)
 */
(function (global) {{
  'use strict';
  global.HANGUL_150_WAREHOUSE = {json_str};
}})(typeof window !== 'undefined' ? window : global);
"""

    for jp in JSON_PATHS:
        with open(jp, 'w', encoding='utf-8') as f:
            f.write(json_str)
        print(f"저장 완료: {jp}")

    for jsp in JS_PATHS:
        with open(jsp, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"저장 완료: {jsp}")

    print(f"\n총 {len(parts)}개 자소 중 {total_modified}개 자소 획 번짐 자동 최적화 완료!")

if __name__ == '__main__':
    optimize_all_parts()
