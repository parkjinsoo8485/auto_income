/**
 * 한글 획순 레이아웃 진단 스크립트
 * 각 타입별 슬롯 사용률 및 시각적 균형 분석
 */
const c = require('../assets/hangul_stroke_composer.js');

const testSets = {
  'TYPE_4 세로모음+받침': ['힘', '잠', '김', '겸', '협'],
  'TYPE_5 가로모음+받침': ['봄', '문', '곰', '눈', '숲'],
  'TYPE_1 세로모음': ['나', '기', '리', '비', '미'],
  'TYPE_2 가로모음': ['고', '노', '모', '소', '보'],
  'TYPE_6 복합모음+받침': ['원', '권', '월', '환'],
};

Object.entries(testSets).forEach(([label, chars]) => {
  console.log('\n=== ' + label + ' ===');
  chars.forEach(ch => {
    const plan = c.composeStrokePlan(ch);
    let globalMinY = 999, globalMaxY = 0;
    let globalMinX = 999, globalMaxX = 0;
    
    plan.strokes.forEach(st => {
      const nums = st.d.match(/-?[\d.]+/g);
      if (!nums) return;
      const values = nums.map(Number);
      for (let i = 0; i < values.length; i++) {
        if (i % 2 === 0) { // X 좌표
          if (values[i] < globalMinX) globalMinX = values[i];
          if (values[i] > globalMaxX) globalMaxX = values[i];
        } else { // Y 좌표
          if (values[i] < globalMinY) globalMinY = values[i];
          if (values[i] > globalMaxY) globalMaxY = values[i];
        }
      }
    });
    
    const vertUsage = ((globalMaxY - globalMinY) / 200 * 100).toFixed(0);
    const horzUsage = ((globalMaxX - globalMinX) / 200 * 100).toFixed(0);
    const topPad = globalMinY.toFixed(1);
    const botPad = (200 - globalMaxY).toFixed(1);
    
    // 슬롯 정보
    const slots = plan.slots;
    const slotInfo = slots.map(s => `${s.role}[x:${s.x}~${s.x+s.w} y:${s.y}~${s.y+s.h}]`).join(' ');
    
    console.log(`  ${ch} | Y범위: ${globalMinY.toFixed(0)}~${globalMaxY.toFixed(0)} (${vertUsage}%) | X범위: ${globalMinX.toFixed(0)}~${globalMaxX.toFixed(0)} (${horzUsage}%) | 여백: 상=${topPad} 하=${botPad}`);
    console.log(`     슬롯: ${slotInfo}`);
  });
});
