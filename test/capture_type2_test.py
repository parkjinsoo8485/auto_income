import os, subprocess

# Test script for Type 2 (받침 없는 가로모음: 초, 고, 조, 추, 주, 그)
test_html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { background: #0f172a; color: white; font-family: sans-serif; padding: 20px; }
.row { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; }
.card { background: #1e293b; padding: 15px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; }
.title { font-size: 20px; font-weight: bold; margin-bottom: 8px; color: #38bdf8; }
.svg-wrap { width: 200px; height: 200px; background: #0b0f19; border-radius: 8px; }
</style>
<script src="../assets/hangul_stroke_composer.js"></script>
</head>
<body>
<h2>Type 2 가로모음 비례 검증 (초, 고, 조, 오, 추, 주)</h2>
<div class="row" id="row"></div>
<script>
const chars = ['초', '고', '조', '오', '추', '주'];
const container = document.getElementById('row');
chars.forEach(ch => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `<div class="title">${ch}</div><div class="svg-wrap" id="wrap-${ch}"></div>`;
  container.appendChild(card);
  const svg = HangulStrokeComposer.renderComposerSvg(ch, { showBadges: true, animated: false });
  document.getElementById(`wrap-${ch}`).innerHTML = svg;
});
</script>
</body>
</html>
"""

with open('test/preview_type2.html', 'w', encoding='utf-8') as f:
    f.write(test_html)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('test/preview_type2.html').replace('\\', '/')
p1 = os.path.abspath('test/type2_current.png')
subprocess.run([edge_path, '--headless', '--disable-gpu', f'--screenshot={p1}', '--window-size=950,550', url])
print('Done capture type2 current!')
