# -*- coding: utf-8 -*-
"""
완벽한 한글 획순 덮어쓰기 마스크 엔진 (Perfect Hangul Stroke Reveal Mask Engine) 패치 스크립트
- 밑그림의 완성형 폰트와 100% 동일한 Noto Sans KR 글리프를 획순에 맞춰 완벽하게 덮어씀(Overwrite)
- 폰트 실제 렌더링 범위(X: 40~160, Y: 50~175)에 정밀하게 일치시킨 6대 음절 레이아웃 분해
- 3차 베지에 곡선 원(ㅇ, ㅎ) 및 모음/받침 결합에 따른 사선 'ㄱ' 등 문맥 지능형 획순 적용
- 획 번호 배지(①, ②, ③...) 각 획 시작점 정밀 고정
- 왜곡이나 잔여물(선 튀어나옴) 없이 100% 깔끔하게 완성형 글씨가 채워지는 미려한 경험 제공
"""

import re
import sys

CSS_TARGET = re.compile(
    r'/\* ─── STROKE ORDER \(진짜 붓/펜 획순 드로잉 엔진\) ─── \*/[\s\S]*?'
    r'@keyframes fillFinalGlyph\{to\{opacity:1\}\}'
)

CSS_REPLACEMENT = """/* ─── STROKE ORDER (완벽한 한글 획순 덮어쓰기 마스크 엔진) ─── */
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
@keyframes drawStrokeMask{to{stroke-dashoffset:0}}
@keyframes showStrokeMarker{to{opacity:1;transform:scale(1)}}"""

JS_TARGET = re.compile(
    r'// ══════════════════════════════════════════════════════════════════\s*'
    r'//  한글 획순 드로잉 엔진[\s\S]*?'
    r'function clearStrokeCanvas\(\) \{[\s\S]*?ctx\.clearRect\(0, 0, cvs\.width, cvs\.height\);\s*\}\s*\}'
)

