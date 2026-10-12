import os
import glob
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

audio_dir = "assets/audio/epstopik"
missing = []
corrupted = []
valid = 0

for i in range(1, 961):
    fname = f"q_{i:04d}.mp3"
    fpath = os.path.join(audio_dir, fname)
    if not os.path.exists(fpath):
        missing.append(fname)
    else:
        sz = os.path.getsize(fpath)
        if sz < 10000:
            corrupted.append((fname, sz))
        else:
            valid += 1

print(f"=== 전수 검사 결과 (총 960문항) ===")
print(f"✅ 완벽 정상 MP3 음원: {valid}개 / 960개 ({(valid/960)*100:.1f}%)")
print(f"❌ 누락된 파일: {len(missing)}개")
print(f"⚠️ 비정상/손상 파일: {len(corrupted)}개")

if missing:
    print("누락 목록 샘플:", missing[:5])
if corrupted:
    print("손상 목록 샘플:", corrupted[:5])
