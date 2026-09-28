const fs = require('fs');
const wh = JSON.parse(fs.readFileSync('hangul_150_parts_warehouse.json', 'utf8'));

// SVG path parser & point in polygon check
function parsePathToPolygons(pathStr) {
    const commands = [];
    const re = /([MLQCZ])([^MLQCZ]*)/g;
    let match;
    while ((match = re.exec(pathStr)) !== null) {
        const type = match[1];
        const args = match[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
        commands.push({ type, args });
    }
    const polygons = [];
    let currentPoly = [];
    let curX = 0, curY = 0;
    for (const cmd of commands) {
        if (cmd.type === 'M') {
            if (currentPoly.length > 2) polygons.push(currentPoly);
            curX = cmd.args[0]; curY = cmd.args[1];
            currentPoly = [[curX, curY]];
        } else if (cmd.type === 'L') {
            curX = cmd.args[0]; curY = cmd.args[1];
            currentPoly.push([curX, curY]);
        } else if (cmd.type === 'Q') {
            const x1 = cmd.args[0], y1 = cmd.args[1];
            const x2 = cmd.args[2], y2 = cmd.args[3];
            for (let t = 0.2; t <= 1.0; t += 0.2) {
                const bx = (1-t)*(1-t)*curX + 2*(1-t)*t*x1 + t*t*x2;
                const by = (1-t)*(1-t)*curY + 2*(1-t)*t*y1 + t*t*y2;
                currentPoly.push([bx, by]);
            }
            curX = x2; curY = y2;
        } else if (cmd.type === 'C') {
            const x1 = cmd.args[0], y1 = cmd.args[1];
            const x2 = cmd.args[2], y2 = cmd.args[3];
            const x3 = cmd.args[4], y3 = cmd.args[5];
            for (let t = 0.2; t <= 1.0; t += 0.2) {
                const bx = Math.pow(1-t,3)*curX + 3*Math.pow(1-t,2)*t*x1 + 3*(1-t)*t*t*x2 + Math.pow(t,3)*x3;
                const by = Math.pow(1-t,3)*curY + 3*Math.pow(1-t,2)*t*y1 + 3*(1-t)*t*t*y2 + Math.pow(t,3)*y3;
                currentPoly.push([bx, by]);
            }
            curX = x3; curY = y3;
        } else if (cmd.type === 'Z') {
            if (currentPoly.length > 2) polygons.push(currentPoly);
            currentPoly = [];
        }
    }
    if (currentPoly.length > 2) polygons.push(currentPoly);
    return polygons;
}

function pointInPolygons(p, polygons) {
    let inside = false;
    const x = p[0], y = p[1];
    for (const poly of polygons) {
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const xi = poly[i][0], yi = poly[i][1];
            const xj = poly[j][0], yj = poly[j][1];
            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
    }
    return inside;
}

let totalPoints = 0;
let outsidePoints = 0;
const outsideList = [];

for (const [id, part] of Object.entries(wh.parts)) {
    const polys = parsePathToPolygons(part.gungsuhOutline);
    let partOutside = 0;
    part.medians.forEach((stroke, sIdx) => {
        stroke.forEach((pt, pIdx) => {
            totalPoints++;
            if (!pointInPolygons(pt, polys)) {
                outsidePoints++;
                partOutside++;
            }
        });
    });
    if (partOutside > 0) {
        const total = part.medians.reduce((a,b)=>a+b.length,0);
        outsideList.push({ id, outside: partOutside, total, ratio: (partOutside/total*100).toFixed(0) + '%' });
    }
}

console.log('총 제어점 수:', totalPoints);
console.log('외곽선을 벗어난 제어점 수:', outsidePoints, `(${(outsidePoints/totalPoints*100).toFixed(1)}%)`);
console.log('외곽선을 벗어난 부품 수:', outsideList.length, '/', Object.keys(wh.parts).length);
console.log('벗어난 부품 샘플 (20개):');
console.table(outsideList.slice(0, 20));
