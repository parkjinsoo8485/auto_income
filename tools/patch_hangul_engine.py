# -*- coding: utf-8 -*-
"""
tools/patch_hangul_engine.py
HangulStrokeComposer 모듈 기반으로 web_simulator.html 및 index.html의 획순 엔진 교체
"""

import re
import sys

NEW_CSS = """/* ─── STROKE ORDER (한글 획순 벡터 합성 엔진) ─── */
.stroke-view-container{padding:16px 20px 30px;display:flex;flex-direction:column;align-items:center;min-height:55vh}
.stroke-tabs-row{display:flex;gap:6px;justify-content:center;margin-bottom:12px;flex-wrap:wrap}
.stroke-char-tab{padding:6px 14px;border-radius:12px;background:var(--surface);color:var(--muted);border:1.5px solid var(--border);font-size:15px;font-weight:800;cursor:pointer;transition:.2s;font-family:inherit}
.stroke-char-tab.active{background:var(--accent);color:#0f172a;border-color:var(--accent);box-shadow:0 2px 10px rgba(56,189,248,.35)}
.stroke-preview-box{width:260px;height:260px;background:var(--card);border:2px dashed var(--accent);border-radius:24px;display:flex;align-items:center;justify-content:center;position:relative;margin-bottom:10px;box-shadow:0 8px 30px rgba(0,0,0,.25);overflow:hidden}
.stroke-preview-box svg{width:240px;height:240px;display:block}
.stroke-controls-row{display:flex;gap:6px;justify-content:center;margin-bottom:14px;flex-wrap:wrap}
.stroke-ctrl-btn{padding:6px 12px;border-radius:14px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:12px;font-weight:700;cursor:pointer;transition:.2s;display:inline-flex;align-items:center;gap:4px;font-family:inherit}
.stroke-ctrl-btn:hover{border-color:var(--accent);color:var(--accent)}
.stroke-ctrl-btn.active{background:rgba(56,189,248,.18);border-color:var(--accent);color:var(--accent)}
.stroke-canvas-overlay{position:absolute;top:0;left:0;width:100%;height:100%;touch-action:none;cursor:crosshair;display:none;z-index:10}
.stroke-canvas-overlay.active{display:block}
@keyframes hangulStrokeDraw{to{stroke-dashoffset:0}}
@keyframes hangulMarkerShow{to{opacity:1;transform:scale(1)}}
@keyframes hangulGlyphFinale{to{opacity:1}}"""

with open('assets/hangul_stroke_composer.js', 'r', encoding='utf-8') as f:
    COMPOSER_JS = f.read()

