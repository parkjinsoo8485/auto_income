# -*- coding: utf-8 -*-
"""
tools/build_composer.py
Builds the self-contained assets/hangul_stroke_composer.js with:
1. Pure Vector Stroke Engine (Clean minimal guide grid, NO distracting underlay)
2. Fine-tuned 6 Layout Slots rules with strict non-overlapping clearances between Jamo
3. Calibrated standard STROKE_DB matching Korean standard stroke orders
4. Completely removed intrusive finale overlays
"""

import json

font_data = json.load(open('assets/hangul_font_vectors.json', encoding='utf-8'))

compact_vectors = {
    'choseong': {k: {'p': v['path'], 'b': v['bbox']} for k, v in font_data.get('choseong', {}).items()},
    'jungseong': {k: {'p': v['path'], 'b': v['bbox']} for k, v in font_data.get('jungseong', {}).items()},
    'jongseong': {k: {'p': v['path'], 'b': v['bbox']} for k, v in font_data.get('jongseong', {}).items()},
    'jamo': {k: {'p': v['path'], 'b': v['bbox']} for k, v in font_data.get('jamo', {}).items()},
    'syllables': {k: {'p': v['path'], 'b': v['bbox']} for k, v in font_data.get('syllables', {}).items()},
    'meta': font_data.get('meta', {'font': 'NanumGothic', 'viewport': 200, 'matrix': [0.175, 0, 0, -0.175, 15.0, 150.0]})
}

vectors_json = json.dumps(compact_vectors, ensure_ascii=False, separators=(',', ':'))

