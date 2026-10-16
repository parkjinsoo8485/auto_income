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

def sort_points_nn(median):
    """시작점을 고정한 후 연속 최근접 이웃(NN) 체이닝으로 점들을 순서대로 정렬"""
    if not median or len(median) <= 2:
        return median
    unvisited = list(median[1:])
    sorted_pts = [median[0]]
    while unvisited:
        cur = sorted_pts[-1]
        best_idx = min(range(len(unvisited)), key=lambda i: math.hypot(cur[0]-unvisited[i][0], cur[1]-unvisited[i][1]))
        sorted_pts.append(unvisited.pop(best_idx))
    return sorted_pts

def run_point_alignment():
    with open(JSON_PATHS[0], 'r', encoding='utf-8') as f:
        data = json.load(f)

    parts = data.get('parts', {})
    reordered_count = 0

    for pid, p in parts.items():
        medians = p.get('medians', [])
        part_modified = False
        new_medians = []
        for s_idx, m in enumerate(medians):
            if len(m) > 2:
                # 원래 길이 vs 정렬 후 길이
                orig_len = sum(math.hypot(m[i+1][0]-m[i][0], m[i+1][1]-m[i][1]) for i in range(len(m)-1))
                sorted_m = sort_points_nn(m)
                sorted_len = sum(math.hypot(sorted_m[i+1][0]-sorted_m[i][0], sorted_m[i+1][1]-sorted_m[i][1]) for i in range(len(sorted_m)-1))
                
                # 길이가 단축되거나 순서가 바뀌었으면 교정
                if sorted_len < orig_len - 1.0 or sorted_m != m:
                    new_medians.append(sorted_m)
                    part_modified = True
                else:
                    new_medians.append(m)
            else:
                new_medians.append(m)

        if part_modified:
            p['medians'] = new_medians
            reordered_count += 1

    data['meta']['calibrationVersion'] = "3.4-perfect-points-alignment"
    json_str = json.dumps(data, ensure_ascii=False, indent=2)
    js_content = f"""/**
 * hangul_150_parts_warehouse.js
 * 
 * 한글 153개 자소 '궁서체 부품 창고' (획순 점 정렬 3.4 완벽 일치 데이터베이스)
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

    print(f"\n153개 중 {reordered_count}개 자소의 점 순서 꼬임 교정 및 정렬 완료!")

if __name__ == '__main__':
    run_point_alignment()
