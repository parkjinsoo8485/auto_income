import os, subprocess

# Let's create a test script that renders with the new balanced layout slots
composer_test = """
// Balanced Layout Slots for Hangul (200x200 viewBox)
function getLayoutSlots(dec) {
  if (!dec.isHangul && !dec.jung) {
    if (COMPOSITE_VOWELS[dec.cho]) {
      const [subH, subV] = COMPOSITE_VOWELS[dec.cho];
      return [
        { jamo: subH, role: 'jung_h', x: 18, y: 98, w: 100, h: 44, type: 3 },
        { jamo: subV, role: 'jung_v', x: 128, y: 14, w: 58, h: 172, type: 3 }
      ];
    }
    return [{ jamo: dec.cho, role: 'single', x: 26, y: 24, w: 148, h: 148, type: 0 }];
  }

  const { cho, jung, jong, jungIdx } = dec;
  const hasJong = !!jong;

  const isVert = [0, 1, 2, 3, 4, 5, 6, 7, 20].includes(jungIdx);
  const isHoriz = [8, 12, 13, 17, 18].includes(jungIdx);

  const slots = [];

  if (isVert) {
    if (!hasJong) {
      // [Type 1] 받침 없는 세로 모음 (가, 나, 다...)
      // 초성(좌측) x: 20~104, y: 20~176 / 중성(우측) x: 116~184, y: 14~186
      slots.push({ jamo: cho, role: 'cho', x: 20, y: 22, w: 84, h: 154, type: 1 });
      slots.push({ jamo: jung, role: 'jung', x: 116, y: 14, w: 68, h: 172, type: 1 });
    } else {
      // [Type 4] 받침 있는 세로 모음 (강, 날, 밥...)
      // 상좌: 초성(x:20~102, y:16~94) / 상우: 중성(x:114~182, y:14~96) / 하단: 종성(x:26~174, y:108~184)
      slots.push({ jamo: cho, role: 'cho', x: 20, y: 16, w: 82, h: 78, type: 4 });
      slots.push({ jamo: jung, role: 'jung', x: 114, y: 14, w: 68, h: 82, type: 4 });
      slots.push({ jamo: jong, role: 'jong', x: 26, y: 108, w: 148, h: 76, type: 4 });
    }
  } else if (isHoriz) {
    if (!hasJong) {
      // [Type 2] 받침 없는 가로 모음 (고, 노, 도...)
      // 상단: 초성(x:32~168, y:18~94) / 하단: 중성(x:22~178, y:104~176)
      slots.push({ jamo: cho, role: 'cho', x: 32, y: 18, w: 136, h: 76, type: 2 });
      slots.push({ jamo: jung, role: 'jung', x: 22, y: 104, w: 156, h: 72, type: 2 });
    } else {
      // [Type 5] 받침 있는 가로 모음 (곰, 문, 물...)
      // 3단 구조: 초성(y:14~68, h:54) / 중성(y:76~116, h:40) / 종성(y:126~184, h:58)
      slots.push({ jamo: cho, role: 'cho', x: 30, y: 14, w: 140, h: 54, type: 5 });
      slots.push({ jamo: jung, role: 'jung', x: 22, y: 76, w: 156, h: 40, type: 5 });
      slots.push({ jamo: jong, role: 'jong', x: 30, y: 126, w: 140, h: 58, type: 5 });
    }
  } else {
    // 복합 모음: ㅘ, ㅙ, ㅚ, ㅝ, ㅞ, ㅟ, ㅢ
    const [subH, subV] = COMPOSITE_VOWELS[jung] || ['ㅡ','ㅣ'];
    if (!hasJong) {
      // [Type 3] 받침 없는 복합 모음 (화, 과, 귀...)
      // 초성: 좌상단(x:18~114, y:16~94, w:96, h:78) -> 당당하고 안정적인 크기
      // 중성 가로(ㅗ): 좌중단(x:16~118, y:102~146, w:102, h:44) -> 35px 단정한 기둥, 절대 바닥으로 쏠리지 않음!
      // 중성 세로(ㅏ): 우측전체(x:128~184, y:14~186, w:56, h:172) -> 시원한 세로 기둥
      slots.push({ jamo: cho, role: 'cho', x: 18, y: 16, w: 96, h: 78, type: 3 });
      slots.push({ jamo: subH, role: 'jung_h', x: 16, y: 102, w: 102, h: 44, type: 3 });
      slots.push({ jamo: subV, role: 'jung_v', x: 128, y: 14, w: 56, h: 172, type: 3 });
    } else {
      // [Type 6] 받침 있는 복합 모음 (환, 광, 권...)
      // 4단 조판: 초성(y:14~66, h:52) / 가로모음(y:74~108, h:34) / 세로모음(y:14~110, h:96) / 종성(y:122~184, h:62)
      slots.push({ jamo: cho, role: 'cho', x: 18, y: 14, w: 94, h: 52, type: 6 });
      slots.push({ jamo: subH, role: 'jung_h', x: 16, y: 74, w: 98, h: 34, type: 6 });
      slots.push({ jamo: subV, role: 'jung_v', x: 126, y: 14, w: 56, h: 96, type: 6 });
      slots.push({ jamo: jong, role: 'jong', x: 26, y: 122, w: 148, h: 62, type: 6 });
    }
  }

  return slots;
}
"""
print("Definition ready.")
