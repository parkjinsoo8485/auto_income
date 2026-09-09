import subprocess
import os

html = '''<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
  <div id="logs"></div>
  <script>
    window.onerror = function(msg, url, line, col, error) {
      const p = document.createElement('div');
      p.className = 'err';
      p.textContent = 'ERROR: ' + msg + ' at ' + line + ':' + col;
      document.body.appendChild(p);
    };
  </script>
  <iframe id="ifr" src="../web_simulator.html#stroke" style="width:400px;height:700px"></iframe>
  <script>
    const ifr = document.getElementById('ifr');
    ifr.onload = function() {
      const win = ifr.contentWindow;
      const oldLog = win.console.log;
      const oldErr = win.console.error;
      win.console.log = function(...args) {
        oldLog.apply(win.console, args);
        const d = document.createElement('div');
        d.textContent = 'LOG: ' + args.join(' ');
        document.getElementById('logs').appendChild(d);
      };
      win.console.error = function(...args) {
        oldErr.apply(win.console, args);
        const d = document.createElement('div');
        d.textContent = 'ERR: ' + args.join(' ');
        document.getElementById('logs').appendChild(d);
      };
      win.onerror = function(msg, url, line, col) {
        const d = document.createElement('div');
        d.textContent = 'WIN-ERR: ' + msg + ' at ' + line;
        document.getElementById('logs').appendChild(d);
      };
    };
  </script>
</body>
</html>
'''

with open('test/debug_iframe.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
p = os.path.abspath('test/debug_iframe.html')

res = subprocess.run([
    edge, '--headless', '--disable-gpu', '--virtual-time-budget=6000', '--dump-dom',
    'file:///' + p.replace('\\', '/')
], capture_output=True, encoding='utf-8', errors='ignore')

print('DOM OUTPUT:')
for line in res.stdout.split('\n'):
  if 'LOG:' in line or 'ERR:' in line or 'WIN-ERR:' in line:
    print(line)
