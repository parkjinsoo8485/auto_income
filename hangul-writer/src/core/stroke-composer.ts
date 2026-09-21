/**
 * Stroke Composer
 * 음절을 입력받아 합성된 획순 계획(StrokePlan)을 생성하는 합성 엔진
 */

import {
  decomposeSyllable,
  getLayoutSlots,
  transformPath,
  estimatePathLength,
  getStrokeStartAndAngle,
  DOUBLE_JONGSEONG,
  COMPOSITE_VOWELS,
  type HangulDecomposition,
  type LayoutSlot,
} from './hangul-decomposer';
import { STROKE_DB } from './stroke-db';

export interface ComposedStroke {
  jamo: string;
  role: string;
  desc: string;
  d: string;          // 변환된 SVG path (200x200 좌표계)
  rawD: string;       // 원본 path (0~100 좌표계)
  len: number;        // 경로 길이 (dasharray 용)
  bx: number;         // 획순 번호 배지 X
  by: number;         // 획순 번호 배지 Y
  angle: number;      // 획 시작 방향각 (도)
  strokeIndex: number; // 전체 획순 인덱스 (1부터)
  startPoint: [number, number]; // 필기 인식용 시작점 [x,y]
  dirVector: [number, number];  // 필기 인식용 방향 벡터
}

export interface StrokePlan {
  char: string;
  dec: HangulDecomposition;
  slots: LayoutSlot[];
  strokes: ComposedStroke[];
}

/**
 * 음절 획순 계획 합성기
 * - 슬롯 레이아웃 계산 → 뼈대 선 좌표 변환 → 배지 위치 de-overlap → 방향벡터 산출
 */
export function composeStrokePlan(char: string): StrokePlan {
  const dec   = decomposeSyllable(char);
  const slots = getLayoutSlots(dec);
  const plan: ComposedStroke[] = [];
  let strokeIndex = 1;

  slots.forEach((slot) => {
    // 겹받침 분해
    let jamoList: string[] = [slot.jamo];
    if (DOUBLE_JONGSEONG[slot.jamo]) {
      jamoList = DOUBLE_JONGSEONG[slot.jamo] as string[];
    }

    jamoList.forEach((j, subIdx) => {
      let sx = slot.x, sy = slot.y, sw = slot.w, sh = slot.h;
      if (jamoList.length > 1) {
        sw = slot.w * 0.48;
        sx = subIdx === 0 ? slot.x : slot.x + slot.w * 0.52;
      }

      // 복합모음 가로 파트(ㅗ,ㅜ)의 특수 획 오버라이드
      let rawStrokes = STROKE_DB[j] ?? [];
      if (slot.role === 'jung_h') {
        if (j === 'ㅗ') rawStrokes = [
          { d: 'M 48,6 L 48,92',   desc: '1획: 세로' },
          { d: 'M 6,92 L 100,92',  desc: '2획: 가로' },
        ];
        if (j === 'ㅜ') rawStrokes = [
          { d: 'M 6,8 L 100,8',    desc: '1획: 가로' },
          { d: 'M 48,8 L 48,94',   desc: '2획: 세로' },
        ];
      }
      if (slot.role === 'jung_v') {
        if (j === 'ㅓ') rawStrokes = [
          { d: 'M 8,70 L 46,70',   desc: '1획: 가로' },
          { d: 'M 46,4 L 46,98',   desc: '2획: 세로' },
        ];
        if (j === 'ㅔ') rawStrokes = [
          { d: 'M 22,70 L 56,70',  desc: '1획: 가로' },
          { d: 'M 56,8 L 56,94',   desc: '2획: 왼 세로' },
          { d: 'M 80,4 L 80,98',   desc: '3획: 오른 세로' },
        ];
      }

      rawStrokes.forEach((st) => {
        const transformed = transformPath(st.d, sx, sy, sw, sh);
        const len         = estimatePathLength(transformed);
        const { bx, by, angle } = getStrokeStartAndAngle(transformed);

        // 방향벡터 (정규화)
        const rad = angle * (Math.PI / 180);
        const dirVector: [number, number] = [Math.cos(rad), Math.sin(rad)];

        plan.push({
          jamo: j,
          role: slot.role,
          desc: st.desc,
          d: transformed,
          rawD: st.d,
          len,
          bx, by, angle,
          strokeIndex,
          startPoint: [bx, by],
          dirVector,
        });
        strokeIndex++;
      });
    });
  });

  // 배지 번호 위치 de-overlap
  for (let i = 0; i < plan.length; i++) {
    for (let j = 0; j < i; j++) {
      const dx   = plan[i].bx - plan[j].bx;
      const dy   = plan[i].by - plan[j].by;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 18) {
        const rad   = plan[i].angle * (Math.PI / 180);
        const shift = (18 - dist) + 6;
        plan[i].bx  = Math.round(plan[i].bx + Math.cos(rad) * shift);
        plan[i].by  = Math.round(plan[i].by + Math.sin(rad) * shift);
      }
    }
  }

  return { char, dec, slots, strokes: plan };
}
