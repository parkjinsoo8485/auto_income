# -*- coding: utf-8 -*-
import sys

new_stroke_code = r'''// ══════════════════════════════════════════════════════════════════
//  완벽한 한글 획순 정밀 BBox 마스크 와이프 엔진 (Mask Wipe Engine)
//  - 밑그림 가이드 폰트와 컬러 폰트가 100% 동일한 Noto Sans KR 글리프로 픽셀 단위 일치
//  - 자간 왜곡 및 획 불일치 원천 제거 (실제 브라우저 폰트 렌더러 기반)
//  - 넉넉한 BBox 마스크 와이프(가로, 세로, 원형)로 폰트의 글리프가 100% 완전하게 드러남
//  - 국립국어원 표준 획순 준수 및 독립 프레임 드라이버 (rAF + setTimeout)
//  - 획 번호 마커, 재생 속도 조절, 캔버스 직접 쓰기/지우기 완벽 지원
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
  if (code < 0 || code > 11171) return { cho: ch, jung: null, jong: null, choIdx: -1, jungIdx: -1, jongIdx: 0 };
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

// ── 자모별 표준 획순 및 와이프 도형 DB (0~100 정규화 좌표) ──
const _JAMO_WIPE_DB = {
  // ── 자음 ──
  'ㄱ': [
    { desc: '1획: 가로 후 세로', nx: 15, ny: 18, steps: [
      { type: 'h', x: -5, y: -5, w: 110, h: 50, t0: 0, t1: 0.5 },
      { type: 'v', x: 45, y: -5, w: 60, h: 110, t0: 0.45, t1: 1.0 }
    ]}
  ],
  'ㄴ': [
    { desc: '1획: 세로 후 가로', nx: 18, ny: 15, steps: [
      { type: 'v', x: -5, y: -5, w: 55, h: 110, t0: 0, t1: 0.55 },
      { type: 'h', x: -5, y: 48, w: 110, h: 57, t0: 0.48, t1: 1.0 }
    ]}
  ],
  'ㄷ': [
    { desc: '1획: 위 가로', nx: 15, ny: 15, steps: [
      { type: 'h', x: -5, y: -5, w: 110, h: 48, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: ㄴ(세로 후 가로)', nx: 18, ny: 48, steps: [
      { type: 'v', x: -5, y: -5, w: 55, h: 110, t0: 0, t1: 0.55 },
      { type: 'h', x: -5, y: 50, w: 110, h: 55, t0: 0.48, t1: 1.0 }
    ]}
  ],
  'ㄹ': [
    { desc: '1획: ㄱ', nx: 15, ny: 14, steps: [
      { type: 'h', x: -5, y: -5, w: 110, h: 42, t0: 0, t1: 0.5 },
      { type: 'v', x: 48, y: -5, w: 57, h: 54, t0: 0.45, t1: 1.0 }
    ]},
    { desc: '2획: 중간 가로', nx: 15, ny: 46, steps: [
      { type: 'h', x: -5, y: 26, w: 110, h: 44, t0: 0, t1: 1.0 }
    ]},
    { desc: '3획: ㄴ', nx: 15, ny: 68, steps: [
      { type: 'v', x: -5, y: 30, w: 55, h: 75, t0: 0, t1: 0.55 },
      { type: 'h', x: -5, y: 56, w: 110, h: 49, t0: 0.48, t1: 1.0 }
    ]}
  ],
  'ㅁ': [
    { desc: '1획: 왼 세로', nx: 15, ny: 14, steps: [
      { type: 'v', x: -5, y: -5, w: 55, h: 110, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 위 가로 후 오른 세로', nx: 45, ny: 14, steps: [
      { type: 'h', x: -5, y: -5, w: 110, h: 48, t0: 0, t1: 0.5 },
      { type: 'v', x: 48, y: -5, w: 57, h: 110, t0: 0.45, t1: 1.0 }
    ]},
    { desc: '3획: 아래 가로', nx: 35, ny: 84, steps: [
      { type: 'h', x: -5, y: 52, w: 110, h: 53, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅂ': [
    { desc: '1획: 왼 세로', nx: 15, ny: 14, steps: [
      { type: 'v', x: -5, y: -5, w: 52, h: 110, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 오른 세로', nx: 82, ny: 14, steps: [
      { type: 'v', x: 50, y: -5, w: 55, h: 110, t0: 0, t1: 1.0 }
    ]},
    { desc: '3획: 중간 가로', nx: 45, ny: 45, steps: [
      { type: 'h', x: -5, y: 24, w: 110, h: 46, t0: 0, t1: 1.0 }
    ]},
    { desc: '4획: 아래 가로', nx: 45, ny: 85, steps: [
      { type: 'h', x: -5, y: 54, w: 110, h: 51, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅅ': [
    { desc: '1획: 왼 빗침', nx: 35, ny: 14, steps: [
      { type: 'v', x: -5, y: -5, w: 72, h: 110, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 오른 빗침', nx: 70, ny: 45, steps: [
      { type: 'v', x: 30, y: 20, w: 75, h: 85, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅇ': [
    { desc: '1획: 원', nx: 50, ny: 10, steps: [
      { type: 'c', cx: 50, cy: 50, r: 62, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅈ': [
    { desc: '1획: 가로', nx: 18, ny: 14, steps: [
      { type: 'h', x: -5, y: -5, w: 110, h: 44, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 왼 빗침', nx: 35, ny: 26, steps: [
      { type: 'v', x: -5, y: 8, w: 72, h: 97, t0: 0, t1: 1.0 }
    ]},
    { desc: '3획: 오른 빗침', nx: 70, ny: 46, steps: [
      { type: 'v', x: 30, y: 25, w: 75, h: 80, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅊ': [
    { desc: '1획: 꼭지 점', nx: 50, ny: 6, steps: [
      { type: 'v', x: 28, y: -5, w: 44, h: 36, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 가로', nx: 18, ny: 26, steps: [
      { type: 'h', x: -5, y: 12, w: 110, h: 38, t0: 0, t1: 1.0 }
    ]},
    { desc: '3획: 왼 빗침', nx: 35, ny: 40, steps: [
      { type: 'v', x: -5, y: 22, w: 72, h: 83, t0: 0, t1: 1.0 }
    ]},
    { desc: '4획: 오른 빗침', nx: 70, ny: 55, steps: [
      { type: 'v', x: 30, y: 35, w: 75, h: 70, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅋ': [
    { desc: '1획: ㄱ', nx: 15, ny: 14, steps: [
      { type: 'h', x: -5, y: -5, w: 110, h: 48, t0: 0, t1: 0.5 },
      { type: 'v', x: 45, y: -5, w: 60, h: 110, t0: 0.45, t1: 1.0 }
    ]},
    { desc: '2획: 중간 가로', nx: 18, ny: 48, steps: [
      { type: 'h', x: -5, y: 26, w: 100, h: 46, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅌ': [
    { desc: '1획: 위 가로', nx: 15, ny: 14, steps: [
      { type: 'h', x: -5, y: -5, w: 110, h: 44, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 중간 가로', nx: 15, ny: 46, steps: [
      { type: 'h', x: -5, y: 26, w: 110, h: 44, t0: 0, t1: 1.0 }
    ]},
    { desc: '3획: ㄴ', nx: 18, ny: 72, steps: [
      { type: 'v', x: -5, y: -5, w: 55, h: 110, t0: 0, t1: 0.55 },
      { type: 'h', x: -5, y: 55, w: 110, h: 50, t0: 0.48, t1: 1.0 }
    ]}
  ],
  'ㅍ': [
    { desc: '1획: 위 가로', nx: 15, ny: 14, steps: [
      { type: 'h', x: -5, y: -5, w: 110, h: 44, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 왼 세로', nx: 26, ny: 35, steps: [
      { type: 'v', x: 6, y: -5, w: 50, h: 110, t0: 0, t1: 1.0 }
    ]},
    { desc: '3획: 오른 세로', nx: 74, ny: 35, steps: [
      { type: 'v', x: 44, y: -5, w: 50, h: 110, t0: 0, t1: 1.0 }
    ]},
    { desc: '4획: 아래 가로', nx: 45, ny: 85, steps: [
      { type: 'h', x: -5, y: 55, w: 110, h: 50, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅎ': [
    { desc: '1획: 꼭지 점', nx: 50, ny: 6, steps: [
      { type: 'v', x: 28, y: -5, w: 44, h: 36, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 가로', nx: 18, ny: 24, steps: [
      { type: 'h', x: -5, y: 10, w: 110, h: 38, t0: 0, t1: 1.0 }
    ]},
    { desc: '3획: 아래 원', nx: 50, ny: 48, steps: [
      { type: 'c', cx: 50, cy: 66, r: 42, t0: 0, t1: 1.0 }
    ]}
  ],

  // ── 모음 ──
  'ㅏ': [
    { desc: '1획: 세로', nx: 45, ny: 8, steps: [
      { type: 'v', x: 12, y: -5, w: 65, h: 110, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 가로', nx: 70, ny: 48, steps: [
      { type: 'h', x: 25, y: 26, w: 80, h: 48, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅑ': [
    { desc: '1획: 세로', nx: 45, ny: 8, steps: [
      { type: 'v', x: 12, y: -5, w: 65, h: 110, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 위 가로', nx: 70, ny: 30, steps: [
      { type: 'h', x: 25, y: 14, w: 80, h: 40, t0: 0, t1: 1.0 }
    ]},
    { desc: '3획: 아래 가로', nx: 70, ny: 65, steps: [
      { type: 'h', x: 25, y: 46, w: 80, h: 40, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅓ': [
    { desc: '1획: 가로', nx: 15, ny: 48, steps: [
      { type: 'h', x: -5, y: 26, w: 80, h: 48, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 세로', nx: 60, ny: 8, steps: [
      { type: 'v', x: 25, y: -5, w: 65, h: 110, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅕ': [
    { desc: '1획: 위 가로', nx: 15, ny: 30, steps: [
      { type: 'h', x: -5, y: 14, w: 80, h: 40, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 아래 가로', nx: 15, ny: 65, steps: [
      { type: 'h', x: -5, y: 46, w: 80, h: 40, t0: 0, t1: 1.0 }
    ]},
    { desc: '3획: 세로', nx: 60, ny: 8, steps: [
      { type: 'v', x: 25, y: -5, w: 65, h: 110, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅗ': [
    { desc: '1획: 세로', nx: 50, ny: 10, steps: [
      { type: 'v', x: 22, y: -5, w: 56, h: 76, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 가로', nx: 15, ny: 68, steps: [
      { type: 'h', x: -5, y: 35, w: 110, h: 65, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅛ': [
    { desc: '1획: 왼 세로', nx: 35, ny: 10, steps: [
      { type: 'v', x: 8, y: -5, w: 48, h: 76, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 오른 세로', nx: 65, ny: 10, steps: [
      { type: 'v', x: 44, y: -5, w: 48, h: 76, t0: 0, t1: 1.0 }
    ]},
    { desc: '3획: 가로', nx: 15, ny: 68, steps: [
      { type: 'h', x: -5, y: 35, w: 110, h: 65, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅜ': [
    { desc: '1획: 가로', nx: 15, ny: 30, steps: [
      { type: 'h', x: -5, y: 10, w: 110, h: 60, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 세로', nx: 50, ny: 65, steps: [
      { type: 'v', x: 22, y: 24, w: 56, h: 81, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅠ': [
    { desc: '1획: 가로', nx: 15, ny: 30, steps: [
      { type: 'h', x: -5, y: 10, w: 110, h: 60, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 왼 세로', nx: 35, ny: 65, steps: [
      { type: 'v', x: 8, y: 24, w: 48, h: 81, t0: 0, t1: 1.0 }
    ]},
    { desc: '3획: 오른 세로', nx: 65, ny: 65, steps: [
      { type: 'v', x: 44, y: 24, w: 48, h: 81, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅡ': [
    { desc: '1획: 가로', nx: 15, ny: 45, steps: [
      { type: 'h', x: -5, y: 15, w: 110, h: 70, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅣ': [
    { desc: '1획: 세로', nx: 50, ny: 8, steps: [
      { type: 'v', x: 15, y: -5, w: 70, h: 110, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅐ': [
    { desc: '1획: 왼 세로', nx: 25, ny: 8, steps: [
      { type: 'v', x: -2, y: -5, w: 55, h: 110, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 중간 가로', nx: 50, ny: 48, steps: [
      { type: 'h', x: 5, y: 26, w: 90, h: 48, t0: 0, t1: 1.0 }
    ]},
    { desc: '3획: 오른 세로', nx: 75, ny: 8, steps: [
      { type: 'v', x: 44, y: -5, w: 55, h: 110, t0: 0, t1: 1.0 }
    ]}
  ],
  'ㅔ': [
    { desc: '1획: 중간 가로', nx: 50, ny: 48, steps: [
      { type: 'h', x: 5, y: 26, w: 90, h: 48, t0: 0, t1: 1.0 }
    ]},
    { desc: '2획: 왼 세로', nx: 25, ny: 8, steps: [
      { type: 'v', x: -2, y: -5, w: 55, h: 110, t0: 0, t1: 1.0 }
    ]},
    { desc: '3획: 오른 세로', nx: 75, ny: 8, steps: [
      { type: 'v', x: 44, y: -5, w: 55, h: 110, t0: 0, t1: 1.0 }
    ]}
  ]
};

function getJamoStrokeList(jamo, role) {
  const doubleCons = {
    'ㄲ': ['ㄱ','ㄱ'], 'ㄸ': ['ㄷ','ㄷ'], 'ㅃ': ['ㅂ','ㅂ'], 'ㅆ': ['ㅅ','ㅅ'], 'ㅉ': ['ㅈ','ㅈ']
  };
  if (doubleCons[jamo]) {
    const base = doubleCons[jamo][0];
    const unitStrokes = _JAMO_WIPE_DB[base] || [];
    const res = [];
    unitStrokes.forEach(s => {
      res.push({
        desc: `앞 ${s.desc}`,
        nx: s.nx * 0.48,
        ny: s.ny,
        steps: s.steps.map(st => ({
          ...st,
          x: st.x !== undefined ? st.x * 0.48 : undefined,
          w: st.w !== undefined ? st.w * 0.48 : undefined,
          cx: st.cx !== undefined ? st.cx * 0.48 : undefined,
          r: st.r !== undefined ? st.r * 0.48 : undefined
        }))
      });
    });
    unitStrokes.forEach(s => {
      res.push({
        desc: `뒤 ${s.desc}`,
        nx: 50 + s.nx * 0.48,
        ny: s.ny,
        steps: s.steps.map(st => ({
          ...st,
          x: st.x !== undefined ? 50 + st.x * 0.48 : undefined,
          w: st.w !== undefined ? st.w * 0.48 : undefined,
          cx: st.cx !== undefined ? 50 + st.cx * 0.48 : undefined,
          r: st.r !== undefined ? st.r * 0.48 : undefined
        }))
      });
    });
    return res;
  }

  if (jamo === 'ㅒ') {
    return [
      ...(_JAMO_WIPE_DB['ㅑ'] || []),
      { desc: '4획: 끝 세로', nx: 80, ny: 8, steps: [{ type: 'v', x: 50, y: -5, w: 55, h: 110, t0: 0, t1: 1.0 }] }
    ];
  }
  if (jamo === 'ㅖ') {
    return [
      ...(_JAMO_WIPE_DB['ㅕ'] || []),
      { desc: '4획: 끝 세로', nx: 80, ny: 8, steps: [{ type: 'v', x: 50, y: -5, w: 55, h: 110, t0: 0, t1: 1.0 }] }
    ];
  }
  if (jamo === 'ㅢ') {
    return [
      ...(_JAMO_WIPE_DB['ㅡ'] || []).map(s => ({
        ...s,
        nx: s.nx * 0.65,
        steps: s.steps.map(st => ({ ...st, w: (st.w || 100) * 0.68 }))
      })),
      ...(_JAMO_WIPE_DB['ㅣ'] || []).map(s => ({
        ...s,
        nx: 65 + s.nx * 0.35,
        steps: s.steps.map(st => ({ ...st, x: 60 + (st.x || 0) * 0.38, w: (st.w || 60) * 0.5 }))
      }))
    ];
  }

  return _JAMO_WIPE_DB[jamo] || [
    { desc: `${jamo} 획`, nx: 50, ny: 50, steps: [{ type: 'h', x: -5, y: -5, w: 110, h: 110, t0: 0, t1: 1.0 }] }
  ];
}

// ── 넉넉한 Safe Zone을 적용한 6대 음절 레이아웃 ──
function getSyllableLayoutParts(ch) {
  const dec = decomposeHangulSyllable(ch);
  if (!dec.jung) {
    return [{ jamo: dec.cho || ch, x: 22, y: 22, w: 156, h: 156, role: 'single' }];
  }
  const { cho, jung, jong, jungIdx } = dec;
  const hasJong = !!jong;
  const isVert = [0,1,2,3,4,5,6,7,20].includes(jungIdx);
  const isHoriz = [8,12,13,17,18].includes(jungIdx);
  const parts = [];

  if (isVert) {
    if (!hasJong) {
      // 1. 좌우형 (가, 나, 다)
      parts.push({ jamo: cho, x: 22, y: 22, w: 84, h: 156, role: 'cho' });
      parts.push({ jamo: jung, x: 98, y: 20, w: 82, h: 160, role: 'jung' });
    } else {
      // 4. 좌우+받침형 (간, 날, 달, 안, 한)
      parts.push({ jamo: cho, x: 22, y: 20, w: 82, h: 88, role: 'cho' });
      parts.push({ jamo: jung, x: 98, y: 18, w: 82, h: 104, role: 'jung' });
      parts.push({ jamo: jong, x: 22, y: 112, w: 158, h: 70, role: 'jong' });
    }
  } else if (isHoriz) {
    if (!hasJong) {
      // 2. 상하형 (고, 노, 도)
      parts.push({ jamo: cho, x: 30, y: 22, w: 140, h: 80, role: 'cho' });
      parts.push({ jamo: jung, x: 22, y: 94, w: 156, h: 84, role: 'jung' });
    } else {
      // 5. 상하+받침형 (공, 논, 돌, 물, 꽃)
      parts.push({ jamo: cho, x: 30, y: 20, w: 140, h: 68, role: 'cho' });
      parts.push({ jamo: jung, x: 22, y: 80, w: 156, h: 52, role: 'jung' });
      parts.push({ jamo: jong, x: 22, y: 120, w: 156, h: 62, role: 'jong' });
    }
  } else {
    // 3 & 6. 복합형 (과, 귀, 궤, 의 등)
    const compMap = {
      'ㅘ': ['ㅗ','ㅏ'], 'ㅙ': ['ㅗ','ㅐ'], 'ㅚ': ['ㅗ','ㅣ'],
      'ㅝ': ['ㅜ','ㅓ'], 'ㅞ': ['ㅜ','ㅔ'], 'ㅟ': ['ㅜ','ㅣ'],
      'ㅢ': ['ㅡ','ㅣ']
    };
    const [subH, subV] = compMap[jung] || ['ㅡ','ㅣ'];
    if (!hasJong) {
      parts.push({ jamo: cho, x: 22, y: 22, w: 80, h: 78, role: 'cho' });
      parts.push({ jamo: subH, x: 22, y: 90, w: 80, h: 88, role: 'jung_h' });
      parts.push({ jamo: subV, x: 98, y: 20, w: 82, h: 160, role: 'jung_v' });
    } else {
      parts.push({ jamo: cho, x: 22, y: 20, w: 78, h: 66, role: 'cho' });
      parts.push({ jamo: subH, x: 22, y: 80, w: 78, h: 50, role: 'jung_h' });
      parts.push({ jamo: subV, x: 96, y: 18, w: 84, h: 104, role: 'jung_v' });
      parts.push({ jamo: jong, x: 22, y: 120, w: 158, h: 62, role: 'jong' });
    }
  }
  return parts;
}

// ── 와이프 마스크 도형 SVG 요소 생성 ──
function createWipeSvgElement(step, progress, sx, sy, sw, sh) {
  const NS = 'http://www.w3.org/2000/svg';
  const p = Math.max(0, Math.min(1, progress));

  if (step.type === 'c') {
    const cx = sx + (step.cx / 100) * sw;
    const cy = sy + (step.cy / 100) * sh;
    const r = (step.r / 100) * Math.max(sw, sh) * p;
    const el = document.createElementNS(NS, 'circle');
    el.setAttribute('cx', cx.toFixed(1));
    el.setAttribute('cy', cy.toFixed(1));
    el.setAttribute('r', r.toFixed(1));
    el.setAttribute('fill', 'white');
    return el;
  }

  const el = document.createElementNS(NS, 'rect');
  el.setAttribute('fill', 'white');

  const baseX = sx + (step.x / 100) * sw;
  const baseY = sy + (step.y / 100) * sh;
  const maxW = (step.w / 100) * sw;
  const maxH = (step.h / 100) * sh;

  if (step.type === 'h') {
    el.setAttribute('x', baseX.toFixed(1));
    el.setAttribute('y', baseY.toFixed(1));
    el.setAttribute('width', (maxW * p).toFixed(1));
    el.setAttribute('height', maxH.toFixed(1));
  } else {
    el.setAttribute('x', baseX.toFixed(1));
    el.setAttribute('y', baseY.toFixed(1));
    el.setAttribute('width', maxW.toFixed(1));
    el.setAttribute('height', (maxH * p).toFixed(1));
  }
  return el;
}

// ── 전역 상태 ──
if (typeof S.strokeCharIdx === 'undefined') S.strokeCharIdx = 0;
if (typeof S.strokeSpeed === 'undefined') S.strokeSpeed = 1.0;
if (typeof S.strokeShowNumbers === 'undefined') S.strokeShowNumbers = true;
if (typeof S.strokeDrawMode === 'undefined') S.strokeDrawMode = false;
window._strokeRafId = null;
window._strokeTimeoutId = null;

// ── 메인 획순 뷰 렌더링 ──
function renderStrokeMode() {
  if (window._strokeRafId) {
    cancelAnimationFrame(window._strokeRafId);
    window._strokeRafId = null;
  }
  if (window._strokeTimeoutId) {
    clearTimeout(window._strokeTimeoutId);
    window._strokeTimeoutId = null;
  }

  const words = TOPIK_DATA[S.level] || [];
  if (!words.length) {
    document.getElementById('mode-content').innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted)">데이터 없음</div>';
    return;
  }
  if (S.strokeIndex >= words.length) S.strokeIndex = 0;
  const w = words[S.strokeIndex];

  // 단어 내 글자 목록
  const chars = [...w.term];
  if (S.strokeCharIdx >= chars.length) S.strokeCharIdx = 0;
  const curChar = chars[S.strokeCharIdx] || chars[0];

  // 글자 탭 UI
  const charTabsHTML = chars.map((c, idx) =>
    `<button class="stroke-char-tab ${idx === S.strokeCharIdx ? 'active' : ''}" onclick="setStrokeChar(${idx})">${c}</button>`
  ).join('');

  // 음절 파트 및 획 수집
  const parts = getSyllableLayoutParts(curChar);
  const strokePlan = [];

  parts.forEach(part => {
    let jamos = [part.jamo];
    if (part.role === 'jong' && _STROKE_DOUBLE_JONGS[part.jamo]) {
      jamos = _STROKE_DOUBLE_JONGS[part.jamo];
    }
    jamos.forEach((j, subIdx) => {
      let sx = part.x, sw = part.w;
      let sy = part.y, sh = part.h;
      if (jamos.length > 1) {
        sw = part.w * 0.48;
        sx = subIdx === 0 ? part.x : part.x + part.w * 0.52;
      }
      const unitStrokes = getJamoStrokeList(j, part.role);
      unitStrokes.forEach(st => {
        strokePlan.push({
          desc: st.desc,
          nx: sx + (st.nx / 100) * sw,
          ny: sy + (st.ny / 100) * sh,
          steps: st.steps,
          sx, sy, sw, sh
        });
      });
    });
  });

  const maskId = 'hangul_wipe_mask_' + Math.random().toString(36).substr(2, 9);
  const strokeId = 'hangul_stroke_' + Math.random().toString(36).substr(2, 9);

  const svgHTML = `
    <svg id="stroke-svg-canvas" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- 글자 채색용 그라데이션 -->
        <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#818cf8"/>
          <stop offset="100%" stop-color="#c084fc"/>
        </linearGradient>

        <!-- 와이프 마스크: 흰색 도형 영역만 아래 컬러 폰트가 드러남 -->
        <mask id="${maskId}">
          <rect x="0" y="0" width="200" height="200" fill="black"/>
          <g id="${maskId}_shapes"></g>
        </mask>
      </defs>

      <!-- 가이드 눈금 격자 -->
      <line x1="100" y1="14" x2="100" y2="186" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <line x1="14" y1="100" x2="186" y2="100" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <line x1="14" y1="14" x2="186" y2="186" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="3,3"/>
      <line x1="186" y1="14" x2="14" y2="186" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="3,3"/>
      <rect x="14" y="14" width="172" height="172" rx="16" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1.5" stroke-dasharray="4,4"/>

      <!-- 1. 밑그림 가이드 폰트 (회색 완성형 폰트) -->
      <text class="stroke-ghost-text" x="100" y="105"
            text-anchor="middle" dominant-baseline="central"
            font-size="135" font-weight="900"
            font-family="'Noto Sans KR', sans-serif"
            fill="rgba(255,255,255,0.13)">${curChar}</text>

      <!-- 2. 순서대로 채워지는 완성형 폰트 (100% 동일 폰트/위치, 마스크로 순차 공개) -->
      <text class="stroke-revealed-text" x="100" y="105"
            text-anchor="middle" dominant-baseline="central"
            font-size="135" font-weight="900"
            font-family="'Noto Sans KR', sans-serif"
            fill="url(#strokeGradient)"
            mask="url(#${maskId})">${curChar}</text>

      <!-- 3. 획 번호 배지 오버레이 -->
      <g id="${strokeId}_markers"></g>
    </svg>
  `;

  document.getElementById('mode-content').innerHTML = `
    <div class="stroke-view-container">
      <div style="font-size:12px;color:var(--muted);margin-bottom:8px">
        ${S.strokeIndex+1} / ${words.length} 단어 획순 연습 · 총 <b style="color:var(--accent)">${strokePlan.length}획</b>
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

  // 획순 와이프 애니메이션 시작
  startStrokeAnimation(maskId, strokeId, strokePlan);
}

// ── 획순 와이프 애니메이션 드라이버 (독립 frame + setTimeout) ──
function startStrokeAnimation(maskId, strokeId, plan) {
  if (window._strokeRafId) cancelAnimationFrame(window._strokeRafId);
  if (window._strokeTimeoutId) clearTimeout(window._strokeTimeoutId);

  const shapesGroup = document.getElementById(`${maskId}_shapes`);
  const markersGroup = document.getElementById(`${strokeId}_markers`);
  if (!shapesGroup || !plan.length) return;

  shapesGroup.innerHTML = '';
  if (markersGroup) markersGroup.innerHTML = '';

  const NS = 'http://www.w3.org/2000/svg';
  const markerColors = ['#818cf8', '#a78bfa', '#f472b6', '#38bdf8', '#34d399', '#fbbf24', '#f87171', '#c084fc', '#e879f9'];
  const baseDur = 400 / S.strokeSpeed;
  const gapDur = 150 / S.strokeSpeed;

  let curIdx = 0;
  const doneWipes = [];

  function addMarker(idx, st) {
    if (!markersGroup || !S.strokeShowNumbers) return;
    const color = markerColors[idx % markerColors.length];
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'stroke-marker-node');
    g.style.opacity = '0';
    g.style.transformOrigin = `${st.nx.toFixed(1)}px ${st.ny.toFixed(1)}px`;
    g.style.transform = 'scale(0.3)';
    g.style.transition = 'opacity 0.2s cubic-bezier(0.34,1.56,0.64,1), transform 0.25s cubic-bezier(0.34,1.56,0.64,1)';

    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', st.nx.toFixed(1));
    c.setAttribute('cy', st.ny.toFixed(1));
    c.setAttribute('r', '8');
    c.setAttribute('fill', '#0f172a');
    c.setAttribute('stroke', color);
    c.setAttribute('stroke-width', '2');
    g.appendChild(c);

    const txt = document.createElementNS(NS, 'text');
    txt.setAttribute('x', st.nx.toFixed(1));
    txt.setAttribute('y', st.ny.toFixed(1));
    txt.setAttribute('fill', color);
    txt.setAttribute('font-size', '9');
    txt.setAttribute('font-weight', '900');
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('dominant-baseline', 'central');
    txt.setAttribute('font-family', "'Noto Sans KR', sans-serif");
    txt.textContent = idx + 1;
    g.appendChild(txt);

    markersGroup.appendChild(g);
    requestAnimationFrame(() => {
      g.style.opacity = '1';
      g.style.transform = 'scale(1)';
    });
  }

  function renderMaskState(curShapes) {
    shapesGroup.innerHTML = '';
    for (const el of doneWipes) {
      shapesGroup.appendChild(el.cloneNode(true));
    }
    if (curShapes) {
      for (const el of curShapes) {
        shapesGroup.appendChild(el);
      }
    }
  }

  function next() {
    if (curIdx >= plan.length) {
      // 모든 획 완료: 마스크 전체 영역 100% 개방
      shapesGroup.innerHTML = '';
      const fullRect = document.createElementNS(NS, 'rect');
      fullRect.setAttribute('x', '0');
      fullRect.setAttribute('y', '0');
      fullRect.setAttribute('width', '200');
      fullRect.setAttribute('height', '200');
      fullRect.setAttribute('fill', 'white');
      shapesGroup.appendChild(fullRect);
      window._strokeRafId = null;
      window._strokeTimeoutId = null;
      return;
    }

    const st = plan[curIdx];
    addMarker(curIdx, st);

    const t0 = performance.now();
    function frame(now) {
      const elapsed = now - t0;
      const progress = Math.min(elapsed / baseDur, 1.0);
      const eased = 1 - Math.pow(1 - progress, 3);

      const curShapes = [];
      st.steps.forEach(step => {
        const stepT0 = step.t0 || 0;
        const stepT1 = step.t1 || 1.0;
        let subP = 0;
        if (eased >= stepT1) subP = 1.0;
        else if (eased <= stepT0) subP = 0;
        else subP = (eased - stepT0) / (stepT1 - stepT0);

        if (subP > 0) {
          curShapes.push(createWipeSvgElement(step, subP, st.sx, st.sy, st.sw, st.sh));
        }
      });

      renderMaskState(curShapes);

      if (progress < 1.0) {
        window._strokeRafId = requestAnimationFrame(frame);
      } else {
        // 확정 저장
        st.steps.forEach(step => {
          doneWipes.push(createWipeSvgElement(step, 1.0, st.sx, st.sy, st.sw, st.sh));
        });
        renderMaskState(null);

        curIdx++;
        window._strokeTimeoutId = setTimeout(next, gapDur);
      }
    }

    window._strokeRafId = requestAnimationFrame(frame);
  }

  window._strokeTimeoutId = setTimeout(next, 250);
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

function nextStroke() {
  const words = TOPIK_DATA[S.level] || [];
  S.strokeIndex = (S.strokeIndex + 1) % words.length;
  S.strokeCharIdx = 0;
  renderStrokeMode();
}

function prevStroke() {
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

with open(r'c:\Myproject\auto_income\web_simulator.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "// ══════════════════════════════════════════════════════════════════\n//  완벽한 한글 획순 정밀 BBox 마스크 와이프 엔진"
end_marker = "function clearStrokeCanvas() {\n  const cvs = document.getElementById('stroke-draw-canvas');\n  if (cvs) {\n    const ctx = cvs.getContext('2d');\n    ctx.clearRect(0, 0, cvs.width, cvs.height);\n  }\n}"

start_pos = content.find(start_marker)
end_pos = content.find(end_marker)

if start_pos == -1 or end_pos == -1:
    print(f"Markers not found! start: {start_pos}, end: {end_pos}")
    sys.exit(1)

end_pos += len(end_marker)

updated_content = content[:start_pos] + new_stroke_code.strip() + content[end_pos:]

with open(r'c:\Myproject\auto_income\web_simulator.html', 'w', encoding='utf-8') as f:
    f.write(updated_content)

print(f"Replacement successful! Replaced chars from {start_pos} to {end_pos}")
