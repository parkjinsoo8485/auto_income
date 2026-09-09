// ═══════════════════════════════════════════════════════
//  INTERACTIVE HANGUL STROKE ORDER ENGINE & CANVAS (V2)
// ═══════════════════════════════════════════════════════
const HANGUL_CHOS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const HANGUL_JUNGS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const HANGUL_JONGS = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

// Helper to generate smooth circle points (counter-clockwise starting from top 12 o'clock)
function makeCirclePoints(cx, cy, rx, ry, count = 28) {
  const pts = [];
  for (let i = 0; i <= count; i++) {
    const angle = -Math.PI / 2 - (2 * Math.PI * i) / count;
    pts.push([
      Math.round((cx + rx * Math.cos(angle)) * 1000) / 1000,
      Math.round((cy + ry * Math.sin(angle)) * 1000) / 1000,
    ]);
  }
  return pts;
}

const HANGUL_STROKES_DB = {
  // ── 기본 자음 (Consonants) ──
  'ㄱ': [{pts:[[0.18,0.22],[0.82,0.22],[0.82,0.82]], desc:'1획: 가로로 긋다가 아래로 꺾기'}],
  'ㄲ': [
    {pts:[[0.12,0.22],[0.46,0.22],[0.46,0.82]], desc:'1획: 첫 번째 기역'},
    {pts:[[0.54,0.22],[0.88,0.22],[0.88,0.82]], desc:'2획: 두 번째 기역'}
  ],
  'ㄴ': [{pts:[[0.22,0.18],[0.22,0.82],[0.82,0.82]], desc:'1획: 위에서 아래로 긋다가 오른쪽으로 꺾기'}],
  'ㄷ': [
    {pts:[[0.22,0.22],[0.80,0.22]], desc:'1획: 위 가로선'},
    {pts:[[0.22,0.22],[0.22,0.82],[0.82,0.82]], desc:'2획: 세로로 내려와 아래 가로선 긋기'}
  ],
  'ㄸ': [
    {pts:[[0.12,0.22],[0.46,0.22]], desc:'1획'},
    {pts:[[0.12,0.22],[0.12,0.82],[0.46,0.82]], desc:'2획'},
    {pts:[[0.54,0.22],[0.88,0.22]], desc:'3획'},
    {pts:[[0.54,0.22],[0.54,0.82],[0.88,0.82]], desc:'4획'}
  ],
  'ㄹ': [
    {pts:[[0.20,0.20],[0.80,0.20],[0.80,0.48]], desc:'1획: ㄱ 형태'},
    {pts:[[0.20,0.48],[0.80,0.48]], desc:'2획: 중간 가로선'},
    {pts:[[0.20,0.48],[0.20,0.82],[0.80,0.82]], desc:'3획: ㄴ 형태'}
  ],
  'ㅁ': [
    {pts:[[0.20,0.20],[0.20,0.82]], desc:'1획: 왼쪽 세로선'},
    {pts:[[0.20,0.20],[0.80,0.20],[0.80,0.82]], desc:'2획: 위 가로선에서 오른쪽 세로선'},
    {pts:[[0.20,0.82],[0.80,0.82]], desc:'3획: 아래 가로선 닫기'}
  ],
  'ㅂ': [
    {pts:[[0.22,0.18],[0.22,0.82]], desc:'1획: 왼쪽 세로선'},
    {pts:[[0.78,0.18],[0.78,0.82]], desc:'2획: 오른쪽 세로선'},
    {pts:[[0.22,0.50],[0.78,0.50]], desc:'3획: 중간 가로선'},
    {pts:[[0.22,0.82],[0.78,0.82]], desc:'4획: 아래 가로선 닫기'}
  ],
  'ㅃ': [
    {pts:[[0.12,0.18],[0.12,0.82]]}, {pts:[[0.46,0.18],[0.46,0.82]]},
    {pts:[[0.12,0.50],[0.46,0.50]]}, {pts:[[0.12,0.82],[0.46,0.82]]},
    {pts:[[0.54,0.18],[0.54,0.82]]}, {pts:[[0.88,0.18],[0.88,0.82]]},
    {pts:[[0.54,0.50],[0.88,0.50]]}, {pts:[[0.54,0.82],[0.88,0.82]]}
  ],
  'ㅅ': [
    {pts:[[0.50,0.18],[0.18,0.82]], desc:'1획: 위에서 왼쪽 아래로 삐침'},
    {pts:[[0.44,0.46],[0.82,0.82]], desc:'2획: 중심에서 오른쪽 아래로 삐침'}
  ],
  'ㅆ': [
    {pts:[[0.32,0.18],[0.10,0.82]]}, {pts:[[0.28,0.46],[0.48,0.82]]},
    {pts:[[0.70,0.18],[0.52,0.82]]}, {pts:[[0.66,0.46],[0.90,0.82]]}
  ],
  'ㅇ': [
    {pts: makeCirclePoints(0.50, 0.50, 0.35, 0.35, 28), desc:'1획: 상단에서 반시계 방향으로 둥글게 원 그리기'}
  ],
  'ㅈ': [
    {pts:[[0.18,0.22],[0.82,0.22]], desc:'1획: 위 가로선'},
    {pts:[[0.50,0.22],[0.20,0.82]], desc:'2획: 중심에서 왼쪽 아래로 삐침'},
    {pts:[[0.44,0.48],[0.80,0.82]], desc:'3획: 오른쪽 아래로 삐침'}
  ],
  'ㅉ': [
    {pts:[[0.12,0.22],[0.46,0.22]]}, {pts:[[0.29,0.22],[0.10,0.82]]}, {pts:[[0.25,0.48],[0.46,0.82]]},
    {pts:[[0.54,0.22],[0.88,0.22]]}, {pts:[[0.71,0.22],[0.54,0.82]]}, {pts:[[0.67,0.48],[0.88,0.82]]}
  ],
  'ㅊ': [
    {pts:[[0.50,0.10],[0.50,0.22]], desc:'1획: 맨 위 꼭지점 점/세로선'},
    {pts:[[0.18,0.30],[0.82,0.30]], desc:'2획: 가로선'},
    {pts:[[0.50,0.30],[0.20,0.85]], desc:'3획: 왼쪽 아래 삐침'},
    {pts:[[0.44,0.54],[0.80,0.85]], desc:'4획: 오른쪽 아래 삐침'}
  ],
  'ㅋ': [
    {pts:[[0.18,0.20],[0.82,0.20],[0.82,0.82]], desc:'1획: ㄱ 형태'},
    {pts:[[0.18,0.50],[0.80,0.50]], desc:'2획: 가운데 가로선'}
  ],
  'ㅌ': [
    {pts:[[0.20,0.20],[0.80,0.20]], desc:'1획: 맨 위 가로선'},
    {pts:[[0.20,0.50],[0.76,0.50]], desc:'2획: 중간 가로선'},
    {pts:[[0.20,0.20],[0.20,0.82],[0.80,0.82]], desc:'3획: 세로 및 아래 가로선'}
  ],
  'ㅍ': [
    {pts:[[0.16,0.20],[0.84,0.20]], desc:'1획: 위 가로선'},
    {pts:[[0.36,0.20],[0.36,0.82]], desc:'2획: 왼쪽 세로선'},
    {pts:[[0.64,0.20],[0.64,0.82]], desc:'3획: 오른쪽 세로선'},
    {pts:[[0.16,0.82],[0.84,0.82]], desc:'4획: 아래 가로선'}
  ],
  'ㅎ': [
    {pts:[[0.50,0.12],[0.50,0.22]], desc:'1획: 상단 점/짧은 획'},
    {pts:[[0.18,0.32],[0.82,0.32]], desc:'2획: 중간 가로선'},
    {pts: makeCirclePoints(0.50, 0.65, 0.25, 0.23, 28), desc:'3획: 아래 둥근 원'}
  ],

  // ── 겹받침 (Complex Final Consonants) ──
  'ㄳ': [{pts:[[0.12,0.22],[0.46,0.22],[0.46,0.82]]}, {pts:[[0.70,0.18],[0.52,0.82]]}, {pts:[[0.66,0.46],[0.90,0.82]]}],
  'ㄵ': [{pts:[[0.14,0.18],[0.14,0.82],[0.46,0.82]]}, {pts:[[0.54,0.22],[0.88,0.22]]}, {pts:[[0.71,0.22],[0.54,0.82]]}, {pts:[[0.67,0.48],[0.88,0.82]]}],
  'ㄶ': [{pts:[[0.14,0.18],[0.14,0.82],[0.46,0.82]]}, {pts:[[0.71,0.12],[0.71,0.22]]}, {pts:[[0.54,0.32],[0.88,0.32]]}, {pts: makeCirclePoints(0.71, 0.65, 0.17, 0.20, 24)}],
  'ㄺ': [{pts:[[0.12,0.20],[0.46,0.20],[0.46,0.48]]}, {pts:[[0.12,0.48],[0.46,0.48]]}, {pts:[[0.12,0.48],[0.12,0.82],[0.46,0.82]]}, {pts:[[0.54,0.22],[0.88,0.22],[0.88,0.82]]}],
  'ㄻ': [{pts:[[0.12,0.20],[0.46,0.20],[0.46,0.48]]}, {pts:[[0.12,0.48],[0.46,0.48]]}, {pts:[[0.12,0.48],[0.12,0.82],[0.46,0.82]]}, {pts:[[0.54,0.20],[0.54,0.82]]}, {pts:[[0.54,0.20],[0.88,0.20],[0.88,0.82]]}, {pts:[[0.54,0.82],[0.88,0.82]]}],
  'ㄼ': [{pts:[[0.12,0.20],[0.46,0.20],[0.46,0.48]]}, {pts:[[0.12,0.48],[0.46,0.48]]}, {pts:[[0.12,0.48],[0.12,0.82],[0.46,0.82]]}, {pts:[[0.54,0.18],[0.54,0.82]]}, {pts:[[0.88,0.18],[0.88,0.82]]}, {pts:[[0.54,0.50],[0.88,0.50]]}, {pts:[[0.54,0.82],[0.88,0.82]]}],
  'ㄽ': [{pts:[[0.12,0.20],[0.46,0.20],[0.46,0.48]]}, {pts:[[0.12,0.48],[0.46,0.48]]}, {pts:[[0.12,0.48],[0.12,0.82],[0.46,0.82]]}, {pts:[[0.70,0.18],[0.52,0.82]]}, {pts:[[0.66,0.46],[0.90,0.82]]}],
  'ㄾ': [{pts:[[0.12,0.20],[0.46,0.20],[0.46,0.48]]}, {pts:[[0.12,0.48],[0.46,0.48]]}, {pts:[[0.12,0.48],[0.12,0.82],[0.46,0.82]]}, {pts:[[0.54,0.20],[0.88,0.20]]}, {pts:[[0.54,0.50],[0.85,0.50]]}, {pts:[[0.54,0.20],[0.54,0.82],[0.88,0.82]]}],
  'ㄿ': [{pts:[[0.12,0.20],[0.46,0.20],[0.46,0.48]]}, {pts:[[0.12,0.48],[0.46,0.48]]}, {pts:[[0.12,0.48],[0.12,0.82],[0.46,0.82]]}, {pts:[[0.52,0.20],[0.90,0.20]]}, {pts:[[0.64,0.20],[0.64,0.82]]}, {pts:[[0.78,0.20],[0.78,0.82]]}, {pts:[[0.52,0.82],[0.90,0.82]]}],
  'ㅀ': [{pts:[[0.12,0.20],[0.46,0.20],[0.46,0.48]]}, {pts:[[0.12,0.48],[0.46,0.48]]}, {pts:[[0.12,0.48],[0.12,0.82],[0.46,0.82]]}, {pts:[[0.71,0.12],[0.71,0.22]]}, {pts:[[0.54,0.32],[0.88,0.32]]}, {pts: makeCirclePoints(0.71, 0.65, 0.17, 0.20, 24)}],
  'ㅄ': [{pts:[[0.12,0.18],[0.12,0.82]]}, {pts:[[0.46,0.18],[0.46,0.82]]}, {pts:[[0.12,0.50],[0.46,0.50]]}, {pts:[[0.12,0.82],[0.46,0.82]]}, {pts:[[0.70,0.18],[0.52,0.82]]}, {pts:[[0.66,0.46],[0.90,0.82]]}],

  // ── 기본 모음 (Vowels) ──
  'ㅏ': [
    {pts:[[0.30,0.08],[0.30,0.92]], desc:'1획: 위에서 아래로 긴 세로선'},
    {pts:[[0.30,0.50],[0.85,0.50]], desc:'2획: 중간에서 오른쪽으로 짧은 가로선'}
  ],
  'ㅑ': [
    {pts:[[0.30,0.08],[0.30,0.92]], desc:'1획: 긴 세로선'},
    {pts:[[0.30,0.35],[0.82,0.35]], desc:'2획: 위쪽 짧은 가로선'},
    {pts:[[0.30,0.65],[0.82,0.65]], desc:'3획: 아래쪽 짧은 가로선'}
  ],
  'ㅓ': [
    {pts:[[0.15,0.50],[0.70,0.50]], desc:'1획: 왼쪽에서 오른쪽으로 짧은 가로선'},
    {pts:[[0.70,0.08],[0.70,0.92]], desc:'2획: 긴 세로선'}
  ],
  'ㅕ': [
    {pts:[[0.18,0.35],[0.70,0.35]], desc:'1획: 위쪽 가로선'},
    {pts:[[0.18,0.65],[0.70,0.65]], desc:'2획: 아래쪽 가로선'},
    {pts:[[0.70,0.08],[0.70,0.92]], desc:'3획: 긴 세로선'}
  ],
  'ㅗ': [
    {pts:[[0.50,0.18],[0.50,0.65]], desc:'1획: 가운데 짧은 세로선'},
    {pts:[[0.12,0.65],[0.88,0.65]], desc:'2획: 긴 가로선'}
  ],
  'ㅛ': [
    {pts:[[0.35,0.18],[0.35,0.65]], desc:'1획: 왼쪽 짧은 세로선'},
    {pts:[[0.65,0.18],[0.65,0.65]], desc:'2획: 오른쪽 짧은 세로선'},
    {pts:[[0.12,0.65],[0.88,0.65]], desc:'3획: 긴 가로선'}
  ],
  'ㅜ': [
    {pts:[[0.12,0.35],[0.88,0.35]], desc:'1획: 긴 가로선'},
    {pts:[[0.50,0.35],[0.50,0.82]], desc:'2획: 가운데 아래로 짧은 세로선'}
  ],
  'ㅠ': [
    {pts:[[0.12,0.35],[0.88,0.35]], desc:'1획: 긴 가로선'},
    {pts:[[0.35,0.35],[0.35,0.82]], desc:'2획: 왼쪽 짧은 세로선'},
    {pts:[[0.65,0.35],[0.65,0.82]], desc:'3획: 오른쪽 짧은 세로선'}
  ],
  'ㅡ': [
    {pts:[[0.10,0.50],[0.90,0.50]], desc:'1획: 왼쪽에서 오른쪽으로 긴 가로선'}
  ],
  'ㅣ': [
    {pts:[[0.50,0.08],[0.50,0.92]], desc:'1획: 위에서 아래로 긴 세로선'}
  ],

  // ── 이중 모음 (Complex Vowels) ──
  'ㅐ': [
    {pts:[[0.22,0.08],[0.22,0.92]], desc:'1획: 왼쪽 세로선'},
    {pts:[[0.22,0.50],[0.78,0.50]], desc:'2획: 연결 가로선'},
    {pts:[[0.78,0.08],[0.78,0.92]], desc:'3획: 오른쪽 세로선'}
  ],
  'ㅒ': [
    {pts:[[0.22,0.08],[0.22,0.92]], desc:'1획: 왼쪽 세로선'},
    {pts:[[0.22,0.35],[0.78,0.35]], desc:'2획: 위 가로선'},
    {pts:[[0.22,0.65],[0.78,0.65]], desc:'3획: 아래 가로선'},
    {pts:[[0.78,0.08],[0.78,0.92]], desc:'4획: 오른쪽 세로선'}
  ],
  'ㅔ': [
    {pts:[[0.15,0.50],[0.46,0.50]], desc:'1획: 왼쪽 가로선'},
    {pts:[[0.46,0.08],[0.46,0.92]], desc:'2획: 중간 세로선'},
    {pts:[[0.82,0.08],[0.82,0.92]], desc:'3획: 오른쪽 세로선'}
  ],
  'ㅖ': [
    {pts:[[0.15,0.35],[0.46,0.35]], desc:'1획: 위 가로선'},
    {pts:[[0.15,0.65],[0.46,0.65]], desc:'2획: 아래 가로선'},
    {pts:[[0.46,0.08],[0.46,0.92]], desc:'3획: 중간 세로선'},
    {pts:[[0.82,0.08],[0.82,0.92]], desc:'4획: 오른쪽 세로선'}
  ],
  'ㅘ': [
    {pts:[[0.32,0.22],[0.32,0.68]]}, {pts:[[0.12,0.68],[0.52,0.68]]},
    {pts:[[0.68,0.08],[0.68,0.92]]}, {pts:[[0.68,0.50],[0.92,0.50]]}
  ],
  'ㅙ': [
    {pts:[[0.25,0.22],[0.25,0.68]]}, {pts:[[0.10,0.68],[0.45,0.68]]},
    {pts:[[0.55,0.08],[0.55,0.92]]}, {pts:[[0.55,0.50],[0.85,0.50]]}, {pts:[[0.85,0.08],[0.85,0.92]]}
  ],
  'ㅚ': [
    {pts:[[0.32,0.22],[0.32,0.68]]}, {pts:[[0.12,0.68],[0.55,0.68]]},
    {pts:[[0.78,0.08],[0.78,0.92]]}
  ],
  'ㅝ': [
    {pts:[[0.12,0.52],[0.52,0.52]]}, {pts:[[0.32,0.52],[0.32,0.85]]},
    {pts:[[0.52,0.48],[0.74,0.48]]}, {pts:[[0.74,0.08],[0.74,0.92]]}
  ],
  'ㅞ': [
    {pts:[[0.10,0.52],[0.45,0.52]]}, {pts:[[0.26,0.52],[0.26,0.85]]},
    {pts:[[0.45,0.48],[0.65,0.48]]}, {pts:[[0.65,0.08],[0.65,0.92]]}, {pts:[[0.88,0.08],[0.88,0.92]]}
  ],
  'ㅟ': [
    {pts:[[0.12,0.52],[0.55,0.52]]}, {pts:[[0.32,0.52],[0.32,0.85]]},
    {pts:[[0.78,0.08],[0.78,0.92]]}
  ],
  'ㅢ': [
    {pts:[[0.10,0.65],[0.65,0.65]]},
    {pts:[[0.78,0.08],[0.78,0.92]]}
  ]
};

