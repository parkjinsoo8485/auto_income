/**
 * Hangul Unicode Decomposer
 * 유니코드 수학식 기반 한글 음절 분해 및 6대 조판 슬롯 계산 엔진
 */

// ── 자모 목록 ──
export const CHOSEONG_LIST = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
export const JUNGSEONG_LIST = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
export const JONGSEONG_LIST = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

const HANGUL_BASE = 0xAC00;
const HANGUL_END  = 0xD7A3;

// 겹받침 분해 테이블
export const DOUBLE_JONGSEONG: Record<string, [string, string]> = {
  'ㄳ': ['ㄱ','ㅅ'], 'ㄵ': ['ㄴ','ㅈ'], 'ㄶ': ['ㄴ','ㅎ'],
  'ㄺ': ['ㄹ','ㄱ'], 'ㄻ': ['ㄹ','ㅁ'], 'ㄼ': ['ㄹ','ㅂ'],
  'ㄽ': ['ㄹ','ㅅ'], 'ㄾ': ['ㄹ','ㅌ'], 'ㄿ': ['ㄹ','ㅍ'],
  'ㅀ': ['ㄹ','ㅎ'], 'ㅄ': ['ㅂ','ㅅ'],
};

// 복합모음 분해 테이블
export const COMPOSITE_VOWELS: Record<string, [string, string]> = {
  'ㅘ': ['ㅗ','ㅏ'], 'ㅙ': ['ㅗ','ㅐ'], 'ㅚ': ['ㅗ','ㅣ'],
  'ㅝ': ['ㅜ','ㅓ'], 'ㅞ': ['ㅜ','ㅔ'], 'ㅟ': ['ㅜ','ㅣ'],
  'ㅢ': ['ㅡ','ㅣ'],
};

export type SyllableType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface HangulDecomposition {
  char: string;
  choseong: string;
  jungseong: string;
  jongseong: string | null;
  choIdx: number;
  jungIdx: number;
  jongIdx: number;
  hasBatchim: boolean;
  isHangul: boolean;
}

export interface LayoutSlot {
  jamo: string;
  role: 'cho' | 'jung' | 'jung_h' | 'jung_v' | 'jong' | 'single';
  x: number;
  y: number;
  w: number;
  h: number;
  type: SyllableType;
}

/** 유니코드 수학식으로 한글 음절 분해 */
export function decomposeSyllable(char: string): HangulDecomposition {
  const code = char.charCodeAt(0);
  if (code < HANGUL_BASE || code > HANGUL_END) {
    return {
      char, choseong: char, jungseong: '', jongseong: null,
      choIdx: -1, jungIdx: -1, jongIdx: 0,
      hasBatchim: false, isHangul: false,
    };
  }
  const sylIdx   = code - HANGUL_BASE;
  const jongIdx  = sylIdx % 28;
  const jungIdx  = Math.floor((sylIdx - jongIdx) / 28) % 21;
  const choIdx   = Math.floor((sylIdx - jongIdx) / 28 / 21);

  return {
    char,
    choseong:  CHOSEONG_LIST[choIdx],
    jungseong: JUNGSEONG_LIST[jungIdx],
    jongseong: jongIdx > 0 ? JONGSEONG_LIST[jongIdx] : null,
    choIdx, jungIdx, jongIdx,
    hasBatchim: jongIdx > 0,
    isHangul: true,
  };
}

/** 음절 유형 판별 (6대 유형) */
export function getSyllableType(dec: HangulDecomposition): SyllableType {
  if (!dec.isHangul) return 0;
  // 세로 모음 인덱스: ㅏ(0) ㅐ(1) ㅑ(2) ㅒ(3) ㅓ(4) ㅔ(5) ㅕ(6) ㅖ(7) ㅣ(20)
  const isVert  = [0,1,2,3,4,5,6,7,20].includes(dec.jungIdx);
  // 가로 모음 인덱스: ㅗ(8) ㅛ(12) ㅜ(13) ㅠ(17) ㅡ(18)
  const isHoriz = [8,12,13,17,18].includes(dec.jungIdx);
  const hasJong = dec.hasBatchim;

  if (isVert)  return hasJong ? 4 : 1;
  if (isHoriz) return hasJong ? 5 : 2;
  return hasJong ? 6 : 3; // 복합모음
}

