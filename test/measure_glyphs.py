import os
import subprocess
from PIL import Image
import numpy as np

chars = ['가', '고', '과', '한', '물', '괜', '꽃', '닭']
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700;900&display=swap" rel="stylesheet">
<style>
body { margin: 0; background: #000; display: flex; flex-wrap: wrap; }
.cell { width: 200px; height: 200px; position: relative; }
svg { width: 200px; height: 200px; display: block; }
</style>
</head>
<body>
"""

for ch in chars:
    html += f"""
<div class="cell" id="cell_{ch}">
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <text x="100" y="105" text-anchor="middle" dominant-baseline="central" font-size="135" font-weight="900" font-family="'Noto Sans KR', sans-serif" fill="#ffffff">{ch}</text>
  </svg>
</div>"""

html += """
</body>
</html>"""

with open("test/measure_glyphs.html", "w", encoding="utf-8") as f:
    f.write(html)

png_path = os.path.abspath("test/measure_glyphs.png")
subprocess.run([edge_path, "--headless", "--disable-gpu", f"--screenshot={png_path}", "--window-size=800,400", "file:///" + os.path.abspath("test/measure_glyphs.html").replace("\\", "/")])

im = Image.open(png_path).convert('L')
arr = np.array(im)

for i, ch in enumerate(chars):
    row = i // 4
    col = i % 4
    cell_arr = arr[row*200:(row+1)*200, col*200:(col+1)*200]
    y_idx, x_idx = np.where(cell_arr > 50)
    if len(x_idx) > 0:
        print(f"{ch}: X=[{x_idx.min():3d} .. {x_idx.max():3d}] (w={x_idx.max()-x_idx.min():3d}), Y=[{y_idx.min():3d} .. {y_idx.max():3d}] (h={y_idx.max()-y_idx.min():3d})")