// Decompose Hangul syllable with authentic Korean typography layout proportions
function decomposeHangulSyllable(ch) {
  if (!ch) return [];
  const code = ch.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) {
    if (HANGUL_STROKES_DB[ch]) {
      return [{ char: ch, type: 'jamo', box: {x:0.08, y:0.08, w:0.84, h:0.84}, strokes: HANGUL_STROKES_DB[ch] }];
    }
    return [];
  }
  const syl = code - 0xAC00;
  const choIdx = Math.floor(syl / (21 * 28));
  const jungIdx = Math.floor((syl % (21 * 28)) / 28);
  const jongIdx = syl % 28;

  const cho = HANGUL_CHOS[choIdx];
  const jung = HANGUL_JUNGS[jungIdx];
  const jong = HANGUL_JONGS[jongIdx];
  const hasJong = !!jong;

  const isVert = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅣ'].includes(jung);
  const isHoriz = ['ㅗ','ㅛ','ㅜ','ㅠ','ㅡ'].includes(jung);

  let choBox, jungBox, jongBox;
  if (!hasJong) {
    if (isVert) {
      // 좌우형 (가, 나, 다, 하, 세 등) - 조화로운 밸런스 배치
      choBox = {x:0.10, y:0.14, w:0.42, h:0.72};
      jungBox = {x:0.52, y:0.10, w:0.38, h:0.80};
    } else if (isHoriz) {
      // 상하형 (고, 노, 도, 호, 요 등)
      choBox = {x:0.20, y:0.10, w:0.60, h:0.40};
      jungBox = {x:0.12, y:0.50, w:0.76, h:0.42};
    } else {
      // 복합모음형 (과, 궤, 귀, 의 등)
      choBox = {x:0.10, y:0.10, w:0.42, h:0.40};
      jungBox = {x:0.10, y:0.10, w:0.82, h:0.82};
    }
  } else {
    if (isVert) {
      // 받침 있는 좌우형 (한, 녕, 강, 달, 말 등)
      choBox = {x:0.10, y:0.08, w:0.40, h:0.44};
      jungBox = {x:0.52, y:0.06, w:0.38, h:0.48};
      jongBox = {x:0.18, y:0.56, w:0.64, h:0.38};
    } else if (isHoriz) {
      // 받침 있는 상하형 (공, 국, 문, 글 등)
      choBox = {x:0.22, y:0.06, w:0.56, h:0.28};
      jungBox = {x:0.14, y:0.34, w:0.72, h:0.26};
      jongBox = {x:0.18, y:0.62, w:0.64, h:0.34};
    } else {
      // 받침 있는 복합모음형 (광, 괸 등)
      choBox = {x:0.10, y:0.06, w:0.38, h:0.32};
      jungBox = {x:0.10, y:0.06, w:0.82, h:0.56};
      jongBox = {x:0.18, y:0.64, w:0.64, h:0.32};
    }
  }

  const res = [];
  if (HANGUL_STROKES_DB[cho]) res.push({ char: cho, type: 'cho', box: choBox, strokes: HANGUL_STROKES_DB[cho] });
  if (HANGUL_STROKES_DB[jung]) res.push({ char: jung, type: 'jung', box: jungBox, strokes: HANGUL_STROKES_DB[jung] });
  if (hasJong && HANGUL_STROKES_DB[jong]) res.push({ char: jong, type: 'jong', box: jongBox, strokes: HANGUL_STROKES_DB[jong] });
  return res;
}

