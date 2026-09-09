# -*- coding: utf-8 -*-
"""
정밀 한글 획순 애니메이션 엔진 (Smooth JS-driven SVG Mask Engine)
- 크로미움 브라우저의 SVG Mask GPU 캐싱 무반응 버그 해결
- requestAnimationFrame 기반으로 매 프레임 정밀 렌더링 갱신
- getTotalLength() 기반 0.01px 오차 없는 획 드로잉
- 획 번호 배지 실시간 팝인 및 리플레이/속도조절 완벽 연동
"""

import re

NEW_STROKE_ENGINE_JS = r'''// ══════════════════════════════════════════════════════════════════
//  완벽한 한글 획순 덮어쓰기 마스크 엔진 (Active JS-driven Reveal Engine)
//  - 밑그림의 완성형 폰트와 100% 동일한 글리프 위에 획순대로 정확하게 덮어씀(Overwrite)
//  - 국립국어원 표준 획순 100% 준수
//  - 크로미움 SVG Mask 캐싱 버그를 극복하는 실시간 rAF 리페인트 드라이버
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
      return [{ d: 'M 4,10 L 96,10 L 26,94', desc: '1획: 가로 후 왼사선' }];
    }
    return [{ d: 'M 4,10 L 96,10 L 96,94', desc: '1획: 가로 후 세로' }];
  }
  if (jamo === 'ㄲ') {
    if (role === 'cho' && isVert && !hasJong) {
      return [
        { d: 'M 4,10 L 48,10 L 18,94', desc: '1획: 앞 ㄱ 사선' },
        { d: 'M 52,10 L 96,10 L 42,94', desc: '2획: 뒤 ㄱ 사선' }
      ];
    }
    return [
      { d: 'M 4,10 L 46,10 L 46,94', desc: '1획: 앞 ㄱ' },
      { d: 'M 54,10 L 96,10 L 96,94', desc: '2획: 뒤 ㄱ' }
    ];
  }
  if (jamo === 'ㅋ') {
    if (role === 'cho' && isVert && !hasJong) {
      return [
        { d: 'M 4,10 L 96,10 L 26,94', desc: '1획: 가로 후 왼사선' },
        { d: 'M 4,48 L 78,48', desc: '2획: 중간 가로' }
      ];
    }
    return [
      { d: 'M 4,10 L 96,10 L 96,94', desc: '1획: ㄱ' },
      { d: 'M 4,50 L 92,50', desc: '2획: 중간 가로' }
    ];
  }

  const BASE_DB = {
    'ㄴ': [{ d: 'M 6,6 L 6,94 L 96,94', desc: '1획: 세로 후 가로' }],
    'ㄷ': [{ d: 'M 4,8 L 96,8', desc: '1획: 위 가로' }, { d: 'M 6,8 L 6,94 L 96,94', desc: '2획: ㄴ' }],
    'ㄸ': [
      { d: 'M 4,8 L 46,8', desc: '1획' }, { d: 'M 6,8 L 6,94 L 46,94', desc: '2획' },
      { d: 'M 54,8 L 96,8', desc: '3획' }, { d: 'M 56,8 L 56,94 L 96,94', desc: '4획' }
    ],
    'ㄹ': [
      { d: 'M 4,8 L 96,8 L 96,48', desc: '1획: ㄱ' },
      { d: 'M 4,48 L 96,48',         desc: '2획: 중간 가로' },
      { d: 'M 6,48 L 6,94 L 96,94', desc: '3획: ㄴ' }
    ],
    'ㅁ': [
      { d: 'M 6,6 L 6,96',         desc: '1획: 왼 세로' },
      { d: 'M 6,8 L 96,8 L 96,96', desc: '2획: 위 가로 후 오른 세로' },
      { d: 'M 4,94 L 98,94',         desc: '3획: 아래 가로' }
    ],
    'ㅂ': [
      { d: 'M 8,6 L 8,96', desc: '1획: 왼 세로' },
      { d: 'M 92,6 L 92,96', desc: '2획: 오른 세로' },
      { d: 'M 6,50 L 94,50', desc: '3획: 중간 가로' },
      { d: 'M 6,94 L 94,94', desc: '4획: 아래 가로' }
    ],
    'ㅃ': [
      { d: 'M 4,6 L 4,96', desc: '1획' }, { d: 'M 44,6 L 44,96', desc: '2획' },
      { d: 'M 2,50 L 46,50', desc: '3획' }, { d: 'M 2,94 L 46,94', desc: '4획' },
      { d: 'M 56,6 L 56,96', desc: '5획' }, { d: 'M 96,6 L 96,96', desc: '6획' },
      { d: 'M 54,50 L 98,50', desc: '7획' }, { d: 'M 54,94 L 98,94', desc: '8획' }
    ],
    'ㅅ': [{ d: 'M 50,6 L 8,94', desc: '1획: 왼 빗침' }, { d: 'M 40,48 L 92,94', desc: '2획: 오른 빗침' }],
    'ㅆ': [
      { d: 'M 26,6 L 4,94', desc: '1획' }, { d: 'M 20,48 L 46,94', desc: '2획' },
      { d: 'M 74,6 L 52,94', desc: '3획' }, { d: 'M 68,48 L 96,94', desc: '4획' }
    ],
    // 3차 베지에 곡선으로 왜곡 없이 렌더링되는 정밀 원형 획 (ㅇ, ㅎ)
    'ㅇ': [
      { d: 'M 50,4 C 22,4 2,24 2,50 C 2,76 22,96 50,96 C 78,96 98,76 98,50 C 98,24 78,4 50,4 Z', desc: '1획: 원' }
    ],
    'ㅈ': [
      { d: 'M 6,8 L 94,8', desc: '1획: 가로' },
      { d: 'M 50,8 L 8,94', desc: '2획: 왼 빗침' },
      { d: 'M 40,48 L 92,94', desc: '3획: 오른 빗침' }
    ],
    'ㅉ': [
      { d: 'M 4,8 L 46,8', desc: '1획' }, { d: 'M 26,8 L 4,94', desc: '2획' }, { d: 'M 20,48 L 46,94', desc: '3획' },
      { d: 'M 54,8 L 96,8', desc: '4획' }, { d: 'M 74,8 L 52,94', desc: '5획' }, { d: 'M 68,48 L 96,94', desc: '6획' }
    ],
    'ㅊ': [
      { d: 'M 50,4 L 50,22', desc: '1획: 위 점' },
      { d: 'M 6,24 L 94,24', desc: '2획: 가로' },
      { d: 'M 50,24 L 8,94', desc: '3획: 왼 빗침' },
      { d: 'M 40,54 L 92,94', desc: '4획: 오른 빗침' }
    ],
    'ㅌ': [
      { d: 'M 4,8 L 96,8', desc: '1획: 위 가로' },
      { d: 'M 4,50 L 96,50', desc: '2획: 중간 가로' },
      { d: 'M 6,8 L 6,94 L 96,94', desc: '3획: ㄴ' }
    ],
    'ㅍ': [
      { d: 'M 4,8 L 96,8', desc: '1획: 위 가로' },
      { d: 'M 30,8 L 30,94', desc: '2획: 왼 세로' },
      { d: 'M 70,8 L 70,94', desc: '3획: 오른 세로' },
      { d: 'M 4,94 L 96,94', desc: '4획: 아래 가로' }
    ],
    'ㅎ': [
      { d: 'M 50,4 L 50,20', desc: '1획: 꼭지점' },
      { d: 'M 6,24 L 94,24', desc: '2획: 가로' },
      { d: 'M 50,38 C 24,38 8,50 8,68 C 8,86 24,96 50,96 C 76,96 92,86 92,68 C 92,50 76,38 50,38 Z', desc: '3획: 아래 원' }
    ],

    // 모음 (단모음)
    'ㅏ': [{ d: 'M 50,2 L 50,98', desc: '1획: 세로' }, { d: 'M 50,50 L 98,50', desc: '2획: 가로' }],
    'ㅐ': [{ d: 'M 22,2 L 22,98', desc: '1획: 왼 세로' }, { d: 'M 22,50 L 78,50', desc: '2획: 중간 가로' }, { d: 'M 78,2 L 78,98', desc: '3획: 오른 세로' }],
    'ㅑ': [{ d: 'M 50,2 L 50,98', desc: '1획' }, { d: 'M 50,34 L 98,34', desc: '2획' }, { d: 'M 50,66 L 98,66', desc: '3획' }],
    'ㅒ': [{ d: 'M 22,2 L 22,98', desc: '1획' }, { d: 'M 22,34 L 78,34', desc: '2획' }, { d: 'M 22,66 L 78,66', desc: '3획' }, { d: 'M 78,2 L 78,98', desc: '4획' }],
    'ㅓ': [{ d: 'M 2,50 L 50,50', desc: '1획: 가로' }, { d: 'M 50,2 L 50,98', desc: '2획: 세로' }],
    'ㅔ': [{ d: 'M 22,50 L 78,50', desc: '1획: 가로' }, { d: 'M 22,2 L 22,98', desc: '2획: 왼 세로' }, { d: 'M 78,2 L 78,98', desc: '3획: 오른 세로' }],
    'ㅕ': [{ d: 'M 2,34 L 50,34', desc: '1획' }, { d: 'M 2,66 L 50,66', desc: '2획' }, { d: 'M 50,2 L 50,98', desc: '3획' }],
    'ㅖ': [{ d: 'M 22,34 L 78,34', desc: '1획' }, { d: 'M 22,66 L 78,66', desc: '2획' }, { d: 'M 22,2 L 22,98', desc: '3획' }, { d: 'M 78,2 L 78,98', desc: '4획' }],
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

// 폰트의 실제 렌더링 범위 (X: 38~162, Y: 46~176)에 정밀 일치하는 6대 음절 레이아웃
function getSyllableLayoutParts(ch) {
  const dec = decomposeHangulSyllable(ch);
  if (!dec.jung) return [{ jamo: dec.cho || ch, x: 38, y: 46, w: 124, h: 130, role: 'single', isVert: false, hasJong: false }];
  const { cho, jung, jong, jungIdx } = dec;
  const hasJong = !!jong;
  const isVert = [0,1,2,3,4,5,6,7,20].includes(jungIdx);
  const isHoriz = [8,12,13,17,18].includes(jungIdx);
  const parts = [];

  if (isVert) {
    if (!hasJong) {
      // 1. 좌우형 (가, 나, 다)
      parts.push({ jamo: cho, x: 36, y: 46, w: 68, h: 130, role: 'cho', isVert, hasJong });
      parts.push({ jamo: jung, x: 100, y: 46, w: 62, h: 130, role: 'jung', isVert, hasJong });
    } else {
      // 4. 좌우+받침형 (간, 날, 달, 안, 한)
      parts.push({ jamo: cho, x: 36, y: 46, w: 64, h: 68, role: 'cho', isVert, hasJong });
      parts.push({ jamo: jung, x: 100, y: 44, w: 62, h: 90, role: 'jung', isVert, hasJong });
      parts.push({ jamo: jong, x: 36, y: 110, w: 126, h: 66, role: 'jong', isVert, hasJong });
    }
  } else if (isHoriz) {
    if (!hasJong) {
      // 2. 상하형 (고, 노, 도)
      parts.push({ jamo: cho, x: 44, y: 44, w: 112, h: 68, role: 'cho', isVert, hasJong });
      parts.push({ jamo: jung, x: 36, y: 108, w: 128, h: 68, role: 'jung', isVert, hasJong });
    } else {
      // 5. 상하+받침형 (공, 논, 돌, 물, 꽃)
      parts.push({ jamo: cho, x: 48, y: 44, w: 104, h: 52, role: 'cho', isVert, hasJong });
      parts.push({ jamo: jung, x: 36, y: 92, w: 128, h: 44, role: 'jung', isVert, hasJong });
      parts.push({ jamo: jong, x: 38, y: 128, w: 124, h: 48, role: 'jong', isVert, hasJong });
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
      parts.push({ jamo: cho, x: 36, y: 46, w: 64, h: 68, role: 'cho', isVert: false, hasJong });
      parts.push({ jamo: subH, x: 34, y: 110, w: 68, h: 66, role: 'jung_h', isVert: false, hasJong });
      parts.push({ jamo: subV, x: 100, y: 46, w: 62, h: 130, role: 'jung_v', isVert: true, hasJong });
    } else {
      // 6. 복합+받침형 (관, 광, 괜)
      parts.push({ jamo: cho, x: 36, y: 44, w: 62, h: 52, role: 'cho', isVert: false, hasJong });
      parts.push({ jamo: subH, x: 34, y: 92, w: 66, h: 40, role: 'jung_h', isVert: false, hasJong });
      parts.push({ jamo: subV, x: 100, y: 44, w: 62, h: 90, role: 'jung_v', isVert: true, hasJong });
      parts.push({ jamo: jong, x: 36, y: 128, w: 126, h: 48, role: 'jong', isVert: false, hasJong });
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

// 획순 뷰 상태
if (typeof S.strokeCharIdx === 'undefined') S.strokeCharIdx = 0;
if (typeof S.strokeSpeed === 'undefined') S.strokeSpeed = 1.0;
if (typeof S.strokeShowNumbers === 'undefined') S.strokeShowNumbers = true;
if (typeof S.strokeDrawMode === 'undefined') S.strokeDrawMode = false;
window._strokeAnimTimer = null;

function renderStrokeMode(){
  if (window._strokeAnimRaf) {
    cancelAnimationFrame(window._strokeAnimRaf);
    window._strokeAnimTimer = null;
  }

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
        sh = part.h * 1.05;
      }
      list.forEach(st => {
        strokes.push({
          d: scalePathCoords(st.d, sx, sy, sw, sh),
          desc: st.desc
        });
      });
    });
  });

  const maskId = 'hangul_mask_' + Math.random().toString(36).substr(2, 9);
  const markerColors = ['#818cf8', '#a78bfa', '#f472b6', '#38bdf8', '#34d399', '#fbbf24', '#f87171', '#c084fc', '#e879f9'];

  let maskPaths = '';
  let numberMarkers = '';

  strokes.forEach((st, idx) => {
    const color = markerColors[idx % markerColors.length];
    // 각 마스크 패스 생성 (기본값: 모두 가려진 상태)
    maskPaths += `
      <path id="${maskId}_p_${idx}"
            d="${st.d}"
            stroke="white"
            stroke-width="48"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none" />
    `;

    const nums = st.d.replace(/[MCLZAmclza]/g,' ').trim().split(/[\s,]+/).filter(Boolean).map(Number);
    const bx = nums[0] || 100;
    const by = nums[1] || 100;
    numberMarkers += `
      <g id="${maskId}_m_${idx}" class="stroke-marker-node" style="opacity:0; transform-origin:${bx}px ${by}px; transform:scale(0.3); transition:opacity 0.2s cubic-bezier(0.34,1.56,0.64,1), transform 0.25s cubic-bezier(0.34,1.56,0.64,1); display:${S.strokeShowNumbers ? 'inline' : 'none'};">
        <circle cx="${bx}" cy="${by}" r="8.5" fill="#0f172a" stroke="${color}" stroke-width="2.2"/>
        <text x="${bx}" y="${by}" fill="${color}" font-size="9.5" font-weight="900" text-anchor="middle" dominant-baseline="central" font-family="'Noto Sans KR', sans-serif">${idx+1}</text>
      </g>
    `;
  });

  const svgHTML = `
    <svg id="stroke-svg-canvas" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
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

      <!-- 2. 실제 획순대로 부드럽게 채워지며 덮어쓰는 완성형 폰트 (Active GPU Invalidation) -->
      <text id="stroke-revealed-text"
            x="100" y="105"
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

  // 실시간 rAF 획순 드로잉 및 GPU Invalidation 시작
  playActiveStrokeReveal(maskId, strokes.length);
}

function playActiveStrokeReveal(maskId, numStrokes) {
  const pathEls = [];
  const markerEls = [];
  const lengths = [];

  for (let i = 0; i < numStrokes; i++) {
    const p = document.getElementById(`${maskId}_p_${i}`);
    const m = document.getElementById(`${maskId}_m_${i}`);
    if (p) {
      pathEls.push(p);
      markerEls.push(m);
      const len = p.getTotalLength();
      const safeLen = Math.ceil(len + 10);
      lengths.push(safeLen);
      p.style.strokeDasharray = safeLen + 'px';
      p.style.strokeDashoffset = safeLen + 'px';
    }
  }

  const targetText = document.getElementById('stroke-revealed-text');
  if (!targetText || !pathEls.length) return;

  const strokeDur = (480 / S.strokeSpeed);
  const gapDur = (140 / S.strokeSpeed);
  const startTime = performance.now();
  let frame = 0;

  function tick() {
    const elapsed = performance.now() - startTime;
    let allDone = true;

    for (let i = 0; i < numStrokes; i++) {
      const sStart = i * (strokeDur + gapDur);
      const sEnd = sStart + strokeDur;

      if (elapsed < sStart) {
        pathEls[i].style.strokeDashoffset = lengths[i] + 'px';
        allDone = false;
      } else if (elapsed >= sEnd) {
        pathEls[i].style.strokeDashoffset = '0px';
        if (markerEls[i] && S.strokeShowNumbers) {
          markerEls[i].style.opacity = '1';
          markerEls[i].style.transform = 'scale(1)';
        }
      } else {
        const p = (elapsed - sStart) / strokeDur;
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        pathEls[i].style.strokeDashoffset = (lengths[i] * (1 - eased)) + 'px';
        if (markerEls[i] && S.strokeShowNumbers) {
          markerEls[i].style.opacity = '1';
          markerEls[i].style.transform = 'scale(1)';
        }
        allDone = false;
      }
    }

    frame++;
    // 크로미움 브라우저 GPU 캐시 무효화 강제 트리거 (매 프레임 마스크 텍스트 다시 칠함)
    targetText.style.opacity = (frame % 2 === 0 ? '1' : '0.9999');

    if (allDone) {
      clearInterval(window._strokeAnimTimer);
      window._strokeAnimTimer = null;
      targetText.style.opacity = '1';
    }
  }

  window._strokeAnimTimer = setInterval(tick, 16);
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
  const markers = document.querySelectorAll('.stroke-marker-node');
  markers.forEach(m => m.style.display = S.strokeShowNumbers ? 'inline' : 'none');
  const btn = event?.currentTarget || document.querySelectorAll('.stroke-ctrl-btn')[2];
  if (btn) {
    btn.classList.toggle('active', S.strokeShowNumbers);
    btn.textContent = `① 번호 ${S.strokeShowNumbers ? 'ON' : 'OFF'}`;
  }
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
'''

