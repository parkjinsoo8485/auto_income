import os
import subprocess
import time

html_path = os.path.abspath('web_simulator.html')
# Replace \ with /
file_url = 'file:///' + html_path.replace('\\', '/')

# Script to inject navigation to stroke mode and capture
script_html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body style="margin:0; background:#000;">
<iframe id="sim" src="{file_url}" style="width:420px; height:850px; border:none;"></iframe>
<script>
const sim = document.getElementById('sim');
sim.onload = () => {{
  setTimeout(() => {{
    const doc = sim.contentDocument;
    // skip onboarding if active
    const ob = doc.getElementById('ob-screen');
    if (ob && ob.classList.contains('active')) {{
      doc.getElementById('app-screen').classList.add('active');
      ob.classList.remove('active');
    }}
    // switch to stroke mode
    const btn = doc.getElementById('mode-stroke');
    if (btn) btn.click();
  }}, 500);
}};
</script>
</body>
</html>"""

with open('test/sim_wrapper.html', 'w', encoding='utf-8') as f:
    f.write(script_html)

wrapper_url = 'file:///' + os.path.abspath('test/sim_wrapper.html').replace('\\', '/')
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

# Screenshot 1: At 1500ms (during stroke drawing)
subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=1800', f'--screenshot={os.path.abspath("test/sim_drawing.png")}', '--window-size=450,900', wrapper_url])

# Screenshot 2: At 4500ms (complete)
subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=4500', f'--screenshot={os.path.abspath("test/sim_done.png")}', '--window-size=450,900', wrapper_url])

print("Verification screenshots captured!")
