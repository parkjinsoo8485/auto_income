import os, subprocess

# 검증할 대표 글자군 (폐쇄형 받침, 개방형 받침, 세로모음 받침, 하단 가로모음 등)
char_groups = [
    {"category": "폐쇄형 각진 받침 (ㅁ, ㅂ, ㅍ) - 안전거리 확대", "chars": ['곰', '봄', '몸', '톱', '밥', '답']},
    {"category": "개방형 단순 획 받침 (ㄴ, ㄹ, ㅅ, ㅇ 등) - 탄탄한 높이", "chars": ['손', '돈', '온', '꽃', '달', '강']},
    {"category": "하단 가로모음 (ㅜ, ㅠ) 및 평면 (ㅡ) 받침 글자", "chars": ['문', '물', '눈', '국', '글', '등']},
]

cards_html = ""
for grp in char_groups:
    cards_html += f"""
    <div style="width: 100%; margin-top: 20px;">
        <h3 style="color: #38bdf8; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 12px;">{grp['category']}</h3>
        <div class="grid">
    """
    for ch in grp['chars']:
        cards_html += f"""
        <div class="card">
            <div class="title">{ch}</div>
            <div class="svg-wrap" id="wrap-{ch}"></div>
            <div class="desc" id="info-{ch}"></div>
        </div>
        """
    cards_html += """
        </div>
    </div>
    """

all_chars = [ch for grp in char_groups for ch in grp['chars']]

html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>한글 조판 규칙 및 동적 Gutter 검증</title>
<style>
body {{ background: #0f172a; color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; }}
.grid {{ display: flex; gap: 14px; flex-wrap: wrap; }}
.card {{ background: #1e293b; padding: 12px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); }}
.title {{ font-size: 20px; font-weight: bold; margin-bottom: 6px; color: #f8fafc; text-align: center; }}
.svg-wrap {{ width: 150px; height: 150px; background: #0b0f19; border-radius: 8px; }}
.desc {{ font-size: 11px; color: #94a3b8; margin-top: 6px; text-align: center; font-family: monospace; }}
</style>
<script src="../assets/hangul_stroke_composer.js"></script>
</head>
<body>
<h2 style="text-align:center; color: #f1f5f9; margin-bottom: 4px;">Context-Aware Rule & 동적 Gutter 한글 조판 엔진 검증</h2>
<p style="text-align:center; color: #64748b; font-size: 14px; margin-top: 0;">폐쇄형/개방형 받침 클래스별 가변 안전거리 및 네거티브 스페이스 균형 확인</p>

{cards_html}

<script>
const allChars = {all_chars};

allChars.forEach(ch => {{
    const plan = HangulStrokeComposer.composeStrokePlan(ch);
    const svg = HangulStrokeComposer.renderComposerSvg(ch, {{ showBadges: true, animated: false }});
    const wrap = document.getElementById(`wrap-${{ch}}`);
    if (wrap) wrap.innerHTML = svg;

    const info = document.getElementById(`info-${{ch}}`);
    if (info && plan.slots) {{
        const cho = plan.slots.find(s => s.role === 'cho');
        const jung = plan.slots.find(s => s.role === 'jung');
        const jong = plan.slots.find(s => s.role === 'jong');
        if (jung && jong) {{
            const gap = jong.y - (jung.y + jung.h);
            info.innerHTML = `중성Y:${{jung.y}} H:${{jung.h}}<br>종성Y:${{jong.y}} (여백:${{gap}}px)`;
        }} else if (jung) {{
            info.innerHTML = `중성Y:${{jung.y}} H:${{jung.h}}`;
        }}
    }}
}});
</script>
</body>
</html>
"""

with open('test/preview_context_rule.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('test/preview_context_rule.html').replace('\\', '/')
p1 = os.path.abspath('test/context_rule_preview.png')
subprocess.run([edge_path, '--headless', '--disable-gpu', f'--screenshot={p1}', '--window-size=1180,920', url])
print('Done capturing context rule preview to test/context_rule_preview.png!')
