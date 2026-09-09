import os
import subprocess

with open("web_simulator.html", "r", encoding="utf-8") as f:
    html = f.read()

trigger = """
<script>
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    skipOnboarding();
    switchTab('learn');
    switchMode('stroke');
  }, 100);
});
</script>
"""

html = html.replace("</body>", trigger + "</body>")

with open("test/simulator_stroke_preview.html", "w", encoding="utf-8") as f:
    f.write(html)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
screenshot_path = os.path.abspath("test/screenshot_sim_stroke_mode.png")
test_url = "file:///" + os.path.abspath("test/simulator_stroke_preview.html").replace("\\", "/")

subprocess.run([edge_path, "--headless", "--disable-gpu", "--virtual-time-budget=3000", f"--screenshot={screenshot_path}", "--window-size=440,900", test_url])
print("Screenshot saved to", screenshot_path)
