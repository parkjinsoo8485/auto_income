#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
topik_questions.html을 1,917개 전 문항 지원 버전으로 업데이트
"""

import re
import os

with open('topik_questions.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add script tag in <head>
if 'epstopik_1917_bank.js' not in content:
    content = content.replace(
        '<link rel="preconnect" href="https://fonts.googleapis.com">',
        '<script src="epstopik_1917_bank.js"></script>\n  <link rel="preconnect" href="https://fonts.googleapis.com">'
    )

# 2. Add CSS for pagination buttons
pagination_css = """
    /* ─── Pagination Buttons ─── */
    .page-btn {
      min-width: 34px;
      height: 34px;
      padding: 0 8px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--bg-elevated);
      color: var(--text);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .page-btn:hover:not(:disabled) {
      border-color: var(--accent-light);
      background: var(--card-hover);
    }
    .page-btn.active {
      background: var(--accent-gradient);
      border-color: transparent;
      color: #fff;
      box-shadow: 0 2px 10px rgba(79, 70, 229, 0.4);
    }
    .page-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
"""

if '.page-btn' not in content:
    content = content.replace('/* Responsive */', pagination_css + '\n    /* Responsive */')

# 3. Add Exam Round Selector in CBT Section
exam_round_toolbar = """
        <!-- Exam Round Selector Toolbar (48 Rounds & Random 40) -->
        <div style="background:var(--bg-elevated);border:1px solid var(--border);border-radius:12px;padding:12px 16px;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:13px;font-weight:700;color:var(--text-secondary)">📋 모의고사 회차 선택:</span>
            <select id="select-exam-round" class="select-custom" onchange="changeExamRound(parseInt(this.value))" style="min-width:280px;font-weight:600">
              <!-- Dynamically populated 1 ~ 48 rounds -->
            </select>
          </div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <button class="btn-header" onclick="generateRandomExam()" style="padding:6px 14px;font-size:12px;background:rgba(99,102,241,0.15);border-color:rgba(99,102,241,0.4);color:#c7d2fe">
              🎲 1,917문항 무작위 랜덤 시험 생성
            </button>
            <span id="current-pool-info" style="font-size:12px;color:var(--cyan);background:rgba(6,182,212,0.1);padding:5px 12px;border-radius:6px;border:1px solid rgba(6,182,212,0.25)">
              총 1,917개 공개문항 라이브러리 가동 중
            </span>
          </div>
        </div>
"""

target_cbt_top_bar = """        <!-- Candidate & Timer Bar -->
        <div class="cbt-top-bar">
          <div class="candidate-info">
            <div class="candidate-avatar">👤</div>
            <div class="candidate-details">
              <strong>수험번호: 2026-EPS-7701 (홍길동)</strong>
              <span>고용허가제 한국어능력시험(EPS-TOPIK) CBT 실전평가</span>
            </div>
          </div>
          <div class="cbt-timer-block">
            <span class="timer-label">남은 시간</span>
            <div class="timer-display" id="exam-timer-text">50:00</div>
            <button class="btn-timer-pause" id="btn-timer-toggle" onclick="toggleExamTimer()">일시정지</button>
          </div>
        </div>"""

if 'select-exam-round' not in content and target_cbt_top_bar in content:
    content = content.replace(target_cbt_top_bar, target_cbt_top_bar + '\n' + exam_round_toolbar)

# 4. Add pagination bar and counter in Bank section
bank_pagination_html = """
      <!-- Pagination Info Toolbar -->
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;padding:4px 0">
        <div style="font-size:13px;color:var(--text-secondary)">
          총 <strong id="bank-total-count" style="color:var(--cyan)">1,917</strong>건 중 <span id="bank-range-text">1 ~ 20</span>번째 문항 표시
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:12px;color:var(--text-muted)">페이지당:</span>
          <select id="bank-page-size" class="select-custom" onchange="changeBankPageSize(parseInt(this.value))" style="padding:4px 10px;font-size:12px">
            <option value="20" selected>20개씩 보기</option>
            <option value="50">50개씩 보기</option>
            <option value="100">100개씩 보기</option>
          </select>
        </div>
      </div>
