"""
sync_composer.py - hangul_stroke_composer.js를 HTML 파일들에 동기화
"""
import re, os

COMPOSER_JS = os.path.join(os.path.dirname(__file__), '..', 'assets', 'hangul_stroke_composer.js')
HTML_FILES = [
    os.path.join(os.path.dirname(__file__), '..', 'web_simulator.html'),
    os.path.join(os.path.dirname(__file__), '..', 'index.html'),
]

# 시작/끝 마커 (composer JS 블록 식별)
START_MARKERS = [
    '/**\n * HangulStrokeComposer',
    '/**\r\n * HangulStrokeComposer',
    '(function(global) {',
]
END_MARKER = '})(typeof window !== \'undefined\' ? window : this);'

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def find_composer_block(html):
    """HTML에서 HangulStrokeComposer 블록의 시작/끝 위치 찾기"""
    # 시작: 주석 블록 또는 (function(global) { 찾기
    start_idx = -1
    
    # 먼저 HangulStrokeComposer 주석 헤더 찾기
    header_idx = html.find('* HangulStrokeComposer')
    if header_idx > 0:
        # 헤더 앞의 /** 찾기
        comment_start = html.rfind('/**', 0, header_idx)
        if comment_start >= 0:
            start_idx = comment_start
    
    if start_idx < 0:
        # 직접 (function(global) { 찾기
        fn_idx = html.find('(function(global) {')
        if fn_idx >= 0:
            start_idx = fn_idx

    if start_idx < 0:
        return -1, -1

    # 끝: END_MARKER 찾기
    end_idx = html.find(END_MARKER, start_idx)
    if end_idx < 0:
        return -1, -1

    end_idx += len(END_MARKER)
    return start_idx, end_idx

def sync_html(html_path, composer_content):
    print(f"\n처리 중: {os.path.basename(html_path)}")
    html = read_file(html_path)
    
    start, end = find_composer_block(html)
    if start < 0 or end < 0:
        print(f"  [WARN] HangulStrokeComposer 블록을 찾을 수 없음")
        return False
    
    old_block = html[start:end]
    old_lines = old_block.count('\n')
    print(f"  기존 블록: 줄 {start}~{end} ({old_lines}줄)")
    
    # 기존 블록을 새 컴포저 내용으로 교체
    new_html = html[:start] + composer_content + html[end:]
    write_file(html_path, new_html)
    
    new_lines = composer_content.count('\n')
    print(f"  교체 완료: {old_lines}줄 → {new_lines}줄 ✅")
    return True

if __name__ == '__main__':
    print("=== HangulStrokeComposer 동기화 ===")
    
    composer_content = read_file(COMPOSER_JS)
    print(f"소스: {os.path.basename(COMPOSER_JS)} ({len(composer_content)} bytes, {composer_content.count(chr(10))}줄)")
    
    success_count = 0
    for html_path in HTML_FILES:
        if not os.path.exists(html_path):
            print(f"  [SKIP] {os.path.basename(html_path)} 없음")
            continue
        if sync_html(html_path, composer_content):
            success_count += 1
    
    print(f"\n동기화 완료: {success_count}/{len(HTML_FILES)}개 파일")
