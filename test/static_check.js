// node test/static_check.js  — 인라인 JS 문법, CSS 브레이스, 핸들러 참조 무결성
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const h = fs.readFileSync(path.join(root, 'topik_questions.html'), 'utf8');
let bad = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); if (!c) bad++; };

// inline scripts
const scripts = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
scripts.forEach((s, i) => { try { new vm.Script(s); ok(true, `inline script #${i + 1} 문법`); } catch (e) { ok(false, `inline script #${i + 1}: ${e.message}`); } });
['topik_engine.js', 'topik_roadmap_ui.js'].forEach(f => { try { new vm.Script(fs.readFileSync(path.join(root, f), 'utf8')); ok(true, `${f} 문법`); } catch (e) { ok(false, `${f}: ${e.message}`); } });

// css balance
const css = h.slice(h.indexOf('<style>'), h.indexOf('</style>')).replace(/\/\*[\s\S]*?\*\//g, '');
let d = 0, minD = 0; for (const c of css) { if (c === '{') d++; if (c === '}') d--; minD = Math.min(minD, d); }
ok(d === 0 && minD >= 0, `CSS 브레이스 균형 (depth=${d}, min=${minD})`);

// 중첩된 최상위 규칙 탐지
let depth = 0, nested = [];
css.split('\n').forEach((l, i) => { if (/^ {4}[.#\w][^{}]*\{\s*$/.test(l) && depth > 0) nested.push(l.trim()); for (const c of l) { if (c === '{') depth++; if (c === '}') depth--; } });
ok(nested.length === 0, `중첩된 최상위 CSS 규칙 없음 ${nested.slice(0, 3).join(' | ')}`);

// handlers
const js = scripts.join('\n') + fs.readFileSync(path.join(root, 'topik_roadmap_ui.js'), 'utf8');
const called = new Set();
for (const m of h.matchAll(/on(?:click|change|input|keydown)="([^"]*)"/g)) for (const f of m[1].matchAll(/([A-Za-z_]\w*)\(/g)) called.add(f[1]);
const skip = new Set(['if', 'return', 'alert', 'confirm', 'stopPropagation', 'getElementById', 'querySelector', 'add', 'remove', 'toggle', 'parseInt', 'preventDefault', 'open', 'click', 'pause', 'play']);
const missing = [...called].filter(f => !skip.has(f) && !new RegExp(`(function\\s+${f}\\b|window\\.${f}\\s*=|const\\s+${f}\\b)`).test(js));
ok(missing.length === 0, `HTML 핸들러 정의 확인 ${missing.join(', ')}`);

// 중복 id
const ids = [...h.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]); const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
ok(dup.length === 0, `중복 id 없음 ${[...new Set(dup)].join(', ')}`);

// getElementById 대상 존재
const dyn = new Set(['modal-cat', 'cat-body', 'cat-timer', 'cat-opts', 'char-progress-fill', 'char-progress', 'btn-cat-diagnostic']);
const refs = [...new Set([...js.matchAll(/getElementById\(['"]([\w-]+)['"]\)/g)].map(m => m[1]))].filter(x => !ids.includes(x) && !dyn.has(x));
console.log('  ℹ getElementById 대상이 정적 HTML에 없는 id:', refs.join(', ') || '(없음)');

process.exit(bad ? 1 : 0);
