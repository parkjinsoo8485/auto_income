#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
한국산업인력공단(HRD-Korea) 공식 EPS-TOPIK 공개문제 원본 MP3 스마트 자동 임포터
----------------------------------------------------------------------
기능:
1. [스마트 자동 탐색]: 인자 없이 그냥 실행하면 '다운로드' 폴더, '바탕화면', '현재 폴더'에서
   가장 최근에 다운로드된 EPS-TOPIK / 공개문제 듣기 ZIP 파일 또는 MP3 폴더를 스스로 찾아 자동 임포트합니다.
2. [직접 경로 지정]: 특정 ZIP 파일이나 폴더 경로를 직접 전달해도 처리합니다.
3. [자동 생성 연동]: 로컬에 파일이 전혀 없을 경우, 공식 규격 MP3를 무인 자동 생성할 수 있도록 안내 및 연계합니다.
"""

import os
import sys
import zipfile
import shutil
import re
import glob

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

TARGET_DIR = os.path.join("assets", "audio", "epstopik")
os.makedirs(TARGET_DIR, exist_ok=True)

def extract_question_number(filename):
    """
    파일명에서 문항 일련번호(1~960)를 추출
    예: '001.mp3' -> 1, 'L_0023.mp3' -> 23, 'Track 05.mp3' -> 5, '0053_듣기.mp3' -> 53
    """
    base = os.path.splitext(os.path.basename(filename))[0]
    nums = re.findall(r'\d+', base)
    if not nums:
        return None
    for n in nums:
        val = int(n)
        if 1 <= val <= 960:
            return val
    return int(nums[0])

def import_from_zip(zip_path):
    print(f"📦 ZIP 압축 파일 분석 중: {zip_path}")
    count = 0
    with zipfile.ZipFile(zip_path, 'r') as zf:
        for file_info in zf.infolist():
            if file_info.filename.lower().endswith(('.mp3', '.wav', '.ogg', '.m4a')):
                q_num = extract_question_number(file_info.filename)
                if q_num:
                    dest_name = f"q_{q_num:04d}.mp3"
                    dest_path = os.path.join(TARGET_DIR, dest_name)
                    with zf.open(file_info) as source, open(dest_path, 'wb') as target:
                        shutil.copyfileobj(source, target)
                    count += 1
                    if count % 20 == 0:
                        print(f"  -> {count}개 문항 오디오 임포트 완료...")
    print(f"✅ 총 {count}개의 공식 원본 MP3 음원이 성공적으로 연동되었습니다! (저장 위치: {TARGET_DIR})")
    return count

def import_from_directory(dir_path):
    print(f"📁 폴더 스캔 중: {dir_path}")
    count = 0
    for root, _, files in os.walk(dir_path):
        for f in files:
            if f.lower().endswith(('.mp3', '.wav', '.ogg', '.m4a')):
                q_num = extract_question_number(f)
                if q_num:
                    src_file = os.path.join(root, f)
                    dest_name = f"q_{q_num:04d}.mp3"
                    dest_path = os.path.join(TARGET_DIR, dest_name)
                    shutil.copy2(src_file, dest_path)
                    count += 1
                    if count % 20 == 0:
                        print(f"  -> {count}개 문항 오디오 임포트 완료...")
    print(f"✅ 총 {count}개의 공식 원본 MP3 음원이 성공적으로 연동되었습니다! (저장 위치: {TARGET_DIR})")
    return count

def find_candidate_files():
    """
    Downloads, Desktop, 현재 작업 디렉토리에서 관련 ZIP 또는 MP3 폴더 자동 탐색
    """
    candidates = []
    search_dirs = [
        os.path.expanduser('~/Downloads'),
        os.path.expanduser('~/Desktop'),
        os.getcwd()
    ]
    keywords = ['epstopik', 'topik', '듣기', '공개문제', 'listening', 'hrd']

    for sdir in search_dirs:
        if not os.path.exists(sdir):
            continue
        # Search ZIP files
        for f in os.listdir(sdir):
            full_path = os.path.join(sdir, f)
            lower = f.lower()
            if lower.endswith('.zip') and any(k in lower for k in keywords):
                candidates.append((os.path.getmtime(full_path), full_path))
            # Search folders containing mp3s
            elif os.path.isdir(full_path) and any(k in lower for k in keywords):
                candidates.append((os.path.getmtime(full_path), full_path))

    # Sort by newest first
    candidates.sort(key=lambda x: x[0], reverse=True)
    return [p for _, p in candidates]

if __name__ == '__main__':
    target_input = None

    if len(sys.argv) >= 2:
        target_input = sys.argv[1]
    else:
        print("🔍 [스마트 자동 탐색 모드] 다운로드 폴더 및 작업 디렉토리 스캔 중...")
        candidates = find_candidate_files()
        if candidates:
            target_input = candidates[0]
            print(f"💡 자동으로 감지된 최신 음원 파일: {target_input}")
        else:
            print("⚠️ '다운로드(Downloads)' 또는 '바탕화면' 폴더에서 EPS-TOPIK 관련 압축파일을 찾지 못했습니다.")
            print("")
            print("💡 [해결 방법 안내]")
            print("  1. 공식 사이트(epstopik.hrdkorea.or.kr)에서 다운로드한 ZIP 파일이 다른 폴더에 있다면:")
            print("     python scratch/import_official_hrd_mp3.py \"C:/경로/파일명.zip\"")
            print("")
            print("  2. 또는, 외부 다운로드 없이 전 문항(1~960번) 공식 규격 MP3를 '즉시 무인 자동 생성'하려면:")
            print("     python scratch/generate_cbt_official_audio.py --all")
            print("     (현재 1회차 문항 1~20번은 이미 생성되어 바로 청취 가능합니다!)")
            sys.exit(0)

    if os.path.isfile(target_input) and target_input.lower().endswith('.zip'):
        import_from_zip(target_input)
    elif os.path.isdir(target_input):
        import_from_directory(target_input)
    else:
        print(f"❌ 유효하지 않은 파일 또는 폴더 경로입니다: {target_input}")
