import os
import subprocess

with open("test/test_all_syllables.html", "r", encoding="utf-8") as f:
    code = f.read()

# Adjust Type 4 (좌우+받침): make jung taller (h: 88) and jong w: 124, h: 64
code = code.replace(
    "parts.push({ jamo: jung, x: 104, y: 46, w: 56, h: 76, role: 'jung', isVert, hasJong });",
    "parts.push({ jamo: jung, x: 104, y: 46, w: 56, h: 88, role: 'jung', isVert, hasJong });"
)
code = code.replace(
    "parts.push({ jamo: jong, x: 40, y: 114, w: 120, h: 62, role: 'jong', isVert, hasJong });",
    "parts.push({ jamo: jong, x: 38, y: 112, w: 124, h: 64, role: 'jong', isVert, hasJong });"
)

# In stroke-width: change 36 to 40
code = code.replace('stroke-width="36"', 'stroke-width="40"')

with open("test/test_all_syllables.html", "w", encoding="utf-8") as f:
    f.write(code)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
screenshot_path = os.path.abspath("test/screenshot_perfect3.png")
html_url = "file:///" + os.path.abspath("test/test_all_syllables.html").replace("\\", "/")

subprocess.run([edge_path, "--headless", "--disable-gpu", f"--screenshot={screenshot_path}", "--window-size=1200,600", html_url])
print("Screenshot saved to", screenshot_path)