function getFlattenedStrokes(char) {
  const parts = decomposeHangulSyllable(char);
  const list = [];
  let gIdx = 0;
  parts.forEach(part => {
    part.strokes.forEach((st, stIdx) => {
      const transPts = st.pts.map(p => ({
        x: part.box.x + p[0] * part.box.w,
        y: part.box.y + p[1] * part.box.h,
      }));
      list.push({
        globalIndex: gIdx++,
        char: part.char,
        points: transPts,
        desc: st.desc || '',
      });
    });
  });
  return list;
}

// ── Practice Categories Preset Library ──
const HANGUL_PRACTICE_PRESETS = {
  cons: {
    title: '🔤 기본 자음 (14자)',
    items: ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
  },
  double_cons: {
    title: '👥 쌍자음 (5자)',
    items: ['ㄲ','ㄸ','ㅃ','ㅆ','ㅉ']
  },
  vowel: {
    title: '🔠 기본 모음 (10자)',
    items: ['ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ']
  },
  complex_vowel: {
    title: '🔀 이중 모음 (11자)',
    items: ['ㅐ','ㅒ','ㅔ','ㅖ','ㅘ','ㅙ','ㅚ','ㅝ','ㅞ','ㅟ','ㅢ']
  },
  basic_words: {
    title: '👶 기초 단어 (받침 없음)',
    items: ['가구','나라','다리','라디오','마음','바다','사자','아이','자전거','차','커피','토마토','포도','하늘']
  },
  batchim_words: {
    title: '🏆 기초 단어 (받침 있음)',
    items: ['한글','한국','학교','학생','선생님','친구','사랑','가족','음식','공부','봄','여름','가을','겨울']
  },
  custom: {
    title: '✏️ 직접 입력',
    items: []
  }
};

