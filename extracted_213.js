// ═══════════════════════════════════════════════════════════════════
//  M-BOX 9-GRID HANGUL TYPOGRAPHY ENGINE (Contextual Optical Layout)
// ═══════════════════════════════════════════════════════════════════

// M-Box 9-Grid Region Bounds
// Box coordinate space: [0.0, 1.0] x [0.0, 1.0] with optical breathing margin
function getSyllableLayoutBoxes(cho, jung, jong) {
  const hasJong = !!jong;
  const isVertVowel = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅣ'].includes(jung);
  const isHorizVowel = ['ㅗ','ㅛ','ㅜ','ㅠ','ㅡ'].includes(jung);

  // Optical compensation based on specific initial consonant shape (시각적 무게중심 보정)
  const isRoundCho = (cho === 'ㅇ' || cho === 'ㅎ');
  const isSpreadCho = (cho === 'ㅅ' || cho === 'ㅆ' || cho === 'ㅈ' || cho === 'ㅉ' || cho === 'ㅊ');

  let choBox, jungBox, jongBox;

  if (!hasJong) {
    if (isVertVowel) {
      // ── [Type 1] 좌우형 (가, 나, 다, 라, 마, 바, 사, 아, 자, 차, 카, 타, 파, 하, 개, 게...) ──
      // 9-Grid: Left Column (Cols 1~1.5) & Right Column (Cols 1.8~3)
      const choW = isRoundCho ? 0.38 : isSpreadCho ? 0.40 : 0.38;
      choBox = { x: 0.12, y: 0.10, w: choW, h: 0.80 };
      jungBox = { x: 0.52, y: 0.08, w: 0.38, h: 0.84 };
    } else if (isHorizVowel) {
      // ── [Type 2] 상하형 (고, 노, 도, 로, 모, 보, 소, 오, 조, 초, 코, 토, 포, 호, 그, 크...) ──
      // 9-Grid: Top Half (Rows 1~1.6) & Bottom Half (Rows 1.8~3)
      choBox = { x: 0.20, y: 0.08, w: 0.60, h: 0.44 };
      jungBox = { x: 0.12, y: 0.50, w: 0.76, h: 0.42 };
    } else {
      // ── [Type 3] 복합형 (과, 왜, 외, 워, 웨, 위, 의...) ──
      // 9-Grid: Top-Left Pocket (Col 1~2, Row 1~1.8) wrapped by bottom & right vowel
      choBox = { x: 0.14, y: 0.08, w: 0.44, h: 0.40 };
      jungBox = { x: 0.08, y: 0.06, w: 0.84, h: 0.88 };
    }
  } else {
    if (isVertVowel) {
      // ── [Type 4] 받침 있는 좌우형 (한, 강, 달, 말, 산, 안, 영, 정, 창, 판, 함, 녕...) ──
      // Top-Left 초성 (40%), Top-Right 중성 (38%), Bottom 종성 (68%)
      choBox = { x: 0.10, y: 0.06, w: 0.40, h: 0.46 };
      jungBox = { x: 0.52, y: 0.05, w: 0.38, h: 0.49 };
      jongBox = { x: 0.16, y: 0.56, w: 0.68, h: 0.38 };
    } else if (isHorizVowel) {
      // ── [Type 5] 받침 있는 상하형 (늘, 글, 문, 공, 국, 봄, 물, 등, 록, 묵, 붉...) ──
      // 3단 균등 분할: Top 32%, Middle 18%, Bottom 36%
      choBox = { x: 0.20, y: 0.06, w: 0.60, h: 0.32 };
      jungBox = { x: 0.14, y: 0.38, w: 0.72, h: 0.18 };
      jongBox = { x: 0.18, y: 0.58, w: 0.64, h: 0.36 };
    } else {
      // ── [Type 6] 받침 있는 복합형 (관, 괸, 광, 꿩, 횡, 원, 월, 윈, 웰...) ──
      choBox = { x: 0.12, y: 0.05, w: 0.40, h: 0.35 };
      jungBox = { x: 0.08, y: 0.04, w: 0.84, h: 0.54 };
      jongBox = { x: 0.16, y: 0.58, w: 0.68, h: 0.36 };
    }
  }

  return { choBox, jungBox, jongBox };
}

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

  const { choBox, jungBox, jongBox } = getSyllableLayoutBoxes(cho, jung, jong);

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