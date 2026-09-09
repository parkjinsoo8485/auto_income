import subprocess
import time
import urllib.request
import json
import asyncio

edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('web_simulator.html').replace('\\', '/') + '#stroke'

proc = subprocess.Popen([
    edge, '--headless', '--disable-gpu', '--remote-debugging-port=9333', url
])

try:
    time.sleep(1.5)
    with urllib.request.urlopen('http://127.0.0.1:9333/json') as response:
        tabs = json.loads(response.read().decode())
        print('Available tabs:', len(tabs))
        ws_url = tabs[0].get('webSocketDebuggerUrl')
        print('WebSocket URL:', ws_url)
finally:
    proc.kill()
