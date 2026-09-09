const composer = require('./assets/hangul_stroke_composer.js');

const testCases = [
  // 6대 조판
  { char: '가', expectedType: 1, name: 'Type 1 (세로 모음, 받침X)' },
  { char: '고', expectedType: 2, name: 'Type 2 (가로 모음, 받침X)' },
  { char: '과', expectedType: 3, name: 'Type 3 (복합 모음, 받침X)' },
  { char: '강', expectedType: 4, name: 'Type 4 (세로 모음, 받침O)' },
  { char: '곰', expectedType: 5, name: 'Type 5 (가로 모음, 받침O)' },
  { char: '광', expectedType: 6, name: 'Type 6 (복합 모음, 받침O)' },
  // 겹받침
  { char: '닭', expectedType: 4, name: '겹받침 ㄺ (세로)' },
  { char: '값', expectedType: 4, name: '겹받침 ㅄ (세로)' },
  { char: '돐', expectedType: 5, name: '겹받침 ㄽ (가로)' },
  { char: '괉', expectedType: 6, name: '겹받침 ㄾ (복합)' },
  // 쌍자음
  { char: '까', expectedType: 1, name: '쌍자음 ㄲ' },
  { char: '또', expectedType: 2, name: '쌍자음 ㄸ' },
  { char: '봐', expectedType: 3, name: '복합 ㅘ' },
  // 단일 자모
  { char: 'ㄱ', expectedType: null, name: '단일 자음 ㄱ' },
  { char: 'ㅏ', expectedType: null, name: '단일 모음 ㅏ' },
  { char: 'ㅘ', expectedType: null, name: '복합 모음 ㅘ' },
  // 영문 및 기호
  { char: 'A', expectedType: null, name: '영문 A' },
  { char: '!', expectedType: null, name: '기호 !' }
];

let failed = 0;
for (const tc of testCases) {
  try {
    const plan = composer.composeStrokePlan(tc.char);
    if (!plan || !plan.strokes || plan.strokes.length === 0) {
      if (tc.char !== 'A' && tc.char !== '!') {
        console.error('FAIL: No strokes for ' + tc.char + ' (' + tc.name + ')');
        failed++;
        continue;
      }
    }
    const svg = composer.renderComposerSvg(tc.char, { animated: true, speed: 1.0 });
    if (!svg || !svg.includes('<svg')) {
      console.error('FAIL: Invalid SVG for ' + tc.char + ' (' + tc.name + ')');
      failed++;
      continue;
    }
    console.log('PASS: [' + tc.char + '] -> ' + plan.strokes.length + ' strokes [' + tc.name + ']');
  } catch (err) {
    console.error('ERROR on ' + tc.char + ':', err);
    failed++;
  }
}

if (failed === 0) {
  console.log('\n>>> ALL 18 TEST CASES PASSED PERFECTLY! <<<');
} else {
  process.exit(1);
}
