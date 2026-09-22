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

    // ── 2. 가로 모음(ㅗ, ㅛ, ㅜ, ㅠ, ㅡ)의 절대 경계선 분리 ──
    if (vType === 2) {
      const hBar = groups.reduce((maxG, g) => (g.w > maxG.w ? g : maxG), groups[0]);
      const barMinY = hBar.minY;
      const barMaxY = hBar.maxY;

      jungGroups = [hBar];
      choGroups = [];
      jongGroups = [];

      groups.forEach(g => {
        if (g === hBar) return;
        if (dec.hasJong && g.maxY <= barMinY + 15) {
          jongGroups.push(g);
        } else if (g.minY >= barMaxY - 15) {
          choGroups.push(g);
        } else {
          if (g.cy > hBar.cy) {
            choGroups.push(g);
          } else {
            if (dec.hasJong) jongGroups.push(g);
            else jungGroups.push(g);
          }
        }
      });

    // ── 3. 세로 모음(ㅏ, ㅐ, ㅑ, ㅒ, ㅓ, ㅔ, ㅕ, ㅖ, ㅣ)의 절대 경계선 분리 ──
    } else if (vType === 1) {
      const nonJung = [];
      groups.forEach(g => {
        if (g.cx > totalMinX + totalW * 0.50 && g.maxY > totalMinY + totalH * 0.60) {
          jungGroups.push(g);
        } else {
          nonJung.push(g);
        }
      });

      if (dec.hasJong) {
        const jongSplitCy = totalMinY + totalH * 0.45;
        nonJung.forEach(g => {
          if (g.cy <= jongSplitCy && g.maxY <= totalMinY + totalH * 0.55) {
            jongGroups.push(g);
          } else {
            choGroups.push(g);
          }
        });
      } else {
        choGroups = nonJung;
      }

    // ── 4. 복합 모음(ㅘ, ㅙ, ㅚ, ㅝ, ㅞ, ㅟ, ㅢ) 분리 ──
    } else {
      const nonJung = [];
      groups.forEach(g => {
        if (g.cx > totalMinX + totalW * 0.60 && g.maxY > totalMinY + totalH * 0.60) {
          jungGroups.push(g);
        } else if (g.cx > totalMinX + totalW * 0.25 &&
                   g.cy > totalMinY + totalH * 0.25 &&
                   g.cy < totalMinY + totalH * 0.65 &&
                   g.w > totalW * 0.42) {
          jungGroups.push(g);
        } else {
          nonJung.push(g);
        }
      });

      if (dec.hasJong) {
        const jongSplitCy = totalMinY + totalH * 0.40;
        nonJung.forEach(g => {
          if (g.cy <= jongSplitCy && g.maxY <= totalMinY + totalH * 0.50) {
            jongGroups.push(g);
          } else {
            choGroups.push(g);
          }
        });
      } else {
        choGroups = nonJung;
      }
    }

    // 4. 특수 케이스: 폰트 외곽선에서 중성('ㅜ'/'ㅠ')과 종성('ㅁ'/'ㄹ'/'ㅂ' 등)이 물리적으로 합쳐진 경우
    let isUnified = false;
    let unifiedPath = '';
    let splitYRatio = 0.58;

    if (dec.hasJong && jongGroups.length === 0) {
      for (let jg of jungGroups) {
        if (jg.minY <= totalMinY + 50 && jg.h >= totalH * 0.45) {
          isUnified = true;
          unifiedPath = jg.d;
          splitYRatio = 0.58;
          break;
        }
      }
    }

    // 종성 겹받침인 경우 좌측 자음 -> 우측 자음 정렬
    if (jongGroups.length > 1) {
      jongGroups.sort((a, b) => a.cx - b.cx);
    }

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
      isUnifiedJungJong: isUnified,
      unifiedPath: unifiedPath,
      splitYRatio: splitYRatio,
      counts: {
        cho: choGroups.length,
        jung: jungGroups.length,
        jong: isUnified ? 1 : jongGroups.length
      }
    };
  }

  return {
    decomposeChar,
    parseSubpaths,
    segmentGlyph
  };

}));
