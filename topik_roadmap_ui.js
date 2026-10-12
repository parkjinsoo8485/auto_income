/* ─────────────────────────────────────────────────────────────
   TOPIK ROADMAP UI LAYER  (topik_engine.js 위에서 동작)
   Phase1: 페이월(4회차+/랜덤/해설), 일일 에너지(자정 리셋·중복과금 방지)
   Phase2: FSRS 복습 클리닉, 15분 적응형 진단(CAT), 54번 채점·글자수 게이지
   Phase3: PortOne V2 결제 시뮬레이션(멱등성 키·customerKey UUID·체험기간)
   ※ topik_questions.html 메인 스크립트(APP_STATE 등) 이후에 로드되어야 함
───────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  const { Fsrs, Essay, Cat, Sub } = window.TopikEngine;
  const $ = id => document.getElementById(id);
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const isPro = () => APP_STATE.userTier === 'PRO';
  const DAY = 86400000;

  /* ── 보조 스타일 주입 ── */
  const css = document.createElement('style');
  css.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    .spin-ico { display:inline-block; animation: spin 1s linear infinite; }
    #char-progress { position:relative; height:10px; border-radius:6px; background:rgba(255,255,255,.07); overflow:hidden; margin:-6px 0 4px; }
    #char-progress-fill { height:100%; width:0; border-radius:6px; transition:width .2s ease, background .2s ease; }
    #char-progress .tick { position:absolute; top:0; bottom:0; width:2px; background:rgba(255,255,255,.45); }
    .rubric-list { margin:6px 0 10px 16px; padding:0; } .rubric-list li { margin-bottom:3px; }
    .fsrs-mission { grid-column:1/-1; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;
      background:linear-gradient(135deg,rgba(79,70,229,.18),rgba(6,182,212,.12)); border:1px solid var(--border-accent); border-radius:14px; padding:14px 18px; }
    .fsrs-opt { display:block; width:100%; text-align:left; padding:8px 10px; margin-top:6px; border-radius:8px; border:1px solid var(--border);
      background:var(--bg-elevated); color:var(--text); font-size:12.5px; cursor:pointer; transition:all .15s; }
    .fsrs-opt:hover:not(:disabled) { border-color:var(--accent-light); }
    .fsrs-opt.correct { border-color:var(--green); background:var(--green-bg); }
    .fsrs-opt.wrong { border-color:var(--red); background:var(--red-bg); }
    .fsrs-btn small { display:block; font-weight:500; opacity:.8; margin-top:2px; }
    .fsrs-btn.suggest { box-shadow:0 0 0 2px currentColor; }
    .cat-card { max-width:680px; }
    .cat-progress { height:6px; border-radius:4px; background:rgba(255,255,255,.08); overflow:hidden; }
    .cat-progress > div { height:100%; background:var(--accent-gradient); transition:width .3s; }
    .cat-opt { display:flex; gap:10px; align-items:flex-start; width:100%; text-align:left; padding:11px 14px; margin-top:8px; border-radius:10px;
      border:1.5px solid var(--border); background:var(--card); color:var(--text); font-size:14px; cursor:pointer; transition:all .15s; }
    .cat-opt:hover:not(:disabled) { border-color:var(--accent-light); transform:translateX(2px); }
    .cat-opt.correct { border-color:var(--green); background:var(--green-bg); }
    .cat-opt.wrong { border-color:var(--red); background:var(--red-bg); }
    .cat-stat { background:rgba(255,255,255,.04); border:1px solid var(--border); border-radius:12px; padding:12px; text-align:center; }
  `;
  document.head.appendChild(css);

  /* ═════════════ Phase 1: 구독 등급 / 에너지 ═════════════ */
  function persistEnergy() {
    localStorage.setItem('user_energy_date', Sub.todayKey());
    localStorage.setItem('user_daily_energy', String(APP_STATE.dailyEnergy));
    localStorage.setItem('user_energy_answered', JSON.stringify(APP_STATE.energyAnswered || {}));
  }

  function bootstrapSubscription() {
    const dev = new URLSearchParams(location.search).get('tier'); // ?tier=pro | ?tier=free (테스트용)
    if (dev === 'pro') {
      localStorage.setItem('user_pro_tier', 'PRO');
      localStorage.setItem('user_pro_expiry', new Date(Date.now() + 365 * DAY).toISOString());
    } else if (dev === 'free') {
      localStorage.removeItem('user_pro_tier'); localStorage.removeItem('user_pro_expiry');
    }
    const r = Sub.resolve({ tier: localStorage.getItem('user_pro_tier'), expiry: localStorage.getItem('user_pro_expiry') });
    APP_STATE.userTier = r.tier;
    APP_STATE.proDaysLeft = r.daysLeft;
    if (r.expired) {
      localStorage.removeItem('user_pro_tier'); localStorage.removeItem('user_pro_expiry');
      setTimeout(() => showCbtToast('PRO 패스 기간이 만료되어 무료 플랜으로 전환되었습니다.', '⏰'), 700);
    }
    if (localStorage.getItem('user_energy_date') !== Sub.todayKey()) {
      APP_STATE.dailyEnergy = APP_STATE.maxEnergy;
      APP_STATE.energyAnswered = {};
      persistEnergy();
    } else {
      const e = parseInt(localStorage.getItem('user_daily_energy'), 10);
      APP_STATE.dailyEnergy = Number.isFinite(e) ? clamp(e, 0, APP_STATE.maxEnergy) : APP_STATE.maxEnergy;
      try { APP_STATE.energyAnswered = JSON.parse(localStorage.getItem('user_energy_answered') || '{}') || {}; }
      catch (_) { APP_STATE.energyAnswered = {}; }
    }
  }

  window.updateUserTierUI = function () {
    const tierBadge = $('header-tier-text'), btnBadge = $('btn-pro-badge');
    if (!tierBadge || !btnBadge) return;
    if (isPro()) {
      tierBadge.textContent = `PRO PASS 활성화됨${APP_STATE.proDaysLeft ? ' · D-' + APP_STATE.proDaysLeft : ''}`;
      btnBadge.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      btnBadge.style.color = '#fff';
    } else {
      tierBadge.textContent = '7일 무료체험 (PRO)';
      btnBadge.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
      btnBadge.style.color = '#000';
    }
  };

  function decorateRoundLocks() {
    const sel = $('select-exam-round');
    if (!sel) return;
    Array.from(sel.options).forEach(o => {
      if (!/^\d+$/.test(o.value)) return;
      const base = o.textContent.replace(/^🔒\s*/, '');
      o.textContent = Sub.isRoundLocked(APP_STATE.userTier, +o.value) ? '🔒 ' + base : base;
    });
  }

  function revertRoundSelect() {
    const sel = $('select-exam-round');
    if (sel) sel.value = String(APP_STATE.currentRound);
  }

  (function wrapGates() {
    const origPopulate = window.populateExamRoundOptions;
    window.populateExamRoundOptions = function () { origPopulate.apply(this, arguments); decorateRoundLocks(); };

    const origLoad = window.loadExamRound;
    window.loadExamRound = function (roundNum) {
      if (Sub.isRoundLocked(APP_STATE.userTier, roundNum)) {
        revertRoundSelect();
        openPaywallModal('round_' + roundNum);
        return false;
      }
      origLoad.call(this, roundNum);
      return true;
    };

    const origRandom = window.generateRandomExam;
    window.generateRandomExam = function () {
      if (!isPro()) { revertRoundSelect(); openPaywallModal('random_exam'); return; }
      return origRandom.apply(this, arguments);
    };

    const origSingle = window.loadSingleQuestionIntoCbt;
    window.loadSingleQuestionIntoCbt = function (id) {
      const q = APP_STATE.allBank.find(x => x.id === id);
      if (q) {
        const r = clamp(Math.floor((q.order - 1) / 20) + 1, 1, 48);
        if (Sub.isRoundLocked(APP_STATE.userTier, r)) { openPaywallModal('round_' + r); return; }
      }
      return origSingle.apply(this, arguments);
    };
  })();

  window.selectOption = function (qId, optNum) {
    let firstTime = false;
    if (!isPro()) {
      if (!APP_STATE.energyAnswered[qId]) {
        if (APP_STATE.dailyEnergy <= 0) { openPaywallModal('energy_exhausted'); return; }
        APP_STATE.dailyEnergy--;
        APP_STATE.energyAnswered[qId] = 1;
        firstTime = true;
        persistEnergy();
        updateEnergyUI();
      }
    }
    APP_STATE.userAnswers[qId] = optNum;
    initHrdAudioEngine();
    renderCurrentQuestion();
    updateOmrGrid();

    if (firstTime) {
      const q = APP_STATE.currentExamQuestions.find(item => item.id === qId);
      if (q && q.answer === optNum) {
        APP_STATE.streakCorrect++;
        if (APP_STATE.streakCorrect % 3 === 0 && APP_STATE.dailyEnergy < APP_STATE.maxEnergy) {
          APP_STATE.dailyEnergy = Math.min(APP_STATE.maxEnergy, APP_STATE.dailyEnergy + 2);
          persistEnergy();
          updateEnergyUI();
          showCbtToast('🔥 3연속 정답! 보너스 에너지 +2 충전 완료', '⚡');
        }
      } else {
        APP_STATE.streakCorrect = 0;
      }
      if (APP_STATE.dailyEnergy <= 0) showCbtToast('오늘의 무료 에너지를 모두 사용했습니다. 내일 자동 충전되며, PRO는 무제한입니다.', '🔋');
    }
  };

  /* ═════════════ Phase 3: PortOne V2 결제 시뮬레이션 ═════════════ */
  window.executePortOneCheckout = function () {
    const btn = $('btn-pay-checkout');
    if (!btn || btn.disabled) return; // 중복 클릭 방지
    const plan = APP_STATE.selectedPaywallPlan || 'yearly';
    // 동일 결제 시도 중 재요청은 같은 멱등성 키 재사용
    if (!APP_STATE.pendingIdemKey) APP_STATE.pendingIdemKey = Sub.uuidv4();
    const idemKey = APP_STATE.pendingIdemKey;
    let customerKey = localStorage.getItem('portone_customer_key');
    if (!customerKey) { customerKey = Sub.uuidv4(); localStorage.setItem('portone_customer_key', customerKey); }

    btn.disabled = true;
    btn.innerHTML = '<span class="spin-ico">⏳</span> PortOne V2 보안 인증창 호출 중...';
    setTimeout(() => {
      btn.innerHTML = '🔐 빌링키 발급 · 승인 중 (Idempotency-Key ' + idemKey.slice(0, 8) + '…)';
      setTimeout(() => {
        const now = Date.now();
        const trialMs = plan === 'yearly' ? 7 * DAY : 0;
        const periodMs = (plan === 'yearly' ? 365 : 30) * DAY;
        const billingAt = new Date(now + trialMs).toISOString();
        const expiry = new Date(now + trialMs + periodMs).toISOString();
        localStorage.setItem('user_pro_tier', 'PRO');
        localStorage.setItem('user_pro_expiry', expiry);
        localStorage.setItem('portone_last_payment', JSON.stringify({
          idempotencyKey: idemKey, customerKey, plan, amount: plan === 'yearly' ? 89000 : 14900,
          status: 'PAID', firstBillingAt: billingAt, paidAt: new Date(now).toISOString()
        }));
        APP_STATE.pendingIdemKey = null;
        APP_STATE.userTier = 'PRO';
        APP_STATE.subscriptionExpiry = expiry;
        APP_STATE.proDaysLeft = Math.ceil((new Date(expiry) - now) / DAY);
        updateUserTierUI(); updateEnergyUI(); decorateRoundLocks();
        closePaywallModal();
        btn.disabled = false;
        selectPaywallPlan('yearly');
        showCbtToast(plan === 'yearly'
          ? `🎉 PRO 활성화! 7일 무료체험 후 ${billingAt.split('T')[0]}에 연 89,000원이 결제됩니다.`
          : '🎉 PRO 활성화! 1개월 패스가 시작되었습니다.', '👑');
      }, 1000);
    }, 900);
  };

  /* ═════════════ Phase 2: TOPIK 54번 쓰기 ═════════════ */
  function ensureCharProgress() {
    let bar = $('char-progress-fill');
    if (bar) return bar;
    const gauge = $('char-gauge-bar');
    if (!gauge) return null;
    const wrap = document.createElement('div');
    wrap.id = 'char-progress';
    wrap.title = '600~700자 최적 구간';
    wrap.innerHTML = '<div id="char-progress-fill"></div><div class="tick" style="left:75%"></div><div class="tick" style="left:87.5%"></div>';
    gauge.parentNode.insertBefore(wrap, gauge.nextSibling);
    return $('char-progress-fill');
  }

  window.updateEssayCharCount = function () {
    const box = $('essay-input-box'), countEl = $('writing-char-count'), statusEl = $('writing-char-status');
    if (!box || !countEl || !statusEl) return;
    const count = Essay.countChars(box.value);
    countEl.textContent = count;
    const g = Essay.gaugeState(count);
    statusEl.className = { warn: 'char-badge-warn', ok: 'char-badge-ok', danger: 'char-badge-danger' }[g.level];
    statusEl.textContent = g.msg;
    const fill = ensureCharProgress();
    if (fill) { fill.style.width = Math.min(100, count / 800 * 100) + '%'; fill.style.background = g.color; }
    countEl.style.color = g.color;
  };

  let essayBusy = false;
  window.evaluateEssayWithAi = function () {
    if (essayBusy) return;
    const box = $('essay-input-box'), feedback = $('ai-essay-feedback-box');
    const text = box.value.trim();
    if (Essay.countChars(text) < 50) { showCbtToast('에세이가 너무 짧습니다. 최소 50자 이상 작성 후 채점해 주세요.', '⚠️'); return; }
    essayBusy = true;
    feedback.innerHTML = `
      <div style="text-align:center;padding:24px 0">
        <div style="font-size:24px" class="spin-ico">⚙️</div>
        <strong style="color:var(--cyan);display:block;margin-top:8px">국립국제교육원 공식 루브릭 정밀 채점 중...</strong>
        <span style="font-size:11px;color:var(--text-muted)">문어체 종결어미 검사 • 어휘 다양성 분석 • 3단 전개 구조 평가</span>
      </div>`;
    setTimeout(() => {
      const r = Essay.analyze(text);
      $('rubric-score-content').textContent = `${r.scores.content}점 / 12점`;
      $('rubric-score-structure').textContent = `${r.scores.structure}점 / 12점`;
      $('rubric-score-grammar').textContent = `${r.scores.language}점 / 26점`;
      const li = a => a.map(s => `<li>${escapeHtml(s)}</li>`).join('');
      const d = r.details;
      feedback.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <strong style="color:#10b981;font-size:14px">🏆 종합 채점 결과: ${r.total}점 / 50점 만점</strong>
          <span style="font-size:11px;color:var(--cyan)">TOPIK II 예상 ${r.level} 수준</span>
        </div>
        <div style="color:#cbd5e1;line-height:1.6">
          <strong>✅ 강점</strong><ul class="rubric-list">${r.strengths.length ? li(r.strengths) : '<li>뚜렷한 강점이 감지되지 않았습니다. 아래 보완점을 먼저 개선해 보세요.</li>'}</ul>
          <strong>🔍 보완 제안</strong><ul class="rubric-list">${r.issues.length ? li(r.issues) : '<li>감점 요인이 발견되지 않았습니다.</li>'}</ul>
          <strong>📏 글자수 판정:</strong> ${r.count}자 · ${r.paragraphs}단락 · ${r.sentences}문장
          ${r.penalty ? `<span style="color:var(--red)"> (분량 감점 -${r.penalty})</span>` : '<span style="color:var(--green)"> (규격 적합)</span>'}
          <div style="font-size:11px;color:var(--text-muted);margin-top:8px">※ 규칙 기반 1차 진단입니다. 문맥·논리 평가는 전문가 첨삭(HITL)을 이용하세요.</div>
        </div>`;
      showCbtToast(`채점 완료! 종합 점수: ${r.total}점`, '🤖');
      essayBusy = false;
    }, 900);
  };

  /* ═════════════ Phase 2: FSRS 복습 클리닉 ═════════════ */
  APP_STATE.fsrsShowAll = false;
  APP_STATE.fsrsRevealed = {};
  const saveFsrs = () => localStorage.setItem('fsrs_review_bank', JSON.stringify(APP_STATE.fsrsReviewBank));
  const nextDueText = c => {
    const ms = new Date(c.nextReview).getTime() - Date.now();
    return ms <= 0 ? '지금' : Fsrs.formatSpan(ms) + ' 후';
  };

  window.updateFsrsBadge = function () {
    const bank = APP_STATE.fsrsReviewBank, due = bank.filter(c => Fsrs.isDue(c)).length;
    const a = $('tab-fsrs-counter'), b = $('fsrs-count-badge');
    if (a) a.textContent = `${due}문항`;
    if (b) b.textContent = `오늘 복습 ${due}문항 · 전체 ${bank.length}문항`;
  };

  window.addSampleWrongQuestions = function () {
    const bank = APP_STATE.allBank;
    if (!bank || !bank.length) return;
    const cand = bank.slice(0, 20).filter(q => !APP_STATE.fsrsReviewBank.some(c => c.id === q.id));
    for (let i = cand.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cand[i], cand[j]] = [cand[j], cand[i]]; }
    cand.slice(0, 5).forEach(q => APP_STATE.fsrsReviewBank.push(Fsrs.newCard({
      id: q.id, order: q.order, type: q.type, instruction: q.instruction, dialogue: q.dialogue,
      options: q.options, answer: q.answer, explanation: q.explanation, category: q.category })));
    saveFsrs(); updateFsrsBadge(); renderFsrsCards();
    showCbtToast(cand.length ? '취약 오답 5문항이 FSRS 클리닉에 수집되었습니다.' : '샘플 문항이 모두 수집되어 있습니다.', '📥');
  };

  window.toggleFsrsShowAll = function () { APP_STATE.fsrsShowAll = !APP_STATE.fsrsShowAll; renderFsrsCards(); };

  window.fsrsReveal = function (id, picked) {
    APP_STATE.fsrsRevealed[id] = { picked: picked || 0 };
    renderFsrsCards();
  };

  window.renderFsrsCards = function () {
    const box = $('fsrs-cards-container');
    if (!box) return;
    const bank = APP_STATE.fsrsReviewBank;
    box.innerHTML = '';
    if (!bank.length) {
      box.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;background:var(--card);border:1px dashed var(--border);border-radius:16px">
          <span style="font-size:48px;display:block;margin-bottom:12px">✨</span>
          <h4 style="font-size:16px;font-weight:700;color:#fff;margin-bottom:6px">복습 대기 중인 오답이 없습니다!</h4>
          <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px">모의고사를 풀고 틀린 문제가 발생하면 자동으로 이곳에 수집되어 최적 주기에 맞춰 출제됩니다.</p>
          <button class="btn-header btn-primary-header" onclick="addSampleWrongQuestions()">🧪 테스트 오답 5문항 불러오기</button>
        </div>`;
      return;
    }
    const due = bank.filter(c => Fsrs.isDue(c)).sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview));
    const waiting = bank.filter(c => !Fsrs.isDue(c)).sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview));
    const shown = APP_STATE.fsrsShowAll ? due : due.slice(0, 5);

    const head = document.createElement('div');
    head.className = 'fsrs-mission';
    head.innerHTML = `
      <div>
        <strong style="color:#fff;font-size:14px">🎯 오늘의 망각 위험 미션: ${shown.length}문항${due.length > shown.length ? ` (복습 대기 ${due.length}문항 중)` : ''}</strong>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:3px">
          ${waiting.length ? `⏳ 대기 ${waiting.length}문항 · 다음 복습 ${nextDueText(waiting[0])}` : '모든 오답이 복습 대상입니다.'}
        </div>
      </div>
      ${due.length > 5 ? `<button class="btn-header" onclick="toggleFsrsShowAll()">${APP_STATE.fsrsShowAll ? '미션 5문항만 보기' : `전체 ${due.length}문항 보기`}</button>` : ''}`;
    box.appendChild(head);

    if (!due.length) {
      const done = document.createElement('div');
      done.style.cssText = 'grid-column:1/-1;text-align:center;padding:40px 20px;background:var(--card);border:1px dashed var(--border);border-radius:16px';
      done.innerHTML = `<span style="font-size:42px;display:block;margin-bottom:8px">🎉</span>
        <h4 style="color:#fff;font-size:15px;margin-bottom:4px">오늘 복습할 문항을 모두 완료했습니다</h4>
        <p style="font-size:12.5px;color:var(--text-secondary)">다음 복습은 ${waiting.length ? nextDueText(waiting[0]) : '-'}에 자동 재출제됩니다.</p>`;
      box.appendChild(done);
      return;
    }

    shown.forEach(q => {
      const rev = APP_STATE.fsrsRevealed[q.id];
      const R = Math.round(Fsrs.currentR(q) * 100);
      const opts = Array.isArray(q.options) ? q.options : [];
      const optHtml = opts.map((t, i) => {
        const n = i + 1;
        let cls = '';
        if (rev) cls = n === q.answer ? 'correct' : (n === rev.picked ? 'wrong' : '');
        return `<button class="fsrs-opt ${cls}" ${rev ? 'disabled' : ''} onclick="fsrsReveal(${Number(q.id)}, ${n})"><b>${n}</b> ${escapeHtml(t)}</button>`;
      }).join('');
      const prev = Fsrs.preview(q);
      const sug = rev ? (rev.picked === q.answer ? 'good' : 'again') : '';
      const btn = (k, label) => `<button class="fsrs-btn ${k} ${sug === k ? 'suggest' : ''}" onclick="rateFsrsQuestion(${Number(q.id)}, '${k}')">${label}<small>${Fsrs.formatSpan(prev[k])}</small></button>`;
      const card = document.createElement('div');
      card.className = 'fsrs-item-card';
      card.innerHTML = `
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <span class="badge-api" style="font-size:11px">문항 #${escapeHtml(q.order || q.id)} (${q.type === 'L' ? '듣기' : '읽기'})</span>
            <span style="font-size:12px;color:var(--cyan);font-weight:700">${q.reps ? `기억 회상률: ${R}%` : '신규 오답'}${q.lapses ? ` · 실패 ${q.lapses}` : ''}</span>
          </div>
          <strong style="font-size:14px;color:#fff;display:block;margin-bottom:6px">${escapeHtml(q.instruction || '[문제]')}</strong>
          ${q.type === 'L' ? `<button class="btn-header" style="font-size:11px;padding:4px 10px;margin-bottom:4px" onclick="speakKoreanText(${JSON.stringify(String(q.dialogue || q.instruction || '')).replace(/"/g, '&quot;')})">🔊 듣기</button>` : ''}
          ${q.type === 'L' && rev && q.dialogue ? `<div style="font-size:12px;color:var(--text-secondary);white-space:pre-line;margin:6px 0">${escapeHtml(q.dialogue)}</div>` : ''}
          ${optHtml}
          ${rev ? `<div style="font-size:11.5px;color:#94a3b8;background:rgba(255,255,255,0.03);padding:8px;border-radius:6px;line-height:1.5;margin-top:8px">
              <strong style="color:var(--green)">정답 ${q.answer}번</strong> — ${escapeHtml(q.explanation || '핵심 문법 및 어휘 해설')}</div>` : ''}
        </div>
        <div>
          ${rev ? `<div style="font-size:11px;color:var(--text-muted);text-align:center;margin-bottom:4px">얼마나 잘 기억했나요? (FSRS 간격반복)</div>
            <div class="fsrs-btn-row">${btn('again', '다시')}${btn('hard', '어려움')}${btn('good', '알맞음')}${btn('easy', '쉬움')}</div>`
          : `<button class="btn-header" style="width:100%" onclick="fsrsReveal(${Number(q.id)}, 0)">🤔 모르겠음 · 정답 보기</button>`}
        </div>`;
      box.appendChild(card);
    });
  };

  window.rateFsrsQuestion = function (id, gradeName) {
    const idx = APP_STATE.fsrsReviewBank.findIndex(c => c.id === id);
    if (idx < 0) return;
    const updated = Fsrs.review(APP_STATE.fsrsReviewBank[idx], Fsrs.GRADES[gradeName] || 3);
    APP_STATE.fsrsReviewBank[idx] = updated;
    delete APP_STATE.fsrsRevealed[id];
    saveFsrs(); updateFsrsBadge(); renderFsrsCards();
    const ms = new Date(updated.nextReview).getTime() - Date.now();
    showCbtToast(`'${gradeName.toUpperCase()}' 반영: 다음 복습은 ${Fsrs.formatSpan(ms)} 후입니다.`, gradeName === 'again' ? '🔄' : '🧠');
  };

  /* ═════════════ Phase 2: 15분 적응형 진단 (CAT) ═════════════ */
  const CAT = { active: false };
  window.__CAT = CAT; // 테스트/디버그용 상태 노출
  const catEl = () => $('modal-cat');

  function ensureCatModal() {
    if (catEl()) return;
    const m = document.createElement('div');
    m.className = 'modal-backdrop';
    m.id = 'modal-cat';
    m.innerHTML = '<div class="modal-card cat-card"><button class="modal-close-btn" onclick="closeCatModal()" aria-label="닫기">✕</button><div id="cat-body"></div></div>';
    document.body.appendChild(m);
  }

  window.startAdaptiveDiagnostic = function () {
    if (!APP_STATE.allBank.length) { showCbtToast('문항 데이터를 불러오는 중입니다.', '⏳'); return; }
    ensureCatModal();
    Object.assign(CAT, { active: true, asked: new Set(), responses: [], wrongs: [], theta: 0, se: 1.5, n: 0,
      deadline: Date.now() + Cat.MINUTES * 60000, current: null, locked: false, showScript: false });
    if (CAT.timer) clearInterval(CAT.timer);
    CAT.timer = setInterval(catTick, 500);
    catEl().classList.add('open');
    catNext();
  };

  window.closeCatModal = function () {
    CAT.active = false;
    if (CAT.timer) { clearInterval(CAT.timer); CAT.timer = null; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const m = catEl();
    if (m) m.classList.remove('open');
  };

  function catTick() {
    const left = Math.max(0, CAT.deadline - Date.now());
    const t = $('cat-timer');
    if (t) t.textContent = String(Math.floor(left / 60000)).padStart(2, '0') + ':' + String(Math.floor(left / 1000) % 60).padStart(2, '0');
    if (left <= 0 && CAT.active && !CAT.finished) catFinish(true);
  }

  function catNext() {
    CAT.finished = false;
    if (CAT.n >= Cat.ITEMS) { catFinish(false); return; }
    const q = Cat.pickNext(APP_STATE.allBank, CAT.theta, CAT.asked, CAT.n % 2 === 0 ? 'L' : 'R');
    if (!q) { catFinish(false); return; }
    CAT.asked.add(q.id);
    CAT.current = q; CAT.locked = false; CAT.showScript = false;
    renderCatQuestion();
    if (q.type === 'L' && typeof speakKoreanText === 'function') {
      setTimeout(() => { if (CAT.current === q && CAT.active) speakKoreanText(String(q.dialogue || q.instruction || '').replace(/\(\s*\)/g, '')); }, 300);
    }
  }

  function renderCatQuestion() {
    const q = CAT.current, body = $('cat-body');
    const pct = Math.round(CAT.n / Cat.ITEMS * 100);
    const text = q.dialogue ? String(q.dialogue) : '';
    body.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding-right:32px">
        <span class="badge-api">⏱ 15분 적응형 진단 · ${CAT.n + 1} / ${Cat.ITEMS}</span>
        <strong id="cat-timer" style="font-family:'JetBrains Mono',monospace;color:var(--gold)">15:00</strong>
      </div>
      <div class="cat-progress" style="margin-bottom:14px"><div style="width:${pct}%"></div></div>
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px">${q.type === 'L' ? '🎧 듣기' : '📖 읽기'} · ${escapeHtml(q.category || '')}</div>
      <strong style="font-size:15px;color:#fff;line-height:1.5;display:block">${escapeHtml(q.instruction || '')}</strong>
      ${q.type === 'L' ? `<div style="margin-top:8px;display:flex;gap:8px">
          <button class="btn-header" style="font-size:12px" onclick="catReplay()">🔊 다시 듣기</button>
          <button class="btn-header" style="font-size:12px" onclick="catToggleScript()">📄 스크립트 ${CAT.showScript ? '숨기기' : '보기'}</button></div>
        ${CAT.showScript ? `<div style="margin-top:8px;font-size:13px;color:var(--text-secondary);white-space:pre-line">${escapeHtml(text)}</div>` : ''}`
        : (text ? `<div style="margin-top:8px;font-size:13px;color:var(--text-secondary);white-space:pre-line">${escapeHtml(text)}</div>` : '')}
      <div id="cat-opts">${(q.options || []).map((t, i) => `<button class="cat-opt" onclick="catAnswer(${i + 1})"><b>${i + 1}</b><span>${escapeHtml(t)}</span></button>`).join('')}</div>
      <div style="margin-top:14px;font-size:11px;color:var(--text-muted)">정답에 따라 다음 문항 난이도가 자동 조절됩니다 (Rasch 1-PL 모델).</div>`;
    catTick();
  }

  window.catReplay = function () {
    const q = CAT.current;
    if (q && typeof speakKoreanText === 'function') speakKoreanText(String(q.dialogue || q.instruction || '').replace(/\(\s*\)/g, ''));
  };
  window.catToggleScript = function () { CAT.showScript = !CAT.showScript; renderCatQuestion(); };

  window.catAnswer = function (n) {
    if (!CAT.active || CAT.locked) return;
    CAT.locked = true;
    const q = CAT.current, correct = n === q.answer;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    CAT.responses.push({ delta: Cat.difficultyOf(q), correct, id: q.id });
    if (!correct) CAT.wrongs.push(q);
    const est = Cat.estimate(CAT.responses);
    CAT.theta = est.theta; CAT.se = est.se; CAT.n++;
    document.querySelectorAll('#cat-opts .cat-opt').forEach((b, i) => {
      b.disabled = true;
      if (i + 1 === q.answer) b.classList.add('correct');
      else if (i + 1 === n) b.classList.add('wrong');
    });
    setTimeout(() => { if (CAT.active) catNext(); }, 650);
  };

  function catFinish(timedOut) {
    CAT.finished = true;
    if (CAT.timer) { clearInterval(CAT.timer); CAT.timer = null; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const body = $('cat-body');
    if (!CAT.responses.length) { closeCatModal(); showCbtToast('응답이 없어 진단을 종료했습니다.', 'ℹ️'); return; }
    const score = Cat.expectedScore(CAT.theta, APP_STATE.allBank);
    const correct = CAT.responses.filter(r => r.correct).length;
    const PASS = 110, gap = PASS - score;
    const catCount = {};
    CAT.wrongs.forEach(q => { const k = q.category || '기타'; catCount[k] = (catCount[k] || 0) + 1; });
    const weak = Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
    let added = 0;
    CAT.wrongs.forEach(q => {
      if (!APP_STATE.fsrsReviewBank.some(c => c.id === q.id)) {
        APP_STATE.fsrsReviewBank.push(Fsrs.newCard({ id: q.id, order: q.order, type: q.type, instruction: q.instruction,
          dialogue: q.dialogue, options: q.options, answer: q.answer, explanation: q.explanation, category: q.category }));
        added++;
      }
    });
    if (added) { saveFsrs(); updateFsrsBadge(); }
    try {
      const h = JSON.parse(localStorage.getItem('topik_cat_history') || '[]');
      h.push({ at: new Date().toISOString(), theta: +CAT.theta.toFixed(2), score, correct, items: CAT.responses.length });
      localStorage.setItem('topik_cat_history', JSON.stringify(h.slice(-30)));
    } catch (_) { /* ignore */ }
    const pass = score >= PASS;
    body.innerHTML = `
      <div style="text-align:center;padding:6px 0 14px">
        <div style="font-size:46px">${pass ? '🎯' : '📈'}</div>
        <h3 style="font-size:18px;color:#fff;margin:6px 0">15분 적응형 진단 결과${timedOut ? ' (시간 종료)' : ''}</h3>
        <div style="font-size:34px;font-weight:900;color:${pass ? 'var(--green)' : 'var(--gold)'}">${score}<span style="font-size:15px;color:var(--text-secondary)"> / 200점 (예상)</span></div>
        <div style="font-size:12.5px;color:var(--text-secondary);margin-top:4px">합격선 ${PASS}점 ${pass ? '이상 — 안정권입니다' : `까지 약 ${gap}점 부족`}</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px">
        <div class="cat-stat"><div style="font-size:11px;color:var(--text-muted)">정답</div><strong style="font-size:18px;color:#fff">${correct}/${CAT.responses.length}</strong></div>
        <div class="cat-stat"><div style="font-size:11px;color:var(--text-muted)">능력치 θ</div><strong style="font-size:18px;color:#fff">${CAT.theta.toFixed(2)}</strong></div>
        <div class="cat-stat"><div style="font-size:11px;color:var(--text-muted)">오차 ±SE</div><strong style="font-size:18px;color:#fff">${CAT.se.toFixed(2)}</strong></div>
      </div>
      <div style="font-size:13px;color:#cbd5e1;line-height:1.7">
        <strong>🔍 취약 영역:</strong> ${weak.length ? weak.map(([k, v]) => `${escapeHtml(k)} (${v})`).join(' · ') : '오답이 없습니다. 훌륭합니다!'}<br>
        ${added ? `<strong>🧠 FSRS:</strong> 오답 ${added}문항이 복습 클리닉에 자동 등록되었습니다.<br>` : ''}
        <span style="font-size:11px;color:var(--text-muted)">※ 12문항 기반의 추정치입니다 (문항 난이도는 회차 내 위치 기반 사전값이며 풀이 데이터가 쌓이면 보정됩니다).</span>
      </div>
      <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">
        <button class="btn-header" style="flex:1" onclick="closeCatModal();switchMainTab('fsrs')">🧠 오답 클리닉으로</button>
        <button class="btn-header" style="flex:1" onclick="startAdaptiveDiagnostic()">🔁 다시 진단</button>
        ${isPro() ? '' : `<button class="btn-header btn-primary-header" style="flex:1 1 100%;background:linear-gradient(135deg,#f59e0b,#ea580c);color:#000;font-weight:800" onclick="closeCatModal();openPaywallModal('general')">🔥 7일 무료체험으로 합격 플랜 시작</button>`}
      </div>`;
  }

  function injectCatButton() {
    if ($('btn-cat-diagnostic')) return;
    const anchor = Array.from(document.querySelectorAll('button')).find(b => (b.getAttribute('onclick') || '').includes('generateRandomExam'));
    if (!anchor) return;
    const b = document.createElement('button');
    b.id = 'btn-cat-diagnostic';
    b.className = 'btn-header';
    b.setAttribute('style', 'padding:6px 12px;font-size:12px;background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.4);color:#6ee7b7');
    b.title = '12문항 · 15분 이내 · 정답에 따라 난이도가 조절되는 적응형 진단';
    b.textContent = '⏱ 15분 적응형 진단';
    b.onclick = () => startAdaptiveDiagnostic();
    anchor.parentNode.insertBefore(b, anchor);
  }

  /* ═════════════ 공통: ESC / 배경 클릭으로 모달 닫기 ═════════════ */
  const CLOSERS = {
    'modal-paywall': () => closePaywallModal(), 'modal-outline-editor': () => closeOutlineModal(),
    'modal-exam-result': () => closeResultModal(), 'modal-api-config': () => closeApiConfigModal(),
    'modal-official-audio': () => closeOfficialAudioModal(), 'modal-hangul-stroke': () => closeHangulStrokeModal(),
    'modal-cat': () => closeCatModal()
  };
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.modal-backdrop.open').forEach(m => { const c = CLOSERS[m.id]; if (c) c(); else m.classList.remove('open'); });
  });
  document.addEventListener('mousedown', e => {
    const m = e.target;
    if (m && m.classList && m.classList.contains('modal-backdrop') && m.classList.contains('open')) {
      if (m.id === 'modal-cat') return; // 진행 중 실수 클릭 방지
      const c = CLOSERS[m.id]; if (c) c(); else m.classList.remove('open');
    }
  });

  /* ═════════════ 부팅 (메인 스크립트의 DOMContentLoaded 이후 실행) ═════════════ */
  window.addEventListener('DOMContentLoaded', () => {
    bootstrapSubscription();
    updateUserTierUI();
    updateEnergyUI();
    updateFsrsBadge();
    decorateRoundLocks();
    injectCatButton();
    selectPaywallPlan(APP_STATE.selectedPaywallPlan || 'yearly');
    window.__topikRoadmapReady = true;
  });
})();
