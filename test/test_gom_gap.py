import os, subprocess

cand = {"cy": 12, "ch": 48, "jy": 64, "jh": 38, "gy": 126, "gh": 60}

chars = ['곰', '손', '돈', '봄', '온', '꽃']

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { background: #0f172a; color: white; font-family: sans-serif; padding: 20px; }
.grid { display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; }
.card { background: #1e293b; padding: 14px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; }
.title { font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #38bdf8; text-align: center; }
.svg-wrap { width: 180px; height: 180px; background: #0b0f19; border-radius: 8px; }
</style>
<script src="../assets/hangul_stroke_composer.js"></script>
</head>
<body>
<h2 style="text-align:center;">'ㅗ/ㅛ' 받침 글자 간격 검증 (곰, 손, 돈, 봄, 온, 꽃)</h2>
<div class="grid" id="grid"></div>
<script>
const cand = """ + str(cand) + """;
const chars = """ + str(chars) + """;

const container = document.getElementById('grid');
chars.forEach(ch => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `<div class="title">${ch}</div><div class="svg-wrap" id="wrap-${ch}"></div>`;
  container.appendChild(card);

  const origFn = HangulStrokeComposer.getBaseLayoutGrid;
  HangulStrokeComposer.getBaseLayoutGrid = function(type, dec) {
    const slots = origFn.call(this, type, dec);
    if (type === 5 && (dec.jungIdx === 8 || dec.jungIdx === 12)) {
      slots.forEach(s => {
        if (s.role === 'cho') { s.y = cand.cy; s.h = cand.ch; }
        if (s.role === 'jung') { s.y = cand.jy; s.h = cand.jh; }
        if (s.role === 'jong') { s.y = cand.gy; s.h = cand.gh; }
      });
    }
    return slots;
  };

  const svg = HangulStrokeComposer.renderComposerSvg(ch, { showBadges: true, animated: false });
  document.getElementById(`wrap-${ch}`).innerHTML = svg;
});
</script>
</body>
</html>
"""

with open('test/preview_gom_gap.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('test/preview_gom_gap.html').replace('\\', '/')
p1 = os.path.abspath('test/gom_gap_batch.png')
subprocess.run([edge_path, '--headless', '--disable-gpu', f'--screenshot={p1}', '--window-size=1000,550', url])
print('Done capture gom gap batch!')
