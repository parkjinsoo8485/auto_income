import os
import subprocess
import time

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('web_simulator.html').replace('\\', '/') + '#stroke'

# 잠시 실행 후 스크린샷
p = os.path.abspath('test/sim_stroke_after_fix.png')
res = subprocess.run([
    edge_path,
    '--headless',
    '--disable-gpu',
    '--virtual-time-budget=3000',
    f'--screenshot={p}',
    '--window-size=480,950',
    url
], capture_output=True, text=True)

print('Capture result:', res.returncode)
print('Screenshot saved:', os.path.exists(p), p)
