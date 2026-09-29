// test/test_voronoi_logic.js
const fs = require('fs');

/**
 * 2D 점 간 거리
 */
function dist(p1, p2) {
  return Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
}

/**
 * 선분을 step 간격으로 등간격 샘플링
 */
function sampleMedian(median, step = 10) {
  if (!median || median.length === 0) return [];
  if (median.length === 1) return [[median[0][0], median[0][1]]];

  const samples = [];
  for (let i = 0; i < median.length - 1; i++) {
    const p1 = median[i];
    const p2 = median[i + 1];
    const d = dist(p1, p2);
    const count = Math.max(1, Math.ceil(d / step));
    for (let c = 0; c < count; c++) {
      const t = c / count;
      samples.push([
        p1[0] + t * (p2[0] - p1[0]),
        p1[1] + t * (p2[1] - p1[1])
      ]);
    }
  }
  const last = median[median.length - 1];
  samples.push([last[0], last[1]]);
  return samples;
}

/**
 * 선분 p1-p2와 p3-p4의 교차점 계산
 */
function lineLineIntersection(p1, p2, p3, p4) {
  const x1 = p1[0], y1 = p1[1];
  const x2 = p2[0], y2 = p2[1];
  const x3 = p3[0], y3 = p3[1];
  const x4 = p4[0], y4 = p4[1];

  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (Math.abs(denom) < 1e-6) return null; // 평행

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

  if (ua >= -0.05 && ua <= 1.05 && ub >= -0.05 && ub <= 1.05) {
    return [
      x1 + ua * (x2 - x1),
      y1 + ua * (y2 - y1)
    ];
  }
  return null;
}

/**
 * Sutherland-Hodgman 반평면 다각형 클리핑
 */
function clipPolygonByHalfPlane(poly, mx, my, nx, ny) {
  if (!poly || poly.length === 0) return [];
  const len = Math.hypot(nx, ny);
  if (len < 1e-5) return poly;
  const unx = nx / len;
  const uny = ny / len;

  function isInside(pt) {
    return unx * (pt[0] - mx) + uny * (pt[1] - my) >= -0.01;
  }

  function lineIntersect(p1, p2) {
    const d1 = unx * (p1[0] - mx) + uny * (p1[1] - my);
    const d2 = unx * (p2[0] - mx) + uny * (p2[1] - my);
    const diff = d1 - d2;
    if (Math.abs(diff) < 1e-6) return p1;
    const t = d1 / diff;
    return [
      p1[0] + t * (p2[0] - p1[0]),
      p1[1] + t * (p2[1] - p1[1])
    ];
  }

  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i];
    const prev = poly[(i + poly.length - 1) % poly.length];
    const curIn = isInside(cur);
    const prevIn = isInside(prev);

    if (curIn) {
      if (!prevIn) out.push(lineIntersect(prev, cur));
      out.push(cur);
    } else if (prevIn) {
      out.push(lineIntersect(prev, cur));
    }
  }
  return out;
}

/**
 * 고정밀 연속 선분 보로노이 분할 (만나는 지점 각이등분선 분할 포함)
 */
