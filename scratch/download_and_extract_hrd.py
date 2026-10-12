import urllib.request
import urllib.parse
import ssl
import os
import zipfile
import shutil

if os.name == 'nt':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

BASE_URL = "https://epstopik.hrdkorea.or.kr"
TEMP_DIR = os.path.join("assets", "audio", "temp_official_hrd")
TARGET_DIR = os.path.join("assets", "audio", "epstopik")
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(TARGET_DIR, exist_ok=True)

FILES = [
    "/epstopik/eps_klt/듣기문제 오디오 파일.zip",
    "/epstopik/eps_klt/5. 공개문항(일상생활 10문항) 듣기음원 파일.zip"
]

def download_and_extract(rel_path):
    encoded_rel = urllib.parse.quote(rel_path)
    full_url = BASE_URL + encoded_rel
    filename = os.path.basename(rel_path)
    local_zip = os.path.join(TEMP_DIR, filename)

    print(f"📥 다운로드 중: {filename} ({full_url})")
    req = urllib.request.Request(full_url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://epstopik.hrdkorea.or.kr/epstopik/book/pub/publicWorkBookList.do?lang=ko'
    })

    with urllib.request.urlopen(req, context=ctx, timeout=30) as res, open(local_zip, 'wb') as out_f:
        shutil.copyfileobj(res, out_f)

    file_size = os.path.getsize(local_zip)
    print(f"✅ 다운로드 완료: {filename} ({file_size:,} bytes)")

    extract_folder = os.path.join(TEMP_DIR, os.path.splitext(filename)[0])
    os.makedirs(extract_folder, exist_ok=True)

    print(f"📦 압축 해제 중: {local_zip}")
    extracted_files = []
    with zipfile.ZipFile(local_zip, 'r') as zf:
        for info in zf.infolist():
            try:
                # Handle CP949 filename encoding in Korean zip files
                orig_name = info.filename.encode('cp437').decode('cp949', errors='ignore')
            except Exception:
                orig_name = info.filename
            
            # Extract
            source = zf.open(info)
            dest_path = os.path.join(extract_folder, os.path.basename(orig_name))
            if not info.is_dir() and dest_path:
                with open(dest_path, 'wb') as target:
                    shutil.copyfileobj(source, target)
                extracted_files.append((orig_name, dest_path, os.path.getsize(dest_path)))

    print(f"🎉 압축 해제 완료: 총 {len(extracted_files)}개 파일")
    for name, p, s in extracted_files:
        print(f"   - {name} ({s:,} bytes)")
    return extracted_files

def main():
    all_files = []
    for f in FILES:
        try:
            res = download_and_extract(f)
            all_files.extend(res)
        except Exception as e:
            print(f"❌ {f} 처리 중 오류: {e}")

if __name__ == "__main__":
    main()
