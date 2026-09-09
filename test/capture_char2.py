import os, subprocess

html = open('web_simulator.html', 'r', encoding='utf-8').read()
auto_script = """
<script>
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof skipOnboarding === 'function') skipOnboarding();
    if (typeof switchTab === 'function') switchTab('learn');
    setTimeout(() => {
      if (typeof switchMode === 'function') switchMode('stroke');
      setTimeout(() => {
        // Select 2nd char '녕'
        if (typeof selectStrokeChar === 'function') {
          selectStrokeChar(1);
        }
      }, 500);
    }, 200);
  }, 200);
});
</script>
"""
html = html.replace('</body>', auto_script + '</body>')
with open('test/preview_auto_stroke_char2.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('test/preview_auto_stroke_char2.html').replace('\\', '/')

p1 = os.path.abspath('test/sim_stroke_nanum_char2.png')
subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=3000', f'--screenshot={p1}', '--window-size=450,900', url])
print('Done capture char 2!')
