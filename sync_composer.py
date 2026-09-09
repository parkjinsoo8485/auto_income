import sys
import re

with open('assets/hangul_stroke_composer.js', 'r', encoding='utf-8') as f:
    latest_composer = f.read()

COMPOSER_PATTERN = re.compile(
    r'/\*\*\s*\*\s*HangulStrokeComposer[\s\S]*?\(typeof window !== [\'"]undefined[\'"] \? window : this\);'
)

CANVAS_OLD = """  cvs.onmousedown = start;
  cvs.onmousemove = move;
  window.addEventListener('mouseup', end);
  cvs.ontouchstart = start;
  cvs.ontouchmove = move;
  cvs.ontouchend = end;"""

CANVAS_NEW = """  cvs.onmousedown = start;
  cvs.onmousemove = move;
  cvs.onmouseup = end;
  cvs.onmouseleave = end;
  window.onmouseup = end;
  cvs.ontouchstart = start;
  cvs.ontouchmove = move;
  cvs.ontouchend = end;
  cvs.ontouchcancel = end;"""

for target_file in ['web_simulator.html', 'index.html']:
    with open(target_file, 'r', encoding='utf-8') as f:
        content = f.read()

    m = COMPOSER_PATTERN.search(content)
    if not m:
        print(f'ERROR: Composer pattern not found in {target_file}')
        continue

    content = COMPOSER_PATTERN.sub(lambda _: latest_composer, content, count=1)
    print(f'Successfully replaced HangulStrokeComposer in {target_file}')

    if CANVAS_OLD in content:
        content = content.replace(CANVAS_OLD, CANVAS_NEW)
        print(f'Successfully updated canvas listeners in {target_file}')
    else:
        print(f'CANVAS_OLD not directly found in {target_file}, checking...')

    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(content)

print('Sync complete!')
