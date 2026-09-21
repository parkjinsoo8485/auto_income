const composer = require('../assets/hangul_stroke_composer.js');

console.log('=== 회 Stroke Plan ===');
const plan = composer.composeStrokePlan('회');
console.log('Total strokes:', plan.strokes.length);
plan.strokes.forEach((s, i) => {
  console.log(`  ${i+1}획: [${s.jamo}] ${s.desc}`);
  console.log(`        d: ${s.d}`);
});

console.log('\n=== 회 SVG Render ===');
const svg = composer.renderComposerSvg('회', { animated: false });
const strokeTags = svg.match(/<path id="stroke_path_\d+"[^>]+>/g) || [];
strokeTags.forEach((tag, idx) => {
  const w = tag.match(/stroke-width="([^"]+)"/)[1];
  const d = tag.match(/data-desc="([^"]+)"/)[1];
  console.log(`  Stroke #${idx+1}: width=${w}px (${d})`);
});
