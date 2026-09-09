import os
import subprocess

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('web_simulator.html').replace('\\', '/') + '#stroke'

p = os.path.abspath('test/sim_stroke_completed.png')
subprocess.run([
    edge_path,
    '--headless',
    '--disable-gpu',
    '--virtual-time-budget=8000',
    f'--screenshot={p}',
    '--window-size=480,950',
    url
])
print('Completed capture:', os.path.exists(p))