JS_REPLACEMENT = r"""// ══════════════════════════════════════════════════════════════════
//  완벽한 한글 획순 덮어쓰기 마스크 엔진 (Perfect Hangul Stroke Reveal Mask Engine)
//  - 밑그림의 완성형 폰트와 100% 동일한 글리프 위에 획순대로 정확하게 덮어씀(Overwrite)
//  - 국립국어원 표준 획순 100% 준수
//  - Noto Sans KR 폰트 실제 렌더링 범위(X:40~160, Y:50~175)에 완벽 일치하는 6대 레이아웃
//  - 3차 베지에 곡선 원(ㅇ, ㅎ) 및 문맥 지능형 사선/직각 획 자동 적용
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

// 문맥 지능형 표준 획 경로 DB (정규화 0~100)
function getJamoStrokes(jamo, role, isVert, hasJong) {
  if (jamo === 'ㄱ') {
    if (role === 'cho' && isVert && !hasJong) {
      return [{ d: 'M 6,10 L 94,10 L 32,92', desc: '1획: 가로 후 왼사선' }];
    }
    return [{ d: 'M 6,10 L 94,10 L 94,92', desc: '1획: 가로 후 세로' }];
  }
  if (jamo === 'ㄲ') {
    if (role === 'cho' && isVert && !hasJong) {
      return [
        { d: 'M 6,10 L 48,10 L 20,92', desc: '1획: 앞 ㄱ 사선' },
        { d: 'M 52,10 L 94,10 L 44,92', desc: '2획: 뒤 ㄱ 사선' }
      ];
    }
    return [
      { d: 'M 6,10 L 46,10 L 46,92', desc: '1획: 앞 ㄱ' },
      { d: 'M 54,10 L 94,10 L 94,92', desc: '2획: 뒤 ㄱ' }
    ];
  }
  if (jamo === 'ㅋ') {
    if (role === 'cho' && isVert && !hasJong) {
      return [
        { d: 'M 6,10 L 94,10 L 32,92', desc: '1획: 가로 후 왼사선' },
        { d: 'M 6,48 L 76,48', desc: '2획: 중간 가로' }
      ];
    }
    return [
      { d: 'M 6,10 L 94,10 L 94,92', desc: '1획: ㄱ' },
      { d: 'M 6,50 L 90,50', desc: '2획: 중간 가로' }
    ];
  }

  const BASE_DB = {
    'ㄴ': [{ d: 'M 8,8 L 8,92 L 94,92', desc: '1획: 세로 후 가로' }],
    'ㄷ': [{ d: 'M 6,10 L 94,10', desc: '1획: 위 가로' }, { d: 'M 8,10 L 8,92 L 94,92', desc: '2획: ㄴ' }],
    'ㄸ': [
      { d: 'M 6,10 L 46,10', desc: '1획' }, { d: 'M 8,10 L 8,92 L 46,92', desc: '2획' },
      { d: 'M 54,10 L 94,10', desc: '3획' }, { d: 'M 56,10 L 56,92 L 94,92', desc: '4획' }
    ],
    'ㄹ': [
      { d: 'M 6,10 L 94,10 L 94,48', desc: '1획: ㄱ' },
      { d: 'M 6,48 L 94,48',         desc: '2획: 중간 가로' },
      { d: 'M 8,48 L 8,92 L 94,92', desc: '3획: ㄴ' }
    ],
    'ㅁ': [
      { d: 'M 8,8 L 8,94',         desc: '1획: 왼 세로' },
      { d: 'M 8,10 L 94,10 L 94,94', desc: '2획: 위 가로 후 오른 세로' },
      { d: 'M 6,92 L 96,92',         desc: '3획: 아래 가로' }
    ],
    'ㅂ': [
      { d: 'M 10,8 L 10,94', desc: '1획: 왼 세로' },
      { d: 'M 90,8 L 90,94', desc: '2획: 오른 세로' },
      { d: 'M 8,50 L 92,50', desc: '3획: 중간 가로' },
      { d: 'M 8,92 L 92,92', desc: '4획: 아래 가로' }
    ],
    'ㅃ': [
      { d: 'M 6,8 L 6,94', desc: '1획' }, { d: 'M 44,8 L 44,94', desc: '2획' },
      { d: 'M 4,50 L 46,50', desc: '3획' }, { d: 'M 4,92 L 46,92', desc: '4획' },
      { d: 'M 56,8 L 56,94', desc: '5획' }, { d: 'M 94,8 L 94,94', desc: '6획' },
      { d: 'M 54,50 L 96,50', desc: '7획' }, { d: 'M 54,92 L 96,92', desc: '8획' }
    ],
    'ㅅ': [
      { d: 'M 50,6 L 6,94', desc: '1획: 왼 사선' },
      { d: 'M 44,45 L 94,94', desc: '2획: 오른 사선' }
    ],
    'ㅆ': [
      { d: 'M 30,6 L 4,94', desc: '1획' }, { d: 'M 26,45 L 48,94', desc: '2획' },
      { d: 'M 72,6 L 50,94', desc: '3획' }, { d: 'M 68,45 L 96,94', desc: '4획' }
    ],
    'ㅇ': [
      // 12시에서 반시계 방향으로 그리는 완벽한 3차 베지에 원
      { d: 'M 50,6 C 24,6 6,24 6,50 C 6,76 24,94 50,94 C 76,94 94,76 94,50 C 94,24 76,6 50,6 Z', desc: '1획: 원' }
    ],
    'ㅈ': [
      { d: 'M 6,10 L 94,10', desc: '1획: 가로' },
      { d: 'M 50,10 L 6,94', desc: '2획: 왼 사선' },
      { d: 'M 44,46 L 94,94', desc: '3획: 오른 사선' }
    ],
    'ㅉ': [
      { d: 'M 4,10 L 46,10', desc: '1획' }, { d: 'M 28,10 L 4,94', desc: '2획' }, { d: 'M 24,46 L 46,94', desc: '3획' },
      { d: 'M 54,10 L 96,10', desc: '4획' }, { d: 'M 74,10 L 52,94', desc: '5획' }, { d: 'M 70,46 L 96,94', desc: '6획' }
    ],
    'ㅊ': [
      { d: 'M 35,4 L 65,4', desc: '1획: 꼭지 점' },
      { d: 'M 6,24 L 94,24', desc: '2획: 가로' },
      { d: 'M 50,24 L 6,94', desc: '3획: 왼 사선' },
      { d: 'M 44,52 L 94,94', desc: '4획: 오른 사선' }
    ],
    'ㅌ': [
      { d: 'M 6,10 L 94,10', desc: '1획: 상 가로' },
      { d: 'M 6,50 L 92,50', desc: '2획: 중 가로' },
      { d: 'M 8,10 L 8,92 L 94,92', desc: '3획: ㄴ' }
    ],
    'ㅍ': [
      { d: 'M 6,12 L 94,12', desc: '1획: 위 가로' },
      { d: 'M 30,12 L 30,90', desc: '2획: 왼 세로' },
      { d: 'M 70,12 L 70,90', desc: '3획: 오른 세로' },
      { d: 'M 6,90 L 94,90', desc: '4획: 아래 가로' }
    ],
    'ㅎ': [
      { d: 'M 35,4 L 65,4', desc: '1획: 꼭지 점' },
      { d: 'M 6,24 L 94,24', desc: '2획: 가로' },
      { d: 'M 50,38 C 28,38 10,50 10,68 C 10,86 28,96 50,96 C 72,96 90,86 90,68 C 90,50 72,38 50,38 Z', desc: '3획: 원' }
    ],

    // ── 모음 ──
    'ㅏ': [{ d: 'M 50,2 L 50,98', desc: '1획: 세로' }, { d: 'M 50,50 L 98,50', desc: '2획: 가로' }],
    'ㅐ': [{ d: 'M 24,2 L 24,98', desc: '1획: 왼 세로' }, { d: 'M 24,50 L 76,50', desc: '2획: 중간 가로' }, { d: 'M 76,2 L 76,98', desc: '3획: 오른 세로' }],
    'ㅑ': [{ d: 'M 50,2 L 50,98', desc: '1획' }, { d: 'M 50,34 L 98,34', desc: '2획' }, { d: 'M 50,66 L 98,66', desc: '3획' }],
    'ㅒ': [{ d: 'M 24,2 L 24,98', desc: '1획' }, { d: 'M 24,34 L 76,34', desc: '2획' }, { d: 'M 24,66 L 76,66', desc: '3획' }, { d: 'M 76,2 L 76,98', desc: '4획' }],
    'ㅓ': [{ d: 'M 2,50 L 50,50', desc: '1획: 가로' }, { d: 'M 50,2 L 50,98', desc: '2획: 세로' }],
    'ㅔ': [{ d: 'M 24,50 L 76,50', desc: '1획: 가로' }, { d: 'M 24,2 L 24,98', desc: '2획: 왼 세로' }, { d: 'M 76,2 L 76,98', desc: '3획: 오른 세로' }],
    'ㅕ': [{ d: 'M 2,34 L 50,34', desc: '1획' }, { d: 'M 2,66 L 50,66', desc: '2획' }, { d: 'M 50,2 L 50,98', desc: '3획' }],
    'ㅖ': [{ d: 'M 24,34 L 76,34', desc: '1획' }, { d: 'M 24,66 L 76,66', desc: '2획' }, { d: 'M 24,2 L 24,98', desc: '3획' }, { d: 'M 76,2 L 76,98', desc: '4획' }],
    'ㅗ': [{ d: 'M 50,2 L 50,58', desc: '1획: 세로' }, { d: 'M 2,58 L 98,58', desc: '2획: 가로' }],
    'ㅛ': [{ d: 'M 34,2 L 34,58', desc: '1획' }, { d: 'M 66,2 L 66,58', desc: '2획' }, { d: 'M 2,58 L 98,58', desc: '3획' }],
    'ㅜ': [{ d: 'M 2,42 L 98,42', desc: '1획: 가로' }, { d: 'M 50,42 L 50,98', desc: '2획: 세로' }],
    'ㅠ': [{ d: 'M 2,42 L 98,42', desc: '1획' }, { d: 'M 34,42 L 34,98', desc: '2획' }, { d: 'M 66,42 L 66,98', desc: '3획' }],
    'ㅡ': [{ d: 'M 2,50 L 98,50', desc: '1획: 가로' }],
    'ㅢ': [{ d: 'M 2,50 L 68,50', desc: '1획: 가로' }, { d: 'M 72,2 L 72,98', desc: '2획: 세로' }],
    'ㅣ': [{ d: 'M 50,2 L 50,98', desc: '1획: 세로' }]
  };

  return BASE_DB[jamo] || [];
}

// 폰트의 실제 렌더링 범위 (X: 40~160, Y: 50~175)에 정밀 일치하는 6대 레이아웃
function getSyllableLayoutParts(ch) {
  const dec = decomposeHangulSyllable(ch);
  if (!dec.jung) return [{ jamo: dec.cho || ch, x: 40, y: 50, w: 120, h: 125, role: 'single', isVert: false, hasJong: false }];
  const { cho, jung, jong, jungIdx } = dec;
  const hasJong = !!jong;
  const isVert = [0,1,2,3,4,5,6,7,20].includes(jungIdx);
  const isHoriz = [8,12,13,17,18].includes(jungIdx);
  const parts = [];

  if (isVert) {
    if (!hasJong) {
      // 1. 좌우형 (가, 나, 다)
      parts.push({ jamo: cho, x: 38, y: 48, w: 66, h: 128, role: 'cho', isVert, hasJong });
      parts.push({ jamo: jung, x: 104, y: 48, w: 56, h: 128, role: 'jung', isVert, hasJong });
    } else {
      // 4. 좌우+받침형 (간, 날, 달, 안, 한)
      parts.push({ jamo: cho, x: 38, y: 48, w: 64, h: 66, role: 'cho', isVert, hasJong });
      parts.push({ jamo: jung, x: 104, y: 46, w: 56, h: 88, role: 'jung', isVert, hasJong });
      parts.push({ jamo: jong, x: 38, y: 112, w: 124, h: 64, role: 'jong', isVert, hasJong });
    }
  } else if (isHoriz) {
    if (!hasJong) {
      // 2. 상하형 (고, 노, 도)
      parts.push({ jamo: cho, x: 46, y: 46, w: 108, h: 66, role: 'cho', isVert, hasJong });
      parts.push({ jamo: jung, x: 38, y: 110, w: 124, h: 65, role: 'jung', isVert, hasJong });
    } else {
      // 5. 상하+받침형 (공, 논, 돌, 물, 꽃)
      parts.push({ jamo: cho, x: 50, y: 46, w: 100, h: 50, role: 'cho', isVert, hasJong });
      parts.push({ jamo: jung, x: 38, y: 94, w: 124, h: 42, role: 'jung', isVert, hasJong });
      parts.push({ jamo: jong, x: 40, y: 130, w: 120, h: 46, role: 'jong', isVert, hasJong });
    }
  } else {
    const compMap = {
      'ㅘ': ['ㅗ','ㅏ'], 'ㅙ': ['ㅗ','ㅐ'], 'ㅚ': ['ㅗ','ㅣ'],
      'ㅝ': ['ㅜ','ㅓ'], 'ㅞ': ['ㅜ','ㅔ'], 'ㅟ': ['ㅜ','ㅣ'],
      'ㅢ': ['ㅡ','ㅣ']
    };
    const [subH, subV] = compMap[jung] || ['ㅡ','ㅣ'];

    if (!hasJong) {
      // 3. 복합형 (과, 귀, 궤, 의)
      parts.push({ jamo: cho, x: 38, y: 48, w: 62, h: 66, role: 'cho', isVert: false, hasJong });
      parts.push({ jamo: subH, x: 36, y: 112, w: 66, h: 63, role: 'jung_h', isVert: false, hasJong });
      parts.push({ jamo: subV, x: 102, y: 48, w: 58, h: 128, role: 'jung_v', isVert: true, hasJong });
    } else {
      // 6. 복합+받침형 (관, 광, 괜찮다의 괜)
      parts.push({ jamo: cho, x: 38, y: 46, w: 60, h: 50, role: 'cho', isVert: false, hasJong });
      parts.push({ jamo: subH, x: 36, y: 94, w: 64, h: 38, role: 'jung_h', isVert: false, hasJong });
      parts.push({ jamo: subV, x: 102, y: 46, w: 58, h: 88, role: 'jung_v', isVert: true, hasJong });
      parts.push({ jamo: jong, x: 38, y: 130, w: 124, h: 46, role: 'jong', isVert: false, hasJong });
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
      const list = getJamoStrokes(j, part.role, part.isVert, part.hasJong);
      let sx = part.x, sw = part.w;
      let sy = part.y, sh = part.h;
      if (jamos.length > 1) {
        sw = part.w * 0.48;
        sx = subIdx === 0 ? part.x : part.x + part.w * 0.52;
        sh = part.h * 1.05; // 겹받침 세로 높이 보정
      }
      list.forEach(st => {
        strokes.push({
          d: scalePathCoords(st.d, sx, sy, sw, sh),
          desc: st.desc
        });
      });
    });
  });

  const strokeDur = 0.60 / S.strokeSpeed;
  const gapDur = 0.18 / S.strokeSpeed;

  let maskPaths = '';
  let numberMarkers = '';
  // 획 번호 배지 컬러 팔레트
  const markerColors = ['#818cf8', '#a78bfa', '#f472b6', '#38bdf8', '#34d399', '#fbbf24', '#f87171', '#c084fc', '#e879f9'];

  strokes.forEach((st, idx) => {
    const len = calcPathLength(st.d);
    const delay = idx * (strokeDur + gapDur);
    const color = markerColors[idx % markerColors.length];

    // SVG Mask 패스 (마스크 브러시로 글씨를 긁어 덮음)
    maskPaths += `
      <path d="${st.d}"
            stroke="white"
            stroke-width="40"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
            stroke-dasharray="${len.toFixed(1)}"
            stroke-dashoffset="${len.toFixed(1)}"
            style="animation: drawStrokeMask ${strokeDur.toFixed(2)}s linear ${delay.toFixed(2)}s forwards;" />
    `;

    if (S.strokeShowNumbers) {
      const nums = st.d.replace(/[MCLZAmclza]/g,' ').trim().split(/[\s,]+/).filter(Boolean).map(Number);
      const bx = nums[0] || 100;
      const by = nums[1] || 100;
      numberMarkers += `
        <g style="opacity:0; transform-origin:${bx}px ${by}px; animation: showStrokeMarker 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay.toFixed(2)}s forwards;">
          <circle cx="${bx}" cy="${by}" r="8.5" fill="#0f172a" stroke="${color}" stroke-width="2.2"/>
          <text x="${bx}" y="${by}" fill="${color}" font-size="9.5" font-weight="900" text-anchor="middle" dominant-baseline="central" font-family="'Inter', sans-serif">${idx+1}</text>
        </g>
      `;
    }
  });

  const maskId = 'hangul_mask_' + Math.random().toString(36).substr(2, 9);

  const svgHTML = `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="${maskId}">
          <rect width="200" height="200" fill="black" />
          ${maskPaths}
        </mask>
      </defs>

      <!-- 가이드 눈금 격자 -->
      <line x1="100" y1="12" x2="100" y2="188" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <line x1="12" y1="100" x2="188" y2="100" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <line x1="12" y1="12" x2="188" y2="188" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="188" y1="12" x2="12" y2="188" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="3,3"/>
      <rect x="14" y="14" width="172" height="172" rx="16" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1.5" stroke-dasharray="4,4"/>

      <!-- 1. 밑그림 가이드 폰트 (연한 회색의 완벽한 완성형 폰트) -->
      <text x="100" y="105"
            text-anchor="middle" dominant-baseline="central"
            font-size="135" font-weight="900"
            font-family="'Noto Sans KR', sans-serif"
            fill="rgba(255,255,255,0.12)">${curChar}</text>

      <!-- 2. 실제 획순대로 정확하게 덮어쓰며 채워지는 완성형 폰트 (SVG Mask 완벽 일치) -->
      <text x="100" y="105"
            text-anchor="middle" dominant-baseline="central"
            font-size="135" font-weight="900"
            font-family="'Noto Sans KR', sans-serif"
            fill="var(--accent)"
            mask="url(#${maskId})">${curChar}</text>

      <!-- 3. 획 번호 마커 레이어 (각 획의 정확한 시작점에 위치) -->
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
}
"""

