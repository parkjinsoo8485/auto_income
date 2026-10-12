import re

def fix_korean_josa(text):
    """
    한국어 텍스트에서 '단어이/가', '단어를/를', '단어은/는', '단어와/과', '단어(으)로' 등을
    앞 글자의 종성(받침) 유무에 따라 문법에 맞게 자동 교정
    """
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

    # 1. '이/가', '을/를', '은/는', '와/과', '(으)로'
    pattern = r'([가-힣])(이/가|을/를|은/는|와/과|\(으\)로|으로/로)'
    text = re.sub(pattern, replace_josa, text)
    return text

# Test cases
test_cases = [
    "오늘 오후 3시에 작업장 대청소이/가 진행될 예정이니 준비해 주시기 바랍니다.",
    "오늘 오후 1시에 안전 점검이/가 진행될 예정이니 준비해 주시기 바랍니다.",
    "파편이 튈 수 있으니 안전모을/를 꼭 착용하세요.",
    "파편이 튈 수 있으니 보안경을/를 꼭 착용하세요.",
    "수루 씨은/는 오늘 출근했습니다.",
    "민수 씨은/는 내일 옵니다.",
    "공장장님와/과 이야기하세요.",
    "반장님와/과 이야기하세요.",
]

for t in test_cases:
    print("원문:", t)
    print("교정:", fix_korean_josa(t))
    print()
