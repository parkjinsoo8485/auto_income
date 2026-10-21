/**
 * hangul_bongseo_engine.js
 * 
 * 조선 궁중 서간 봉서체(鳳書體) & 정통 궁서체(宮書體) 절차적 벡터 모필 획순 엔진
 * (Hangul Procedural Vector Brush & Calligraphy Stroke Engine)
 * 
 * - 회봉 돈필(回鋒頓筆) 마감의 중후한 큰붓 봉서체(Bongseo) 2D 폴리곤 엔벨로프
 * - 45° 역입 기필(逆入起筆) 및 중봉 탄력의 정통 궁서체(Gungseo)
 * - 0~100 정규화 자소 분해 및 최적 자간/여백 절차적 배치 솔버
 * - 번호 배지 충돌 회피 알고리즘 & 순차 애니메이션 클리핑 렌더러
 */

(function (global) {
  'use strict';

const STYLE_PRESETS = {
    gungseo: {
        name: '정통 궁서체 (宮書體)',
        desc: '정통 궁서체: 45° 사선 역입 기필과 잘록한 중봉 탄력, 전절 돈필 어깨, 예리한 침필·발필의 궁중 모필 서체',
        baseRadius: 3.30, nibAngleDeg: -44, pressureContrast: 1.35, hvRatio: 0.84, archCurve: 1.00, upwardTilt: 1.00, aspectX: 1.00, slant: 0.00, roughness: 0.0, capStyle: 'gungseo', inkColor: '#151311'
    },
    batang: {
        name: '바탕·명조체 (Batang)',
        desc: '바탕·명조체: 수평·수직의 반듯한 골격 위에 가로획은 극세(極細), 세로획은 굵게 대비시키고 삼각 세리프 돌기를 세운 인쇄 명조체',
        baseRadius: 2.95, nibAngleDeg: -38, pressureContrast: 0.55, hvRatio: 0.50, archCurve: 0.15, upwardTilt: 0.00, aspectX: 0.98, slant: 0.00, roughness: 0.0, capStyle: 'serif', inkColor: '#151311'
    },
    malgun: {
        name: '맑은 고딕 (Malgun Gothic)',
        desc: '맑은 고딕: 기울기나 필압 변화 없이 완전 수평·수직 직교 골격과 직각 방필 마감으로 떨어지는 현대 본문 고딕체',
        baseRadius: 3.05, nibAngleDeg: 0, pressureContrast: 0.00, hvRatio: 0.94, archCurve: 0.00, upwardTilt: 0.00, aspectX: 0.98, slant: 0.00, roughness: 0.0, capStyle: 'square', inkColor: '#151311'
    },
    gulim: {
        name: '굴림체 (Gulim)',
        desc: '굴림체: 반듯한 수평·수직 골격과 균일한 두께, 부드러운 반원형 끝마감(원필)을 지닌 산세리프 서체',
        baseRadius: 2.90, nibAngleDeg: 0, pressureContrast: 0.00, hvRatio: 0.98, archCurve: 0.10, upwardTilt: 0.00, aspectX: 1.04, slant: 0.00, roughness: 0.0, capStyle: 'round', inkColor: '#151311'
    },
    dotum: {
        name: '돋움체 (Dotum)',
        desc: '돋움체: 직선적이고 강직한 골격과 칼로 자른 듯한 직각 마감, 시원한 자폭을 지닌 정통 고딕 서체',
        baseRadius: 3.25, nibAngleDeg: 0, pressureContrast: 0.00, hvRatio: 0.90, archCurve: 0.00, upwardTilt: 0.00, aspectX: 1.02, slant: 0.00, roughness: 0.0, capStyle: 'square', inkColor: '#151311'
    },
    panbon: {
        name: '판본체 (훈민정음 해례본체)',
        desc: '판본체(고체): 훈민정음 해례본의 기하학적 수평·수직 대칭과 필압 변화 없는 둥근 중봉 원필(圓筆) 서체',
        baseRadius: 3.55, nibAngleDeg: 0, pressureContrast: 0.00, hvRatio: 1.00, archCurve: 0.00, upwardTilt: 0.00, aspectX: 1.06, slant: 0.00, roughness: 0.0, capStyle: 'round', inkColor: '#151311'
    },
    haengseo: {
        name: '행서·흘림체 (行書體)',
        desc: '행서·흘림체: 강한 우상향 필세와 유려한 곡선 탄력, 날렵한 노출봉 침필이 살아있는 흘림 모필 서체',
        baseRadius: 2.95, nibAngleDeg: -34, pressureContrast: 1.55, hvRatio: 0.88, archCurve: 1.45, upwardTilt: 1.65, aspectX: 0.95, slant: -0.13, roughness: 0.2, capStyle: 'sharp', inkColor: '#1b2838'
    },
    bongseo: {
        name: '봉서체 (중후한 큰붓)',
        desc: '봉서체: 먹을 듬뿍 머금은 큰 붓으로 묵직하게 눌러 써서 획 끝을 가늘게 빼지 않고 도톰한 회봉 돈필(回鋒頓筆)로 맺는 서체',
        baseRadius: 4.25, nibAngleDeg: -45, pressureContrast: 0.72, hvRatio: 0.95, archCurve: 0.85, upwardTilt: 0.80, aspectX: 1.02, slant: 0.00, roughness: 0.0, capStyle: 'bongseo', inkColor: '#151311'
    },
    calli: {
        name: '현대 캘리그라피',
        desc: '현대 캘리그라피: 극단적인 굵기 대비와 역동적인 곡률, 거친 갈필(비백) 붓결 질감을 강조한 예술 서체',
        baseRadius: 3.50, nibAngleDeg: -52, pressureContrast: 1.80, hvRatio: 0.78, archCurve: 1.50, upwardTilt: 1.50, aspectX: 0.94, slant: -0.09, roughness: 1.4, capStyle: 'sharp', inkColor: '#36322e'
    },
    yetche: {
        name: '전통 옛체 · 필사체',
        desc: '전통 옛체: 가로획이 오히려 두텁고 기필의 사선 장식미가 강렬한 고전 목판·필사풍 서체',
        baseRadius: 3.40, nibAngleDeg: -56, pressureContrast: 1.30, hvRatio: 1.28, archCurve: 0.85, upwardTilt: 1.20, aspectX: 1.06, slant: -0.03, roughness: 0.3, capStyle: 'gungseo', inkColor: '#151311'
    },
    sepil: {
        name: '세필 정자체 (細筆)',
        desc: '세필 정자체: 가는 붓끝으로 궁체 법도를 단정하고 정갈하게 지켜 쓰는 전통 서간(편지) 서체',
        baseRadius: 2.00, nibAngleDeg: -42, pressureContrast: 1.20, hvRatio: 0.86, archCurve: 0.85, upwardTilt: 0.85, aspectX: 0.96, slant: -0.03, roughness: 0.0, capStyle: 'gungseo', inkColor: '#151311'
    },
    pen: {
        name: '만년필 · 손글씨 펜체',
        desc: '만년필 펜체: 경쾌한 우상향 리듬과 날렵한 펜촉 마감을 지닌 현대 손글씨 펜 서체',
        baseRadius: 1.75, nibAngleDeg: -28, pressureContrast: 0.75, hvRatio: 0.90, archCurve: 1.15, upwardTilt: 1.25, aspectX: 0.92, slant: -0.10, roughness: 0.0, capStyle: 'sharp', inkColor: '#1b2838'
    }
};

/**
 * 1. 자소별 정규화(0.0 ~ 1.0) 모필 스켈레톤 데이터베이스 (ㅇ/ㅎ 반시계방향 운필 준수)
 * - 굴절획(ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅋ, ㅌ)의 모서리 전절점(Corner Vertex)이 명확히 정의되어 있습니다.
 */
const JAMO_DB = {
    'ㄱ': [ [[0.12,0.22,1.15], [0.48,0.17,0.85], [0.82,0.14,1.30], [0.70,0.54,0.92], [0.54,0.90,0.18]] ],
    'ㄴ': [ [[0.18,0.12,1.22], [0.20,0.50,0.92], [0.24,0.82,1.15], [0.56,0.84,0.88], [0.88,0.79,1.22]] ],
    'ㄷ': [
        [[0.16,0.18,1.18], [0.50,0.15,0.85], [0.86,0.13,1.26]],
        [[0.18,0.18,1.20], [0.18,0.52,0.90], [0.20,0.84,1.18], [0.54,0.85,0.88], [0.89,0.80,1.24]]
    ],
    'ㄹ': [
        [[0.16,0.16,1.12], [0.49,0.13,0.85], [0.82,0.11,1.26], [0.75,0.44,0.96]],
        [[0.19,0.46,1.10], [0.48,0.44,0.85], [0.75,0.43,1.15]],
        [[0.19,0.46,1.15], [0.22,0.83,1.15], [0.54,0.85,0.88], [0.86,0.80,1.24]]
    ],
    'ㅁ': [
        [[0.18,0.18,1.22], [0.19,0.52,0.92], [0.21,0.84,1.02]],
        [[0.18,0.18,1.08], [0.52,0.15,0.85], [0.83,0.13,1.30], [0.79,0.52,0.94], [0.76,0.83,1.12]],
        [[0.21,0.83,1.05], [0.50,0.82,0.88], [0.78,0.80,1.20]]
    ],
    'ㅂ': [
        [[0.18,0.14,1.24], [0.19,0.52,0.92], [0.21,0.85,1.02]],
        [[0.80,0.13,1.26], [0.79,0.52,0.94], [0.76,0.85,1.10]],
        [[0.19,0.48,1.02], [0.50,0.46,0.85], [0.78,0.45,1.10]],
        [[0.21,0.84,1.05], [0.50,0.82,0.88], [0.77,0.81,1.20]]
    ],
    'ㅅ': [
        [[0.49,0.11,1.30], [0.54,0.28,1.12], [0.41,0.52,0.92], [0.25,0.74,0.60], [0.08,0.91,0.14]],
        [[0.45,0.52,0.55], [0.67,0.72,1.02], [0.87,0.86,1.28]]
    ],
    'ㅇ': [
        [[0.50,0.16,0.84], [0.24,0.26,1.04], [0.16,0.52,1.18], [0.25,0.79,1.00], [0.50,0.86,0.84], [0.75,0.79,1.04], [0.84,0.52,1.18], [0.76,0.26,1.04], [0.50,0.16,0.84]]
    ],
    'ㅈ': [
        [[0.15,0.19,1.16], [0.50,0.15,0.85], [0.85,0.13,1.25]],
        [[0.48,0.18,1.15], [0.54,0.34,1.10], [0.41,0.55,0.90], [0.25,0.77,0.58], [0.08,0.91,0.14]],
        [[0.45,0.56,0.55], [0.68,0.75,1.02], [0.88,0.88,1.28]]
    ],
    'ㅊ': [
        [[0.40,0.03,0.55], [0.50,0.07,1.02], [0.59,0.11,1.22]],
        [[0.14,0.28,1.16], [0.50,0.24,0.85], [0.86,0.21,1.25]],
        [[0.48,0.27,1.12], [0.54,0.42,1.08], [0.41,0.61,0.88], [0.25,0.80,0.56], [0.08,0.93,0.14]],
        [[0.45,0.61,0.55], [0.68,0.78,1.02], [0.88,0.90,1.28]]
    ],
    'ㅋ': [
        [[0.13,0.19,1.15], [0.48,0.15,0.85], [0.84,0.12,1.30], [0.73,0.54,0.94], [0.58,0.90,0.18]],
        [[0.16,0.49,1.12], [0.46,0.46,0.85], [0.74,0.43,1.16]]
    ],
    'ㅌ': [
        [[0.17,0.17,1.16], [0.50,0.14,0.85], [0.85,0.12,1.25]],
        [[0.18,0.48,1.10], [0.48,0.46,0.85], [0.78,0.44,1.16]],
        [[0.18,0.17,1.20], [0.18,0.52,0.90], [0.20,0.84,1.18], [0.54,0.85,0.88], [0.89,0.80,1.25]]
    ],
    'ㅍ': [
        [[0.13,0.19,1.16], [0.50,0.16,0.86], [0.86,0.13,1.25]],
        [[0.32,0.18,1.18], [0.31,0.52,0.90], [0.30,0.83,0.98]],
        [[0.67,0.16,1.18], [0.65,0.52,0.90], [0.64,0.81,0.98]],
        [[0.10,0.84,1.16], [0.50,0.82,0.86], [0.89,0.79,1.26]]
    ],
    'ㅎ': [
        [[0.40,0.03,0.55], [0.50,0.07,1.02], [0.59,0.11,1.22]],
        [[0.08,0.29,1.16], [0.50,0.25,0.84], [0.91,0.22,1.26]],
        [[0.50,0.48,0.82], [0.28,0.53,1.02], [0.21,0.68,1.14], [0.28,0.83,0.98], [0.50,0.89,0.82], [0.72,0.83,1.02], [0.79,0.68,1.14], [0.72,0.53,1.02], [0.50,0.48,0.82]]
    ],
    'ㅏ': [
        [[0.35,0.06,1.28], [0.36,0.48,0.92], [0.35,0.78,0.98], [0.34,0.95,0.18]],
        [[0.36,0.43,0.88], [0.62,0.41,0.90], [0.86,0.39,1.24]]
    ],
    'ㅑ': [
        [[0.35,0.06,1.28], [0.36,0.48,0.92], [0.35,0.78,0.98], [0.34,0.95,0.18]],
        [[0.36,0.33,0.88], [0.61,0.31,0.90], [0.84,0.29,1.22]],
        [[0.36,0.55,0.88], [0.62,0.53,0.90], [0.86,0.51,1.24]]
    ],
    'ㅓ': [
        [[0.10,0.45,1.18], [0.36,0.43,0.90], [0.62,0.42,0.92]],
        [[0.62,0.06,1.28], [0.63,0.48,0.92], [0.62,0.78,0.98], [0.61,0.95,0.18]]
    ],
    'ㅕ': [
        [[0.10,0.34,1.16], [0.36,0.32,0.88], [0.62,0.31,0.92]],
        [[0.10,0.56,1.16], [0.36,0.54,0.88], [0.62,0.53,0.92]],
        [[0.62,0.06,1.28], [0.63,0.48,0.92], [0.62,0.78,0.98], [0.61,0.95,0.18]]
    ],
    'ㅗ': [
        [[0.49,0.09,1.26], [0.50,0.44,0.98], [0.50,0.74,0.92]],
        [[0.07,0.77,1.18], [0.50,0.73,0.84], [0.92,0.70,1.28]]
    ],
    'ㅛ': [
        [[0.35,0.14,1.24], [0.36,0.44,0.96], [0.36,0.69,0.90]],
        [[0.65,0.13,1.24], [0.65,0.44,0.96], [0.64,0.68,0.90]],
        [[0.07,0.72,1.18], [0.50,0.68,0.84], [0.92,0.65,1.28]]
    ],
    'ㅜ': [
        [[0.07,0.24,1.18], [0.50,0.20,0.84], [0.92,0.17,1.28]],
        [[0.49,0.21,1.20], [0.50,0.60,0.92], [0.49,0.94,0.18]]
    ],
    'ㅠ': [
        [[0.07,0.24,1.18], [0.50,0.20,0.84], [0.92,0.17,1.28]],
        [[0.35,0.22,1.18], [0.36,0.58,0.92], [0.35,0.90,0.20]],
        [[0.65,0.20,1.18], [0.66,0.58,0.92], [0.65,0.93,0.18]]
    ],
    'ㅡ': [
        [[0.07,0.50,1.20], [0.50,0.46,0.84], [0.92,0.43,1.28]]
    ],
    'ㅣ': [
        [[0.49,0.06,1.28], [0.50,0.48,0.92], [0.49,0.78,0.98], [0.48,0.95,0.18]]
    ],
    'ㅐ': [
        [[0.25,0.08,1.24], [0.26,0.52,0.90], [0.25,0.91,0.20]],
        [[0.26,0.45,0.90], [0.46,0.44,0.86], [0.67,0.43,0.98]],
        [[0.67,0.06,1.28], [0.68,0.50,0.92], [0.67,0.79,0.98], [0.66,0.95,0.18]]
    ],
    'ㅒ': [
        [[0.25,0.08,1.24], [0.26,0.52,0.90], [0.25,0.91,0.20]],
        [[0.26,0.34,0.90], [0.46,0.33,0.86], [0.67,0.32,0.98]],
        [[0.26,0.56,0.90], [0.46,0.55,0.86], [0.67,0.54,0.98]],
        [[0.67,0.06,1.28], [0.68,0.50,0.92], [0.67,0.79,0.98], [0.66,0.95,0.18]]
    ],
    'ㅔ': [
        [[0.08,0.45,1.16], [0.26,0.44,0.88], [0.43,0.43,0.92]],
        [[0.43,0.08,1.24], [0.43,0.52,0.90], [0.42,0.90,0.20]],
        [[0.74,0.06,1.28], [0.75,0.50,0.92], [0.74,0.79,0.98], [0.73,0.95,0.18]]
    ],
    'ㅖ': [
        [[0.08,0.34,1.14], [0.26,0.33,0.88], [0.43,0.32,0.92]],
        [[0.08,0.56,1.14], [0.26,0.55,0.88], [0.43,0.54,0.92]],
        [[0.43,0.08,1.24], [0.43,0.52,0.90], [0.42,0.90,0.20]],
        [[0.74,0.06,1.28], [0.75,0.50,0.92], [0.74,0.79,0.98], [0.73,0.95,0.18]]
    ]
};

function mapSubBox(strokes, x0, y0, w, h, pScale = 0.88) {
    return strokes.map(pts => pts.map(pt => [x0 + pt[0] * w, y0 + pt[1] * h, pt[2] * pScale, pt[3] || null]));
}

const DOUBLE_JAMO = {
    'ㄲ': ['ㄱ','ㄱ'], 'ㄸ': ['ㄷ','ㄷ'], 'ㅃ': ['ㅂ','ㅂ'], 'ㅆ': ['ㅅ','ㅅ'], 'ㅉ': ['ㅈ','ㅈ'],
    'ㄳ': ['ㄱ','ㅅ'], 'ㄵ': ['ㄴ','ㅈ'], 'ㄶ': ['ㄴ','ㅎ'], 'ㄺ': ['ㄹ','ㄱ'],
    'ㄻ': ['ㄹ','ㅁ'], 'ㄼ': ['ㄹ','ㅂ'], 'ㄽ': ['ㄹ','ㅅ'], 'ㄾ': ['ㄹ','ㅌ'],
    'ㄿ': ['ㄹ','ㅍ'], 'ㅀ': ['ㄹ','ㅎ'], 'ㅄ': ['ㅂ','ㅅ']
};

const COMPOUND_VOWEL = {
    'ㅘ': ['ㅗ','ㅏ'], 'ㅙ': ['ㅗ','ㅐ'], 'ㅚ': ['ㅗ','ㅣ'],
    'ㅝ': ['ㅜ','ㅓ'], 'ㅞ': ['ㅜ','ㅔ'], 'ㅟ': ['ㅜ','ㅣ'], 'ㅢ': ['ㅡ','ㅣ']
};

function getJamoStrokes(jamo) {
    if (JAMO_DB[jamo]) return JAMO_DB[jamo];
    if (DOUBLE_JAMO[jamo]) {
        const [a, b] = DOUBLE_JAMO[jamo];
        return [
            ...mapSubBox(JAMO_DB[a], 0.0, 0.0, 0.48, 1.0, 0.85),
            ...mapSubBox(JAMO_DB[b], 0.52, 0.0, 0.48, 1.0, 0.85)
        ];
    }
    if (COMPOUND_VOWEL[jamo]) {
        const [h, v] = COMPOUND_VOWEL[jamo];
        return [
            ...mapSubBox(JAMO_DB[h], 0.0, 0.35, 0.58, 0.55, 0.9),
            ...mapSubBox(JAMO_DB[v], 0.52, 0.0, 0.48, 1.0, 0.95)
        ];
    }
    return JAMO_DB['ㅇ'];
}

const CHO_LIST = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNG_LIST = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONG_LIST = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

const VOWEL_TYPE = {
    'ㅏ':'V', 'ㅐ':'V', 'ㅑ':'V', 'ㅒ':'V', 'ㅓ':'V', 'ㅔ':'V', 'ㅕ':'V', 'ㅖ':'V', 'ㅣ':'V',
    'ㅗ':'H', 'ㅛ':'H', 'ㅜ':'H', 'ㅠ':'H', 'ㅡ':'H',
    'ㅘ':'C', 'ㅙ':'C', 'ㅚ':'C', 'ㅝ':'C', 'ㅞ':'C', 'ㅟ':'C', 'ㅢ':'C'
};

function decomposeHangul(ch) {
    if (!ch) return null;
    const code = ch.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) {
        const offset = code - 0xAC00;
        const cho = CHO_LIST[Math.floor(offset / 588)];
        const jung = JUNG_LIST[Math.floor((offset % 588) / 28)];
        const jong = JONG_LIST[offset % 28];
        return { char: ch, code, cho, jung, jong };
    }
    if (JAMO_DB[ch] || DOUBLE_JAMO[ch] || COMPOUND_VOWEL[ch]) {
        return { char: ch, code, single: ch };
    }
    return null;
}

function getLayoutBoxes(vType, hasJong, jongChar = '') {
    if (!hasJong) {
        // [Type 1] 받침 없는 세로 모음 ('하', '가', '다') - 좌우 간격 긴밀 밀착
        if (vType === 'V') return { cho: [14, 14, 38, 62], jung: [48, 12, 32, 76] };
        // [Type 2] 받침 없는 가로 모음 ('호', '고', '도') - 상하 간격 긴밀 밀착
        if (vType === 'H') return { cho: [22, 13, 56, 36], jung: [14, 46, 72, 34] };
        // [Type 3] 받침 없는 복합 모음 ('귀', '화', '과') - 3방향 단단한 일체화
        return { cho: [14, 12, 36, 32], jung: [14, 12, 72, 76] };
    } else {
        // [Type 4] 삼분할 결합 구조 ('한', '간', '산', '성', '달') - 상단과 하단 여백 밀착
        if (vType === 'V') return { cho: [14, 12, 38, 42], jung: [48, 11, 32, 48], jong: [20, 60, 60, 26] };
        // [Type 5] 삼단 상중하 결합 구조 ('글', '문', '국', '물') - 3단 층간 간격 긴밀화
        if (vType === 'H') return { cho: [22, 11, 56, 26], jung: [14, 40, 72, 16], jong: [22, 59, 56, 26] };
        // [Type 6] 받침 있는 복합 모음 ('환', '광', '권')
        return { cho: [14, 11, 36, 26], jung: [14, 11, 72, 46], jong: [20, 60, 60, 26] };
    }
}

function interpolateCatmullRom(pts, segmentsPerSpan = 12) {
    if (pts.length < 2) return pts;
    const res = [];
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];
        for (let step = 0; step < segmentsPerSpan; step++) {
            const t = step / segmentsPerSpan;
            const t2 = t * t, t3 = t2 * t;
            const interpolate = (idx) => 0.5 * (
                (2 * p1[idx]) +
                (-p0[idx] + p2[idx]) * t +
                (2 * p0[idx] - 5 * p1[idx] + 4 * p2[idx] - p3[idx]) * t2 +
                (-p0[idx] + 3 * p1[idx] - 3 * p2[idx] + p3[idx]) * t3
            );
            res.push([interpolate(0), interpolate(1), Math.max(0.08, interpolate(2))]);
        }
    }
    res.push(pts[pts.length - 1]);
    return res;
}