let strokeState = {
  category: 'basic_words', // 'cons', 'double_cons', 'vowel', 'complex_vowel', 'basic_words', 'batchim_words', 'topik', 'custom'
  mode: 'watch', // 'watch' or 'practice'
  word: '하늘',
  chars: ['하','늘'],
  charIdx: 0,
  strokes: [],
  activeStrokeIdx: 0,
  animProgress: 0,
  isPlaying: false,
  speed: 1.0,
  showGuide: true,
  userStrokes: [],
  currentPath: [],
  animFrameId: null,
};

function startWordStroke(word) {
  switchTab('learn');
  switchMode('stroke');
  strokeState.category = 'custom';
  initStrokeWord(word || '한글');
}

function initStrokeWord(word) {
  const cleanChars = Array.from(word || '한글').filter(c => c.trim().length > 0);
  strokeState.chars = cleanChars.length ? cleanChars : ['가'];
  strokeState.charIdx = 0;
  strokeState.word = word || strokeState.chars.join('');
  loadStrokeChar(0);
}

function selectStrokeCategory(catKey) {
  strokeState.category = catKey;
  if (catKey === 'topik') {
    const words = TOPIK_DATA[S.level] || [];
    const curW = words[S.cardIndex || 0] || words[0] || { term: '한국' };
    initStrokeWord(curW.term);
  } else if (catKey === 'custom') {
    renderStrokeMode();
  } else if (HANGUL_PRACTICE_PRESETS[catKey]) {
    const first = HANGUL_PRACTICE_PRESETS[catKey].items[0] || '가';
    initStrokeWord(first);
  }
}

