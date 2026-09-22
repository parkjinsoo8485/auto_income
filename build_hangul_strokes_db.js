/**
 * build_hangul_strokes_db.js
 * 
 * 한글 40개 자모(초성 19자 + 중성 21자)의 
 * HanziWriter 호환 획순 외곽선(strokes) 및 중심선(medians) 데이터베이스 생성기
 * 
 * HanziWriter 규격:
 * - 뷰박스: 1024 x 1024
 * - strokes: 각 획의 외곽선 SVG Path 문자열 배열 (1획당 1개 패스)
 * - medians: 각 획의 중심 진행선 점들의 좌표 배열 [[[x, y], [x, y], ...], ...]
 */

const fs = require('fs');
const path = require('path');

// 헬퍼: 붓글씨 느낌의 가로선 패스 생성
function makeHorizStroke(x1, y1, x2, y2, thickness = 70) {
  const half = thickness / 2;
  const midX = (x1 + x2) / 2;
  // 은은한 붓 곡선 적용
  const path = `M ${x1},${y1 - half} Q ${midX},${(y1 + y2)/2 - half + 10} ${x2},${y2 - half} Q ${x2 + 15},${y2} ${x2},${y2 + half} Q ${midX},${(y1 + y2)/2 + half - 10} ${x1},${y1 + half} Q ${x1 - 15},${y1} ${x1},${y1 - half} Z`;
  const median = [
    [Math.round(x1), Math.round(y1)],
    [Math.round(midX), Math.round((y1 + y2)/2)],
    [Math.round(x2), Math.round(y2)]
  ];
  return { path, median };
}

// 헬퍼: 붓글씨 느낌의 세로선 패스 생성
function makeVertStroke(x1, y1, x2, y2, thickness = 70, taperEnd = true) {
  const half = thickness / 2;
  const midY = (y1 + y2) / 2;
  const endHalf = taperEnd ? half * 0.4 : half;
  const path = `M ${x1 - half},${y1} Q ${x1 - half - 5},${midY} ${x2 - endHalf},${y2} Q ${x2},${y2 - 15} ${x2 + endHalf},${y2} Q ${x1 + half + 5},${midY} ${x1 + half},${y1} Q ${x1},${y1 + 15} ${x1 - half},${y1} Z`;
  const median = [
    [Math.round(x1), Math.round(y1)],
    [Math.round((x1 + x2)/2), Math.round(midY)],
    [Math.round(x2), Math.round(y2)]
  ];
  return { path, median };
}

// 헬퍼: 'ㄱ' 모양 꺾임 획 생성
function makeGiyeokStroke(x1, y1, cornerX, cornerY, x2, y2, thickness = 70) {
  const half = thickness / 2;
  const path = `M ${x1},${y1 - half} Q ${(x1 + cornerX)/2},${y1 - half + 8} ${cornerX},${cornerY - half} Q ${cornerX + half},${cornerY} ${cornerX + half},${cornerY - half - 20} Q ${cornerX + half - 5},${(cornerY + y2)/2} ${x2 + half*0.4},${y2} Q ${x2},${y2 - 10} ${x2 - half*0.4},${y2} Q ${cornerX - half + 5},${(cornerY + y2)/2} ${cornerX - half},${cornerY + half} Q ${(x1 + cornerX)/2},${y1 + half - 8} ${x1},${y1 + half} Z`;
  const median = [
    [Math.round(x1), Math.round(y1)],
    [Math.round((x1 + cornerX)/2), Math.round(y1 + 10)],
    [Math.round(cornerX), Math.round(cornerY)],
    [Math.round((cornerX + x2)/2), Math.round((cornerY + y2)/2)],
    [Math.round(x2), Math.round(y2)]
  ];
  return { path, median };
}

// 헬퍼: 'ㄴ' 모양 꺾임 획 생성
function makeNieunStroke(x1, y1, cornerX, cornerY, x2, y2, thickness = 70) {
  const half = thickness / 2;
  const path = `M ${x1 - half},${y1} Q ${cornerX - half},${(y1 + cornerY)/2} ${cornerX - half},${cornerY} Q ${cornerX - half},${cornerY - half} ${(cornerX + x2)/2},${y2 - half} Q ${x2 + 10},${y2} ${x2},${y2 + half} Q ${(cornerX + x2)/2},${y2 + half} ${cornerX + half},${cornerY + half} Q ${x1 + half},${(y1 + cornerY)/2} ${x1 + half},${y1} Z`;
  const median = [
    [Math.round(x1), Math.round(y1)],
    [Math.round(cornerX), Math.round((y1 + cornerY)/2)],
    [Math.round(cornerX), Math.round(cornerY)],
    [Math.round((cornerX + x2)/2), Math.round(y2)],
    [Math.round(x2), Math.round(y2)]
  ];
  return { path, median };
}