/**
 * ============================================================================
 * Stage 1 & Stage 2: 자소 단위 정규화(Vertex Welding) 및 굴절획(Corner) 보간기 (v15)
 * ============================================================================
 * - 종성 박스(w > h) 종횡비에 의해 세로획 판정이 왜곡되는 현상을 막기 위해
 *   [0, 1] × [0, 1] 정규화 공간에서 서체별 직교화/곡률(archCurve, upwardTilt)을 먼저 적용하고,
 *   자소 내 공유 모서리 정점(ㄹ, ㄷ, ㅁ, ㅂ, ㅌ 등)을 직교 교점(x_vert, y_horiz)으로 100% 용접(Welding)한다.
 */
function normalizeJamoStrokes(normStrokes, styleParams, part = 'cho') {
    if (!normStrokes || !normStrokes.length) return normStrokes;
    const upwardTilt = styleParams.upwardTilt !== undefined ? styleParams.upwardTilt : 1.0;
    const archCurve = styleParams.archCurve !== undefined ? styleParams.archCurve : 1.0;
    const capStyle = styleParams.capStyle || 'gungseo';

    // 깊은 복사 (각 점: [x, y, p, segTag])
    const strokes = normStrokes.map(st => st.map(pt => [pt[0], pt[1], pt[2], pt[3] || null]));

    // 1. 변형 전 [0, 1] 공간에서 공유 정점(Welded Corners) 및 T자 접합(T-Junctions) 기록
    const welds = [];
    for (let s1 = 0; s1 < strokes.length; s1++) {
        const st1 = strokes[s1];
        const loop1 = Math.hypot(st1[0][0] - st1[st1.length - 1][0], st1[0][1] - st1[st1.length - 1][1]) < 0.05;
        if (loop1) continue;
        for (let s2 = s1 + 1; s2 < strokes.length; s2++) {
            const st2 = strokes[s2];
            const loop2 = Math.hypot(st2[0][0] - st2[st2.length - 1][0], st2[0][1] - st2[st2.length - 1][1]) < 0.05;
            if (loop2) continue;
            for (const i1 of [0, st1.length - 1]) {
                for (const i2 of [0, st2.length - 1]) {
                    const d = Math.hypot(st1[i1][0] - st2[i2][0], st1[i1][1] - st2[i2][1]);
                    if (d < 0.055) {
                        welds.push({ s1, i1, s2, i2 });
                    }
                }
            }
        }
    }

    // 2. 각 획 내부 서브구간 탐지 및 [0, 1] 공간 서체 변형
    const segMeta = strokes.map(() => []);
    strokes.forEach((st, sIdx) => {
        const n = st.length;
        if (n < 2) return;
        const isClosedLoop = Math.hypot(st[0][0] - st[n - 1][0], st[0][1] - st[n - 1][1]) < 0.05;
        if (isClosedLoop) {
            st.forEach(p => { p[3] = 'O'; });
            return;
        }
        // ㅎ, ㅊ 첫 획(방점/측점) 판별: 3획 이상 자소의 첫 획이고 상단(y < 0.16)에서 짧게 시작하는 획
        const isTopDot = (sIdx === 0 && strokes.length >= 3 && st[0][2] < 0.70 && st[0][1] < 0.16 && st[n - 1][1] < 0.22);
        if (isTopDot) {
            if (capStyle === 'square' || capStyle === 'round') {
                // 고딕·돋움·굴림·판본체에서는 ㅎ·ㅊ 상단 꼭지를 반듯한 수평/수직 꼭지로 정돈
                const midY = 0.075;
                st[0][0] = 0.36; st[0][1] = midY; st[0][2] = 0.95; st[0][3] = 'H';
                if (n >= 3) { st[1][0] = 0.50; st[1][1] = midY; st[1][2] = 0.95; st[1][3] = 'H'; }
                st[n - 1][0] = 0.64; st[n - 1][1] = midY; st[n - 1][2] = 0.95; st[n - 1][3] = 'H';
            } else {
                st.forEach(p => { p[3] = 'DOT'; });
            }
            return;
        }

        const corners = [0];
        if (n >= 3) {
            for (let i = 1; i < n - 1; i++) {
                const dx1 = st[i][0] - st[i - 1][0], dy1 = st[i][1] - st[i - 1][1];
                const dx2 = st[i + 1][0] - st[i][0], dy2 = st[i + 1][1] - st[i][1];
                const l1 = Math.hypot(dx1, dy1) || 1, l2 = Math.hypot(dx2, dy2) || 1;
                if ((dx1 * dx2 + dy1 * dy2) / (l1 * l2) < 0.72) corners.push(i);
            }
        }
        corners.push(n - 1);

        for (let c = 0; c < corners.length - 1; c++) {
            const i0 = corners[c], i1 = corners[c + 1];
            const pStart = st[i0], pEnd = st[i1];
            const dx = pEnd[0] - pStart[0], dy = pEnd[1] - pStart[1];
            const spanLen = Math.hypot(dx, dy) || 1;

            const isHoriz = Math.abs(dx) > Math.abs(dy) * 1.35;
            // [0, 1] 정규화 공간에서는 ㄹ 우측 기둥(dx=-0.07, dy=0.33), ㅁ 우측 기둥 등이 모두 명확히 수직(isVert)으로 판별됨
            const isVert = Math.abs(dy) > Math.abs(dx) * 1.35 && Math.abs(dx) < spanLen * 0.35;
            // ㄱ, ㅋ의 우측 사선 기둥(i0 > 0 이고 하향하는 끝 구간)을 직교 서체(archCurve < 0.5)에서 수직 기둥으로 보정
            const isGiyeokLeg = (!isVert && c > 0 && dy > 0.25 && dx < 0 && Math.abs(dx) < dy * 0.85);

            if (isHoriz) {
                const midY = (pStart[1] + pEnd[1]) * 0.5;
                const newTiltY = (pEnd[1] - pStart[1]) * upwardTilt;
                pStart[1] = midY - newTiltY * 0.5;
                pEnd[1] = midY + newTiltY * 0.5;
                for (let k = i0 + 1; k < i1; k++) {
                    const t = (k - i0) / (i1 - i0);
                    const linY = pStart[1] * (1 - t) + pEnd[1] * t;
                    const isBottomCraddle = (c > 0 && pStart[1] > 0.65);
                    const archSign = isBottomCraddle ? 0.65 : -1.0;
                    st[k][1] = linY + archSign * Math.sin(t * Math.PI) * (spanLen * 0.025) * archCurve;
                }
                for (let k = i0; k <= i1; k++) st[k][3] = 'H';
                segMeta[sIdx].push({ i0, i1, type: 'H' });
            } else if (isVert) {
                const refX = (c > 0) ? (pStart[0] * (1 - archCurve * 0.5) + ((pStart[0] + pEnd[0]) * 0.5) * (archCurve * 0.5)) : (pStart[0] + pEnd[0]) * 0.5;
                pStart[0] = refX + (pStart[0] - refX) * archCurve;
                pEnd[0] = refX + (pEnd[0] - refX) * archCurve;
                for (let k = i0 + 1; k < i1; k++) {
                    const t = (k - i0) / (i1 - i0);
                    const linX = pStart[0] * (1 - t) + pEnd[0] * t;
                    st[k][0] = linX - Math.sin(t * Math.PI) * (spanLen * 0.018) * archCurve;
                }
                for (let k = i0; k <= i1; k++) st[k][3] = 'V';
                segMeta[sIdx].push({ i0, i1, type: 'V' });
            } else if (isGiyeokLeg) {
                const orthoBlend = Math.max(0, 1 - archCurve) * ((part === 'jong' || capStyle === 'round') ? 0.92 : 0.58);
                const topX = pStart[0];
                for (let k = i0 + 1; k <= i1; k++) {
                    st[k][0] = st[k][0] * (1 - orthoBlend) + topX * orthoBlend;
                    if (capStyle === 'square' || capStyle === 'round') {
                        st[k][2] = Math.max(st[k][2], 0.92);
                    }
                }
                const sType = orthoBlend > 0.75 ? 'V' : 'D';
                for (let k = i0; k <= i1; k++) st[k][3] = sType;
                segMeta[sIdx].push({ i0, i1, type: sType });
            } else {
                for (let k = i0; k <= i1; k++) st[k][3] = 'D';
                segMeta[sIdx].push({ i0, i1, type: 'D' });
            }
        }
    });

    // 3. 공유 모서리 정점 직교 용접 (Orthogonal-Aware Vertex Welding):
    //    가로 구간(H)과 세로 구간(V)이 만나는 정점은 x를 세로 구간에서, y를 가로 구간에서 취해 직각 모서리를 완벽히 일치시킨다.
    const endpointType = (s, idx) => {
        const list = segMeta[s] || [];
        for (const m of list) {
            if (idx === m.i0 || idx === m.i1) return m.type;
        }
        return strokes[s][idx][3] || 'D';
    };
    const propagateEndpoint = (s, idx, newX, newY) => {
        const st = strokes[s];
        const oldX = st[idx][0], oldY = st[idx][1];
        const dx = newX - oldX, dy = newY - oldY;
        st[idx][0] = newX; st[idx][1] = newY;
        const list = segMeta[s] || [];
        for (const m of list) {
            if (m.i0 === idx || m.i1 === idx) {
                const otherIdx = (m.i0 === idx) ? m.i1 : m.i0;
                if (m.type === 'H' && archCurve < 0.35) {
                    // 수평 구간의 반대쪽 끝도 수평 유지
                    for (let k = m.i0; k <= m.i1; k++) st[k][1] += dy;
                } else if (m.type === 'V' && archCurve < 0.35) {
                    // 수직 구간의 반대쪽 끝도 수직 유지
                    for (let k = m.i0; k <= m.i1; k++) st[k][0] += dx;
                } else {
                    for (let k = m.i0 + 1; k < m.i1; k++) {
                        const f = (otherIdx === m.i1) ? (1 - (k - m.i0) / (m.i1 - m.i0)) : ((k - m.i0) / (m.i1 - m.i0));
                        st[k][0] += dx * f;
                        st[k][1] += dy * f;
                    }
                }
            }
        }
    };

    welds.forEach(({ s1, i1, s2, i2 }) => {
        const p1 = strokes[s1][i1], p2 = strokes[s2][i2];
        const t1 = endpointType(s1, i1), t2 = endpointType(s2, i2);
        let wx = (p1[0] + p2[0]) * 0.5;
        let wy = (p1[1] + p2[1]) * 0.5;
        if (t1 === 'V' && t2 === 'H') {
            wx = p1[0]; wy = p2[1];
        } else if (t1 === 'H' && t2 === 'V') {
            wx = p2[0]; wy = p1[1];
        }
        propagateEndpoint(s1, i1, wx, wy);
        propagateEndpoint(s2, i2, wx, wy);
    });

    return strokes;
}

