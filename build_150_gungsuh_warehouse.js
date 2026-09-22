const opentype = require('opentype.js');
const fs = require('fs');
const path = require('path');

// 1. 궁서체 폰트 로드
const fontPath = path.join(__dirname, 'assets', 'fonts', 'Gungsuh.ttf');
const buffer = fs.readFileSync(fontPath);
const font = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));

// 기존 자모 medians 참조 DB 로드
const baseDbPath = path.join(__dirname, 'test', 'hangul_strokes_db.json');
let baseDb = {};
try {
    baseDb = JSON.parse(fs.readFileSync(baseDbPath, 'utf8'));
} catch (e) {
    console.warn("hangul_strokes_db.json 로드 실패:", e.message);
}

const CHOS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNGS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONGS = ['ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

const VERTICAL_JUNGS = new Set(['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅣ']);
const HORIZONTAL_JUNGS = new Set(['ㅗ','ㅛ','ㅜ','ㅠ','ㅡ']);
const COMPOSITE_JUNGS = new Set(['ㅘ','ㅙ','ㅚ','ㅝ','ㅞ','ㅟ','ㅢ']);

// 겹받침 / 쌍자음 분해 매핑
const DOUBLE_CONSONANTS = {
    'ㄲ': ['ㄱ', 'ㄱ'], 'ㄸ': ['ㄷ', 'ㄷ'], 'ㅃ': ['ㅂ', 'ㅂ'], 'ㅆ': ['ㅅ', 'ㅅ'], 'ㅉ': ['ㅈ', 'ㅈ'],
    'ㄳ': ['ㄱ', 'ㅅ'], 'ㄵ': ['ㄴ', 'ㅈ'], 'ㄶ': ['ㄴ', 'ㅎ'], 'ㄺ': ['ㄹ', 'ㄱ'], 'ㄻ': ['ㄹ', 'ㅁ'],
    'ㄼ': ['ㄹ', 'ㅂ'], 'ㄽ': ['ㄹ', 'ㅅ'], 'ㄾ': ['ㄹ', 'ㅌ'], 'ㄿ': ['ㄹ', 'ㅍ'], 'ㅀ': ['ㄹ', 'ㅎ'],
    'ㅄ': ['ㅂ', 'ㅅ']
};

// 1024x1024 HanziWriter 좌표계 기준 위치별 타겟 박스
const TARGET_BOXES = {
    Cho_T1: { x: 70, y: 160, w: 420, h: 720 },
    Cho_T2: { x: 180, y: 530, w: 664, h: 360 },
    Cho_T3: { x: 100, y: 520, w: 430, h: 370 },

    Jung_T1_Vertical:   { x: 550, y: 100, w: 390, h: 820 },
    Jung_T1_Horizontal: { x: 100, y: 220, w: 824, h: 320 },
    Jung_T1_Composite:  { x: 160, y: 100, w: 780, h: 820 },

    Jung_T2_Vertical:   { x: 550, y: 380, w: 390, h: 540 },
    Jung_T2_Horizontal: { x: 100, y: 440, w: 824, h: 220 },
    Jung_T2_Composite:  { x: 160, y: 380, w: 780, h: 540 },

    Jong_T1: { x: 160, y: 80, w: 700, h: 360 },
    Jong_T2: { x: 180, y: 70, w: 664, h: 280 }
};

// 글리프 원본 BBox 계산
function getGlyphBBox(glyph) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    if (!glyph.path || !glyph.path.commands || glyph.path.commands.length === 0) {
        return { minX: 100, minY: 100, maxX: 900, maxY: 900, w: 800, h: 800 };
    }

    glyph.path.commands.forEach(cmd => {
        ['x', 'x1', 'x2'].forEach(k => {
            if (cmd[k] !== undefined) {
                if (cmd[k] < minX) minX = cmd[k];
                if (cmd[k] > maxX) maxX = cmd[k];
            }
        });
        ['y', 'y1', 'y2'].forEach(k => {
            if (cmd[k] !== undefined) {
                if (cmd[k] < minY) minY = cmd[k];
                if (cmd[k] > maxY) maxY = cmd[k];
            }
        });
    });

    if (minX === Infinity) return { minX: 100, minY: 100, maxX: 900, maxY: 900, w: 800, h: 800 };
    return { minX, minY, maxX, maxY, w: maxX - minX || 1, h: maxY - minY || 1 };
}

// SVG 패스 문자열에서 바운딩 박스 추출
function getPathBounds(pathStr) {
    const nums = pathStr.match(/-?\d+(\.\d+)?/g).map(Number);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < nums.length; i += 2) {
        minX = Math.min(minX, nums[i]);
        maxX = Math.max(maxX, nums[i]);
        minY = Math.min(minY, nums[i + 1]);
        maxY = Math.max(maxY, nums[i + 1]);
    }
    return { minX, maxX, minY, maxY, w: maxX - minX || 1, h: maxY - minY || 1 };
}