function computeHighPrecisionVoronoi(strokeIdx, allMedians) {
  let poly = [
    [-300, -300],
    [1324, -300],
    [1324, 1324],
    [-300, 1324]
  ];

  const curMedian = allMedians[strokeIdx];
  if (!curMedian || curMedian.length === 0 || allMedians.length <= 1) return poly;

  const curSamples = sampleMedian(curMedian, 10);

  allMedians.forEach((otherMedian, otherIdx) => {
    if (otherIdx === strokeIdx || !otherMedian || otherMedian.length === 0) return;
    const otherSamples = sampleMedian(otherMedian, 10);

    // 1. 만나는 지점(교차점 또는 최근접 접촉점) 검출 및 각이등분선 분할
    let junctionPt = null;
    let dirCur = null;
    let dirOther = null;

    // 선분 교차점 확인
    for (let i = 0; i < curMedian.length - 1; i++) {
      for (let j = 0; j < otherMedian.length - 1; j++) {
        const inter = lineLineIntersection(
          curMedian[i], curMedian[i + 1],
          otherMedian[j], otherMedian[j + 1]
        );
        if (inter) {
          junctionPt = inter;
          dirCur = [curMedian[i + 1][0] - curMedian[i][0], curMedian[i + 1][1] - curMedian[i][1]];
          dirOther = [otherMedian[j + 1][0] - otherMedian[j][0], otherMedian[j + 1][1] - otherMedian[j][1]];
          break;
        }
      }
      if (junctionPt) break;
    }

    // 선분 교차가 없으면 최근접 샘플 쌍 확인 (거리 < 15px)
    if (!junctionPt) {
      let minD = Infinity;
      let closeA = null, closeB = null;
      curSamples.forEach(pA => {
        otherSamples.forEach(pB => {
          const d = dist(pA, pB);
          if (d < minD) {
            minD = d;
            closeA = pA;
            closeB = pB;
          }
        });
      });
      if (minD < 15) {
        junctionPt = [(closeA[0] + closeB[0]) / 2, (closeA[1] + closeB[1]) / 2];
      }
    }

    // 만나는 지점이 있을 경우: 접합부 분할 평면 적용
    if (junctionPt && dirCur && dirOther) {
      const lenA = Math.hypot(dirCur[0], dirCur[1]);
      const lenB = Math.hypot(dirOther[0], dirOther[1]);
      if (lenA > 1e-4 && lenB > 1e-4) {
        const uA = [dirCur[0] / lenA, dirCur[1] / lenA];
        const uB = [dirOther[0] / lenB, dirOther[1] / lenB];
        // 각이등분선 법선: uA 쪽이 양수가 되도록 (uA - uB)
        const bisectNorm = [uA[0] - uB[0], uA[1] - uB[1]];
        const bisectLen = Math.hypot(bisectNorm[0], bisectNorm[1]);
        if (bisectLen > 0.05) {
          poly = clipPolygonByHalfPlane(poly, junctionPt[0], junctionPt[1], bisectNorm[0], bisectNorm[1]);
        }
      }
    }

    // 2. 일반 선분 샘플들에 대한 수직이등분선 클리핑
    curSamples.forEach(pA => {
      let minDist = Infinity;
      let bestB = null;
      otherSamples.forEach(pB => {
        const d = dist(pA, pB);
        if (d < minDist) {
          minDist = d;
          bestB = pB;
        }
      });

      if (bestB && minDist >= 4) {
        const mx = (pA[0] + bestB[0]) / 2;
        const my = (pA[1] + bestB[1]) / 2;
        const nx = pA[0] - bestB[0];
        const ny = pA[1] - bestB[1];
        poly = clipPolygonByHalfPlane(poly, mx, my, nx, ny);
      }
    });

    otherSamples.forEach(pB => {
      let minDist = Infinity;
      let bestA = null;
      curSamples.forEach(pA => {
        const d = dist(pA, pB);
        if (d < minDist) {
          minDist = d;
          bestA = pA;
        }
      });

      if (bestA && minDist >= 4) {
        const mx = (bestA[0] + pB[0]) / 2;
        const my = (bestA[1] + pB[1]) / 2;
        const nx = bestA[0] - pB[0];
        const ny = bestA[1] - pB[1];
        poly = clipPolygonByHalfPlane(poly, mx, my, nx, ny);
      }
    });
  });

  return poly;
}

/**
 * 만나는 지점에서 중심선 분리 (다음 획 겹침/번짐 방지)
 */
