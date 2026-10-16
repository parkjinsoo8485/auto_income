import json

with open('hangul_150_parts_warehouse.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

parts = data.get('parts', {})
keys = list(parts.keys())

with open('part_list_temp.txt', 'w', encoding='utf-8') as f:
    for i, k in enumerate(keys):
        p = parts[k]
        char = p.get('char', '')
        strokes = len(p.get('medians', []))
        f.write(f"{i+1:3d}. {k:15s} | 문자: {char} | {strokes}획 | 점: {p.get('medians')}\n")

print(f"총 {len(keys)}개 자소 목록 저장 완료. 1번 자소: {keys[0]}")
