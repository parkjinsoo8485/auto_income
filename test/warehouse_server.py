import os
import json
import http.server
import socketserver
import sys
import threading
import time

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)

# 파일 쓰기 충돌 방지를 위한 전역 Lock
FILE_LOCK = threading.Lock()

TARGET_PAIRS = [
    # 1. test 디렉토리
    (os.path.join(BASE_DIR, 'hangul_150_parts_warehouse.json'), os.path.join(BASE_DIR, 'hangul_150_parts_warehouse.js')),
    # 2. 프로젝트 루트 디렉토리
    (os.path.join(ROOT_DIR, 'hangul_150_parts_warehouse.json'), os.path.join(ROOT_DIR, 'hangul_150_parts_warehouse.js'))
]

def save_warehouse_to_all_targets(wh_data):
    """test 및 루트 경로의 JSON 및 JS 파일에 안전하게 동시 영구 저장 (Thread-safe)"""
    with FILE_LOCK:
        json_str = json.dumps(wh_data, ensure_ascii=False, indent=2)
        js_content = f"""/**
 * hangul_150_parts_warehouse.js
 * 
 * 한글 153개 자소 '궁서체 부품 창고' (1차 정밀 중심선 일치 데이터베이스)
 */
(function (global) {{
  'use strict';
  global.HANGUL_150_WAREHOUSE = {json_str};
}})(typeof window !== 'undefined' ? window : global);
"""
        saved_list = []
        for json_p, js_p in TARGET_PAIRS:
            try:
                # 임시 파일 작성 후 원자적 교체 시도 (Windows 안전 쓰기)
                temp_json = json_p + f".tmp.{os.getpid()}"
                with open(temp_json, 'w', encoding='utf-8') as f:
                    f.write(json_str)
                if os.path.exists(json_p):
                    os.replace(temp_json, json_p)
                else:
                    os.rename(temp_json, json_p)

                temp_js = js_p + f".tmp.{os.getpid()}"
                with open(temp_js, 'w', encoding='utf-8') as f:
                    f.write(js_content)
                if os.path.exists(js_p):
                    os.replace(temp_js, js_p)
                else:
                    os.rename(temp_js, js_p)

                saved_list.append(json_p)
                saved_list.append(js_p)
            except Exception as e:
                # 일반 쓰기로 폴백
                try:
                    with open(json_p, 'w', encoding='utf-8') as f:
                        f.write(json_str)
                    with open(js_p, 'w', encoding='utf-8') as f:
                        f.write(js_content)
                    saved_list.append(json_p)
                    saved_list.append(js_p)
                except Exception as inner_e:
                    print(f"[경고] 파일 저장 실패 ({json_p}): {inner_e}")
        return saved_list

class WarehouseRequestHandler(http.server.SimpleHTTPRequestHandler):
    timeout = 15  # 클라이언트 소켓 무한 대기 방지

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def log_message(self, format, *args):
        # 콘솔 버퍼 지연 방지 및 간결한 로깅
        sys.stdout.write(f"[{self.log_date_time_string()}] {self.address_string()} - {format%args}\n")
        sys.stdout.flush()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/save_part':
            content_len = int(self.headers.get('Content-Length', 0))
            if content_len == 0:
                self._send_json({'success': False, 'error': 'Empty body'}, status=400)
                return
            post_body = self.rfile.read(content_len)
            try:
                payload = json.loads(post_body.decode('utf-8'))
                part_id = payload.get('id')
                part_data = payload.get('data')

                if not part_id or not part_data:
                    self._send_json({'success': False, 'error': 'id or data missing'}, status=400)
                    return

                # Load current warehouse json
                wh = None
                with FILE_LOCK:
                    for json_p, _ in TARGET_PAIRS:
                        if os.path.exists(json_p):
                            try:
                                with open(json_p, 'r', encoding='utf-8') as f:
                                    wh = json.load(f)
                                if wh and 'parts' in wh:
                                    break
                            except Exception:
                                pass

                if not wh or 'parts' not in wh:
                    wh = {'meta': {}, 'parts': {}}

                wh.setdefault('parts', {})[part_id] = part_data

                # Save to all targets
                saved_files = save_warehouse_to_all_targets(wh)

                print(f"[저장 완료] 자소 '{part_id}' {len(saved_files)}개 파일에 동시 반영됨.")
                self._send_json({
                    'success': True,
                    'id': part_id,
                    'message': f"Part '{part_id}' successfully saved to {len(saved_files)} files.",
                    'savedFiles': saved_files
                })
            except Exception as e:
                print(f"[오류] 저장 실패: {e}")
                self._send_json({'success': False, 'error': str(e)}, status=500)

        elif self.path == '/api/save_all':
            content_len = int(self.headers.get('Content-Length', 0))
            if content_len == 0:
                self._send_json({'success': False, 'error': 'Empty body'}, status=400)
                return
            post_body = self.rfile.read(content_len)
            try:
                payload = json.loads(post_body.decode('utf-8'))
                wh = payload.get('warehouse')

                if not wh or 'parts' not in wh:
                    self._send_json({'success': False, 'error': 'Invalid warehouse payload'}, status=400)
                    return

                saved_files = save_warehouse_to_all_targets(wh)

                print(f"[전체 저장 완료] 153개 부품 데이터 {len(saved_files)}개 파일에 동시 반영됨.")
                self._send_json({'success': True, 'count': len(wh['parts']), 'savedFiles': saved_files})
            except Exception as e:
                print(f"[오류] 전체 저장 실패: {e}")
                self._send_json({'success': False, 'error': str(e)}, status=500)
        else:
            self._send_json({'error': 'Not found'}, status=404)

    def translate_path(self, path):
        path_in_base = super().translate_path(path)
        if os.path.exists(path_in_base):
            return path_in_base
        # 루트 디렉토리 파일 폴백 검색
        rel = os.path.relpath(path_in_base, BASE_DIR)
        path_in_root = os.path.join(ROOT_DIR, rel)
        if os.path.exists(path_in_root):
            return path_in_root
        return path_in_base

    def do_GET(self):
        # 루트 경로(/) 요청 시 웨어하우스 에디터로 바로 연결
        if self.path in ('/', ''):
            self.send_response(302)
            self.send_header('Location', '/view_150_warehouse_gallery.html')
            self.end_headers()
            return
        if self.path == '/api/status':
            self._send_json({
                'status': 'ok',
                'server': 'ThreadedWarehouseServer',
                'syncTargets': [p[0] for p in TARGET_PAIRS]
            })
            return
        super().do_GET()

    def _send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

# 멀티스레드 소켓 서버 클래스 (요청별 독립 스레드 처리로 블로킹 방지)
class ThreadedWarehouseServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    with ThreadedWarehouseServer(("", port), WarehouseRequestHandler) as httpd:
        print(f"=======================================================")
        print(f" 한글 자소 웨어하우스 멀티스레드 고성능 서버 시작")
        print(f" - 로컬 접속 URL   : http://localhost:{port}")
        print(f" - 동시성 처리 모드: Multi-threaded (블로킹/멈춤 방지 적용)")
        print(f" - 동기화 대상     : 총 {len(TARGET_PAIRS)*2}개 파일")
        for json_p, js_p in TARGET_PAIRS:
            print(f"   * {json_p}")
            print(f"   * {js_p}")
        print(f"=======================================================")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[서버 종료]")

