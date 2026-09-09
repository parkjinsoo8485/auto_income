import os, subprocess

html_content = '''<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Stroke Test Nanum</title>
</head>
<body style="margin:0;padding:0;background:#0f172a">
  <iframe id="sim" src="../web_simulator.html" style="width:430px;height:880px;border:none;"></iframe>
  <script>
    const iframe = document.getElementById('sim');
    iframe.onload = () => {
      setTimeout(() => {
        const win = iframe.contentWindow;
        try {
          // Finish onboarding
          if (win.finishOnboarding) {
            win.finishOnboarding();
          }
          setTimeout(() => {
            // Switch to stroke mode
            if (win.switchMode) {
              win.switchMode('stroke');
            }
          }, 300);
        } catch (e) {
          console.error(e);
        }
      }, 500);
    };
  </script>
</body>
</html>
'''

with open('test/preview_nanum_sim.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('test/preview_nanum_sim.html').replace('\\', '/')
p = os.path.abspath('test/sim_stroke_nanum_success.png')

subprocess.run([
    edge_path,
    '--headless',
    '--disable-gpu',
    '--virtual-time-budget=6000',
    f'--screenshot={p}',
    '--window-size=450,900',
    url
])

print('Captured:', os.path.exists(p), p)
