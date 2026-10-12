import os
import urllib.request
import urllib.parse
import ssl
import zipfile
import shutil
import io
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

BASE_URL = "https://eps.hrdkorea.or.kr/epstopik/eps_klt/upload/"
TARGET_SET_DIR = os.path.join("assets", "audio", "epstopik", "official_full_sets")
os.makedirs(TARGET_SET_DIR, exist_ok=True)

# 2차 개정판 960문항 전체 공식 MP3 (40문항 단위 묶음 24세트)
ARCHIVES = [
    "01-40.zip", "41-80.zip", "81-120.zip", "121-160.zip", "161-200.zip", "201-240.zip",
    "241-280.zip", "281-320.zip", "321-360.zip", "361-400.zip", "401-440.zip", "441-480.zip",
    "481-520.zip", "521-560.zip", "561-600.zip", "601-640.zip", "641-680.zip", "681-720.zip",
    "721-760.zip", "761-800.zip", "801-840.zip", "841-880.zip", "881-920.zip", "921-960.zip"
]

def download_and_extract_all(limit=None):
    targets = ARCHIVES[:limit] if limit else ARCHIVES
    print(f"🎙️ 한국산업인력공단 2차 개정판 전 문항(1~960번) 공식 통 원본 MP3 다운로드 시작 (총 {len(targets)}세트)")
    print(f"📁 저장 대상: {TARGET_SET_DIR}\n")

    success_cnt = 0
    for idx, arc in enumerate(targets, 1):
        url = BASE_URL + arc
        print(f"[{idx:02d}/{len(targets):02d}] 다운로드 중: {arc} ...", end=" ", flush=True)
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, context=ctx, timeout=30) as res:
                data = res.read()
            
            with zipfile.ZipFile(io.BytesIO(data)) as zf:
                for fname in zf.namelist():
                    if fname.lower().endswith(('.mp3', '.wma')):
                        out_path = os.path.join(TARGET_SET_DIR, os.path.basename(fname))
                        with zf.open(fname) as src, open(out_path, 'wb') as dst:
                            shutil.copyfileobj(src, dst)
                        print(f"✅ {fname} ({os.path.getsize(out_path):,} bytes)")
            success_cnt += 1
        except Exception as e:
            print(f"❌ 실패: {e}")

    print("-" * 60)
    print(f"🎉 한국산업인력공단 공식 원음 {success_cnt}개 세트 다운로드 및 배치 완료!")

if __name__ == "__main__":
    download_and_extract_all(limit=6) # 1~240번 6개 세트 우선 다운로드
