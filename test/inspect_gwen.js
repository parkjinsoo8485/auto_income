const fs = require('fs');
const html = fs.readFileSync('web_simulator.html', 'utf8');

const startStr = 'const _STROKE_CHOS';
const endStr = "function renderStrokeMode()";
const startIdx = html.indexOf(startStr);
const endIdx = html.indexOf(endStr);
const code = html.substring(startIdx, endIdx);

global.S = {};
const vm = require('vm');
vm.runInThisContext(code);

const parts = getSyllableLayoutParts('괜');
console.log('PARTS for 괜찮다:');
console.log(JSON.stringify(parts, null, 2));

// Collect strokes
const strokes = [];
parts.forEach(part => {
  let jamos = [part.jamo];
  if (part.role === 'jong' && _STROKE_DOUBLE_JONGS[part.jamo]) {
    jamos = _STROKE_DOUBLE_JONGS[part.jamo];
  }
  jamos.forEach((j, subIdx) => {
    const list = HANGUL_STROKE_DB[j] || [];
    let sx = part.x, sw = part.w;
    if (jamos.length > 1) {
      sw = part.w * 0.48;
      sx = subIdx === 0 ? part.x : part.x + part.w * 0.52;
    }
    list.forEach(st => {
      strokes.push({
        d: scalePathCoords(st.d, sx, part.y, sw, part.h),
        desc: st.desc
      });
    });
  });
});

console.log('STROKES:');
strokes.forEach((s, i) => console.log(`Stroke ${i+1}: ${s.d} (${s.desc})`));
