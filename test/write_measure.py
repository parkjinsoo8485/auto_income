import os
import subprocess

# Noto Sans KR 135px로 '안'을 캔버스에 그리고 픽셀 영역을 분석하는 HTML
test_html = '''<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@900&display=swap" rel="stylesheet">
</head>
<body style="background:black">
  <canvas id="cvs" width="200" height="200"></canvas>
  <script>
    document.fonts.ready.then(() => {
      const cvs = document.getElementById('cvs');
      const ctx = cvs.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.font = "900 135px 'Noto Sans KR', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('안', 100, 105);

      // 픽셀 분석
      const img = ctx.getImageData(0, 0, 200, 200);
      const data = img.data;
      let minX = 200, maxX = 0, minY = 200, maxY = 0;
      for (let y = 0; y < 200; y++) {
        for (let x = 0; x < 200; x++) {
          const a = data[(y * 200 + x) * 4 + 3];
          if (a > 30) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      console.log('TOTAL BBOX:', { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY });

      // ㅇ (상단 좌측), ㅏ (상단 우측), ㄴ (하단) 각각의 대략적인 분기
      // X = 110 기준으로 좌(ㅇ) 우(ㅏ) 분리
      let o_minX = 200, o_maxX = 0, o_minY = 200, o_maxY = 0;
      let a_minX = 200, a_maxX = 0, a_minY = 200, a_maxY = 0;
      let n_minX = 200, n_maxX = 0, n_minY = 200, n_maxY = 0;

      for (let y = 0; y < 200; y++) {
        for (let x = 0; x < 200; x++) {
          const a = data[(y * 200 + x) * 4 + 3];
          if (a > 30) {
            if (y > 115) { // ㄴ (받침)
              if (x < n_minX) n_minX = x;
              if (x > n_maxX) n_maxX = x;
              if (y < n_minY) n_minY = y;
              if (y > n_maxY) n_maxY = y;
            } else { // 상단 (ㅇ or ㅏ)
              if (x < 112) {
                if (x < o_minX) o_minX = x;
                if (x > o_maxX) o_maxX = x;
                if (y < o_minY) o_minY = y;
                if (y > o_maxY) o_maxY = y;
              } else {
                if (x < a_minX) a_minX = x;
                if (x > a_maxX) a_maxX = x;
                if (y < a_minY) a_minY = y;
                if (y > a_maxY) a_maxY = y;
              }
            }
          }
        }
      }
      const res = {
        total: { minX, maxX, minY, maxY },
        cho_o: { o_minX, o_maxX, o_minY, o_maxY },
        jung_a: { a_minX, a_maxX, a_minY, a_maxY },
        jong_n: { n_minX, n_maxX, n_minY, n_maxY }
      };
      const div = document.createElement('div');
      div.id = 'res';
      div.textContent = JSON.stringify(res);
      document.body.appendChild(div);
    });
  </script>
</body>
</html>
'''

with open('test/measure_font.html', 'w', encoding='utf-8') as f:
    f.write(test_html)

print('measure_font.html written')
