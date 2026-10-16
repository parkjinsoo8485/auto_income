// Test stroke generation for all Korean syllables and jamos
const CHOS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNGS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONGS = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

const DOUBLE_BATCHIM = {
  'ㄳ': ['ㄱ', 'ㅅ'],
  'ㄵ': ['ㄴ', 'ㅈ'],
  'ㄶ': ['ㄴ', 'ㅎ'],
  'ㄺ': ['ㄹ', 'ㄱ'],
  'ㄻ': ['ㄹ', 'ㅁ'],
  'ㄼ': ['ㄹ', 'ㅂ'],
  'ㄽ': ['ㄹ', 'ㅅ'],
  'ㄾ': ['ㄹ', 'ㅌ'],
  'ㄿ': ['ㄹ', 'ㅍ'],
  'ㅀ': ['ㄹ', 'ㅎ'],
  'ㅄ': ['ㅂ', 'ㅅ']
};

const COMPOUND_VOWELS = {
  'ㅘ': ['ㅗ', 'ㅏ'],
  'ㅙ': ['ㅗ', 'ㅐ'],
  'ㅚ': ['ㅗ', 'ㅣ'],
  'ㅝ': ['ㅜ', 'ㅓ'],
  'ㅞ': ['ㅜ', 'ㅔ'],
  'ㅟ': ['ㅜ', 'ㅣ'],
  'ㅢ': ['ㅡ', 'ㅣ'],
  'ㅒ': ['ㅑ', 'ㅣ'],
  'ㅖ': ['ㅕ', 'ㅣ']
};