function buildProceduralStrokePoints(rawCtrlPts, styleParams) {
    const n = rawCtrlPts.length;
    if (n < 2) return rawCtrlPts;

    const archCurve = styleParams.archCurve !== undefined ? styleParams.archCurve : 1.0;
    const aspectX = styleParams.aspectX !== undefined ? styleParams.aspectX : 1.0;
    const slant = styleParams.slant || 0.0;
    const capStyle = styleParams.capStyle || 'gungseo';

    // 폐곡선(ㅇ, ㅎ 원형 획) 판별
    const isClosedLoop = Math.hypot(rawCtrlPts[0][0] - rawCtrlPts[n - 1][0], rawCtrlPts[0][1] - rawCtrlPts[n - 1][1]) < 3.8;

    // 1. 굴절획 내 전절점(Corner Vertex: 방향이 약 45° 이상 꺾이는 제어점) 탐지
    const cornerIndices = [0];
    if (!isClosedLoop && n >= 3) {
        for (let i = 1; i < n - 1; i++) {
            const dx1 = rawCtrlPts[i][0] - rawCtrlPts[i - 1][0];
            const dy1 = rawCtrlPts[i][1] - rawCtrlPts[i - 1][1];
            const dx2 = rawCtrlPts[i + 1][0] - rawCtrlPts[i][0];
            const dy2 = rawCtrlPts[i + 1][1] - rawCtrlPts[i][1];
            const l1 = Math.hypot(dx1, dy1) || 1;
            const l2 = Math.hypot(dx2, dy2) || 1;
            const cosA = (dx1 * dx2 + dy1 * dy2) / (l1 * l2);
            if (cosA < 0.72) {
                cornerIndices.push(i);
            }
        }
    }
    cornerIndices.push(n - 1);

    const adjustedCtrl = rawCtrlPts.map(pt => [...pt]);

    // 2. 전절점(Corner) 구간별로 나누어 보간하고 각 샘플 점에 메타데이터 태깅
    const denseResult = [];

    if (isClosedLoop) {
        const loopPts = interpolateCatmullRom(adjustedCtrl, 14);
        loopPts.forEach((pt, idx) => {
            const u = idx / Math.max(1, loopPts.length - 1);
            denseResult.push([pt[0], pt[1], pt[2], u, 'O', false, false, 0]);
        });
    } else {
        const numSegs = cornerIndices.length - 1;
        for (let c = 0; c < numSegs; c++) {
            const i0 = cornerIndices[c];
            const i1 = cornerIndices[c + 1];
            const subCtrl = adjustedCtrl.slice(i0, i1 + 1);
            const dx = subCtrl[subCtrl.length - 1][0] - subCtrl[0][0];
            const dy = subCtrl[subCtrl.length - 1][1] - subCtrl[0][1];
            const segLen = Math.hypot(dx, dy);
            let segType = subCtrl[Math.min(1, subCtrl.length - 1)][3] || subCtrl[0][3] || null;
            if (!segType) {
                if (numSegs === 1 && subCtrl[0][2] < 0.70 && dx > 0 && dy >= 0) {
                    segType = 'DOT';
                } else if (Math.abs(dx) > Math.abs(dy) * 1.35) {
                    segType = 'H';
                } else if (Math.abs(dy) > Math.abs(dx) * 1.25 && Math.abs(dx) < segLen * 0.42) {
                    segType = 'V';
                } else {
                    segType = 'D';
                }
            }

            const isCornerStart = (c > 0);
            const isCornerEnd = (c < numSegs - 1);

            const segSpan = Math.max(10, Math.round(18 / Math.max(1, subCtrl.length - 1)));
            const interp = interpolateCatmullRom(subCtrl, segSpan);

            interp.forEach((pt, idx) => {
                const u = idx / Math.max(1, interp.length - 1);
                denseResult.push([pt[0], pt[1], pt[2], u, segType, isCornerStart, isCornerEnd, c]);
            });
        }

        // 궁서체/봉서체/행서체에서 ㄴ, ㄷ, ㄹ, ㅌ의 좌하단 꺾임(세로→가로 원전)은 90° 각진 모서리가 아니라 부드러운 곡선으로 돌아나감
        if (numSegs >= 2 && (capStyle === 'gungseo' || capStyle === 'bongseo' || capStyle === 'sharp' || capStyle === 'round') && archCurve > 0.25) {
            for (let pass = 0; pass < 4; pass++) {
                const copy = denseResult.map(p => [...p]);
                for (let i = 1; i < denseResult.length - 1; i++) {
                    const nearCorner = (denseResult[i][7] !== denseResult[Math.max(0, i - 4)][7]) ||
                                       (denseResult[i][7] !== denseResult[Math.min(denseResult.length - 1, i + 4)][7]);
                    if (nearCorner) {
                        denseResult[i][0] = copy[i - 1][0] * 0.28 + copy[i][0] * 0.44 + copy[i + 1][0] * 0.28;
                        denseResult[i][1] = copy[i - 1][1] * 0.28 + copy[i][1] * 0.44 + copy[i + 1][1] * 0.28;
                    }
                }
            }
        }
    }

    // 4. 자폭 비율(aspectX) 및 전체 기울기(slant) 변환 적용
    return denseResult.map(([x, y, p, u, segType, cStart, cEnd, segIdx]) => {
        const cellIdx = Math.floor(x / 100);
        const cellCenter = cellIdx * 100 + 50;
        const localX = (x - cellCenter) * aspectX + cellCenter;
        const sx = localX + (50 - y) * slant;
        const sy = y + ((localX % 100) - 50) * (slant * 0.22);
        return [sx, sy, p, u, segType, cStart, cEnd, segIdx];
    });
}

/**
 * ============================================================================
 * Stage 2.5: 획 간 T자 접합부(장봉 접필) 자동 감지기 (`computeStrokeJunctions`)
 * - 끝점과 끝점이 만나는 L자 모서리(ㄷ, ㄹ, ㅁ, ㅌ 등)는 각 획의 캡을 유지하여 외각 빈 틈이 생기지 않게 하고,
 *   한 획의 끝점이 다른 획의 중간 몸통(Interior)에 닿는 T자 접합(ㅏ, ㅓ, ㅗ, ㅜ, ㅂ 등)에서만 캡 돌출을 억제한다.
 * ============================================================================
 */
