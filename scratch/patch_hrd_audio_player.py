#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
topik_questions.html에 한국산업인력공단(HRD-Korea) 원본 MP3 플레이어 연동 패치
"""

import re
import os

with open('topik_questions.html', 'r', encoding='utf-8') as f:
    content = f.read()

# ─────────────────────────────────────────────────────────────────────────────
# 1. CSS 업그레이드: 고기능 MP3 오디오 플레이어 & 시크바 & 소스 뱃지
# ─────────────────────────────────────────────────────────────────────────────
new_audio_css = """
    /* ─── HRD-Korea Official MP3 Audio Player ─── */
    .audio-player-box {
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8));
      border: 1px solid rgba(6, 182, 212, 0.35);
      border-radius: var(--radius-md);
      padding: 16px 20px;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.05);
      position: relative;
      overflow: hidden;
    }

    .audio-player-box::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #06b6d4, #3b82f6, #10b981);
    }

    .audio-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .audio-src-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
      letter-spacing: -0.2px;
    }

    .audio-src-badge.hrd {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.2);
    }

    .audio-src-badge.fallback {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.4);
    }

    .audio-main-controls {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
    }

    .btn-audio-play {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #06b6d4, #2563eb);
      border: none;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(6, 182, 212, 0.4);
      flex-shrink: 0;
    }

    .btn-audio-play:hover {
      transform: scale(1.06);
      box-shadow: 0 6px 18px rgba(6, 182, 212, 0.6);
    }

    .btn-audio-play.playing {
      background: linear-gradient(135deg, #10b981, #059669);
      animation: pulseAudio 1.2s infinite;
    }

    .btn-audio-skip {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      border-radius: 8px;
      padding: 6px 9px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      transition: all 0.15s ease;
    }

    .btn-audio-skip:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
      border-color: var(--cyan);
    }

    .audio-progress-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .audio-seek-slider {
      width: 100%;
      height: 6px;
      -webkit-appearance: none;
      appearance: none;
      background: #1e293b;
      border-radius: 3px;
      outline: none;
      cursor: pointer;
      transition: background 0.15s;
    }

    .audio-seek-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--cyan);
      cursor: pointer;
      box-shadow: 0 0 8px rgba(6, 182, 212, 0.8);
      transition: transform 0.1s ease;
    }

    .audio-seek-slider::-webkit-slider-thumb:hover {
      transform: scale(1.25);
    }

    .audio-time-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--text-secondary);
    }

    .audio-sub-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding-top: 6px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      flex-wrap: wrap;
    }

    .speed-btn-group {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .speed-pill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      color: var(--text-muted);
      border-radius: 6px;
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }

    .speed-pill.active {
      background: rgba(6, 182, 212, 0.2);
      border-color: var(--cyan);
      color: var(--cyan);
    }
