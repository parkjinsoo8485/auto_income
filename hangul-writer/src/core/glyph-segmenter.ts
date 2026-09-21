/**
 * src/core/glyph-segmenter.ts
 * 완성형 폰트 글리프 역분해(Auto-Segmentation) 엔진
 * 11,172자 완성형 글리프 패스를 [초성 조각] + [중성 조각] + [종성 조각]으로 완전 자동 분리
 */

export interface SubpathInfo {
  d: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  cx: number;
  cy: number;
  w: number;
  h: number;
}

export interface SegmentedGlyph {
  char: string;
  cho: string;
  jung: string;
  jong: string;
  hasJong: boolean;
  vType: number; // 1: 세로, 2: 가로, 3: 복합
  choPath: string;
  jungPath: string;
  jongPaths: string[];
  jongPath: string;
  totalPath: string;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    w: number;
    h: number;
  };
}

const CHOS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNGS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONGS = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

export function parseSubpaths(pathStr: string): SubpathInfo[] {
  if (!pathStr) return [];
  const regex = /([A-Za-z])([^A-Za-z]*)/g;
  let match: RegExpExecArray | null;
  const subpaths: SubpathInfo[] = [];
  let currPts: [number, number][] = [];
  let currCmds: string[] = [];

  while ((match = regex.exec(pathStr)) !== null) {
    const cmd = match[1];
    const args = match[2];
    currCmds.push(cmd + args);

    const numMatches = args.match(/[-+]?[0-9]*\.?[0-9]+/g);
    if (numMatches) {
      for (let i = 0; i < numMatches.length; i += 2) {
        if (i + 1 < numMatches.length) {
          currPts.push([parseFloat(numMatches[i]), parseFloat(numMatches[i + 1])]);
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

export function segmentHangulGlyph(char: string, glyphPath: string): SegmentedGlyph | null {
  const code = char.charCodeAt(0);
  const S = code - 0xAC00;
  if (S < 0 || S > 11171 || !glyphPath) return null;

  const cIdx = Math.floor(S / 588);
  const jIdx = Math.floor((S % 588) / 28);
  const gIdx = S % 28;

  const cho = CHOS[cIdx];
  const jung = JUNGS[jIdx];
  const jong = JONGS[gIdx];
  const hasJong = gIdx > 0;

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

  interface ParentGroup {
    main: SubpathInfo;
    holes: SubpathInfo[];
    all: SubpathInfo[];
  }

  // 1. 외곽선과 내부 Hole 그룹화
  const parents: ParentGroup[] = [];
  const children: SubpathInfo[] = [];

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
    let bestP: ParentGroup | null = null;
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
      (bestP as ParentGroup).holes.push(c);
      (bestP as ParentGroup).all.push(c);
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
      w: m.w, h: m.h
    };
  });

  // 모음 타입 (1: 세로, 2: 가로, 3: 복합)
  let vType = 1;
  if ([8, 12, 13, 17, 18].includes(jIdx)) {
    vType = 2; // ㅗ, ㅛ, ㅜ, ㅠ, ㅡ
  } else if ([9, 10, 11, 14, 15, 16, 19].includes(jIdx)) {
    vType = 3; // ㅘ, ㅙ, ㅚ, ㅝ, ㅞ, ㅟ, ㅢ
  }

  const jongGroups: typeof groups = [];
  const jungGroups: typeof groups = [];
  let choGroups: typeof groups = [];

  // 2. 종성(받침) 분리
  const jongSplitCy = hasJong ? totalMinY + totalH * 0.45 : -9999;
  const remainingGroups: typeof groups = [];

  groups.forEach(g => {
    if (hasJong && g.cy <= jongSplitCy && g.maxY <= totalMinY + totalH * 0.55) {
      jongGroups.push(g);
    } else {
      remainingGroups.push(g);
    }
  });

  // 3. 중성(모음) 및 초성 분리
  if (vType === 1) {
    remainingGroups.forEach(g => {
      if (g.cx > totalMinX + totalW * 0.55 && g.h > totalH * 0.35) {
        jungGroups.push(g);
      } else {
        choGroups.push(g);
      }
    });
  } else if (vType === 2) {
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

  // 겹받침인 경우 X축 기준 정렬 (좌측 -> 우측)
  if (jongGroups.length > 1) {
    jongGroups.sort((a, b) => a.cx - b.cx);
  }

  const choPath = choGroups.map(g => g.d).join('');
  const jungPath = jungGroups.map(g => g.d).join('');
  const jongPaths = jongGroups.map(g => g.d);

  return {
    char,
    cho, jung, jong,
    hasJong,
    vType,
    choPath,
    jungPath,
    jongPaths,
    jongPath: jongPaths.join(''),
    totalPath: glyphPath,
    bounds: {
      minX: totalMinX, maxX: totalMaxX,
      minY: totalMinY, maxY: totalMaxY,
      w: totalW, h: totalH
    }
  };
}