// 헬퍼: 빗금(대각선) 획 생성
function makeSlashStroke(x1, y1, x2, y2, thickness = 70) {
  const half = thickness / 2;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const path = `M ${x1 - half},${y1 + half} Q ${midX - half - 10},${midY} ${x2 - half*0.3},${y2} Q ${x2},${y2 - 10} ${x2 + half*0.3},${y2} Q ${midX + half + 10},${midY} ${x1 + half},${y1 - half} Z`;
  const median = [
    [Math.round(x1), Math.round(y1)],
    [Math.round(midX), Math.round(midY)],
    [Math.round(x2), Math.round(y2)]
  ];
  return { path, median };
}

// 헬퍼: 이응 원형 획 생성 (12시 방향 시작 -> 반시계방향 회전)
function makeCircleStroke(cx, cy, rX, rY, thickness = 70) {
  const outerRx = rX + thickness / 2;
  const outerRy = rY + thickness / 2;
  const innerRx = rX - thickness / 2;
  const innerRy = rY - thickness / 2;
  
  // 12시 방향 (cx, cy + outerRy)에서 시작하는 완전한 도넛 패스
  const path = `M ${cx},${cy + outerRy} A ${outerRx} ${outerRy} 0 1 0 ${cx} ${cy - outerRy} A ${outerRx} ${outerRy} 0 1 0 ${cx} ${cy + outerRy} M ${cx},${cy + innerRy} A ${innerRx} ${innerRy} 0 1 1 ${cx} ${cy - innerRy} A ${innerRx} ${innerRy} 0 1 1 ${cx} ${cy + innerRy} Z`;
  
  // 12시 방향(cx, cy + rY)에서 시작하여 화면상 반시계방향(11시 -> 9시 -> 6시 -> 3시 -> 12시)으로 매끄럽게 회전
  const steps = 16;
  const median = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (2 * Math.PI * i) / steps;
    // i=0 일 때 (cx, cy + rY) = 정확한 12시 정점
    // angle 증가 시 화면상 왼쪽(반시계)으로 회전
    const x = Math.round(cx + rX * Math.sin(angle));
    const y = Math.round(cy + rY * Math.cos(angle));
    median.push([x, y]);
  }
  
  return { path, median };
}

// 전체 자모 데이터베이스 구축
const HANGUL_STROKES_DB = {};

function addJamo(char, strokeObjs) {
  HANGUL_STROKES_DB[char] = {
    char: char,
    strokeCount: strokeObjs.length,
    strokes: strokeObjs.map(s => s.path),
    medians: strokeObjs.map(s => s.median)
  };
}

// ==========================================
// 1. 기본 자음 (14자)
// ==========================================

// ㄱ (1획: 좌상 -> 우상 -> 우하)
addJamo('ㄱ', [
  makeGiyeokStroke(200, 750, 750, 750, 700, 250, 75)
]);

// ㄴ (1획: 좌상 -> 좌하 -> 우하)
addJamo('ㄴ', [
  makeNieunStroke(280, 750, 280, 270, 760, 270, 75)
]);

// ㄷ (2획: 1획 위가로, 2획 ㄴ모양)
addJamo('ㄷ', [
  makeHorizStroke(240, 750, 740, 750, 70),
  makeNieunStroke(280, 710, 280, 270, 760, 270, 75)
]);

// ㄹ (3획: 1획 ㄱ모양, 2획 중간가로, 3획 ㄴ모양)
addJamo('ㄹ', [
  makeGiyeokStroke(260, 750, 740, 750, 730, 520, 68),
  makeHorizStroke(280, 520, 730, 520, 65),
  makeNieunStroke(290, 520, 290, 270, 750, 270, 68)
]);

// ㅁ (3획: 1획 좌세로, 2획 ㄱ모양, 3획 하가로)
addJamo('ㅁ', [
  makeVertStroke(280, 750, 280, 270, 70, false),
  makeGiyeokStroke(280, 750, 740, 750, 740, 270, 70),
  makeHorizStroke(280, 270, 740, 270, 70)
]);

