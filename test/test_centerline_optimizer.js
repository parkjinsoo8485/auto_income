const fs = require('fs');

// 1. SVG Path to Polygons with bezier sampling
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
            for (let t = 0.1; t <= 1.0; t += 0.1) {
                const bx = (1-t)*(1-t)*curX + 2*(1-t)*t*x1 + t*t*x2;
                const by = (1-t)*(1-t)*curY + 2*(1-t)*t*y1 + t*t*y2;
                currentPoly.push([bx, by]);
            }
            curX = x2; curY = y2;
        } else if (cmd.type === 'C') {
            const x1 = cmd.args[0], y1 = cmd.args[1];
            const x2 = cmd.args[2], y2 = cmd.args[3];
            const x3 = cmd.args[4], y3 = cmd.args[5];
            for (let t = 0.1; t <= 1.0; t += 0.1) {
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

// 2. Point in polygon test
function pointInPolygons(x, y, polygons) {
    let inside = false;
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

// 3. Distance from point to polygon boundary segments
function distanceToBoundary(px, py, polygons) {
    let minDistSq = Infinity;
    for (const poly of polygons) {
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const x1 = poly[j][0], y1 = poly[j][1];
            const x2 = poly[i][0], y2 = poly[i][1];
            const dx = x2 - x1, dy = y2 - y1;
            const lenSq = dx * dx + dy * dy;
            let t = lenSq === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / lenSq;
            t = Math.max(0, Math.min(1, t));
            const projX = x1 + t * dx;
            const projY = y1 + t * dy;
            const distSq = (px - projX) * (px - projX) + (py - projY) * (py - projY);
            if (distSq < minDistSq) minDistSq = distSq;
        }
    }
    return Math.sqrt(minDistSq);
}

// Signed distance: positive inside, negative outside
function signedDistance(x, y, polygons) {
    const d = distanceToBoundary(x, y, polygons);
    const inside = pointInPolygons(x, y, polygons);
    return inside ? d : -d;
}

// 4. Find local center on cross-section
// For point pt, perpendicular to tangent dir, find local ridge of signedDistance
function optimizePointToCenter(pt, tangent, polygons, maxSearchRadius = 90) {
    const [x, y] = pt;
    const [tx, ty] = tangent;
    const tLen = Math.hypot(tx, ty);
    if (tLen < 1e-4) return [x, y];

    // Normal vector perpendicular to tangent
    const nx = -ty / tLen;
    const ny = tx / tLen;

    // Sample along the normal line: [-maxSearchRadius, +maxSearchRadius]
    let bestDist = -Infinity;
    let bestOffset = 0;
    
    // Step 1: broad search along normal
    const samples = [];
    const step = 2; // 2px precision
    for (let r = -maxSearchRadius; r <= maxSearchRadius; r += step) {
        const sx = x + r * nx;
        const sy = y + r * ny;
        const sd = signedDistance(sx, sy, polygons);
        samples.push({ r, sd, sx, sy });
    }

    // Find continuous positive (inside) intervals along this normal
    const insideIntervals = [];
    let curInterval = null;
    for (let i = 0; i < samples.length; i++) {
        if (samples[i].sd > 0) {
            if (!curInterval) curInterval = { start: samples[i].r, end: samples[i].r, maxSd: samples[i].sd, maxR: samples[i].r };
            else {
                curInterval.end = samples[i].r;
                if (samples[i].sd > curInterval.maxSd) {
                    curInterval.maxSd = samples[i].sd;
                    curInterval.maxR = samples[i].r;
                }
            }
        } else {
            if (curInterval) {
                insideIntervals.push(curInterval);
                curInterval = null;
            }
        }
    }
    if (curInterval) insideIntervals.push(curInterval);

    if (insideIntervals.length > 0) {
        // Choose the interval closest to r = 0 (the current point)
        insideIntervals.sort((a, b) => {
            const distA = Math.min(Math.abs(a.start), Math.abs(a.end));
            const distB = Math.min(Math.abs(b.start), Math.abs(b.end));
            return distA - distB;
        });

        const target = insideIntervals[0];
        // The midpoint of this inside cross-section interval is the geometric center of the stroke!
        const midR = (target.start + target.end) / 2;
        
        // Also check peak distance point near midR
        const optimizedX = Math.round(x + midR * nx);
        const optimizedY = Math.round(y + midR * ny);
        return [optimizedX, optimizedY];
    }

    // If completely outside along normal, do a 2D local gradient search towards positive signed distance
    let curX = x, curY = y;
    for (let iter = 0; iter < 20; iter++) {
        const curSd = signedDistance(curX, curY, polygons);
        if (curSd > 10) break; // safely inside
        // gradient estimation
        const eps = 3;
        const gX = signedDistance(curX + eps, curY, polygons) - signedDistance(curX - eps, curY, polygons);
        const gY = signedDistance(curX, curY + eps, polygons) - signedDistance(curX, curY - eps, polygons);
        const gLen = Math.hypot(gX, gY);
        if (gLen < 1e-4) break;
        curX += (gX / gLen) * 6;
        curY += (gY / gLen) * 6;
    }

    return [Math.round(curX), Math.round(curY)];
}

// 5. Optimize an entire median stroke
function optimizeStroke(stroke, polygons) {
    const n = stroke.length;
    if (n < 2) return stroke;

    const result = [];
    for (let i = 0; i < n; i++) {
        let tx = 0, ty = 0;
        if (i === 0) {
            tx = stroke[1][0] - stroke[0][0];
            ty = stroke[1][1] - stroke[0][1];
        } else if (i === n - 1) {
            tx = stroke[n - 1][0] - stroke[n - 2][0];
            ty = stroke[n - 1][1] - stroke[n - 2][1];
        } else {
            tx = stroke[i + 1][0] - stroke[i - 1][0];
            ty = stroke[i + 1][1] - stroke[i - 1][1];
        }

        const optPt = optimizePointToCenter(stroke[i], [tx, ty], polygons);
        result.push(optPt);
    }

    // Smooth endpoints inset: ensure start & end points don't poke out
    // If start point is very close to boundary or outside, pull it slightly inward along tangent
    for (let pass = 0; pass < 2; pass++) {
        // Start point
        const t0x = result[1][0] - result[0][0];
        const t0y = result[1][1] - result[0][1];
        const t0Len = Math.hypot(t0x, t0y);
        if (t0Len > 1) {
            const sd0 = signedDistance(result[0][0], result[0][1], polygons);
            if (sd0 < 8) { // too close to boundary or outside
                result[0][0] = Math.round(result[0][0] + (t0x / t0Len) * 6);
                result[0][1] = Math.round(result[0][1] + (t0y / t0Len) * 6);
            }
        }
        // End point
        const teX = result[n - 1][0] - result[n - 2][0];
        const teY = result[n - 1][1] - result[n - 2][1];
        const teLen = Math.hypot(teX, teY);
        if (teLen > 1) {
            const sdE = signedDistance(result[n - 1][0], result[n - 1][1], polygons);
            if (sdE < 8) {
                result[n - 1][0] = Math.round(result[n - 1][0] - (teX / teLen) * 6);
                result[n - 1][1] = Math.round(result[n - 1][1] - (teY / teLen) * 6);
            }
        }
    }

    return result;
}

// Test on Cho_T1_ㄱ
const wh = JSON.parse(fs.readFileSync('hangul_150_parts_warehouse.json', 'utf8'));
const part = wh.parts['Cho_T1_ㄱ'];
const polys = parsePathToPolygons(part.gungsuhOutline);

console.log('--- Cho_T1_ㄱ 테스트 ---');
console.log('이전 Medians:');
part.medians[0].forEach((pt, i) => {
    const sd = signedDistance(pt[0], pt[1], polys);
    console.log(` 점 ${i+1}: [${pt[0]}, ${pt[1]}], SignedDist: ${sd.toFixed(1)}px (${sd > 0 ? '내부' : '외부!'})`);
});

const optimizedStroke = optimizeStroke(part.medians[0], polys);
console.log('\n최적화 후 Medians:');
optimizedStroke.forEach((pt, i) => {
    const sd = signedDistance(pt[0], pt[1], polys);
    console.log(` 점 ${i+1}: [${pt[0]}, ${pt[1]}], SignedDist: ${sd.toFixed(1)}px (${sd > 0 ? '내부 (중앙 안착)' : '외부!'})`);
});
