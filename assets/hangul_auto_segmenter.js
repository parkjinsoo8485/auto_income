/**
 * assets/hangul_auto_segmenter.js
 * 완성형 폰트 글리프 역분해(Auto-Segmentation) 엔진
 * 11,172자 완성형 글리프 패스를 [초성 조각] + [중성 조각] + [종성 조각]으로 완전 자동 분리
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HangulAutoSegmenter = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {

  const CHOS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const JUNGS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
  const JONGS = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

  function decomposeChar(ch) {
    const code = ch.charCodeAt(0);
    const S = code - 0xAC00;
    if (S < 0 || S > 11171) return null;
    const cIdx = Math.floor(S / 588);
    const jIdx = Math.floor((S % 588) / 28);
    const gIdx = S % 28;
    return {
      cho: CHOS[cIdx], choIdx: cIdx,
      jung: JUNGS[jIdx], jungIdx: jIdx,
      jong: JONGS[gIdx], jongIdx: gIdx,
      hasJong: gIdx > 0
    };
  }

  function parseSubpaths(pathStr) {
    if (!pathStr) return [];
    // SVG Path 커맨드 파싱
    const regex = /([A-Za-z])([^A-Za-z]*)/g;
    let match;
    const subpaths = [];
    let currPts = [];
    let currCmds = [];

    while ((match = regex.exec(pathStr)) !== null) {
      const cmd = match[1];
      const args = match[2];
      currCmds.push(cmd + args);

      const numMatches = args.match(/[-+]?[0-9]*\.?[0-9]+/g);
      if (numMatches) {
        for (let i = 0; i < numMatches.length; i += 2) {
          if (i + 1 < numMatches.length) {
            currPts.push([parseFloat(numMatches[i]), parseFloat(numMatches[i+1])]);
          }
        }
      }

      if (cmd.toUpperCase() === 'Z') {
        if (currPts.length > 0) {
          let minX = Infinity, maxX = -Infinity;
          let minY = Infinity, maxY = -Infinity;
          for (let i = 0; i < currPts.length; i++) {
            const x = currPts[i][0];
            const y = currPts[i][1];
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
          subpaths.push({
            d: currCmds.join(''),
            minX, maxX, minY, maxY,
            cx: (minX + maxX) / 2,
            cy: (minY + maxY) / 2,
            w: maxX - minX,
            h: maxY - minY
          });
        }
        currPts = [];
        currCmds = [];
      }
    }
    return subpaths;
  }

  function segmentGlyph(char, glyphPath) {
    const dec = decomposeChar(char);
    if (!dec || !glyphPath) return null;

    const subs = parseSubpaths(glyphPath);
    if (!subs.length) return null;

    let totalMinX = Infinity, totalMaxX = -Infinity;
    let totalMinY = Infinity, totalMaxY = -Infinity;
    subs.forEach(s => {
      if (s.minX < totalMinX) totalMinX = s.minX;
      if (s.maxX > totalMaxX) totalMaxX = s.maxX;
      if (s.minY < totalMinY) totalMinY = s.minY;
      if (s.maxY > totalMaxY) totalMaxY = s.maxY;
    });
    const totalW = totalMaxX - totalMinX;
    const totalH = totalMaxY - totalMinY;

    // 1. 외곽선과 내부 구멍(Hole) 그룹화
    const parents = [];
    const children = [];

    for (let i = 0; i < subs.length; i++) {
      let isChild = false;
      for (let j = 0; j < subs.length; j++) {
        if (i !== j) {
          const s1 = subs[i];
          const s2 = subs[j];
          if (s2.minX <= s1.minX && s1.maxX <= s2.maxX &&
              s2.minY <= s1.minY && s1.maxY <= s2.maxY) {
            isChild = true;
            break;
          }
        }
      }
      if (isChild) {
        children.push(subs[i]);
      } else {
        parents.push({ main: subs[i], holes: [], all: [subs[i]] });
      }
    }

    children.forEach(c => {
      let bestP = null;
      let bestArea = Infinity;
      parents.forEach(p => {
        const s2 = p.main;
        if (s2.minX <= c.minX && c.maxX <= s2.maxX &&
            s2.minY <= c.minY && c.maxY <= s2.maxY) {
          const area = s2.w * s2.h;
          if (area < bestArea) {
            bestArea = area;
            bestP = p;
          }
        }
      });
      if (bestP) {
        bestP.holes.push(c);
        bestP.all.push(c);
      } else {
        parents.push({ main: c, holes: [], all: [c] });
      }
    });

    const groups = parents.map(p => {
      const d = p.all.map(item => item.d).join('');
      const m = p.main;
      return {
        d,
        minX: m.minX, maxX: m.maxX,
        minY: m.minY, maxY: m.maxY,
        cx: m.cx, cy: m.cy,
        w: m.w, h: m.h,
        items: p.all
      };
    });

    // 모음 타입 (1: 세로모음, 2: 가로모음, 3: 복합모음)
    let vType = 1;
    if ([8, 12, 13, 17, 18].includes(dec.jungIdx)) {
      vType = 2; // ㅗ, ㅛ, ㅜ, ㅠ, ㅡ
    } else if ([9, 10, 11, 14, 15, 16, 19].includes(dec.jungIdx)) {
      vType = 3; // ㅘ, ㅙ, ㅚ, ㅝ, ㅞ, ㅟ, ㅢ
    }

    let jongGroups = [];
    let jungGroups = [];
    let choGroups = [];

    // 2. 종성(받침) 분리
    // 종성은 글리프 하단에 위치 (중심 cy가 전체 높이의 하위 45% 이하이고 maxY가 상단 55%를 넘지 않음)
    const jongSplitCy = dec.hasJong ? totalMinY + totalH * 0.45 : -9999;
    const remainingGroups = [];

    groups.forEach(g => {
      if (dec.hasJong && g.cy <= jongSplitCy && g.maxY <= totalMinY + totalH * 0.55) {
        jongGroups.push(g);
      } else {
        remainingGroups.push(g);
      }
    });

    // 3. 중성(모음) 및 초성 분리
    if (vType === 1) {
      // 세로 모음: 우측 영역에 위치하며 세로로 긴 그룹
      remainingGroups.forEach(g => {
        if (g.cx > totalMinX + totalW * 0.55 && g.h > totalH * 0.35) {
          jungGroups.push(g);
        } else {
          choGroups.push(g);
        }
      });
    } else if (vType === 2) {
      // 가로 모음: 가로로 넓은 그룹 (w > totalW * 0.45)
      // 남은 그룹 중 y 중심이 상대적으로 아래인 가로 부재
      remainingGroups.sort((a, b) => a.cy - b.cy);
      if (remainingGroups.length >= 2) {
        const jungCand = remainingGroups.reduce((maxG, g) => {
          return (g.w > maxG.w && g.cy < totalMaxY - 100) ? g : maxG;
        }, remainingGroups[0]);
        jungGroups.push(jungCand);
        choGroups = remainingGroups.filter(g => g !== jungCand);
      } else {
        choGroups = remainingGroups;
      }
    } else {
      // 복합 모음: 우측 세로부재 + 중간 가로부재
      remainingGroups.forEach(g => {
        if (g.cx > totalMinX + totalW * 0.65 && g.h > totalH * 0.35) {
          jungGroups.push(g);
        } else if (g.cy < totalMinY + totalH * 0.60 && g.w > totalW * 0.40) {
          jungGroups.push(g);
        } else {
          choGroups.push(g);
        }
      });
    }

    // 종성 겹받침인 경우 좌측 자음 -> 우측 자음 정렬
    if (jongGroups.length > 1) {
      jongGroups.sort((a, b) => a.cx - b.cx);
    }

    // 폴백(Fallback): 만약 서브패스가 부울 합병되어 종성이 분리되지 않은 경우 (예: '꿈' 등)
    let choPath = choGroups.map(g => g.d).join('');
    let jungPath = jungGroups.map(g => g.d).join('');
    let jongPaths = jongGroups.map(g => g.d);

    return {
      char,
      dec,
      vType,
      bounds: {
        minX: totalMinX, maxX: totalMaxX,
        minY: totalMinY, maxY: totalMaxY,
        w: totalW, h: totalH
      },
      choPath,
      jungPath,
      jongPaths,
      jongPath: jongPaths.join(''),
      totalPath: glyphPath,
      counts: {
        cho: choGroups.length,
        jung: jungGroups.length,
        jong: jongGroups.length
      }
    };
  }

  return {
    decomposeChar,
    parseSubpaths,
    segmentGlyph
  };

}));
