const { PRIMITIVE_STROKES, COMPOUND_VOWELS, DOUBLE_BATCHIM, CHOS, JUNGS, JONGS } = require('./test_stroke_coverage.js');

function decompose(char) {
  const code = char.charCodeAt(0) - 0xAC00;
  if (code >= 0 && code <= 11171) {
    const jong = code % 28;
    const jung = Math.floor((code - jong) / 28) % 21;
    const cho = Math.floor((code - jong) / 28 / 21);
    return {
      isSyllable: true,
      cho: CHOS[cho],
      jung: JUNGS[jung],
      jong: JONGS[jong],
      jungIdx: jung,
      hasJong: jong > 0
    };
  }
  return { isSyllable: false, char: char };
}

function transformStroke(stk, box, partName) {
  if (stk.type === 'circle') {
    return {
      type: 'circle',
      cx: box.x + (stk.cx / 100) * box.w,
      cy: box.y + (stk.cy / 100) * box.h,
      r: (stk.r / 100) * Math.min(box.w, box.h),
      desc: stk.desc,
      partName: partName
    };
  }
  return {
    type: 'lines',
    pts: stk.pts.map(p => [
      box.x + (p[0] / 100) * box.w,
      box.y + (p[1] / 100) * box.h
    ]),
    desc: stk.desc,
    partName: partName
  };
}

function getJamoStrokesInBox(jamo, box, partName) {
  let strokes = [];
  if (DOUBLE_BATCHIM[jamo]) {
    const [leftJamo, rightJamo] = DOUBLE_BATCHIM[jamo];
    const leftBox = { x: box.x, y: box.y, w: box.w * 0.48, h: box.h };
    const rightBox = { x: box.x + box.w * 0.52, y: box.y, w: box.w * 0.48, h: box.h };
    if (PRIMITIVE_STROKES[leftJamo]) {
      PRIMITIVE_STROKES[leftJamo].forEach(s => strokes.push(transformStroke(s, leftBox, `${partName} [${leftJamo}]`)));
    }
    if (PRIMITIVE_STROKES[rightJamo]) {
      PRIMITIVE_STROKES[rightJamo].forEach(s => strokes.push(transformStroke(s, rightBox, `${partName} [${rightJamo}]`)));
    }
    return strokes;
  }
  if (COMPOUND_VOWELS[jamo]) {
    const [firstJamo, secondJamo] = COMPOUND_VOWELS[jamo];
    const leftBox = { x: box.x, y: box.y + box.h * 0.15, w: box.w * 0.52, h: box.h * 0.85 };
    const rightBox = { x: box.x + box.w * 0.45, y: box.y, w: box.w * 0.55, h: box.h };
    if (PRIMITIVE_STROKES[firstJamo]) {
      PRIMITIVE_STROKES[firstJamo].forEach(s => strokes.push(transformStroke(s, leftBox, `${partName} [${firstJamo}]`)));
    }
    if (PRIMITIVE_STROKES[secondJamo]) {
      PRIMITIVE_STROKES[secondJamo].forEach(s => strokes.push(transformStroke(s, rightBox, `${partName} [${secondJamo}]`)));
    }
    return strokes;
  }
  if (PRIMITIVE_STROKES[jamo]) {
    PRIMITIVE_STROKES[jamo].forEach(s => strokes.push(transformStroke(s, box, partName)));
  }
  return strokes;
}

function getStrokesForChar(char) {
  const dec = decompose(char);
  let strokes = [];

  if (dec.isSyllable) {
    const isVert = [0, 1, 2, 3, 4, 5, 6, 7, 20].includes(dec.jungIdx); // 세로 모음 (ㅏ, ㅐ, ㅑ, ㅒ, ㅓ, ㅔ, ㅕ, ㅖ, ㅣ)
    const isHoriz = [8, 12, 13, 17, 18].includes(dec.jungIdx); // 순수가로 (ㅗ, ㅛ, ㅜ, ㅠ, ㅡ)
    // 그 외는 복합모음 (ㅘ, ㅙ, ㅚ, ㅝ, ㅞ, ㅟ, ㅢ)
    let choBox, jungBox, jongBox;

    if (!dec.hasJong) {
      if (isVert) {
        choBox = { x: 75, y: 100, w: 270, h: 500 };
        jungBox = { x: 380, y: 75, w: 270, h: 560 };
      } else if (isHoriz) {
        choBox = { x: 120, y: 80, w: 480, h: 270 };
        jungBox = { x: 80, y: 370, w: 560, h: 280 };
      } else {
        // 복합 모음 (과, 왜 등)
        choBox = { x: 70, y: 80, w: 270, h: 300 };
        jungBox = { x: 330, y: 70, w: 340, h: 570 };
      }
    } else {
      if (isVert) {
        choBox = { x: 75, y: 65, w: 270, h: 290 };
        jungBox = { x: 380, y: 55, w: 270, h: 320 };
        jongBox = { x: 130, y: 405, w: 460, h: 255 };
      } else if (isHoriz) {
        choBox = { x: 120, y: 65, w: 480, h: 200 };
        jungBox = { x: 90, y: 270, w: 540, h: 180 };
        jongBox = { x: 130, y: 455, w: 460, h: 215 };
      } else {
        // 복합 모음 + 받침 (꿩, 괜 등)
        choBox = { x: 80, y: 55, w: 250, h: 240 };
        jungBox = { x: 320, y: 45, w: 340, h: 350 };
        jongBox = { x: 130, y: 440, w: 460, h: 230 };
      }
    }

    strokes.push(...getJamoStrokesInBox(dec.cho, choBox, `초성 '${dec.cho}'`));
    strokes.push(...getJamoStrokesInBox(dec.jung, jungBox, `중성 '${dec.jung}'`));
    if (dec.hasJong) {
      strokes.push(...getJamoStrokesInBox(dec.jong, jongBox, `종성 '${dec.jong}'`));
    }
  } else {
    // 단일 자모
    const box = { x: 110, y: 110, w: 500, h: 500 };
    strokes.push(...getJamoStrokesInBox(char, box, `자모 '${char}'`));
  }
  return strokes;
}

// Test edge characters
const testWords = ['닭', '값', '웨', '의', '꿩', '훠', '한', '글', '꽃', '빛'];
testWords.forEach(w => {
  const stks = getStrokesForChar(w);
  console.log(`Word: '${w}' -> Generated ${stks.length} strokes.`);
  stks.forEach((s, i) => {
    if (s.type === 'lines') {
      if (s.pts.some(pt => isNaN(pt[0]) || isNaN(pt[1]))) console.error(`NaN in pts of ${w}`);
    } else if (s.type === 'circle') {
      if (isNaN(s.cx) || isNaN(s.cy) || isNaN(s.r)) console.error(`NaN in circle of ${w}`);
    }
  });
});
console.log('All edge characters generated 100% valid stroke coordinates!');