function computeStrokeJunctions(strokes, baseRadius, strokeMeta) {
    const tol = Math.max(3.6, baseRadius * 1.45);
    return strokes.map((ptsA, idxA) => {
        if (!ptsA || ptsA.length < 2) return { hasStartJunction: false, hasEndJunction: false };
        const nA = ptsA.length;
        const startPt = ptsA[0];
        const endPt = ptsA[nA - 1];
        const isClosedLoop = Math.hypot(startPt[0] - endPt[0], startPt[1] - endPt[1]) < 3.8;
        if (isClosedLoop || ptsA[0][4] === 'DOT') return { hasStartJunction: false, hasEndJunction: false };

        const metaA = strokeMeta && strokeMeta[idxA];
        const cellA = Math.floor(startPt[0] / 100);
        const sdx = ptsA[Math.min(nA - 1, 3)][0] - startPt[0];
        const sdy = ptsA[Math.min(nA - 1, 3)][1] - startPt[1];
        const slen = Math.hypot(sdx, sdy) || 1;
        const stx = sdx / slen, sty = sdy / slen;

        const edx = endPt[0] - ptsA[Math.max(0, nA - 4)][0];
        const edy = endPt[1] - ptsA[Math.max(0, nA - 4)][1];
        const elen = Math.hypot(edx, edy) || 1;
        const etx = edx / elen, ety = edy / elen;

        let hasStartJunction = false;
        let hasEndJunction = false;

        for (let idxB = 0; idxB < strokes.length; idxB++) {
            if (idxB === idxA) continue;
            const ptsB = strokes[idxB];
            if (!ptsB || ptsB.length < 6) continue;
            if (Math.floor(ptsB[0][0] / 100) !== cellA) continue;
            const metaB = strokeMeta && strokeMeta[idxB];
            if (metaA && metaB && (metaA.part !== metaB.part || metaA.subPart !== metaB.subPart)) continue;
            const isLoopB = Math.hypot(ptsB[0][0] - ptsB[ptsB.length - 1][0], ptsB[0][1] - ptsB[ptsB.length - 1][1]) < 3.8;
            if (isLoopB || ptsB[0][4] === 'DOT') continue;

            const bStart = ptsB[0], bEnd = ptsB[ptsB.length - 1];
            const startIsCornerB = Math.hypot(startPt[0] - bStart[0], startPt[1] - bStart[1]) < tol * 1.35 ||
                                   Math.hypot(startPt[0] - bEnd[0], startPt[1] - bEnd[1]) < tol * 1.35;
            const endIsCornerB = Math.hypot(endPt[0] - bStart[0], endPt[1] - bStart[1]) < tol * 1.35 ||
                                 Math.hypot(endPt[0] - bEnd[0], endPt[1] - bEnd[1]) < tol * 1.35;

            const marginB = Math.max(3, Math.floor(ptsB.length * 0.12));
            for (let j = marginB; j < ptsB.length - marginB; j += 2) {
                const bx = ptsB[j][0], by = ptsB[j][1];
                const jNext = Math.min(ptsB.length - 1, j + 2);
                const jPrev = Math.max(0, j - 2);
                const bdx = ptsB[jNext][0] - ptsB[jPrev][0];
                const bdy = ptsB[jNext][1] - ptsB[jPrev][1];
                const blen = Math.hypot(bdx, bdy) || 1;
                const btx = bdx / blen, bty = bdy / blen;

                if (!hasStartJunction && !startIsCornerB && Math.hypot(startPt[0] - bx, startPt[1] - by) < tol) {
                    const dot = Math.abs(stx * btx + sty * bty);
                    if (dot < 0.78) {
                        hasStartJunction = true;
                    }
                }
                if (!hasEndJunction && !endIsCornerB && Math.hypot(endPt[0] - bx, endPt[1] - by) < tol) {
                    const dot = Math.abs(etx * btx + ety * bty);
                    if (dot < 0.78) {
                        hasEndJunction = true;
                    }
                }
            }
        }
        return { hasStartJunction, hasEndJunction };
    });
}

function intersectOffsetRays(A1, T1, A2, T2, maxDist) {
    const det = T1[0] * T2[1] - T1[1] * T2[0];
    if (Math.abs(det) < 0.14) {
        return [(A1[0] + A2[0]) * 0.5, (A1[1] + A2[1]) * 0.5];
    }
    const dx = A2[0] - A1[0];
    const dy = A2[1] - A1[1];
    let s = (dx * T2[1] - dy * T2[0]) / det;
    s = Math.max(-maxDist, Math.min(maxDist, s));
    return [A1[0] + s * T1[0], A1[1] + s * T1[1]];
}

/**
 * 점 배열을 부드러운 2차 베지어 중점 스플라인(Q) 또는 직선(L) SVG 명령열로 변환
 */
function pointsToContourCmds(pts, useSmoothSpline) {
    if (!pts || pts.length === 0) return '';
    if (!useSmoothSpline || pts.length < 3) {
        let s = '';
        for (let i = 1; i < pts.length; i++) {
            s += `L ${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)} `;
        }
        return s;
    }
    let s = '';
    const mid0X = (pts[0][0] + pts[1][0]) * 0.5;
    const mid0Y = (pts[0][1] + pts[1][1]) * 0.5;
    s += `L ${mid0X.toFixed(2)} ${mid0Y.toFixed(2)} `;
    for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i][0] + pts[i + 1][0]) * 0.5;
        const my = (pts[i][1] + pts[i + 1][1]) * 0.5;
        s += `Q ${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)} `;
    }
    const last = pts[pts.length - 1];
    s += `L ${last[0].toFixed(2)} ${last[1].toFixed(2)} `;
    return s;
}

/**
 * ============================================================================
 * Stage 3: 정통 궁서체 2D 물방울 모필 스윕 & 스플라인 엔벨로프 생성기 (`buildStrokeEnvelope` v14)
 * ============================================================================
 * - 5대 조형 왜곡 원천 해결:
 *   1) 가로획 우측 끝(수필 돈필)에서 윗선은 완만히 숙이고 아랫배만 둥글게 맺히게 하여 나팔관/뼈다귀 왜곡 제거
 *   2) 세로획 상단 기필에서 좌상단→우하단(+38°) 볼록 역입 머리와 우측 돈필 어깨를 형성하여 갈퀴 홈 왜곡 제거
 *   3) 세로획·삐침획 하단 발필을 직선 삼각형(연필심)이 아닌 볼록 포물선(Convex Taper) + 둥근 붓끝으로 마감
 *   4) 굴절획(ㄱ, ㄴ, ㄷ, ㄹ) 모서리에 가우시안 돈필 어깨와 내측 라플라시안 페어링(Fairing)을 적용해 외측 뿔과 내측 계단 턱 100% 제거
 *   5) ㅎ·ㅊ 첫 획(방점/측점)을 정통 궁서체 물방울 점 조형으로 구현
 */