function submitCustomStrokeWord() {
  const input = document.getElementById('custom-stroke-input');
  if (input && input.value.trim()) {
    initStrokeWord(input.value.trim());
  }
}

function loadStrokeChar(idx) {
  if (idx < 0 || idx >= strokeState.chars.length) return;
  cancelAnimationFrame(strokeState.animFrameId);
  strokeState.charIdx = idx;
  strokeState.strokes = getFlattenedStrokes(strokeState.chars[idx]);
  strokeState.activeStrokeIdx = 0;
  strokeState.animProgress = 0;
  strokeState.isPlaying = false;
  strokeState.userStrokes = [];
  strokeState.currentPath = [];

  renderStrokeMode();

  if (strokeState.mode === 'watch') {
    playStrokeAnim();
  }
}

function renderStrokeMode() {
  const currentChar = strokeState.chars[strokeState.charIdx] || '가';

  // Category items list
  let categoryItems = [];
  if (strokeState.category === 'topik') {
    categoryItems = (TOPIK_DATA[S.level] || []).slice(0, 15).map(w => w.term);
  } else if (HANGUL_PRACTICE_PRESETS[strokeState.category]) {
    categoryItems = HANGUL_PRACTICE_PRESETS[strokeState.category].items;
  }

  document.getElementById('mode-content').innerHTML = `
    <div class="stroke-view-container" style="padding:14px 16px">
      <!-- Category Tabs (Horizontal Scroll) -->
      <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:12px;-webkit-overflow-scrolling:touch;scrollbar-width:none">
        <button class="filter-chip ${strokeState.category==='cons'?'active':''}" onclick="selectStrokeCategory('cons')">기본 자음</button>
        <button class="filter-chip ${strokeState.category==='double_cons'?'active':''}" onclick="selectStrokeCategory('double_cons')">쌍자음</button>
        <button class="filter-chip ${strokeState.category==='vowel'?'active':''}" onclick="selectStrokeCategory('vowel')">기본 모음</button>
        <button class="filter-chip ${strokeState.category==='complex_vowel'?'active':''}" onclick="selectStrokeCategory('complex_vowel')">이중 모음</button>
        <button class="filter-chip ${strokeState.category==='basic_words'?'active':''}" onclick="selectStrokeCategory('basic_words')">기초 단어</button>
        <button class="filter-chip ${strokeState.category==='batchim_words'?'active':''}" onclick="selectStrokeCategory('batchim_words')">받침 단어</button>
        <button class="filter-chip ${strokeState.category==='topik'?'active':''}" onclick="selectStrokeCategory('topik')">TOPIK Lv.${S.level}</button>
        <button class="filter-chip ${strokeState.category==='custom'?'active':''}" onclick="selectStrokeCategory('custom')">✏️ 직접 입력</button>
      </div>

      <!-- Custom Word Input (When custom tab is active) -->
      ${strokeState.category === 'custom' ? `
        <div style="display:flex;gap:8px;margin-bottom:14px;background:var(--card);padding:8px;border-radius:14px;border:1px solid var(--border)">
          <input type="text" id="custom-stroke-input" placeholder="연습할 한글 단어 입력 (예: 사랑, 안녕하세요)" value="${strokeState.word}" style="flex:1;background:transparent;border:none;color:#fff;font-family:inherit;font-size:15px;padding:6px 8px;outline:none" onkeydown="if(event.key==='Enter')submitCustomStrokeWord()">
          <button class="btn-primary" style="padding:8px 16px;width:auto;margin:0;font-size:13px" onclick="submitCustomStrokeWord()">연습 시작</button>
        </div>
      ` : ''}

      <!-- Preset Items Quick Select Carousel -->
      ${categoryItems.length > 0 ? `
        <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;margin-bottom:14px;scrollbar-width:none">
          ${categoryItems.map(item => `
            <button class="filter-chip ${item === strokeState.word ? 'active' : ''}" style="font-size:14px;font-weight:700;padding:6px 14px;white-space:nowrap;background:${item===strokeState.word?'linear-gradient(135deg,var(--accent),var(--accent2))':'var(--card)'}" onclick="initStrokeWord('${item}')">${item}</button>
          `).join('')}
        </div>
      ` : ''}

      <!-- Word Title & Multi-Character Selection Pills -->
      <div style="text-align:center;margin-bottom:12px">
        <div style="font-size:26px;font-weight:900;color:var(--text);letter-spacing:1px">${strokeState.word}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:2px">국립국어원 표준 한글 획순 인터랙티브 학습</div>
      </div>

      ${strokeState.chars.length > 1 ? `
        <div style="display:flex;gap:8px;margin-bottom:14px;justify-content:center;flex-wrap:wrap">
          ${strokeState.chars.map((c, i) => `
            <button class="filter-chip ${i === strokeState.charIdx ? 'active' : ''}" style="font-size:17px;font-weight:900;padding:8px 20px;border-radius:14px;box-shadow:${i===strokeState.charIdx?'0 4px 14px rgba(99,102,241,0.4)':'none'}" onclick="loadStrokeChar(${i})">${c}</button>
          `).join('')}
        </div>
      ` : ''}

      <!-- Mode Selector (Watch vs Practice) -->
      <div style="display:flex;background:var(--card);border-radius:24px;padding:4px;margin:0 auto 16px;border:1px solid var(--border);max-width:320px">
        <button class="btn-primary" style="flex:1;padding:8px 14px;font-size:13px;border-radius:20px;margin:0;background:${strokeState.mode==='watch'?'linear-gradient(135deg,var(--accent),var(--accent2))':'transparent'};color:${strokeState.mode==='watch'?'#fff':'var(--muted)'};box-shadow:none" onclick="setStrokeSubMode('watch')">🎬 획순 보기 (Watch)</button>
        <button class="btn-primary" style="flex:1;padding:8px 14px;font-size:13px;border-radius:20px;margin:0;background:${strokeState.mode==='practice'?'linear-gradient(135deg,var(--accent),var(--accent2))':'transparent'};color:${strokeState.mode==='practice'?'#fff':'var(--muted)'};box-shadow:none" onclick="setStrokeSubMode('practice')">✍️ 직접 쓰기 (Practice)</button>
      </div>

      <!-- Interactive Canvas Box -->
      <div style="position:relative;width:280px;height:280px;margin:0 auto;background:#ffffff;border-radius:24px;box-shadow:0 16px 36px rgba(0,0,0,0.35);overflow:hidden;touch-action:none;user-select:none" id="canvas-container">
        <canvas id="hangul-canvas" width="280" height="280" style="width:100%;height:100%;cursor:crosshair"></canvas>
      </div>

      <!-- Progress Info -->
      <div style="margin-top:12px;text-align:center;font-size:13px;font-weight:700;color:var(--muted)">
        총 ${strokeState.strokes.length}획 중 <span style="color:var(--accent);font-size:15px">${Math.min(strokeState.activeStrokeIdx + 1, strokeState.strokes.length)}획</span> 진행 중
      </div>

      <!-- Mode Specific Action Controls -->
      ${strokeState.mode === 'watch' ? `
        <div style="display:flex;gap:8px;justify-content:center;align-items:center;margin-top:12px;flex-wrap:wrap">
          <button class="tts-btn" style="margin:0" onclick="toggleStrokeAnim()">${strokeState.isPlaying ? '⏸ 일시정지' : '▶ 재생'}</button>
          <button class="tts-btn" style="margin:0" onclick="replayStrokeAnim()">🔄 다시보기</button>
          <button class="tts-btn" style="margin:0" onclick="toggleStrokeGuide()">${strokeState.showGuide ? '👁 힌트 끄기' : '👁 힌트 켜기'}</button>
          <button class="tts-btn" style="margin:0" onclick="speakWord('${strokeState.chars[strokeState.charIdx]}')">🔊 발음 듣기</button>
        </div>
      ` : `
        <div style="display:flex;gap:8px;justify-content:center;align-items:center;margin-top:12px;flex-wrap:wrap">
          <button class="tts-btn" style="margin:0;background:rgba(239,68,68,0.15);color:var(--red);border-color:rgba(239,68,68,0.3)" onclick="clearUserStrokes()">🗑 다시 쓰기</button>
          <button class="tts-btn" style="margin:0" onclick="toggleStrokeGuide()">${strokeState.showGuide ? '가이드 숨김' : '가이드 보기'}</button>
          <button class="tts-btn" style="margin:0" onclick="speakWord('${strokeState.chars[strokeState.charIdx]}')">🔊 발음 듣기</button>
        </div>
      `}

      <!-- Character Navigation Footer -->
      <div style="display:flex;gap:12px;width:100%;max-width:320px;margin:18px auto 0">
        <button class="btn-secondary" style="flex:1" onclick="prevStrokeChar()" ${strokeState.charIdx<=0?'disabled style="opacity:0.4"':''}>← 이전 글자</button>
        <button class="btn-primary" style="flex:1" onclick="nextStrokeChar()" ${strokeState.charIdx>=strokeState.chars.length-1?'disabled style="opacity:0.4"':''}>다음 글자 →</button>
      </div>
    </div>`;

  setupHangulCanvas();
  drawHangulCanvas();
}

