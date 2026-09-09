const cp = require('child_process');
const path = require('path');
const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const url = "file:///" + path.resolve('web_simulator.html').replace(/\\/g, '/') + "#stroke";

// CDP or remote debugging to listen to console.error
const proc = cp.spawn(edge, [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  url
]);

setTimeout(async () => {
  try {
    const http = require('http');
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('TABS:', data);
        proc.kill();
      });
    }).on('error', (e) => {
      console.log('HTTP ERR:', e.message);
      proc.kill();
    });
  } catch(e) {
    console.error(e);
    proc.kill();
  }
}, 2000);