// ㅂ (4획: 1획 좌세로, 2획 우세로, 3획 중가로, 4획 하가로)
addJamo('ㅂ', [
  makeVertStroke(280, 760, 280, 260, 68, false),
  makeVertStroke(740, 760, 740, 260, 68, false),
  makeHorizStroke(280, 520, 740, 520, 65),
  makeHorizStroke(280, 260, 740, 260, 68)
]);

// ㅅ (2획: 1획 좌삐침, 2획 우삐침)
addJamo('ㅅ', [
  makeSlashStroke(512, 780, 260, 250, 75),
  makeSlashStroke(512, 600, 760, 250, 75)
]);

// ㅇ (1획: 원형)
addJamo('ㅇ', [
  makeCircleStroke(512, 512, 250, 250, 70)
]);

// ㅈ (3획: 1획 상가로, 2획 좌삐침, 3획 우삐침)
addJamo('ㅈ', [
  makeHorizStroke(240, 750, 784, 750, 68),
  makeSlashStroke(512, 740, 270, 240, 72),
  makeSlashStroke(490, 580, 750, 240, 72)
]);

// ㅊ (4획: 1획 꼭지, 2획 상가로, 3획 좌삐침, 4획 우삐침)
addJamo('ㅊ', [
  makeHorizStroke(420, 850, 604, 850, 60),
  makeHorizStroke(230, 710, 794, 710, 68),
  makeSlashStroke(512, 700, 270, 230, 70),
  makeSlashStroke(490, 550, 750, 230, 70)
]);

// ㅋ (2획: 1획 ㄱ모양, 2획 중가로)
addJamo('ㅋ', [
  makeGiyeokStroke(220, 760, 750, 760, 700, 250, 72),
  makeHorizStroke(230, 500, 720, 500, 68)
]);

// ㅌ (3획: 1획 상가로, 2획 중가로, 3획 ㄴ모양)
addJamo('ㅌ', [
  makeHorizStroke(250, 750, 750, 750, 68),
  makeHorizStroke(280, 510, 710, 510, 65),
  makeNieunStroke(280, 740, 280, 270, 760, 270, 72)
]);

// ㅍ (4획: 1획 상가로, 2획 좌세로, 3획 우세로, 4획 하가로)
addJamo('ㅍ', [
  makeHorizStroke(230, 760, 790, 760, 70),
  makeVertStroke(410, 740, 410, 280, 65, false),
  makeVertStroke(610, 740, 610, 280, 65, false),
  makeHorizStroke(220, 270, 800, 270, 70)
]);

// ㅎ (3획: 1획 꼭지, 2획 상가로, 3획 원)
addJamo('ㅎ', [
  makeVertStroke(512, 850, 512, 770, 65, false),
  makeHorizStroke(260, 750, 764, 750, 68),
  makeCircleStroke(512, 430, 200, 200, 65)
]);

// ==========================================
// 2. 쌍자음 (5자)
// ==========================================

// ㄲ (2획: 좌측 ㄱ + 우측 ㄱ)
addJamo('ㄲ', [
  makeGiyeokStroke(160, 730, 500, 730, 480, 270, 60),
  makeGiyeokStroke(520, 730, 860, 730, 840, 270, 60)
]);

// ㄸ (4획: 좌측 ㄷ + 우측 ㄷ)
addJamo('ㄸ', [
  makeHorizStroke(160, 730, 490, 730, 55),
  makeNieunStroke(200, 710, 200, 280, 500, 280, 58),
  makeHorizStroke(520, 730, 850, 730, 55),
  makeNieunStroke(560, 710, 560, 280, 860, 280, 58)
]);

// ㅃ (8획: 좌측 ㅂ 4획 + 우측 ㅂ 4획)
addJamo('ㅃ', [
  makeVertStroke(180, 730, 180, 280, 55, false),
  makeVertStroke(480, 730, 480, 280, 55, false),
  makeHorizStroke(180, 510, 480, 510, 50),
  makeHorizStroke(180, 280, 480, 280, 55),
  makeVertStroke(540, 730, 540, 280, 55, false),
  makeVertStroke(840, 730, 840, 280, 55, false),
  makeHorizStroke(540, 510, 840, 510, 50),
  makeHorizStroke(540, 280, 840, 280, 55)
]);

