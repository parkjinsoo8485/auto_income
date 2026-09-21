/**
 * Stroke Evaluator
 * 사용자의 터치/마우스 드래그 궤적이 목표 획과 일치하는지 판정하는 인식 엔진
 */

import type { ComposedStroke } from './stroke-composer';

export interface PointerPoint {
  x: number;
  y: number;
  t: number; // timestamp
}

export type EvalResult = 'success' | 'wrong_start' | 'wrong_direction' | 'too_short' | 'pending';

export interface EvalFeedback {
  result: EvalResult;
  coverage: number;   // 0~1, 획을 얼마나 진행했는지
  message: string;
}

const DEG_TO_RAD = Math.PI / 180;

/**
 * 드래그 경로가 목표 획과 일치하는지 판정
 * @param points 사용자 드래그 좌표 배열
 * @param targetStroke 현재 써야 할 획
 * @param viewSize SVG 뷰박스 크기 (px 기준)
 */
export function evaluateStroke(
  points: PointerPoint[],
  targetStroke: ComposedStroke,
  viewSize: number = 200,
): EvalFeedback {
  if (points.length < 2) return { result: 'pending', coverage: 0, message: '' };

  const start   = points[0];
  const [tx, ty] = targetStroke.startPoint;
  const tolerance = viewSize * 0.16; // 시작점 허용 반경 (viewSize의 16%)

  // 1. 시작점 검사
  const startDist = Math.hypot(start.x - tx, start.y - ty);
  if (startDist > tolerance) {
    return { result: 'wrong_start', coverage: 0, message: '획의 시작 위치가 다릅니다.' };
  }

  // 2. 방향 벡터 검사 (드래그 첫 30% 구간 평균 방향)
  const sampleEnd  = Math.max(1, Math.floor(points.length * 0.3));
  const endPt      = points[sampleEnd];
  const userDx     = endPt.x - start.x;
  const userDy     = endPt.y - start.y;
  const userMag    = Math.hypot(userDx, userDy);
  if (userMag < 2) return { result: 'pending', coverage: 0, message: '' };

  const [tdx, tdy]   = targetStroke.dirVector;
  const dotProduct   = (userDx / userMag) * tdx + (userDy / userMag) * tdy;
  const angleDiff    = Math.acos(Math.max(-1, Math.min(1, dotProduct))) / DEG_TO_RAD;

  if (angleDiff > 50) {
    return { result: 'wrong_direction', coverage: 0, message: '획 방향이 반대입니다.' };
  }

  // 3. 길이(커버리지) 검사 — 총 드래그 길이 vs 목표 획 길이
  let totalDriven = 0;
  for (let i = 1; i < points.length; i++) {
    totalDriven += Math.hypot(points[i].x - points[i-1].x, points[i].y - points[i-1].y);
  }
  const coverage = Math.min(1, totalDriven / targetStroke.len);

  if (coverage < 0.55) {
    return { result: 'too_short', coverage, message: '획을 끝까지 그어주세요.' };
  }

  return { result: 'success', coverage: 1, message: '✓' };
}
