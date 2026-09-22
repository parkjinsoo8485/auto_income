import os, subprocess

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

# Characters to test
test_chars = [
    ('화', 'Type 3: 섞임모임'),
    ('가', 'Type 1: 세로모임'),
    ('고', 'Type 2: 가로모임'),
    ('한', 'Type 4: 받침세로'),
    ('꽃', 'Type 5: 받침가로'),
    ('닭', 'Type 4: 겹받침')
]

template_html = open('test/preview_hwa_sim.html', 'r', encoding='utf-8').read()

# Replace the auto_script at the bottom to target specific character
for ch, desc in test_chars:
    custom_script = f"""
<script>
window.addEventListener('DOMContentLoaded', () => {{
  setTimeout(() => {{
    if (typeof skipOnboarding === 'function') skipOnboarding();
    if (typeof switchTab === 'function') switchTab('learn');
    setTimeout(() => {{
      if (typeof switchMode === 'function') switchMode('stroke');
      setTimeout(() => {{
        // Set word with character
        TOPIK_DATA[1] = [{{ id: 9999, term: '{ch}', meaning: '{desc}', hanja: '', audio: '' }}];
        S.strokeIndex = 0;
        S.strokeCharIdx = 0;
        renderStrokeMode();
      }}, 300);
    }}, 200);
  }}, 200);
}});
</script>
</body>
</html>
"""
    # Remove existing end script and inject new one
    split_idx = template_html.rfind('<script>\nwindow.addEventListener')
    if split_idx == -1:
        split_idx = template_html.rfind('<script>\r\nwindow.addEventListener')
    
    if split_idx != -1:
        char_html = template_html[:split_idx] + custom_script
    else:
        char_html = template_html.replace('</body>\n</html>', custom_script)

    temp_html_path = f'test/preview_char_{ch}.html'
    with open(temp_html_path, 'w', encoding='utf-8') as f:
        f.write(char_html)

    out_png = os.path.abspath(f'test/out_{ch}.png')
    file_url = 'file:///' + os.path.abspath(temp_html_path).replace('\\', '/')
    subprocess.run([edge_path, '--headless', '--disable-gpu', '--virtual-time-budget=4000', f'--screenshot={out_png}', '--window-size=450,900', file_url])
    print(f"Captured {ch} -> {out_png}")

print("All representative characters captured!")
