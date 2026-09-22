import subprocess
import os

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
chars = ['ㄹ', 'ㅂ', 'ㅎ', 'ㅏ']

base_html = open('test_jamo_gallery.html', 'r', encoding='utf-8').read()

for c in chars:
    html = base_html.replace("selectChar('ㄱ');", f"selectChar('{c}');")
    tmp_name = f'temp_gallery_test.html'
    open(tmp_name, 'w', encoding='utf-8').write(html)
    url = f'http://localhost:8000/{tmp_name}'
    out = os.path.abspath(f'gallery_{c}.png')
    subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=2000', f'--screenshot={out}', '--window-size=1150,850', url])

if os.path.exists('temp_gallery_test.html'):
    os.remove('temp_gallery_test.html')

print('Batch test done!')
