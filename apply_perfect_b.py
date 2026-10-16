import json
import re

perfect_medians = [
    [
        [348, 816],
        [382, 818],
        [412, 775],
        [422, 660],
        [425, 545]
    ],
    [
        [605, 865],
        [648, 815],
        [665, 715],
        [672, 630],
        [676, 582]
    ],
    [
        [412, 730],
        [490, 728],
        [570, 733],
        [665, 735]
    ],
    [
        [415, 574],
        [490, 572],
        [580, 572],
        [678, 576]
    ]
]
stroke_widths = [60, 60, 54, 58]

target_json_files = [
    'hangul_150_parts_warehouse.json',
    'test/hangul_150_parts_warehouse.json'
]

NEW_VERSION = "3.1-perfect-realtime-sync"

for jf in target_json_files:
    try:
        with open(jf, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if 'meta' in data:
            data['meta']['calibrationVersion'] = NEW_VERSION
            data['meta']['updatedAt'] = "2026-10-16T14:05:00.000Z"

        if 'parts' in data and 'Cho_T2_ㅂ' in data['parts']:
            part = data['parts']['Cho_T2_ㅂ']
            part['medians'] = perfect_medians
            part['strokeWidths'] = stroke_widths
            part['strokeCount'] = 4
            part['strokeWidth'] = 58
            # strokes 배열이 4개여야 함
            outline = part.get('gungsuhOutline')
            if outline:
                part['strokes'] = [outline, outline, outline, outline]
            
            with open(jf, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Updated {jf} successfully.")
    except Exception as e:
        print(f"Error updating {jf}: {e}")

# JS 파일 업데이트
target_js_files = [
    'hangul_150_parts_warehouse.js',
    'test/hangul_150_parts_warehouse.js'
]

for jsf in target_js_files:
    try:
        with open(jsf, 'r', encoding='utf-8') as f:
            content = f.read()

        # JSON 부분 찾아서 파싱 또는 교체
        # global.HANGUL_150_WAREHOUSE = { ... };
        m = re.search(r'global\.HANGUL_150_WAREHOUSE\s*=\s*(\{[\s\S]*\});?\s*\}\)\(this\);?', content)
        if m:
            js_data = json.loads(m.group(1))
            if 'meta' in js_data:
                js_data['meta']['calibrationVersion'] = NEW_VERSION
                js_data['meta']['updatedAt'] = "2026-10-16T14:05:00.000Z"
            if 'parts' in js_data and 'Cho_T2_ㅂ' in js_data['parts']:
                part = js_data['parts']['Cho_T2_ㅂ']
                part['medians'] = perfect_medians
                part['strokeWidths'] = stroke_widths
                part['strokeCount'] = 4
                part['strokeWidth'] = 58
                outline = part.get('gungsuhOutline')
                if outline:
                    part['strokes'] = [outline, outline, outline, outline]

            new_content = f"/**\n * hangul_150_parts_warehouse.js\n * \n * 한글 153개 자소 '궁서체 부품 창고' (정밀 중심선 일치 데이터베이스 v3.1)\n */\n(function (global) {{\n  'use strict';\n  global.HANGUL_150_WAREHOUSE = {json.dumps(js_data, ensure_ascii=False, indent=2)};\n}})(typeof window !== 'undefined' ? window : this);\n"
            with open(jsf, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {jsf} successfully.")
    except Exception as e:
        print(f"Error updating {jsf}: {e}")

# hangul_variant_data.js 파일들도 업데이트
for vf in ['hangul_variant_data.js', 'test/hangul_variant_data.js']:
    try:
        with open(vf, 'r', encoding='utf-8') as f:
            vcontent = f.read()
        # Cho_T2_ㅂ 항목의 medians를 교체
        # JSON 블록이 있는지 확인
        vm = re.search(r'window\.HANGUL_VARIANT_DATA\s*=\s*(\{[\s\S]*\});?', vcontent)
        if vm:
            vdata = json.loads(vm.group(1))
            if 'Cho_T2_ㅂ' in vdata:
                vdata['Cho_T2_ㅂ']['medians'] = perfect_medians
                vdata['Cho_T2_ㅂ']['strokeWidths'] = stroke_widths
                vdata['Cho_T2_ㅂ']['strokeCount'] = 4
                with open(vf, 'w', encoding='utf-8') as f:
                    f.write(f"window.HANGUL_VARIANT_DATA = {json.dumps(vdata, ensure_ascii=False, indent=2)};\n")
                print(f"Updated {vf} successfully.")
    except Exception as e:
        print(f"Error updating {vf}: {e}")

print("All files updated successfully.")
