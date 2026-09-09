# -*- coding: utf-8 -*-
"""
진짜 붓/펜 획순 드로잉 엔진 (True Calligraphic Stroke Engine) 패치 스크립트
- Arc 제거, 완벽한 3차 베지에(Cubic Bezier C) 곡선 적용
- 실제 펜 스트로크(두께 14px, 라운드 캡) 드로잉 애니메이션
- 획 번호 배지 정확한 시작점 고정
- 모든 획 완료 후 폰트 채움 피날레
"""

import re

CSS_TARGET = re.compile(
    r'/\* ─── STROKE ORDER \(획순 마스킹 엔진\) ─── \*/[\s\S]*?'
    r'@keyframes showStrokeMarker\{to\{opacity:1\}\}'
)

CSS_REPLACEMENT = """/* ─── STROKE ORDER (진짜 붓/펜 획순 드로잉 엔진) ─── */
.stroke-view-container{padding:16px 20px 30px;display:flex;flex-direction:column;align-items:center;min-height:55vh}
.stroke-tabs-row{display:flex;gap:6px;justify-content:center;margin-bottom:12px;flex-wrap:wrap}
.stroke-char-tab{padding:6px 14px;border-radius:12px;background:var(--surface);color:var(--muted);border:1.5px solid var(--border);font-size:15px;font-weight:800;cursor:pointer;transition:.2s;font-family:inherit}
.stroke-char-tab.active{background:var(--accent);color:#fff;border-color:var(--accent);box-shadow:0 2px 10px rgba(99,102,241,.35)}
.stroke-preview-box{width:260px;height:260px;background:var(--card);border:2px dashed var(--accent);border-radius:24px;display:flex;align-items:center;justify-content:center;position:relative;margin-bottom:10px;box-shadow:0 8px 30px rgba(0,0,0,.25);overflow:hidden}
.stroke-preview-box svg{width:240px;height:240px;display:block}
.stroke-controls-row{display:flex;gap:6px;justify-content:center;margin-bottom:14px;flex-wrap:wrap}
.stroke-ctrl-btn{padding:6px 12px;border-radius:14px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-size:12px;font-weight:700;cursor:pointer;transition:.2s;display:inline-flex;align-items:center;gap:4px;font-family:inherit}
.stroke-ctrl-btn:hover{border-color:var(--accent);color:var(--accent)}
.stroke-ctrl-btn.active{background:rgba(99,102,241,.18);border-color:var(--accent);color:var(--accent)}
.stroke-canvas-overlay{position:absolute;top:0;left:0;width:100%;height:100%;touch-action:none;cursor:crosshair;display:none;z-index:10}
.stroke-canvas-overlay.active{display:block}
@keyframes drawStrokeLine{to{stroke-dashoffset:0}}
@keyframes showStrokeMarker{to{opacity:1;transform:scale(1)}}
@keyframes fillFinalGlyph{to{opacity:1}}"""

JS_TARGET = re.compile(
    r'// ══════════════════════════════════════════════════════════════════\s*'
    r'//  한글 획순 마스킹 엔진[\s\S]*?'
    r'function clearStrokeCanvas\(\) \{[\s\S]*?ctx\.clearRect\(0, 0, cvs\.width, cvs\.height\);\s*\}\s*\}'
)

