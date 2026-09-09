import os
import subprocess

html_content = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700;900&display=swap" rel="stylesheet">
<style>
body { background: #0f172a; margin: 0; padding: 30px; color: white; font-family: 'Noto Sans KR', sans-serif; display: flex; gap: 30px; justify-content: center; }
.card { display: flex; flex-direction: column; align-items: center; }
.box { width: 240px; height: 240px; background: #1e293b; border: 2px dashed #6366f1; border-radius: 24px; display: flex; align-items: center; justify-content: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
svg { width: 220px; height: 220px; display: block; }
</style>
</head>
<body>
<div class="card">
  <h3>'가' 획순 채우기 테스트</h3>
  <div class="box" id="box_ga"></div>
</div>
<div class="card">
  <h3>'괜' 획순 채우기 테스트</h3>
  <div class="box" id="box_gwen"></div>
</div>

<script>
// Mock layout & strokes
function runTestAnimation(containerId, char, strokes) {
  const maskId = 'mask_' + containerId;
  const pathElementsHTML = strokes.map((s, i) =>
    `<path id="${maskId}_p${i}" d="${s.d}" stroke="white" stroke-width="48" stroke-linecap="round" stroke-linejoin="round" fill="none" />`
  ).join('');

  const markersHTML = strokes.map((s, i) => {
    const nums = s.d.replace(/[MCLZAmclza]/g,' ').trim().split(/[\\s,]+/).filter(Boolean).map(Number);
    const bx = nums[0] || 100;
    const by = nums[1] || 100;
    return `<g id="${maskId}_m${i}" style="opacity:0; transform-origin:${bx}px ${by}px; transition: opacity 0.2s, transform 0.2s;">
      <circle cx="${bx}" cy="${by}" r="8.5" fill="#0f172a" stroke="#818cf8" stroke-width="2.2"/>
      <text x="${bx}" y="${by}" fill="#818cf8" font-size="9.5" font-weight="900" text-anchor="middle" dominant-baseline="central" font-family="'Noto Sans KR', sans-serif">${i+1}</text>
    </g>`;
  }).join('');

  document.getElementById(containerId).innerHTML = `
    <svg viewBox="0 0 200 200">
      <defs>
        <mask id="${maskId}">
          <rect width="200" height="200" fill="black" />
          ${pathElementsHTML}
        </mask>
      </defs>
      <!-- 격자 -->
      <line x1="100" y1="12" x2="100" y2="188" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <line x1="12" y1="100" x2="188" y2="100" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <!-- 회색 밑그림 가이드 폰트 -->
      <text x="100" y="105" text-anchor="middle" dominant-baseline="central" font-size="135" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="rgba(255,255,255,0.12)">${char}</text>
      <!-- 획순대로 채워지는 컬러 폰트 -->
      <text id="${maskId}_txt" x="100" y="105" text-anchor="middle" dominant-baseline="central" font-size="135" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="#6366f1" mask="url(#${maskId})">${char}</text>
      <!-- 획 번호 레이어 -->
      ${markersHTML}
    </svg>
  `;

  const paths = strokes.map((_, i) => document.getElementById(`${maskId}_p${i}`));
  const markers = strokes.map((_, i) => document.getElementById(`${maskId}_m${i}`));
  const txt = document.getElementById(`${maskId}_txt`);

  // Initialize stroke-dasharray and dashoffset
  const lengths = paths.map(p => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = (len + 5) + 'px';
    p.style.strokeDashoffset = (len + 5) + 'px';
    return len + 5;
  });

  const strokeDur = 350; // ms per stroke
  const gapDur = 100;    // ms gap
  const startTime = performance.now();
  let frame = 0;

  function tick(now) {
    const elapsed = now - startTime;
    let allDone = true;

    strokes.forEach((s, i) => {
      const sStart = i * (strokeDur + gapDur);
      const sEnd = sStart + strokeDur;

      if (elapsed < sStart) {
        paths[i].style.strokeDashoffset = lengths[i] + 'px';
        allDone = false;
      } else if (elapsed >= sEnd) {
        paths[i].style.strokeDashoffset = '0px';
        if (markers[i]) markers[i].style.opacity = '1';
      } else {
        const p = (elapsed - sStart) / strokeDur;
        const eased = 1 - Math.pow(1 - p, 2);
        paths[i].style.strokeDashoffset = (lengths[i] * (1 - eased)) + 'px';
        if (markers[i]) markers[i].style.opacity = '1';
        allDone = false;
      }
    });

    frame++;
    // Force Chromium to flush SVG mask repaint every frame
    txt.style.opacity = (frame % 2 === 0 ? '1' : '0.9999');

    if (!allDone) {
      requestAnimationFrame(tick);
    } else {
      // Finished: guarantee full display
      txt.style.opacity = '1';
    }
  }
  requestAnimationFrame(tick);
}

// Data for '가'
runTestAnimation('box_ga', '가', [
  { d: 'M 44,55 L 94,55 L 56,128' },
  { d: 'M 115,48 L 115,168' },
  { d: 'M 115,105 L 152,105' }
]);

// Data for '괜'
runTestAnimation('box_gwen', '괜', [
  { d: 'M 42,50 L 92,50 L 92,90' },
  { d: 'M 68,112 L 68,140' },
  { d: 'M 38,140 L 98,140' },
  { d: 'M 115,48 L 115,130' },
  { d: 'M 115,88 L 145,88' },
  { d: 'M 145,48 L 145,130' },
  { d: 'M 50,135 L 50,168 L 150,168' }
]);
</script>
</body>
</html>"""

with open('test/test_final_anim.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('test/test_final_anim.html').replace('\\', '/')

subprocess.run([edge_path, '--headless', '--disable-gpu', f'--screenshot={os.path.abspath("test/final_complete.png")}', url])
print('Done final anim test')