// ㅆ (4획: 좌측 ㅅ 2획 + 우측 ㅅ 2획)
addJamo('ㅆ', [
  makeSlashStroke(340, 750, 160, 270, 60),
  makeSlashStroke(330, 560, 490, 270, 60),
  makeSlashStroke(680, 750, 500, 270, 60),
  makeSlashStroke(670, 560, 860, 270, 60)
]);

// ㅉ (6획: 좌측 ㅈ 3획 + 우측 ㅈ 3획)
addJamo('ㅉ', [
  makeHorizStroke(160, 730, 480, 730, 52),
  makeSlashStroke(320, 720, 160, 260, 56),
  makeSlashStroke(310, 560, 480, 260, 56),
  makeHorizStroke(540, 730, 860, 730, 52),
  makeSlashStroke(700, 720, 540, 260, 56),
  makeSlashStroke(690, 560, 860, 260, 56)
]);

// ==========================================
// 3. 기본 모음 (10자)
// ==========================================

// ㅏ (2획: 1획 긴 세로, 2획 짧은 우가로)
addJamo('ㅏ', [
  makeVertStroke(450, 850, 450, 170, 75, true),
  makeHorizStroke(450, 512, 750, 512, 70)
]);

// ㅑ (3획: 1획 긴 세로, 2획 상우가로, 3획 하우가로)
addJamo('ㅑ', [
  makeVertStroke(420, 850, 420, 170, 75, true),
  makeHorizStroke(420, 630, 720, 630, 65),
  makeHorizStroke(420, 410, 720, 410, 65)
]);

// ㅓ (2획: 1획 짧은 좌가로, 2획 긴 세로)
addJamo('ㅓ', [
  makeHorizStroke(270, 512, 570, 512, 70),
  makeVertStroke(570, 850, 570, 170, 75, true)
]);

// ㅕ (3획: 1획 상좌가로, 2획 하좌가로, 3획 긴 세로)
addJamo('ㅕ', [
  makeHorizStroke(300, 630, 600, 630, 65),
  makeHorizStroke(300, 410, 600, 410, 65),
  makeVertStroke(600, 850, 600, 170, 75, true)
]);

// ㅗ (2획: 1획 짧은 상세로, 2획 긴 하가로)
addJamo('ㅗ', [
  makeVertStroke(512, 760, 512, 460, 72, false),
  makeHorizStroke(180, 460, 844, 460, 75)
]);

// ㅛ (3획: 1획 좌상세로, 2획 우상세로, 3획 긴 하가로)
addJamo('ㅛ', [
  makeVertStroke(390, 760, 390, 460, 68, false),
  makeVertStroke(634, 760, 634, 460, 68, false),
  makeHorizStroke(180, 460, 844, 460, 75)
]);

// ㅜ (2획: 1획 긴 상가로, 2획 짧은 하세로)
addJamo('ㅜ', [
  makeHorizStroke(180, 560, 844, 560, 75),
  makeVertStroke(512, 560, 512, 240, 72, true)
]);

// ㅠ (3획: 1획 긴 상가로, 2획 좌하세로, 3획 우하세로)
addJamo('ㅠ', [
  makeHorizStroke(180, 560, 844, 560, 75),
  makeVertStroke(390, 560, 390, 240, 68, true),
  makeVertStroke(634, 560, 634, 240, 68, true)
]);

// ㅡ (1획: 긴 가로)
addJamo('ㅡ', [
  makeHorizStroke(180, 512, 844, 512, 80)
]);

// ㅣ (1획: 긴 세로)
addJamo('ㅣ', [
  makeVertStroke(512, 850, 512, 170, 80, true)
]);

// ==========================================
// 4. 이중/복합 모음 (11자)
// ==========================================

// ㅐ (3획: ㅏ 2획 + ㅣ 1획)
addJamo('ㅐ', [
  makeVertStroke(360, 840, 360, 180, 68, true),
  makeHorizStroke(360, 512, 660, 512, 60),
  makeVertStroke(660, 840, 660, 180, 68, true)
]);

// ㅒ (4획: ㅑ 3획 + ㅣ 1획)
addJamo('ㅒ', [
  makeVertStroke(350, 840, 350, 180, 65, true),
  makeHorizStroke(350, 620, 660, 620, 58),
  makeHorizStroke(350, 410, 660, 410, 58),
  makeVertStroke(660, 840, 660, 180, 65, true)
]);

