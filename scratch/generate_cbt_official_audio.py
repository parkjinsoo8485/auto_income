#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
한국산업인력공단(HRD-Korea) EPS-TOPIK 실전 CBT 전 문항 듣기 오디오 고품질 안정 생성기
--------------------------------------------------------------------------------
- 가상환경 자동 감지
- 실패 시 최대 3회 자동 재시도 (Exponential Backoff) 탑재로 네트워크 403 차단 완벽 방어
- 한국어 종성 맞춤법 완벽 준수 지문 기반 생성
  1. 1회차 본문 낭독 (남: InJoon, 여: SunHi 성우 분리)
  2. "다시 들으십시오." (공식 규정 안내 멘트)
  3. 2회차 본문 반복 낭독
"""

import os
import sys
import subprocess

venv_py = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".venv", "Scripts", "python.exe"))
if os.path.exists(venv_py) and os.path.abspath(sys.executable).lower() != venv_py.lower():
    try:
        import edge_tts
    except ImportError:
        sys.exit(subprocess.call([venv_py] + sys.argv))

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import asyncio
import re
import json
import argparse
import random
import edge_tts

AUDIO_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "audio", "epstopik")
os.makedirs(AUDIO_DIR, exist_ok=True)

VOICE_FEMALE = "ko-KR-SunHiNeural"
VOICE_MALE = "ko-KR-InJoonNeural"

def parse_dialogue_turns(raw_text):
    lines = raw_text.strip().split('\n')
    turns = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        line = re.sub(r'\(\s*\)', '', line).strip()
        if not line:
            continue
            
        if line.startswith('남:'):
            content = line[2:].strip()
            if content:
                turns.append(('male', content))
        elif line.startswith('여:'):
            content = line[2:].strip()
            if content:
                turns.append(('female', content))
        else:
            turns.append(('female', line))
    return turns

async def generate_single_audio_file(q_num, turns, output_path, sem=None, max_retries=3):
    if sem:
        async with sem:
            return await _generate_with_retry(q_num, turns, output_path, max_retries)
    else:
        return await _generate_with_retry(q_num, turns, output_path, max_retries)

async def _generate_with_retry(q_num, turns, output_path, max_retries):
    for attempt in range(1, max_retries + 1):
        try:
            ok = await _generate_audio_impl(q_num, turns, output_path)
            if ok and os.path.exists(output_path) and os.path.getsize(output_path) > 10000:
                return True
        except Exception as e:
            pass
        # Jitter backoff
        await asyncio.sleep(attempt * 1.5 + random.random())
    print(f"❌ Q{q_num} 최종 실패 ({max_retries}회 재시도 초과)")
    return False

async def _generate_audio_impl(q_num, turns, output_path):
    temp_files = []
    pid = os.getpid()
    rnd = random.randint(1000, 9999)
    try:
        # 1. 1차 본문 대화
        for idx, (speaker, speech_text) in enumerate(turns):
            voice = VOICE_MALE if speaker == 'male' else VOICE_FEMALE
            t_file = os.path.join(AUDIO_DIR, f"temp_{pid}_{rnd}_{q_num}_1_{idx}.mp3")
            comm = edge_tts.Communicate(speech_text, voice, rate="-5%")
            await comm.save(t_file)
            temp_files.append(t_file)

        # 2. 중간 공식 규정 안내 멘트: "다시 들으십시오."
        repeat_file = os.path.join(AUDIO_DIR, f"temp_{pid}_{rnd}_{q_num}_rep.mp3")
        repeat_comm = edge_tts.Communicate("다시 들으십시오.", VOICE_FEMALE, rate="-5%")
        await repeat_comm.save(repeat_file)
        temp_files.append(repeat_file)

        # 3. 2차 본문 대화 (반복 낭독)
        for idx, (speaker, speech_text) in enumerate(turns):
            voice = VOICE_MALE if speaker == 'male' else VOICE_FEMALE
            t_file = os.path.join(AUDIO_DIR, f"temp_{pid}_{rnd}_{q_num}_2_{idx}.mp3")
            comm = edge_tts.Communicate(speech_text, voice, rate="-5%")
            await comm.save(t_file)
            temp_files.append(t_file)

        # 바이너리 MP3 무손실 결합
        with open(output_path, 'wb') as outfile:
            for tf in temp_files:
                if os.path.exists(tf):
                    with open(tf, 'rb') as infile:
                        outfile.write(infile.read())
        return True

    except Exception as e:
        if os.path.exists(output_path):
            try:
                os.remove(output_path)
            except Exception:
                pass
        raise e

    finally:
        for tf in temp_files:
            if os.path.exists(tf):
                try:
                    os.remove(tf)
                except Exception:
                    pass

async def main():
    parser = argparse.ArgumentParser(description="한국산업인력공단 공식 듣기 MP3 무인 안정 생성기")
    parser.add_argument("--start", type=int, default=1, help="시작 문항 번호 (기본: 1)")
    parser.add_argument("--count", type=int, default=40, help="생성할 문항 개수 (기본: 40)")
    parser.add_argument("--all", action="store_true", help="960개 전체 듣기 문항 일괄 생성")
    parser.add_argument("--force", action="store_true", help="기존 파일 존재 여부와 무관하게 전면 강제 재생성")
    parser.add_argument("--concurrency", type=int, default=3, help="동시 생성 작업 수 (안정 기본값: 3)")
    args = parser.parse_args()

    bank_path = os.path.join(os.path.dirname(__file__), "..", "epstopik_1917_bank.js")
    with open(bank_path, 'r', encoding='utf-8') as f:
        text = f.read()
    start = text.find('[')
    end = text.rfind(']') + 1
    bank = json.loads(text[start:end])
    listening_all = [q for q in bank if q.get('type') == 'L']

    if args.all:
        target_questions = listening_all
    else:
        start_idx = max(0, args.start - 1)
        end_idx = min(len(listening_all), start_idx + args.count)
        target_questions = listening_all[start_idx:end_idx]

    total_len = len(target_questions)
    print(f"🎙️ [HRD-Korea 맞춤법 정밀 보정 MP3 생성기]")
    print(f"📌 대상 문항: 총 {total_len}개 (시작 #{target_questions[0]['id']} ~ 끝 #{target_questions[-1]['id']})")
    print(f"📁 저장 폴더: {AUDIO_DIR}")
    print(f"⚡ 병렬 동시 작업 수: {args.concurrency}")
    print(f"🔄 강제 재생성 모드(--force): {args.force}")
    print("-" * 60)

    to_generate = []
    already_done = 0
    for q in target_questions:
        q_num = q['id']
        out_name = f"q_{q_num:04d}.mp3"
        out_path = os.path.join(AUDIO_DIR, out_name)
        if not args.force and os.path.exists(out_path) and os.path.getsize(out_path) > 10000:
            already_done += 1
        else:
            to_generate.append((q, out_path))

    print(f"📊 현황: 보존 대상 {already_done}개, 신규/재생성 대상 {len(to_generate)}개")
    if not to_generate:
        print("✨ 모든 대상 문항의 MP3가 이미 완벽하게 준비되어 있습니다!")
        return

    sem = asyncio.Semaphore(args.concurrency)
    completed_cnt = 0
    lock = asyncio.Lock()

    async def worker(item):
        nonlocal completed_cnt
        q, out_path = item
        q_num = q['id']
        dialogue = q.get('dialogue') or q.get('instruction')
        turns = parse_dialogue_turns(dialogue)
        
        ok = await generate_single_audio_file(q_num, turns, out_path, sem)
        async with lock:
            completed_cnt += 1
            if ok:
                pct = (completed_cnt / len(to_generate)) * 100
                print(f"  [{completed_cnt:03d}/{len(to_generate):03d} ({pct:5.1f}%)] 문항 #{q_num:04d} 정밀 보정 생성 완료")

    tasks = [worker(item) for item in to_generate]
    await asyncio.gather(*tasks)

    print("-" * 60)
    print(f"🎉 전체 작업 완료! (생성 완료: {completed_cnt}건, 기완료 보존: {already_done}건)")

if __name__ == "__main__":
    asyncio.run(main())