JS_REPLACEMENT = r"""// ══════════════════════════════════════════════════════════════════
//  한글 획순 드로잉 엔진 (True Calligraphic Hangul Stroke Engine)
//  - 국립국어원 표준 획순 100% 준수
//  - 3차 베지에(Cubic Bezier) 곡선 기반 원(ㅇ, ㅎ) 드로잉
//  - 실제 펜 획(두께 14px, 라운드 캡) 순차 애니메이션 + 시작점 번호 배지
//  - 획 완료 후 폰트 채움 피날레 연출
// ══════════════════════════════════════════════════════════════════

const _STROKE_CHOS  = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const _STROKE_JUNGS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const _STROKE_JONGS = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

const _STROKE_DOUBLE_JONGS = {
  'ㄳ': ['ㄱ','ㅅ'], 'ㄵ': ['ㄴ','ㅈ'], 'ㄶ': ['ㄴ','ㅎ'],
  'ㄺ': ['ㄹ','ㄱ'], 'ㄻ': ['ㄹ','ㅁ'], 'ㄼ': ['ㄹ','ㅂ'],
  'ㄽ': ['ㄹ','ㅅ'], 'ㄾ': ['ㄹ','ㅌ'], 'ㄿ': ['ㄹ','ㅍ'],
  'ㅀ': ['ㄹ','ㅎ'], 'ㅄ': ['ㅂ','ㅅ'],
  'ㄲ': ['ㄱ','ㄱ'], 'ㅆ': ['ㅅ','ㅅ']
};

function decomposeHangulSyllable(ch) {
  const code = ch.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return { cho: ch, jung: null, jong: null };
  const jong = code % 28;
  const jung = Math.floor((code - jong) / 28) % 21;
  const cho  = Math.floor((code - jong) / 28 / 21);
  return {
    cho: _STROKE_CHOS[cho],
    jung: _STROKE_JUNGS[jung],
    jong: jong ? _STROKE_JONGS[jong] : null,
    choIdx: cho,
    jungIdx: jung,
    jongIdx: jong
  };
}

// 3차 베지에 곡선(C)으로 완벽하게 구현된 표준 획 경로 DB (정규화 0~100)
const HANGUL_STROKE_DB = {
  // ── 자음 ──
  'ㄱ': [
    { d: 'M 18,22 L 82,22 L 82,85', desc: '1획: 가로 후 세로 꺾임' }
  ],
  'ㄲ': [
    { d: 'M 12,22 L 46,22 L 46,82', desc: '1획: 앞 ㄱ' },
    { d: 'M 54,22 L 88,22 L 88,82', desc: '2획: 뒤 ㄱ' }
  ],
  'ㄴ': [
    { d: 'M 22,18 L 22,82 L 85,82', desc: '1획: 세로 후 가로' }
  ],
  'ㄷ': [
    { d: 'M 18,22 L 82,22',         desc: '1획: 위 가로' },
    { d: 'M 22,22 L 22,82 L 82,82', desc: '2획: 세로 후 아래 가로' }
  ],
  'ㄸ': [
    { d: 'M 10,22 L 45,22',         desc: '1획' },
    { d: 'M 14,22 L 14,82 L 45,82', desc: '2획' },
    { d: 'M 55,22 L 90,22',         desc: '3획' },
    { d: 'M 59,22 L 59,82 L 90,82', desc: '4획' }
  ],
  'ㄹ': [
    { d: 'M 18,20 L 82,20 L 82,48', desc: '1획: ㄱ' },
    { d: 'M 18,48 L 82,48',         desc: '2획: 중간 가로' },
    { d: 'M 18,48 L 18,82 L 85,82', desc: '3획: ㄴ' }
  ],
  'ㅁ': [
    { d: 'M 20,18 L 20,84',         desc: '1획: 왼 세로' },
    { d: 'M 20,20 L 82,20 L 82,84', desc: '2획: 위 가로 후 오른 세로' },
    { d: 'M 18,82 L 84,82',         desc: '3획: 아래 가로' }
  ],
  'ㅂ': [
    { d: 'M 22,18 L 22,82', desc: '1획: 왼 세로' },
    { d: 'M 78,18 L 78,82', desc: '2획: 오른 세로' },
    { d: 'M 20,50 L 80,50', desc: '3획: 중간 가로' },
    { d: 'M 20,82 L 80,82', desc: '4획: 아래 가로' }
  ],
  'ㅃ': [
    { d: 'M 10,18 L 10,82', desc: '1획' },
    { d: 'M 44,18 L 44,82', desc: '2획' },
    { d: 'M 10,50 L 44,50', desc: '3획' },
    { d: 'M 10,82 L 44,82', desc: '4획' },
    { d: 'M 56,18 L 56,82', desc: '5획' },
    { d: 'M 90,18 L 90,82', desc: '6획' },
    { d: 'M 56,50 L 90,50', desc: '7획' },
    { d: 'M 56,82 L 90,82', desc: '8획' }
  ],
  'ㅅ': [
    { d: 'M 50,18 L 18,84', desc: '1획: 왼 사선' },
    { d: 'M 44,42 L 82,84', desc: '2획: 오른 사선' }
  ],
  'ㅆ': [
    { d: 'M 32,18 L 10,82', desc: '1획' },
    { d: 'M 28,42 L 46,82', desc: '2획' },
    { d: 'M 70,18 L 52,82', desc: '3획' },
    { d: 'M 66,42 L 90,82', desc: '4획' }
  ],
  'ㅇ': [
    // 12시에서 반시계 방향으로 그리는 완벽한 3차 베지에 원
    { d: 'M 50,16 C 30,16 16,31 16,50 C 16,69 30,84 50,84 C 70,84 84,69 84,50 C 84,31 70,16 50,16 Z', desc: '1획: 반시계 방향 원' }
  ],
  'ㅈ': [
    { d: 'M 18,22 L 82,22', desc: '1획: 가로' },
    { d: 'M 50,22 L 18,84', desc: '2획: 왼 사선' },
    { d: 'M 44,46 L 82,84', desc: '3획: 오른 사선' }
  ],
  'ㅉ': [
    { d: 'M 10,22 L 46,22', desc: '1획' },
    { d: 'M 28,22 L 10,82', desc: '2획' },
    { d: 'M 24,46 L 46,82', desc: '3획' },
    { d: 'M 54,22 L 90,22', desc: '4획' },
    { d: 'M 72,22 L 54,82', desc: '5획' },
    { d: 'M 68,46 L 90,82', desc: '6획' }
  ],
  'ㅊ': [
    { d: 'M 36,12 L 64,12', desc: '1획: 꼭지 점획' },
    { d: 'M 18,30 L 82,30', desc: '2획: 가로' },
    { d: 'M 50,30 L 18,85', desc: '3획: 왼 사선' },
    { d: 'M 44,52 L 82,85', desc: '4획: 오른 사선' }
  ],
  'ㅋ': [
    { d: 'M 18,20 L 82,20 L 82,84', desc: '1획: ㄱ' },
    { d: 'M 18,50 L 78,50',         desc: '2획: 중간 가로' }
  ],
  'ㅌ': [
    { d: 'M 18,20 L 82,20',         desc: '1획: 상 가로' },
    { d: 'M 18,50 L 78,50',         desc: '2획: 중 가로' },
    { d: 'M 22,20 L 22,82 L 84,82', desc: '3획: 세로 후 하 가로' }
  ],
  'ㅍ': [
    { d: 'M 18,25 L 82,25', desc: '1획: 위 가로' },
    { d: 'M 36,25 L 36,80', desc: '2획: 왼 세로' },
    { d: 'M 64,25 L 64,80', desc: '3획: 오른 세로' },
    { d: 'M 16,80 L 84,80', desc: '4획: 아래 가로' }
  ],
  'ㅎ': [
    { d: 'M 36,12 L 64,12', desc: '1획: 꼭지 점획' },
    { d: 'M 18,28 L 82,28', desc: '2획: 가로' },
    { d: 'M 50,42 C 34,42 22,54 22,68 C 22,82 34,92 50,92 C 66,92 78,82 78,68 C 78,54 66,42 50,42 Z', desc: '3획: 원' }
  ],

  // ── 모음 ──
  'ㅏ': [
    { d: 'M 50,15 L 50,85', desc: '1획: 세로' },
    { d: 'M 50,48 L 85,48', desc: '2획: 가로' }
  ],
  'ㅐ': [
    { d: 'M 35,15 L 35,85', desc: '1획: 왼 세로' },
    { d: 'M 35,48 L 65,48', desc: '2획: 중간 가로' },
    { d: 'M 65,15 L 65,85', desc: '3획: 오른 세로' }
  ],
  'ㅑ': [
    { d: 'M 50,15 L 50,85', desc: '1획: 세로' },
    { d: 'M 50,36 L 85,36', desc: '2획: 위 가로' },
    { d: 'M 50,60 L 85,60', desc: '3획: 아래 가로' }
  ],
  'ㅒ': [
    { d: 'M 35,15 L 35,85', desc: '1획: 왼 세로' },
    { d: 'M 35,36 L 65,36', desc: '2획: 위 가로' },
    { d: 'M 35,60 L 65,60', desc: '3획: 아래 가로' },
    { d: 'M 65,15 L 65,85', desc: '4획: 오른 세로' }
  ],
  'ㅓ': [
    { d: 'M 15,48 L 50,48', desc: '1획: 가로' },
    { d: 'M 50,15 L 50,85', desc: '2획: 세로' }
  ],
  'ㅔ': [
    { d: 'M 35,48 L 65,48', desc: '1획: 가로' },
    { d: 'M 35,15 L 35,85', desc: '2획: 왼 세로' },
    { d: 'M 65,15 L 65,85', desc: '3획: 오른 세로' }
  ],
  'ㅕ': [
    { d: 'M 15,36 L 50,36', desc: '1획: 위 가로' },
    { d: 'M 15,60 L 50,60', desc: '2획: 아래 가로' },
    { d: 'M 50,15 L 50,85', desc: '3획: 세로' }
  ],
  'ㅖ': [
    { d: 'M 35,36 L 65,36', desc: '1획: 위 가로' },
    { d: 'M 35,60 L 65,60', desc: '2획: 아래 가로' },
    { d: 'M 35,15 L 35,85', desc: '3획: 왼 세로' },
    { d: 'M 65,15 L 65,85', desc: '4획: 오른 세로' }
  ],
  'ㅗ': [
    { d: 'M 50,18 L 50,56', desc: '1획: 세로' },
    { d: 'M 15,56 L 85,56', desc: '2획: 가로' }
  ],
  'ㅛ': [
    { d: 'M 36,18 L 36,56', desc: '1획: 왼 세로' },
    { d: 'M 64,18 L 64,56', desc: '2획: 오른 세로' },
    { d: 'M 15,56 L 85,56', desc: '3획: 가로' }
  ],
  'ㅜ': [
    { d: 'M 15,44 L 85,44', desc: '1획: 가로' },
    { d: 'M 50,44 L 50,82', desc: '2획: 세로' }
  ],
  'ㅠ': [
    { d: 'M 15,44 L 85,44', desc: '1획: 가로' },
    { d: 'M 36,44 L 36,82', desc: '2획: 왼 세로' },
    { d: 'M 64,44 L 64,82', desc: '3획: 오른 세로' }
  ],
  'ㅡ': [
    { d: 'M 15,50 L 85,50', desc: '1획: 가로' }
  ],
  'ㅢ': [
    { d: 'M 15,50 L 68,50', desc: '1획: 가로' },
    { d: 'M 72,18 L 72,82', desc: '2획: 세로' }
  ],
  'ㅣ': [
    { d: 'M 50,15 L 50,85', desc: '1획: 세로' }
  ]
};

// 6대 음절 레이아웃 분해 (viewBox 0 0 200 200 기준)
function getSyllableLayoutParts(ch) {
  const dec = decomposeHangulSyllable(ch);
  if (!dec.jung) {
    return [{ jamo: dec.cho || ch, x: 25, y: 25, w: 150, h: 150, role: 'single' }];
  }

  const { cho, jung, jong, jungIdx } = dec;
  const hasJong = !!jong;

  const isVert = [0,1,2,3,4,5,6,7,20].includes(jungIdx);
  const isHoriz = [8,12,13,17,18].includes(jungIdx);

  const parts = [];

  if (isVert) {
    if (!hasJong) {
      parts.push({ jamo: cho, x: 26, y: 35, w: 72, h: 125, role: 'cho' });
      parts.push({ jamo: jung, x: 104, y: 30, w: 72, h: 135, role: 'jung' });
    } else {
      parts.push({ jamo: cho, x: 26, y: 26, w: 70, h: 72, role: 'cho' });
      parts.push({ jamo: jung, x: 104, y: 24, w: 70, h: 86, role: 'jung' });
      parts.push({ jamo: jong, x: 40, y: 110, w: 120, h: 66, role: 'jong' });
    }
  } else if (isHoriz) {
    if (!hasJong) {
      parts.push({ jamo: cho, x: 45, y: 26, w: 110, h: 74, role: 'cho' });
      parts.push({ jamo: jung, x: 26, y: 104, w: 148, h: 68, role: 'jung' });
    } else {
      parts.push({ jamo: cho, x: 48, y: 20, w: 104, h: 56, role: 'cho' });
      parts.push({ jamo: jung, x: 30, y: 78, w: 140, h: 48, role: 'jung' });
      parts.push({ jamo: jong, x: 44, y: 124, w: 112, h: 56, role: 'jong' });
    }
  } else {
    const compMap = {
      'ㅘ': ['ㅗ','ㅏ'], 'ㅙ': ['ㅗ','ㅐ'], 'ㅚ': ['ㅗ','ㅣ'],
      'ㅝ': ['ㅜ','ㅓ'], 'ㅞ': ['ㅜ','ㅔ'], 'ㅟ': ['ㅜ','ㅣ'],
      'ㅢ': ['ㅡ','ㅣ']
    };
    const [subH, subV] = compMap[jung] || ['ㅡ','ㅣ'];

    if (!hasJong) {
      parts.push({ jamo: cho, x: 28, y: 28, w: 70, h: 72, role: 'cho' });
      parts.push({ jamo: subH, x: 24, y: 102, w: 82, h: 65, role: 'jung_h' });
      parts.push({ jamo: subV, x: 108, y: 28, w: 68, h: 138, role: 'jung_v' });
    } else {
      parts.push({ jamo: cho, x: 30, y: 22, w: 66, h: 56, role: 'cho' });
      parts.push({ jamo: subH, x: 26, y: 78, w: 76, h: 44, role: 'jung_h' });
      parts.push({ jamo: subV, x: 104, y: 22, w: 66, h: 100, role: 'jung_v' });
      parts.push({ jamo: jong, x: 42, y: 124, w: 116, h: 54, role: 'jong' });
    }
  }

  return parts;
}

// 오직 M, L, C, Z만 사용하므로 숫자 쌍(x, y) 변환이 100% 안전함
function scalePathCoords(d, x, y, w, h) {
  let i = 0;
  return d.replace(/[+-]?\d+\.?\d*/g, (num) => {
    const val = parseFloat(num);
    const res = (i % 2 === 0) ? (x + (val / 100) * w).toFixed(1) : (y + (val / 100) * h).toFixed(1);
    i++;
    return res;
  });
}

function calcPathLength(d) {
  const nums = d.replace(/[MCLZAmclza]/g,' ').trim().split(/[\s,]+/).filter(Boolean).map(Number);
  let len = 0;
  for (let i = 2; i < nums.length - 1; i += 2) {
    const dx = nums[i] - nums[i-2];
    const dy = nums[i+1] - nums[i-1];
    len += Math.sqrt(dx*dx + dy*dy);
  }
  return Math.max(len, 80);
}

// 획순 뷰 상태
if (typeof S.strokeCharIdx === 'undefined') S.strokeCharIdx = 0;
if (typeof S.strokeSpeed === 'undefined') S.strokeSpeed = 1.0;
if (typeof S.strokeShowNumbers === 'undefined') S.strokeShowNumbers = true;
if (typeof S.strokeDrawMode === 'undefined') S.strokeDrawMode = false;

function renderStrokeMode(){
  const words = TOPIK_DATA[S.level] || [];
  if (!words.length) {
    document.getElementById('mode-content').innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted)">데이터 없음</div>';
    return;
  }
  if (S.strokeIndex >= words.length) S.strokeIndex = 0;
  const w = words[S.strokeIndex];

  // 단어 음절 목록 분해
  const chars = [...w.term];
  if (S.strokeCharIdx >= chars.length) S.strokeCharIdx = 0;
  const curChar = chars[S.strokeCharIdx] || chars[0];

  // 음절 선택 탭 UI
  const charTabsHTML = chars.map((c, idx) =>
    `<button class="stroke-char-tab ${idx === S.strokeCharIdx ? 'active' : ''}" onclick="setStrokeChar(${idx})">${c}</button>`
  ).join('');

  // 음절 구조 및 획 수집
  const parts = getSyllableLayoutParts(curChar);
  const strokes = [];

  parts.forEach(part => {
    let jamos = [part.jamo];
    if (part.role === 'jong' && _STROKE_DOUBLE_JONGS[part.jamo]) {
      jamos = _STROKE_DOUBLE_JONGS[part.jamo];
    }
    jamos.forEach((j, subIdx) => {
      const list = HANGUL_STROKE_DB[j] || [];
      let sx = part.x, sw = part.w;
      if (jamos.length > 1) {
        sw = part.w * 0.48;
        sx = subIdx === 0 ? part.x : part.x + part.w * 0.52;
      }
      list.forEach(st => {
        strokes.push({
          d: scalePathCoords(st.d, sx, part.y, sw, part.h),
          desc: st.desc
        });
      });
    });
  });

  const strokeDur = 0.65 / S.strokeSpeed;
  const gapDur = 0.22 / S.strokeSpeed;
  const totalAnimTime = strokes.length * (strokeDur + gapDur);

  let animatedStrokePaths = '';
  let numberMarkers = '';
  // 획순별 고급스러운 그라데이션 컬러 팔레트
  const strokeColors = ['#818cf8', '#a78bfa', '#f472b6', '#38bdf8', '#34d399', '#fbbf24', '#f87171', '#c084fc', '#e879f9'];

  strokes.forEach((st, idx) => {
    const len = calcPathLength(st.d);
    const delay = idx * (strokeDur + gapDur);
    const color = strokeColors[idx % strokeColors.length];

    // 실제 붓/펜 스트로크 (두께 14px, 부드러운 라운드 캡)
    animatedStrokePaths += `
      <path d="${st.d}"
            stroke="${color}"
            stroke-width="14"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
            stroke-dasharray="${len.toFixed(1)}"
            stroke-dashoffset="${len.toFixed(1)}"
            style="animation: drawStrokeLine ${strokeDur.toFixed(2)}s ease-out ${delay.toFixed(2)}s forwards;" />
    `;

    if (S.strokeShowNumbers) {
      const nums = st.d.replace(/[MCLZAmclza]/g,' ').trim().split(/[\s,]+/).filter(Boolean).map(Number);
      const bx = nums[0] || 100;
      const by = nums[1] || 100;
      numberMarkers += `
        <g style="opacity:0; transform-origin:${bx}px ${by}px; animation: showStrokeMarker 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay.toFixed(2)}s forwards;">
          <circle cx="${bx}" cy="${by}" r="9" fill="#0f172a" stroke="${color}" stroke-width="2.5"/>
          <text x="${bx}" y="${by}" fill="${color}" font-size="10" font-weight="900" text-anchor="middle" dominant-baseline="central" font-family="'Inter', sans-serif">${idx+1}</text>
        </g>
      `;
    }
  });

  const svgHTML = `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <!-- 가이드 눈금 격자 -->
      <line x1="100" y1="12" x2="100" y2="188" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <line x1="12" y1="100" x2="188" y2="100" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <line x1="12" y1="12" x2="188" y2="188" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="188" y1="12" x2="12" y2="188" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="3,3"/>
      <rect x="14" y="14" width="172" height="172" rx="16" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1.5" stroke-dasharray="4,4"/>

      <!-- 1. 밑그림 가이드 폰트 (연한 회색의 완벽한 Noto Sans 글씨) -->
      <text x="100" y="105"
            text-anchor="middle" dominant-baseline="central"
            font-size="135" font-weight="900"
            font-family="'Noto Sans KR', sans-serif"
            fill="rgba(255,255,255,0.08)">${curChar}</text>

      <!-- 2. 실제 획순대로 그어지는 붓/펜 스트로크 선 -->
      ${animatedStrokePaths}

      <!-- 3. 모든 획 완료 후 완성형 글씨 부드럽게 채움 피날레 -->
      <text x="100" y="105"
            text-anchor="middle" dominant-baseline="central"
            font-size="135" font-weight="900"
            font-family="'Noto Sans KR', sans-serif"
            fill="var(--accent)"
            style="opacity:0; animation: fillFinalGlyph 0.6s ease ${(totalAnimTime + 0.3).toFixed(2)}s forwards;">${curChar}</text>

      <!-- 4. 획 번호 마커 레이어 -->
      ${numberMarkers}
    </svg>
  `;

  document.getElementById('mode-content').innerHTML = `
    <div class="stroke-view-container">
      <div style="font-size:12px;color:var(--muted);margin-bottom:8px">
        ${S.strokeIndex+1} / ${words.length} 단어 획순 연습 · 총 <b style="color:var(--accent)">${strokes.length}획</b>
      </div>

      <!-- 단어 음절 탭 -->
      <div class="stroke-tabs-row">${charTabsHTML}</div>

      <!-- 획순 캔버스 박스 -->
      <div class="stroke-preview-box" id="stroke-preview-box">
        ${svgHTML}
        <!-- 직접 따라쓰기 캔버스 오버레이 -->
        <canvas class="stroke-canvas-overlay ${S.strokeDrawMode ? 'active' : ''}" id="stroke-draw-canvas" width="260" height="260"></canvas>
      </div>

      <!-- 컨트롤 버튼 패널 -->
      <div class="stroke-controls-row">
        <button class="stroke-ctrl-btn" onclick="replayStroke()">↺ 다시보기</button>
        <button class="stroke-ctrl-btn" onclick="toggleStrokeSpeed()">⚡ ${S.strokeSpeed.toFixed(1)}x</button>
        <button class="stroke-ctrl-btn ${S.strokeShowNumbers ? 'active' : ''}" onclick="toggleStrokeNumbers()">① 번호 ${S.strokeShowNumbers ? 'ON' : 'OFF'}</button>
        <button class="stroke-ctrl-btn ${S.strokeDrawMode ? 'active' : ''}" onclick="toggleStrokeDrawMode()">✏️ 직접 쓰기 ${S.strokeDrawMode ? 'ON' : 'OFF'}</button>
        ${S.strokeDrawMode ? '<button class="stroke-ctrl-btn" onclick="clearStrokeCanvas()">🧹 지우기</button>' : ''}
      </div>

      <!-- 단어 정보 및 발음 -->
      <div style="font-size:24px;font-weight:900;margin-bottom:4px;color:var(--text)">${w.term}</div>
      <div style="font-size:14px;color:var(--muted);margin-bottom:14px">[${w.pronunciation}] · ${w.meaning}</div>
      <button class="tts-btn" style="margin-bottom:20px" onclick="speakWord('${curChar}')">🔊 '${curChar}' 발음 듣기</button>

      <!-- 이전 / 다음 단어 이동 -->
      <div style="display:flex;gap:12px;width:100%;max-width:320px">
        <button class="btn-secondary" style="flex:1" onclick="prevStroke()">← 이전 단어</button>
        <button class="btn-primary" style="flex:1" onclick="nextStroke()">다음 단어 →</button>
      </div>
    </div>`;

  if (S.strokeDrawMode) {
    setupStrokeDrawingCanvas();
  }
}

function setStrokeChar(idx) {
  S.strokeCharIdx = idx;
  renderStrokeMode();
}

function replayStroke() {
  renderStrokeMode();
}

function toggleStrokeSpeed() {
  const speeds = [0.5, 1.0, 1.5, 2.0];
  const idx = speeds.indexOf(S.strokeSpeed);
  S.strokeSpeed = speeds[(idx + 1) % speeds.length];
  renderStrokeMode();
}

function toggleStrokeNumbers() {
  S.strokeShowNumbers = !S.strokeShowNumbers;
  renderStrokeMode();
}

function toggleStrokeDrawMode() {
  S.strokeDrawMode = !S.strokeDrawMode;
  renderStrokeMode();
}

function nextStroke(){
  const words = TOPIK_DATA[S.level] || [];
  S.strokeIndex = (S.strokeIndex + 1) % words.length;
  S.strokeCharIdx = 0;
  renderStrokeMode();
}

function prevStroke(){
  const words = TOPIK_DATA[S.level] || [];
  S.strokeIndex = (S.strokeIndex - 1 + words.length) % words.length;
  S.strokeCharIdx = 0;
  renderStrokeMode();
}

// ── 직접 따라쓰기 캔버스 제어 ──
function setupStrokeDrawingCanvas() {
  const cvs = document.getElementById('stroke-draw-canvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  let drawing = false;

  function getPos(e) {
    const r = cvs.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    return { x: cx * (cvs.width / r.width), y: cy * (cvs.height / r.height) };
  }

  function start(e) {
    drawing = true;
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    e.preventDefault();
  }

  function move(e) {
    if (!drawing) return;
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    e.preventDefault();
  }

  function end() {
    drawing = false;
  }

  cvs.onmousedown = start;
  cvs.onmousemove = move;
  window.addEventListener('mouseup', end);
  cvs.ontouchstart = start;
  cvs.ontouchmove = move;
  cvs.ontouchend = end;
}

function clearStrokeCanvas() {
  const cvs = document.getElementById('stroke-draw-canvas');
  if (cvs) {
    const ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, cvs.width, cvs.height);
  }
}"""

def patch_file(filepath):
    print(f"Reading {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. CSS 교체
    if CSS_TARGET.search(content):
        content = CSS_TARGET.sub(lambda m: CSS_REPLACEMENT, content, count=1)
        print(f"  [OK] CSS patched in {filepath}")
    else:
        print(f"  [WARN] CSS target not found in {filepath}")

    # 2. JS 함수 교체
    if JS_TARGET.search(content):
        content = JS_TARGET.sub(lambda m: JS_REPLACEMENT, content, count=1)
        print(f"  [OK] JS stroke engine patched in {filepath}")
    else:
        print(f"  [WARN] JS target not found in {filepath}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Finished writing {filepath}\n")

if __name__ == '__main__':
    for path in ['c:/Myproject/auto_income/index.html', 'c:/Myproject/auto_income/web_simulator.html']:
        patch_file(path)