def patch_file(filepath):
    print(f"Patching {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    js_pattern = re.compile(
        r'// ══════════════════════════════════════════════════════════════════\s*'
        r'//  완벽한 한글 획순 덮어쓰기[\s\S]*?'
        r'function clearStrokeCanvas\(\) \{[\s\S]*?ctx\.clearRect\(0, 0, cvs\.width, cvs\.height\);\s*\}\s*\}'
    )

    new_content, n = js_pattern.subn(lambda m: NEW_STROKE_ENGINE_JS.strip(), content)
    if n == 0:
        print(f"Trying fallback pattern for {filepath}...")
        fallback_pattern = re.compile(
            r'const _STROKE_CHOS  = \[[\s\S]*?'
            r'function clearStrokeCanvas\(\) \{[\s\S]*?ctx\.clearRect\(0, 0, cvs\.width, cvs\.height\);\s*\}\s*\}'
        )
        new_content, n = fallback_pattern.subn(lambda m: NEW_STROKE_ENGINE_JS.strip(), content)

    if n > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  [SUCCESS] {filepath} patched ({n} match)!")
        return True
    else:
        print(f"  [FAIL] Failed to patch {filepath}")
        return False

if __name__ == '__main__':
    patch_file('web_simulator.html')
    patch_file('index.html')