NEW_JS = f"""// ══════════════════════════════════════════════════════════════════
//  한글 폰트 벡터 데이터 및 6대 결합 규칙 기반 한글 획순 엔진
//  (HangulStrokeComposer Integrated Engine)
// ══════════════════════════════════════════════════════════════════

{COMPOSER_JS}

// ── 전역 획순 뷰 상태 ──
if (typeof S.strokeCharIdx === 'undefined') S.strokeCharIdx = 0;
if (typeof S.strokeSpeed === 'undefined') S.strokeSpeed = 1.0;
if (typeof S.strokeShowNumbers === 'undefined') S.strokeShowNumbers = true;
if (typeof S.strokeDrawMode === 'undefined') S.strokeDrawMode = false;
if (typeof S.strokeStepIdx === 'undefined') S.strokeStepIdx = -1; // -1: 전체 애니메이션, >=0: 특정 획

function renderStrokeMode() {{
  const words = TOPIK_DATA[S.level] || [];
  if (!words.length) {{
    document.getElementById('mode-content').innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted)">데이터 없음</div>';
    return;
  }}
  if (S.strokeIndex >= words.length) S.strokeIndex = 0;
  const w = words[S.strokeIndex];

  // 단어 내 음절 분해
  const chars = [...w.term];
  if (S.strokeCharIdx >= chars.length) S.strokeCharIdx = 0;
  const curChar = chars[S.strokeCharIdx] || chars[0];

  // 음절 선택 탭 UI
  const charTabsHTML = chars.map((c, idx) =>
    `<button class="stroke-char-tab ${{idx === S.strokeCharIdx ? 'active' : ''}}" onclick="setStrokeChar(${{idx}})">${{c}}</button>`
  ).join('');

  // 획순 계획 분석
  const plan = HangulStrokeComposer.composeStrokePlan(curChar);
  const totalStrokes = plan.strokes.length;

  // SVG 렌더링
  const svgHTML = HangulStrokeComposer.renderComposerSvg(curChar, {{
    showGrid: true,
    showNumbers: S.strokeShowNumbers,
    showArrows: false,
    speed: S.strokeSpeed,
    animated: S.strokeStepIdx < 0,
    activeStroke: S.strokeStepIdx
  }});

  const stepText = S.strokeStepIdx >= 0 
    ? `${{S.strokeStepIdx + 1}}획 / ${{totalStrokes}}획`
    : `총 ${{totalStrokes}}획 순서대로 재생`;

  document.getElementById('mode-content').innerHTML = `
    <div class="stroke-view-container">
      <!-- 음절 탭 -->
      ${{chars.length > 1 ? `<div class="stroke-tabs-row">${{charTabsHTML}}</div>` : ''}}

      <!-- 획순 뷰어 & 캔버스 -->
      <div class="stroke-preview-box" id="strokePreviewBox">
        ${{svgHTML}}
        <canvas id="stroke-draw-canvas" class="stroke-canvas-overlay ${{S.strokeDrawMode ? 'active' : ''}}"></canvas>
      </div>

      <!-- 음절 설명 & 획 안내 -->
      <div style="text-align:center;margin-bottom:12px">
        <div style="font-size:22px;font-weight:900;color:var(--accent);letter-spacing:1px">${{curChar}}</div>
        <div style="font-size:13px;color:var(--muted);font-weight:600;margin-top:2px">${{w.meaning || ''}} (${{stepText}})</div>
      </div>

      <!-- 제어 버튼 행 1: 재생 / 단계 이동 -->
      <div class="stroke-controls-row">
        <button class="stroke-ctrl-btn" onclick="replayStroke()">🔄 다시 재생</button>
        <button class="stroke-ctrl-btn" onclick="stepStrokePrev()">◀ 이전 획</button>
        <button class="stroke-ctrl-btn" onclick="stepStrokeNext()">다음 획 ▶</button>
      </div>

      <!-- 제어 버튼 행 2: 옵션 / 따라쓰기 -->
      <div class="stroke-controls-row">
        <button class="stroke-ctrl-btn" onclick="toggleStrokeSpeed()">⚡ ${{S.strokeSpeed}}x</button>
        <button class="stroke-ctrl-btn ${{S.strokeShowNumbers ? 'active' : ''}}" onclick="toggleStrokeNumbers()">🔢 번호</button>
        <button class="stroke-ctrl-btn ${{S.strokeDrawMode ? 'active' : ''}}" onclick="toggleStrokeDrawMode()">✏️ 직접 쓰기</button>
        ${{S.strokeDrawMode ? '<button class="stroke-ctrl-btn" onclick="clearStrokeCanvas()">🧹 지우기</button>' : ''}}
      </div>

      <!-- 단어 이동 네비게이션 -->
      <div style="display:flex;gap:12px;margin-top:10px">
        <button class="btn" style="padding:8px 20px" onclick="prevStroke()">◀ 이전 단어</button>
        <button class="btn" style="padding:8px 20px" onclick="nextStroke()">다음 단어 ▶</button>
      </div>
    </div>
  `;

  if (S.strokeDrawMode) {{
    setupStrokeDrawingCanvas();
  }}
}}

function setStrokeChar(idx) {{
  S.strokeCharIdx = idx;
  S.strokeStepIdx = -1;
  renderStrokeMode();
}}

function replayStroke() {{
  S.strokeStepIdx = -1;
  renderStrokeMode();
}}

function stepStrokePrev() {{
  const words = TOPIK_DATA[S.level] || [];
  const w = words[S.strokeIndex];
  if (!w) return;
  const curChar = [...w.term][S.strokeCharIdx] || w.term[0];
  const plan = HangulStrokeComposer.composeStrokePlan(curChar);
  const total = plan.strokes.length;

  if (S.strokeStepIdx < 0) {{
    S.strokeStepIdx = total - 1;
  }} else {{
    S.strokeStepIdx = Math.max(0, S.strokeStepIdx - 1);
  }}
  renderStrokeMode();
}}

function stepStrokeNext() {{
  const words = TOPIK_DATA[S.level] || [];
  const w = words[S.strokeIndex];
  if (!w) return;
  const curChar = [...w.term][S.strokeCharIdx] || w.term[0];
  const plan = HangulStrokeComposer.composeStrokePlan(curChar);
  const total = plan.strokes.length;

  if (S.strokeStepIdx < 0) {{
    S.strokeStepIdx = 0;
  }} else {{
    S.strokeStepIdx = Math.min(total - 1, S.strokeStepIdx + 1);
  }}
  renderStrokeMode();
}}

function toggleStrokeSpeed() {{
  const speeds = [0.5, 1.0, 1.5, 2.0];
  const idx = speeds.indexOf(S.strokeSpeed);
  S.strokeSpeed = speeds[(idx + 1) % speeds.length];
  renderStrokeMode();
}}

function toggleStrokeNumbers() {{
  S.strokeShowNumbers = !S.strokeShowNumbers;
  renderStrokeMode();
}}

function toggleStrokeDrawMode() {{
  S.strokeDrawMode = !S.strokeDrawMode;
  renderStrokeMode();
}}

function nextStroke() {{
  const words = TOPIK_DATA[S.level] || [];
  S.strokeIndex = (S.strokeIndex + 1) % words.length;
  S.strokeCharIdx = 0;
  S.strokeStepIdx = -1;
  renderStrokeMode();
}}

function prevStroke() {{
  const words = TOPIK_DATA[S.level] || [];
  S.strokeIndex = (S.strokeIndex - 1 + words.length) % words.length;
  S.strokeCharIdx = 0;
  S.strokeStepIdx = -1;
  renderStrokeMode();
}}

// ── 따라쓰기 캔버스 제어 ──
function setupStrokeDrawingCanvas() {{
  const cvs = document.getElementById('stroke-draw-canvas');
  if (!cvs) return;
  const box = document.getElementById('strokePreviewBox');
  cvs.width = box.clientWidth || 260;
  cvs.height = box.clientHeight || 260;

  const ctx = cvs.getContext('2d');
  let drawing = false;

  function getPos(e) {{
    const r = cvs.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    return {{ x: cx * (cvs.width / r.width), y: cy * (cvs.height / r.height) }};
  }}

  function start(e) {{
    drawing = true;
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    e.preventDefault();
  }}

  function move(e) {{
    if (!drawing) return;
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    e.preventDefault();
  }}

  function end() {{
    drawing = false;
  }}

  cvs.onmousedown = start;
  cvs.onmousemove = move;
  window.addEventListener('mouseup', end);
  cvs.ontouchstart = start;
  cvs.ontouchmove = move;
  cvs.ontouchend = end;
}}

function clearStrokeCanvas() {{
  const cvs = document.getElementById('stroke-draw-canvas');
  if (cvs) {{
    const ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, cvs.width, cvs.height);
  }}
}}"""

