import re

new_draw_func = """function drawHangulCanvas() {
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
  const fontStr = '230px "Nanum Myeongjo", "Noto Serif KR", serif';
  const textYOffset = 10;

  // 2. Faint Outline Guide (Beautiful Font Background)
  ctx.font = fontStr;
  ctx.fillStyle = '#f1f5f9';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(char, w / 2, h / 2 + textYOffset);

  // Helper for masking font with stroke path
  function drawMaskedFont(color, drawMaskCallback) {
    const off = document.createElement('canvas');
    off.width = w; off.height = h;
    const offCtx = off.getContext('2d');
    
    // Draw the mask (geometric path)
    offCtx.lineCap = 'round';
    offCtx.lineJoin = 'round';
    drawMaskCallback(offCtx);
    
    // Fill mask with the font using source-in
    offCtx.globalCompositeOperation = 'source-in';
    offCtx.font = fontStr;
    offCtx.fillStyle = color;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText(char, w / 2, h / 2 + textYOffset);
    
    // Draw back to main
    ctx.drawImage(off, 0, 0);
  }

  // 3. Render Completed or Animating Strokes
  if (strokeState.mode === 'watch') {
    // Completed strokes (Indigo/Purple)
    drawMaskedFont('#4f46e5', (offCtx) => {
      offCtx.strokeStyle = 'black';
      offCtx.lineWidth = 45; // Thick enough to cover font strokes
      for (let s = 0; s < strokeState.activeStrokeIdx && s < strokeState.strokes.length; s++) {
        const st = strokeState.strokes[s];
        offCtx.beginPath();
        offCtx.moveTo(st.points[0].x * w, st.points[0].y * h);
        for (let i = 1; i < st.points.length; i++) offCtx.lineTo(st.points[i].x * w, st.points[i].y * h);
        offCtx.stroke();
      }
    });

    // Active Animating Stroke (Emerald Green)
    if (strokeState.activeStrokeIdx < strokeState.strokes.length && strokeState.animProgress > 0) {
      drawMaskedFont('#10b981', (offCtx) => {
        const activeSt = strokeState.strokes[strokeState.activeStrokeIdx];
        offCtx.strokeStyle = 'black';
        offCtx.lineWidth = 45;
        drawPartialCanvasPath(offCtx, activeSt.points, w, h, strokeState.animProgress);
      });
    }
  } else {
    // Practice mode completed user paths
    drawMaskedFont('#0f172a', (offCtx) => {
      offCtx.strokeStyle = 'black';
      offCtx.lineWidth = 45;
      strokeState.userStrokes.forEach(path => {
        if (path.length < 2) return;
        offCtx.beginPath();
        offCtx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) offCtx.lineTo(path[i].x, path[i].y);
        offCtx.stroke();
      });
    });

    // Current drawing path
    if (strokeState.currentPath.length > 1) {
      drawMaskedFont('#4f46e5', (offCtx) => {
        offCtx.strokeStyle = 'black';
        offCtx.lineWidth = 45;
        offCtx.beginPath();
        offCtx.moveTo(strokeState.currentPath[0].x, strokeState.currentPath[0].y);
        for (let i = 1; i < strokeState.currentPath.length; i++) offCtx.lineTo(strokeState.currentPath[i].x, strokeState.currentPath[i].y);
        offCtx.stroke();
      });
    }

    // Practice Hint Highlight
    if (strokeState.showGuide && strokeState.activeStrokeIdx < strokeState.strokes.length) {
      drawMaskedFont('rgba(16,185,129,0.38)', (offCtx) => {
        const activeSt = strokeState.strokes[strokeState.activeStrokeIdx];
        offCtx.strokeStyle = 'black';
        offCtx.lineWidth = 45;
        offCtx.beginPath();
        offCtx.moveTo(activeSt.points[0].x * w, activeSt.points[0].y * h);
        for (let i = 1; i < activeSt.points.length; i++) offCtx.lineTo(activeSt.points[i].x * w, activeSt.points[i].y * h);
        offCtx.stroke();
      });
    }
  }

  // 4. Draw Stroke Order Numbers & Direction Markers
  if (strokeState.showGuide) {
    strokeState.strokes.forEach((st, idx) => {
      const p0 = st.points[0];
      const cx = p0.x * w;
      const cy = p0.y * h;
      const isCurrent = idx === strokeState.activeStrokeIdx;

      // Outer glow/shadow for current stroke
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
"""

def replace_draw_func(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    start_str = "function drawHangulCanvas() {"
    end_str = "function drawPartialCanvasPath(ctx, pts, w, h, progress) {"
    
    start_idx = content.find(start_str)
    if start_idx == -1: return
    
    end_idx = content.find(end_str, start_idx)
    if end_idx == -1: return
    
    # We replace from start_idx up to the start of drawPartialCanvasPath
    new_content = content[:start_idx] + new_draw_func + "\n\n" + content[end_idx:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Patched", filepath)

replace_draw_func('index.html')
replace_draw_func('web_simulator.html')
