import os
import subprocess
import time

html_content = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700;900&display=swap" rel="stylesheet">
<style>
body { background: #0f172a; margin: 0; padding: 20px; color: white; font-family: sans-serif; }
.box { width: 240px; height: 240px; background: #1e293b; border: 2px dashed #6366f1; border-radius: 20px; display: flex; align-items: center; justify-content: center; position: relative; }
svg { width: 220px; height: 220px; display: block; }
</style>
</head>
<body>
<div class="box" id="testbox"></div>
<div id="status"></div>

<script>
const strokes = [
  { d: 'M 46,55 L 90,55 L 56,120', len: 120 },
  { d: 'M 115,50 L 115,165', len: 115 },
  { d: 'M 115,105 L 148,105', len: 35 }
];

const maskId = 'anim_mask';
let maskPaths = strokes.map((s, i) =>
  `<path id="st_${i}" d="${s.d}" stroke="white" stroke-width="42" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-dasharray="${s.len}" stroke-dashoffset="${s.len}" />`
).join('');

document.getElementById('testbox').innerHTML = `
  <svg viewBox="0 0 200 200">
    <defs>
      <mask id="${maskId}">
        <rect width="200" height="200" fill="black" />
        ${maskPaths}
      </mask>
    </defs>
    <!-- Gray font -->
    <text x="100" y="105" text-anchor="middle" dominant-baseline="central" font-size="135" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="rgba(255,255,255,0.15)">가</text>
    <!-- Masked colored text -->
    <text id="masked_target" x="100" y="105" text-anchor="middle" dominant-baseline="central" font-size="135" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="#6366f1" mask="url(#${maskId})">가</text>
  </svg>
`;

const pathEls = strokes.map((_, i) => document.getElementById(`st_${i}`));
const targetEl = document.getElementById('masked_target');

const strokeDur = 400; // ms
const gapDur = 120;    // ms
let startTime = null;
let frameCount = 0;

function tick(now) {
  if (!startTime) startTime = now;
  const elapsed = now - startTime;
  frameCount++;

  let allDone = true;
  strokes.forEach((s, i) => {
    const sStart = i * (strokeDur + gapDur);
    const sEnd = sStart + strokeDur;

    if (elapsed < sStart) {
      pathEls[i].style.strokeDashoffset = s.len;
      allDone = false;
    } else if (elapsed >= sEnd) {
      pathEls[i].style.strokeDashoffset = '0';
    } else {
      const progress = (elapsed - sStart) / strokeDur;
      // easeOutQuad
      const eased = 1 - (1 - progress) * (1 - progress);
      pathEls[i].style.strokeDashoffset = (s.len * (1 - eased)).toFixed(1);
      allDone = false;
    }
  });

  // Force Chromium GPU rasterizer to flush SVG mask
  targetEl.style.opacity = (frameCount % 2 === 0) ? '1' : '0.9999';

  if (!allDone) {
    requestAnimationFrame(tick);
  } else {
    document.getElementById('status').innerText = 'COMPLETE';
  }
}
requestAnimationFrame(tick);
</script>
</body>
</html>"""

with open('test/test_realtime.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('test/test_realtime.html').replace('\\', '/')

# Let's test by taking screenshots at 200ms, 450ms, 750ms, 1400ms using virtual-time-budget
subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=200', f'--screenshot={os.path.abspath("test/rt_200.png")}', url])
subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=450', f'--screenshot={os.path.abspath("test/rt_450.png")}', url])
subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=750', f'--screenshot={os.path.abspath("test/rt_750.png")}', url])
subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=1400', f'--screenshot={os.path.abspath("test/rt_1400.png")}', url])
print('Done realtime test')
