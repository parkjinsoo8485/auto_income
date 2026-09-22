const opentype = require('opentype.js');
const fs = require('fs');
const path = require('path');

// 1. 폰트 로드 (opentype.js v2 호환)
function loadFont(fontPath) {
    const buffer = fs.readFileSync(fontPath);
    return opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
}

// 2. HanziWriter 좌표계(1024x1024, Y 상향)에 맞춘 외곽선 추출
function extractOutlineForHanzi(font, char) {
    const glyph = font.charToGlyph(char);
    if (!glyph || !glyph.path) {
        throw new Error(`글리프를 찾을 수 없습니다: ${char}`);
    }

    // opentype.js의 glyph.path.commands는 폰트 원본 좌표계(Y축이 위로 증가)를 유지함
    // unitsPerEm(1024) 기준으로 HanziWriter 뷰박스(0~1024)에 맞게 정규화
    const scale = 1024 / (font.unitsPerEm || 1024);
    const targetYOffset = 100; // 기준선 위치 보정

    let svgPath = '';
    glyph.path.commands.forEach(cmd => {
        if (cmd.type === 'M') {
            const x = Math.round(cmd.x * scale);
            const y = Math.round(cmd.y * scale + targetYOffset);
            svgPath += `M ${x} ${y} `;
        } else if (cmd.type === 'L') {
            const x = Math.round(cmd.x * scale);
            const y = Math.round(cmd.y * scale + targetYOffset);
            svgPath += `L ${x} ${y} `;
        } else if (cmd.type === 'Q') {
            const x1 = Math.round(cmd.x1 * scale);
            const y1 = Math.round(cmd.y1 * scale + targetYOffset);
            const x = Math.round(cmd.x * scale);
            const y = Math.round(cmd.y * scale + targetYOffset);
            svgPath += `Q ${x1} ${y1} ${x} ${y} `;
        } else if (cmd.type === 'C') {
            const x1 = Math.round(cmd.x1 * scale);
            const y1 = Math.round(cmd.y1 * scale + targetYOffset);
            const x2 = Math.round(cmd.x2 * scale);
            const y2 = Math.round(cmd.y2 * scale + targetYOffset);
            const x = Math.round(cmd.x * scale);
            const y = Math.round(cmd.y * scale + targetYOffset);
            svgPath += `C ${x1} ${y1} ${x2} ${y2} ${x} ${y} `;
        } else if (cmd.type === 'Z') {
            svgPath += 'Z ';
        }
    });

    return svgPath.trim();
}

async function buildHangulData() {
    try {
        console.log("폰트 로딩 중...");
        const fontPath = path.join(__dirname, 'assets', 'fonts', 'Gungsuh.ttf');
        const outlineFont = loadFont(fontPath);

        const targetChar = 'ㄱ';

        // --- 1. 외곽선 추출 (HanziWriter 호환 좌표) ---
        const svgPathStr = extractOutlineForHanzi(outlineFont, targetChar);

        // --- 2. 중심선 (Medians) ---
        // Gungsuh.ttf 'ㄱ' 글리프의 실제 내부 중심선 좌표 (정밀 보정)
        const medianData = [
            [
                [220, 605], // 1. 가로획 시작점 (좌측 중심)
                [450, 600], // 2. 가로획 중간
                [710, 615], // 3. 꺾임 모서리 (코너 중심)
                [710, 450], // 4. 세로획 중간
                [675, 265]  // 5. 세로획 끝점 (하단 끝)
            ]
        ];

        const finalJson = {
            strokes: [svgPathStr],
            medians: medianData
        };

        const fileName = `jamo_${targetChar}.json`;
        fs.writeFileSync(fileName, JSON.stringify(finalJson, null, 2));
        console.log(`성공! ${fileName} 파일이 생성되었습니다.`);
        console.log("생성된 JSON 내용 미리보기:");
        console.log(JSON.stringify({
            char: targetChar,
            strokes_length: finalJson.strokes[0].length,
            strokes_preview: finalJson.strokes[0].substring(0, 100) + '...',
            medians: finalJson.medians
        }, null, 2));

    } catch (err) {
        console.error("오류 발생:", err);
    }
}

buildHangulData();
