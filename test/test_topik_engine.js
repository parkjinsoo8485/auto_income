// node test/test_topik_engine.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Fsrs, Essay, Cat, Sub } = require('../topik_engine.js');
let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); pass++; console.log('  ✓', name); } catch (e) { fail++; console.log('  ✗', name, '\n    ', e.message); } };

// ── 샘플 에세이 추출 (APP_STATE.sampleEssayText)
const html = fs.readFileSync(path.join(__dirname, '..', 'topik_questions.html'), 'utf8');
const m = html.match(/sampleEssayText:\s*`([\s\S]*?)`/);
const sample = m ? m[1] : '';

console.log('FSRS');
t('R(S,S)=0.9', () => assert(Math.abs(Fsrs.retrievability(5, 5) - 0.9) < 1e-9));
t('interval(S)=S (R=0.9)', () => assert.strictEqual(Fsrs.interval(10), 10));
t('첫 복습 good > again 간격', () => {
  const c = Fsrs.newCard({}, 0);
  const a = Fsrs.review(c, 1, 0), g = Fsrs.review(c, 3, 0), e = Fsrs.review(c, 4, 0);
  assert(new Date(a.nextReview) < new Date(g.nextReview) && new Date(g.nextReview) < new Date(e.nextReview));
});
t('good 반복 시 안정도/간격 증가', () => {
  let c = Fsrs.newCard({}, 0), now = 0, prev = 0;
  for (let i = 0; i < 4; i++) {
    c = Fsrs.review(c, 3, now);
    const iv = new Date(c.nextReview).getTime() - now;
    assert(iv > prev, `step ${i}: ${iv} <= ${prev}`);
    prev = iv; now = new Date(c.nextReview).getTime();
  }
});
t('again 은 lapses+1, 안정도 감소, 10분 후 재출제', () => {
  let c = Fsrs.review(Fsrs.newCard({}, 0), 3, 0);
  const now = new Date(c.nextReview).getTime();
  const l = Fsrs.review(c, 1, now);
  assert.strictEqual(l.lapses, 1); assert(l.stability <= c.stability);
  assert.strictEqual(new Date(l.nextReview).getTime() - now, 600000);
});
t('난이도 1~10 범위 유지', () => {
  let c = Fsrs.newCard({}, 0), now = 0;
  for (let i = 0; i < 30; i++) { c = Fsrs.review(c, i % 2 ? 1 : 4, now); now = new Date(c.nextReview).getTime(); assert(c.difficulty >= 1 && c.difficulty <= 10); }
});
t('isDue / currentR', () => {
  const c = Fsrs.review(Fsrs.newCard({}, 0), 3, 0);
  assert(!Fsrs.isDue(c, 1)); assert(Fsrs.isDue(c, new Date(c.nextReview).getTime()));
  const R = Fsrs.currentR(c, new Date(c.nextReview).getTime());
  assert(R > 0.85 && R < 0.95, R);
});

console.log('Essay');
t('샘플 에세이 로드', () => assert(sample.length > 100));
t('글자수: 줄바꿈 제외·개요 제외', () => assert.strictEqual(Essay.countChars('[개요 기반 초안]\n서론: 가나\n본론: 다라\n결론: 마바\n\n안녕\n하세요'), 5));
t('게이지 구간 경계 599/600/700/701', () => {
  assert.strictEqual(Essay.gaugeState(599).level, 'warn'); assert.strictEqual(Essay.gaugeState(600).level, 'ok');
  assert.strictEqual(Essay.gaugeState(700).level, 'ok'); assert.strictEqual(Essay.gaugeState(701).level, 'danger');
});
t('분량 감점: 600~700 0점, 이탈 시 >0', () => {
  assert.strictEqual(Essay.lengthPenalty(650), 0); assert(Essay.lengthPenalty(300) > 0); assert(Essay.lengthPenalty(900) > 0);
});
t('샘플 에세이는 구조·내용 고득점, 분량 미달 감점이 리포트에 반영', () => {
  const r = Essay.analyze(sample);
  console.log('     →', JSON.stringify(r.scores), r.total, r.level, 'chars', r.count);
  assert(r.scores.structure >= 8, 'structure ' + r.scores.structure);
  assert(r.details.formalRatio >= 0.9);
  assert(r.scores.content >= 8);
  if (r.count < 600) assert(r.issues.some(s => s.includes('분량')));
});
t('구어체(-요) 글은 언어 점수 낮음', () => {
  const colloquial = ('저는 환경이 중요하다고 생각해요. 그래서 일회용품을 안 써요. 정부도 도와줘야 해요. ').repeat(8);
  const good = Essay.analyze(sample), bad = Essay.analyze(colloquial);
  assert(bad.scores.language < good.scores.language, `${bad.scores.language} !< ${good.scores.language}`);
  assert(bad.details.politeEndings > 0);
});
t('빈 입력은 0점', () => { const r = Essay.analyze(''); assert.strictEqual(r.total, 0); });
t('점수 상한 12/12/26', () => {
  const r = Essay.analyze(sample); assert(r.scores.content <= 12 && r.scores.structure <= 12 && r.scores.language <= 26);
});
t('같은 입력은 같은 점수(결정적)', () => assert.deepStrictEqual(Essay.analyze(sample).scores, Essay.analyze(sample).scores));