def patch_file(filepath):
    print(f"Reading {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # 1. CSS 교체 (STROKE ORDER 시작부터 showStrokeMarker 끝까지)
    css_start = None
    css_end = None
    for i, line in enumerate(lines):
        if 'STROKE ORDER' in line:
            css_start = i
        if css_start is not None and css_end is None and 'showStrokeMarker' in line:
            css_end = i

    if css_start is not None and css_end is not None:
        print(f"  [CSS] Found from line {css_start+1} to {css_end+1}")
        lines = lines[:css_start] + [NEW_CSS + '\n'] + lines[css_end+1:]
    else:
        print(f"  [WARN] CSS block not matched in {filepath}")

    # 2. JS 교체
    js_start = None
    js_end = None
    for i, line in enumerate(lines):
        if '마스크 와이프 엔진' in line or '덮어쓰기 마스크 엔진' in line or '한글 획순 마스킹 엔진' in line:
            js_start = i - 1
        if js_start is not None and 'function clearStrokeCanvas()' in line:
            for j in range(i, min(len(lines), i+40)):
                if lines[j].strip() == '}':
                    js_end = j
                    break

    if js_start is not None and js_end is not None:
        print(f"  [JS] Found from line {js_start+1} to {js_end+1}")
        lines = lines[:js_start] + [NEW_JS + '\n'] + lines[js_end+1:]
    else:
        print(f"  [WARN] JS block not matched in {filepath}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f"Successfully patched {filepath}\n")

if __name__ == '__main__':
    for path in ['web_simulator.html', 'index.html']:
        patch_file(path)
