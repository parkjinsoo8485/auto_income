import os
import subprocess

html_content = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700;900&display=swap" rel="stylesheet">
<style>
body { background: #0f172a; margin: 0; padding: 20px; color: white; font-family: sans-serif; }
@keyframes drawStrokeMask { to { stroke-dashoffset: 0; } }
</style>
</head>
<body>
<h2>Test CSS Mask Animation in Chromium</h2>
<svg width="300" height="300" viewBox="0 0 200 200">
  <defs>
    <mask id="testmask">
      <rect width="200" height="200" fill="black" />
      <path d="M 46,55 L 90,55 L 90,95" stroke="white" stroke-width="40" stroke-linecap="round" fill="none"
            stroke-dasharray="150" stroke-dashoffset="150"
            style="animation: drawStrokeMask 2s linear 0s forwards;" />
    </mask>
  </defs>
  <!-- Gray background -->
  <text x="100" y="105" text-anchor="middle" dominant-baseline="central" font-size="135" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="rgba(255,255,255,0.2)">가</text>
  <!-- Animated reveal -->
  <text x="100" y="105" text-anchor="middle" dominant-baseline="central" font-size="135" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="#6366f1" mask="url(#testmask)">가</text>
</svg>
</body>
</html>"""

with open('test/test_anim.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
html_url = 'file:///' + os.path.abspath('test/test_anim.html').replace('\\', '/')

p1 = os.path.abspath('test/anim_1s.png')
p3 = os.path.abspath('test/anim_3s.png')

subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=1000', f'--screenshot={p1}', html_url])
subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=4000', f'--screenshot={p3}', html_url])
print('Done capturing anim screenshots')