function setStrokeSubMode(m) {
  strokeState.mode = m;
  loadStrokeChar(strokeState.charIdx);
}

function toggleStrokeGuide() {
  strokeState.showGuide = !strokeState.showGuide;
  drawHangulCanvas();
}

function prevStrokeChar() {
  if (strokeState.charIdx > 0) loadStrokeChar(strokeState.charIdx - 1);
}

function nextStrokeChar() {
  if (strokeState.charIdx < strokeState.chars.length - 1) loadStrokeChar(strokeState.charIdx + 1);
}

function clearUserStrokes() {
  strokeState.activeStrokeIdx = 0;
  strokeState.userStrokes = [];
  strokeState.currentPath = [];
  drawHangulCanvas();
}

// ── Canvas Setup & Smooth Event Handling ──
function setupHangulCanvas() {
  const canvas = document.getElementById('hangul-canvas');
  if (!canvas) return;

  let isDrawing = false;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  canvas.onmousedown = canvas.ontouchstart = function(e) {
    if (strokeState.mode !== 'practice') return;
    e.preventDefault();
    isDrawing = true;
    strokeState.currentPath = [getPos(e)];
    drawHangulCanvas();
  };

  window.onmousemove = canvas.ontouchmove = function(e) {
    if (!isDrawing || strokeState.mode !== 'practice') return;
    strokeState.currentPath.push(getPos(e));
    drawHangulCanvas();
  };

  window.onmouseup = canvas.ontouchend = function(e) {
    if (!isDrawing || strokeState.mode !== 'practice') return;
    isDrawing = false;
    validateUserStroke();
    strokeState.currentPath = [];
    drawHangulCanvas();
  };
}

