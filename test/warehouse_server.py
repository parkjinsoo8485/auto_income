import os
import json
import http.server
import socketserver
import sys

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)

TARGET_PAIRS = [
    # 1. test 디렉토리
    (os.path.join(BASE_DIR, 'hangul_150_parts_warehouse.json'), os.path.join(BASE_DIR, 'hangul_150_parts_warehouse.js')),
    # 2. 프로젝트 루트 디렉토리
    (os.path.join(ROOT_DIR, 'hangul_150_parts_warehouse.json'), os.path.join(ROOT_DIR, 'hangul_150_parts_warehouse.js'))
]

def save_warehouse_to_all_targets(wh_data):
    """test 및 루트 경로의 JSON 및 JS 파일에 동시 영구 저장"""
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
            with open(json_p, 'w', encoding='utf-8') as f:
                f.write(json_str)
            with open(js_p, 'w', encoding='utf-8') as f:
                f.write(js_content)
            saved_list.append(json_p)
            saved_list.append(js_p)
        except Exception as e:
            print(f"[경고] 파일 저장 실패 ({json_p}): {e}")
    return saved_list

class WarehouseRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

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
            post_body = self.rfile.read(content_len)
            try:
                payload = json.loads(post_body.decode('utf-8'))
                part_id = payload.get('id')
                part_data = payload.get('data')

                if not part_id or not part_data:
                    self._send_json({'success': False, 'error': 'id or data missing'}, status=400)
                    return

                # Load current warehouse json (우선 test, 없으면 root)
                wh = None
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

    def do_GET(self):
        if self.path == '/api/status':
            self._send_json({
                'status': 'ok',
                'server': 'WarehouseServer',
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

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), WarehouseRequestHandler) as httpd:
        print(f"=======================================================")
        print(f" 한글 자소 웨어하우스 에디터 서버 시작: http://localhost:{port}")
        print(f" 동기화 저장 대상 (총 {len(TARGET_PAIRS)*2}개 파일):")
        for json_p, js_p in TARGET_PAIRS:
            print(f"   - {json_p}")
            print(f"   - {js_p}")
        print(f"=======================================================")
        httpd.serve_forever()
