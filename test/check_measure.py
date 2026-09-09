import subprocess
import os
import re

edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
html_path = 'file:///' + os.path.abspath('test/measure_font.html').replace('\\', '/')

res = subprocess.run([
    edge, '--headless', '--disable-gpu', '--virtual-time-budget=3000', '--dump-dom', html_path
], capture_output=True, encoding='utf-8', errors='ignore')

m = re.search(r'<div id="res">(.*?)</div>', res.stdout)
if m:
    print('MEASURED RESULT:')
    print(m.group(1))
else:
    print('Not found')
