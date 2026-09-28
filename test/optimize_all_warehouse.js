const fs = require('fs');

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
            for (let t = 0.08; t <= 1.0; t += 0.08) {
                const bx = (1-t)*(1-t)*curX + 2*(1-t)*t*x1 + t*t*x2;
                const by = (1-t)*(1-t)*curY + 2*(1-t)*t*y1 + t*t*y2;
                currentPoly.push([bx, by]);
            }
            curX = x2; curY = y2;
        } else if (cmd.type === 'C') {
            const x1 = cmd.args[0], y1 = cmd.args[1];
            const x2 = cmd.args[2], y2 = cmd.args[3];
            const x3 = cmd.args[4], y3 = cmd.args[5];
            for (let t = 0.08; t <= 1.0; t += 0.08) {
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

function signedDistance(x, y, polygons) {
    const d = distanceToBoundary(x, y, polygons);
    const inside = pointInPolygons(x, y, polygons);
    return inside ? d : -d;
}

function optimizePointToCenter(pt, tangent, polygons, maxSearchRadius = 130) {
    const [x, y] = pt;
    const [tx, ty] = tangent;
    const tLen = Math.hypot(tx, ty);
    if (tLen < 1e-4) return [x, y];

    const nx = -ty / tLen;
    const ny = tx / tLen;

    const samples = [];
    const step = 2;
    for (let r = -maxSearchRadius; r <= maxSearchRadius; r += step) {
        const sx = x + r * nx;
        const sy = y + r * ny;
        const sd = signedDistance(sx, sy, polygons);
        samples.push({ r, sd, sx, sy });
    }

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
        insideIntervals.sort((a, b) => {
            const distA = Math.min(Math.abs(a.start), Math.abs(a.end));
            const distB = Math.min(Math.abs(b.start), Math.abs(b.end));
            return distA - distB;
        });

        const target = insideIntervals[0];
        // Midpoint of cross section interval
        const midR = (target.start + target.end) / 2;
        const optimizedX = Math.round(x + midR * nx);
        const optimizedY = Math.round(y + midR * ny);
        return [optimizedX, optimizedY];
    }

    // fallback 2D local gradient search
    let curX = x, curY = y;
    for (let iter = 0; iter < 40; iter++) {
        const curSd = signedDistance(curX, curY, polygons);
        if (curSd > 12) break;
        const eps = 4;
        const gX = signedDistance(curX + eps, curY, polygons) - signedDistance(curX - eps, curY, polygons);
        const gY = signedDistance(curX, curY + eps, polygons) - signedDistance(curX, curY - eps, polygons);
        const gLen = Math.hypot(gX, gY);
        if (gLen < 1e-4) break;
        curX += (gX / gLen) * 6;
        curY += (gY / gLen) * 6;
    }

    return [Math.round(curX), Math.round(curY)];
}

function snapInsideStroke(pt, neighborPt, polygons, minMargin = 6) {
    let [x, y] = pt;
    if (signedDistance(x, y, polygons) >= minMargin) return [x, y];

    if (neighborPt) {
        const dx = neighborPt[0] - x;
        const dy = neighborPt[1] - y;
        const len = Math.hypot(dx, dy);
        if (len > 1e-3) {
            const ux = dx / len;
            const uy = dy / len;
            for (let step = 1; step <= 30; step++) {
                const nx = Math.round(x + ux * step * 2);
                const ny = Math.round(y + uy * step * 2);
                if (signedDistance(nx, ny, polygons) >= minMargin) {
                    return [nx, ny];
                }
            }
        }
    }

    let bestX = x, bestY = y;
    let bestSd = signedDistance(x, y, polygons);
    for (let r = 2; r <= 35; r += 2) {
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
            const sx = Math.round(x + r * Math.cos(angle));
            const sy = Math.round(y + r * Math.sin(angle));
            const sd = signedDistance(sx, sy, polygons);
            if (sd > bestSd) {
                bestSd = sd;
                bestX = sx;
                bestY = sy;
                if (bestSd >= minMargin) return [bestX, bestY];
            }
        }
    }
    return [bestX, bestY];
}

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

    // Snap all points firmly inside stroke
    for (let i = 0; i < n; i++) {
        const neighbor = (i === 0) ? result[1] : (i === n - 1 ? result[n - 2] : result[i - 1]);
        result[i] = snapInsideStroke(result[i], neighbor, polygons, 6);
    }

    return result;
}

// Run across all 153 parts
const wh = JSON.parse(fs.readFileSync('hangul_150_parts_warehouse.json', 'utf8'));

let totalPts = 0;
let beforeOutsidePts = 0;
let afterOutsidePts = 0;
let remainingOutsideList = [];

for (const [id, part] of Object.entries(wh.parts)) {
    const polys = parsePathToPolygons(part.gungsuhOutline);
    let pBefore = 0, pAfter = 0;
    
    const newMedians = part.medians.map(stroke => {
        stroke.forEach(pt => {
            totalPts++;
            if (signedDistance(pt[0], pt[1], polys) <= 0) {
                beforeOutsidePts++;
                pBefore++;
            }
        });
        const opt = optimizeStroke(stroke, polys);
        opt.forEach(pt => {
            if (signedDistance(pt[0], pt[1], polys) <= 0) {
                afterOutsidePts++;
                pAfter++;
            }
        });
        return opt;
    });

    if (pAfter > 0) {
        remainingOutsideList.push({ id, after: pAfter, before: pBefore, total: part.medians.reduce((a,b)=>a+b.length,0) });
    }
}

console.log('=== 보강 스냅 적용 후 결과 ===');
console.log(`총 제어점 수: ${totalPts}개`);
console.log(`최적화 전 외곽선 벗어남: ${beforeOutsidePts}개 (${(beforeOutsidePts/totalPts*100).toFixed(1)}%)`);
console.log(`최적화 후 외곽선 벗어남: ${afterOutsidePts}개 (${(afterOutsidePts/totalPts*100).toFixed(1)}%)`);
console.log(`남은 벗어남 부품: ${remainingOutsideList.length}개 / 153개`);
if (remainingOutsideList.length > 0) {
    console.table(remainingOutsideList);
}