/** 6대 음절 구조별 레이아웃 슬롯 계산 (200x200 viewBox 기준) */
export function getLayoutSlots(dec: HangulDecomposition): LayoutSlot[] {
  const type = getSyllableType(dec);
  const { choseong: cho, jungseong: jung, jongseong: jong, jungIdx } = dec;
  const slots: LayoutSlot[] = [];

  switch (type) {
    case 1: { // 초성(좌) + 세로모음(우) — 받침 없음
      const isDouble = [1,3,5,7].includes(jungIdx); // ㅐ ㅒ ㅔ ㅖ
      slots.push({ jamo: cho,  role: 'cho',  x: 20, y: 22, w: isDouble ? 88 : 92,  h: 156, type });
      slots.push({ jamo: jung, role: 'jung', x: isDouble ? 92 : 82, y: 16, w: isDouble ? 88 : 85, h: 168, type });
      break;
    }
    case 2: { // 초성(상) + 가로모음(하) — 받침 없음
      const isDown = jungIdx === 13 || jungIdx === 17; // ㅜ ㅠ
      slots.push({ jamo: cho,  role: 'cho',  x: 24, y: 20, w: 152, h: isDown ? 84 : 84, type });
      slots.push({ jamo: jung, role: 'jung', x: 22, y: isDown ? 100 : 104, w: 156, h: isDown ? 52 : 48, type });
      break;
    }
    case 3: { // 초성(좌상) + 복합모음(우·하) — 받침 없음
      const [subH, subV] = COMPOSITE_VOWELS[jung] || ['ㅡ','ㅣ'];
      if (subV === 'ㅣ') { // ㅚ ㅟ ㅢ
        slots.push({ jamo: cho,  role: 'cho',    x: 32, y: 24, w: 86,  h: 86,  type });
        slots.push({ jamo: subH, role: 'jung_h', x: 24, y: 104, w: 108, h: 42, type });
        slots.push({ jamo: subV, role: 'jung_v', x: 91, y: 24, w: 76,  h: 152, type });
      } else { // ㅘ ㅙ ㅝ ㅞ
        slots.push({ jamo: cho,  role: 'cho',    x: 32, y: 24, w: 86,  h: 86,  type });
        slots.push({ jamo: subH, role: 'jung_h', x: 24, y: 104, w: 104, h: 42, type });
        slots.push({ jamo: subV, role: 'jung_v', x: 82, y: 24, w: 85,  h: 152, type });
      }
      break;
    }
    case 4: { // 초성(좌상) + 세로모음(우상) + 종성(하) — 받침 있음
      const isDouble = [1,3,5,7].includes(jungIdx);
      slots.push({ jamo: cho,  role: 'cho',  x: 24, y: 22, w: isDouble ? 88 : 82, h: 80, type });
      slots.push({ jamo: jung, role: 'jung', x: isDouble ? 90 : 82, y: 16, w: isDouble ? 88 : 85, h: 92, type });
      slots.push({ jamo: jong!, role: 'jong', x: 34, y: 114, w: 132, h: 66, type });
      break;
    }
    case 5: { // 초성(상) + 가로모음(중) + 종성(하) — 받침 있음
      const isDown = jungIdx === 13 || jungIdx === 17;
      slots.push({ jamo: cho,  role: 'cho',  x: 38, y: 16,  w: 124, h: isDown ? 56 : 52, type });
      slots.push({ jamo: jung, role: 'jung', x: 24, y: isDown ? 76 : 70, w: 152, h: 42, type });
      slots.push({ jamo: jong!, role: 'jong', x: 34, y: 116, w: 132, h: 64, type });
      break;
    }
    case 6: { // 초성(좌상) + 복합모음(우·중) + 종성(하) — 받침 있음
      const [subH, subV] = COMPOSITE_VOWELS[jung] || ['ㅡ','ㅣ'];
      if (subV === 'ㅣ') { // ㅚ ㅟ ㅢ + 받침
        slots.push({ jamo: cho,  role: 'cho',    x: 28, y: 16,  w: 84,  h: 52, type });
        slots.push({ jamo: subH, role: 'jung_h', x: 22, y: 68,  w: 112, h: 34, type });
        slots.push({ jamo: subV, role: 'jung_v', x: 91, y: 14,  w: 76,  h: 94, type });
        slots.push({ jamo: jong!, role: 'jong',   x: 28, y: 116, w: 144, h: 68, type });
      } else { // ㅘ ㅙ ㅝ ㅞ + 받침
        slots.push({ jamo: cho,  role: 'cho',    x: 24, y: 16,  w: 84,  h: 52, type });
        slots.push({ jamo: subH, role: 'jung_h', x: 20, y: 68,  w: 98,  h: 34, type });
        slots.push({ jamo: subV, role: 'jung_v', x: 82, y: 14,  w: 85,  h: 94, type });
        slots.push({ jamo: jong!, role: 'jong',   x: 28, y: 116, w: 144, h: 68, type });
      }
      break;
    }
    default: { // 단독 자모
      slots.push({ jamo: cho, role: 'single', x: 28, y: 28, w: 144, h: 144, type: 0 });
    }
  }
  return slots;
}

/** 뼈대 선 좌표를 슬롯(x,y,w,h)에 맞게 변환 (0~100 → 슬롯 절대 좌표) */
export function transformPath(d: string, sx: number, sy: number, sw: number, sh: number): string {
  let isX = true;
  return d.replace(/[+-]?\d+\.?\d*/g, (num) => {
    const val = parseFloat(num);
    const res = isX
      ? (sx + (val / 100) * sw).toFixed(1)
      : (sy + (val / 100) * sh).toFixed(1);
    isX = !isX;
    return res;
  });
}

/** 경로 길이 추정 (stroke-dasharray 산출용) */
export function estimatePathLength(d: string): number {
  const nums = d.replace(/[MCLZAmclza]/g, ' ').trim().split(/[\s,]+/).filter(Boolean).map(Number);
  let len = 0;
  for (let i = 2; i < nums.length - 1; i += 2) {
    const dx = nums[i] - nums[i - 2];
    const dy = nums[i + 1] - nums[i - 1];
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return Math.max(Math.round(len * 1.08), 65);
}

/** 획 시작점과 방향각 추출 */
export function getStrokeStartAndAngle(d: string): { bx: number; by: number; angle: number } {
  const nums = d.replace(/[MCLZAmclza]/g, ' ').trim().split(/[\s,]+/).filter(Boolean).map(Number);
  const bx = nums[0] ?? 100;
  const by = nums[1] ?? 100;
  const nx = nums[2] !== undefined ? nums[2] : bx + 10;
  const ny = nums[3] !== undefined ? nums[3] : by;
  const angle = Math.atan2(ny - by, nx - bx) * (180 / Math.PI);
  return { bx, by, angle };
}