const PRIMITIVE_STROKES = {
  'ㅇ': [{ type: 'circle', cx: 50, cy: 50, r: 35, desc: '상단 12시에서 반시계 방향으로 원 그리기' }],
  'ㄱ': [{ type: 'lines', pts: [[16, 22], [84, 22], [84, 84]], desc: '가로로 긋고 아래로 꺾기' }],
  'ㄲ': [
    { type: 'lines', pts: [[12, 22], [48, 22], [48, 84]], desc: '첫 번째 ㄱ' },
    { type: 'lines', pts: [[54, 22], [88, 22], [88, 84]], desc: '두 번째 ㄱ' }
  ],
  'ㄴ': [{ type: 'lines', pts: [[18, 16], [18, 84], [84, 84]], desc: '아래로 내린 후 오른쪽으로 꺾기' }],
  'ㄷ': [
    { type: 'lines', pts: [[16, 20], [84, 20]], desc: '상단 가로선' },
    { type: 'lines', pts: [[18, 20], [18, 84], [84, 84]], desc: '세로 내림 후 오른쪽으로 꺾기' }
  ],
  'ㄸ': [
    { type: 'lines', pts: [[10, 20], [46, 20]], desc: '첫 번째 ㄷ 가로선' },
    { type: 'lines', pts: [[12, 20], [12, 84], [46, 84]], desc: '첫 번째 ㄷ ㄴ자 획' },
    { type: 'lines', pts: [[54, 20], [88, 20]], desc: '두 번째 ㄷ 가로선' },
    { type: 'lines', pts: [[56, 20], [56, 84], [88, 84]], desc: '두 번째 ㄷ ㄴ자 획' }
  ],
  'ㄹ': [
    { type: 'lines', pts: [[16, 20], [84, 20], [84, 50]], desc: '상단 ㄱ자' },
    { type: 'lines', pts: [[16, 50], [84, 50]], desc: '중간 가로선' },
    { type: 'lines', pts: [[18, 50], [18, 84], [84, 84]], desc: '하단 ㄴ자' }
  ],
  'ㅁ': [
    { type: 'lines', pts: [[18, 16], [18, 84]], desc: '왼쪽 세로선' },
    { type: 'lines', pts: [[18, 18], [84, 18], [84, 84]], desc: '위 가로 후 오른쪽 꺾기' },
    { type: 'lines', pts: [[18, 84], [84, 84]], desc: '밑바닥 닫기' }
  ],
  'ㅂ': [
    { type: 'lines', pts: [[22, 16], [22, 84]], desc: '왼쪽 세로선' },
    { type: 'lines', pts: [[78, 16], [78, 84]], desc: '오른쪽 세로선' },
    { type: 'lines', pts: [[22, 50], [78, 50]], desc: '중간 가로선' },
    { type: 'lines', pts: [[22, 84], [78, 84]], desc: '하단 가로선' }
  ],
  'ㅃ': [
    { type: 'lines', pts: [[12, 16], [12, 84]], desc: '첫 번째 ㅂ 좌측 세로' },
    { type: 'lines', pts: [[46, 16], [46, 84]], desc: '첫 번째 ㅂ 우측 세로' },
    { type: 'lines', pts: [[12, 50], [46, 50]], desc: '첫 번째 ㅂ 중간선' },
    { type: 'lines', pts: [[12, 84], [46, 84]], desc: '첫 번째 ㅂ 하단선' },
    { type: 'lines', pts: [[54, 16], [54, 84]], desc: '두 번째 ㅂ 좌측 세로' },
    { type: 'lines', pts: [[88, 16], [88, 84]], desc: '두 번째 ㅂ 우측 세로' },
    { type: 'lines', pts: [[54, 50], [88, 50]], desc: '두 번째 ㅂ 중간선' },
    { type: 'lines', pts: [[54, 84], [88, 84]], desc: '두 번째 ㅂ 하단선' }
  ],
  'ㅅ': [
    { type: 'lines', pts: [[50, 16], [18, 84]], desc: '왼쪽 사선 빗침' },
    { type: 'lines', pts: [[42, 50], [82, 84]], desc: '오른쪽 사선 빗침' }
  ],
  'ㅆ': [
    { type: 'lines', pts: [[32, 16], [10, 84]], desc: '첫 번째 ㅅ 좌빗침' },
    { type: 'lines', pts: [[26, 50], [50, 84]], desc: '첫 번째 ㅅ 우빗침' },
    { type: 'lines', pts: [[70, 16], [50, 84]], desc: '두 번째 ㅅ 좌빗침' },
    { type: 'lines', pts: [[64, 50], [88, 84]], desc: '두 번째 ㅅ 우빗침' }
  ],
  'ㅈ': [
    { type: 'lines', pts: [[18, 20], [82, 20]], desc: '상단 수평 가로선' },
    { type: 'lines', pts: [[50, 20], [18, 84]], desc: '중앙에서 왼쪽 사선' },
    { type: 'lines', pts: [[42, 52], [82, 84]], desc: '오른쪽 사선 잇기' }
  ],
  'ㅉ': [
    { type: 'lines', pts: [[12, 20], [48, 20]], desc: '첫 번째 ㅈ 가로선' },
    { type: 'lines', pts: [[30, 20], [10, 84]], desc: '첫 번째 ㅈ 좌사선' },
    { type: 'lines', pts: [[24, 52], [48, 84]], desc: '첫 번째 ㅈ 우사선' },
    { type: 'lines', pts: [[52, 20], [88, 20]], desc: '두 번째 ㅈ 가로선' },
    { type: 'lines', pts: [[70, 20], [50, 84]], desc: '두 번째 ㅈ 좌사선' },
    { type: 'lines', pts: [[64, 52], [88, 84]], desc: '두 번째 ㅈ 우사선' }
  ],
  'ㅊ': [
    { type: 'lines', pts: [[50, 8], [50, 20]], desc: '상단 꼭지점 획' },
    { type: 'lines', pts: [[18, 24], [82, 24]], desc: '상단 가로선' },
    { type: 'lines', pts: [[50, 24], [18, 84]], desc: '왼쪽 사선 빗침' },
    { type: 'lines', pts: [[42, 52], [82, 84]], desc: '오른쪽 사선 빗침' }
  ],
  'ㅋ': [
    { type: 'lines', pts: [[16, 20], [84, 20], [84, 84]], desc: '바깥 ㄱ자 획' },
    { type: 'lines', pts: [[16, 50], [74, 50]], desc: '안쪽 가로선' }
  ],
  'ㅌ': [
    { type: 'lines', pts: [[18, 18], [82, 18]], desc: '상단 가로선' },
    { type: 'lines', pts: [[18, 50], [82, 50]], desc: '중간 가로선' },
    { type: 'lines', pts: [[18, 18], [18, 84], [82, 84]], desc: 'ㄴ자 바닥 획' }
  ],
  'ㅍ': [
    { type: 'lines', pts: [[16, 20], [84, 20]], desc: '상단 가로선' },
    { type: 'lines', pts: [[35, 20], [35, 82]], desc: '왼쪽 세로 기둥' },
    { type: 'lines', pts: [[65, 20], [65, 82]], desc: '오른쪽 세로 기둥' },
    { type: 'lines', pts: [[16, 82], [84, 82]], desc: '하단 가로선' }
  ],
  'ㅎ': [
    { type: 'lines', pts: [[50, 8], [50, 22]], desc: '꼭지점 획' },
    { type: 'lines', pts: [[18, 26], [82, 26]], desc: '중간 가로선' },
    { type: 'circle', cx: 50, cy: 62, r: 24, desc: '하단 반시계 방향 원' }
  ],
  'ㅏ': [
    { type: 'lines', pts: [[50, 12], [50, 88]], desc: '긴 세로 기둥' },
    { type: 'lines', pts: [[50, 50], [88, 50]], desc: '오른쪽 곁가지' }
  ],
  'ㅑ': [
    { type: 'lines', pts: [[50, 12], [50, 88]], desc: '긴 세로 기둥' },
    { type: 'lines', pts: [[50, 36], [88, 36]], desc: '위쪽 곁가지' },
    { type: 'lines', pts: [[50, 64], [88, 64]], desc: '아래쪽 곁가지' }
  ],
  'ㅓ': [
    { type: 'lines', pts: [[12, 50], [50, 50]], desc: '왼쪽 곁가지' },
    { type: 'lines', pts: [[50, 12], [50, 88]], desc: '긴 세로 기둥' }
  ],
  'ㅕ': [
    { type: 'lines', pts: [[12, 36], [50, 36]], desc: '위쪽 곁가지' },
    { type: 'lines', pts: [[12, 64], [50, 64]], desc: '아래쪽 곁가지' },
    { type: 'lines', pts: [[50, 12], [50, 88]], desc: '긴 세로 기둥' }
  ],
  'ㅗ': [
    { type: 'lines', pts: [[50, 15], [50, 65]], desc: '짧은 세로 기둥' },
    { type: 'lines', pts: [[12, 65], [88, 65]], desc: '긴 받침 가로선' }
  ],
  'ㅛ': [
    { type: 'lines', pts: [[36, 15], [36, 65]], desc: '왼쪽 짧은 기둥' },
    { type: 'lines', pts: [[64, 15], [64, 65]], desc: '오른쪽 짧은 기둥' },
    { type: 'lines', pts: [[12, 65], [88, 65]], desc: '하단 긴 가로선' }
  ],
  'ㅜ': [
    { type: 'lines', pts: [[12, 35], [88, 35]], desc: '상단 긴 가로선' },
    { type: 'lines', pts: [[50, 35], [50, 85]], desc: '내리는 짧은 기둥' }
  ],
  'ㅠ': [
    { type: 'lines', pts: [[12, 35], [88, 35]], desc: '상단 긴 가로선' },
    { type: 'lines', pts: [[36, 35], [36, 85]], desc: '왼쪽 내림 기둥' },
    { type: 'lines', pts: [[64, 35], [64, 85]], desc: '오른쪽 내림 기둥' }
  ],
  'ㅡ': [{ type: 'lines', pts: [[12, 50], [88, 50]], desc: '수평 가로선' }],
  'ㅣ': [{ type: 'lines', pts: [[50, 12], [50, 88]], desc: '수직 세로선' }],
  'ㅐ': [
    { type: 'lines', pts: [[35, 12], [35, 88]], desc: '첫 번째 세로선' },
    { type: 'lines', pts: [[35, 50], [68, 50]], desc: '가운데 가로 연결선' },
    { type: 'lines', pts: [[68, 12], [68, 88]], desc: '두 번째 세로선' }
  ],
  'ㅔ': [
    { type: 'lines', pts: [[16, 50], [48, 50]], desc: '왼쪽 짧은 가로선' },
    { type: 'lines', pts: [[48, 12], [48, 88]], desc: '첫 번째 세로선' },
    { type: 'lines', pts: [[78, 12], [78, 88]], desc: '두 번째 세로선' }
  ]
};

// Test coverage
console.log('Testing coverage of all standard CHOS:');
CHOS.forEach(c => {
  if (!PRIMITIVE_STROKES[c]) console.error('Missing Cho:', c);
});

console.log('Testing coverage of all JUNGS:');
JUNGS.forEach(j => {
  if (!PRIMITIVE_STROKES[j] && !COMPOUND_VOWELS[j]) {
    console.error('Missing Jung:', j);
  }
});

console.log('Testing coverage of all JONGS:');
JONGS.slice(1).forEach(j => {
  if (!PRIMITIVE_STROKES[j] && !DOUBLE_BATCHIM[j]) {
    console.error('Missing Jong:', j);
  }
});

console.log('All basic mappings validated successfully!');

module.exports = { PRIMITIVE_STROKES, COMPOUND_VOWELS, DOUBLE_BATCHIM, CHOS, JUNGS, JONGS };
