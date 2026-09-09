import os
import subprocess

html_content = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700;900&display=swap" rel="stylesheet">
<style>
body { background: #0f172a; margin: 0; padding: 20px; color: white; font-family: sans-serif; display: flex; gap: 20px; }
</style>
</head>
<body>
<div>
  <h3>Test Invalidation</h3>
  <svg id="mysvg" width="250" height="250" viewBox="0 0 200 200">
    <mask id="mask_test">
      <rect width="200" height="200" fill="black" />
      <path id="mask_p" d="M 46,55 L 90,55 L 90,95" stroke="white" stroke-width="40" stroke-linecap="round" fill="none"
            stroke-dasharray="150" stroke-dashoffset="150" />
    </mask>
    <text x="100" y="105" text-anchor="middle" dominant-baseline="central" font-size="135" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="rgba(255,255,255,0.2)">가</text>
    <text id="masked_txt" x="100" y="105" text-anchor="middle" dominant-baseline="central" font-size="135" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="#10b981" mask="url(#mask_test)">가</text>
  </svg>
</div>

<script>
const p = document.getElementById('mask_p');
const txt = document.getElementById('masked_txt');
const svg = document.getElementById('mysvg');

// Set strokeDashoffset directly to 0 after 500ms
setTimeout(() => {
  p.style.strokeDashoffset = '0';
  // Check if force repaint works:
  txt.style.opacity = '0.999';
  console.log('Updated to 0');
}, 500);
</script>
</body>
</html>"""

with open('test/test_inval.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
html_url = 'file:///' + os.path.abspath('test/test_inval.html').replace('\\', '/')

p1 = os.path.abspath('test/inval_200ms.png')
p2 = os.path.abspath('test/inval_1500ms.png')

subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=200', f'--screenshot={p1}', html_url])
subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=1500', f'--screenshot={p2}', html_url])
print('Done test inval')
