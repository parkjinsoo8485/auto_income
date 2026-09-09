import os, subprocess

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { background: #0f172a; color: white; display: flex; gap: 20px; justify-content: center; align-items: center; min-height: 100vh; margin: 0; font-family: sans-serif; }
.card { background: #1e293b; padding: 16px; border-radius: 16px; text-align: center; }
.title { font-size: 22px; font-weight: bold; margin-bottom: 8px; color: #38bdf8; }
.svg-wrap { width: 220px; height: 220px; background: #0b0f19; border-radius: 12px; }
</style>
<script src="../assets/hangul_stroke_composer.js"></script>
</head>
<body>
<div class="card"><div class="title">적 (종성 벗어남 완전 해결)</div><div class="svg-wrap" id="wrap-jeok"></div></div>
<div class="card"><div class="title">먹</div><div class="svg-wrap" id="wrap-meok"></div></div>
<div class="card"><div class="title">곰 (가로모음 인터로킹)</div><div class="svg-wrap" id="wrap-gom"></div></div>
<script>
['적', '먹', '곰'].forEach(ch => {
  const id = ch === '적' ? 'wrap-jeok' : (ch === '먹' ? 'wrap-meok' : 'wrap-gom');
  document.getElementById(id).innerHTML = HangulStrokeComposer.renderComposerSvg(ch, { showBadges: true, animated: false });
});
</script>
</body>
</html>"""

with open('test/preview_jeok_fix.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('test/preview_jeok_fix.html').replace('\\', '/')
out = r'C:\Users\user\.gemini\antigravity-ide\brain\a0cafb05-495f-49e9-b7cf-fa7ca8e10d44\jeok_fix_result.png'
subprocess.run([edge, '--headless', '--disable-gpu', f'--screenshot={out}', '--window-size=950,380', url])
print('Done capture jeok fix!')
