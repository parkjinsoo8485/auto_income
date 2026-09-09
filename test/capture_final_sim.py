import os
import subprocess

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('test/preview_auto_stroke.html').replace('\\', '/')

p2 = os.path.abspath('test/sim_stroke_mode_finished.png')
subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=4000', f'--screenshot={p2}', '--window-size=450,900', url])
print('Done capture final!')
