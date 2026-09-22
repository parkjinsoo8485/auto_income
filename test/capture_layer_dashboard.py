import os, subprocess

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('test/preview_layer_composite.html').replace('\\', '/')
out_img = os.path.abspath('test/screenshot_layer_dashboard.png')

subprocess.run([
    edge_path,
    '--headless',
    '--disable-gpu',
    '--virtual-time-budget=3000',
    f'--screenshot={out_img}',
    '--window-size=1400,1600',
    url
])
print("Captured to:", out_img)
