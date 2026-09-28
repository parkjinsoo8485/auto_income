import os
import json
import http.server
import socketserver
import sys

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE_DIR, 'hangul_150_parts_warehouse.json')
JS_PATH = os.path.join(BASE_DIR, 'hangul_150_parts_warehouse.js')

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

                # Load current warehouse json
                if os.path.exists(JSON_PATH):
                    with open(JSON_PATH, 'r', encoding='utf-8') as f:
                        wh = json.load(f)
                else:
                    wh = {'meta': {}, 'parts': {}}

                wh.setdefault('parts', {})[part_id] = part_data

                # Save JSON
                with open(JSON_PATH, 'w', encoding='utf-8') as f:
                    json.dump(wh, f, ensure_ascii=False, indent=2)

                # Save JS
                with open(JS_PATH, 'w', encoding='utf-8') as f:
                    f.write(f"window.HANGUL_150_WAREHOUSE = {json.dumps(wh, ensure_ascii=False, indent=2)};\n")

                print(f"[저장 완료] 자소 '{part_id}' 파일에 영구 반영됨.")
                self._send_json({'success': True, 'id': part_id, 'message': f"Part '{part_id}' successfully saved to files."})
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

                # Save JSON
                with open(JSON_PATH, 'w', encoding='utf-8') as f:
                    json.dump(wh, f, ensure_ascii=False, indent=2)

                # Save JS
                with open(JS_PATH, 'w', encoding='utf-8') as f:
                    f.write(f"window.HANGUL_150_WAREHOUSE = {json.dumps(wh, ensure_ascii=False, indent=2)};\n")

                print(f"[전체 저장 완료] 153개 부품 데이터 파일에 영구 반영됨.")
                self._send_json({'success': True, 'count': len(wh['parts'])})
            except Exception as e:
                print(f"[오류] 전체 저장 실패: {e}")
                self._send_json({'success': False, 'error': str(e)}, status=500)
        else:
            self._send_json({'error': 'Not found'}, status=404)

    def do_GET(self):
        if self.path == '/api/status':
            self._send_json({'status': 'ok', 'server': 'WarehouseServer', 'jsonPath': JSON_PATH})
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
    # allow address reuse
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), WarehouseRequestHandler) as httpd:
        print(f"=======================================================")
        print(f" 한글 자소 웨어하우스 에디터 서버 시작: http://localhost:{port}")
        print(f" 저장 파일 대상:")
        print(f"   - {JSON_PATH}")
        print(f"   - {JS_PATH}")
        print(f"=======================================================")
        httpd.serve_forever()
