import os, subprocess

html = open('index.html', 'r', encoding='utf-8').read()

# Let's test diverse characters: '가', '고', '화', '강', '문', '환'
test_chars = ['가', '고', '화', '강', '문', '환']

test_script = """
<script>
window.testChars = ['가', '고', '화', '강', '문', '환'];
window.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.id = 'test-gallery';
  container.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#0d1117;z-index:999999;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:15px;padding:20px;box-sizing:border-box;overflow:auto;';
  
  window.testChars.forEach(ch => {
    const box = document.createElement('div');
    box.style.cssText = 'display:flex;flex-direction:column;align-items:center;background:#161b22;padding:12px;border-radius:12px;border:1px solid #30363d;';
    const title = document.createElement('div');
    title.innerText = ch;
    title.style.cssText = 'color:#58a6ff;font-size:20px;font-weight:bold;margin-bottom:8px;';
    box.appendChild(title);
    
    const svgWrap = document.createElement('div');
    svgWrap.style.cssText = 'width:180px;height:180px;background:#0d1117;border-radius:10px;border:1px dashed #30363d;position:relative;';
    
    const data = HangulStrokeComposer.decomposeSyllable(ch);
    const strokes = HangulStrokeComposer.composeStrokes(data);
    const svg = HangulStrokeComposer.createStrokeSvg(strokes, {
      viewBox: "0 0 256 256",
      strokeWidth: 16,
      showBadges: true,
      animated: false
    });
    svgWrap.innerHTML = svg;
    box.appendChild(svgWrap);
    container.appendChild(box);
  });
  document.body.appendChild(container);
});
</script>
"""

with open('test/preview_gallery.html', 'w', encoding='utf-8') as f:
    f.write(html.replace('</body>', test_script + '</body>'))

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('test/preview_gallery.html').replace('\\', '/')
p1 = os.path.abspath('test/gallery_nanum_clean.png')
subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=6000', f'--screenshot={p1}', '--window-size=800,600', url])
print('Done gallery capture!')
