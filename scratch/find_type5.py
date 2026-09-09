import os, subprocess

# Let's inspect all Type 5 syllables in index.html vocabulary
import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find words and see Type 5 syllables
words = re.findall(r'term:\s*[\'"]([^\'"]+)[\'"]', html)
type5_chars = set()
CHOS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
JUNGS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ']
JONGS = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
horiz_jungs = [8, 12, 13, 17, 18] # ㅗ, ㅛ, ㅜ, ㅠ, ㅡ

for w in words:
    for ch in w:
        code = ord(ch) - 0xAC00
        if 0 <= code <= 11171:
            jong = code % 28
            jung = (code - jong) // 28 % 21
            if jong > 0 and jung in horiz_jungs:
                type5_chars.add(ch)

print(f"Total Type 5 characters found: {len(type5_chars)}")
print("Examples:", sorted(list(type5_chars))[:20])
