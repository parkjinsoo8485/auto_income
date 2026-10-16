import json

with open('hangul_150_parts_warehouse.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 데이터 검증
part = data['parts']['Cho_T2_ㅂ']
print("Verification of Cho_T2_ㅂ in JSON:")
print("  strokeCount:", part['strokeCount'])
print("  strokeWidths:", part['strokeWidths'])
for i, m in enumerate(part['medians']):
    print(f"  Stroke {i+1} ({len(m)} pts): {m}")

js_content = f"""/**
 * hangul_150_parts_warehouse.js
 * 
 * 한글 153개 자소 '궁서체 부품 창고' (정밀 중심선 일치 데이터베이스 v3.1)
 */
(function (global) {{
  'use strict';
  global.HANGUL_150_WAREHOUSE = {json.dumps(data, ensure_ascii=False, indent=2)};
}})(typeof window !== 'undefined' ? window : global);
"""

for path in ['hangul_150_parts_warehouse.js', 'test/hangul_150_parts_warehouse.js']:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"Generated {path} successfully.")

for path in ['hangul_150_parts_warehouse.json', 'test/hangul_150_parts_warehouse.json']:
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Synchronized {path} successfully.")

print("All warehouse files perfectly synchronized.")
