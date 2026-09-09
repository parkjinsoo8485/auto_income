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
  <h3>SMIL &lt;animate&gt;</h3>
  <svg width="250" height="250" viewBox="0 0 200 200">
    <defs>
      <mask id="mask_smil">
        <rect width="200" height="200" fill="black" />
        <path d="M 46,55 L 90,55 L 90,95" stroke="white" stroke-width="40" stroke-linecap="round" fill="none"
              stroke-dasharray="150" stroke-dashoffset="150">
          <animate attributeName="stroke-dashoffset" from="150" to="0" dur="2s" fill="freeze" begin="0s" />
        </path>
      </mask>
    </defs>
    <text x="100" y="105" text-anchor="middle" dominant-baseline="central" font-size="135" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="rgba(255,255,255,0.2)">가</text>
    <text x="100" y="105" text-anchor="middle" dominant-baseline="central" font-size="135" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="#6366f1" mask="url(#mask_smil)">가</text>
  </svg>
</div>

<div>
  <h3>JS requestAnimationFrame</h3>
  <svg width="250" height="250" viewBox="0 0 200 200">
    <defs>
      <mask id="mask_js">
        <rect width="200" height="200" fill="black" />
        <path id="js_path" d="M 46,55 L 90,55 L 90,95" stroke="white" stroke-width="40" stroke-linecap="round" fill="none"
              stroke-dasharray="150" stroke-dashoffset="150" />
      </mask>
    </defs>
    <text id="js_text" x="100" y="105" text-anchor="middle" dominant-baseline="central" font-size="135" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="rgba(255,255,255,0.2)">가</text>
    <text x="100" y="105" text-anchor="middle" dominant-baseline="central" font-size="135" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="#10b981" mask="url(#mask_js)">가</text>
  </svg>
</div>

<script>
// Test JS rAF
const p = document.getElementById('js_path');
const start = performance.now();
const dur = 2000;
function tick(now) {
  const elapsed = now - start;
  const progress = Math.min(1, elapsed / dur);
  p.style.strokeDashoffset = 150 * (1 - progress);
  if (progress < 1) {
    requestAnimationFrame(tick);
  }
}
requestAnimationFrame(tick);
</script>
</body>
</html>"""

with open('test/test_smil_js.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
html_url = 'file:///' + os.path.abspath('test/test_smil_js.html').replace('\\', '/')

p1 = os.path.abspath('test/smil_js_1s.png')
p3 = os.path.abspath('test/smil_js_3s.png')

subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=1000', f'--screenshot={p1}', html_url])
subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=3000', f'--screenshot={p3}', html_url])
print('Done comparing SMIL vs JS')
