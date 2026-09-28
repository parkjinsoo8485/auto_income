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
      { id:'ggot_s1', jamo:'ㄲ(앞)', role:'cho', clipBox: [0,0,85,75], median:'M 42,32 L 72,32 L 72,62', length: 75 },
      { id:'ggot_s2', jamo:'ㄲ(뒤)', role:'cho', clipBox: [115,0,85,75], median:'M 98,32 L 128,32 L 128,62', length: 75 },
      // ㅗ는 수직 기둥(위쪽)과 수평 바(아래쪽) 2개의 rect로 클리핑
      { id:'ggot_s3', jamo:'ㅗ', role:'jung', clipBox: [[85,55,30,30], [0,75,200,45]], median:'M 100,58 L 100,86', length: 28 },
      { id:'ggot_s4', jamo:'ㅗ', role:'jung', clipBox: [[85,55,30,30], [0,75,200,45]], median:'M 28,86 L 172,86', length: 144 },
      // ㅊ: 1획 상단 짧은 가로, 2획 본 가로, 3획 좌측 빗침, 4획 우측 빗침
      { id:'ggot_s5', jamo:'ㅊ', role:'jong', clipBox: [0,115,200,85], median:'M 82,122 L 118,122', length: 36 },
      { id:'ggot_s6', jamo:'ㅊ', role:'jong', clipBox: [0,115,200,85], median:'M 42,142 L 158,142', length: 116 },
      { id:'ggot_s7', jamo:'ㅊ', role:'jong', clipBox: [0,115,200,85], median:'M 100,142 L 52,176', length: 59 },
      { id:'ggot_s8', jamo:'ㅊ', role:'jong', clipBox: [0,115,200,85], median:'M 100,142 L 148,176', length: 59 }
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
      { id:'gap_s1', jamo:'ㄱ', role:'cho', clipBox: [0,0,105,105], median:'M 36,32 L 88,32 L 72,96', length: 108 },
      { id:'gap_s2', jamo:'ㅏ', role:'jung', clipBox: [105,0,95,105], median:'M 152,24 L 152,100', length: 76 },
      { id:'gap_s3', jamo:'ㅏ', role:'jung', clipBox: [105,0,95,105], median:'M 152,56 L 180,56', length: 28 },
      { id:'gap_s4', jamo:'ㅂ', role:'jong', clipBox: [0,105,105,95], median:'M 42,118 L 42,168', length: 50 },
      { id:'gap_s5', jamo:'ㅂ', role:'jong', clipBox: [0,105,105,95], median:'M 82,118 L 82,168', length: 50 },
      { id:'gap_s6', jamo:'ㅂ', role:'jong', clipBox: [0,105,105,95], median:'M 42,138 L 82,138', length: 40 },
      { id:'gap_s7', jamo:'ㅂ', role:'jong', clipBox: [0,105,105,95], median:'M 42,166 L 82,166', length: 40 },
      { id:'gap_s8', jamo:'ㅅ', role:'jong', clipBox: [105,105,95,95], median:'M 148,118 L 116,170', length: 72 },
      { id:'gap_s9', jamo:'ㅅ', role:'jong', clipBox: [105,105,95,95], median:'M 148,118 L 178,170', length: 72 }
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
      { id:'dak_s1', jamo:'ㄷ', role:'cho', clipBox: [0,0,105,105], median:'M 38,32 L 88,32', length: 50 },
      { id:'dak_s2', jamo:'ㄷ', role:'cho', clipBox: [0,0,105,105], median:'M 40,32 L 40,92 L 88,92', length: 108 },
      { id:'dak_s3', jamo:'ㅏ', role:'jung', clipBox: [105,0,95,105], median:'M 152,24 L 152,100', length: 76 },
      { id:'dak_s4', jamo:'ㅏ', role:'jung', clipBox: [105,0,95,105], median:'M 152,56 L 180,56', length: 28 },
      { id:'dak_s5', jamo:'ㄹ', role:'jong', clipBox: [0,105,105,95], median:'M 42,118 L 80,118 L 80,140', length: 60 },
      { id:'dak_s6', jamo:'ㄹ', role:'jong', clipBox: [0,105,105,95], median:'M 80,140 L 42,140', length: 38 },
      { id:'dak_s7', jamo:'ㄹ', role:'jong', clipBox: [0,105,105,95], median:'M 42,140 L 42,166 L 80,166', length: 64 },
      { id:'dak_s8', jamo:'ㄱ', role:'jong', clipBox: [105,105,95,95], median:'M 118,118 L 168,118 L 152,170', length: 102 }
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
      { id:'ga_s1', jamo:'ㄱ', role:'cho', clipBox: [0,0,110,200], median:'M 38,36 L 96,36 L 62,170', length: 178 },
      { id:'ga_s2', jamo:'ㅏ', role:'jung', clipBox: [110,0,90,200], median:'M 154,24 L 154,176', length: 152 },
      { id:'ga_s3', jamo:'ㅏ', role:'jung', clipBox: [110,0,90,200], median:'M 154,96 L 182,96', length: 28 }
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
      { id:'go_s1', jamo:'ㄱ', role:'cho', clipBox: [0,0,200,100], median:'M 38,36 L 162,36 L 140,96', length: 184 },
      { id:'go_s2', jamo:'ㅗ', role:'jung', clipBox: [0,100,200,100], median:'M 100,98 L 100,136', length: 38 },
      { id:'go_s3', jamo:'ㅗ', role:'jung', clipBox: [0,100,200,100], median:'M 28,136 L 172,136', length: 144 }
    ]
  }
};
