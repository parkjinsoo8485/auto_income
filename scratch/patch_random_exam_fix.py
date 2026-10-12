#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
topik_questions.html 무작위 랜덤 시험 생성 및 오디오/UI 완벽 정상화 패치
"""

import re
import os

with open('topik_questions.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ─────────────────────────────────────────────────────────────────────────────
# 1. 토스트 알림 CSS 추가
# ─────────────────────────────────────────────────────────────────────────────
toast_css = """
    /* ─── Exam Toast Notification ─── */
    .cbt-toast {
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      background: linear-gradient(135deg, #1e1b4b, #0f172a);
      border: 1px solid var(--cyan);
      box-shadow: 0 10px 30px rgba(6, 182, 212, 0.35);
      color: #fff;
      padding: 12px 24px;
      border-radius: 30px;
      font-size: 14px;
      font-weight: 700;
      z-index: 99999;
      opacity: 0;
      pointer-events: none;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .cbt-toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
"""

if '.cbt-toast' not in content:
    content = content.replace('/* Responsive */', toast_css + '\n    /* Responsive */')

# 토스트 엘리먼트를 body 상단에 추가
if 'id="cbt-toast-box"' not in content:
    content = content.replace(
        '<body',
        '<body>\n  <div id="cbt-toast-box" class="cbt-toast">🎲 새로운 40문항 모의고사가 생성되었습니다!</div>'
    )

# ─────────────────────────────────────────────────────────────────────────────
# 2. generateRandomExam & changeExamRound 함수 전면 고도화
# ─────────────────────────────────────────────────────────────────────────────
new_random_exam_js = """    function showCbtToast(msg, icon = '🎲') {
      const toast = document.getElementById('cbt-toast-box');
      if (!toast) return;
      toast.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    function changeExamRound(val) {
      if (val === 'random') {
        generateRandomExam(false);
        return;
      }
      const roundNum = parseInt(val);
      loadExamRound(roundNum);
    }

    function loadExamRound(roundNum) {
      APP_STATE.currentRound = roundNum;
      
      const selectBox = document.getElementById('select-exam-round');
      if (selectBox) selectBox.value = String(roundNum);

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

      showCbtToast(`제 ${roundNum}회 실전 모의고사(40문항)가 로드되었습니다!`, '📋');
      resetExamState();
    }

    function generateRandomExam(notify = true) {
      const allL = APP_STATE.allBank.filter(q => q.type === 'L');
      const allR = APP_STATE.allBank.filter(q => q.type === 'R');

      if (!allL.length || !allR.length) {
        alert('문항 데이터베이스를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
        return;
      }

      // Fisher-Yates shuffle for true uniform randomness
      function shuffleArray(arr) {
        const copy = arr.slice();
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
      }

      const shuffledL = shuffleArray(allL).slice(0, 20);
      const shuffledR = shuffleArray(allR).slice(0, 20);

      APP_STATE.currentRound = 'random';
      APP_STATE.currentExamQuestions = [
        ...shuffledL.map((q, idx) => ({ ...q, examNum: idx + 1 })),
        ...shuffledR.map((q, idx) => ({ ...q, examNum: idx + 21 }))
      ];

      // Sync dropdown select box
      const selectBox = document.getElementById('select-exam-round');
      if (selectBox) {
        let randomOpt = selectBox.querySelector('option[value="random"]');
        if (!randomOpt) {
          randomOpt = document.createElement('option');
          randomOpt.value = 'random';
          randomOpt.textContent = '🎲 1,917문항 무작위 랜덤 모의고사';
          selectBox.insertBefore(randomOpt, selectBox.firstChild);
        }
        selectBox.value = 'random';
      }

      document.getElementById('tab-cbt-counter').textContent = '무작위 모의고사 (40문항)';
      document.getElementById('current-pool-info').textContent = '🎲 1,917문항 무작위 추출 실전 모의고사 가동 중';

      if (notify) {
        showCbtToast('1,917개 뱅크에서 새로운 40문항 실전 모의고사가 무작위 추출되었습니다!', '✨');
      }

      resetExamState();
    }"""

content = re.sub(
    r'function changeExamRound[\s\S]*?function generateRandomExam[\s\S]*?resetExamState\(\);\s*\}',
    lambda m: new_random_exam_js,
    content
)

# ─────────────────────────────────────────────────────────────────────────────
# 3. renderCurrentQuestion UI에서 원본 번호 표기 및 오디오 안정성 향상
# ─────────────────────────────────────────────────────────────────────────────
old_render_target = """      document.getElementById('q-current-number').textContent = q.examNum;
      document.getElementById('q-instruction-text').textContent = q.instruction || '[문제를 읽고 알맞은 것을 고르십시오]';"""

new_render_target = """      document.getElementById('q-current-number').innerHTML = `${q.examNum} <span style="font-size:12px;font-weight:500;color:var(--cyan);margin-left:4px">(공개문제 원본 #${String(q.order || q.id).padStart(4, '0')})</span>`;
      document.getElementById('q-instruction-text').textContent = q.instruction || '[문제를 읽고 알맞은 것을 고르십시오]';"""

if old_render_target in content:
    content = content.replace(old_render_target, new_render_target)

# ─────────────────────────────────────────────────────────────────────────────
# 4. playWithWebSpeechFallback 고도화: 랜덤 듣기 문제에서도 끊김 없는 낭독
# ─────────────────────────────────────────────────────────────────────────────
new_speech_fallback = """    function playWithWebSpeechFallback() {
      const q = APP_STATE.currentExamQuestions[APP_STATE.currentQuestionIdx];
      if (!q || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();
      const playBox = document.getElementById('audio-player-section');
      const playBtn = document.getElementById('btn-audio-play');
      if (playBox) playBox.classList.add('playing');
      if (playBtn) {
        playBtn.classList.add('playing');
        playBtn.textContent = '❚❚';
      }

      const rawScript = q.dialogue || q.instruction || '';
      // Prepare natural prompt
      const scriptToSpeak = `${q.examNum}번 문제입니다. ` + rawScript.replace(/남:\\s*/g, '남성: ').replace(/여:\\s*/g, '여성: ');

      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(scriptToSpeak);
        utterance.lang = 'ko-KR';
        utterance.rate = HRD_AUDIO_STATE.speed * 0.92;

        const voices = window.speechSynthesis.getVoices();
        const naturalVoice = voices.find(v => v.lang.includes('ko') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online')))
                          || voices.find(v => v.lang.includes('ko'));
        if (naturalVoice) utterance.voice = naturalVoice;

        utterance.onend = () => {
          if (playBox) playBox.classList.remove('playing');
          if (playBtn) {
            playBtn.classList.remove('playing');
            playBtn.textContent = '▶';
          }
          APP_STATE.audioPlayCounts[q.id] = (APP_STATE.audioPlayCounts[q.id] || 0) + 1;
          const countEl = document.getElementById('audio-play-count');
          if (countEl) countEl.textContent = `청취 ${APP_STATE.audioPlayCounts[q.id]} / 2회`;
        };

        utterance.onerror = () => {
          if (playBox) playBox.classList.remove('playing');
          if (playBtn) {
            playBtn.classList.remove('playing');
            playBtn.textContent = '▶';
          }
        };

        window.speechSynthesis.speak(utterance);
      }, 50);
    }"""

content = re.sub(
    r'function playWithWebSpeechFallback\(\)[\s\S]*?window\.speechSynthesis\.speak\(utterance\);\s*\}',
    lambda m: new_speech_fallback,
    content
)

with open('topik_questions.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ topik_questions.html 무작위 랜덤 시험 생성 및 UI 패치 완료!")