function buildStrokeEnvelope(densePts, styleParams, junctionInfo = { hasStartJunction: false, hasEndJunction: false }) {
    if (!densePts || densePts.length < 2) {
        return { fullPathD: '', leftPts: [], rightPts: [], boundPts: [], tangents: [], radii: [], startCapSuffix: 'Z', isClosedLoop: false, useSmoothSpline: true };
    }
    const n = densePts.length;
    const baseRadius = styleParams.baseRadius * (junctionInfo.rScale || 1.0);
    const contrast = styleParams.pressureContrast;
    const hvRatio = styleParams.hvRatio !== undefined ? styleParams.hvRatio : 1.0;
    const capStyle = styleParams.capStyle || 'gungseo';
    const isClosedLoop = Math.hypot(densePts[0][0] - densePts[n - 1][0], densePts[0][1] - densePts[n - 1][1]) < 3.8;
    const useSmoothSpline = isClosedLoop || (capStyle !== 'square' && capStyle !== 'serif');
    const calliAngleRad = (Math.abs(styleParams.nibAngleDeg || 42) * Math.PI) / 180;
    const brushDx = Math.cos(calliAngleRad);
    const brushDy = Math.sin(calliAngleRad);
    const endRawP = densePts[n - 1][2] || 0.8;
    const isNeedleEnd = !isClosedLoop && !junctionInfo.hasEndJunction && (endRawP < 0.38) &&
        (capStyle === 'gungseo' || capStyle === 'sharp' || capStyle === 'serif');

    // 모서리 전환 지점 인덱스 수집 (전절 돈필 가우시안 벨 커브용)
    const cornerSampleIndices = [];
    if (!isClosedLoop) {
        for (let i = 0; i < n - 1; i++) {
            if ((densePts[i][7] ?? 0) !== (densePts[i + 1][7] ?? 0)) {
                cornerSampleIndices.push(i);
            }
        }
    }

    const leftPts = new Array(n);
    const rightPts = new Array(n);
    const tangents = new Array(n);
    const radii = new Array(n);

    for (let i = 0; i < n; i++) {
        const pt = densePts[i];
        const x = pt[0], y = pt[1], rawP = pt[2];
        const u = pt[3] !== undefined ? pt[3] : (i / Math.max(1, n - 1));
        const segType = pt[4] || 'H';
        const isCornerStart = !!pt[5];
        const isCornerEnd = !!pt[6];
        const segIdx = pt[7] !== undefined ? pt[7] : 0;

        // 접선 벡터 계산 (폐곡선 ㅇ, ㅎ은 12시 방향 시작/끝점에서 순환 접선을 사용하여 이음새 홈을 완전히 제거)
        let prevIdx = isClosedLoop && i === 0 ? Math.max(0, n - 2) : Math.max(0, i - 1);
        let nextIdx = isClosedLoop && i === n - 1 ? Math.min(n - 1, 1) : Math.min(n - 1, i + 1);
        if (!useSmoothSpline && !isClosedLoop) {
            while (prevIdx > 0 && (densePts[prevIdx][7] ?? 0) !== segIdx) prevIdx++;
            while (nextIdx < n - 1 && (densePts[nextIdx][7] ?? 0) !== segIdx) nextIdx--;
        }
        let dx = densePts[nextIdx][0] - densePts[prevIdx][0];
        let dy = densePts[nextIdx][1] - densePts[prevIdx][1];
        if (Math.hypot(dx, dy) < 1e-4) {
            dx = i < n - 1 ? densePts[i + 1][0] - x : x - densePts[i - 1][0];
            dy = i < n - 1 ? densePts[i + 1][1] - y : y - densePts[i - 1][1];
        }
        const len = Math.hypot(dx, dy) || 1;
        const tx = dx / len;
        const ty = dy / len;
        tangents[i] = [tx, ty];

        // SVG 좌표계에서 진행 방향의 좌측(가로획의 위쪽 Top, 세로획의 오른쪽 Right) 단위법선
        const nx = ty;
        const ny = -tx;

        const horizWeight = Math.abs(tx);
        const dirScale = horizWeight * hvRatio + (1.0 - horizWeight) * (2.0 - hvRatio);
        const rBase = baseRadius * dirScale;

        if (segType === 'DOT' && (capStyle === 'gungseo' || capStyle === 'bongseo' || capStyle === 'sharp')) {
            // ㅎ, ㅊ의 첫 획: 좌상단에서 뾰족-둥글게 들어가 우하단으로 통통한 물방울 방점(點)을 맺음
            const dotEnv = 0.38 + 0.72 * Math.sin(Math.pow(u, 0.78) * Math.PI * 0.84);
            const r = rBase * dotEnv * (capStyle === 'bongseo' ? 0.76 : 0.90);
            radii[i] = r;
            const topScale = 0.82 + 0.14 * Math.sin(u * Math.PI);
            const botScale = 0.84 + 0.18 * Math.pow(u, 1.25);
            leftPts[i] = [x + nx * r * topScale, y + ny * r * topScale];
            rightPts[i] = [x - nx * r * botScale, y - ny * r * botScale];
            continue;
        }

        if (isClosedLoop && (capStyle === 'gungseo' || capStyle === 'bongseo' || capStyle === 'sharp')) {
            // ㅇ, ㅎ 원형 획: 좌우 기둥(|ty|≈1)은 도톰하고 상하 연결부(|tx|≈1)는 날렵한 정통 궁체 원형 필압
            const sideFullness = 0.74 + 0.36 * Math.abs(ty);
            const r = baseRadius * sideFullness;
            radii[i] = r;
            leftPts[i] = [x + nx * r * 0.96, y + ny * r * 0.96];
            rightPts[i] = [x - nx * r * 0.96, y - ny * r * 0.96];
            continue;
        }

        if (capStyle === 'gungseo' || capStyle === 'bongseo' || capStyle === 'sharp') {
            const isBong = (capStyle === 'bongseo');
            const cFactor = Math.min(1.35, contrast * 0.72);

            if (segType === 'H') {
                // 정통 궁체 가로획:
                // - 윗선(leftPts): 기필에서 살짝 솟은 뒤 완만하게 이어지다가 우측 끝(u>0.75)에서 아래로 부드럽게 숙여짐(절대 위로 나팔처럼 벌어지지 않음)
                // - 아랫선(rightPts): 중봉 허리가 탄력 있게 들어가고 우측 수필 돈필(u≈0.86)에서 아래쪽으로 둥글게 배가 맺힘
                const waist = 1.0 - 0.16 * cFactor * Math.sin(u * Math.PI);
                radii[i] = rBase * waist;

                let topScale = 0.88 * waist;
                let botScale = 0.90 * waist;

                if (!isCornerStart && !junctionInfo.hasStartJunction && u < 0.22) {
                    const tStart = (0.22 - u) / 0.22;
                    topScale += 0.22 * tStart;
                    botScale -= 0.18 * Math.pow(tStart, 1.5);
                }
                if (!isCornerEnd && !junctionInfo.hasEndJunction && u > 0.70) {
                    const tEnd = (u - 0.70) / 0.30;
                    // 우측 수필 돈필: 윗선은 완만히 내려오고 아랫배만 풍만하게 둥글림
                    topScale *= (1.0 - 0.32 * Math.pow(tEnd, 1.6));
                    botScale += (isBong ? 0.28 : 0.38) * Math.sin(tEnd * Math.PI * 0.85);
                } else if (isCornerEnd && u > 0.72) {
                    // ㄱ, ㄹ, ㅁ, ㅋ 등 우상단 전절 진입부: 돈필 어깨 형성
                    const tCorner = (u - 0.72) / 0.28;
                    topScale += 0.24 * Math.sin(tCorner * Math.PI * 0.75);
                }

                // 기필 시작점(u < 0.15)에서 좌상단 역입 기울기 부여
                const shiftAlong = (!isCornerStart && !junctionInfo.hasStartJunction && u < 0.16)
                    ? ((0.16 - u) / 0.16) * rBase * 0.42 : 0;

                leftPts[i] = [
                    x + nx * rBase * topScale - tx * shiftAlong,
                    y + ny * rBase * topScale - ty * shiftAlong
                ];
                rightPts[i] = [
                    x - nx * rBase * botScale + tx * (shiftAlong * 0.55),
                    y - ny * rBase * botScale + ty * (shiftAlong * 0.55)
                ];
            } else if (segType === 'V') {
                // 정통 궁체 세로획 (tx≈0, ty≈1 → nx=+1 우측 외곽선, -nx=-1 좌측 외곽선):
                // - 상단 기필: 좌측 외곽선(rightPts)이 좌상단에서 높게 시작하고, 우측 외곽선(leftPts)이 우하단 돈필 어깨를 형성하여 갈퀴 홈 원천 제거
                // - 하단 수필: 직선 삼각형이 아닌 볼록 방추형(Convex Parabolic Taper)으로 우아하게 모아짐
                let waist = 1.0 - 0.14 * cFactor * Math.sin(u * Math.PI);
                if (!isCornerEnd && isNeedleEnd && u > 0.62) {
                    const tTap = (u - 0.62) / 0.38;
                    waist *= Math.max(0.28, 1.0 - 0.70 * Math.pow(tTap, 1.75));
                } else if (!isCornerEnd && isBong && u > 0.78) {
                    const tTap = (u - 0.78) / 0.22;
                    waist *= (1.0 - 0.12 * tTap);
                }
                radii[i] = rBase * waist;

                let rightSideScale = 0.92 * waist; // leftPts (+nx, 기둥 오른쪽)
                let leftSideScale = 0.88 * waist;  // rightPts (-nx, 기둥 왼쪽)

                if (!isCornerStart && !junctionInfo.hasStartJunction && u < 0.24) {
                    const tStart = (0.24 - u) / 0.24;
                    // 우측 어깨(leftPts)는 u≈0.07 부근에서 도톰하게 돈필을 만들고, 좌측 머리(rightPts)는 깔끔하게 진입
                    rightSideScale += 0.26 * Math.sin((1.0 - tStart * 0.65) * Math.PI);
                    leftSideScale += 0.12 * tStart;
                }

                const headSkew = (!isCornerStart && !junctionInfo.hasStartJunction && u < 0.18)
                    ? ((0.18 - u) / 0.18) * rBase * 0.44 : 0;

                leftPts[i] = [
                    x + nx * rBase * rightSideScale + tx * (headSkew * 0.65),
                    y + ny * rBase * rightSideScale + ty * (headSkew * 0.65)
                ];
                rightPts[i] = [
                    x - nx * rBase * leftSideScale - tx * headSkew,
                    y - ny * rBase * leftSideScale - ty * headSkew
                ];
            } else {
                // 사선 삐침획(ㅅ, ㅈ, ㅊ, ㄱ 우측 다리) 및 파임획
                let envScale = 1.0 - 0.14 * cFactor * Math.sin(u * Math.PI);
                if (!isCornerEnd && isNeedleEnd && u > 0.55) {
                    // 삐침 끝(발필): 직선 송곳이 아니라 볼록한 곡선으로 부드럽게 빠짐
                    const tTap = (u - 0.55) / 0.45;
                    envScale *= Math.max(0.22, 1.0 - 0.76 * Math.pow(tTap, 1.65));
                } else if (!isCornerEnd && !isNeedleEnd && u > 0.65) {
                    // 파임 끝(ㅅ, ㅈ, ㅊ 우측 다리): 우하단으로 통통하게 맺힘
                    const tSwell = (u - 0.65) / 0.35;
                    envScale *= (1.0 + 0.22 * Math.sin(tSwell * Math.PI * 0.8));
                }
                if (isCornerStart && u < 0.20) {
                    envScale *= (1.0 + ((0.20 - u) / 0.20) * 0.14);
                }
                const r = rBase * envScale;
                radii[i] = r;
                leftPts[i] = [x + nx * r * 0.96, y + ny * r * 0.96];
                rightPts[i] = [x - nx * r * 0.94, y - ny * r * 0.94];
            }
        } else if (capStyle === 'serif') {
            let p = 0.94;
            if (!isCornerEnd && isNeedleEnd && u > 0.65) {
                const tEnd = (u - 0.65) / 0.35;
                p = 0.94 * Math.max(0.18, 1.0 - tEnd * 0.78);
            }
            const r = p * rBase;
            radii[i] = r;
            let leftScale = 1.0;
            let rightScale = 1.0;
            if (segType === 'H' && !isCornerEnd && u > 0.82 && !junctionInfo.hasEndJunction) {
                const serifT = (u - 0.82) / 0.18;
                leftScale = 1.0 + serifT * 1.25;
                rightScale = 1.0 + serifT * 0.15;
            } else if (segType === 'V' && !isCornerStart && u < 0.16 && !junctionInfo.hasStartJunction) {
                const serifT = (0.16 - u) / 0.16;
                leftScale = 1.0 + serifT * 0.45;
                rightScale = 1.0 + serifT * 0.22;
            }
            leftPts[i] = [x + nx * r * leftScale, y + ny * r * leftScale];
            rightPts[i] = [x - nx * r * rightScale, y - ny * r * rightScale];
        } else {
            // 고딕(square) 및 굴림·판본(round)
            const r = 0.94 * rBase;
            radii[i] = r;
            leftPts[i] = [x + nx * r, y + ny * r];
            rightPts[i] = [x - nx * r, y - ny * r];
        }
    }

    // 4. 굴절획(ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅋ, ㅌ) 모서리 정합 및 페어링(Fairing)
    if (!isClosedLoop && cornerSampleIndices.length > 0) {
        for (const i of cornerSampleIndices) {
            const segA = densePts[i][7] ?? 0;
            const segB = densePts[i + 1][7] ?? 0;
            let idx1 = i, idx2 = i + 1;
            for (let k = 1; k <= 5; k++) {
                if (i - k >= 0 && (densePts[i - k][7] ?? 0) === segA) idx1 = i - k;
                if (i + 1 + k < n && (densePts[i + 1 + k][7] ?? 0) === segB) idx2 = i + 1 + k;
            }
            const T1 = tangents[idx1];
            const T2 = tangents[idx2];
            const turn = T1[0] * T2[1] - T1[1] * T2[0];
            if (Math.abs(turn) < 0.12) continue;

            const rCorner = Math.max(radii[i], radii[i + 1], baseRadius);
            const outerRail = turn > 0 ? leftPts : rightPts;
            const innerRail = turn > 0 ? rightPts : leftPts;

            // (A) 내측 모서리 교점 클램핑
            const innerMeet = intersectOffsetRays(innerRail[idx1], T1, innerRail[idx2], T2, rCorner * 1.25);
            innerRail[i] = [innerMeet[0], innerMeet[1]];
            innerRail[i + 1] = [innerMeet[0], innerMeet[1]];

            for (let j = i - 1; j >= 1 && (densePts[j][7] ?? 0) === segA; j--) {
                const over = (innerRail[j][0] - innerMeet[0]) * T1[0] + (innerRail[j][1] - innerMeet[1]) * T1[1];
                if (over > -0.05) innerRail[j] = [innerMeet[0], innerMeet[1]];
                else break;
            }
            for (let j = i + 2; j < n - 2 && (densePts[j][7] ?? 0) === segB; j++) {
                const behind = (innerRail[j][0] - innerMeet[0]) * T2[0] + (innerRail[j][1] - innerMeet[1]) * T2[1];
                if (behind < 0.05) innerRail[j] = [innerMeet[0], innerMeet[1]];
                else break;
            }

            // (B) 외측 모서리 처리
            const outerMiter = intersectOffsetRays(outerRail[i], T1, outerRail[i + 1], T2, rCorner * 2.0);
            if (capStyle === 'square' || capStyle === 'serif') {
                outerRail[i] = [outerMiter[0], outerMiter[1]];
                outerRail[i + 1] = [outerMiter[0], outerMiter[1]];
            } else {
                // 궁서체·봉서체·행서체·굴림체: 뾰족한 뿔(Horn)이나 내측 계단(Step)이 절대 생기지 않도록
                // 모서리 전후 구간을 가우시안/라플라시안 페어링으로 매끄럽게 둥글림
                if (turn > 0 && (capStyle === 'gungseo' || capStyle === 'bongseo')) {
                    // 우상단 전절(ㄱ, ㄹ 1절, ㅁ 2획): +40° 방향의 둥근 돈필 어깨를 넓고 부드럽게 부여
                    const win = 6;
                    for (let k = Math.max(1, i - win); k <= Math.min(n - 2, i + 1 + win); k++) {
                        const dist = Math.abs(k - (i + 0.5)) / (win + 1);
                        const bell = Math.cos(dist * Math.PI * 0.5);
                        outerRail[k][0] += brushDx * rCorner * 0.24 * bell * bell;
                        outerRail[k][1] -= brushDy * rCorner * 0.10 * bell * bell;
                    }
                } else {
                    outerRail[i] = [
                        outerRail[i][0] * 0.45 + outerMiter[0] * 0.55,
                        outerRail[i][1] * 0.45 + outerMiter[1] * 0.55
                    ];
                    outerRail[i + 1] = [
                        outerRail[i + 1][0] * 0.45 + outerMiter[0] * 0.55,
                        outerRail[i + 1][1] * 0.45 + outerMiter[1] * 0.55
                    ];
                }

                // 외측 및 내측 레일에 국소 라플라시안 스무딩(4회)을 적용해 내측 계단 턱과 외측 각진 돌출을 완전히 제거
                const smoothWin = 7;
                const kStart = Math.max(1, i - smoothWin);
                const kEnd = Math.min(n - 2, i + 1 + smoothWin);
                for (let pass = 0; pass < 4; pass++) {
                    const outCopy = outerRail.map(p => [...p]);
                    const inCopy = innerRail.map(p => [...p]);
                    for (let k = kStart; k <= kEnd; k++) {
                        outerRail[k][0] = outCopy[k - 1][0] * 0.28 + outCopy[k][0] * 0.44 + outCopy[k + 1][0] * 0.28;
                        outerRail[k][1] = outCopy[k - 1][1] * 0.28 + outCopy[k][1] * 0.44 + outCopy[k + 1][1] * 0.28;
                        innerRail[k][0] = inCopy[k - 1][0] * 0.28 + inCopy[k][0] * 0.44 + inCopy[k + 1][0] * 0.28;
                        innerRail[k][1] = inCopy[k - 1][1] * 0.28 + inCopy[k][1] * 0.44 + inCopy[k + 1][1] * 0.28;
                    }
                }
            }
        }
    }

    // 5. 기필(Start Cap) 및 수필(End Cap) 마감 캡 합성
    const endPt = densePts[n - 1];
    const [etx, ety] = tangents[n - 1];
    const endSegType = densePts[n - 1][4] || 'H';
    let endCapCmd = '';
    let endCtrlPt = null;

    if (isClosedLoop || junctionInfo.hasEndJunction) {
        endCapCmd = `L ${rightPts[n - 1][0].toFixed(2)} ${rightPts[n - 1][1].toFixed(2)} `;
    } else if (isNeedleEnd) {
        // 연필심 같은 직선 삼각형 대신 붓털이 모이는 부드러운 2차 곡선(Q) 마감
        const needleLen = baseRadius * (capStyle === 'gungseo' ? 0.68 : 0.55);
        const midEndX = (leftPts[n - 1][0] + rightPts[n - 1][0]) * 0.5 + etx * needleLen;
        const midEndY = (leftPts[n - 1][1] + rightPts[n - 1][1]) * 0.5 + ety * needleLen;
        endCtrlPt = [midEndX, midEndY];
        endCapCmd = `Q ${midEndX.toFixed(2)} ${midEndY.toFixed(2)} ${rightPts[n - 1][0].toFixed(2)} ${rightPts[n - 1][1].toFixed(2)} `;
    } else if (capStyle === 'gungseo' || capStyle === 'bongseo' || capStyle === 'sharp') {
        const donR = radii[n - 1] * (capStyle === 'bongseo' ? 0.85 : 0.78);
        const dropY = (endSegType === 'H') ? donR * 0.35 : 0;
        const midEndX = (leftPts[n - 1][0] + rightPts[n - 1][0]) * 0.5 + etx * donR;
        const midEndY = (leftPts[n - 1][1] + rightPts[n - 1][1]) * 0.5 + ety * donR + dropY;
        endCtrlPt = [midEndX, midEndY];
        endCapCmd = `Q ${midEndX.toFixed(2)} ${midEndY.toFixed(2)} ${rightPts[n - 1][0].toFixed(2)} ${rightPts[n - 1][1].toFixed(2)} `;
    } else if (capStyle === 'round') {
        const endR = radii[n - 1] * 0.88;
        const tipX = endPt[0] + etx * endR;
        const tipY = endPt[1] + ety * endR;
        endCtrlPt = [tipX, tipY];
        endCapCmd = `Q ${tipX.toFixed(2)} ${tipY.toFixed(2)} ${rightPts[n - 1][0].toFixed(2)} ${rightPts[n - 1][1].toFixed(2)} `;
    } else {
        // square 및 serif: 자유 끝점 및 L자 모서리에서 반경(r)만큼 직각 연장하여 ㄷ, ㄹ, ㅁ, ㅌ 외각 모서리의 빈 틈(Notch)을 100% 메움
        const ext = radii[n - 1] * (capStyle === 'serif' ? 0.55 : 0.90);
        const eLx = leftPts[n - 1][0] + etx * ext, eLy = leftPts[n - 1][1] + ety * ext;
        const eRx = rightPts[n - 1][0] + etx * ext, eRy = rightPts[n - 1][1] + ety * ext;
        endCtrlPt = [(eLx + eRx) * 0.5, (eLy + eRy) * 0.5];
        endCapCmd = `L ${eLx.toFixed(2)} ${eLy.toFixed(2)} L ${eRx.toFixed(2)} ${eRy.toFixed(2)} L ${rightPts[n - 1][0].toFixed(2)} ${rightPts[n - 1][1].toFixed(2)} `;
    }

    const startPt = densePts[0];
    const [stx, sty] = tangents[0];
    let startCapSuffix = 'Z';
    let startCtrlPt = null;

    if (isClosedLoop || junctionInfo.hasStartJunction) {
        startCapSuffix = `L ${leftPts[0][0].toFixed(2)} ${leftPts[0][1].toFixed(2)} Z`;
    } else if (capStyle === 'gungseo' || capStyle === 'bongseo' || capStyle === 'sharp') {
        // rightPts[0]과 leftPts[0]의 중점에서 진행 반대 방향으로 볼록한 2차 곡선을 그려 오목한 갈퀴 홈이 절대 생기지 않게 함
        const yeokR = radii[0] * 0.52;
        const midStartX = (leftPts[0][0] + rightPts[0][0]) * 0.5 - stx * yeokR;
        const midStartY = (leftPts[0][1] + rightPts[0][1]) * 0.5 - sty * yeokR;
        startCtrlPt = [midStartX, midStartY];
        startCapSuffix = `Q ${midStartX.toFixed(2)} ${midStartY.toFixed(2)} ${leftPts[0][0].toFixed(2)} ${leftPts[0][1].toFixed(2)} Z`;
    } else if (capStyle === 'serif') {
        const ext = radii[0] * 0.65;
        const sRx = rightPts[0][0] - stx * ext, sRy = rightPts[0][1] - sty * ext;
        const sLx = leftPts[0][0] - stx * (ext * 0.45), sLy = leftPts[0][1] - sty * (ext * 0.45);
        startCtrlPt = [(sRx + sLx) * 0.5, (sRy + sLy) * 0.5];
        startCapSuffix = `L ${sRx.toFixed(2)} ${sRy.toFixed(2)} L ${sLx.toFixed(2)} ${sLy.toFixed(2)} L ${leftPts[0][0].toFixed(2)} ${leftPts[0][1].toFixed(2)} Z`;
    } else if (capStyle === 'round') {
        const startR = radii[0] * 0.85;
        const stipX = startPt[0] - stx * startR;
        const stipY = startPt[1] - sty * startR;
        startCtrlPt = [stipX, stipY];
        startCapSuffix = `Q ${stipX.toFixed(2)} ${stipY.toFixed(2)} ${leftPts[0][0].toFixed(2)} ${leftPts[0][1].toFixed(2)} Z`;
    } else {
        // square: 자유 시작점 및 L자 모서리에서 반경(r)만큼 직각 후방 연장하여 ㄷ, ㄹ, ㅁ, ㅌ 외각 모서리 빈 틈 제거
        const ext = radii[0] * 0.90;
        const sRx = rightPts[0][0] - stx * ext, sRy = rightPts[0][1] - sty * ext;
        const sLx = leftPts[0][0] - stx * ext, sLy = leftPts[0][1] - sty * ext;
        startCtrlPt = [(sRx + sLx) * 0.5, (sRy + sLy) * 0.5];
        startCapSuffix = `L ${sRx.toFixed(2)} ${sRy.toFixed(2)} L ${sLx.toFixed(2)} ${sLy.toFixed(2)} L ${leftPts[0][0].toFixed(2)} ${leftPts[0][1].toFixed(2)} Z`;
    }

    const boundPts = [...leftPts, ...rightPts];
    if (endCtrlPt) {
        const p0 = leftPts[n - 1], p2 = rightPts[n - 1];
        for (const t of [0.2, 0.35, 0.5, 0.65, 0.8]) {
            const mt = 1 - t;
            boundPts.push([
                mt * mt * p0[0] + 2 * mt * t * endCtrlPt[0] + t * t * p2[0],
                mt * mt * p0[1] + 2 * mt * t * endCtrlPt[1] + t * t * p2[1]
            ]);
        }
    }
    if (startCtrlPt) {
        const p0 = rightPts[0], p2 = leftPts[0];
        for (const t of [0.2, 0.35, 0.5, 0.65, 0.8]) {
            const mt = 1 - t;
            boundPts.push([
                mt * mt * p0[0] + 2 * mt * t * startCtrlPt[0] + t * t * p2[0],
                mt * mt * p0[1] + 2 * mt * t * startCtrlPt[1] + t * t * p2[1]
            ]);
        }
    }

    const rightReversed = [];
    for (let i = n - 1; i >= 0; i--) rightReversed.push(rightPts[i]);

    let fullPathD = `M ${leftPts[0][0].toFixed(2)} ${leftPts[0][1].toFixed(2)} `;
    fullPathD += pointsToContourCmds(leftPts, useSmoothSpline);
    fullPathD += endCapCmd;
    fullPathD += pointsToContourCmds(rightReversed, useSmoothSpline);
    fullPathD += startCapSuffix;

    return { fullPathD, leftPts, rightPts, boundPts, tangents, radii, startCapSuffix, isClosedLoop, useSmoothSpline };
}

