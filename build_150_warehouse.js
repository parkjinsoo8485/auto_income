const fs = require('fs');
const path = require('path');

// 기존 40개 자모의 완벽한 획 분할 DB (strokes + medians) 로드
const baseDbPath = path.join(__dirname, 'test', 'hangul_strokes_db.json');
const baseDb = JSON.parse(fs.readFileSync(baseDbPath, 'utf8'));

const CHOS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNGS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONGS = ['ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

const VERTICAL_JUNGS = new Set(['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅣ']);
const HORIZONTAL_JUNGS = new Set(['ㅗ','ㅛ','ㅜ','ㅠ','ㅡ']);
const COMPOSITE_JUNGS = new Set(['ㅘ','ㅙ','ㅚ','ㅝ','ㅞ','ㅟ','ㅢ']);

// 겹받침 및 쌍자음 구성 쌍
const DOUBLE_CONSONANTS = {
    'ㄲ': ['ㄱ', 'ㄱ'],
    'ㄸ': ['ㄷ', 'ㄷ'],
    'ㅃ': ['ㅂ', 'ㅂ'],
    'ㅆ': ['ㅅ', 'ㅅ'],
    'ㅉ': ['ㅈ', 'ㅈ'],
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

// SVG 패스 및 메디안에서 바운딩 박스 추출
function getRawBBox(strokes, medians) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    const parseNumbers = (str) => {
        const matches = str.match(/-?\d+(\.\d+)?/g);
        return matches ? matches.map(Number) : [];
    };

    strokes.forEach(d => {
        const nums = parseNumbers(d);
        for (let i = 0; i < nums.length; i += 2) {
            if (nums[i] < minX) minX = nums[i];
            if (nums[i] > maxX) maxX = nums[i];
            if (i + 1 < nums.length) {
                if (nums[i + 1] < minY) minY = nums[i + 1];
                if (nums[i + 1] > maxY) maxY = nums[i + 1];
            }
        }
    });

    medians.forEach(stroke => {
        stroke.forEach(([x, y]) => {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        });
    });

    if (minX === Infinity) return { minX: 100, minY: 100, maxX: 900, maxY: 900, w: 800, h: 800 };
    return { minX, minY, maxX, maxY, w: maxX - minX || 1, h: maxY - minY || 1 };
}

// SVG 패스 좌표 변환 함수
function transformSvgPath(d, transform) {
    return d.replace(/([MLQCZ])\s*([^MLQCZ]*)/gi, (match, cmd, args) => {
        if (cmd.toUpperCase() === 'Z') return 'Z';
        const nums = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
        const newNums = [];
        for (let i = 0; i < nums.length; i += 2) {
            if (i + 1 < nums.length) {
                const [nx, ny] = transform(nums[i], nums[i + 1]);
                newNums.push(`${nx},${ny}`);
            }
        }
        return `${cmd} ${newNums.join(' ')}`;
    });
}

// 기본 자소 데이터(strokes + medians) 가져오기 (단일 or 겹자음 합성)
function getBaseJamoData(char) {
    if (baseDb[char]) {
        return {
            strokes: [...baseDb[char].strokes],
            medians: JSON.parse(JSON.stringify(baseDb[char].medians))
        };
    }

    // 겹받침 / 쌍자음의 경우 좌/우 나란히 합성
    if (DOUBLE_CONSONANTS[char]) {
        const [c1, c2] = DOUBLE_CONSONANTS[char];
        const d1 = getBaseJamoData(c1);
        const d2 = getBaseJamoData(c2);

        const b1 = getRawBBox(d1.strokes, d1.medians);
        const b2 = getRawBBox(d2.strokes, d2.medians);

        // 좌측 자음: X축 45% 축소, 왼쪽 배치 (100~500)
        const t1 = (x, y) => [Math.round(100 + ((x - b1.minX) / b1.w) * 380), Math.round(y)];
        const s1 = d1.strokes.map(s => transformSvgPath(s, t1));
        const m1 = d1.medians.map(stroke => stroke.map(([x, y]) => t1(x, y)));

        // 우측 자음: X축 45% 축소, 오른쪽 배치 (540~940)
        const t2 = (x, y) => [Math.round(540 + ((x - b2.minX) / b2.w) * 380), Math.round(y)];
        const s2 = d2.strokes.map(s => transformSvgPath(s, t2));
        const m2 = d2.medians.map(stroke => stroke.map(([x, y]) => t2(x, y)));

        return {
            strokes: [...s1, ...s2],
            medians: [...m1, ...m2]
        };
    }

    throw new Error(`자소 데이터를 찾을 수 없습니다: ${char}`);
}

/**
 * 1024 x 1024 HanziWriter 좌표계 기준 위치별 박스 규격
 * (HanziWriter: Y=0 하단, Y=1024 상단)
 */
const TARGET_BOXES = {
    // --- 1. 초성 3벌 (총 57개) ---
    // 초성 1형: 받침 없는 세로 모음 (가, 나, 다...) - 좌측 키 크게 배치
    Cho_T1: { x: 70, y: 160, w: 420, h: 720 },
    // 초성 2형: 받침 없는 가로 모음 (고, 노, 도...) - 상단 중앙에 넓게 배치
    Cho_T2: { x: 180, y: 530, w: 664, h: 360 },
    // 초성 3형: 받침 있는 글자 (각, 간, 곡, 괄...) - 상단 좌측/중앙에 단단하게 배치
    Cho_T3: { x: 100, y: 520, w: 430, h: 370 },

    // --- 2. 중성 2벌 (총 42개) ---
    // 중성 1형: 받침 없는 모음 (가, 고, 과...)
    Jung_T1_Vertical:   { x: 550, y: 100, w: 390, h: 820 },
    Jung_T1_Horizontal: { x: 100, y: 220, w: 824, h: 320 },
    Jung_T1_Composite:  { x: 160, y: 100, w: 780, h: 820 },

    // 중성 2형: 받침 있는 모음 (각, 곡, 괄...) - 하단 받침 공간 확보
    Jung_T2_Vertical:   { x: 550, y: 380, w: 390, h: 540 },
    Jung_T2_Horizontal: { x: 100, y: 440, w: 824, h: 220 },
    Jung_T2_Composite:  { x: 160, y: 380, w: 780, h: 540 },

    // --- 3. 종성 2벌 (총 54개) ---
    // 종성 1형: 세로 모음 받침 (각, 간, 갈, 감...) - 하단 중앙
    Jong_T1: { x: 160, y: 80, w: 700, h: 360 },
    // 종성 2형: 가로/복합 모음 받침 (곡, 군, 괄, 글...) - 최하단에 납작하게
    Jong_T2: { x: 180, y: 70, w: 664, h: 280 }
};

// 획별 strokes와 medians를 타겟 박스로 동시 아핀 변환 (1:1 완전 결합)
function transformJamoToTargetBox(baseData, targetBox) {
    const origBBox = getRawBBox(baseData.strokes, baseData.medians);

    const scaleX = targetBox.w / origBBox.w;
    const scaleY = targetBox.h / origBBox.h;
    const scale = Math.min(scaleX, scaleY) * 0.94; // 종횡비 보존하며 박스에 채움

    const offsetX = targetBox.x + (targetBox.w - origBBox.w * scale) / 2;
    const offsetY = targetBox.y + (targetBox.h - origBBox.h * scale) / 2;

    const transformPoint = (x, y) => [
        Math.round(offsetX + (x - origBBox.minX) * scale),
        Math.round(offsetY + (y - origBBox.minY) * scale)
    ];

    // 1. 각 획별 외곽선 변환
    const transformedStrokes = baseData.strokes.map(d => transformSvgPath(d, transformPoint));

    // 2. 각 획별 중심선 변환 (외곽선과 동일한 행렬 적용 -> 중심선이 항상 외곽선 정중앙 통과!)
    const transformedMedians = baseData.medians.map(stroke => 
        stroke.map(([x, y]) => transformPoint(x, y))
    );

    return {
        strokes: transformedStrokes,
        medians: transformedMedians,
        strokeCount: transformedStrokes.length
    };
}

async function buildWarehouse() {
    console.log("한글 153개 자소 '부품 창고' (외곽선 + 중심선 1:1 결합 데이터베이스) 생성 중...");

    const warehouse = {
        meta: {
            title: "Hangul 153-Parts Warehouse (Perfect Stroke + Median Lock)",
            system: "153-Parts Warehouse (Cho 57 + Jung 42 + Jong 54)",
            canvasSize: 1024,
            description: "모든 부품의 각 획(Stroke)별 외곽선과 중심선(Median)이 1:1로 완벽히 결합된 데이터베이스",
            generatedAt: new Date().toISOString()
        },
        parts: {}
    };

    let totalCount = 0;

    // A. 초성 57개 생성 (19자 x 3벌)
    console.log("1. 초성 57개 생성 중 (획별 외곽선 + 중심선 결합)...");
    CHOS.forEach(char => {
        const base = getBaseJamoData(char);

        [
            { type: 1, key: 'Cho_T1', desc: '받침없는 세로모음용 (좌측)' },
            { type: 2, key: 'Cho_T2', desc: '받침없는 가로모음용 (상단중앙)' },
            { type: 3, key: 'Cho_T3', desc: '받침있는 글자용 (상단작게)' }
        ].forEach(conf => {
            const partId = `Cho_T${conf.type}_${char}`;
            const targetBox = TARGET_BOXES[conf.key];
            const tf = transformJamoToTargetBox(base, targetBox);

            warehouse.parts[partId] = {
                id: partId,
                char: char,
                role: "cho",
                formType: conf.type,
                desc: `초성 ${conf.type}형 - ${char} (${conf.desc})`,
                box: targetBox,
                strokeCount: tf.strokeCount,
                strokes: tf.strokes,
                medians: tf.medians
            };
            totalCount++;
        });
    });

    // B. 중성 42개 생성 (21자 x 2벌)
    console.log("2. 중성 42개 생성 중 (획별 외곽선 + 중심선 결합)...");
    JUNGS.forEach(char => {
        const base = getBaseJamoData(char);

        let kind = 'Vertical';
        if (HORIZONTAL_JUNGS.has(char)) kind = 'Horizontal';
        else if (COMPOSITE_JUNGS.has(char)) kind = 'Composite';

        [
            { type: 1, key: `Jung_T1_${kind}`, desc: '받침없는 모음' },
            { type: 2, key: `Jung_T2_${kind}`, desc: '받침있는 모음 (하단받침공간확보)' }
        ].forEach(conf => {
            const partId = `Jung_T${conf.type}_${char}`;
            const targetBox = TARGET_BOXES[conf.key];
            const tf = transformJamoToTargetBox(base, targetBox);

            warehouse.parts[partId] = {
                id: partId,
                char: char,
                role: "jung",
                formType: conf.type,
                desc: `중성 ${conf.type}형 - ${char} (${conf.desc})`,
                box: targetBox,
                strokeCount: tf.strokeCount,
                strokes: tf.strokes,
                medians: tf.medians
            };
            totalCount++;
        });
    });

    // C. 종성 54개 생성 (27자 x 2벌)
    console.log("3. 종성 54개 생성 중 (획별 외곽선 + 중심선 결합)...");
    JONGS.forEach(char => {
        const base = getBaseJamoData(char);

        [
            { type: 1, key: 'Jong_T1', desc: '세로모음 받침용 (하단중앙)' },
            { type: 2, key: 'Jong_T2', desc: '가로/복합모음 받침용 (최하단납작)' }
        ].forEach(conf => {
            const partId = `Jong_T${conf.type}_${char}`;
            const targetBox = TARGET_BOXES[conf.key];
            const tf = transformJamoToTargetBox(base, targetBox);

            warehouse.parts[partId] = {
                id: partId,
                char: char,
                role: "jong",
                formType: conf.type,
                desc: `종성 ${conf.type}형 - ${char} (${conf.desc})`,
                box: targetBox,
                strokeCount: tf.strokeCount,
                strokes: tf.strokes,
                medians: tf.medians
            };
            totalCount++;
        });
    });

    console.log(`\n검증: 총 ${totalCount}개 부품 생성 완료!`);

    // 모든 부품의 strokes.length === medians.length 검증
    let allValid = true;
    Object.keys(warehouse.parts).forEach(k => {
        const p = warehouse.parts[k];
        if (p.strokes.length !== p.medians.length) {
            console.error(`[오류] ${k}: strokes(${p.strokes.length}) != medians(${p.medians.length})`);
            allValid = false;
        }
    });

    if (allValid) {
        console.log("✅ 153개 모든 부품의 strokes 수와 medians 수가 1:1로 100% 일치합니다!");
    }

    // 파일 저장
    const jsonStr = JSON.stringify(warehouse, null, 2);
    const jsStr = `/**
 * hangul_150_parts_warehouse.js
 * 
 * 한글 153개 자소 '부품 창고' (외곽선 + 중심선 1:1 완전 결합 데이터베이스)
 * - 초성: 57개 (19자 x 3벌)
 * - 중성: 42개 (21자 x 2벌)
 * - 종성: 54개 (27자 x 2벌)
 * 총합: 153개 정밀 외곽선(Strokes) 및 중심선(Medians) 완벽 결합
 */
(function (global) {
  'use strict';
  global.HANGUL_150_WAREHOUSE = ${jsonStr};
})(typeof window !== 'undefined' ? window : global);
`;

    fs.writeFileSync('hangul_150_parts_warehouse.json', jsonStr, 'utf8');
    fs.writeFileSync('hangul_150_parts_warehouse.js', jsStr, 'utf8');
    fs.writeFileSync('test/hangul_150_parts_warehouse.json', jsonStr, 'utf8');
    fs.writeFileSync('test/hangul_150_parts_warehouse.js', jsStr, 'utf8');

    console.log("\n저장 완료:");
    console.log(" - hangul_150_parts_warehouse.json");
    console.log(" - hangul_150_parts_warehouse.js");
    console.log(" - test/hangul_150_parts_warehouse.json");
    console.log(" - test/hangul_150_parts_warehouse.js");
}

buildWarehouse().catch(console.error);
