import os, subprocess

standalone_html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { background: #0f172a; color: white; font-family: sans-serif; padding: 20px; margin: 0; }
.grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
.card { background: #1e293b; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; align-items: center; border: 1px solid #334155; }
.card h3 { margin: 0 0 10px 0; color: #38bdf8; font-size: 24px; }
.svg-wrap { width: 200px; height: 200px; background: #0b0f19; border-radius: 8px; }
</style>
<script src="../assets/hangul_stroke_composer.js"></script>
</head>
<body>
<h2 style="text-align:center; margin-bottom: 20px;">한글 6대 결합규칙 및 획순 검증 (바탕 회색 글씨 제거 & 겹침 완벽 해소)</h2>
<div class="grid" id="container"></div>
<script>
const chars = ['가', '고', '화', '강', '문', '환', '아', '사', '곰'];
const container = document.getElementById('container');
chars.forEach(ch => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `<h3>${ch}</h3><div class="svg-wrap" id="wrap-${ch}"></div>`;
  container.appendChild(card);
  
  const svg = HangulStrokeComposer.renderComposerSvg(ch, {
    showBadges: true,
    animated: false
  });
  document.getElementById(`wrap-${ch}`).innerHTML = svg;
});
</script>
</body>
</html>
"""

with open('test/standalone_gallery.html', 'w', encoding='utf-8') as f:
    f.write(standalone_html)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('test/standalone_gallery.html').replace('\\', '/')
p1 = os.path.abspath('test/gallery_nanum_verified.png')
subprocess.run([edge_path, '--headless', '--disable-gpu', f'--screenshot={p1}', '--window-size=950,950', url])
print('Done standalone gallery capture!')
