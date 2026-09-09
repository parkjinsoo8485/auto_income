import subprocess
import os

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" style="background:#0f172a">
  <text x="100" y="105"
        text-anchor="middle" dominant-baseline="central"
        font-size="135" font-weight="900"
        font-family="'Noto Sans KR', sans-serif"
        fill="#6366f1">괜</text>
</svg>"""

with open("test/gwen_glyph.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
subprocess.run([edge_path, "--headless", "--disable-gpu", "--screenshot=test/gwen_glyph.png", "--window-size=200,200", "file:///" + os.path.abspath("test/gwen_glyph.svg").replace("\\", "/")])

print("Screenshot captured to test/gwen_glyph.png")