"""

target_records_grid = '<div class="api-records-grid" id="bank-records-container">'
if 'bank-pagination-nav' not in content:
    content = content.replace(
        target_records_grid,
        bank_pagination_html + '\n      ' + target_records_grid
    )
    # Bottom pagination nav
    content = content.replace(
        '</section>\n\n    <!-- ══════════════════════════════════════════════════\n         SECTION 3: API TEST CONSOLE',
        """      <!-- Bottom Pagination Navigator -->
      <div id="bank-pagination-nav" style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:20px;flex-wrap:wrap">
        <!-- Rendered by JS -->
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         SECTION 3: API TEST CONSOLE"""
    )

# 5. Replace JavaScript script body with comprehensive 1,917-item logic
script_start_idx = content.find('<script>')
if script_start_idx != -1:
    html_before_script = content[:script_start_idx + len('<script>')]
    
    new_script = """
    /* ─────────────────────────────────────────────────────────────
       1. GLOBAL STATE & 1,917 FULL EPS-TOPIK QUESTION ENGINE
    ───────────────────────────────────────────────────────────── */
    const APP_STATE = {
      apiKey: localStorage.getItem('epstopik_service_key') || '',
      currentTab: 'cbt',
      allBank: window.EPS_FULL_1917_BANK || [],
      currentRound: 1,
      currentExamQuestions: [], // 40 questions for active CBT exam
      currentQuestionIdx: 0,
      userAnswers: {}, // { qId: optionNum }
      examTimeRemaining: 50 * 60, // 50 mins
      examTimerInterval: null,
      isTimerRunning: true,
      selectedEndpoint: 'list',
      speechSynth: window.speechSynthesis,
      audioPlayCounts: {},
      isAudioPlaying: false,
      // Question Bank Explorer state
      bankPage: 1,
      bankPageSize: 20,
      filteredBankQuestions: []
    };

    /* ─────────────────────────────────────────────────────────────
       2. INITIALIZATION & LIFECYCLE
    ───────────────────────────────────────────────────────────── */
    window.addEventListener('DOMContentLoaded', () => {
      // 1. Ensure 1917 bank is loaded
      if (!APP_STATE.allBank || APP_STATE.allBank.length === 0) {
        if (window.EPS_FULL_1917_BANK && window.EPS_FULL_1917_BANK.length > 0) {
          APP_STATE.allBank = window.EPS_FULL_1917_BANK;
        }
      }
      APP_STATE.filteredBankQuestions = APP_STATE.allBank.slice();

      // 2. Load API key
      if (APP_STATE.apiKey) {
        document.getElementById('input-service-key').value = APP_STATE.apiKey;
        document.getElementById('display-api-key').textContent = APP_STATE.apiKey.substring(0, 8) + '••••••••';
        document.getElementById('api-status-text').textContent = '공공데이터 인증키 등록됨';
      }

      // 3. Populate Round Selector (1 to 48 sets = 48 x 40 = 1,920 questions)
      populateExamRoundOptions();

      // 4. Load Round 1 into CBT
      loadExamRound(1);

      // 5. Render Question Bank (1,917 items with pagination)
      renderBankPage();

      // 6. Keyboard shortcut listeners
      window.addEventListener('keydown', handleKeyboardShortcuts);
    });

    /* ─────────────────────────────────────────────────────────────
       3. NAVIGATION & TABS
    ───────────────────────────────────────────────────────────── */
    function switchMainTab(tabName) {
      APP_STATE.currentTab = tabName;
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById(`tab-btn-${tabName}`).classList.add('active');

      document.getElementById('view-cbt').style.display = tabName === 'cbt' ? 'grid' : 'none';
      document.getElementById('view-bank').style.display = tabName === 'bank' ? 'flex' : 'none';
      document.getElementById('view-console').style.display = tabName === 'console' ? 'grid' : 'none';

      if (tabName === 'bank') {
        renderBankPage();
      }
    }

    /* ─────────────────────────────────────────────────────────────
       4. EXAM ROUND & SET RESOLVER (48 Sets x 40 Questions)
    ───────────────────────────────────────────────────────────── */
    function populateExamRoundOptions() {
      const select = document.getElementById('select-exam-round');
      if (!select) return;
      select.innerHTML = '';

      const totalL = APP_STATE.allBank.filter(q => q.type === 'L').length; // 960
      const totalR = APP_STATE.allBank.filter(q => q.type === 'R').length; // 957
      const totalRounds = Math.min(Math.floor(totalL / 20), Math.floor(totalR / 20)); // 47 or 48

      for (let r = 1; r <= totalRounds; r++) {
        const lStart = (r - 1) * 20 + 1;
        const lEnd = r * 20;
        const rStart = (r - 1) * 20 + 1;
        const rEnd = r * 20;

        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = `제 ${r}회 실전 모의고사 (듣기 ${lStart}~${lEnd}번 + 읽기 ${rStart}~${rEnd}번)`;
        select.appendChild(opt);
      }
    }

    function changeExamRound(roundNum) {
      if (confirm(`제 ${roundNum}회 실전 모의고사로 변경하시겠습니까? 현재 작성 중인 답안은 초기화됩니다.`)) {
        loadExamRound(roundNum);
      } else {
        document.getElementById('select-exam-round').value = APP_STATE.currentRound;
      }
    }

    function loadExamRound(roundNum) {
      APP_STATE.currentRound = roundNum;
      document.getElementById('select-exam-round').value = roundNum;

      const allL = APP_STATE.allBank.filter(q => q.type === 'L');
      const allR = APP_STATE.allBank.filter(q => q.type === 'R');

      const lSlice = allL.slice((roundNum - 1) * 20, roundNum * 20);
      const rSlice = allR.slice((roundNum - 1) * 20, roundNum * 20);

      // Create sequential 40-question exam set (1~20 L, 21~40 R)
      APP_STATE.currentExamQuestions = [
        ...lSlice.map((q, idx) => ({ ...q, examNum: idx + 1 })),
        ...rSlice.map((q, idx) => ({ ...q, examNum: idx + 21 }))
      ];

      document.getElementById('tab-cbt-counter').textContent = `제 ${roundNum}회 (40문항)`;
      document.getElementById('current-pool-info').textContent = `제 ${roundNum}회 실전 모의평가 진행 중`;

      // Reset state & start fresh
      resetExamState();
    }

    function generateRandomExam() {
      if (!confirm('전체 1,917개 공개문항에서 무작위로 40문항(듣기 20 + 읽기 20)을 추출하여 새로운 모의고사를 생성하시겠습니까?')) return;

      const allL = APP_STATE.allBank.filter(q => q.type === 'L');
      const allR = APP_STATE.allBank.filter(q => q.type === 'R');

      const shuffledL = allL.slice().sort(() => 0.5 - Math.random()).slice(0, 20);
      const shuffledR = allR.slice().sort(() => 0.5 - Math.random()).slice(0, 20);

      APP_STATE.currentExamQuestions = [
        ...shuffledL.map((q, idx) => ({ ...q, examNum: idx + 1 })),
        ...shuffledR.map((q, idx) => ({ ...q, examNum: idx + 21 }))
      ];

      document.getElementById('tab-cbt-counter').textContent = '랜덤 모의고사 (40문항)';
      document.getElementById('current-pool-info').textContent = '🎲 1,917문항 무작위 추출 실전 모의고사';

      resetExamState();
    }

    function loadSingleQuestionIntoCbt(globalQId) {
      const targetQ = APP_STATE.allBank.find(q => q.id === globalQId);
      if (!targetQ) return;

      // Find which round contains this question
      let targetRound = 1;
      if (targetQ.type === 'L') {
        targetRound = Math.floor((targetQ.order - 1) / 20) + 1;
      } else {
        targetRound = Math.floor((targetQ.order - 1) / 20) + 1;
      }
      targetRound = Math.max(1, Math.min(48, targetRound));

      loadExamRound(targetRound);

      // Find position in active 40
      const inRoundIdx = APP_STATE.currentExamQuestions.findIndex(q => q.id === targetQ.id);
      if (inRoundIdx !== -1) {
        APP_STATE.currentQuestionIdx = inRoundIdx;
      } else {
        APP_STATE.currentQuestionIdx = 0;
      }

      renderCurrentQuestion();
      switchMainTab('cbt');
    }

    function resetExamState() {
      APP_STATE.userAnswers = {};
      APP_STATE.currentQuestionIdx = 0;
      APP_STATE.examTimeRemaining = 50 * 60;
      APP_STATE.isTimerRunning = true;
      renderOmrGrid();
      renderCurrentQuestion();
      startExamTimer();
    }

    /* ─────────────────────────────────────────────────────────────
       5. CBT EXAM ENGINE
    ───────────────────────────────────────────────────────────── */
    function renderCurrentQuestion() {
      const questions = APP_STATE.currentExamQuestions;
      const q = questions[APP_STATE.currentQuestionIdx];
      if (!q) return;

      document.getElementById('q-current-number').textContent = q.examNum;
      document.getElementById('q-instruction-text').textContent = q.instruction || '[문제를 읽고 알맞은 것을 고르십시오]';
      document.getElementById('q-category-text').textContent = q.category || '직무 문항';

      const subjectBadge = document.getElementById('q-subject-badge');
      if (q.type === 'L') {
        subjectBadge.className = 'q-subject-pill L';
        subjectBadge.textContent = '🎧 듣기 (Listening)';
        document.getElementById('audio-player-section').style.display = 'flex';
        document.getElementById('script-content-text').textContent = q.dialogue || '';
        document.getElementById('audio-play-count').textContent = `청취 ${APP_STATE.audioPlayCounts[q.id] || 0} / 2회`;
        document.getElementById('script-box-view').classList.remove('active');
      } else {
        subjectBadge.className = 'q-subject-pill R';
        subjectBadge.textContent = '📖 읽기 (Reading)';
        document.getElementById('audio-player-section').style.display = 'none';
        document.getElementById('script-box-view').classList.remove('active');
      }

      // Visual graphics
      const visualBox = document.getElementById('q-visual-box');
      if (q.visual) {
        visualBox.style.display = 'flex';
        document.getElementById('sign-graphic-icon').textContent = q.visual.icon;
        document.getElementById('sign-graphic-title').textContent = q.visual.title;
        document.getElementById('sign-graphic-sub').textContent = q.visual.sub;
      } else {
        visualBox.style.display = 'none';
      }

      // Passage
      const passageBox = document.getElementById('q-passage-box');
      if (q.passage) {
        passageBox.style.display = 'block';
        document.getElementById('q-passage-text').textContent = q.passage;
      } else {
        passageBox.style.display = 'none';
      }

      // Options
      const optionsContainer = document.getElementById('options-container');
      optionsContainer.innerHTML = '';

      const selectedOpt = APP_STATE.userAnswers[q.id];

      q.options.forEach((optText, idx) => {
        const optNum = idx + 1;
        const btn = document.createElement('button');
        btn.className = 'option-btn' + (selectedOpt === optNum ? ' selected' : '');
        btn.onclick = () => selectOption(q.id, optNum);

        btn.innerHTML = `
          <div class="option-num-badge">${optNum}</div>
          <div class="option-text">${optText}</div>
        `;
        optionsContainer.appendChild(btn);
      });

      // Prev / Next button states
      document.getElementById('btn-prev-q').disabled = APP_STATE.currentQuestionIdx === 0;
      document.getElementById('btn-next-q').disabled = APP_STATE.currentQuestionIdx === questions.length - 1;

      updateOmrHighlight();
    }

    function selectOption(qId, optNum) {
      APP_STATE.userAnswers[qId] = optNum;
      renderCurrentQuestion();
      updateOmrGrid();
    }

    function clearCurrentAnswer() {
      const q = APP_STATE.currentExamQuestions[APP_STATE.currentQuestionIdx];
      if (q) {
        delete APP_STATE.userAnswers[q.id];
        renderCurrentQuestion();
        updateOmrGrid();
      }
    }

    function navigateQuestion(offset) {
      const nextIdx = APP_STATE.currentQuestionIdx + offset;
      if (nextIdx >= 0 && nextIdx < APP_STATE.currentExamQuestions.length) {
        APP_STATE.currentQuestionIdx = nextIdx;
        renderCurrentQuestion();
      }
    }

    function jumpToQuestion(idx) {
      if (idx >= 0 && idx < APP_STATE.currentExamQuestions.length) {
        APP_STATE.currentQuestionIdx = idx;
        renderCurrentQuestion();
      }
    }

    function handleKeyboardShortcuts(e) {
      if (APP_STATE.currentTab !== 'cbt') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      const q = APP_STATE.currentExamQuestions[APP_STATE.currentQuestionIdx];
      if (!q) return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        selectOption(q.id, parseInt(e.key));
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'n') {
        navigateQuestion(1);
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'p') {
        navigateQuestion(-1);
      } else if (e.key === ' ' && q.type === 'L') {
        e.preventDefault();
        playCurrentQuestionAudio();
      }
    }

    /* ─── Audio TTS Engine (Listening Repeat 2 Times) ─── */
    function playCurrentQuestionAudio() {
      const q = APP_STATE.currentExamQuestions[APP_STATE.currentQuestionIdx];
      if (!q || q.type !== 'L') return;

      if (!('speechSynthesis' in window)) {
        alert('현재 브라우저가 Web Speech 음성 합성을 지원하지 않습니다.');
        return;
      }

      window.speechSynthesis.cancel();

      const playBox = document.getElementById('audio-player-section');
      const playBtn = document.getElementById('btn-audio-play');

      playBox.classList.add('playing');
      playBtn.classList.add('playing');
      playBtn.textContent = '❚❚';

      const scriptToSpeak = (q.dialogue || q.instruction).replace(/남:\s*/g, '').replace(/여:\s*/g, '');
      const utterance = new SpeechSynthesisUtterance(scriptToSpeak);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.95;

      utterance.onend = () => {
        playBox.classList.remove('playing');
        playBtn.classList.remove('playing');
        playBtn.textContent = '▶';
        APP_STATE.audioPlayCounts[q.id] = (APP_STATE.audioPlayCounts[q.id] || 0) + 1;
        document.getElementById('audio-play-count').textContent = `청취 ${APP_STATE.audioPlayCounts[q.id]} / 2회`;
      };

      utterance.onerror = () => {
        playBox.classList.remove('playing');
        playBtn.classList.remove('playing');
        playBtn.textContent = '▶';
      };

      window.speechSynthesis.speak(utterance);
    }

    function toggleScriptBox() {
      const box = document.getElementById('script-box-view');
      box.classList.toggle('active');
    }

    /* ─── Timer Engine ─── */
    function startExamTimer() {
      if (APP_STATE.examTimerInterval) clearInterval(APP_STATE.examTimerInterval);

      APP_STATE.examTimerInterval = setInterval(() => {
        if (!APP_STATE.isTimerRunning) return;

        if (APP_STATE.examTimeRemaining <= 0) {
          clearInterval(APP_STATE.examTimerInterval);
          alert('시험 시간이 종료되었습니다! 자동으로 답안이 제출됩니다.');
          submitExam();
          return;
        }

        APP_STATE.examTimeRemaining--;
        const mins = Math.floor(APP_STATE.examTimeRemaining / 60);
        const secs = APP_STATE.examTimeRemaining % 60;
        const timerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        
        const timerElem = document.getElementById('exam-timer-text');
        timerElem.textContent = timerText;

        if (APP_STATE.examTimeRemaining < 300) {
          timerElem.classList.add('warning');
        } else {
          timerElem.classList.remove('warning');
        }
      }, 1000);
    }

    function toggleExamTimer() {
      APP_STATE.isTimerRunning = !APP_STATE.isTimerRunning;
      const btn = document.getElementById('btn-timer-toggle');
      btn.textContent = APP_STATE.isTimerRunning ? '일시정지' : '계속하기';
      btn.style.color = APP_STATE.isTimerRunning ? 'var(--text-secondary)' : 'var(--gold)';
    }

    /* ─── OMR Sheet Grid ─── */
    function renderOmrGrid() {
      const listeningGrid = document.getElementById('omr-grid-listening');
      const readingGrid = document.getElementById('omr-grid-reading');
      listeningGrid.innerHTML = '';
      readingGrid.innerHTML = '';

      APP_STATE.currentExamQuestions.forEach((q, idx) => {
        const cell = document.createElement('div');
        cell.className = 'omr-cell';
        cell.id = `omr-cell-${idx}`;
        cell.onclick = () => jumpToQuestion(idx);

        cell.innerHTML = `
          <span class="q-num-text">${q.examNum}</span>
          <span class="q-marked-val" id="omr-val-${q.id}">-</span>
        `;

        if (q.type === 'L') {
          listeningGrid.appendChild(cell);
        } else {
          readingGrid.appendChild(cell);
        }
      });

      updateOmrGrid();
    }

    function updateOmrGrid() {
      let answeredCount = 0;

      APP_STATE.currentExamQuestions.forEach((q, idx) => {
        const cell = document.getElementById(`omr-cell-${idx}`);
        const valElem = document.getElementById(`omr-val-${q.id}`);
        const userMark = APP_STATE.userAnswers[q.id];

        if (cell && valElem) {
          if (userMark) {
            cell.classList.add('marked');
            valElem.textContent = userMark;
            answeredCount++;
          } else {
            cell.classList.remove('marked');
            valElem.textContent = '-';
          }
        }
      });

      document.getElementById('omr-answered-count').textContent = answeredCount;
      updateOmrHighlight();
    }

    function updateOmrHighlight() {
      document.querySelectorAll('.omr-cell').forEach((cell, idx) => {
        if (idx === APP_STATE.currentQuestionIdx) {
          cell.classList.add('current');
        } else {
          cell.classList.remove('current');
        }
      });
    }

    /* ─── Exam Submission & Scoring ─── */
    function confirmSubmitExam() {
      const answeredCount = Object.keys(APP_STATE.userAnswers).length;
      const totalCount = APP_STATE.currentExamQuestions.length;
      const unanswered = totalCount - answeredCount;

      const confirmMsg = unanswered > 0
        ? `미작성된 문항이 ${unanswered}개 있습니다.\\n정말 최종 제출하고 채점하시겠습니까?`
        : `40문항 전체에 답변하였습니다.\\n최종 제출하고 채점하시겠습니까?`;

      if (confirm(confirmMsg)) {
        submitExam();
      }
    }

    function submitExam() {
      if (APP_STATE.examTimerInterval) clearInterval(APP_STATE.examTimerInterval);

      let lCorrect = 0;
      let rCorrect = 0;

      APP_STATE.currentExamQuestions.forEach((q, idx) => {
        const userAns = APP_STATE.userAnswers[q.id];
        const isCorrect = userAns === q.answer;

        if (isCorrect) {
          if (q.type === 'L') lCorrect++;
          else rCorrect++;
        }

        const cell = document.getElementById(`omr-cell-${idx}`);
        if (cell) {
          cell.classList.remove('correct', 'wrong');
          cell.classList.add(isCorrect ? 'correct' : 'wrong');
        }
      });

      const lScore = lCorrect * 5;
      const rScore = rCorrect * 5;
      const totalScore = lScore + rScore;
      const isPassed = totalScore >= 110;

      document.getElementById('result-total-score').textContent = `${totalScore} / 200점`;
      document.getElementById('result-l-score').textContent = `${lScore}점 / 100점`;
      document.getElementById('result-l-correct-count').textContent = `${lCorrect}문항 정답 (총 20문항)`;
      document.getElementById('result-r-score').textContent = `${rScore}점 / 100점`;
      document.getElementById('result-r-correct-count').textContent = `${rCorrect}문항 정답 (총 20문항)`;

      const statusPill = document.getElementById('result-status-pill');
      const trophyEmoji = document.getElementById('result-trophy-emoji');
      const summaryMsg = document.getElementById('result-summary-msg');

      if (isPassed) {
        statusPill.className = 'result-status-badge pass';
        statusPill.textContent = '최종 합격 (PASSED)';
        trophyEmoji.textContent = '🎉';
        summaryMsg.textContent = `축하합니다! EPS-TOPIK 기준 합격선(110점)을 넘겨 안정적으로 통과하셨습니다.`;
      } else {
        statusPill.className = 'result-status-badge fail';
        statusPill.textContent = '과락 / 불합격 (FAILED)';
        trophyEmoji.textContent = '📚';
        summaryMsg.textContent = `아쉽습니다. 기준선(110점)에 도달하지 못했습니다. 오답 해설을 확인하고 다시 도전하세요!`;
      }

      const expContainer = document.getElementById('result-explanation-container');
      expContainer.innerHTML = '';

      APP_STATE.currentExamQuestions.forEach(q => {
        const userAns = APP_STATE.userAnswers[q.id];
        const isCorrect = userAns === q.answer;

        const item = document.createElement('div');
        item.className = 'exp-item';
        item.style.borderColor = isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.4)';

        item.innerHTML = `
          <div class="exp-item-header">
            <span>[${q.examNum}번] ${q.type === 'L' ? '🎧 듣기' : '📖 읽기'} - ${q.category || ''}</span>
            <span style="color:${isCorrect ? 'var(--green)' : 'var(--red)'}">
              ${isCorrect ? '✓ 정답' : `✕ 오답 (내 선택: ${userAns || '미선택'}, 정답: ${q.answer}번)`}
            </span>
          </div>
          <div class="exp-desc">
            <strong>정답: ${q.answer}번 (${q.options[q.answer - 1]})</strong><br>
            ${q.explanation || ''}
          </div>
        `;
        expContainer.appendChild(item);
      });

      document.getElementById('modal-exam-result').classList.add('open');
    }

    function closeResultModal() {
      document.getElementById('modal-exam-result').classList.remove('open');
    }

    function restartExam() {
      closeResultModal();
      resetExamState();
    }

    /* ─────────────────────────────────────────────────────────────
       6. 1,917 QUESTION BANK EXPLORER & PAGINATION
    ───────────────────────────────────────────────────────────── */
    function filterBankQuestions() {
      const revVal = document.getElementById('bank-rev-filter').value;
      const typeVal = document.getElementById('bank-type-filter').value;
      const keyword = document.getElementById('bank-search-input').value.trim().toLowerCase();

      APP_STATE.filteredBankQuestions = APP_STATE.allBank.filter(q => {
        if (revVal !== 'all' && String(q.revCd) !== revVal) return false;
        if (typeVal !== 'all' && q.type !== typeVal) return false;
        if (keyword) {
          const matchText = `${q.order} ${q.idx || ''} ${q.title || ''} ${q.instruction || ''} ${q.passage || ''} ${q.dialogue || ''} ${(q.options || []).join(' ')} ${q.category || ''}`.toLowerCase();
          if (!matchText.includes(keyword)) return false;
        }
        return true;
      });

      APP_STATE.bankPage = 1; // Reset to page 1
      renderBankPage();
    }

    function changeBankPageSize(newSize) {
      APP_STATE.bankPageSize = newSize;
      APP_STATE.bankPage = 1;
      renderBankPage();
    }

    function changeBankPage(pageNum) {
      APP_STATE.bankPage = pageNum;
      renderBankPage();
      // Scroll to top of bank records
      document.getElementById('view-bank').scrollIntoView({ behavior: 'smooth' });
    }

    function renderBankPage() {
      const totalCount = APP_STATE.filteredBankQuestions.length;
      const pageSize = APP_STATE.bankPageSize;
      const totalPages = Math.ceil(totalCount / pageSize) || 1;
      const currentPage = Math.min(Math.max(1, APP_STATE.bankPage), totalPages);
      APP_STATE.bankPage = currentPage;

      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalCount);
      const pageItems = APP_STATE.filteredBankQuestions.slice(startIndex, endIndex);

      // Update counters
      document.getElementById('tab-bank-counter').textContent = `${totalCount.toLocaleString()}건`;
      const bankTotalCountElem = document.getElementById('bank-total-count');
      if (bankTotalCountElem) bankTotalCountElem.textContent = totalCount.toLocaleString();
      const rangeTextElem = document.getElementById('bank-range-text');
      if (rangeTextElem) {
        rangeTextElem.textContent = totalCount > 0 ? `${startIndex + 1} ~ ${endIndex}` : '0';
      }

      // Render cards
      const container = document.getElementById('bank-records-container');
      container.innerHTML = '';

      if (pageItems.length === 0) {
        container.innerHTML = `
          <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted)">
            <div style="font-size:42px;margin-bottom:10px">🔍</div>
            <p>검색 조건에 일치하는 문항이 없습니다.</p>
          </div>
        `;
      } else {
        pageItems.forEach(q => {
          const card = document.createElement('div');
          card.className = 'record-card';
          card.onclick = () => loadSingleQuestionIntoCbt(q.id);

          const previewSnippet = q.passage || q.dialogue || q.instruction;

          card.innerHTML = `
            <div>
              <div class="record-header">
                <span class="record-idx">문항순서 #${String(q.order).padStart(4, '0')} (idx:${q.idx || q.id})</span>
                <span class="q-subject-pill ${q.type}">${q.type === 'L' ? '🎧 듣기 (L)' : '📖 읽기 (R)'}</span>
              </div>
              <h4 class="record-title" style="margin-top:8px">${q.title || q.instruction}</h4>
              <p style="font-size:12px;color:var(--text-secondary);margin-top:6px;line-height:1.5">
                ${previewSnippet ? previewSnippet.substring(0, 85) + '...' : ''}
              </p>
            </div>
            <div class="record-meta-row">
              <span>분류: ${q.workplace_tag || q.category || '직무문항'}</span>
              <button class="btn-solve-now" onclick="event.stopPropagation();loadSingleQuestionIntoCbt(${q.id})">이 문제 바로 풀기 ➔</button>
            </div>
          `;
          container.appendChild(card);
        });
      }

      // Render Bottom Pagination
      renderPaginationNav(currentPage, totalPages);
    }

    function renderPaginationNav(curr, total) {
      const nav = document.getElementById('bank-pagination-nav');
      if (!nav) return;
      nav.innerHTML = '';

      if (total <= 1) return;

      // First & Prev buttons
      const btnFirst = document.createElement('button');
      btnFirst.className = 'page-btn';
      btnFirst.textContent = '«';
      btnFirst.disabled = curr === 1;
      btnFirst.onclick = () => changeBankPage(1);
      nav.appendChild(btnFirst);

      const btnPrev = document.createElement('button');
      btnPrev.className = 'page-btn';
      btnPrev.textContent = '‹';
      btnPrev.disabled = curr === 1;
      btnPrev.onclick = () => changeBankPage(curr - 1);
      nav.appendChild(btnPrev);

      // Window of numbers around current page
      let startP = Math.max(1, curr - 3);
      let endP = Math.min(total, curr + 3);

      if (startP > 1) {
        const btn1 = document.createElement('button');
        btn1.className = 'page-btn';
        btn1.textContent = '1';
        btn1.onclick = () => changeBankPage(1);
        nav.appendChild(btn1);

        if (startP > 2) {
          const ellipsis = document.createElement('span');
          ellipsis.style.color = 'var(--text-muted)';
          ellipsis.style.padding = '0 4px';
          ellipsis.textContent = '...';
          nav.appendChild(ellipsis);
        }
      }

      for (let p = startP; p <= endP; p++) {
        const btn = document.createElement('button');
        btn.className = 'page-btn' + (p === curr ? ' active' : '');
        btn.textContent = p;
        btn.onclick = () => changeBankPage(p);
        nav.appendChild(btn);
      }

      if (endP < total) {
        if (endP < total - 1) {
          const ellipsis = document.createElement('span');
          ellipsis.style.color = 'var(--text-muted)';
          ellipsis.style.padding = '0 4px';
          ellipsis.textContent = '...';
          nav.appendChild(ellipsis);
        }

        const btnLast = document.createElement('button');
        btnLast.className = 'page-btn';
        btnLast.textContent = total;
        btnLast.onclick = () => changeBankPage(total);
        nav.appendChild(btnLast);
      }

      // Next & Last buttons
      const btnNext = document.createElement('button');
      btnNext.className = 'page-btn';
      btnNext.textContent = '›';
      btnNext.disabled = curr === total;
      btnNext.onclick = () => changeBankPage(curr + 1);
      nav.appendChild(btnNext);

      const btnEnd = document.createElement('button');
      btnEnd.className = 'page-btn';
      btnEnd.textContent = '»';
      btnEnd.disabled = curr === total;
      btnEnd.onclick = () => changeBankPage(total);
      nav.appendChild(btnEnd);
    }

    /* ─────────────────────────────────────────────────────────────
       7. API TEST CONSOLE & SPEC (getApiQstbookList / Cont / Files)
    ───────────────────────────────────────────────────────────── */
    function selectEndpoint(endpointKey, elem) {
      APP_STATE.selectedEndpoint = endpointKey;
      document.querySelectorAll('.endpoint-item').forEach(el => el.classList.remove('active'));
      elem.classList.add('active');

      const revCdGroup = document.getElementById('group-param-revcd');
      if (endpointKey === 'cont') {
        revCdGroup.style.display = 'block';
      } else {
        revCdGroup.style.display = 'block';
      }
    }

    async function executeApiTest() {
      const numRows = parseInt(document.getElementById('param-num-rows').value || '10');
      const pageNo = parseInt(document.getElementById('param-page-no').value || '1');
      const revCd = document.getElementById('param-rev-cd').value || '3';
      const proxyMode = document.getElementById('param-cors-proxy').value;
      const key = APP_STATE.apiKey || 'YOUR_SERVICE_KEY';

      const viewer = document.getElementById('api-raw-response');
      const statusBadge = document.getElementById('response-status-badge');

      viewer.textContent = `[요청 시작] ${APP_STATE.selectedEndpoint} API 호출 중...\\n`;
      statusBadge.textContent = 'Calling...';

      let endpointPath = '';
      if (APP_STATE.selectedEndpoint === 'list') endpointPath = 'getApiQstbookList';
      else if (APP_STATE.selectedEndpoint === 'cont') endpointPath = 'getApiQstbookCont';
      else endpointPath = 'getApiQstbookFiles';

      let targetUrl = `https://apis.data.go.kr/B490007/QstbookInfo/${endpointPath}?serviceKey=${encodeURIComponent(key)}&numOfRows=${numRows}&pageNo=${pageNo}`;
      if (APP_STATE.selectedEndpoint === 'cont' && revCd) {
        targetUrl += `&revCd=${encodeURIComponent(revCd)}`;
      }

      viewer.textContent += `Request URL: ${targetUrl}\\n\\n`;

      if (proxyMode === 'mock' || !APP_STATE.apiKey) {
        setTimeout(() => {
          let mockData = {};
          if (APP_STATE.selectedEndpoint === 'list') {
            mockData = {
              response: {
                header: { resultCode: "00", resultMsg: "NORMAL SERVICE" },
                body: {
                  items: {
                    item: [
                      { revCd: "3", revNameKor: "특별한국어능력시험 직무문항", revNameEng: "Work related questions in Special EPS-TOPIK", useYn: "Y" },
                      { revCd: "2", revNameKor: "고용허가제 한국어능력시험 공개문제집 1차 개정판", revNameEng: "First Revised edition of EPS-TOPIK Question Book", useYn: "Y" },
                      { revCd: "1", revNameKor: "고용허가제 한국어능력시험 공개문제집 2차 개정판", revNameEng: "Second Revised edition of EPS-TOPIK Question Book", useYn: "Y" }
                    ]
                  },
                  numOfRows: numRows,
                  pageNo: pageNo,
                  totalCount: 3
                }
              }
            };
          } else if (APP_STATE.selectedEndpoint === 'cont') {
            mockData = {
              response: {
                header: { resultCode: "00", resultMsg: "NORMAL SERVICE" },
                body: {
                  items: {
                    item: [
                      { codeKorNm: "듣기", contentsNameKor: "듣기문제 정답 및 스크립트", contentsNameEng: "Answers For Listening Questions&Scripts" },
                      { codeKorNm: "듣기", contentsNameKor: "듣기문제", contentsNameEng: "Questions-Listening" },
                      { codeKorNm: "읽기", contentsNameKor: "읽기문제 정답 및 해설", contentsNameEng: "Answers For Reading Questions&Explanations" },
                      { codeKorNm: "읽기", contentsNameKor: "읽기문제", contentsNameEng: "Questions-Reading" }
                    ]
                  },
                  numOfRows: numRows,
                  pageNo: pageNo,
                  totalCount: 15
                }
              }
            };
          } else {
            // Full 1,917 items slice
            const startIdx = (pageNo - 1) * numRows;
            const endIdx = startIdx + numRows;
            const sliced = APP_STATE.allBank.slice(startIdx, endIdx);

            mockData = {
              response: {
                header: { resultCode: "00", resultMsg: "NORMAL SERVICE" },
                body: {
                  items: {
                    item: sliced.map(q => ({
                      idx: String(q.idx || q.id),
                      ssubJectType: q.type,
                      title: q.title || `[${q.type === 'L' ? '듣기' : '읽기'}분야]공개문제집 (문항순서-${String(q.order).padStart(8, '0')})`
                    }))
                  },
                  numOfRows: numRows,
                  pageNo: pageNo,
                  totalCount: APP_STATE.allBank.length
                }
              }
            };
          }
          statusBadge.textContent = 'Status: 200 OK (Official Data 1,917건)';
          viewer.textContent += JSON.stringify(mockData, null, 2);
        }, 300);
        return;
      }

      // Real API Call with Proxy
      try {
        let fetchUrl = targetUrl;
        if (proxyMode === 'allorigins') {
          fetchUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
        }

        const resp = await fetch(fetchUrl);
        const text = await resp.text();
        statusBadge.textContent = `Status: ${resp.status} ${resp.statusText}`;
        viewer.textContent += `[Response Data]\\n` + text;
      } catch (err) {
        statusBadge.textContent = 'Error: Failed';
        viewer.textContent += `[오류 발생] 네트워크 또는 CORS 차단:\\n${err.message}\\n\\n팁: 공공데이터포털(apis.data.go.kr)은 브라우저 직접 호출 시 CORS가 차단될 수 있으므로 'AllOrigins 프록시 우회' 또는 내장 Mock 모드를 선택하세요.`;
      }
    }

    async function syncDataFromApi() {
      if (!APP_STATE.apiKey) {
        alert('공공데이터포털 인증키가 설정되어 있지 않습니다.\\n[인증키 설정] 버튼을 눌러 발급받은 키를 등록하세요.');
        openApiConfigModal();
        return;
      }
      alert('공공데이터포털 서버와 실시간 데이터 동기화를 진행합니다.');
      executeApiTest();
      switchMainTab('console');
    }

    /* ─────────────────────────────────────────────────────────────
       8. API KEY MANAGEMENT MODAL
    ───────────────────────────────────────────────────────────── */
    function openApiConfigModal() {
      document.getElementById('modal-api-config').classList.add('open');
    }

    function closeApiConfigModal() {
      document.getElementById('modal-api-config').classList.remove('open');
    }

    function saveApiKey() {
      const keyVal = document.getElementById('input-service-key').value.trim();
      APP_STATE.apiKey = keyVal;
      localStorage.setItem('epstopik_service_key', keyVal);

      if (keyVal) {
        document.getElementById('display-api-key').textContent = keyVal.substring(0, 8) + '••••••••';
        document.getElementById('api-status-text').textContent = '공공데이터 인증키 등록됨';
        alert('인증키가 안전하게 저장되었습니다!');
      } else {
        document.getElementById('display-api-key').textContent = '내장 공공데이터 샘플 활성화됨';
        document.getElementById('api-status-text').textContent = 'API 준비 완료';
        alert('인증키가 초기화되었습니다. 기본 내장 데이터로 동작합니다.');
      }

      closeApiConfigModal();
    }
  </script>
</body>
</html>
"""

    final_content = html_before_script + new_script
    with open('topik_questions.html', 'w', encoding='utf-8') as f:
        f.write(final_content)
    print("topik_questions.html updated successfully!")