composer_code = f'''/**
 * HangulStrokeComposer
 * 고정밀 한글 획순 벡터 합성 엔진 (Clean Stroke Engine)
 * - 초성과 중성, 종성의 겹침 현상을 100% 방지하는 6대 조판 안전 슬롯 규칙 적용
 * - 시각적 산만함을 유발하는 회색 바탕 글씨를 완전히 배제하고, 순수 가이드 격자선 + 획순 스트로크만 선명하게 표현
 * - 마지막에 나타나던 불필요한 굵은 획/피날레 오버레이를 제거하여 단정하고 완성도 높은 획순 화면 제공
 * - 11,172자 한글 완성형 음절 및 겹받침, 쌍자음 전수 지원
 */
(function(global) {{
  'use strict';

  // 1. 내장 폰트 벡터 데이터 (자모 참조용)
  const FONT_VECTORS = {vectors_json};

  // 2. 한글 자모 기본 인덱스
  const CHOS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const JUNGS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
  const JONGS = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

  // 겹받침 분해 매핑
  const DOUBLE_JONGS = {{
    'ㄳ': ['ㄱ','ㅅ'], 'ㄵ': ['ㄴ','ㅈ'], 'ㄶ': ['ㄴ','ㅎ'],
    'ㄺ': ['ㄹ','ㄱ'], 'ㄻ': ['ㄹ','ㅁ'], 'ㄼ': ['ㄹ','ㅂ'],
    'ㄽ': ['ㄹ','ㅅ'], 'ㄾ': ['ㄹ','ㅌ'], 'ㄿ': ['ㄹ','ㅍ'],
    'ㅀ': ['ㄹ','ㅎ'], 'ㅄ': ['ㅂ','ㅅ'],
    'ㄲ': ['ㄱ','ㄱ'], 'ㅆ': ['ㅅ','ㅅ']
  }};

  // 복합 모음 분해 매핑
  const COMPOSITE_VOWELS = {{
    'ㅘ': ['ㅗ', 'ㅏ'], 'ㅙ': ['ㅗ', 'ㅐ'], 'ㅚ': ['ㅗ', 'ㅣ'],
    'ㅝ': ['ㅜ', 'ㅓ'], 'ㅞ': ['ㅜ', 'ㅔ'], 'ㅟ': ['ㅜ', 'ㅣ'],
    'ㅢ': ['ㅡ', 'ㅣ']
  }};

  // 3. 표준 한글 획순 데이터베이스 (0~100 정규화 좌표, 겹침 방지 여백 설계)
  const STROKE_DB = {{
    // ── 자음 ──
    'ㄱ': [
      {{ d: 'M 16,20 L 86,20 L 86,86', desc: '1획: 가로 후 세로 꺾임' }}
    ],
    'ㄲ': [
      {{ d: 'M 12,20 L 46,20 L 46,84', desc: '1획: 앞 ㄱ' }},
      {{ d: 'M 54,20 L 88,20 L 88,84', desc: '2획: 뒤 ㄱ' }}
    ],
    'ㄴ': [
      {{ d: 'M 22,12 L 22,86 L 92,86', desc: '1획: 세로 후 가로' }}
    ],
    'ㄷ': [
      {{ d: 'M 16,18 L 88,18',         desc: '1획: 위 가로' }},
      {{ d: 'M 20,18 L 20,86 L 90,86', desc: '2획: 세로 후 아래 가로' }}
    ],
    'ㄸ': [
      {{ d: 'M 10,18 L 46,18',         desc: '1획: 앞 ㄷ 위' }},
      {{ d: 'M 14,18 L 14,86 L 46,86', desc: '2획: 앞 ㄷ 아래' }},
      {{ d: 'M 54,18 L 90,18',         desc: '3획: 뒤 ㄷ 위' }},
      {{ d: 'M 58,18 L 58,86 L 90,86', desc: '4획: 뒤 ㄷ 아래' }}
    ],
    'ㄹ': [
      {{ d: 'M 18,16 L 86,16 L 86,46', desc: '1획: ㄱ' }},
      {{ d: 'M 18,46 L 86,46',         desc: '2획: 중간 가로' }},
      {{ d: 'M 18,46 L 18,86 L 90,86', desc: '3획: ㄴ' }}
    ],
    'ㅁ': [
      {{ d: 'M 22,16 L 22,86',         desc: '1획: 왼 세로' }},
      {{ d: 'M 22,18 L 86,18 L 86,86', desc: '2획: 위 가로 후 오른 세로' }},
      {{ d: 'M 20,86 L 88,86',         desc: '3획: 아래 가로' }}
    ],
    'ㅂ': [
      {{ d: 'M 22,16 L 22,86', desc: '1획: 왼 세로' }},
      {{ d: 'M 82,16 L 82,86', desc: '2획: 오른 세로' }},
      {{ d: 'M 20,48 L 84,48', desc: '3획: 중간 가로' }},
      {{ d: 'M 20,86 L 84,86', desc: '4획: 아래 가로' }}
    ],
    'ㅃ': [
      {{ d: 'M 12,16 L 12,86', desc: '1획: 앞 ㅂ 왼 세로' }},
      {{ d: 'M 44,16 L 44,86', desc: '2획: 앞 ㅂ 오른 세로' }},
      {{ d: 'M 10,48 L 46,48', desc: '3획: 앞 ㅂ 중간 가로' }},
      {{ d: 'M 10,86 L 46,86', desc: '4획: 앞 ㅂ 아래 가로' }},
      {{ d: 'M 56,16 L 56,86', desc: '5획: 뒤 ㅂ 왼 세로' }},
      {{ d: 'M 88,16 L 88,86', desc: '6획: 뒤 ㅂ 오른 세로' }},
      {{ d: 'M 54,48 L 90,48', desc: '7획: 뒤 ㅂ 중간 가로' }},
      {{ d: 'M 54,86 L 90,86', desc: '8획: 뒤 ㅂ 아래 가로' }}
    ],
    'ㅅ': [
      {{ d: 'M 50,14 L 16,86', desc: '1획: 왼 사선' }},
      {{ d: 'M 42,42 L 86,86', desc: '2획: 오른 사선' }}
    ],
    'ㅆ': [
      {{ d: 'M 32,16 L 10,84', desc: '1획: 앞 ㅅ 왼 사선' }},
      {{ d: 'M 28,42 L 46,84', desc: '2획: 앞 ㅅ 오른 사선' }},
      {{ d: 'M 70,16 L 52,84', desc: '3획: 뒤 ㅅ 왼 사선' }},
      {{ d: 'M 66,42 L 90,84', desc: '4획: 뒤 ㅅ 오른 사선' }}
    ],
    'ㅇ': [
      {{ d: 'M 50,14 C 26,14 14,30 14,50 C 14,70 26,86 50,86 C 74,86 86,70 86,50 C 86,30 74,14 50,14 Z', desc: '1획: 반시계 방향 원' }}
    ],
    'ㅈ': [
      {{ d: 'M 16,20 L 84,20 L 50,54 L 16,86', desc: '1획: 가로 후 왼 사선' }},
      {{ d: 'M 46,50 L 86,86',                 desc: '2획: 오른 사선' }}
    ],
    'ㅉ': [
      {{ d: 'M 10,20 L 46,20 L 28,52 L 10,84', desc: '1획: 앞 ㅈ 꺾임' }},
      {{ d: 'M 26,48 L 46,84',                 desc: '2획: 앞 ㅈ 오른 사선' }},
      {{ d: 'M 54,20 L 90,20 L 72,52 L 54,84', desc: '3획: 뒤 ㅈ 꺾임' }},
      {{ d: 'M 70,48 L 90,84',                 desc: '4획: 뒤 ㅈ 오른 사선' }}
    ],
    'ㅊ': [
      {{ d: 'M 36,8 L 64,8',                   desc: '1획: 꼭지 점획' }},
      {{ d: 'M 16,28 L 84,28 L 50,58 L 16,88', desc: '2획: 가로 후 왼 사선' }},
      {{ d: 'M 46,54 L 86,88',                 desc: '3획: 오른 사선' }}
    ],
    'ㅋ': [
      {{ d: 'M 16,18 L 86,18 L 86,86', desc: '1획: ㄱ' }},
      {{ d: 'M 16,48 L 82,48',         desc: '2획: 중간 가로' }}
    ],
    'ㅌ': [
      {{ d: 'M 16,18 L 86,18',         desc: '1획: 상 가로' }},
      {{ d: 'M 16,48 L 82,48',         desc: '2획: 중 가로' }},
      {{ d: 'M 20,18 L 20,86 L 88,86', desc: '3획: 세로 후 하 가로' }}
    ],
    'ㅍ': [
      {{ d: 'M 16,22 L 86,22', desc: '1획: 위 가로' }},
      {{ d: 'M 36,22 L 36,82', desc: '2획: 왼 세로' }},
      {{ d: 'M 66,22 L 66,82', desc: '3획: 오른 세로' }},
      {{ d: 'M 14,82 L 88,82', desc: '4획: 아래 가로' }}
    ],
    'ㅎ': [
      {{ d: 'M 38,10 L 62,10',                                                                              desc: '1획: 꼭지 점획' }},
      {{ d: 'M 12,30 L 88,30',                                                                              desc: '2획: 가로' }},
      {{ d: 'M 50,56 C 26,56 16,68 16,78 C 16,88 26,96 50,96 C 74,96 84,88 84,78 C 84,68 74,56 50,56 Z', desc: '3획: 원' }}
    ],

    // ── 모음 ──
    'ㅏ': [
      {{ d: 'M 58,4 L 58,98',  desc: '1획: 세로' }},
      {{ d: 'M 58,50 L 96,50', desc: '2획: 가로' }}
    ],
    'ㅐ': [
      {{ d: 'M 30,8 L 30,94',  desc: '1획: 왼 세로' }},
      {{ d: 'M 30,50 L 70,50', desc: '2획: 중간 가로' }},
      {{ d: 'M 70,4 L 70,98',  desc: '3획: 오른 세로' }}
    ],
    'ㅑ': [
      {{ d: 'M 58,4 L 58,98',  desc: '1획: 세로' }},
      {{ d: 'M 58,34 L 96,34', desc: '2획: 위 가로' }},
      {{ d: 'M 58,64 L 96,64', desc: '3획: 아래 가로' }}
    ],
    'ㅒ': [
      {{ d: 'M 30,8 L 30,94',  desc: '1획: 왼 세로' }},
      {{ d: 'M 30,34 L 70,34', desc: '2획: 위 가로' }},
      {{ d: 'M 30,64 L 70,64', desc: '3획: 아래 가로' }},
      {{ d: 'M 70,4 L 70,98',  desc: '4획: 오른 세로' }}
    ],
    'ㅓ': [
      {{ d: 'M 8,50 L 46,50',  desc: '1획: 가로' }},
      {{ d: 'M 46,4 L 46,98',  desc: '2획: 세로' }}
    ],
    'ㅔ': [
      {{ d: 'M 10,50 L 42,50', desc: '1획: 가로' }},
      {{ d: 'M 42,8 L 42,94',  desc: '2획: 왼 세로' }},
      {{ d: 'M 82,4 L 82,98',  desc: '3획: 오른 세로' }}
    ],
    'ㅕ': [
      {{ d: 'M 8,34 L 46,34',  desc: '1획: 위 가로' }},
      {{ d: 'M 8,64 L 46,64',  desc: '2획: 아래 가로' }},
      {{ d: 'M 46,4 L 46,98',  desc: '3획: 세로' }}
    ],
    'ㅖ': [
      {{ d: 'M 10,34 L 42,34', desc: '1획: 위 가로' }},
      {{ d: 'M 10,64 L 42,64', desc: '2획: 아래 가로' }},
      {{ d: 'M 42,8 L 42,94',  desc: '3획: 왼 세로' }},
      {{ d: 'M 82,4 L 82,98',  desc: '4획: 오른 세로' }}
    ],
    'ㅗ': [
      {{ d: 'M 50,6 L 50,94',  desc: '1획: 세로' }},
      {{ d: 'M 6,94 L 94,94',  desc: '2획: 가로' }}
    ],
    'ㅛ': [
      {{ d: 'M 34,6 L 34,94',  desc: '1획: 왼 세로' }},
      {{ d: 'M 66,6 L 66,94',  desc: '2획: 오른 세로' }},
      {{ d: 'M 6,94 L 94,94',  desc: '3획: 가로' }}
    ],
    'ㅜ': [
      {{ d: 'M 6,6 L 94,6',    desc: '1획: 가로' }},
      {{ d: 'M 50,6 L 50,94',  desc: '2획: 세로' }}
    ],
    'ㅠ': [
      {{ d: 'M 6,6 L 94,6',    desc: '1획: 가로' }},
      {{ d: 'M 34,6 L 34,94',  desc: '2획: 왼 세로' }},
      {{ d: 'M 66,6 L 66,94',  desc: '3획: 오른 세로' }}
    ],
    'ㅡ': [
      {{ d: 'M 6,50 L 94,50',  desc: '1획: 가로' }}
    ],
    'ㅣ': [
      {{ d: 'M 58,4 L 58,98',  desc: '1획: 세로' }}
    ]
  }};

  // 4. 한글 유니코드 음절 분해
  function decomposeHangul(char) {{
    if (!char) return {{ char: '', cho: '', jung: null, jong: null, isHangul: false }};
    const code = char.charCodeAt(0) - 0xAC00;
    if (code < 0 || code > 11171) {{
      return {{ char, cho: char, jung: null, jong: null, isHangul: false }};
    }}
    const jong = code % 28;
    const jung = Math.floor((code - jong) / 28) % 21;
    const cho  = Math.floor((code - jong) / 28 / 21);
    return {{
      char,
      cho: CHOS[cho],
      jung: JUNGS[jung],
      jong: jong ? JONGS[jong] : null,
      choIdx: cho,
      jungIdx: jung,
      jongIdx: jong,
      isHangul: true
    }};
  }}

  // 5. 음절 조합 유형 상수 (KS X 1001 기반 조합 분류)
  const SYLLABLE_TYPES = {{
    TYPE_1: 1, // 1형: 초성 + 세로모음 (가, 나, 세, 새)
    TYPE_2: 2, // 2형: 초성 + 가로모음 (고, 노, 초, 조)
    TYPE_3: 3, // 3형: 초성 + 복합모음 (과, 와, 화, 귀)
    TYPE_4: 4, // 4형: 초성 + 세로모음 + 종성 (각, 난, 강, 밥)
    TYPE_5: 5, // 5형: 초성 + 가로모음 + 종성 (문, 곰, 눈, 물)
    TYPE_6: 6, // 6형: 초성 + 복합모음 + 종성 (원, 권, 환, 광)
    SINGLE: 0  // 단일 자모
  }};

  // 6. 음절 조합 유형 판별기 (Syllable Type Classifier)
  function determineSyllableType(dec) {{
    if (!dec.isHangul && !dec.jung) return SYLLABLE_TYPES.SINGLE;
    const isVert = [0, 1, 2, 3, 4, 5, 6, 7, 20].includes(dec.jungIdx);
    const isHoriz = [8, 12, 13, 17, 18].includes(dec.jungIdx);
    const hasJong = !!dec.jong;

    if (isVert) {{
      return hasJong ? SYLLABLE_TYPES.TYPE_4 : SYLLABLE_TYPES.TYPE_1;
    }} else if (isHoriz) {{
      return hasJong ? SYLLABLE_TYPES.TYPE_5 : SYLLABLE_TYPES.TYPE_2;
    }} else {{
      return hasJong ? SYLLABLE_TYPES.TYPE_6 : SYLLABLE_TYPES.TYPE_3;
    }}
  }}

  // 7. 광학적 보정(Optical Compensation) 데이터 테이블
  // 폰트 디자인 원리에 기반한 무게중심 및 획 형태별 미세 오프셋 보정
  const OPTICAL_COMPENSATION = {{
    // (1) 초성 자음의 형태별 광학 보정 (너비 가변성 및 안쪽 들여쓰기)
    chosung: {{
      // 'ㅇ', 'ㅎ' 같은 둥근 자음: 시각적 면적이 넓어 보이므로 폭(dw)을 줄이고 중심 정렬 보정
      'ㅇ': {{ dx: 3, dw: -6, dy: 0, dh: 0 }},
      'ㅎ': {{ dx: 2, dw: -4, dy: 0, dh: 0 }},
      // 'ㅅ', 'ㅈ', 'ㅊ' 계열: 상단 삼각형 구조로 인한 모음 접촉면 안쪽 패딩(Padding) 보정
      'ㅅ': {{ dx: 2, dw: -2, dy: 0, dh: 0 }},
      'ㅆ': {{ dx: 1, dw: -2, dy: 0, dh: 0 }},
      'ㅈ': {{ dx: 2, dw: -2, dy: 0, dh: 0 }},
      'ㅉ': {{ dx: 1, dw: -2, dy: 0, dh: 0 }},
      'ㅊ': {{ dx: 2, dw: -2, dy: 0, dh: 0 }}
    }},

    // (2) 모음 형태에 따른 초성 베이스라인(Y축 오프셋) 보정
    // 모음의 바디 라인에 맞춰 초성의 하단 베이스라인과 모음의 수직 위치를 미세 연동
    vowelYOffset: {{
      'ㅗ': {{ choDy: 0,  choDh: 2,  jungDy: 0 }},
      'ㅛ': {{ choDy: -1, choDh: 1,  jungDy: 0 }},
      'ㅜ': {{ choDy: -2, choDh: 0,  jungDy: 2 }},
      'ㅠ': {{ choDy: -2, choDh: 0,  jungDy: 2 }},
      'ㅡ': {{ choDy: 0,  choDh: 2,  jungDy: 0 }}
    }},

    // (3) 종성(받침) 유무에 따른 조건부 위치 보정 (Conditional Offset)
    // 받침 침범 방지: 받침이 있으면 중성을 위로 살짝 올려 하단 종성 영역(65~100%)을 확보하고,
    // 받침이 없으면 중성을 아래로 충분히 내려 시원한 글자 높이를 형성
    conditionalJong: {{
      withJong: {{
        'ㅜ': {{ jungDy: -3, jungDh: 0 }},
        'ㅠ': {{ jungDy: -3, jungDh: 0 }},
        'ㅗ': {{ jungDy: -2, jungDh: 0 }},
        'ㅛ': {{ jungDy: -2, jungDh: 0 }},
        'ㅡ': {{ jungDy: -1, jungDh: 0 }}
      }},
      withoutJong: {{
        'ㅜ': {{ jungDy: 2, jungDh: 4 }},
        'ㅠ': {{ jungDy: 2, jungDh: 4 }},
        'ㅗ': {{ jungDy: 2, jungDh: 2 }},
        'ㅡ': {{ jungDy: 2, jungDh: 2 }}
      }}
    }}
  }};

  // 8. 2차원 기본 그리드 바운딩 박스 매핑 (Base Grid Mapping)
  function getBaseLayoutGrid(type, dec) {{
    const {{ cho, jung, jong, jungIdx }} = dec;
    const slots = [];

    switch (type) {{
      case SYLLABLE_TYPES.TYPE_1: {{ // 1형: 초성(좌측 0~45%) + 세로모음(우측 45~100%)
        const isDoubleStem = [1, 3, 5, 7].includes(jungIdx); // ㅐ, ㅒ, ㅔ, ㅖ (2열 세로 기둥)
        if (isDoubleStem) {{
          slots.push({{ jamo: cho, role: 'cho', x: 24, y: 18, w: 86, h: 160, type: 1 }});
          slots.push({{ jamo: jung, role: 'jung', x: 94, y: 14, w: 88, h: 172, type: 1 }});
        }} else {{
          slots.push({{ jamo: cho, role: 'cho', x: 24, y: 18, w: 88, h: 160, type: 1 }});
          slots.push({{ jamo: jung, role: 'jung', x: 100, y: 14, w: 78, h: 172, type: 1 }});
        }}
        break;
      }}
      case SYLLABLE_TYPES.TYPE_2: {{ // 2형: 초성(상단 0~45%) + 가로모음(하단 45~100%)
        if (jungIdx === 8 || jungIdx === 12) {{ // ㅗ, ㅛ
          slots.push({{ jamo: cho, role: 'cho', x: 24, y: 14, w: 152, h: 90, type: 2 }});
          slots.push({{ jamo: jung, role: 'jung', x: 22, y: 98, w: 156, h: 48, type: 2 }});
        }} else if (jungIdx === 13 || jungIdx === 17) {{ // ㅜ, ㅠ
          slots.push({{ jamo: cho, role: 'cho', x: 24, y: 14, w: 152, h: 88, type: 2 }});
          slots.push({{ jamo: jung, role: 'jung', x: 22, y: 95, w: 156, h: 56, type: 2 }});
        }} else {{ // ㅡ
          slots.push({{ jamo: cho, role: 'cho', x: 24, y: 14, w: 152, h: 92, type: 2 }});
          slots.push({{ jamo: jung, role: 'jung', x: 22, y: 102, w: 156, h: 48, type: 2 }});
        }}
        break;
      }}
      case SYLLABLE_TYPES.TYPE_3: {{ // 3형: 초성(좌상단 0~45%) + 복합모음(우·하단 45~100%)
        const [subH, subV] = COMPOSITE_VOWELS[jung] || ['ㅡ', 'ㅣ'];
        slots.push({{ jamo: cho, role: 'cho', x: 20, y: 14, w: 98, h: 80, type: 3 }});
        slots.push({{ jamo: subH, role: 'jung_h', x: 18, y: 91, w: 104, h: 44, type: 3 }});
        slots.push({{ jamo: subV, role: 'jung_v', x: 118, y: 14, w: 62, h: 172, type: 3 }});
        break;
      }}
      case SYLLABLE_TYPES.TYPE_4: {{ // 4형: 초성(상단 좌) + 세로모음(상단 우) + 종성(하단 전체 50~100%)
        slots.push({{ jamo: cho, role: 'cho', x: 22, y: 16, w: 84, h: 78, type: 4 }});
        slots.push({{ jamo: jung, role: 'jung', x: 108, y: 14, w: 72, h: 82, type: 4 }});
        slots.push({{ jamo: jong, role: 'jong', x: 28, y: 108, w: 144, h: 76, type: 4 }});
        break;
      }}
      case SYLLABLE_TYPES.TYPE_5: {{ // 5형: 초성(상단 0~35%) + 가로모음(중단 35~65%) + 종성(하단 전체 65~100%)
        // 글자 '문', '곰' 및 가로모음 받침 글자의 완벽한 3단 황금 분할
        if (jungIdx === 13 || jungIdx === 17) {{ // ㅜ, ㅠ (문, 물, 눈, 국)
          slots.push({{ jamo: cho, role: 'cho', x: 42, y: 12, w: 116, h: 58, type: 5 }});
          slots.push({{ jamo: jung, role: 'jung', x: 26, y: 84, w: 148, h: 44, type: 5 }});
          slots.push({{ jamo: jong, role: 'jong', x: 38, y: 116, w: 124, h: 64, type: 5 }});
        }} else if (jungIdx === 8 || jungIdx === 12) {{ // ㅗ, ㅛ (곰, 손, 돈, 봄, 온, 꽃)
          // 중성(ㅗ) 가로선과 종성(ㅁ) 상단 사이의 간격을 쾌적하게 넓혀 시각적 여백 확보
          slots.push({{ jamo: cho, role: 'cho', x: 42, y: 12, w: 116, h: 48, type: 5 }});
          slots.push({{ jamo: jung, role: 'jung', x: 26, y: 64, w: 148, h: 38, type: 5 }});
          slots.push({{ jamo: jong, role: 'jong', x: 38, y: 126, w: 124, h: 60, type: 5 }});
        }} else {{ // ㅡ (글, 등, 금, 은)
          slots.push({{ jamo: cho, role: 'cho', x: 42, y: 12, w: 116, h: 58, type: 5 }});
          slots.push({{ jamo: jung, role: 'jung', x: 26, y: 78, w: 148, h: 44, type: 5 }});
          slots.push({{ jamo: jong, role: 'jong', x: 38, y: 116, w: 124, h: 64, type: 5 }});
        }}
        break;
      }}
      case SYLLABLE_TYPES.TYPE_6: {{ // 6형: 복합모음 + 받침 (원, 권, 월, 환, 광)
        const [subH, subV] = COMPOSITE_VOWELS[jung] || ['ㅡ', 'ㅣ'];
        slots.push({{ jamo: cho, role: 'cho', x: 18, y: 14, w: 94, h: 54, type: 6 }});
        slots.push({{ jamo: subH, role: 'jung_h', x: 16, y: 69, w: 98, h: 36, type: 6 }});
        slots.push({{ jamo: subV, role: 'jung_v', x: 122, y: 14, w: 58, h: 102, type: 6 }});
        slots.push({{ jamo: jong, role: 'jong', x: 34, y: 122, w: 144, h: 60, type: 6 }});
        break;
      }}
      default: {{
        if (COMPOSITE_VOWELS[dec.cho]) {{
          const [subH, subV] = COMPOSITE_VOWELS[dec.cho];
          slots.push({{ jamo: subH, role: 'jung_h', x: 22, y: 98, w: 84, h: 78, type: 3 }});
          slots.push({{ jamo: subV, role: 'jung_v', x: 110, y: 18, w: 66, h: 162, type: 3 }});
        }} else {{
          slots.push({{ jamo: dec.cho, role: 'single', x: 28, y: 28, w: 144, h: 144, type: 0 }});
        }}
        break;
      }}
    }}

    return slots;
  }}

  // 9. 오프셋 보정 테이블 적용 (Optical Compensation Merger)
  function applyOpticalCompensation(baseSlots, dec, type) {{
    if (type === SYLLABLE_TYPES.SINGLE) return baseSlots;

    const choComp = OPTICAL_COMPENSATION.chosung[dec.cho] || {{ dx: 0, dy: 0, dw: 0, dh: 0 }};

    return baseSlots.map(slot => {{
      const s = Object.assign({{}}, slot);

      if (s.role === 'cho') {{
        // 세로모음/복합모음 결합 시 자음 너비 가변성 및 안쪽 들여쓰기 적용
        if ([SYLLABLE_TYPES.TYPE_1, SYLLABLE_TYPES.TYPE_3, SYLLABLE_TYPES.TYPE_4, SYLLABLE_TYPES.TYPE_6].includes(type)) {{
          s.x += choComp.dx;
          s.w += choComp.dw;
        }} else if (type === SYLLABLE_TYPES.TYPE_5 || type === SYLLABLE_TYPES.TYPE_2) {{
          // 가로모음 결합 시 원형 자음(ㅇ, ㅎ)의 좌우 팽창감 억제
          if (dec.cho === 'ㅇ' || dec.cho === 'ㅎ') {{
            s.x += choComp.dx;
            s.w += choComp.dw;
          }}
        }}
      }}
      return s;
    }});
  }}

  // 10. 통합 레이아웃 슬롯 계산기 (KS X 1001 그리드 + 광학적 보정 적용)
  function getLayoutSlots(dec) {{
    const type = determineSyllableType(dec);
    const baseSlots = getBaseLayoutGrid(type, dec);
    return applyOpticalCompensation(baseSlots, dec, type);
  }}

  // 6. 좌표 변환 (0~100 -> 슬롯 영역 x, y, w, h)
  function transformPath(d, sx, sy, sw, sh) {{
    let isX = true;
    return d.replace(/[+-]?\\d+\\.?\\d*/g, num => {{
      const val = parseFloat(num);
      const res = isX ? (sx + (val / 100) * sw).toFixed(1) : (sy + (val / 100) * sh).toFixed(1);
      isX = !isX;
      return res;
    }});
  }}

  // 7. 패스 길이 계산
  function estimatePathLength(d) {{
    const nums = d.replace(/[MCLZAmclza]/g, ' ').trim().split(/[\\s,]+/).filter(Boolean).map(Number);
    let len = 0;
    for (let i = 2; i < nums.length - 1; i += 2) {{
      const dx = nums[i] - nums[i - 2];
      const dy = nums[i + 1] - nums[i - 1];
      len += Math.sqrt(dx * dx + dy * dy);
    }}
    return Math.max(Math.round(len * 1.08), 65);
  }}

  // 8. 획의 시작점과 방향 각도 계산
  function getStrokeStartAndVector(d) {{
    const nums = d.replace(/[MCLZAmclza]/g, ' ').trim().split(/[\\s,]+/).filter(Boolean).map(Number);
    const bx = nums[0] || 100;
    const by = nums[1] || 100;
    const nx = nums[2] !== undefined ? nums[2] : bx + 10;
    const ny = nums[3] !== undefined ? nums[3] : by;
    const angle = Math.atan2(ny - by, nx - bx) * (180 / Math.PI);
    return {{ bx, by, angle }};
  }}

  // 9. 음절 획순 계획(Stroke Plan) 조립기
  function composeStrokePlan(char) {{
    const dec = decomposeHangul(char);
    const slots = getLayoutSlots(dec);
    const plan = [];

    slots.forEach(slot => {{
      let jamoList = [slot.jamo];
      if (DOUBLE_JONGS[slot.jamo]) {{
        jamoList = DOUBLE_JONGS[slot.jamo];
      }}

      jamoList.forEach((j, subIdx) => {{
        let sx = slot.x, sw = slot.w;
        let sy = slot.y, sh = slot.h;
        if (jamoList.length > 1) {{
          sw = slot.w * 0.48;
          sx = subIdx === 0 ? slot.x : slot.x + slot.w * 0.52;
        }}

        let rawStrokes = STROKE_DB[j] || [];
        // 복합 모음(ㅝ, ㅞ 등)에서 세로모음(ㅓ, ㅔ)의 가로 가지 위치를 'ㅜ'의 높이에 맞춰 하향 조정
        if (slot.role === 'jung_v') {{
          if (j === 'ㅓ') {{
            rawStrokes = [
              {{ d: 'M 8,70 L 46,70', desc: '1획: 가로' }},
              {{ d: 'M 46,4 L 46,98', desc: '2획: 세로' }}
            ];
          }} else if (j === 'ㅔ') {{
            rawStrokes = [
              {{ d: 'M 22,70 L 56,70', desc: '1획: 가로' }},
              {{ d: 'M 56,8 L 56,94',  desc: '2획: 왼 세로' }},
              {{ d: 'M 80,4 L 80,98',  desc: '3획: 오른 세로' }}
            ];
          }}
        }}
        rawStrokes.forEach(st => {{
          const transformedPath = transformPath(st.d, sx, sy, sw, sh);
          const len = estimatePathLength(transformedPath);
          const {{ bx, by, angle }} = getStrokeStartAndVector(transformedPath);
          plan.push({{
            jamo: j,
            role: slot.role,
            desc: st.desc,
            d: transformedPath,
            len: len,
            bx: bx,
            by: by,
            angle: angle
          }});
        }});
      }});
    }});
    // ── 스마트 뱃지 번호 겹침 방지 (De-overlap) ──
    for (let i = 0; i < plan.length; i++) {{
      for (let j = 0; j < i; j++) {{
        const dx = plan[i].bx - plan[j].bx;
        const dy = plan[i].by - plan[j].by;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 18) {{
          const rad = plan[i].angle * (Math.PI / 180);
          const shift = (18 - dist) + 6;
          plan[i].bx = Math.round(plan[i].bx + Math.cos(rad) * shift);
          plan[i].by = Math.round(plan[i].by + Math.sin(rad) * shift);
        }}
      }}
    }}

    return {{ char, dec, slots, strokes: plan }};
  }}

  // 획 컬러 팔레트 (선명하고 단정한 톤)
  const PALETTE = [
    '#38bdf8', '#818cf8', '#a78bfa', '#f472b6',
    '#fbbf24', '#34d399', '#f87171', '#c084fc',
    '#2dd4bf', '#fb923c', '#e879f9'
  ];

  // 10. 완성형 SVG 생성 (회색 바탕 완전 배제, 깔끔한 격자 + 획순 스트로크만 선명하게 렌더링)
  function renderComposerSvg(char, opts) {{
    opts = Object.assign({{
      viewBoxSize: 200,
      showGrid: true,
      showNumbers: true,
      showArrows: false,
      strokeWidth: 11,
      speed: 1.0,
      animated: true,
      activeStroke: -1
    }}, opts || {{}});

    const comp = composeStrokePlan(char);
    const strokes = comp.strokes;

    const strokeDur = 0.65 / opts.speed;
    const gapDur = 0.22 / opts.speed;

    // ── 1. 동적 획순 스트로크(Strokes) 및 번호 마커 생성 ──
    let strokePaths = '';
    let strokeMarkers = '';
    let animStyles = '';

    strokes.forEach((st, idx) => {{
      const color = PALETTE[idx % PALETTE.length];
      const startTime = (idx * (strokeDur + gapDur)).toFixed(2);
      const isVisible = opts.activeStroke === -1 || idx <= opts.activeStroke;

      if (opts.animated) {{
        animStyles += `
          @keyframes strokeDraw_${{idx}} {{
            0%   {{ stroke-dashoffset: ${{st.len}}; opacity: 0; }}
            10%  {{ opacity: 1; }}
            100% {{ stroke-dashoffset: 0; opacity: 1; }}
          }}
          @keyframes badgePop_${{idx}} {{
            0%   {{ opacity: 0; transform: scale(0.3); }}
            70%  {{ transform: scale(1.2); }}
            100% {{ opacity: 1; transform: scale(1); }}
          }}
          .stroke-path-${{idx}} {{
            stroke-dasharray: ${{st.len}};
            stroke-dashoffset: ${{st.len}};
            animation: strokeDraw_${{idx}} ${{strokeDur}}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            animation-delay: ${{startTime}}s;
          }}
          .stroke-badge-${{idx}} {{
            opacity: 0;
            transform-origin: ${{st.bx}}px ${{st.by}}px;
            animation: badgePop_${{idx}} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            animation-delay: ${{startTime}}s;
          }}
        `;
      }}

      const pathClass = opts.animated ? `stroke-path-${{idx}}` : '';
      const markerClass = opts.animated ? `stroke-badge-${{idx}}` : '';
      const displayStyle = isVisible ? '' : 'display:none;';

      strokePaths += `
        <path id="stroke_path_${{idx}}" class="${{pathClass}}" d="${{st.d}}"
              fill="none" stroke="${{color}}" stroke-width="${{opts.strokeWidth}}"
              stroke-linecap="round" stroke-linejoin="round"
              style="${{displayStyle}}"
              data-stroke-idx="${{idx}}" data-jamo="${{st.jamo}}" data-desc="${{st.desc}}"/>
      `;

      if (opts.showNumbers) {{
        strokeMarkers += `
          <g id="stroke_badge_${{idx}}" class="${{markerClass}}" style="${{displayStyle}}">
            <circle cx="${{st.bx}}" cy="${{st.by}}" r="10" fill="#0f172a" stroke="${{color}}" stroke-width="2" />
            <text x="${{st.bx}}" y="${{st.by + 3.5}}" text-anchor="middle" font-size="9.5" font-weight="900" fill="#ffffff" font-family="'Inter', sans-serif">${{idx + 1}}</text>
          </g>
        `;
      }}
    }});

    // 격자 및 가이드
    let gridElements = '';
    if (opts.showGrid) {{
      gridElements = `
        <line x1="100" y1="12" x2="100" y2="188" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <line x1="12" y1="100" x2="188" y2="100" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <line x1="14" y1="14" x2="186" y2="186" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="3,3"/>
        <line x1="186" y1="14" x2="14" y2="186" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="3,3"/>
        <rect x="14" y="14" width="172" height="172" rx="14" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" stroke-dasharray="4,4"/>
      `;
    }}

    return `
      <svg id="hangul_composer_svg" viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;">
        <defs>
          <style>
            ${{animStyles}}
          </style>
        </defs>

        <!-- 1. 배경 가이드 격자 (산뜻하고 은은한 가이드) -->
        <g id="hangul_grid_group">
          ${{gridElements}}
        </g>

        <!-- 2. 컬러 획순 스트로크 레이어 (Sequential Animated Paths) -->
        <g id="hangul_strokes_group">
          ${{strokePaths}}
        </g>

        <!-- 3. 획순 번호 뱃지 마커 레이어 (Numbered Badges) -->
        <g id="hangul_markers_group">
          ${{strokeMarkers}}
        </g>
      </svg>
    `.trim();
  }}

  // Public API 노출
  const HangulStrokeComposer = {{
    FONT_VECTORS,
    STROKE_DB,
    CHOS,
    JUNGS,
    JONGS,
    SYLLABLE_TYPES,
    determineSyllableType,
    getBaseLayoutGrid,
    OPTICAL_COMPENSATION,
    applyOpticalCompensation,
    decomposeHangul,
    getLayoutSlots,
    composeStrokePlan,
    renderComposerSvg,
    estimatePathLength,
    transformPath
  }};

  if (typeof module !== 'undefined' && module.exports) {{
    module.exports = HangulStrokeComposer;
  }}
  global.HangulStrokeComposer = HangulStrokeComposer;

}})(typeof window !== 'undefined' ? window : this);
'''

with open('assets/hangul_stroke_composer.js', 'w', encoding='utf-8') as f:
    f.write(composer_code)

print("Built clean assets/hangul_stroke_composer.js successfully.")
