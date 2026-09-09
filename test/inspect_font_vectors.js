const data = require('../assets/hangul_font_vectors.json');

// choseong 구조 확인
const mData = data.choseong['ㅁ'];
console.log('초성 ㅁ 키:', Object.keys(mData));

const gData = data.choseong['ㄱ'];
console.log('초성 ㄱ 키:', Object.keys(gData));
console.log('초성 ㄱ 샘플:', JSON.stringify(gData).substring(0, 400));

const juData = data.jungseong['ㅜ'];
console.log('중성 ㅜ 키:', Object.keys(juData));
console.log('중성 ㅜ 샘플:', JSON.stringify(juData).substring(0, 400));

const jongData = data.jongseong['ㄴ'];
console.log('종성 ㄴ 키:', Object.keys(jongData));
console.log('종성 ㄴ 샘플:', JSON.stringify(jongData).substring(0, 400));

// variant가 타입별로 있는지 확인
console.log('\n--- 초성 자음별 bbox ---');
Object.entries(data.choseong).forEach(([k, v]) => {
  if (Array.isArray(v.bbox)) {
    const [x1, y1, x2, y2] = v.bbox;
    const w = x2 - x1, h = y2 - y1;
    console.log(`  ${k}: bbox=${JSON.stringify(v.bbox)} | w=${w} h=${h} ratio=${(w/h).toFixed(2)}`);
  } else {
    console.log(`  ${k}: 키=${Object.keys(v)}`);
  }
});
