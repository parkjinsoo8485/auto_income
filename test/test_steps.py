import os
import subprocess

html_content = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700;900&display=swap" rel="stylesheet">
<style>
body { background: #0f172a; margin: 0; padding: 20px; color: white; font-family: sans-serif; display: flex; gap: 20px; }
.box { width: 220px; height: 220px; background: #1e293b; border: 2px dashed #6366f1; border-radius: 20px; display: flex; align-items: center; justify-content: center; position: relative; }
svg { width: 200px; height: 200px; display: block; }
</style>
</head>
<body>
<div class="box" id="testbox"></div>
<div id="log"></div>

<script>
// Mock data for '가' (ㄱ: 1 stroke, ㅏ: 2 strokes)
const strokes = [
  { d: 'M 46,55 L 90,55 L 60,110', len: 110 },
  { d: 'M 115,50 L 115,160', len: 110 },
  { d: 'M 115,105 L 145,105', len: 30 }
];

const maskId = 'test_mask';
let maskPaths = strokes.map((s, i) =>
  `<path id="st_${i}" d="${s.d}" stroke="white" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-dasharray="${s.len}" stroke-dashoffset="${s.len}" />`
).join('');

document.getElementById('testbox').innerHTML = `
  <svg viewBox="0 0 200 200">
    <mask id="${maskId}">
      <rect width="200" height="200" fill="black" />
      ${maskPaths}
    </mask>
    <text x="100" y="105" text-anchor="middle" dominant-baseline="central" font-size="135" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="rgba(255,255,255,0.15)">가</text>
    <text id="masked_target" x="100" y="105" text-anchor="middle" dominant-baseline="central" font-size="135" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="#6366f1" mask="url(#${maskId})">가</text>
  </svg>
`;

// Direct step by step function
window.setStrokeProgress = function(step) {
  if (step === 1) {
    document.getElementById('st_0').style.strokeDashoffset = '0';
  } else if (step === 2) {
    document.getElementById('st_0').style.strokeDashoffset = '0';
    document.getElementById('st_1').style.strokeDashoffset = '0';
  } else if (step === 3) {
    document.getElementById('st_0').style.strokeDashoffset = '0';
    document.getElementById('st_1').style.strokeDashoffset = '0';
    document.getElementById('st_2').style.strokeDashoffset = '0';
  }
  // Force repaint
  const t = document.getElementById('masked_target');
  t.style.opacity = '0.999';
  document.getElementById('log').innerText = 'Step ' + step;
};

// URL param check
const params = new URLSearchParams(window.location.search);
const step = parseInt(params.get('step') || '0');
if (step > 0) {
  window.setStrokeProgress(step);
}
</script>
</body>
</html>"""

with open('test/test_steps.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
base_url = 'file:///' + os.path.abspath('test/test_steps.html').replace('\\', '/')

subprocess.run([edge_path, '--headless', '--disable-gpu', f'--screenshot={os.path.abspath("test/step_1.png")}', base_url + '?step=1'])
subprocess.run([edge_path, '--headless', '--disable-gpu', f'--screenshot={os.path.abspath("test/step_2.png")}', base_url + '?step=2'])
subprocess.run([edge_path, '--headless', '--disable-gpu', f'--screenshot={os.path.abspath("test/step_3.png")}', base_url + '?step=3'])
print('Done step tests')
