// Test Douglas-Peucker & Stroke Validator Algorithm
function dist(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function validateLineStroke(userPoints, targetStroke) {
  if (!userPoints || userPoints.length < 2) return { pass: false, reason: '너무 짧은 선입니다.' };

  const startPt = { x: targetStroke.pts[0][0], y: targetStroke.pts[0][1] };
  const endPt = { x: targetStroke.pts[targetStroke.pts.length - 1][0], y: targetStroke.pts[targetStroke.pts.length - 1][1] };

  const uStart = userPoints[0];
  const uEnd = userPoints[userPoints.length - 1];

  // 1. 시작점 검사
  const startDist = dist(uStart, startPt);
  if (startDist > 90) {
    return { pass: false, reason: '시작점에서부터 그어주세요. (파란색 배지 위치)' };
  }

  // 2. 끝점 검사
  const endDist = dist(uEnd, endPt);
  if (endDist > 105) {
    return { pass: false, reason: '획의 끝점까지 완전히 그어주세요.' };
  }

  // 3. 방향성 검사
  const tvx = endPt.x - startPt.x;
  const tvy = endPt.y - startPt.y;
  const uvx = uEnd.x - uStart.x;
  const uvy = uEnd.y - uStart.y;
  const tLen = Math.hypot(tvx, tvy);
  const uLen = Math.hypot(uvx, uvy);

  if (tLen > 30 && uLen > 30) {
    const dot = (tvx * uvx + tvy * uvy) / (tLen * uLen);
    if (dot < 0.4) {
      return { pass: false, reason: '올바른 방향(화살표 방향)으로 그어주세요.' };
    }
  }

  return { pass: true, reason: '완벽합니다!' };
}

function validateCircleStroke(userPoints, targetStroke) {
  if (!userPoints || userPoints.length < 8) return { pass: false, reason: '원을 둥글게 끝까지 그려주세요.' };

  const cx = targetStroke.cx;
  const cy = targetStroke.cy;
  const r = targetStroke.r;

  const uStart = userPoints[0];
  const uEnd = userPoints[userPoints.length - 1];

  // 1. 시작점이 12시 부근인가?
  const topPt = { x: cx, y: cy - r };
  if (dist(uStart, topPt) > r * 0.95) {
    return { pass: false, reason: '12시(위쪽) 꼭대기에서부터 시작해 주세요.' };
  }

  // 2. 각도 누적 (반시계 방향 검사)
  let angleSum = 0;
  for (let i = 0; i < userPoints.length - 1; i++) {
    const th1 = Math.atan2(userPoints[i].y - cy, userPoints[i].x - cx);
    const th2 = Math.atan2(userPoints[i + 1].y - cy, userPoints[i + 1].x - cx);
    let diff = th2 - th1;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    angleSum += diff;
  }

  // 훈민정음 필순: 12시에서 반시계 방향 -> diff는 음수 (-2*PI 근처)
  if (angleSum > 1.5) {
    return { pass: false, reason: '시계 방향이 아닌 [반시계 방향]으로 회전해 주세요.' };
  }

  if (Math.abs(angleSum) < Math.PI * 1.35) {
    return { pass: false, reason: '원을 한 바퀴 완전히 감아주세요.' };
  }

  // 3. 폐곡선 도달 검사
  if (dist(uStart, uEnd) > r * 1.1) {
    return { pass: false, reason: '원의 시작점과 끝점을 닫아주세요.' };
  }

  return { pass: true, reason: '완벽한 이응(ㅇ)입니다!' };
}

// Test Line Stroke
const sampleLine = { pts: [[100, 100], [400, 100], [400, 400]] };
console.log('Test valid line:', validateLineStroke([{x:105, y:95}, {x:250, y:100}, {x:395, y:102}, {x:400, y:390}], sampleLine));
console.log('Test reverse line:', validateLineStroke([{x:400, y:395}, {x:395, y:102}, {x:105, y:95}], sampleLine));

// Test Circle Stroke
const sampleCircle = { cx: 300, cy: 300, r: 100 };
// Generate simulated counter-clockwise circle
const ccwCircle = [];
for (let deg = -90; deg >= -450; deg -= 15) {
  const rad = deg * Math.PI / 180;
  ccwCircle.push({ x: 300 + 100 * Math.cos(rad), y: 300 + 100 * Math.sin(rad) });
}
console.log('Test valid CCW circle:', validateCircleStroke(ccwCircle, sampleCircle));

// Generate simulated clockwise circle (Wrong direction)
const cwCircle = [];
for (let deg = -90; deg <= 270; deg += 15) {
  const rad = deg * Math.PI / 180;
  cwCircle.push({ x: 300 + 100 * Math.cos(rad), y: 300 + 100 * Math.sin(rad) });
}
console.log('Test invalid CW circle:', validateCircleStroke(cwCircle, sampleCircle));
