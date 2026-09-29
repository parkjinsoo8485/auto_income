// test/test_voronoi_junction.js
const fs = require('fs');

// warehouse 로드
const warehouseRaw = fs.readFileSync('test/hangul_150_parts_warehouse.js', 'utf8');
const warehouse = JSON.parse(warehouseRaw.replace('window.HANGUL_150_WAREHOUSE = ', '').replace(/;\s*$/, '')).parts;

console.log("Loaded parts count:", Object.keys(warehouse).length);

// 테스트 대상: Cho_T1_ㅅ (2획 만남), Cho_T1_ㄱ (2획 만남), Jong_T2_ㅀ (다획 겹받침)
const testKeys = ['Cho_T1_ㅅ', 'Cho_T1_ㄱ', 'Jong_T2_ㅀ'];

testKeys.forEach(k => {
  const p = warehouse[k];
  console.log(`\n=== Part: ${k} (${p.char}) ===`);
  console.log(`Strokes count: ${p.medians.length}`);
  p.medians.forEach((m, idx) => {
    console.log(`  Stroke ${idx + 1}: ${m.length} pts, start=[${m[0]}], end=[${m[m.length - 1]}]`);
  });
});
