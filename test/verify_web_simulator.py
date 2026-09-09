import os
import subprocess
import time

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
screenshot_path = os.path.abspath("test/screenshot_web_simulator.png")

# Let's create a wrapper that opens web_simulator.html with stroke mode active
with open("web_simulator.html", "r", encoding="utf-8") as f:
    html = f.read()

# Make initial mode 'stroke' so it immediately renders stroke mode on load
sim_test_html = html.replace("mode: 'flashcard'", "mode: 'stroke'")
with open("test/simulator_stroke_preview.html", "w", encoding="utf-8") as f:
    f.write(sim_test_html)

test_url = "file:///" + os.path.abspath("test/simulator_stroke_preview.html").replace("\\", "/")

subprocess.run([edge_path, "--headless", "--disable-gpu", f"--screenshot={screenshot_path}", "--window-size=500,850", test_url])
print("Screenshot saved to", screenshot_path)
