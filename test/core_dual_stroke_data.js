/**
 * core_dual_stroke_data.js  ── Nanum Gothic 최적화 버전 (Perfect Mapped)
 * 
 * 해결 방안 (Bleeding 완벽 차단):
 * - 각 자소(Jamo) 영역별로 Bounding Box(`clipBox`)를 정의합니다.
 * - 복잡한 획(예: 꽃의 ㅗ)은 다중 rect를 지원하도록 배열의 배열로 정의합니다.
 */

window.HANGUL_DUAL_STROKE_DATA = {

  // ════════════════════════════════════════════════════════════
  //  '꽃' (Type 5: 상·중·하)
  // ════════════════════════════════════════════════════════════
  '꽃': {
    char: '꽃', type: 5, strokeCount: 8,
    typeName: '상·중·하 3단 결합',
    viewBox: '0 0 200 200',
    strokes: [
      { id:'ggot_s1', jamo:'ㄲ(앞)', role:'cho', clipBox: [0,0,85,80], median:'M 45,30 L 70,30 L 70,60', length: 75 },
      { id:'ggot_s2', jamo:'ㄲ(뒤)', role:'cho', clipBox: [115,0,85,80], median:'M 95,30 L 120,30 L 120,60', length: 75 },
      // ㅗ는 수직 기둥(위쪽)과 수평 바(아래쪽) 2개의 rect로 클리핑
      { id:'ggot_s3', jamo:'ㅗ', role:'jung', clipBox: [[85,55,30,30], [0,75,200,45]], median:'M 100,60 L 100,85', length: 30 },
      { id:'ggot_s4', jamo:'ㅗ', role:'jung', clipBox: [[85,55,30,30], [0,75,200,45]], median:'M 30,85 L 170,85', length: 140 },
      { id:'ggot_s5', jamo:'ㅊ', role:'jong', clipBox: [0,120,200,80], median:'M 55,130 L 135,130', length: 80 },
      { id:'ggot_s6', jamo:'ㅊ', role:'jong', clipBox: [0,120,200,80], median:'M 45,155 L 145,155', length: 100 },
      { id:'ggot_s7', jamo:'ㅊ', role:'jong', clipBox: [0,120,200,80], median:'M 95,155 L 50,175', length: 56 },
      { id:'ggot_s8', jamo:'ㅊ', role:'jong', clipBox: [0,120,200,80], median:'M 95,155 L 140,175', length: 56 }
    ]
  },

  // ════════════════════════════════════════════════════════════
  //  '값' (Type 4: 세로모음 + 겹받침)
  // ════════════════════════════════════════════════════════════
  '값': {
    char: '값', type: 4, strokeCount: 9,
    typeName: '세로모음 + 겹받침 (ㅄ)',
    viewBox: '0 0 200 200',
    strokes: [
      { id:'gap_s1', jamo:'ㄱ', role:'cho', clipBox: [0,0,110,105], median:'M 40,30 L 90,30 L 75,95', length: 110 },
      { id:'gap_s2', jamo:'ㅏ', role:'jung', clipBox: [110,0,90,105], median:'M 160,25 L 160,100', length: 80 },
      { id:'gap_s3', jamo:'ㅏ', role:'jung', clipBox: [110,0,90,105], median:'M 160,55 L 185,55', length: 28 },
      { id:'gap_s4', jamo:'ㅂ', role:'jong', clipBox: [0,105,110,95], median:'M 55,115 L 55,165', length: 50 },
      { id:'gap_s5', jamo:'ㅂ', role:'jong', clipBox: [0,105,110,95], median:'M 90,115 L 90,165', length: 50 },
      { id:'gap_s6', jamo:'ㅂ', role:'jong', clipBox: [0,105,110,95], median:'M 55,130 L 90,130', length: 35 },
      { id:'gap_s7', jamo:'ㅂ', role:'jong', clipBox: [0,105,110,95], median:'M 55,160 L 90,160', length: 35 },
      { id:'gap_s8', jamo:'ㅅ', role:'jong', clipBox: [110,105,90,95], median:'M 155,115 L 120,170', length: 78 },
      { id:'gap_s9', jamo:'ㅅ', role:'jong', clipBox: [110,105,90,95], median:'M 155,115 L 185,170', length: 78 }
    ]
  },

  // ════════════════════════════════════════════════════════════
  //  '닭' (Type 4: 세로모음 + 겹받침)
  // ════════════════════════════════════════════════════════════
  '닭': {
    char: '닭', type: 4, strokeCount: 8,
    typeName: '세로모음 + 겹받침 (ㄺ)',
    viewBox: '0 0 200 200',
    strokes: [
      { id:'dak_s1', jamo:'ㄷ', role:'cho', clipBox: [0,0,110,105], median:'M 40,30 L 90,30', length: 50 },
      { id:'dak_s2', jamo:'ㄷ', role:'cho', clipBox: [0,0,110,105], median:'M 40,30 L 40,90 L 90,90', length: 110 },
      { id:'dak_s3', jamo:'ㅏ', role:'jung', clipBox: [110,0,90,105], median:'M 160,25 L 160,100', length: 80 },
      { id:'dak_s4', jamo:'ㅏ', role:'jung', clipBox: [110,0,90,105], median:'M 160,55 L 185,55', length: 28 },
      { id:'dak_s5', jamo:'ㄹ', role:'jong', clipBox: [0,105,110,95], median:'M 50,115 L 90,115 L 90,140', length: 65 },
      { id:'dak_s6', jamo:'ㄹ', role:'jong', clipBox: [0,105,110,95], median:'M 90,140 L 50,140', length: 40 },
      { id:'dak_s7', jamo:'ㄹ', role:'jong', clipBox: [0,105,110,95], median:'M 50,140 L 50,165 L 90,165', length: 65 },
      { id:'dak_s8', jamo:'ㄱ', role:'jong', clipBox: [110,105,90,95], median:'M 120,115 L 170,115 L 155,170', length: 105 }
    ]
  },

  // ════════════════════════════════════════════════════════════
  //  '가' (Type 1: 기본 세로형)
  // ════════════════════════════════════════════════════════════
  '가': {
    char: '가', type: 1, strokeCount: 3,
    typeName: '기본 세로형 (좌우)',
    viewBox: '0 0 200 200',
    strokes: [
      { id:'ga_s1', jamo:'ㄱ', role:'cho', clipBox: [0,0,110,200], median:'M 40,35 L 95,35 L 60,170', length: 180 },
      { id:'ga_s2', jamo:'ㅏ', role:'jung', clipBox: [110,0,90,200], median:'M 160,25 L 160,175', length: 150 },
      { id:'ga_s3', jamo:'ㅏ', role:'jung', clipBox: [110,0,90,200], median:'M 160,95 L 185,95', length: 30 }
    ]
  },

  // ════════════════════════════════════════════════════════════
  //  '고' (Type 2: 기본 가로형)
  // ════════════════════════════════════════════════════════════
  '고': {
    char: '고', type: 2, strokeCount: 3,
    typeName: '기본 가로형 (상하)',
    viewBox: '0 0 200 200',
    strokes: [
      { id:'go_s1', jamo:'ㄱ', role:'cho', clipBox: [0,0,200,105], median:'M 40,35 L 160,35 L 140,95', length: 185 },
      { id:'go_s2', jamo:'ㅗ', role:'jung', clipBox: [0,105,200,95], median:'M 100,105 L 100,135', length: 30 },
      { id:'go_s3', jamo:'ㅗ', role:'jung', clipBox: [0,105,200,95], median:'M 30,135 L 170,135', length: 140 }
    ]
  }
};
