import json
import re
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def fix_korean_josa(text):
    if not isinstance(text, str):
        return text
    
    def replace_josa(match):
        prev_char = match.group(1)
        josa_type = match.group(2)
        code = ord(prev_char)
        if 0xAC00 <= code <= 0xD7A3:
            has_batchim = ((code - 0xAC00) % 28) != 0
            is_rieul = ((code - 0xAC00) % 28) == 8
            
            if josa_type in ['이/가', '이가']:
                return prev_char + ('이' if has_batchim else '가')
            elif josa_type in ['을/를', '을를']:
                return prev_char + ('을' if has_batchim else '를')
            elif josa_type in ['은/는', '은는']:
                return prev_char + ('은' if has_batchim else '는')
            elif josa_type in ['와/과', '와과']:
                return prev_char + ('과' if has_batchim else '와')
            elif josa_type in ['(으)로', '으로/로']:
                return prev_char + ('로' if (not has_batchim or is_rieul) else '으로')
        return match.group(0)

    pattern = r'([가-힣])(이/가|을/를|은/는|와/과|\(으\)로|으로/로)'
    return re.sub(pattern, replace_josa, text)

# Load bank
bank_file = 'epstopik_1917_bank.js'
with open(bank_file, 'r', encoding='utf-8') as f:
    raw = f.read()

s = raw.find('[')
e = raw.rfind(']') + 1
bank = json.loads(raw[s:e])

fix_count = 0
for q in bank:
    # Fix instruction
    if 'instruction' in q and q['instruction']:
        old = q['instruction']
        new = fix_korean_josa(old)
        if old != new:
            q['instruction'] = new
            fix_count += 1
            
    # Fix dialogue
    if 'dialogue' in q and q['dialogue']:
        old = q['dialogue']
        new = fix_korean_josa(old)
        if old != new:
            q['dialogue'] = new
            fix_count += 1

    # Fix passage
    if 'passage' in q and q['passage']:
        old = q['passage']
        new = fix_korean_josa(old)
        if old != new:
            q['passage'] = new
            fix_count += 1

    # Fix options
    if 'options' in q and isinstance(q['options'], list):
        new_opts = []
        for opt in q['options']:
            old = opt
            new = fix_korean_josa(old)
            if old != new:
                fix_count += 1
            new_opts.append(new)
        q['options'] = new_opts

    # Fix explanation
    if 'explanation' in q and q['explanation']:
        old = q['explanation']
        new = fix_korean_josa(old)
        if old != new:
            q['explanation'] = new
            fix_count += 1

print(f"✅ 총 {fix_count}곳의 어색한 조사가 한국어 맞춤법(받침 유무) 규격으로 완벽 교정되었습니다.")

# Save back to epstopik_1917_bank.js
out_js = f"// 한국산업인력공단 고용허가제 한국어능력시험(EPS-TOPIK) 공공데이터 공개문항 1,917건 전체 데이터베이스 (한국어 맞춤법 조사 교정판)\nconst EPSTOPIK_1917_BANK = {json.dumps(bank, ensure_ascii=False, indent=2)};\n"
with open(bank_file, 'w', encoding='utf-8') as f:
    f.write(out_js)

print(f"💾 {bank_file} 저장 완료! (총 {len(bank)}문항)")