// 메디안에서 바운딩 박스 추출
function getMediansBounds(medians) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    medians.forEach(s => s.forEach(([x, y]) => {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    }));
    return { minX, maxX, minY, maxY, w: maxX - minX || 1, h: maxY - minY || 1 };
}

// 궁서체 글리프에서 실제 SVG 패스 추출 및 타겟 박스로 스케일링
function extractGungsuhPathToBox(glyph, bbox, targetBox) {
    const scaleX = targetBox.w / bbox.w;
    const scaleY = targetBox.h / bbox.h;
    const scale = Math.min(scaleX, scaleY) * 0.94;

    const offsetX = targetBox.x + (targetBox.w - bbox.w * scale) / 2;
    const offsetY = targetBox.y + (targetBox.h - bbox.h * scale) / 2;

    const mapX = (x) => Math.round(offsetX + (x - bbox.minX) * scale);
    const mapY = (y) => Math.round(offsetY + (y - bbox.minY) * scale);

    let d = '';
    glyph.path.commands.forEach(cmd => {
        if (cmd.type === 'M') {
            d += `M ${mapX(cmd.x)} ${mapY(cmd.y)} `;
        } else if (cmd.type === 'L') {
            d += `L ${mapX(cmd.x)} ${mapY(cmd.y)} `;
        } else if (cmd.type === 'Q') {
            d += `Q ${mapX(cmd.x1)} ${mapY(cmd.y1)} ${mapX(cmd.x)} ${mapY(cmd.y)} `;
        } else if (cmd.type === 'C') {
            d += `C ${mapX(cmd.x1)} ${mapY(cmd.y1)} ${mapX(cmd.x2)} ${mapY(cmd.y2)} ${mapX(cmd.x)} ${mapY(cmd.y)} `;
        } else if (cmd.type === 'Z') {
            d += 'Z ';
        }
    });

    return {
        pathStr: d.trim(),
        mapX,
        mapY,
        scale,
        offsetX,
        offsetY
    };
}

// 기본 중심선(Medians) 획득 (단일 or 겹자음 합성)
function getBaseMedians(char) {
    if (baseDb[char] && baseDb[char].medians) {
        return baseDb[char].medians;
    }
    if (DOUBLE_CONSONANTS[char]) {
        const [c1, c2] = DOUBLE_CONSONANTS[char];
        const m1 = getBaseMedians(c1);
        const m2 = getBaseMedians(c2);
        const b1 = getMediansBounds(m1);
        const b2 = getMediansBounds(m2);
        
        // 좌측 자음 48% 폭
        const leftM = m1.map(s => s.map(([x, y]) => [
            Math.round(100 + ((x - b1.minX) / b1.w) * 380),
            Math.round(100 + ((y - b1.minY) / b1.h) * 800)
        ]));
        // 우측 자음 48% 폭
        const rightM = m2.map(s => s.map(([x, y]) => [
            Math.round(540 + ((x - b2.minX) / b2.w) * 380),
            Math.round(100 + ((y - b2.minY) / b2.h) * 800)
        ]));
        return [...leftM, ...rightM];
    }
    return [ [[200, 500], [800, 500]] ];
}

// [핵심 해결] 중심선을 궁서체 실제 외곽선 바운딩 박스 정중앙에 1차 정밀 일치 매핑
function mapMediansDirectlyToOutline(rawMedians, outlineBBox) {
    const mBBox = getMediansBounds(rawMedians);

    // 외곽선 테두리 두께 안쪽으로 5% 인셋 (붓글씨 정중앙 심선 위치)
    const insetX = outlineBBox.w * 0.05;
    const insetY = outlineBBox.h * 0.05;

    const targetMinX = outlineBBox.minX + insetX;
    const targetMaxX = outlineBBox.maxX - insetX;
    const targetMinY = outlineBBox.minY + insetY;
    const targetMaxY = outlineBBox.maxY - insetY;

    const targetW = targetMaxX - targetMinX || 1;
    const targetH = targetMaxY - targetMinY || 1;

    return rawMedians.map(stroke => {
        return stroke.map(([mx, my]) => {
            const u = (mx - mBBox.minX) / mBBox.w;
            const v = (my - mBBox.minY) / mBBox.h;
            return [
                Math.round(targetMinX + u * targetW),
                Math.round(targetMinY + v * targetH)
            ];
        });
    });
}