def patch_file(filepath):
    print(f"Patching {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Patch CSS
    new_content, n_css = CSS_TARGET.subn(lambda m: CSS_REPLACEMENT, content)
    if n_css == 0:
        css_pattern = re.compile(
            r'/\* ─── STROKE ORDER[\s\S]*?'
            r'@keyframes (?:fillFinalGlyph|showStrokeMarker)\{[^}]*\}'
        )
        new_content, n_css = css_pattern.subn(lambda m: CSS_REPLACEMENT, content)
    print(f"  CSS patches: {n_css}")

    # 2. Patch JS
    new_content, n_js = JS_TARGET.subn(lambda m: JS_REPLACEMENT, new_content)
    if n_js == 0:
        js_pattern = re.compile(
            r'// ══════════════════════════════════════════════════════════════════\s*'
            r'//  (?:한글 획순|진짜 붓)[\s\S]*?'
            r'function clearStrokeCanvas\(\) \{[\s\S]*?ctx\.clearRect\(0, 0, cvs\.width, cvs\.height\);\s*\}\s*\}'
        )
        new_content, n_js = js_pattern.subn(lambda m: JS_REPLACEMENT, new_content)
    print(f"  JS patches: {n_js}")

    if n_css > 0 and n_js > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  [SUCCESS] {filepath} fully patched!")
        return True
    else:
        print(f"  [FAIL] Failed to patch {filepath}")
        return False

if __name__ == '__main__':
    ok1 = patch_file('web_simulator.html')
    ok2 = patch_file('index.html')
    if ok1 and ok2:
        print("ALL FILES PATCHED SUCCESSFULLY!")
    else:
        sys.exit(1)
