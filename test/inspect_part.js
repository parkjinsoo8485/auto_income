const fs = require('fs');
const wh = JSON.parse(fs.readFileSync('hangul_150_parts_warehouse.json', 'utf8'));

// load test_more_parts functions
const code = fs.readFileSync('test/test_more_parts.js', 'utf8');
eval(code);

const part = wh.parts['Cho_T1_ㅅ'];
const polys = parsePathToPolygons(part.gungsuhOutline);

console.log('--- Cho_T1_ㅅ 분석 ---');
part.medians.forEach((stroke, sIdx) => {
    console.log(`획 ${sIdx+1}:`);
    stroke.forEach((pt, pIdx) => {
        const sd = signedDistance(pt[0], pt[1], polys);
        console.log(`  원래 점 ${pIdx+1}: [${pt[0]}, ${pt[1]}], sd=${sd.toFixed(1)}`);
    });
    const opt = optimizeStroke(stroke, polys);
    opt.forEach((pt, pIdx) => {
        const sd = signedDistance(pt[0], pt[1], polys);
        console.log(`  최적화 점 ${pIdx+1}: [${pt[0]}, ${pt[1]}], sd=${sd.toFixed(1)}`);
    });
});