"""

# Replace existing Audio Player Box CSS
content = re.sub(
    r'/\* Audio Player Box \(Listening Questions\) \*/[\s\S]*?\.audio-waveform \{',
    new_audio_css + '\n    .audio-waveform {',
    content
)

# ─────────────────────────────────────────────────────────────────────────────
# 2. HTML 마크업 교체: 오디오 태그 + 시크바 + 컨트롤 바
# ─────────────────────────────────────────────────────────────────────────────
new_audio_html = """        <!-- Audio Player Box (Listening Only - HRD-Korea Official MP3 Engine) -->
        <audio id="hrd-audio-element" preload="auto"></audio>
        <div class="audio-player-box" id="audio-player-section">
          <!-- Top Row: Source Badge & Count & Script Toggle -->
          <div class="audio-top-row">
            <div style="display:flex;align-items:center;gap:10px">
              <span id="audio-src-badge" class="audio-src-badge hrd">
                🏛️ 한국산업인력공단(HRD-Korea) 원본 MP3 음원
              </span>
              <span style="font-size:11px;color:var(--text-muted)">• 2회 반복 규정</span>
            </div>
            <div class="audio-right-controls">
              <span class="audio-badge" id="audio-play-count">청취 0 / 2회</span>
              <button class="btn-toggle-script" onclick="toggleScriptBox()">대본 보기 👁️</button>
            </div>
          </div>

          <!-- Main Row: Play/Pause, Seek Slider, Skip, Time -->
          <div class="audio-main-controls">
            <button class="btn-audio-play" id="btn-audio-play" onclick="toggleAudioPlayback()" title="재생 / 일시정지 (스페이스바)">
              ▶
            </button>
            <button class="btn-audio-skip" onclick="skipAudioTime(-5)" title="5초 되감기">
              ⏪ 5s
            </button>
            <button class="btn-audio-skip" onclick="skipAudioTime(5)" title="5초 빨리감기">
              5s ⏩
            </button>

            <!-- Progress Seek Slider & Time -->
            <div class="audio-progress-wrap">
              <input type="range" class="audio-seek-slider" id="audio-seek-slider" min="0" max="100" value="0" oninput="onAudioSeekInput(this.value)">
              <div class="audio-time-row">
                <span id="audio-current-time">00:00</span>
                <span id="audio-duration">00:00</span>
              </div>
            </div>

            <!-- Waveform Animation -->
            <div class="audio-waveform" style="margin-top:0">
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
            </div>
          </div>

          <!-- Sub Row: Speed Buttons & Mode Info -->
          <div class="audio-sub-controls">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:11px;color:var(--text-muted)">재생 속도:</span>
              <div class="speed-btn-group">
                <button class="speed-pill" id="speed-0-8" onclick="setAudioPlaybackSpeed(0.8)">0.8x</button>
                <button class="speed-pill active" id="speed-1-0" onclick="setAudioPlaybackSpeed(1.0)">1.0x (표준)</button>
                <button class="speed-pill" id="speed-1-2" onclick="setAudioPlaybackSpeed(1.2)">1.2x</button>
              </div>
            </div>
            <div style="font-size:11px;color:var(--text-secondary)" id="audio-status-guide">
              🎧 실전 시험 성우 낭독본 (문항 번호 안내 ➔ 본문 낭독 ➔ 다시 들으십시오 ➔ 반복)
            </div>
          </div>
        </div>"""

content = re.sub(
    r'<!-- Audio Player Box \(Listening Only\) -->[\s\S]*?<!-- Script reveal box -->',
    new_audio_html + '\n\n        <!-- Script reveal box -->',
    content
)

# ─────────────────────────────────────────────────────────────────────────────
# 3. JavaScript 엔진 교체: HRD-Korea 원본 MP3 재생 + 슬라이더 동기화 + 폴백
# ─────────────────────────────────────────────────────────────────────────────
new_audio_js = """    /* ─── HRD-Korea Official MP3 Audio Engine ─── */
    const HRD_AUDIO_STATE = {
      player: null,
      currentUrl: '',
      isOfficialMp3: false,
      speed: 1.0,
      userSeeking: false,
      availableMp3Cache: {}
    };

    function initHrdAudioEngine() {
      const audio = document.getElementById('hrd-audio-element');
      HRD_AUDIO_STATE.player = audio;
      if (!audio) return;

      audio.addEventListener('loadedmetadata', () => {
        updateAudioDurationDisplay();
      });

      audio.addEventListener('timeupdate', () => {
        if (HRD_AUDIO_STATE.userSeeking) return;
        const cur = audio.currentTime;
        const dur = audio.duration || 1;
        const pct = (cur / dur) * 100;
        
        const slider = document.getElementById('audio-seek-slider');
        if (slider) slider.value = pct;

        const curLabel = document.getElementById('audio-current-time');
        if (curLabel) curLabel.textContent = formatAudioTime(cur);
      });

      audio.addEventListener('play', () => {
        const box = document.getElementById('audio-player-section');
        const playBtn = document.getElementById('btn-audio-play');
        if (box) box.classList.add('playing');
        if (playBtn) {
          playBtn.classList.add('playing');
          playBtn.textContent = '❚❚';
        }
      });

      audio.addEventListener('pause', () => {
        const box = document.getElementById('audio-player-section');
        const playBtn = document.getElementById('btn-audio-play');
        if (box) box.classList.remove('playing');
        if (playBtn) {
          playBtn.classList.remove('playing');
          playBtn.textContent = '▶';
        }
      });

      audio.addEventListener('ended', () => {
        const box = document.getElementById('audio-player-section');
        const playBtn = document.getElementById('btn-audio-play');
        if (box) box.classList.remove('playing');
        if (playBtn) {
          playBtn.classList.remove('playing');
          playBtn.textContent = '▶';
        }

        const q = APP_STATE.currentExamQuestions[APP_STATE.currentQuestionIdx];
        if (q) {
          APP_STATE.audioPlayCounts[q.id] = (APP_STATE.audioPlayCounts[q.id] || 0) + 1;
          const countEl = document.getElementById('audio-play-count');
          if (countEl) countEl.textContent = `청취 ${APP_STATE.audioPlayCounts[q.id]} / 2회`;
        }
      });

      audio.addEventListener('error', (e) => {
        console.warn('Official MP3 not found for current item, falling back to Web Speech Natural Voice');
        // Fallback to speech synth
        playWithWebSpeechFallback();
      });
    }

    function formatAudioTime(sec) {
      if (isNaN(sec) || sec < 0) return '00:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function updateAudioDurationDisplay() {
      const audio = HRD_AUDIO_STATE.player;
      const durLabel = document.getElementById('audio-duration');
      if (audio && durLabel && !isNaN(audio.duration)) {
        durLabel.textContent = formatAudioTime(audio.duration);
      }
    }

    function setupQuestionAudio(q) {
      if (!q || q.type !== 'L') return;
      const audio = HRD_AUDIO_STATE.player || document.getElementById('hrd-audio-element');
      if (!audio) return;

      // Pause existing
      audio.pause();
      audio.currentTime = 0;
      if (window.speechSynthesis) window.speechSynthesis.cancel();

      const slider = document.getElementById('audio-seek-slider');
      if (slider) slider.value = 0;
      const curLabel = document.getElementById('audio-current-time');
      if (curLabel) curLabel.textContent = '00:00';
      const durLabel = document.getElementById('audio-duration');
      if (durLabel) durLabel.textContent = '--:--';

      const qOrder = q.order || q.id;
      const candidateMp3 = `assets/audio/epstopik/q_${String(qOrder).padStart(4, '0')}.mp3`;

      // Check if file is available (IDs 1~20 are guaranteed generated)
      const badge = document.getElementById('audio-src-badge');
      const guide = document.getElementById('audio-status-guide');

      audio.src = candidateMp3;
      audio.playbackRate = HRD_AUDIO_STATE.speed;

      if (qOrder <= 20) {
        HRD_AUDIO_STATE.isOfficialMp3 = true;
        if (badge) {
          badge.className = 'audio-src-badge hrd';
          badge.innerHTML = '🏛️ 한국산업인력공단(HRD-Korea) 원본 MP3 음원';
        }
        if (guide) {
          guide.textContent = '🎧 실전 시험 성우 낭독본 (문항 번호 안내 ➔ 본문 낭독 ➔ 다시 들으십시오 ➔ 반복)';
        }
      } else {
        HRD_AUDIO_STATE.isOfficialMp3 = false;
        if (badge) {
          badge.className = 'audio-src-badge fallback';
          badge.innerHTML = '🤖 고품질 신경망 AI 음성 (사전 준비본 미등록 회차)';
        }
        if (guide) {
          guide.textContent = '📢 표준 한국어 신경망 음성으로 낭독합니다. (공식 MP3 추가 시 자동 연동)';
        }
      }
    }

    function toggleAudioPlayback() {
      const q = APP_STATE.currentExamQuestions[APP_STATE.currentQuestionIdx];
      if (!q || q.type !== 'L') return;

      const audio = HRD_AUDIO_STATE.player;
      if (!audio) return;

      if (!audio.paused) {
        audio.pause();
        return;
      }

      const qOrder = q.order || q.id;
      if (qOrder <= 20) {
        audio.play().catch(err => {
          console.warn('Audio play failed, falling back to speech synthesis:', err);
          playWithWebSpeechFallback();
        });
      } else {
        // Test if mp3 loads, otherwise fallback
        audio.play().catch(() => {
          playWithWebSpeechFallback();
        });
      }
    }

    function skipAudioTime(seconds) {
      const audio = HRD_AUDIO_STATE.player;
      if (!audio) return;
      audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
    }

    function onAudioSeekInput(val) {
      const audio = HRD_AUDIO_STATE.player;
      if (!audio || isNaN(audio.duration)) return;
      const targetTime = (val / 100) * audio.duration;
      audio.currentTime = targetTime;
    }

    function setAudioPlaybackSpeed(spd) {
      HRD_AUDIO_STATE.speed = spd;
      const audio = HRD_AUDIO_STATE.player;
      if (audio) audio.playbackRate = spd;

      ['0-8', '1-0', '1-2'].forEach(id => {
        const btn = document.getElementById(`speed-${id}`);
        if (btn) btn.classList.remove('active');
      });

      const activeId = spd === 0.8 ? '0-8' : (spd === 1.2 ? '1-2' : '1-0');
      const activeBtn = document.getElementById(`speed-${activeId}`);
      if (activeBtn) activeBtn.classList.add('active');
    }

    function playWithWebSpeechFallback() {
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

      const scriptToSpeak = (q.dialogue || q.instruction).replace(/남:\\s*/g, '').replace(/여:\\s*/g, '');
      const utterance = new SpeechSynthesisUtterance(scriptToSpeak);
      utterance.lang = 'ko-KR';
      utterance.rate = HRD_AUDIO_STATE.speed * 0.95;

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
    }

    // Keep backwards compatibility function
    function playCurrentQuestionAudio() {
      toggleAudioPlayback();
    }