function buildProgressiveStrokePath(env, stepIdx) {
    if (!env || !env.leftPts || env.leftPts.length < 2) return '';
    const n = env.leftPts.length;
    if (stepIdx >= n) return env.fullPathD;

    const m = Math.max(2, stepIdx);
    const { leftPts, rightPts, tangents, radii, startCapSuffix, useSmoothSpline } = env;

    const subLeft = leftPts.slice(0, m);
    const subRightRev = [];
    for (let i = m - 1; i >= 0; i--) subRightRev.push(rightPts[i]);

    let d = `M ${subLeft[0][0].toFixed(2)} ${subLeft[0][1].toFixed(2)} `;
    d += pointsToContourCmds(subLeft, useSmoothSpline);

    const k = m - 1;
    const [tx, ty] = tangents[k];
    const rHead = (radii[k] || 2.5) * 0.55;
    const midX = (leftPts[k][0] + rightPts[k][0]) * 0.5 + tx * rHead;
    const midY = (leftPts[k][1] + rightPts[k][1]) * 0.5 + ty * rHead;
    d += `Q ${midX.toFixed(2)} ${midY.toFixed(2)} ${rightPts[k][0].toFixed(2)} ${rightPts[k][1].toFixed(2)} `;

    d += pointsToContourCmds(subRightRev, useSmoothSpline);
    d += startCapSuffix;
    return d;
}

