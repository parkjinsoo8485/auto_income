/* ─────────────────────────────────────────────────────────────
   TOPIK ENGINE — 순수 로직 모듈 (DOM 비의존, Node 단위테스트 가능)
   · Fsrs  : FSRS-4.5 간격반복 스케줄러
   · Essay : TOPIK 54번 루브릭(내용 12 / 구조 12 / 언어 26) 규칙 기반 채점
   · Cat   : 1-PL Rasch 모델 기반 컴퓨터 적응형 진단
   · Sub   : 구독 등급/만료 판정
───────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';

  const DAY = 86400000;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

  /* ═════════════ FSRS-4.5 ═════════════
     R(t,S) = (1 + F·t/S)^DECAY, F = 19/81, DECAY = -0.5  → R(S,S) = 0.9 (목표 기억 유지율 90%)
     ※ 기획서의 R=(1+9t/S)^-1 은 t=S에서 0.1이 되어 90% 유지율과 맞지 않아 FSRS 표준식을 사용. */
  const W = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031,
             1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
  const DECAY = -0.5, FACTOR = 19 / 81;

  const Fsrs = {
    GRADES: { again: 1, hard: 2, good: 3, easy: 4 },
    retrievability(elapsedDays, S) {
      return Math.pow(1 + FACTOR * Math.max(0, elapsedDays) / Math.max(S, 0.01), DECAY);
    },
    interval(S, retention) {
      const r = retention || 0.9;
      return Math.max(1, Math.round(S / FACTOR * (Math.pow(r, 1 / DECAY) - 1)));
    },
    initDifficulty(g) { return clamp(W[4] - W[5] * (g - 3), 1, 10); },
    initStability(g) { return Math.max(0.1, W[g - 1]); },
    nextDifficulty(D, g) {
      const d = D - W[6] * (g - 3);
      return clamp(W[7] * Fsrs.initDifficulty(3) + (1 - W[7]) * d, 1, 10);
    },
    newCard(extra, now) {
      const t = now == null ? Date.now() : now;
      return Object.assign({ difficulty: 5, stability: 1, reps: 0, lapses: 0,
        lastReview: null, nextReview: new Date(t).toISOString() }, extra || {});
    },
    /** 카드 현재 회상 확률(0~1). 미학습 카드는 1 */
    currentR(card, now) {
      if (!card.lastReview || !(card.reps > 0)) return 1;
      const t = ((now == null ? Date.now() : now) - new Date(card.lastReview).getTime()) / DAY;
      return Fsrs.retrievability(t, card.stability);
    },
    isDue(card, now) {
      return new Date(card.nextReview).getTime() <= (now == null ? Date.now() : now);
    },
    review(card, grade, now) {
      const t0 = now == null ? Date.now() : now;
      const g = clamp(Math.round(grade), 1, 4);
      const c = Object.assign({}, card);
      const isNew = !c.lastReview || !(c.reps > 0);
      let S, D;
      if (isNew) {
        S = Fsrs.initStability(g);
        D = Fsrs.initDifficulty(g);
      } else {
        const R = Fsrs.currentR(c, t0);
        D = Fsrs.nextDifficulty(c.difficulty || 5, g);
        const S0 = Math.max(c.stability, 0.1);
        if (g === 1) {
          S = W[11] * Math.pow(D, -W[12]) * (Math.pow(S0 + 1, W[13]) - 1) * Math.exp((1 - R) * W[14]);
          S = clamp(S, 0.1, S0);
        } else {
          const hard = g === 2 ? W[15] : 1, easy = g === 4 ? W[16] : 1;
          S = S0 * (1 + Math.exp(W[8]) * (11 - D) * Math.pow(S0, -W[9]) *
              (Math.exp((1 - R) * W[10]) - 1) * hard * easy);
        }
      }
      c.difficulty = D;
      c.stability = S;
      c.reps = (c.reps || 0) + 1;
      if (g === 1) c.lapses = (c.lapses || 0) + 1;
      c.lastReview = new Date(t0).toISOString();
      const waitMs = g === 1 ? 10 * 60 * 1000 : Fsrs.interval(S) * DAY;
      c.nextReview = new Date(t0 + waitMs).toISOString();
      return c;
    },
    /** 버튼 라벨용 예상 간격(ms) */
    preview(card, now) {
      const t0 = now == null ? Date.now() : now;
      const out = {};
      Object.keys(Fsrs.GRADES).forEach(k => {
        out[k] = new Date(Fsrs.review(card, Fsrs.GRADES[k], t0).nextReview).getTime() - t0;
      });
      return out;
    },
    formatSpan(ms) {
      if (ms < 3600000) return Math.max(1, Math.round(ms / 60000)) + '분';
      const d = ms / DAY;
      if (d < 1) return Math.round(ms / 3600000) + '시간';
      if (d < 30) return Math.round(d) + '일';
      if (d < 365) return Math.round(d / 30) + '개월';
      return (d / 365).toFixed(1) + '년';
    }
  };

  /* ═════════════ TOPIK 54번 규칙 기반 채점 ═════════════ */
  const MARKERS = ['첫째', '둘째', '셋째', '먼저', '또한', '나아가', '그러나', '하지만', '반면', '따라서',
    '그러므로', '결국', '이처럼', '이러한', '예를 들어', '결론적으로', '마지막으로', '뿐만 아니라', '한편', '이를 통해'];
  const CONDITIONS = [
    { key: 'cause', name: '문제의 원인', re: /원인|때문|으로 인해|로 인해|산업|화석 연료|배출|폐기물|온난화|오염|무분별/ },
    { key: 'individual', name: '개인의 실천 방안', re: /개인|일회용|분리배출|대중교통|도보|실천|절약|텀블러|생활화/ },
    { key: 'government', name: '정부·사회의 역할', re: /정부|규제|정책|투자|제도|법적|법안|기업|국가/ }
  ];
  const ADVANCED = [
    ['뿐만 아니라', /뿐만 아니라/], ['-(으)ㄴ/는 반면', /반면/], ['-기 위해(서)', /기 위해|위해서는/],
    ['-아/어야 한다', /해야 한다|야 한다/], ['-(으)ㅁ으로써', /함으로써|으로써/], ['-에 따라', /에 따라/],
    ['-도록', /도록/], ['-(으)며', /하며|으며/], ['-는 데', /는 데/], ['-(으)ㄹ 수 있다', /수 있/],
    ['-에 의해', /에 의해/], ['-에 대한', /에 대한/], ['-(으)ㄴ 결과', /한 결과|ㄴ 결과/],
    ['필수적/시급하다', /필수적|시급하다|요구된다|대두되고/]
  ];
  const SPACING = [
    [/[가-힣]수(있|없)/, '의존명사 "수"는 띄어 씁니다 (예: 할 수 있다)'],
    [/되요|안되[^는었]/, '"돼요/안 돼"와 "되어"를 구분하세요'],
    [/몇일/, '"며칠"이 맞는 표기입니다'],
    [/금새/, '"금세"가 맞는 표기입니다'],
    [/어떻해/, '"어떡해/어떻게"를 확인하세요'],
    [/됬/, '"됐"이 맞는 표기입니다'],
    [/않되|않돼/, '"안 되/안 돼"로 띄어 쓰세요'],
    [/왠만|웬지/, '"웬만/왠지" 표기를 확인하세요']
  ];

  const Essay = {
    MIN: 600, MAX: 700,
    /** 개요 삽입 블록을 제외한 본문 */
    stripOutline(text) {
      return String(text || '').replace(/\r/g, '').split('\n')
        .filter(l => !/^\s*\[개요 기반 초안\]/.test(l) && !/^\s*(서론|본론|결론)\s*:/.test(l)).join('\n');
    },
    /** TOPIK 원고지 기준: 공백은 포함, 줄바꿈은 제외 */
    countChars(text) { return Essay.stripOutline(text).replace(/[\r\n]/g, '').length; },
    gaugeState(count) {
      if (count < Essay.MIN) return { level: 'warn', color: '#f59e0b', msg: `⚠️ ${Essay.MIN - count}자 부족 (600자 미만 분량 감점 주의)` };
      if (count <= Essay.MAX) return { level: 'ok', color: '#10b981', msg: `✅ 최적 분량 구간 (${count}자 작성 완료, 감점 없음)` };
      return { level: 'danger', color: '#ef4444', msg: `🚨 ${count - Essay.MAX}자 초과 (700자 초과 시 국립국제교육원 규정 감점)` };
    },
    lengthPenalty(count) {
      if (count < Essay.MIN) return Math.min(12, Math.ceil((Essay.MIN - count) / 40));
      if (count > Essay.MAX) return Math.min(12, 1 + Math.floor((count - Essay.MAX) / 20));
      return 0;
    },
    analyze(raw) {
      const body = Essay.stripOutline(raw).trim();
      const count = Essay.countChars(raw);
      const paragraphs = body.split(/\n+/).map(s => s.trim()).filter(Boolean);
      const sentences = body.split(/(?<=[.!?。])\s+|\n+/).map(s => s.trim()).filter(s => s.length > 1);
      const nS = Math.max(1, sentences.length);

      // 내용 (12)
      const conditions = CONDITIONS.map(c => ({ name: c.name, hit: c.re.test(body) }));
      const covered = conditions.filter(c => c.hit).length;
      const lenFactor = clamp(count / Essay.MIN, 0, 1);
      const content = Math.round(12 * (covered / 3) * (0.55 + 0.45 * lenFactor));

      // 구조 (12)
      const paraScore = paragraphs.length >= 3 ? 5 : paragraphs.length === 2 ? 3 : (count > 0 ? 1 : 0);
      const usedMarkers = MARKERS.filter(m => body.includes(m));
      const structure = Math.round(clamp(paraScore + Math.min(7, usedMarkers.length * 1.75), 0, 12));

      // 언어 (26) = 종결어미 8 + 어휘 8 + 문법 6 + 표기 4 − 분량 감점
      let da = 0, polite = 0;
      sentences.forEach(s => {
        const e = s.replace(/[.!?。"'”’)\]\s]+$/, '');
        if (/(습니다|ㅂ니다|입니다|합니다|니다)$/.test(e) || /요$/.test(e)) polite++;
        else if (/다$/.test(e)) da++;
      });
      const endScore = 8 * (da / nS);

      const words = body.replace(/[.,!?。"'”’“‘()\[\]:;]/g, ' ').split(/\s+/).filter(w => w.length > 0);
      const stems = words.map(w => w.slice(0, 2));
      const ttr = stems.length ? new Set(stems).size / stems.length : 0;
      const vocab = clamp((ttr - 0.4) / 0.4, 0, 1) * 8;

      const advanced = ADVANCED.filter(a => a[1].test(body)).map(a => a[0]);
      const gram = Math.min(6, advanced.length * 1.2);

      const spacingErrors = [];
      SPACING.forEach(([re, hint]) => { const m = body.match(re); if (m) spacingErrors.push({ text: m[0], hint }); });
      const spell = Math.max(0, 4 - spacingErrors.length * 1.5);

      const penalty = Essay.lengthPenalty(count);
      let language = Math.round(clamp(endScore + vocab + gram + spell - penalty, 0, 26));
      if (count === 0) language = 0;

      const total = content + structure + language;
      const level = total >= 42 ? '6급' : total >= 34 ? '5급' : total >= 26 ? '4급' : total >= 18 ? '3급' : '2급 이하';

      const strengths = [], issues = [];
      if (paragraphs.length >= 3) strengths.push('서론-본론-결론 3단 이상 단락 구분이 되어 있습니다.');
      else issues.push(`단락이 ${paragraphs.length}개입니다. 서론·본론·결론 3단으로 나누세요.`);
      if (usedMarkers.length >= 3) strengths.push(`담화 표지어를 ${usedMarkers.length}종 사용했습니다 (${usedMarkers.slice(0, 4).join(', ')}).`);
      else issues.push('담화 표지어(첫째, 또한, 반면에, 따라서 등)를 3종 이상 사용하세요.');
      if (polite === 0 && da / nS >= 0.9) strengths.push("'-다/-는다' 문어체 종결이 일관됩니다.");
      else issues.push(`문어체가 아닌 종결(-요/-ㅂ니다)이 ${polite}문장, '-다' 종결 비율 ${Math.round(100 * da / nS)}%입니다.`);
      conditions.filter(c => !c.hit).forEach(c => issues.push(`과제 조건 "${c.name}"이(가) 드러나지 않습니다.`));
      if (advanced.length >= 4) strengths.push(`중·고급 문법 표현 ${advanced.length}종 활용 (${advanced.slice(0, 3).join(', ')} 등).`);
      else issues.push('중·고급 문법(-기 위해, -(으)ㅁ으로써, 뿐만 아니라 등)을 더 활용하세요.');
      if (ttr < 0.65 && words.length > 30) issues.push(`어휘 반복이 많습니다 (어휘 다양도 ${Math.round(ttr * 100)}%).`);
      spacingErrors.forEach(e => issues.push(`표기/띄어쓰기: "${e.text}" — ${e.hint}`));
      if (penalty) issues.push(`분량 ${count}자 → 공식 규격(600~700자) 이탈로 ${penalty}점 감점되었습니다.`);

      return { count, paragraphs: paragraphs.length, sentences: sentences.length,
        scores: { content, structure, language }, total, level, penalty, strengths, issues,
        details: { conditions, markers: usedMarkers, formalRatio: da / nS, politeEndings: polite, ttr, advanced, spacingErrors } };
    }
  };

  /* ═════════════ CAT (1-PL Rasch) ═════════════ */
  const Cat = {
    ITEMS: 12, MINUTES: 15,
    p(theta, delta) { return 1 / (1 + Math.exp(delta - theta)); },
    /** 회차 내 위치 기반 난이도 prior (−2.5 ~ +2.5). 실사용 로그로 재보정 필요 */
    difficultyOf(q) {
      const pos = ((q.order || 1) - 1) % 20;
      const hash = ((q.id || 0) * 2654435761 % 1000) / 1000; // 결정적 지터
      return clamp((pos / 19) * 4 - 2 + (hash - 0.5), -2.5, 2.5);
    },
    estimate(responses, prior) {
      const pr = Object.assign({ mean: 0, sd: 1.5 }, prior);
      let th = pr.mean, h = 1 / (pr.sd * pr.sd);
      for (let i = 0; i < 30; i++) {
        let g = -(th - pr.mean) / (pr.sd * pr.sd);
        h = 1 / (pr.sd * pr.sd);
        responses.forEach(r => { const p = Cat.p(th, r.delta); g += (r.correct ? 1 : 0) - p; h += p * (1 - p); });
        const step = clamp(g / h, -1, 1);
        th = clamp(th + step, -4, 4);
        if (Math.abs(step) < 1e-5) break;
      }
      return { theta: th, se: 1 / Math.sqrt(h) };
    },
    /** θ에 가장 가까운 난이도 문항 중 상위 5개에서 무작위 선택 */
    pickNext(pool, theta, askedIds, type, rnd) {
      const r = rnd || Math.random;
      const cands = pool.filter(q => (!type || q.type === type) && !askedIds.has(q.id))
        .map(q => ({ q, d: Math.abs(Cat.difficultyOf(q) - theta) })).sort((a, b) => a.d - b.d).slice(0, 5);
      return cands.length ? cands[Math.floor(r() * cands.length)].q : null;
    },
    expectedScore(theta, pool) {
      if (!pool.length) return 0;
      const mean = pool.reduce((s, q) => s + Cat.p(theta, Cat.difficultyOf(q)), 0) / pool.length;
      return Math.round(200 * mean / 5) * 5;
    }
  };

  /* ═════════════ 구독 등급 ═════════════ */
  const Sub = {
    resolve(stored, now) {
      const t = now == null ? Date.now() : now;
      if (stored && stored.tier === 'PRO' && stored.expiry && new Date(stored.expiry).getTime() > t) {
        return { tier: 'PRO', expired: false, daysLeft: Math.ceil((new Date(stored.expiry).getTime() - t) / DAY) };
      }
      return { tier: 'FREE', expired: !!(stored && stored.tier === 'PRO'), daysLeft: 0 };
    },
    FREE_ROUNDS: 3,
    isRoundLocked(tier, round) { return tier !== 'PRO' && Number(round) > Sub.FREE_ROUNDS; },
    todayKey(d) {
      const x = d || new Date();
      return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
    },
    uuidv4() {
      const c = root.crypto;
      if (c && c.randomUUID) return c.randomUUID();
      const b = new Uint8Array(16);
      if (c && c.getRandomValues) c.getRandomValues(b); else for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
      b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
      const h = Array.from(b, x => x.toString(16).padStart(2, '0'));
      return `${h.slice(0, 4).join('')}-${h.slice(4, 6).join('')}-${h.slice(6, 8).join('')}-${h.slice(8, 10).join('')}-${h.slice(10).join('')}`;
    }
  };

  const api = { Fsrs, Essay, Cat, Sub };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TopikEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