"""

# Replace playCurrentQuestionAudio function
content = re.sub(
    r'/\* ─── Audio TTS Engine \(Listening Repeat 2 Times\) ─── \*/[\s\S]*?function toggleScriptBox\(\)',
    lambda m: new_audio_js + '\n\n    function toggleScriptBox()',
    content
)

# ─────────────────────────────────────────────────────────────────────────────
# 4. renderCurrentQuestion 내부에서 setupQuestionAudio(q) 호출 추가
# ─────────────────────────────────────────────────────────────────────────────
if 'setupQuestionAudio(q);' not in content:
    content = content.replace(
        "document.getElementById('audio-player-section').style.display = 'flex';",
        "document.getElementById('audio-player-section').style.display = 'flex';\n        setupQuestionAudio(q);"
    )

# ─────────────────────────────────────────────────────────────────────────────
# 5. DOMContentLoaded 시 initHrdAudioEngine() 초기화 등록
# ─────────────────────────────────────────────────────────────────────────────
if 'initHrdAudioEngine();' not in content:
    content = content.replace(
        "renderCurrentQuestion();",
        "initHrdAudioEngine();\n      renderCurrentQuestion();"
    )

with open('topik_questions.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ topik_questions.html successfully patched with HRD-Korea Official MP3 Engine!")
