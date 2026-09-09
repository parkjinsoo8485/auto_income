import os, subprocess, time

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# Create a test wrapper that immediately opens stroke mode
html_wrapper = """<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Verify Simulator Stroke</title></head>
<body style="margin:0;background:#0a0f1e;">
<iframe id="sim" src="../web_simulator.html" style="width:414px;height:896px;border:none;"></iframe>
<script>
  const iframe = document.getElementById('sim');
  iframe.onload = () => {
    setTimeout(() => {
      const win = iframe.contentWindow;
      // Switch to stroke mode
      if (win.switchMode) {
        win.switchMode('stroke');
      }
    }, 800);
  };
</script>
</body>
</html>"""

wrapper_path = os.path.abspath("test/sim_stroke_check.html")
with open(wrapper_path, 'w', encoding='utf-8') as f:
    f.write(html_wrapper)

screenshot_path = os.path.abspath("test/sim_nanum_stroke_result.png")
html_url = "file:///" + wrapper_path.replace("\\", "/")

# Run Edge headless with virtual time
subprocess.run([
    edge_path,
    "--headless",
    "--disable-gpu",
    "--virtual-time-budget=4000",
    f"--screenshot={screenshot_path}",
    "--window-size=430,920",
    html_url
])

print("Captured simulator screenshot at:", screenshot_path)
