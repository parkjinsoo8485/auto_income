"""
두 가지 핵심 문제를 수정:
1. precomputeFontPixels를 async로 만들어 폰트 로드 완료 후 실행
2. loadStrokeChar에서 pixelMap 캐시 무효화
3. drawHangulCanvas에서 precomputeFontPixels를 async 방식으로 호출
"""

NEW_PRECOMPUTE = '''
async function precomputeFontPixels(w, h, char) {
  // Wait for fonts to be fully loaded first
  await document.fonts.ready;
  
  const off = document.createElement('canvas');
  off.width = w; off.height = h;
  const offCtx = off.getContext('2d', { willReadFrequently: true });
  
  offCtx.clearRect(0, 0, w, h);
  offCtx.font = '230px "Nanum Myeongjo", "Noto Serif KR", serif';
  offCtx.fillStyle = 'black';
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.fillText(char, w / 2, h / 2 + 10);
  
  const imgData = offCtx.getImageData(0, 0, w, h);
  const data = imgData.data;
  
  const pixelMap = new Float32Array(w * h * 2);
  const fontAlpha = new Uint8Array(w * h);
  
  const allSegments = [];
  strokeState.strokes.forEach((st, sIdx) => {
    let totalLen = 0;
    const segs = [];
    for(let i = 0; i < st.points.length - 1; i++) {
      const p1 = {x: st.points[i].x * w, y: st.points[i].y * h};
      const p2 = {x: st.points[i+1].x * w, y: st.points[i+1].y * h};
      const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      segs.push({ p1, p2, len, accum: totalLen });
      totalLen += len;
    }
    allSegments.push({ sIdx, segs, totalLen });
  });

  for(let y = 0; y < h; y++) {
    for(let x = 0; x < w; x++) {
      const idx = (y * w + x);
      const alpha = data[idx * 4 + 3];
      fontAlpha[idx] = alpha;
      if (alpha < 30) {  // threshold to skip near-transparent pixels
        pixelMap[idx * 2] = -1;
        continue;
      }
      
      let minD2 = Infinity;
      let bestSIdx = 0;
      let bestProg = 0;
      
      for(const st of allSegments) {
        for(const seg of st.segs) {
          const dx = seg.p2.x - seg.p1.x;
          const dy = seg.p2.y - seg.p1.y;
          const l2 = dx*dx + dy*dy;
          let t = 0;
          if (l2 > 0) {
            t = ((x - seg.p1.x) * dx + (y - seg.p1.y) * dy) / l2;
            t = Math.max(0, Math.min(1, t));
          }
          const qx = seg.p1.x + t * dx;
          const qy = seg.p1.y + t * dy;
          const d2 = (x - qx)**2 + (y - qy)**2;
          
          if (d2 < minD2) {
            minD2 = d2;
            bestSIdx = st.sIdx;
            if (st.totalLen > 0) {
              bestProg = (seg.accum + t * seg.len) / st.totalLen;
            } else {
              bestProg = 0;
            }
          }
        }
      }
      pixelMap[idx * 2] = bestSIdx;
      pixelMap[idx * 2 + 1] = bestProg;
    }
  }
  strokeState.pixelMap = pixelMap;
  strokeState.fontAlpha = fontAlpha;
  strokeState.lastChar = char;
  strokeState.precomputeW = w;
  strokeState.precomputeH = h;
}

'''

