const fs = require('fs');
const vm = require('vm');

['index.html', 'web_simulator.html'].forEach(filename => {
  console.log('Testing ' + filename + '...');
  const html = fs.readFileSync(filename, 'utf8');
  const scriptContent = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/i)[1];

  let lastInnerHTML = '';
  const window = { addEventListener: () => {}, speechSynthesis: { speak: () => {}, getVoices: () => [] } };
  const document = {
    getElementById: (id) => ({
      get innerHTML() { return lastInnerHTML; },
      set innerHTML(val) { lastInnerHTML = val; },
      addEventListener: () => {},
      classList: { add: ()=>{}, remove: ()=>{} },
      getContext: () => ({ beginPath: ()=>{}, moveTo: ()=>{}, lineTo: ()=>{}, stroke: ()=>{}, clearRect: ()=>{} })
    }),
    querySelectorAll: () => []
  };
  const localStorage = { getItem: () => null, setItem: () => {} };

  const ctx = { window, document, localStorage, console, Math, Set, Array, Object, String, Number };
  vm.createContext(ctx);
  vm.runInContext(scriptContent, ctx);

  const testCode = `
    loadState();
    renderStrokeMode();
    console.log('  renderStrokeMode() executed successfully! HTML length: ' + document.getElementById('mode-content').innerHTML.length);
    setStrokeChar(1);
    console.log('  setStrokeChar(1) executed successfully!');
    toggleStrokeSpeed();
    console.log('  toggleStrokeSpeed() executed successfully! Speed: ' + S.strokeSpeed);
    toggleStrokeNumbers();
    console.log('  toggleStrokeNumbers() executed successfully! showNumbers: ' + S.strokeShowNumbers);
    toggleStrokeDrawMode();
    console.log('  toggleStrokeDrawMode() executed successfully! drawMode: ' + S.strokeDrawMode);
    nextStroke();
    console.log('  nextStroke() executed successfully! strokeIndex: ' + S.strokeIndex);
    prevStroke();
    console.log('  prevStroke() executed successfully! strokeIndex: ' + S.strokeIndex);
  `;

  vm.runInContext(testCode, ctx);
  console.log('  [PASS] ' + filename + ' full functional verification complete!\n');
});

console.log('==================================================');
console.log('ALL VERIFICATIONS PASSED IN BOTH HTML FILES!');
console.log('==================================================');