function validateUserStroke() {
  if (strokeState.currentPath.length < 2) return;
  if (strokeState.activeStrokeIdx >= strokeState.strokes.length) return;

  const target = strokeState.strokes[strokeState.activeStrokeIdx];
  const canvas = document.getElementById('hangul-canvas');
  if (!canvas) return;

  const targetStart = { x: target.points[0].x * canvas.width, y: target.points[0].y * canvas.height };
  const targetEnd = { x: target.points[target.points.length - 1].x * canvas.width, y: target.points[target.points.length - 1].y * canvas.height };

  const userStart = strokeState.currentPath[0];
  const userEnd = strokeState.currentPath[strokeState.currentPath.length - 1];

  const distStart = Math.hypot(userStart.x - targetStart.x, userStart.y - targetStart.y);
  const distEnd = Math.hypot(userEnd.x - targetEnd.x, userEnd.y - targetEnd.y);
  const tolerance = Math.max(65, canvas.width * 0.25);

  let isSuccess = distStart <= tolerance && distEnd <= tolerance;

  // Circle special tolerance
  if (target.points.length > 6) {
    const loopDist = Math.hypot(userStart.x - userEnd.x, userStart.y - userEnd.y);
    if (distStart <= tolerance && loopDist <= tolerance * 1.5) isSuccess = true;
  }

  if (isSuccess) {
    strokeState.userStrokes.push([...strokeState.currentPath]);
    strokeState.activeStrokeIdx++;
    if (strokeState.activeStrokeIdx >= strokeState.strokes.length) {
      speakWord(strokeState.chars[strokeState.charIdx]);
      setTimeout(() => {
        alert(`🎉 '${strokeState.chars[strokeState.charIdx]}' 글자를 정확한 획순으로 완성했습니다!`);
        if (strokeState.charIdx < strokeState.chars.length - 1) {
          loadStrokeChar(strokeState.charIdx + 1);
        }
      }, 250);
    }
  }
}

