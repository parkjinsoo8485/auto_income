import os
import subprocess

html_content = '''<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Stroke Test Direct</title>
</head>
<body style="margin:0;padding:0;background:#0f172a">
  <iframe id="sim" src="../web_simulator.html" style="width:430px;height:880px;border:none;"></iframe>
  <script>
    const iframe = document.getElementById('sim');
    iframe.onload = () => {
      const win = iframe.contentWindow;
      // 온보딩 완료 처리 및 획순 모드 진입
      try {
        win.localStorage.setItem('onboarded', 'true');
        win.document.getElementById('ob-screen').classList.remove('active');
        win.document.getElementById('app-screen').classList.add('active');
        win.initApp();
        win.switchTab('learn');
        win.switchMode('stroke');
      } catch (e) {
        console.error(e);
      }
    };
  </script>
</body>
</html>
'''

with open('test/preview_stroke_auto.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('test/preview_stroke_auto.html').replace('\\', '/')
p = os.path.abspath('test/sim_stroke_rendered.png')

subprocess.run([
    edge_path,
    '--headless',
    '--disable-gpu',
    '--virtual-time-budget=6000',
    f'--screenshot={p}',
    '--window-size=450,900',
    url
])

print('Captured direct:', os.path.exists(p), p)