console.log('CAT');
const bank = (() => { const w = { window: {} }; const src = fs.readFileSync(path.join(__dirname, '..', 'epstopik_1917_bank.js'), 'utf8'); return new Function('window', src + ';return typeof EPSTOPIK_1917_BANK!=="undefined"?EPSTOPIK_1917_BANK:window.EPSTOPIK_1917_BANK;')(w.window); })();
t('문제은행 1917', () => assert.strictEqual(bank.length, 1917));
t('난이도 범위/분포', () => { const d = bank.map(Cat.difficultyOf); assert(Math.min(...d) >= -2.5 && Math.max(...d) <= 2.5); });
t('MLE: 전부 정답 → θ 상승, 전부 오답 → 하락', () => {
  const rs = [-1, 0, 1].map(d => ({ delta: d, correct: true }));
  assert(Cat.estimate(rs).theta > 0.5);
  assert(Cat.estimate(rs.map(r => ({ ...r, correct: false }))).theta < -0.5);
});
t('시뮬레이션: 능력자 θ=+1.5 추정 오차 < 1.0, 하수 θ=-1.5 도 수렴', () => {
  [1.5, -1.5, 0].forEach(trueTheta => {
    let errSum = 0; const N = 40;
    for (let k = 0; k < N; k++) {
      const asked = new Set(), resp = []; let th = 0, seed = k * 7919 + 13;
      const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
      for (let i = 0; i < Cat.ITEMS; i++) {
        const q = Cat.pickNext(bank, th, asked, i % 2 ? 'R' : 'L', rnd); asked.add(q.id);
        const dl = Cat.difficultyOf(q); resp.push({ delta: dl, correct: rnd() < Cat.p(trueTheta, dl) });
        th = Cat.estimate(resp).theta;
      }
      errSum += Math.abs(th - trueTheta);
    }
    const mae = errSum / N; console.log(`     → trueθ=${trueTheta} MAE=${mae.toFixed(2)}`);
    assert(mae < 1.0, 'MAE ' + mae);
  });
});
t('같은 문항 중복 출제 없음', () => {
  const asked = new Set(); for (let i = 0; i < 12; i++) { const q = Cat.pickNext(bank, 0, asked, null); assert(!asked.has(q.id)); asked.add(q.id); }
});

console.log('Subscription');
t('PRO 유효/만료/무저장', () => {
  const now = Date.now();
  assert.strictEqual(Sub.resolve({ tier: 'PRO', expiry: new Date(now + 86400000 * 3).toISOString() }, now).tier, 'PRO');
  const ex = Sub.resolve({ tier: 'PRO', expiry: new Date(now - 1000).toISOString() }, now);
  assert(ex.tier === 'FREE' && ex.expired);
  assert.strictEqual(Sub.resolve(null, now).tier, 'FREE');
});
t('회차 잠금: FREE 1~3 허용 / 4+ 잠금 / PRO 전체', () => {
  assert(!Sub.isRoundLocked('FREE', 3)); assert(Sub.isRoundLocked('FREE', 4)); assert(!Sub.isRoundLocked('PRO', 48));
});
t('UUID v4 형식/유일성', () => {
  const a = Sub.uuidv4(), b = Sub.uuidv4();
  assert(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(a)); assert.notStrictEqual(a, b);
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
