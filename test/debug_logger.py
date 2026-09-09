import subprocess
import os

edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
url = 'file:///' + os.path.abspath('web_simulator.html').replace('\\', '/') + '#stroke'

# js console logging
html_with_log = '''<!DOCTYPE html>
<html>
<body>
  <iframe id="f" src="../web_simulator.html#stroke" style="width:400px;height:800px"></iframe>
  <script>
    window.addEventListener('message', e => console.log('MSG:', e.data));
  </script>
</body>
</html>
'''
with open('test/sim_log_test.html', 'w', encoding='utf-8') as f:
    f.write(html_with_log)

test_js = '''
const cp = require('child_process');
const path = require('path');
const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const url = "file:///" + path.resolve('web_simulator.html').replace(/\\\\/g, '/') + "#stroke";

const proc = cp.spawn(edge, [
  '--headless',
  '--disable-gpu',
  '--virtual-time-budget=10000',
  '--enable-logging=stderr',
  '--v=1',
  url
]);

let out = '';
proc.stderr.on('data', d => out += d.toString());
proc.stdout.on('data', d => out += d.toString());

setTimeout(() => {
  proc.kill();
  console.log("OUTPUT LEN:", out.length);
  const lines = out.split('\\n').filter(l => l.includes('CONSOLE') || l.includes('stroke') || l.includes('Wipe'));
  console.log("FILTERED LINES:", lines.slice(-20));
}, 5000);
'''
with open('test/run_log.js', 'w', encoding='utf-8') as f:
    f.write(test_js)

print('Scripts created')