// ── Draw Hangul Canvas Frame with Smooth Anti-Aliased Lines ──
function drawHangulCanvas() {
  const canvas = document.getElementById('hangul-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // 1. Grid Guidelines (十 & ✕)
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);

  ctx.beginPath();
  ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
  ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
  ctx.moveTo(0, 0); ctx.lineTo(w, h);
  ctx.moveTo(0, h); ctx.lineTo(w, 0);
  ctx.stroke();
  ctx.setLineDash([]);

  // 2. Faint Outline Guide (Natural soft grey)
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 18;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  strokeState.strokes.forEach(st => {
    if (st.points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(st.points[0].x * w, st.points[0].y * h);
    for (let i = 1; i < st.points.length; i++) {
      ctx.lineTo(st.points[i].x * w, st.points[i].y * h);
    }
    ctx.stroke();
  });

  // 3. Render Completed or Animating Strokes
  if (strokeState.mode === 'watch') {
    // Completed strokes (Indigo/Purple)
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let s = 0; s < strokeState.activeStrokeIdx && s < strokeState.strokes.length; s++) {
      const st = strokeState.strokes[s];
      ctx.beginPath();
      ctx.moveTo(st.points[0].x * w, st.points[0].y * h);
      for (let i = 1; i < st.points.length; i++) ctx.lineTo(st.points[i].x * w, st.points[i].y * h);
      ctx.stroke();
    }

    // Active Animating Stroke (Emerald Green)
    if (strokeState.activeStrokeIdx < strokeState.strokes.length && strokeState.animProgress > 0) {
      const activeSt = strokeState.strokes[strokeState.activeStrokeIdx];
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 15;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      drawPartialCanvasPath(ctx, activeSt.points, w, h, strokeState.animProgress);
    }
  } else {
    // Practice mode completed user paths
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    strokeState.userStrokes.forEach(path => {
      if (path.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
      ctx.stroke();
    });

    // Current drawing path
    if (strokeState.currentPath.length > 1) {
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 15;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(strokeState.currentPath[0].x, strokeState.currentPath[0].y);
      for (let i = 1; i < strokeState.currentPath.length; i++) ctx.lineTo(strokeState.currentPath[i].x, strokeState.currentPath[i].y);
      ctx.stroke();
    }

    // Practice Hint Highlight
    if (strokeState.showGuide && strokeState.activeStrokeIdx < strokeState.strokes.length) {
      const activeSt = strokeState.strokes[strokeState.activeStrokeIdx];
      ctx.strokeStyle = 'rgba(16,185,129,0.38)';
      ctx.lineWidth = 16;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(activeSt.points[0].x * w, activeSt.points[0].y * h);
      for (let i = 1; i < activeSt.points.length; i++) ctx.lineTo(activeSt.points[i].x * w, activeSt.points[i].y * h);
      ctx.stroke();
    }
  }

  // 4. Draw Stroke Order Numbers & Direction Markers
  if (strokeState.showGuide) {
    strokeState.strokes.forEach((st, idx) => {
      const p0 = st.points[0];
      const cx = p0.x * w;
      const cy = p0.y * h;
      const isCurrent = idx === strokeState.activeStrokeIdx;

      // Outer glow/shadow for current stroke
      if (isCurrent) {
        ctx.fillStyle = 'rgba(239,68,68,0.25)';
        ctx.beginPath();
        ctx.arc(cx, cy, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = isCurrent ? '#ef4444' : '#6366f1';
      ctx.beginPath();
      ctx.arc(cx, cy, 11, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((idx + 1).toString(), cx, cy);
    });
  }
}

function drawPartialCanvasPath(ctx, pts, w, h, progress) {
  if (pts.length < 2 || progress <= 0) return;
  const segments = [];
  let totalLen = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = { x: pts[i].x * w, y: pts[i].y * h };
    const p2 = { x: pts[i + 1].x * w, y: pts[i + 1].y * h };
    const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    segments.push({ p1, p2, len });
    totalLen += len;
  }
  const targetLen = totalLen * Math.min(1, Math.max(0, progress));
  let curLen = 0;

  ctx.beginPath();
  ctx.moveTo(segments[0].p1.x, segments[0].p1.y);
  for (const seg of segments) {
    if (curLen + seg.len <= targetLen) {
      ctx.lineTo(seg.p2.x, seg.p2.y);
      curLen += seg.len;
    } else {
      const remain = targetLen - curLen;
      const ratio = seg.len > 0 ? remain / seg.len : 0;
      ctx.lineTo(seg.p1.x + (seg.p2.x - seg.p1.x) * ratio, seg.p1.y + (seg.p2.y - seg.p1.y) * ratio);
      break;
    }
  }
  ctx.stroke();
}

function playStrokeAnim() {
  cancelAnimationFrame(strokeState.animFrameId);
  strokeState.isPlaying = true;
  let lastTime = performance.now();

  function step(now) {
    if (!strokeState.isPlaying) return;
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    strokeState.animProgress += delta * 1.5 * strokeState.speed;
    if (strokeState.animProgress >= 1.0) {
      strokeState.animProgress = 0;
      strokeState.activeStrokeIdx++;
      if (strokeState.activeStrokeIdx >= strokeState.strokes.length) {
        strokeState.isPlaying = false;
        strokeState.activeStrokeIdx = strokeState.strokes.length;
        drawHangulCanvas();
        return;
      }
    }
    drawHangulCanvas();
    strokeState.animFrameId = requestAnimationFrame(step);
  }

  strokeState.animFrameId = requestAnimationFrame(step);
}

function toggleStrokeAnim() {
  if (strokeState.isPlaying) {
    strokeState.isPlaying = false;
    cancelAnimationFrame(strokeState.animFrameId);
  } else {
    if (strokeState.activeStrokeIdx >= strokeState.strokes.length) strokeState.activeStrokeIdx = 0;
    playStrokeAnim();
  }
  renderStrokeMode();
}

function replayStrokeAnim() {
  strokeState.activeStrokeIdx = 0;
  strokeState.animProgress = 0;
  playStrokeAnim();
  renderStrokeMode();
}