function separateJunctionMedians(medians, safetyMargin = 14) {
  if (!medians || medians.length <= 1) return medians;
  const newMedians = JSON.parse(JSON.stringify(medians));

  for (let i = 0; i < newMedians.length; i++) {
    for (let j = 0; j < newMedians.length; j++) {
      if (i === j) continue;
      const mA = newMedians[i];
      const mB = newMedians[j];
      if (mA.length < 2 || mB.length < 2) continue;

      // 케이스 1: 획 j의 시작점이 획 i의 어떤 선분과 매우 가깝거나 교차하는 경우 (T자 접합)
      const startB = mB[0];
      for (let s = 0; s < mA.length - 1; s++) {
        const p1 = mA[s];
        const p2 = mA[s + 1];
        const dx = p2[0] - p1[0];
        const dy = p2[1] - p1[1];
        const l2 = dx * dx + dy * dy;
        if (l2 < 1e-4) continue;

        let u = ((startB[0] - p1[0]) * dx + (startB[1] - p1[1]) * dy) / l2;
        u = Math.max(0, Math.min(1, u));
        const proj = [p1[0] + u * dx, p1[1] + u * dy];
        const d = dist(startB, proj);

        // 시작점이 선분에 너무 가까우면 (거리 < safetyMargin)
        // 획 B의 진행 방향(startB -> mB[1])으로 밀어내어 획 A의 굵기와 겹치지 않게 분리!
        if (d < safetyMargin) {
          const dirB = [mB[1][0] - startB[0], mB[1][1] - startB[1]];
          const dirBLen = Math.hypot(dirB[0], dirB[1]);
          if (dirBLen > 1e-4) {
            const shift = safetyMargin - d + 4;
            mB[0] = [
              Math.round(startB[0] + (dirB[0] / dirBLen) * shift),
              Math.round(startB[1] + (dirB[1] / dirBLen) * shift)
            ];
            console.log(`[Separation] Stroke ${j+1} start shifted away from Stroke ${i+1} by ${shift.toFixed(1)}px -> [${mB[0]}]`);
          }
        }
      }

      // 케이스 2: 획 i의 끝점이 획 j의 시작점이나 선분과 겹치는 경우
      const endA = mA[mA.length - 1];
      const startB2 = mB[0];
      if (dist(endA, startB2) < safetyMargin) {
        // 획 i의 마지막 점을 획 i의 역방향으로 살짝 후퇴하여 획 j 시작부 침범 방지
        const prevA = mA[mA.length - 2];
        const dirA = [endA[0] - prevA[0], endA[1] - prevA[1]];
        const dirALen = Math.hypot(dirA[0], dirA[1]);
        if (dirALen > 20) {
          const shift = Math.min(12, dirALen * 0.25);
          mA[mA.length - 1] = [
            Math.round(endA[0] - (dirA[0] / dirALen) * shift),
            Math.round(endA[1] - (dirA[1] / dirALen) * shift)
          ];
          console.log(`[Separation] Stroke ${i+1} end trimmed back by ${shift.toFixed(1)}px -> [${mA[mA.length - 1]}]`);
        }
      }
    }
  }

  return newMedians;
}

// Cho_T1_ㅅ 테스트
const warehouseRaw = fs.readFileSync('test/hangul_150_parts_warehouse.js', 'utf8');
const warehouse = JSON.parse(warehouseRaw.replace('window.HANGUL_150_WAREHOUSE = ', '').replace(/;\s*$/, '')).parts;
const siot = warehouse['Cho_T1_ㅅ'];

console.log("Original medians for Cho_T1_ㅅ:");
console.log(JSON.stringify(siot.medians));

const separated = separateJunctionMedians(siot.medians);
console.log("\nSeparated medians for Cho_T1_ㅅ:");
console.log(JSON.stringify(separated));

const poly0 = computeHighPrecisionVoronoi(0, separated);
const poly1 = computeHighPrecisionVoronoi(1, separated);

console.log(`\nVoronoi Poly 0 vertex count: ${poly0.length}`);
console.log(`Voronoi Poly 1 vertex count: ${poly1.length}`);
