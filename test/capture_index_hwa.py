import os, subprocess

html = open('index.html', 'r', encoding='utf-8').read()

auto_script = """
<script>
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof skipOnboarding === 'function') skipOnboarding();
    if (typeof switchTab === 'function') switchTab('learn');
    setTimeout(() => {
      if (typeof switchMode === 'function') switchMode('stroke');
      setTimeout(() => {
        const words = TOPIK_DATA[S.level] || [];
        for (let i = 0; i < words.length; i++) {
          const idx = words[i].term.indexOf('화');
          if (idx !== -1) {
            S.strokeIndex = i;
            S.strokeCharIdx = idx;
            renderStrokeMode();
            break;
          }
        }
      }, 300);
    }, 200);
  }, 200);
});
</script>
"""
html = html.replace('</body>', auto_script + '</body>')
with open('test/preview_index_hwa.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('test/preview_index_hwa.html').replace('\\', '/')

p1 = os.path.abspath('test/index_hwa_nanum_perfect.png')
subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=8000', f'--screenshot={p1}', '--window-size=450,900', url])
print('Done capture index hwa perfect!')