// ㅔ (3획: ㅓ 2획 + ㅣ 1획)
addJamo('ㅔ', [
  makeHorizStroke(280, 512, 540, 512, 60),
  makeVertStroke(540, 840, 540, 180, 68, true),
  makeVertStroke(740, 840, 740, 180, 68, true)
]);

// ㅖ (4획: ㅕ 3획 + ㅣ 1획)
addJamo('ㅖ', [
  makeHorizStroke(280, 620, 540, 620, 58),
  makeHorizStroke(280, 410, 540, 410, 58),
  makeVertStroke(540, 840, 540, 180, 65, true),
  makeVertStroke(740, 840, 740, 180, 65, true)
]);

// ㅘ (4획: ㅗ 2획 + ㅏ 2획)
addJamo('ㅘ', [
  makeVertStroke(380, 760, 380, 480, 60, false),
  makeHorizStroke(180, 480, 600, 480, 65),
  makeVertStroke(680, 840, 680, 180, 68, true),
  makeHorizStroke(680, 512, 860, 512, 58)
]);

// ㅙ (5획: ㅗ 2획 + ㅐ 3획)
addJamo('ㅙ', [
  makeVertStroke(340, 760, 340, 480, 55, false),
  makeHorizStroke(160, 480, 540, 480, 60),
  makeVertStroke(590, 840, 590, 180, 60, true),
  makeHorizStroke(590, 512, 780, 512, 52),
  makeVertStroke(780, 840, 780, 180, 60, true)
]);

// ㅚ (3획: ㅗ 2획 + ㅣ 1획)
addJamo('ㅚ', [
  makeVertStroke(380, 760, 380, 480, 65, false),
  makeHorizStroke(180, 480, 630, 480, 70),
  makeVertStroke(720, 850, 720, 170, 75, true)
]);

// ㅝ (4획: ㅜ 2획 + ㅓ 2획)
addJamo('ㅝ', [
  makeHorizStroke(180, 550, 600, 550, 65),
  makeVertStroke(380, 550, 380, 270, 60, true),
  makeHorizStroke(480, 460, 700, 460, 58),
  makeVertStroke(700, 840, 700, 180, 68, true)
]);

// ㅞ (5획: ㅜ 2획 + ㅔ 3획)
addJamo('ㅞ', [
  makeHorizStroke(160, 550, 520, 550, 60),
  makeVertStroke(340, 550, 340, 270, 55, true),
  makeHorizStroke(440, 460, 640, 460, 52),
  makeVertStroke(640, 840, 640, 180, 60, true),
  makeVertStroke(820, 840, 820, 180, 60, true)
]);

// ㅟ (3획: ㅜ 2획 + ㅣ 1획)
addJamo('ㅟ', [
  makeHorizStroke(180, 550, 630, 550, 70),
  makeVertStroke(380, 550, 380, 260, 65, true),
  makeVertStroke(720, 850, 720, 170, 75, true)
]);

// ㅢ (2획: ㅡ 1획 + ㅣ 1획)
addJamo('ㅢ', [
  makeHorizStroke(180, 380, 680, 380, 70),
  makeVertStroke(750, 850, 750, 170, 75, true)
]);

// 1. JSON 파일로 출력
const outPath = path.join(__dirname, 'test', 'hangul_strokes_db.json');
fs.writeFileSync(outPath, JSON.stringify(HANGUL_STROKES_DB, null, 2), 'utf-8');

// 2. file:// 프로토콜 호환을 위한 JS 파일로도 출력 (window.HANGUL_STROKES_DB)
const jsOutPath = path.join(__dirname, 'test', 'hangul_strokes_db.js');
const jsContent = `// 한글 40개 자모 HanziWriter 데이터셋 (CORS/file:// 호환)
window.HANGUL_STROKES_DB = ${JSON.stringify(HANGUL_STROKES_DB, null, 2)};
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.HANGUL_STROKES_DB;
}
`;
fs.writeFileSync(jsOutPath, jsContent, 'utf-8');

console.log(`총 ${Object.keys(HANGUL_STROKES_DB).length}개 한글 자모 데이터가 성공적으로 생성되었습니다.`);
console.log(`JSON 저장 경로: ${outPath}`);
console.log(`JS 저장 경로: ${jsOutPath}`);