function buildBrushPolygonPath(densePts, styleParams) {
    return buildStrokeEnvelope(densePts, styleParams).fullPathD;
}

  // ────────────────────────────────────────────────────────────────────────────
  // 1. 단일/다중 음절 절차적 자소 배치 및 골격 생성 (Procedural Layout Assembler)
  // ────────────────────────────────────────────────────────────────────────────

  function assembleJamoEntries(validChars) {
    const jamoEntries = [];
    validChars.forEach((info, charIdx) => {
      if (info.single) {
        jamoEntries.push({
          ci: charIdx, norm: getJamoStrokes(info.single), box: [15, 15, 70, 70], pScale: 1.1,
          part: 'single', subPart: 'single', vType: 'V', hasJong: false, jongChar: ''
        });
      } else {
        const vType = VOWEL_TYPE[info.jung] || 'V';
        const hasJong = !!info.jong;
        const jongChar = info.jong || '';
        const boxes = getLayoutBoxes(vType, hasJong, jongChar);

        if (COMPOUND_VOWEL[info.jung]) {
          const [h, v] = COMPOUND_VOWEL[info.jung];
          if (!hasJong) {
            // [Type 3] 받침 없는 복합 모음 ('귀', '화', '과', '위', '의') - 황금비 조형 확립
            const cBox = [16, 12, 40, 31];
            const hBox = h === 'ㅜ' ? [15, 38, 42, 28] : (h === 'ㅗ' ? [15, 39, 42, 27] : [15, 38, 42, 24]);
            const vHeight = 62;
            const vBox = (v === 'ㅓ' || v === 'ㅔ') ? [56, 12, 26, vHeight] : [58, 12, 24, vHeight];
            jamoEntries.push({ ci: charIdx, jamoChar: info.cho, norm: getJamoStrokes(info.cho), box: cBox, pScale: 0.96, part: 'cho', subPart: 'cho', vType, hasJong, jongChar });
            jamoEntries.push({ ci: charIdx, jamoChar: h, norm: getJamoStrokes(h), box: hBox, pScale: 0.94, part: 'jung', subPart: 'jung_h', vType, hasJong, jongChar });
            jamoEntries.push({ ci: charIdx, jamoChar: v, norm: getJamoStrokes(v), box: vBox, pScale: 0.96, part: 'jung', subPart: 'jung_v', vType, hasJong, jongChar });
          } else {
            // [Type 6] 받침 있는 복합 모음 ('환', '광', '권')
            const vH = 46;
            const cBox = [16, 11, 38, 25];
            const hBox = h === 'ㅜ' ? [15, 33, 40, 18] : (h === 'ㅗ' ? [15, 34, 40, 18] : [15, 34, 40, 15]);
            const vBox = (v === 'ㅓ' || v === 'ㅔ') ? [55, 11, 26, vH] : [57, 11, 24, vH];
            jamoEntries.push({ ci: charIdx, jamoChar: info.cho, norm: getJamoStrokes(info.cho), box: cBox, pScale: 0.92, part: 'cho', subPart: 'cho', vType, hasJong, jongChar });
            jamoEntries.push({ ci: charIdx, jamoChar: h, norm: getJamoStrokes(h), box: hBox, pScale: 0.90, part: 'jung', subPart: 'jung_h', vType, hasJong, jongChar });
            jamoEntries.push({ ci: charIdx, jamoChar: v, norm: getJamoStrokes(v), box: vBox, pScale: 0.94, part: 'jung', subPart: 'jung_v', vType, hasJong, jongChar });
          }
        } else {
          jamoEntries.push({ ci: charIdx, jamoChar: info.cho, norm: getJamoStrokes(info.cho), box: [...boxes.cho], pScale: 1.0, part: 'cho', subPart: 'cho', vType, hasJong, jongChar });
          jamoEntries.push({ ci: charIdx, jamoChar: info.jung, norm: getJamoStrokes(info.jung), box: [...boxes.jung], pScale: 1.0, part: 'jung', subPart: 'jung', vType, hasJong, jongChar });
        }
        if (hasJong) {
          jamoEntries.push({ ci: charIdx, jamoChar: info.jong, norm: getJamoStrokes(info.jong), box: [...boxes.jong], pScale: 0.92, part: 'jong', subPart: 'jong', vType, hasJong, jongChar });
        }
      }
    });
    return jamoEntries;
  }

  function initProceduralBoxes(jamoEntries, styleParams) {
    const br = styleParams.baseRadius || 3.3;
    const thick = br > 2.4;

    // 음절별 초성/중성 자소 정보 맵 구축 (자형별 광학적 커닝 보정용)
    const syllInfo = {};
    (jamoEntries || []).forEach(e => {
      if (!syllInfo[e.ci]) syllInfo[e.ci] = {};
      if (e.part === 'cho') syllInfo[e.ci].cho = e.jamoChar || '';
      if (e.part === 'jung' && e.subPart !== 'jung_h') syllInfo[e.ci].jung = e.jamoChar || '';
      if (e.subPart === 'jung_h') syllInfo[e.ci].jungH = e.jamoChar || '';
    });

    (jamoEntries || []).forEach(e => {
      const nSt = e.norm ? e.norm.length : 1;
      e.pso = (e.norm || []).map(() => [0, 0]);
      if (e.part === 'single') {
        e.pbox = [...e.box];
        e.rScale = 1.0;
        return;
      }

      const sCho = syllInfo[e.ci]?.cho || '';
      const sJung = syllInfo[e.ci]?.jung || '';
      const sJungH = syllInfo[e.ci]?.jungH || '';
      // 안쪽으로 오목하게 들어간 초성 자형 ('ㅅ', 'ㅆ', 'ㅈ', 'ㅉ', 'ㅊ')
      const isSlantedCho = ['ㅅ', 'ㅆ', 'ㅈ', 'ㅉ', 'ㅊ'].includes(sCho);
      // 왼쪽으로 뻗는 가로획 모음 ('ㅓ', 'ㅕ', 'ㅔ', 'ㅖ')
      const isLeftJung = ['ㅓ', 'ㅕ', 'ㅔ', 'ㅖ'].includes(sJung);

      if (!e.hasJong) {
        if (e.vType === 'V') {
          // [Type 1] 받침 없는 세로 모음 ('하', '가', '다', '서'): 초성-중성 긴밀 밀착
          let jungBox = [49, 12, 30, 76];
          if (isSlantedCho && isLeftJung) {
            jungBox = [43, 12, 36, 76];
          } else if (isSlantedCho) {
            jungBox = [47, 12, 32, 76];
          }
          e.pbox = (e.part === 'cho') ? [14, 14, 38, 62] : jungBox;
          e.rScale = thick ? (nSt >= 3 ? 0.86 : 0.92) : 1.0;
        } else if (e.vType === 'H') {
          // [Type 2] 받침 없는 가로 모음 ('호', '고', '도'): 초성-가로모음 상하 밀착
          e.pbox = (e.part === 'cho') ? [22, 13, 56, 36] : [14, 46, 72, 34];
          e.rScale = thick ? (nSt >= 3 ? 0.85 : 0.92) : 1.0;
        } else {
          // [Type 3] 받침 없는 복합 모음 ('귀', '화', '과', '위', '의'): 황금비 조형 확립
          const vHeight = 62;
          let vBox = (sJung === 'ㅓ' || sJung === 'ㅔ') ? [56, 12, 26, vHeight] : [58, 12, 24, vHeight];
          let hBox = (e.jamoChar === 'ㅜ') ? [15, 38, 42, 28] : ((e.jamoChar === 'ㅗ') ? [15, 39, 42, 27] : [15, 38, 42, 24]);
          if (e.subPart === 'cho') e.pbox = [16, 12, 40, 31];
          else if (e.subPart === 'jung_h') e.pbox = hBox;
          else e.pbox = vBox;
          e.rScale = thick ? (nSt >= 3 ? 0.78 : 0.85) : 0.94;
        }
      } else {
        if (e.vType === 'V') {
          // [Type 4] 삼분할 결합 구조 ('한', '간', '산', '성', '달'): 상하단 빈틈없이 밀착
          let jungBox = [49, 11, 30, 48];
          if (isSlantedCho && isLeftJung) {
            jungBox = [43, 11, 36, 48];
          } else if (isSlantedCho) {
            jungBox = [47, 11, 32, 48];
          }
          if (e.part === 'cho') e.pbox = [14, 12, 38, 42];
          else if (e.part === 'jung') e.pbox = jungBox;
          else e.pbox = [20, 60, 60, 26];
          e.rScale = thick ? (nSt >= 3 ? 0.78 : 0.85) : 0.95;
        } else if (e.vType === 'H') {
          // [Type 5] 삼단 상중하 결합 구조 ('글', '문', '국', '물'): 3단 층간 간격 긴밀화
          if (e.part === 'cho') e.pbox = [22, 11, 56, 26];
          else if (e.part === 'jung') e.pbox = [14, 39, 72, 16];
          else e.pbox = [22, 59, 56, 26];
          e.rScale = thick ? (nSt >= 3 ? 0.75 : 0.82) : 0.92;
        } else {
          // [Type 6] 받침 있는 복합 모음 ('환', '광', '권')
          let vBox = (sJung === 'ㅓ' || sJung === 'ㅔ') ? [55, 11, 26, 46] : [57, 11, 24, 46];
          let hBox = (e.jamoChar === 'ㅜ') ? [15, 33, 40, 18] : ((e.jamoChar === 'ㅗ') ? [15, 34, 40, 18] : [15, 34, 40, 15]);
          if (e.subPart === 'cho') e.pbox = [16, 11, 38, 25];
          else if (e.subPart === 'jung_h') e.pbox = hBox;
          else if (e.subPart === 'jung_v') e.pbox = vBox;
          else e.pbox = [20, 60, 60, 26];
          e.rScale = thick ? (nSt >= 3 ? 0.70 : 0.78) : 0.90;
        }
      }
    });
  }

  function entriesToRaw(jamoEntries, styleParams, charCount) {
    const per = [];
    const metaPer = [];
    for (let i = 0; i < charCount; i++) { per.push([]); metaPer.push([]); }
    (jamoEntries || []).forEach((e, ei) => {
      const b = e.pbox || e.box;
      const normWelded = normalizeJamoStrokes(e.norm, styleParams, e.part || 'cho');
      const mapped = mapSubBox(normWelded, e.ci * 100 + b[0], b[1], b[2], b[3], e.pScale);
      if (e.pso) mapped.forEach((st, i) => st.forEach(p => { p[0] += e.pso[i][0]; p[1] += e.pso[i][1]; }));
      per[e.ci].push(...mapped);
      mapped.forEach(() => metaPer[e.ci].push({
        ci: e.ci,
        ei,
        part: e.part || 'single',
        subPart: e.subPart || 'single',
        rScale: e.rScale || 1.0,
        vType: e.vType || 'V',
        hasJong: !!e.hasJong,
        jongChar: e.jongChar || ''
      }));
    });
    return { rawCharStrokes: per, strokeMeta: metaPer.flat() };
  }

  function optimizeProceduralClearance(jamoEntries, runBuild, styleParams, charCount) {
    let built = runBuild();
    for (let iter = 0; iter < 4; iter++) {
      let changed = false;
      for (let ci = 0; ci < charCount; ci++) {
        const parts = {};
        const entryStrokes = new Map();
        built.strokeEnvelopes.forEach((env, s) => {
          const m = built.strokeMeta[s];
          if (!m || m.ci !== ci || m.part === 'single') return;
          const localPts = (env.boundPts || []).map(p => [p[0] - ci * 100, p[1]]);
          if (!localPts.length) return;
          let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
          localPts.forEach(([x, y]) => {
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
          });
          if (!parts[m.subPart]) {
            parts[m.subPart] = { minX, maxX, minY, maxY, pts: [...localPts], e: jamoEntries[m.ei] };
          } else {
            const P = parts[m.subPart];
            if (minX < P.minX) P.minX = minX; if (maxX > P.maxX) P.maxX = maxX;
            if (minY < P.minY) P.minY = minY; if (maxY > P.maxY) P.maxY = maxY;
            P.pts.push(...localPts);
          }
          if (!entryStrokes.has(m.ei)) entryStrokes.set(m.ei, []);
          entryStrokes.get(m.ei).push({ s, minY, maxY, pts: localPts, seg0: built.strokes[s][0][4] });
        });

        entryStrokes.forEach((stList, ei) => {
          if (stList.length >= 3 && (stList[0].seg0 === 'DOT' || stList[2].seg0 === 'O')) {
            const e = jamoEntries[ei];
            const gap01 = stList[1].minY - stList[0].maxY;
            const gap12 = stList[2].minY - stList[1].maxY;
            if (gap01 < 1.8) {
              e.pso[0][1] -= (1.8 - gap01) * 0.75;
              if (e.rScale > 0.62) e.rScale *= 0.95;
              changed = true;
            }
            if (stList[2].seg0 === 'O' && gap12 < 1.8) {
              e.pso[2][1] += (1.8 - gap12) * 0.75;
              if (e.rScale > 0.62) e.rScale *= 0.95;
              changed = true;
            }
          }
        });

        const shiftPart = (P, dx, dy) => {
          if (!P || (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05)) return;
          P.e.pbox[0] += dx;
          P.e.pbox[1] += dy;
          P.minX += dx; P.maxX += dx;
          P.minY += dy; P.maxY += dy;
          changed = true;
        };

        const cho = parts.cho;
        if (!cho) continue;
        const vType = cho.e.vType;
        const hasJong = cho.e.hasJong;
        const choChar = cho.e.jamoChar || '';

        if (vType === 'V' && !hasJong && parts.jung) {
          const jung = parts.jung;
          const jungChar = jung.e.jamoChar || '';
          const isSlantedCho = ['ㅅ', 'ㅆ', 'ㅈ', 'ㅉ', 'ㅊ'].includes(choChar);
          const isLeftJung = ['ㅓ', 'ㅕ', 'ㅔ', 'ㅖ'].includes(jungChar);
          const isRoundCho = ['ㅇ', 'ㅎ'].includes(choChar);
          const isOpenCho = ['ㄱ', 'ㅋ'].includes(choChar);

          // 기본 세로모음 좌우 간격 긴밀 밀착 (3.8)
          let targetGapX = 3.8;
          let jungShiftRatio = 0.5;
          if (isSlantedCho && isLeftJung) {
            targetGapX = -6.2;       // '서', '세': 'ㅓ'의 가로점이 'ㅅ' 우측 꼬리 안쪽으로 파고듦
            jungShiftRatio = 0.90;
          } else if (isSlantedCho) {
            targetGapX = 3.2;
            jungShiftRatio = 0.75;
          } else if ((isOpenCho || isRoundCho) && isLeftJung) {
            targetGapX = 1.6;
            jungShiftRatio = 0.70;
          }

          const curGapX = jung.minX - cho.maxX;
          const diffX = curGapX - targetGapX;
          shiftPart(cho, diffX * (1 - jungShiftRatio), 0);
          shiftPart(jung, -diffX * jungShiftRatio, 0);
          const targetChoMidY = (jung.minY + jung.maxY) * 0.5 - 2.0;
          const curChoMidY = (cho.minY + cho.maxY) * 0.5;
          shiftPart(cho, 0, (targetChoMidY - curChoMidY) * 0.6);
        } else if (vType === 'V' && hasJong && parts.jung && parts.jong) {
          const jung = parts.jung;
          const jong = parts.jong;
          const jungChar = jung.e.jamoChar || '';
          const isSlantedCho = ['ㅅ', 'ㅆ', 'ㅈ', 'ㅉ', 'ㅊ'].includes(choChar);
          const isLeftJung = ['ㅓ', 'ㅕ', 'ㅔ', 'ㅖ'].includes(jungChar);
          const isRoundCho = ['ㅇ', 'ㅎ'].includes(choChar);
          const isOpenCho = ['ㄱ', 'ㅋ'].includes(choChar);

          // 받침 있는 글자 ('성', '한', '산', '정', '달' 등)
          let targetGapX = 3.4;
          let jungShiftRatio = 0.5;
          if (isSlantedCho && isLeftJung) {
            targetGapX = -6.8;       // '성', '정': 'ㅓ'의 가로점이 'ㅅ' 안쪽으로 깊숙이 침투
            jungShiftRatio = 0.90;
          } else if (isSlantedCho) {
            targetGapX = 2.8;
            jungShiftRatio = 0.75;
          } else if ((isOpenCho || isRoundCho) && isLeftJung) {
            targetGapX = 1.4;
            jungShiftRatio = 0.70;
          }

          const targetGapY = 3.2;    // 상단과 종성의 수직 여백을 단단하게 축소
          const curGapX = jung.minX - cho.maxX;
          const diffX = curGapX - targetGapX;
          shiftPart(cho, diffX * (1 - jungShiftRatio), 0);
          shiftPart(jung, -diffX * jungShiftRatio, 0);
          const targetChoMaxY = jung.maxY - 1.2;
          shiftPart(cho, 0, targetChoMaxY - cho.maxY);
          const upperMaxY = Math.max(cho.maxY, jung.maxY);
          const curGapY = jong.minY - upperMaxY;
          const diffY = curGapY - targetGapY;
          shiftPart(cho, 0, diffY * 0.45);
          shiftPart(jung, 0, diffY * 0.45);
          shiftPart(jong, 0, -diffY * 0.55);
        } else if (vType === 'H' && !hasJong && parts.jung) {
          const jung = parts.jung;
          const targetGapY = 2.6;    // 초성과 가로모음 상하 간격 긴밀화
          const curGapY = jung.minY - cho.maxY;
          const diffY = curGapY - targetGapY;
          shiftPart(cho, 0, diffY * 0.5);
          shiftPart(jung, 0, -diffY * 0.5);
        } else if (vType === 'H' && hasJong && parts.jung && parts.jong) {
          const jung = parts.jung;
          const jong = parts.jong;
          const targetGap1 = 2.2;    // 초성-중성 층간 밀착
          const targetGap2 = 2.5;    // 중성-종성 층간 밀착
          const curGap1 = jung.minY - cho.maxY;
          const curGap2 = jong.minY - jung.maxY;
          shiftPart(cho, 0, curGap1 - targetGap1);
          shiftPart(jong, 0, -(curGap2 - targetGap2));
        } else if (vType === 'C' && !hasJong && parts.jung_h && parts.jung_v) {
          // [Type 3] 받침 없는 복합 모음 ('귀', '화', '과', '줘', '춰', '의', '위')
          // 1. 초성과 가로모음('ㅜ', 'ㅗ')을 바짝 밀착 (틈새 완전 제거)
          const jungH = parts.jung_h;
          const jungV = parts.jung_v;
          const isSlantedCho = ['ㅅ', 'ㅆ', 'ㅈ', 'ㅉ', 'ㅊ'].includes(choChar);
          const isLeftJung = ['ㅓ', 'ㅕ', 'ㅔ', 'ㅖ'].includes(jungV.e.jamoChar || '');
          const targetGapY = 0.6;    // 초성과 'ㅜ'/'ㅗ'의 수직 틈새를 먹선 기준 살짝 닿는 황금 밀착
          const curGapY = jungH.minY - cho.maxY;
          const diffY = curGapY - targetGapY;
          shiftPart(jungH, 0, -diffY * 0.65);
          shiftPart(cho, 0, diffY * 0.35);

          // 2. 좌측 블록(초성+가로모음)과 우측 세로모음('ㅣ', 'ㅏ')의 수평 간격 황금비 (3.6)
          const leftBlockMaxX = Math.max(cho.maxX, jungH.maxX);
          const targetGapX = (isSlantedCho && isLeftJung) ? 2.6 : (isSlantedCho ? 3.2 : 3.6);
          const curGapX = jungV.minX - leftBlockMaxX;
          const diffX = curGapX - targetGapX;
          shiftPart(cho, diffX * 0.20, 0);
          shiftPart(jungH, diffX * 0.20, 0);
          shiftPart(jungV, -diffX * 0.80, 0);

          // 3. 세로모음('ㅣ')의 하단을 가로모음 하단과 평형 정렬 (짝다리 하향 돌출 방지)
          const bottomDiff = jungV.maxY - jungH.maxY;
          if (bottomDiff > 1.2) {
            shiftPart(jungV, 0, -(bottomDiff - 0.5) * 0.75);
          }
        } else if (vType === 'C' && hasJong && parts.jung_h && parts.jung_v && parts.jong) {
          // [Type 6] 받침 있는 복합 모음 ('환', '광', '권')
          const jungH = parts.jung_h;
          const jungV = parts.jung_v;
          const jong = parts.jong;
          const curGapY1 = jungH.minY - cho.maxY;
          shiftPart(jungH, 0, -(curGapY1 - 0.6) * 0.7);
          shiftPart(cho, 0, (curGapY1 - 0.6) * 0.3);
          const upperMaxY = Math.max(jungH.maxY, jungV.maxY);
          const curGapY2 = jong.minY - upperMaxY;
          shiftPart(jong, 0, -(curGapY2 - 2.8) * 0.6);
          const leftBlockMaxX = Math.max(cho.maxX, jungH.maxX);
          const curGapX = jungV.minX - leftBlockMaxX;
          shiftPart(jungV, -(curGapX - 3.4) * 0.75, 0);
        }

        // 시각적 중심(Optical Center) 보정: x = 50.0, y = 48.5 로 미세 상향 보정 (하향 처짐 착시 교정)
        const allParts = Object.values(parts);
        if (allParts.length > 0) {
          let sMinX = 1e9, sMaxX = -1e9, sMinY = 1e9, sMaxY = -1e9;
          allParts.forEach(P => {
            if (P.minX < sMinX) sMinX = P.minX; if (P.maxX > sMaxX) sMaxX = P.maxX;
            if (P.minY < sMinY) sMinY = P.minY; if (P.maxY > sMaxY) sMaxY = P.maxY;
          });
          const cx = (sMinX + sMaxX) * 0.5;
          const cy = (sMinY + sMaxY) * 0.5;
          const dxAll = (50.0 - cx) * 0.65;
          const dyAll = (48.5 - cy) * 0.65;
          const seenE = new Set();
          allParts.forEach(P => {
            if (!seenE.has(P.e)) {
              seenE.add(P.e);
              shiftPart(P, dxAll, dyAll);
            }
          });
        }
      }
      if (!changed) break;
      built = runBuild();
    }
    return built;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 2. 획순 번호 배지 충돌 방지 알고리즘 (Collision-Free Numbered Badges)
  // ────────────────────────────────────────────────────────────────────────────

  function calculateBadgePositions(strokes) {
    const placedBadges = [];
    const MIN_DIST = 6.2;
    const strokeStartInfos = strokes.map((densePts, idx) => {
      let [sx, sy] = densePts[0];
      const lookIdx = Math.min(densePts.length - 1, 6);
      const dx = densePts[lookIdx][0] - sx;
      const dy = densePts[lookIdx][1] - sy;
      const dLen = Math.hypot(dx, dy) || 1;
      return { idx, sx, sy, ux: dx / dLen, uy: dy / dLen };
    });

    return strokeStartInfos.map((info, idx) => {
      const { sx, sy, ux, uy } = info;
      const hasOverlap = (cx, cy) => placedBadges.some(p => Math.hypot(cx - p.bx, cy - p.by) < MIN_DIST);
      const sameOriginGroup = strokeStartInfos.filter(other => Math.hypot(other.sx - sx, other.sy - sy) < 3.8);
      const orderInGroup = sameOriginGroup.findIndex(other => other.idx === idx);

      let bx = sx;
      let by = sy;

      if (orderInGroup > 0 || hasOverlap(bx, by)) {
        if (orderInGroup === 1) {
          const firstStroke = sameOriginGroup[0];
          const firstBadge = placedBadges[firstStroke.idx];
          if (firstBadge && Math.hypot(firstBadge.bx - firstStroke.sx, firstBadge.by - firstStroke.sy) < 1.0) {
            const shift1X = firstStroke.sx + firstStroke.ux * 3.4;
            const shift1Y = firstStroke.sy + firstStroke.uy * 3.4;
            const otherConflict = placedBadges.some((p, pIdx) => pIdx !== firstStroke.idx && Math.hypot(shift1X - p.bx, shift1Y - p.by) < MIN_DIST);
            if (!otherConflict) {
              firstBadge.bx = shift1X;
              firstBadge.by = shift1Y;
            }
          }
        }

        const candidates = [];
        for (let step = 3.4; step <= 13.0; step += 1.1) {
          candidates.push([sx + ux * step, sy + uy * step]);
        }
        const nx = -uy, ny = ux;
        for (let dist = 4.2; dist <= 12.0; dist += 1.4) {
          candidates.push(
            [sx - ux * (dist * 0.7) + nx * (dist * 0.7), sy - uy * (dist * 0.7) + ny * (dist * 0.7)],
            [sx - ux * (dist * 0.7) - nx * (dist * 0.7), sy - uy * (dist * 0.7) - ny * (dist * 0.7)],
            [sx + ux * (dist * 0.6) + nx * (dist * 0.8), sy + uy * (dist * 0.6) + ny * (dist * 0.8)],
            [sx + ux * (dist * 0.6) - nx * (dist * 0.8), sy + uy * (dist * 0.6) - ny * (dist * 0.8)],
            [sx - dist, sy],
            [sx, sy + dist],
            [sx + dist, sy],
            [sx, sy - dist]
          );
        }

        for (const [cx, cy] of candidates) {
          if (!hasOverlap(cx, cy)) {
            bx = cx;
            by = cy;
            break;
          }
        }
      }

      const posObj = { sx, sy, bx, by };
      placedBadges.push(posObj);
      return posObj;
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 3. 고수준 통합 API (High-level Public Interface)
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * 단일 음절 또는 텍스트의 획순 및 2D 모필 엔벨로프 계산
   */
  function composeChar(rawChar, styleKeyOrParams = 'bongseo') {
    const styleParams = typeof styleKeyOrParams === 'string'
      ? (STYLE_PRESETS[styleKeyOrParams] || STYLE_PRESETS.bongseo)
      : Object.assign({}, STYLE_PRESETS.bongseo, styleKeyOrParams);

    const validChars = [];
    const cleaned = (rawChar || '').replace(/\s+/g, '').slice(0, 6);
    for (const ch of cleaned) {
      const info = decomposeHangul(ch);
      if (info) validChars.push(info);
    }

    if (!validChars.length) return null;
    const charCount = validChars.length;
    const jamoEntries = assembleJamoEntries(validChars);
    initProceduralBoxes(jamoEntries, styleParams);

    const runBuild = () => {
      const { rawCharStrokes, strokeMeta } = entriesToRaw(jamoEntries, styleParams, charCount);
      const flatRaw = rawCharStrokes.flat();
      const strokes = flatRaw.map(rawCtrl => buildProceduralStrokePoints(rawCtrl, styleParams));
      const strokeJunctions = computeStrokeJunctions(strokes, styleParams.baseRadius, strokeMeta);
      strokeJunctions.forEach((j, idx) => {
        j.rScale = strokeMeta[idx] ? strokeMeta[idx].rScale : 1.0;
      });
      const strokeEnvelopes = strokes.map((pts, idx) =>
        buildStrokeEnvelope(pts, styleParams, strokeJunctions[idx])
      );
      return { strokes, strokeEnvelopes, strokeMeta };
    };

    const built = optimizeProceduralClearance(jamoEntries, runBuild, styleParams, charCount);

    const badgePositions = calculateBadgePositions(built.strokes);

    // 각 획 중심선 경로(d) 및 길이 계산
    const strokePlans = built.strokes.map((pts, idx) => {
      let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
      let totalLen = 0;
      for (let i = 1; i < pts.length; i++) {
        d += ` L ${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)}`;
        totalLen += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      }
      return {
        idx,
        centerlineD: d,
        length: Math.max(1, totalLen),
        envelopeD: built.strokeEnvelopes[idx].fullPathD,
        badge: badgePositions[idx],
        densePts: pts,
        envelope: built.strokeEnvelopes[idx]
      };
    });

    return {
      char: cleaned,
      charCount,
      styleParams,
      strokes: built.strokes,
      strokeEnvelopes: built.strokeEnvelopes,
      strokeMeta: built.strokeMeta,
      badgePositions,
      strokePlans,
      totalStrokes: built.strokes.length
    };
  }

  /**
   * SVG 문자열 렌더러 (웹 시뮬레이터 및 브라우저 호환)
   */
  function renderSvg(rawChar, opts = {}) {
    const options = Object.assign({
      style: 'bongseo',
      speed: 1.0,
      showGrid: true,
      showNumbers: true,
      showSpines: true,
      showBgBrush: true,
      animated: true,
      activeStroke: -1,
      inkColor: null
    }, opts);

    const comp = composeChar(rawChar, options.style);
    if (!comp) return '<svg viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle">?</text></svg>';

    const width = 100 * comp.charCount;
    const height = 100;
    const ink = options.inkColor || comp.styleParams.inkColor || '#151311';
    const bgFill = options.style === 'bongseo' ? '#ebe4d6' : '#e2e8f0';
    const bgStroke = options.style === 'bongseo' ? '#c8bfa9' : '#94a3b8';

    const strokeDur = 0.42 / Math.max(0.2, options.speed);
    const gapDur = 0.12 / Math.max(0.2, options.speed);

    let defsHtml = '';
    let bgHtml = '';
    let activeHtml = '';
    let spineHtml = '';
    let badgeHtml = '';
    let animCss = '';

    // 클리핑 패스 및 획별 렌더링
    comp.strokePlans.forEach((plan, idx) => {
      const isVisible = options.activeStroke === -1 || idx <= options.activeStroke;
      const isCurrentStep = options.activeStroke === idx;
      const startTime = (idx * (strokeDur + gapDur)).toFixed(2);
      const strokeLen = Math.round(plan.length * 1.1 + 10);

      // 클리핑 마스크 정의
      defsHtml += `
        <clipPath id="bongseo_clip_${idx}">
          <path d="${plan.envelopeD}" />
        </clipPath>
      `;

      // 1. 배경 가이드 브러시 (정통 먹빛 흐린 실루엣)
      if (options.showBgBrush) {
        bgHtml += `
          <path class="bongseo-bg-brush" d="${plan.envelopeD}"
                fill="${bgFill}" stroke="${bgStroke}" stroke-width="0.32" stroke-linejoin="round" />
        `;
      }

      // 2. 중심 가이드 스파인 (점선 유도선)
      if (options.showSpines) {
        spineHtml += `
          <path class="bongseo-spine" d="${plan.centerlineD}"
                fill="none" stroke="#ef4444" stroke-width="0.75" stroke-dasharray="2, 1.5" opacity="0.65" />
        `;
      }

      // 3. 실제 잉크 획 (클립 패스 내부에서 굵은 모필로 브러시 스윕)
      if (isVisible) {
        if (options.animated && options.activeStroke === -1) {
          animCss += `
            @keyframes bongseoDraw_${idx} {
              0%   { stroke-dashoffset: ${strokeLen}; opacity: 0; }
              8%   { opacity: 1; }
              100% { stroke-dashoffset: 0; opacity: 1; }
            }
            .bongseo-active-ink-${idx} {
              stroke-dasharray: ${strokeLen};
              stroke-dashoffset: ${strokeLen};
              animation: bongseoDraw_${idx} ${strokeDur}s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
              animation-delay: ${startTime}s;
            }
            @keyframes bongseoBadgePop_${idx} {
              0%   { opacity: 0; transform: scale(0.3); }
              70%  { transform: scale(1.15); }
              100% { opacity: 1; transform: scale(1); }
            }
            .bongseo-badge-pop-${idx} {
              opacity: 0;
              transform-origin: ${plan.badge.bx}px ${plan.badge.by}px;
              animation: bongseoBadgePop_${idx} 0.28s ease-out forwards;
              animation-delay: ${startTime}s;
            }
          `;
        }

        // 스윕용 두꺼운 브러시 굵기 (봉서체는 16~20px으로 마스크 내부 100% 채움)
        const sweepThick = comp.styleParams.baseRadius * 5.4;
        const inkAnimClass = (options.animated && options.activeStroke === -1) ? `bongseo-active-ink-${idx}` : '';

        activeHtml += `
          <g clip-path="url(#bongseo_clip_${idx})">
            <path class="${inkAnimClass}" d="${plan.centerlineD}"
                  fill="none" stroke="${ink}" stroke-width="${sweepThick.toFixed(1)}"
                  stroke-linecap="round" stroke-linejoin="round" />
          </g>
        `;
      }

      // 4. 번호 배지
      if (options.showNumbers) {
        const b = plan.badge;
        const badgePopClass = (options.animated && options.activeStroke === -1) ? `bongseo-badge-pop-${idx}` : '';
        const badgeDisplay = isVisible ? '' : 'display:none;';
        const hasLeader = Math.hypot(b.bx - b.sx, b.by - b.sy) > 1.2;

        badgeHtml += `
          <g class="${badgePopClass}" id="bongseo_badge_${idx}" style="${badgeDisplay}">
            ${hasLeader ? `<line x1="${b.sx.toFixed(1)}" y1="${b.sy.toFixed(1)}" x2="${b.bx.toFixed(1)}" y2="${b.by.toFixed(1)}" stroke="#059669" stroke-width="0.75" opacity="0.85"/>` : ''}
            <circle cx="${b.bx.toFixed(1)}" cy="${b.by.toFixed(1)}" r="3.2" fill="#0f172a" stroke="#10b981" stroke-width="0.7" />
            <text x="${b.bx.toFixed(1)}" y="${(b.by + 1.15).toFixed(1)}" text-anchor="middle" font-size="3.2" font-weight="900" fill="#ffffff" font-family="'Inter', -apple-system, sans-serif">${idx + 1}</text>
          </g>
        `;
      }
    });

    // 격자 가이드
    let gridHtml = '';
    if (options.showGrid) {
      for (let c = 0; c < comp.charCount; c++) {
        const x0 = c * 100, x1 = x0 + 100;
        gridHtml += `
          <rect x="${x0 + 6}" y="6" width="88" height="88" rx="8" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="0.8" stroke-dasharray="2,2"/>
          <line x1="${x0 + 50}" y1="6" x2="${x0 + 50}" y2="94" stroke="rgba(255,255,255,0.06)" stroke-width="0.7"/>
          <line x1="${x0 + 6}" y1="50" x2="${x1 - 6}" y2="50" stroke="rgba(255,255,255,0.06)" stroke-width="0.7"/>
          <line x1="${x0 + 8}" y1="8" x2="${x1 - 8}" y2="92" stroke="rgba(255,255,255,0.03)" stroke-width="0.5" stroke-dasharray="2,2"/>
          <line x1="${x1 - 8}" y1="8" x2="${x0 + 8}" y2="92" stroke="rgba(255,255,255,0.03)" stroke-width="0.5" stroke-dasharray="2,2"/>
        `;
      }
    }

    return `
      <svg id="bongseo_stroke_svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;">
        <defs>
          <style>
            ${animCss}
          </style>
          ${defsHtml}
        </defs>

        <!-- 1. 보조 격자선 -->
        <g id="bongseo_grid_layer">
          ${gridHtml}
        </g>

        <!-- 2. 배경 모필 교본 실루엣 -->
        <g id="bongseo_bg_layer">
          ${bgHtml}
        </g>

        <!-- 3. 중심선 스파인 -->
        <g id="bongseo_spine_layer">
          ${spineHtml}
        </g>

        <!-- 4. 순차 애니메이션 모필 잉크 레이어 -->
        <g id="bongseo_active_layer">
          ${activeHtml}
        </g>

        <!-- 5. 획순 번호 마커 레이어 -->
        <g id="bongseo_badge_layer">
          ${badgeHtml}
        </g>
      </svg>
    `.trim();
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 4. 모듈 내보내기 (Export Definition)
  // ────────────────────────────────────────────────────────────────────────────

  const HangulBongseoEngine = {
    STYLE_PRESETS,
    JAMO_DB,
    DOUBLE_JAMO,
    COMPOUND_VOWEL,
    CHO_LIST,
    JUNG_LIST,
    JONG_LIST,
    VOWEL_TYPE,
    decomposeHangul,
    getLayoutBoxes,
    interpolateCatmullRom,
    buildProceduralStrokePoints,
    computeStrokeJunctions,
    buildStrokeEnvelope,
    buildProgressiveStrokePath,
    calculateBadgePositions,
    composeChar,
    renderSvg
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = HangulBongseoEngine;
  }
  global.HangulBongseoEngine = HangulBongseoEngine;

})(typeof window !== 'undefined' ? window : global);