NEW_DRAW_FUNC = '''function drawHangulCanvas() {
  const canvas = document.getElementById('hangul-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // 1. Grid Guidelines (十 & ✕)
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
  ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
  ctx.moveTo(0, 0); ctx.lineTo(w, h);
  ctx.moveTo(0, h); ctx.lineTo(w, 0);
  ctx.stroke();
  ctx.setLineDash([]);

  const char = strokeState.chars[strokeState.charIdx] || '가';

  if (strokeState.mode === 'watch') {
    // If pixelMap not yet ready, trigger async precompute and show loading state
    if (!strokeState.pixelMap || strokeState.lastChar !== char ||
        strokeState.precomputeW !== w || strokeState.precomputeH !== h) {
      // Draw faint char as placeholder while computing
      ctx.font = '230px "Nanum Myeongjo", "Noto Serif KR", serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(char, w / 2, h / 2 + 10);

      if (!strokeState._computing) {
        strokeState._computing = true;
        precomputeFontPixels(w, h, char).then(() => {
          strokeState._computing = false;
          drawHangulCanvas(); // re-render after computing
        });
      }
      return;
    }
    
    const imgData = new ImageData(w, h);
    const data = imgData.data;
    
    const cR = 79,  cG = 70,  cB = 229;   // #4f46e5 Indigo (completed)
    const aR = 16,  aG = 185, aB = 129;   // #10b981 Emerald (animating)
    const fR = 225, fG = 230, fB = 240;   // soft gray (pending)

    const activeIdx = strokeState.activeStrokeIdx;
    const animProg  = strokeState.animProgress;

    for (let i = 0; i < w * h; i++) {
      const alpha = strokeState.fontAlpha[i];
      if (alpha < 30) continue;
      
      const sIdx = strokeState.pixelMap[i * 2];
      const prog  = strokeState.pixelMap[i * 2 + 1];
      
      let r, g, b;
      if (sIdx < activeIdx) {
        r = cR; g = cG; b = cB;           // completed stroke → indigo
      } else if (sIdx === activeIdx && prog <= animProg) {
        r = aR; g = aG; b = aB;           // current stroke (animated portion) → green
      } else {
        r = fR; g = fG; b = fB;           // not yet drawn → gray
      }
      
      const pIdx = i * 4;
      data[pIdx]   = r;
      data[pIdx+1] = g;
      data[pIdx+2] = b;
      data[pIdx+3] = alpha;
    }
    
    // putImageData directly on main canvas
    ctx.putImageData(new ImageData(data, w, h), 0, 0);
    
  } else {
    // Practice mode — show faint font guide, then user's strokes on top
    ctx.font = '230px "Nanum Myeongjo", "Noto Serif KR", serif';
    ctx.fillStyle = '#f1f5f9';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, w / 2, h / 2 + 10);

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    strokeState.userStrokes.forEach(path => {
      if (path.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
      ctx.stroke();
    });

    if (strokeState.currentPath.length > 1) {
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 15;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(strokeState.currentPath[0].x, strokeState.currentPath[0].y);
      for (let i = 1; i < strokeState.currentPath.length; i++) ctx.lineTo(strokeState.currentPath[i].x, strokeState.currentPath[i].y);
      ctx.stroke();
    }

    if (strokeState.showGuide && strokeState.activeStrokeIdx < strokeState.strokes.length) {
      const activeSt = strokeState.strokes[strokeState.activeStrokeIdx];
      ctx.strokeStyle = 'rgba(16,185,129,0.38)';
      ctx.lineWidth = 16;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(activeSt.points[0].x * w, activeSt.points[0].y * h);
      for (let i = 1; i < activeSt.points.length; i++) ctx.lineTo(activeSt.points[i].x * w, activeSt.points[i].y * h);
      ctx.stroke();
    }
  }

  // Stroke order number badges
  if (strokeState.showGuide) {
    strokeState.strokes.forEach((st, idx) => {
      const p0 = st.points[0];
      const cx = p0.x * w;
      const cy = p0.y * h;
      const isCurrent = idx === strokeState.activeStrokeIdx;
      if (isCurrent) {
        ctx.fillStyle = 'rgba(239,68,68,0.25)';
        ctx.beginPath();
        ctx.arc(cx, cy, 15, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = isCurrent ? '#ef4444' : '#6366f1';
      ctx.beginPath();
      ctx.arc(cx, cy, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((idx + 1).toString(), cx, cy);
    });
  }
}
'''

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace precomputeFontPixels
    start1 = 'function precomputeFontPixels(w, h, char) {'
    end1 = 'function drawHangulCanvas() {'
    
    i1 = content.find(start1)
    i2 = content.find(end1, i1)
    
    if i1 == -1 or i2 == -1:
        print(f'ERROR: Could not find markers in {filepath}')
        return
    
    content = content[:i1] + NEW_PRECOMPUTE + content[i2:]
    
    # Replace drawHangulCanvas through drawPartialCanvasPath
    start2 = 'function drawHangulCanvas() {'
    end2 = 'function drawPartialCanvasPath('
    
    i3 = content.find(start2)
    i4 = content.find(end2, i3)
    
    if i3 == -1 or i4 == -1:
        print(f'ERROR: Could not find drawHangulCanvas in {filepath}')
        return
    
    content = content[:i3] + NEW_DRAW_FUNC + '\n\n' + content[i4:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'OK: Patched {filepath}')

# Also patch loadStrokeChar to clear pixelMap cache
def clear_cache_on_load(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    old = '''  strokeState.userStrokes = [];
  strokeState.currentPath = [];

  renderStrokeMode();'''
    
    new = '''  strokeState.userStrokes = [];
  strokeState.currentPath = [];
  strokeState.pixelMap = null;  // invalidate pixel map cache for new char
  strokeState.lastChar = null;
  strokeState._computing = false;

  renderStrokeMode();'''
    
    if old not in content:
        print(f'WARNING: cache clear marker not found in {filepath}')
    else:
        content = content.replace(old, new)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'OK: Cache invalidation added to {filepath}')

patch_file('index.html')
patch_file('web_simulator.html')
clear_cache_on_load('index.html')
clear_cache_on_load('web_simulator.html')
