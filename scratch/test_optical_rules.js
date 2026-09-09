const composer = require('../assets/hangul_stroke_composer.js');
const assert = require('assert');

console.log('Testing Hangul Optical Compensation and Grid Pipeline...');

// 1. Check Syllable Types
const typeTests = [
  { ch: '가', expected: 1 },
  { ch: '나', expected: 1 },
  { ch: '고', expected: 2 },
  { ch: '노', expected: 2 },
  { ch: '과', expected: 3 },
  { ch: '화', expected: 3 },
  { ch: '각', expected: 4 },
  { ch: '난', expected: 4 },
  { ch: '문', expected: 5 },
  { ch: '곰', expected: 5 },
  { ch: '원', expected: 6 },
  { ch: '광', expected: 6 },
];

for (const t of typeTests) {
  const dec = composer.decomposeHangul(t.ch);
  const type = composer.determineSyllableType(dec);
  assert.strictEqual(type, t.expected, `Type mismatch for ${t.ch}: got ${type}, expected ${t.expected}`);
  console.log(`PASS: Type check [${t.ch}] -> Type ${type}`);
}

// 2. Optical Compensation for 'ㅇ' and 'ㅎ' (circular consonants)
const decGa = composer.decomposeHangul('가');
const slotsGa = composer.getLayoutSlots(decGa);
const choGa = slotsGa.find(s => s.role === 'cho');

const decAh = composer.decomposeHangul('아');
const slotsAh = composer.getLayoutSlots(decAh);
const choAh = slotsAh.find(s => s.role === 'cho');

console.log(`'가' cho box: x=${choGa.x}, w=${choGa.w}`);
console.log(`'아' cho box: x=${choAh.x}, w=${choAh.w}`);
assert.strictEqual(choAh.w, choGa.w - 6, "'ㅇ' width should be optically compensated by -6px");
assert.strictEqual(choAh.x, choGa.x + 3, "'ㅇ' x-pos should be optically compensated by +3px");
console.log(`PASS: 'ㅇ' optical width & position compensation verified!`);

// 3. Optical Compensation for 'ㅅ', 'ㅈ', 'ㅊ' (triangular consonants - inward padding)
const decSa = composer.decomposeHangul('사');
const slotsSa = composer.getLayoutSlots(decSa);
const choSa = slotsSa.find(s => s.role === 'cho');
console.log(`'사' cho box: x=${choSa.x}, w=${choSa.w}`);
assert.strictEqual(choSa.x, choGa.x + 2, "'ㅅ' inward padding (+2px) verified!");
assert.strictEqual(choSa.w, choGa.w - 2, "'ㅅ' inward padding (-2px width) verified!");
console.log(`PASS: 'ㅅ' inward padding verified!`);

// 4. Verification for '문' (Type 5) 3-tier golden ratio and clearance
const decMun = composer.decomposeHangul('문');
const slotsMun = composer.getLayoutSlots(decMun);
const choMun = slotsMun.find(s => s.role === 'cho');
const jungMun = slotsMun.find(s => s.role === 'jung');
const jongMun = slotsMun.find(s => s.role === 'jong');

console.log(`'문' slots: cho.y=${choMun.y}, h=${choMun.h} | jung.y=${jungMun.y}, h=${jungMun.h} | jong.y=${jongMun.y}, h=${jongMun.h}`);
assert.strictEqual(choMun.y, 12);
assert.strictEqual(choMun.h, 58);
assert.strictEqual(jungMun.y, 84);
assert.strictEqual(jongMun.y, 116);
console.log(`PASS: '문' (Type 5) clearance and 3-tier division verified perfectly!`);

// 5. Verification for '곰' (Type 5, ㅗ/ㅛ) gap widening
const decGom = composer.decomposeHangul('곰');
const slotsGom = composer.getLayoutSlots(decGom);
const choGom = slotsGom.find(s => s.role === 'cho');
const jungGom = slotsGom.find(s => s.role === 'jung');
const jongGom = slotsGom.find(s => s.role === 'jong');

console.log(`'곰' slots: cho.y=${choGom.y}, h=${choGom.h} | jung.y=${jungGom.y}, h=${jungGom.h} | jong.y=${jongGom.y}, h=${jongGom.h}`);
assert.strictEqual(choGom.y, 12);
assert.strictEqual(choGom.h, 48);
assert.strictEqual(jungGom.y, 64);
assert.strictEqual(jongGom.y, 126);
console.log(`PASS: '곰' (Type 5) widened gap verified perfectly!`);

console.log('\n>>> ALL OPTICAL COMPENSATION TESTS PASSED! <<<');