async function buildGungsuhWarehouse() {
    console.log("궁서체 원본 글리프(Gungsuh.ttf) 기반 1차 정밀 중심선 일치 데이터 생성 시작...");

    const warehouse = {
        meta: {
            title: "Hangul 153-Parts Gungsuh Warehouse (1차 중심선 외곽선 완전 일치 보정본)",
            font: "Gungsuh.ttf (궁서체 원본)",
            canvasSize: 1024,
            generatedAt: new Date().toISOString()
        },
        parts: {}
    };

    let totalCount = 0;

    // A. 초성 57개
    console.log("1. 궁서체 초성 57개 추출 및 1차 중심선 일치 보정 중...");
    CHOS.forEach(char => {
        const glyph = font.charToGlyph(char);
        const bbox = getGlyphBBox(glyph);

        [
            { type: 1, key: 'Cho_T1', desc: '받침없는 세로모음용 (좌측 긴 형태)' },
            { type: 2, key: 'Cho_T2', desc: '받침없는 가로모음용 (상단 중앙 넓은 형태)' },
            { type: 3, key: 'Cho_T3', desc: '받침있는 글자용 (상단 작고 단단한 형태)' }
        ].forEach(conf => {
            const partId = `Cho_T${conf.type}_${char}`;
            const targetBox = TARGET_BOXES[conf.key];
            const tf = extractGungsuhPathToBox(glyph, bbox, targetBox);
            const outlineBBox = getPathBounds(tf.pathStr);
            const rawMedians = getBaseMedians(char);
            // 외곽선 바운딩 박스에 1차 정밀 일치
            const fittedMedians = mapMediansDirectlyToOutline(rawMedians, outlineBBox);

            warehouse.parts[partId] = {
                id: partId,
                char: char,
                role: "cho",
                formType: conf.type,
                desc: `초성 ${conf.type}형 - ${char} (${conf.desc})`,
                box: targetBox,
                outlineBounds: outlineBBox,
                gungsuhOutline: tf.pathStr,
                strokes: fittedMedians.map(() => tf.pathStr),
                medians: fittedMedians,
                strokeCount: fittedMedians.length
            };
            totalCount++;
        });
    });

    // B. 중성 42개
    console.log("2. 궁서체 중성 42개 추출 및 1차 중심선 일치 보정 중...");
    JUNGS.forEach(char => {
        const glyph = font.charToGlyph(char);
        const bbox = getGlyphBBox(glyph);

        let kind = 'Vertical';
        if (HORIZONTAL_JUNGS.has(char)) kind = 'Horizontal';
        else if (COMPOSITE_JUNGS.has(char)) kind = 'Composite';

        [
            { type: 1, key: `Jung_T1_${kind}`, desc: '받침없는 모음' },
            { type: 2, key: `Jung_T2_${kind}`, desc: '받침있는 모음 (하단 공간 확보)' }
        ].forEach(conf => {
            const partId = `Jung_T${conf.type}_${char}`;
            const targetBox = TARGET_BOXES[conf.key];
            const tf = extractGungsuhPathToBox(glyph, bbox, targetBox);
            const outlineBBox = getPathBounds(tf.pathStr);
            const rawMedians = getBaseMedians(char);
            const fittedMedians = mapMediansDirectlyToOutline(rawMedians, outlineBBox);

            warehouse.parts[partId] = {
                id: partId,
                char: char,
                role: "jung",
                formType: conf.type,
                desc: `중성 ${conf.type}형 - ${char} (${conf.desc})`,
                box: targetBox,
                outlineBounds: outlineBBox,
                gungsuhOutline: tf.pathStr,
                strokes: fittedMedians.map(() => tf.pathStr),
                medians: fittedMedians,
                strokeCount: fittedMedians.length
            };
            totalCount++;
        });
    });

    // C. 종성 54개
    console.log("3. 궁서체 종성 54개 추출 및 1차 중심선 일치 보정 중...");
    JONGS.forEach(char => {
        const glyph = font.charToGlyph(char);
        const bbox = getGlyphBBox(glyph);

        [
            { type: 1, key: 'Jong_T1', desc: '세로모음 받침용 (하단 중앙)' },
            { type: 2, key: 'Jong_T2', desc: '가로/복합모음 받침용 (최하단 납작)' }
        ].forEach(conf => {
            const partId = `Jong_T${conf.type}_${char}`;
            const targetBox = TARGET_BOXES[conf.key];
            const tf = extractGungsuhPathToBox(glyph, bbox, targetBox);
            const outlineBBox = getPathBounds(tf.pathStr);
            const rawMedians = getBaseMedians(char);
            const fittedMedians = mapMediansDirectlyToOutline(rawMedians, outlineBBox);

            warehouse.parts[partId] = {
                id: partId,
                char: char,
                role: "jong",
                formType: conf.type,
                desc: `종성 ${conf.type}형 - ${char} (${conf.desc})`,
                box: targetBox,
                outlineBounds: outlineBBox,
                gungsuhOutline: tf.pathStr,
                strokes: fittedMedians.map(() => tf.pathStr),
                medians: fittedMedians,
                strokeCount: fittedMedians.length
            };
            totalCount++;
        });
    });

    console.log(`\n완료: 총 ${totalCount}개 궁서체 부품 1차 정밀 중심선 일치 완료!`);

    const jsonStr = JSON.stringify(warehouse, null, 2);
    const jsStr = `/**
 * hangul_150_parts_warehouse.js
 * 
 * 한글 153개 자소 '궁서체 부품 창고' (1차 정밀 중심선 일치 데이터베이스)
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

    console.log("저장 완료: hangul_150_parts_warehouse.json/js");
}

buildGungsuhWarehouse().catch(console.error);
