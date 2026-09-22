/**
 * hangul_variant_dispatcher.js
 * 
 * 한글 폰트 디자인 표준 '8·4·4 벌수 시스템' (총 344개 자소) 기반 조합 디스패처
 * 11,172자 전체를 수학적으로 완벽한 344개 자소 컴포넌트로 분해 및 매핑합니다.
 * 
 * - 초성: 8벌 × 19자 = 152개
 * - 중성: 4벌 × 21자 = 84개
 * - 종성: 4벌 × 27자 = 108개
 * 총합: 344개
 */

(function (global) {
  'use strict';

  // 19 초성
  const CHOS = [
    'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ',
    'ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'
  ];

  // 21 중성
  const JUNGS = [
    'ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ',
    'ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'
  ];

  // 28 종성 (0은 종성 없음)
  const JONGS = [
    '', 'ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ',
    'ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ',
    'ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'
  ];

  // 세로 모음 인덱스: ㅏ(0), ㅐ(1), ㅑ(2), ㅒ(3), ㅓ(4), ㅔ(5), ㅕ(6), ㅖ(7), ㅣ(20)
  const VERTICAL_JUNGS = [0, 1, 2, 3, 4, 5, 6, 7, 20];
  // ㅗ 계열 가로 모음: ㅗ(8), ㅛ(12)
  const OH_JUNGS = [8, 12];
  // ㅜ 계열 가로 모음: ㅜ(13), ㅠ(17), ㅡ(18)
  const OO_JUNGS = [13, 17, 18];
  // 섞임(복합) 모음: ㅘ(9), ㅙ(10), ㅚ(11), ㅝ(14), ㅞ(15), ㅟ(16), ㅢ(19)
  const COMPOSITE_JUNGS = [9, 10, 11, 14, 15, 16, 19];

  // 복합 모음 분해 쌍 (수평 + 수직)
  const COMPOSITE_PARTS = {
    'ㅘ': { h: 'ㅗ', v: 'ㅏ' },
    'ㅙ': { h: 'ㅗ', v: 'ㅐ' },
    'ㅚ': { h: 'ㅗ', v: 'ㅣ' },
    'ㅝ': { h: 'ㅜ', v: 'ㅓ' },
    'ㅞ': { h: 'ㅜ', v: 'ㅔ' },
    'ㅟ': { h: 'ㅜ', v: 'ㅣ' },
    'ㅢ': { h: 'ㅡ', v: 'ㅣ' }
  };

  /**
   * 1. 초성 8벌 판정 (Cho Type: 1 ~ 8)
   * - Type 1: 받침 없는 세로 모음 (가, 개, 기...)
   * - Type 2: 받침 없는 ㅗ, ㅛ 가로 모음 (고, 교...)
   * - Type 3: 받침 없는 ㅜ, ㅠ, ㅡ 가로 모음 (구, 규, 그...)
   * - Type 4: 받침 없는 섞임 모음 (과, 외, 귀, 화...)
   * - Type 5: 받침 있는 세로 모음 (각, 개, 김, 닭, 값...)
   * - Type 6: 받침 있는 ㅗ, ㅛ 가로 모음 (곡, 교, 꽃, 곰...)
   * - Type 7: 받침 있는 ㅜ, ㅠ, ㅡ 가로 모음 (국, 규, 글, 문...)
   * - Type 8: 받침 있는 섞임 모음 (광, 획, 횡, 권, 꿩...)
   */
  function determineChoType(jungIndex, hasJongseong) {
    if (!hasJongseong) {
      if (VERTICAL_JUNGS.includes(jungIndex)) return 1;
      if (OH_JUNGS.includes(jungIndex)) return 2;
      if (OO_JUNGS.includes(jungIndex)) return 3;
      return 4; // COMPOSITE_JUNGS
    } else {
      if (VERTICAL_JUNGS.includes(jungIndex)) return 5;
      if (OH_JUNGS.includes(jungIndex)) return 6;
      if (OO_JUNGS.includes(jungIndex)) return 7;
      return 8; // COMPOSITE_JUNGS
    }
  }

  /**
   * 2. 중성 4벌 판정 (Jung Type: 1 ~ 4)
   * - Type 1: 받침 없는 세로 모음 (가, 개...)
   * - Type 2: 받침 있는 세로 모음 (각, 객... - 세로 길이가 짧아짐)
   * - Type 3: 받침 없는 가로/섞임 모음 (고, 구, 과, 화...)
   * - Type 4: 받침 있는 가로/섞임 모음 (곡, 국, 곽, 광...)
   */
  function determineJungType(jungIndex, hasJongseong) {
    const isVertical = VERTICAL_JUNGS.includes(jungIndex);
    if (isVertical) {
      return hasJongseong ? 2 : 1;
    } else {
      return hasJongseong ? 4 : 3;
    }
  }

  /**
   * 3. 종성 4벌 판정 (Jong Type: 1 ~ 4)
   * - Type 1: 세로 모음 아래 (각, 간, 갈, 닭, 값...)
   * - Type 2: ㅗ, ㅛ 가로 모음 아래 (곡, 곤, 꽃, 곰...)
   * - Type 3: ㅜ, ㅠ, ㅡ 가로 모음 아래 (국, 군, 글, 문...)
   * - Type 4: 섞임 모음 아래 (광, 곽, 권, 꿩, 괄...)
   */
  function determineJongType(jungIndex) {
    if (VERTICAL_JUNGS.includes(jungIndex)) return 1;
    if (OH_JUNGS.includes(jungIndex)) return 2;
    if (OO_JUNGS.includes(jungIndex)) return 3;
    return 4; // COMPOSITE_JUNGS
  }

  /**
   * 4. 음절 분해 및 8·4·4 벌수 매핑
   */
  function decompose(char) {
    if (!char) return null;
    const code = char.charCodeAt(0) - 0xAC00;
    if (code < 0 || code > 11171) {
      return {
        char,
        isHangul: false,
        cho: char,
        jung: '',
        jong: '',
        choIdx: -1,
        jungIdx: -1,
        jongIdx: -1
      };
    }

    const jongIdx = code % 28;
    const jungIdx = Math.floor((code - jongIdx) / 28) % 21;
    const choIdx = Math.floor((code - jongIdx) / 28 / 21);

    const cho = CHOS[choIdx];
    const jung = JUNGS[jungIdx];
    const jong = JONGS[jongIdx];
    const hasJong = jongIdx > 0;

    const choType = determineChoType(jungIdx, hasJong);
    const jungType = determineJungType(jungIdx, hasJong);
    const jongType = hasJong ? determineJongType(jungIdx) : null;

    return {
      char,
      isHangul: true,
      cho,
      jung,
      jong,
      choIdx,
      jungIdx,
      jongIdx,
      hasJong,
      choType,
      jungType,
      jongType
    };
  }

  /**
   * 5. 344개 컴포넌트 식별자(Variant Keys) 산출
   */
  function getVariantKeys(dec) {
    if (!dec || !dec.isHangul) {
      return [{ role: 'single', key: `Single_${dec.char}`, jamo: dec.char }];
    }

    const { cho, jung, jong, choType, jungType, jongType } = dec;
    const list = [];

    // 초성: Cho_T{1..8}_{cho} (19 × 8 = 152개)
    list.push({
      role: 'cho',
      type: choType,
      jamo: cho,
      key: `Cho_T${choType}_${cho}`
    });

    // 중성: 
    // 복합 모음인 경우 수평/수직 서브컴포넌트로 분리
    if (COMPOSITE_PARTS[jung]) {
      const parts = COMPOSITE_PARTS[jung];
      list.push({
        role: 'jung_h',
        type: jungType,
        jamo: parts.h,
        key: `Jung_T${jungType}_H_${parts.h}`
      });
      list.push({
        role: 'jung_v',
        type: jungType,
        jamo: parts.v,
        key: `Jung_T${jungType}_V_${parts.v}`
      });
    } else {
      list.push({
        role: 'jung',
        type: jungType,
        jamo: jung,
        key: `Jung_T${jungType}_${jung}`
      });
    }

    // 종성: Jong_T{1..4}_{jong} (27 × 4 = 108개)
    if (jong) {
      list.push({
        role: 'jong',
        type: jongType,
        jamo: jong,
        key: `Jong_T${jongType}_${jong}`
      });
    }

    return list;
  }

  const HangulVariantDispatcher = {
    CHOS,
    JUNGS,
    JONGS,
    determineChoType,
    determineJungType,
    determineJongType,
    decompose,
    getVariantKeys
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = HangulVariantDispatcher;
  }
  global.HangulVariantDispatcher = HangulVariantDispatcher;

})(typeof window !== 'undefined' ? window : this);
