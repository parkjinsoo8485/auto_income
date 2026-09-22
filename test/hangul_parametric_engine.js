// hangul_parametric_engine.js
// 유니코드 분석 -> 6대 모임꼴 분류 -> 파라메트릭 변환 행렬(Matrix Transformation) 적용 조립 엔진

class HangulParametricEngine {
  constructor(jamoDb) {
    this.db = jamoDb;
    
    // 모음 분류 테이블
    // 세로 모음 (Vertical vowels): ㅏ, ㅐ, ㅑ, ㅒ, ㅓ, ㅔ, ㅕ, ㅖ, ㅣ
    this.VERTICAL_JUNGS = [0, 1, 2, 3, 4, 5, 6, 7, 20];
    // 가로 모음 (Horizontal vowels): ㅗ, ㅛ, ㅜ, ㅠ, ㅡ
    this.HORIZONTAL_JUNGS = [8, 12, 13, 17, 18];
    // 섞임/복합 모음 (Mixed vowels): ㅘ, ㅙ, ㅚ, ㅝ, ㅞ, ㅟ, ㅢ
    this.MIXED_JUNGS = [9, 10, 11, 14, 15, 16, 19];
  }

  // 1. 유니코드 분해
  decompose(char) {
    const code = char.charCodeAt(0) - 0xAC00;
    if (code < 0 || code > 11171) {
      return null; // 한글 음절(가-힣) 범위 밖
    }

    const choIdx = Math.floor(code / 588);
    const jungIdx = Math.floor((code % 588) / 28);
    const jongIdx = code % 28;

    return {
      char,
      choIdx,
      jungIdx,
      jongIdx,
      hasJong: jongIdx > 0
    };
  }

  // 2. 6대 모임꼴 판별
  getLayoutType(jungIdx, hasJong) {
    if (this.VERTICAL_JUNGS.includes(jungIdx)) {
      return hasJong ? 'TYPE_2_VERT_JONG' : 'TYPE_1_VERT'; // 좌우 결합
    } else if (this.HORIZONTAL_JUNGS.includes(jungIdx)) {
      return hasJong ? 'TYPE_4_HORIZ_JONG' : 'TYPE_3_HORIZ'; // 상하 결합
    } else {
      return hasJong ? 'TYPE_6_MIXED_JONG' : 'TYPE_5_MIXED'; // 복합 결합 ('과', '광' 등)
    }
  }

  // 3. 파라메트릭 변환 행렬 (Matrix Transformation) 계산
  // 200x200 출력 캔버스 기준 (중앙 정렬 및 여백 확보)
  getTransformMatrix(layoutType, choIdx, jungIdx, jongIdx) {
    switch (layoutType) {
      // ----------------------------------------------------
      // Type 1: 초 + 세로모음 (예: 가, 나, 다) - 좌우 결합
      // ----------------------------------------------------
      case 'TYPE_1_VERT':
        return {
          typeDesc: '좌우 결합 (초:좌, 중:우)',
          cho: { tx: 18, ty: 35, sx: 0.82, sy: 1.25 },
          jung: { tx: 82, ty: 20, sx: 0.95, sy: 1.55 }
        };

      // ----------------------------------------------------
      // Type 2: 초 + 세로모음 + 종성 (예: 강, 날, 닭)
      // ----------------------------------------------------
      case 'TYPE_2_VERT_JONG':
        return {
          typeDesc: '좌우 결합 + 받침 (초:좌상, 중:우상, 종:하)',
          cho: { tx: 16, ty: 15, sx: 0.78, sy: 0.95 },
          jung: { tx: 82, ty: 12, sx: 0.95, sy: 1.10 },
          jong: { tx: 25, ty: 95, sx: 1.35, sy: 0.72 }
        };

      // ----------------------------------------------------
      // Type 3: 초 + 가로모음 (예: 고, 노, 두) - 상하 결합
      // ----------------------------------------------------
      case 'TYPE_3_HORIZ':
        return {
          typeDesc: '상하 결합 (초:상, 중:하)',
          cho: { tx: 42, ty: 18, sx: 1.15, sy: 0.82 },
          jung: { tx: 25, ty: 82, sx: 1.45, sy: 0.92 }
        };

      // ----------------------------------------------------
      // Type 4: 초 + 가로모음 + 종성 (예: 곰, 눈, 꽃)
      // ----------------------------------------------------
      case 'TYPE_4_HORIZ_JONG':
        return {
          typeDesc: '상하 결합 + 받침 (초:최상, 중:중, 종:최하)',
          cho: { tx: 42, ty: 10, sx: 1.12, sy: 0.62 },
          jung: { tx: 25, ty: 60, sx: 1.45, sy: 0.65 },
          jong: { tx: 25, ty: 98, sx: 1.40, sy: 0.68 }
        };

      // ----------------------------------------------------
      // Type 5: 초 + 섞임모음 (예: 과, 궈, 뇌) - 복합 결합
      // ----------------------------------------------------
      case 'TYPE_5_MIXED':
        return {
          typeDesc: '복합 결합 (초:좌상, 중:하+우 감쌈)',
          cho: { tx: 18, ty: 18, sx: 0.78, sy: 0.82 },
          jung: { tx: 28, ty: 35, sx: 1.42, sy: 1.35 }
        };

      // ----------------------------------------------------
      // Type 6: 초 + 섞임모음 + 종성 (예: 광, 궉, 뮝)
      // ----------------------------------------------------
      case 'TYPE_6_MIXED_JONG':
        return {
          typeDesc: '복합 결합 + 받침 (초:좌상, 중:중하+우, 종:최하)',
          cho: { tx: 18, ty: 10, sx: 0.72, sy: 0.68 },
          jung: { tx: 25, ty: 28, sx: 1.35, sy: 0.95 },
          jong: { tx: 25, ty: 98, sx: 1.35, sy: 0.68 }
        };

      default:
        return null;
    }
  }

  // 4. 문자 조립 파이프라인
  assemble(char) {
    const info = this.decompose(char);
    if (!info) return null;

    const layoutType = this.getLayoutType(info.jungIdx, info.hasJong);
    const matrix = this.getTransformMatrix(layoutType, info.choIdx, info.jungIdx, info.jongIdx);

    const choData = this.db.cho[info.choIdx];
    const jungData = this.db.jung[info.jungIdx];
    const jongData = info.hasJong ? this.db.jong[info.jongIdx] : null;

    const parts = [
      {
        role: '초성',
        char: choData.char,
        data: choData,
        matrix: matrix.cho,
        transformStr: `translate(${matrix.cho.tx}, ${matrix.cho.ty}) scale(${matrix.cho.sx}, ${matrix.cho.sy})`
      },
      {
        role: '중성',
        char: jungData.char,
        data: jungData,
        matrix: matrix.jung,
        transformStr: `translate(${matrix.jung.tx}, ${matrix.jung.ty}) scale(${matrix.jung.sx}, ${matrix.jung.sy})`
      }
    ];

    if (jongData) {
      parts.push({
        role: '종성',
        char: jongData.char,
        data: jongData,
        matrix: matrix.jong,
        transformStr: `translate(${matrix.jong.tx}, ${matrix.jong.ty}) scale(${matrix.jong.sx}, ${matrix.jong.sy})`
      });
    }

    return {
      char,
      info,
      layoutType,
      typeDesc: matrix.typeDesc,
      parts
    };
  }
}
