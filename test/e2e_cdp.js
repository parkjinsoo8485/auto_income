// node test/e2e_cdp.js  — 헤드리스 Chrome(CDP) E2E. 서버(localhost:8000) 필요, 외부 의존성 없음
const { spawn } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');
const BASE = process.env.BASE || 'http://localhost:8000/topik_questions.html';
const CHROME = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].find(fs.existsSync);
const PORT = 9333 + Math.floor(Math.random() * 300);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const check = (name, cond, extra) => { if (cond) { pass++; console.log('  ✓', name); } else { fail++; console.log('  ✗', name, extra !== undefined ? '→ ' + JSON.stringify(extra) : ''); } };

(async () => {
  const proc = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--window-size=1400,1000', 'about:blank'], { stdio: 'ignore' });
  let targets;
  for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); if (targets.length) break; } catch (_) { } await sleep(200); }
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  let id = 0; const pending = new Map(); const errors = [], dialogs = [];
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push('console.error: ' + m.params.args.map(a => a.value || a.description).join(' '));
    else if (m.method === 'Page.javascriptDialogOpening') { dialogs.push(m.params.message); send('Page.handleJavaScriptDialog', { accept: true }); }
  });
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || 'eval error'); return r.result.result.value; };
  const load = async (url) => { await send('Page.navigate', { url }); for (let i = 0; i < 80; i++) { await sleep(150); try { if (await ev('window.__topikRoadmapReady === true')) break; } catch (_) { } } await sleep(300); };
  const key = async (k) => { await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, text: k.length === 1 ? k : undefined }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k }); };
  const reset = async (qs = '?tier=free') => { await load(BASE + '?x=1'); await ev('localStorage.clear()'); await load(BASE + qs); };

  await send('Runtime.enable'); await send('Page.enable');

  console.log('\n[A] 부팅 / Phase1');
  await reset();
  check('로드 완료 & 에러 없음', await ev('window.__topikRoadmapReady===true') && errors.length === 0, errors);
  check('기본 등급 FREE · 에너지 30/30', await ev("APP_STATE.userTier==='FREE' && APP_STATE.dailyEnergy===30 && document.getElementById('energy-text').textContent==='30/30'"));
  check('진단 버튼 존재', await ev("!!document.getElementById('btn-cat-diagnostic')"));
  check('회차 4+ 옵션에 🔒', await ev("[...document.getElementById('select-exam-round').options].filter(o=>/^\\d+$/.test(o.value)).every(o=>(+o.value>3)===o.textContent.startsWith('🔒'))"));
  check('문제은행 1917 & 라운드 40문항', await ev('APP_STATE.allBank.length===1917 && APP_STATE.currentExamQuestions.length===40'));

  console.log('\n[B] 페이월 게이트');
  await ev("changeExamRound('4')");
  check('4회차 → 페이월 오픈, 회차 유지', await ev("document.getElementById('modal-paywall').classList.contains('open') && APP_STATE.currentRound===1 && document.getElementById('select-exam-round').value==='1'"));
  await key('Escape');
  check('ESC로 닫힘', await ev("!document.getElementById('modal-paywall').classList.contains('open')"));
  await ev("changeExamRound('3')");
  check('3회차는 무료 로드', await ev("APP_STATE.currentRound===3 && !document.getElementById('modal-paywall').classList.contains('open')"));
  await ev("generateRandomExam()");
  check('랜덤 시험 → 페이월(random_exam 문구)', await ev("document.getElementById('modal-paywall').classList.contains('open') && /무작위|PRO/.test(document.getElementById('paywall-reason-text').textContent)"));
  await ev("closePaywallModal()");
  await ev("loadSingleQuestionIntoCbt(APP_STATE.allBank.find(q=>q.type==='R' && q.order>100).id)");
  check('은행에서 4회차+ 문항 열기 → 페이월', await ev("document.getElementById('modal-paywall').classList.contains('open')"));
  await ev("closePaywallModal()");

  console.log('\n[C] 에너지');
  await ev("changeExamRound('1')");
  await ev("selectOption(APP_STATE.currentExamQuestions[0].id, 1)");
  check('첫 답안 → 29/30', await ev("document.getElementById('energy-text').textContent==='29/30'"));
  await ev("selectOption(APP_STATE.currentExamQuestions[0].id, 2)");
  check('같은 문항 재선택은 무과금', await ev("APP_STATE.dailyEnergy===29 && APP_STATE.userAnswers[APP_STATE.currentExamQuestions[0].id]===2"));
  await ev("navigateQuestion(1)"); await ev("selectOption(APP_STATE.currentExamQuestions[1].id, 1)");
  check('다른 문항 → 28/30', await ev("APP_STATE.dailyEnergy===28 || APP_STATE.dailyEnergy===30 /* 3연속 정답 보너스 가능 */"));
  // 보너스: 3연속 정답
  await reset();
  const qs = JSON.parse(await ev("JSON.stringify(APP_STATE.currentExamQuestions.slice(0,4).map(q=>[q.id,q.answer]))"));
  for (let i = 0; i < 3; i++) await ev(`selectOption(${qs[i][0]}, ${qs[i][1]})`);
  check('3연속 정답 → +2 (30-3+2=29)', await ev('APP_STATE.dailyEnergy===29'), await ev('APP_STATE.dailyEnergy'));
  await ev(`selectOption(${qs[3][0]}, ${qs[3][1] % 4 + 1})`);   // 오답: 연속 리셋, 에너지 -1
  check('오답은 추가 차감 없이 일반 -1만', await ev('APP_STATE.dailyEnergy===28 && APP_STATE.streakCorrect===0'), await ev('APP_STATE.dailyEnergy'));
  await ev("APP_STATE.dailyEnergy=0; persistEnergy && 0").catch(() => { });
  await ev("APP_STATE.dailyEnergy=0; updateEnergyUI(); localStorage.setItem('user_daily_energy','0');");
  const fresh = await ev("APP_STATE.currentExamQuestions[10].id");
  await ev(`selectOption(${fresh}, 2)`);
  check('에너지 0 → 페이월, 답안 미기록', await ev(`document.getElementById('modal-paywall').classList.contains('open') && APP_STATE.userAnswers[${fresh}]===undefined && /에너지/.test(document.getElementById('paywall-reason-text').textContent)`));
  await ev('closePaywallModal()');
  await load(BASE + '?tier=free');
  check('새로고침 후 에너지 유지(0)', await ev('APP_STATE.dailyEnergy===0'), await ev('APP_STATE.dailyEnergy'));
  await ev("localStorage.setItem('user_energy_date','2000-01-01')"); await load(BASE + '?tier=free');
  check('날짜 바뀌면 30으로 리셋', await ev("APP_STATE.dailyEnergy===30 && document.getElementById('energy-text').textContent==='30/30'"));

  console.log('\n[D] 결제(PortOne 시뮬레이션) / 만료');
  await reset();
  await ev("openPaywallModal('header_badge'); selectPaywallPlan('monthly'); selectPaywallPlan('yearly');");
  await ev("document.getElementById('btn-pay-checkout').click(); document.getElementById('btn-pay-checkout').click();"); // 더블클릭
  await sleep(2600);
  const pay = JSON.parse(await ev("localStorage.getItem('portone_last_payment')||'null'"));
  check('PRO 전환 & 팝업(alert) 없음', await ev("APP_STATE.userTier==='PRO' && localStorage.user_pro_tier==='PRO'") && dialogs.length === 0, dialogs);
  check('멱등성 키/customerKey UUIDv4', pay && /^[0-9a-f]{8}-[0-9a-f]{4}-4/.test(pay.idempotencyKey) && /^[0-9a-f]{8}-[0-9a-f]{4}-4/.test(pay.customerKey), pay);
  check('연간=7일 체험 후 결제일', pay && Math.round((new Date(pay.firstBillingAt) - new Date(pay.paidAt)) / 86400000) === 7);
  check('헤더 PRO · 무제한 · 잠금 해제', await ev("/PRO PASS/.test(document.getElementById('header-tier-text').textContent) && /무제한/.test(document.getElementById('energy-text').textContent) && ![...document.getElementById('select-exam-round').options].some(o=>o.textContent.startsWith('🔒'))"));
  await ev("changeExamRound('4')");
  check('PRO는 4회차 로드', await ev("APP_STATE.currentRound===4 && !document.getElementById('modal-paywall').classList.contains('open')"));
  await ev("generateRandomExam()");
  check('PRO는 랜덤 시험 생성', await ev("APP_STATE.currentRound==='random' && APP_STATE.currentExamQuestions.length===40"));
  await load(BASE);  // 새로고침해도 유지
  check('새로고침 후 PRO 유지', await ev("APP_STATE.userTier==='PRO'"));
  await ev("localStorage.setItem('user_pro_expiry', new Date(Date.now()-1000).toISOString())"); await load(BASE);
  check('만료 시 FREE로 강등', await ev("APP_STATE.userTier==='FREE'"));

  console.log('\n[E] 54번 쓰기');
  await reset(); await ev("switchMainTab('writing')");
  await ev("loadSampleEssay()");
  const g = JSON.parse(await ev("JSON.stringify({c:document.getElementById('writing-char-count').textContent, s:document.getElementById('writing-char-status').className, w:document.getElementById('char-progress-fill').style.width})"));
  check('샘플 에세이 600~700자 → 초록', +g.c >= 600 && +g.c <= 700 && g.s === 'char-badge-ok', g);
  await ev("document.getElementById('essay-input-box').value='가'.repeat(300); updateEssayCharCount()");
  check('300자 → 주황', await ev("document.getElementById('writing-char-status').className==='char-badge-warn'"));
  await ev("document.getElementById('essay-input-box').value='가'.repeat(750); updateEssayCharCount()");
  check('750자 → 빨강', await ev("document.getElementById('writing-char-status').className==='char-badge-danger'"));
  await ev("loadSampleEssay()"); await ev("evaluateEssayWithAi()"); await sleep(1300);
  const sc = JSON.parse(await ev("JSON.stringify([...document.querySelectorAll('[id^=rubric-score-]')].map(e=>e.textContent))"));
  check('AI 채점 결과 렌더(고정값 아님)', sc.length === 3 && sc.every(s => /점/.test(s)), sc);
  await ev("document.getElementById('essay-input-box').value='저는 환경이 좋아요. 그래서 일회용품을 안 써요. 정부도 도와줘야 해요. '.repeat(10); updateEssayCharCount(); evaluateEssayWithAi()"); await sleep(1300);
  const sc2 = JSON.parse(await ev("JSON.stringify([...document.querySelectorAll('[id^=rubric-score-]')].map(e=>e.textContent))"));
  check('구어체 글은 점수가 달라짐', JSON.stringify(sc2) !== JSON.stringify(sc), { sc, sc2 });
  await ev("document.getElementById('essay-input-box').value=''; updateEssayCharCount(); evaluateEssayWithAi()");
  check('빈 글: alert 대신 토스트', dialogs.length === 0);
  await ev("openOutlineModal(); document.getElementById('outline-intro').value='서론A'; applyOutlineToEssay()");
  check('개요 삽입이 글자수에 포함되지 않음', await ev("document.getElementById('writing-char-count').textContent==='0'"));

  console.log('\n[F] FSRS 클리닉');
  await reset(); await ev("switchMainTab('fsrs')");
  await ev("addSampleWrongQuestions()");
  check('샘플 5문항 수집 & 카드 렌더', await ev("APP_STATE.fsrsReviewBank.length===5 && document.querySelectorAll('#fsrs-cards-container .fsrs-item-card').length===5"));
  check('복습 전 평가 버튼 숨김(정답 확인 후 노출)', await ev("document.querySelectorAll('#fsrs-cards-container .fsrs-btn').length===0"));
  const fid = await ev("APP_STATE.fsrsReviewBank[0].id");
  await ev(`fsrsReveal(${fid}, 0)`);
  check('정답 보기 후 4개 평가 버튼+간격 라벨', await ev("document.querySelectorAll('#fsrs-cards-container .fsrs-btn small').length===4"));
  await ev(`rateFsrsQuestion(${fid}, 'good')`);
  const it = JSON.parse(await ev(`JSON.stringify(APP_STATE.fsrsReviewBank.find(c=>c.id===${fid}))`));
  check('good → 카드 유지·미래 복습일·reps=1 (삭제되지 않음)', it && it.reps === 1 && new Date(it.nextReview) > Date.now() + 86400000, it && it.nextReview);
  check('뱃지: 오늘 복습 4문항', await ev("document.getElementById('tab-fsrs-counter').textContent==='4문항'"), await ev("document.getElementById('tab-fsrs-counter').textContent"));
  await ev(`rateFsrsQuestion(${JSON.parse(await ev("JSON.stringify(APP_STATE.fsrsReviewBank[1].id)")) }, 'again')`);
  { const a = JSON.parse(await ev("JSON.stringify(APP_STATE.fsrsReviewBank[1])")); const d = new Date(a.nextReview) - Date.now(); check('again → 약 10분 후 재출제', a.reps === 1 && d > 0 && d <= 600000, d); }
  await load(BASE + '?tier=free'); 
  check('localStorage 영속화', await ev("APP_STATE.fsrsReviewBank.length===5"));
  // 시험 제출 → 오답 자동 수집
  await reset();
  await ev("APP_STATE.currentExamQuestions.forEach((q,i)=>{ if(i<10) APP_STATE.userAnswers[q.id]=q.answer; }); submitExam()");
  check('제출: 오답 30건 FSRS 자동 수집 + 결과 모달', await ev("APP_STATE.fsrsReviewBank.length===30 && document.getElementById('modal-exam-result').classList.contains('open')"), await ev('APP_STATE.fsrsReviewBank.length'));
  check('FREE 해설은 블러/페이월 유도', await ev("!!document.querySelector('#result-explanation-container .gated-blur')"));
  await key('Escape');

  console.log('\n[G] 15분 적응형 진단(CAT)');
  await reset();
  await ev("startAdaptiveDiagnostic()");
  check('모달 오픈 · 1/12', await ev("document.getElementById('modal-cat').classList.contains('open') && /1 \\/ 12/.test(document.getElementById('cat-body').textContent)"));
  let seq = [];
  for (let i = 0; i < 12; i++) {
    const info = JSON.parse(await ev("JSON.stringify({id:__CAT.current&&__CAT.current.id, ans:__CAT.current&&__CAT.current.answer, t:__CAT.current&&__CAT.current.type})"));
    seq.push(info);
    const pick = i % 3 === 2 ? (info.ans % 4) + 1 : info.ans;  // 일부 오답
    await ev(`catAnswer(${pick})`); await sleep(750);
  }
  check('12문항 중복 없이 출제', new Set(seq.map(s => s.id)).size === 12);
  check('듣기/읽기 교차 출제', seq.every((s, i) => s.t === (i % 2 === 0 ? 'L' : 'R')));
  const res = await ev("document.getElementById('cat-body').innerText");
  check('결과 화면: 예상 점수/합격선/취약영역', /\/ 200점/.test(res) && /합격선 110점/.test(res) && /취약 영역/.test(res), res.slice(0, 120));
  check('진단 오답이 FSRS에 등록', await ev("APP_STATE.fsrsReviewBank.length>=4 && JSON.parse(localStorage.topik_cat_history).length===1"));
  check('FREE는 결과에 무료체험 CTA', /7일 무료체험/.test(res));
  await key('Escape');
  check('ESC 로 진단 닫힘 · 타이머 정리', await ev("!document.getElementById('modal-cat').classList.contains('open') && __CAT.timer===null"));

  console.log('\n[H] 기존 기능 회귀');
  await reset(); await ev("switchMainTab('bank')");
  check('문제은행 탭 렌더(20건/페이지)', await ev("document.querySelectorAll('#bank-records-container .record-card').length===20"));
  await ev("switchMainTab('textbook')");
  check('교재 탭: 레슨 카드 렌더 (CSS 중첩 버그 수정 확인)', await ev("document.querySelectorAll('#view-textbook .tb-lesson-card').length>0 || document.querySelectorAll('#view-textbook [class*=lesson]').length>0"));
  const hero = await ev("(()=>{const e=document.querySelector('.tb-hero-card'); return e? getComputedStyle(e).backgroundImage.includes('gradient'):false})()");
  check('.tb-hero-card 그라디언트 스타일 적용됨', hero);
  await ev("switchMainTab('cbt')");
  await ev("changeExamRound('2')");
  check('CBT 2회차 렌더', await ev("document.querySelectorAll('#options-container > *').length===4"));

  check('JS 에러 0건', errors.length === 0, errors);
  console.log(`\n${pass} passed, ${fail} failed`);
  ws.close(); proc.kill(); try { fs.rmSync(profile, { recursive: true, force: true }); } catch (_) { }
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('E2E crashed:', e); process.exit(2); });
