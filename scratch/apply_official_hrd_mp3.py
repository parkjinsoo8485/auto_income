import os
import shutil
import re
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

TARGET_DIR = os.path.join("assets", "audio", "epstopik")
EXTRACT_DIR = os.path.join("assets", "audio", "temp_official_hrd")
os.makedirs(TARGET_DIR, exist_ok=True)

def apply_hrd_mp3():
    applied = 0
    # Search all extracted mp3 files
    for root, _, files in os.walk(EXTRACT_DIR):
        for f in files:
            if not f.lower().endswith('.mp3'):
                continue
            
            src_path = os.path.join(root, f)
            # Find question number from name: e.g., '21-T.mp3', '21T.mp3'
            m = re.match(r'^(\d+)[-_]?T\.mp3$', f, re.IGNORECASE)
            if m:
                exam_q_num = int(m.group(1)) # 21 ~ 40
                
                # 1. Map to exact number q_0021.mp3 ~ q_0040.mp3
                dest_exact = os.path.join(TARGET_DIR, f"q_{exam_q_num:04d}.mp3")
                shutil.copy2(src_path, dest_exact)
                print(f"✅ [공단 오리지널 원음 연동] {f} -> q_{exam_q_num:04d}.mp3 ({os.path.getsize(dest_exact):,} bytes)")

                # 2. Also map to CBT 1회차 listening 1~20 (EPS-TOPIK 규격: 21~40번이 듣기 1~20번에 해당)
                if 21 <= exam_q_num <= 40:
                    cbt_listen_num = exam_q_num - 20 # 1 ~ 20
                    dest_cbt = os.path.join(TARGET_DIR, f"q_{cbt_listen_num:04d}.mp3")
                    shutil.copy2(src_path, dest_cbt)
                    print(f"   ↳ CBT 1회차 듣기 {cbt_listen_num}번 문항({dest_cbt})에도 공식 원음 매핑 완료!")
                applied += 1

    print(f"\n🎉 총 {applied}개의 한국산업인력공단 실제 성우 오리지널 MP3 음원이 교체 및 연동되었습니다!")

if __name__ == "__main__":
    apply_hrd_mp3()
