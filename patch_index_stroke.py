import re

with open('web_simulator.html', encoding='utf-8') as f:
    ws = f.read()
with open('index.html', encoding='utf-8') as f:
    ix = f.read()

# 1. CSS 교체: 구버전 -> 신버전
old_css_start = '.stroke-view-container{padding:20px'
old_css_end = '@keyframes drawHangul{0%{stroke-dashoffset:1200;fill:transparent}60%{stroke-dashoffset:0;fill:transparent}80%,100%{stroke-dashoffset:0;fill:rgba(99,102,241,0.25)}}'

new_css_match = re.search(
    r'\.stroke-view-container\{padding:16px.*?@keyframes sk-draw\{to\{stroke-dashoffset:0\}\}',
    ws, re.DOTALL
)
if not new_css_match:
    print('ERROR: Could not find new CSS in web_simulator.html')
    exit(1)
new_css = new_css_match.group(0)

# 구 CSS 범위 찾아서 교체
old_css_match = re.search(
    r'\.stroke-view-container\{padding:20px.*?@keyframes drawHangul\{[^}]+\}',
    ix, re.DOTALL
)
if not old_css_match:
    print('ERROR: Could not find old CSS in index.html')
    exit(1)

ix2 = ix[:old_css_match.start()] + new_css + ix[old_css_match.end():]
print(f'CSS replaced: {len(old_css_match.group(0))} chars -> {len(new_css)} chars')

# 2. JS 교체: 구버전 함수들 -> 신버전 엔진
old_js_match = re.search(
    r'// \u2500{3} Stroke Order.*?function prevStroke\(\)\{ const words=TOPIK_DATA\[S\.level\]\|\|\[\]; S\.strokeIndex=\(S\.strokeIndex-1\+words\.length\)%words\.length; renderStrokeMode\(\); \}',
    ix2, re.DOTALL
)
if not old_js_match:
    print('ERROR: Could not find old JS in index.html')
    exit(1)

new_js_match = re.search(
    r'// \u2550{56}\n//  \ud55c\uae00 SVG \ud68d\uc21c.*?^function prevStroke\(\)\{\n  const words=TOPIK_DATA\[S\.level\]\|\|\[\];\n  S\.strokeIndex=\(S\.strokeIndex-1\+words\.length\)%words\.length;\n  S\.strokeCharIdx=0;\n  renderStrokeMode\(\);\n\}',
    ws, re.DOTALL | re.MULTILINE
)
if not new_js_match:
    print('ERROR: Could not find new JS in web_simulator.html')
    exit(1)
new_js = new_js_match.group(0)

ix3 = ix2[:old_js_match.start()] + new_js + ix2[old_js_match.end():]
print(f'JS replaced: {len(old_js_match.group(0))} chars -> {len(new_js)} chars')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(ix3)
print('Done! index.html updated successfully.')
