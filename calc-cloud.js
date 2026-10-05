const cx1 = 196, cy1 = 256, r1 = 140;
const cx2 = 366, cy2 = 306, r2 = 90;

// To find intersection:
// (x - cx1)^2 + (y - cy1)^2 = r1^2
// (x - cx2)^2 + (y - cy2)^2 = r2^2

// d = distance between centers
const dx = cx2 - cx1;
const dy = cy2 - cy1;
const d = Math.sqrt(dx*dx + dy*dy);

// a = (r1^2 - r2^2 + d^2) / (2d)
const a = (r1*r1 - r2*r2 + d*d) / (2 * d);
// h = sqrt(r1^2 - a^2)
const h = Math.sqrt(r1*r1 - a*a);

// P2 = center + a * (dx, dy) / d
const x2 = cx1 + a * dx / d;
const y2 = cy1 + a * dy / d;

// Intersections:
const rx = -h * dy / d;
const ry = h * dx / d;

const xi1 = x2 + rx;
const yi1 = y2 + ry;

const xi2 = x2 - rx;
const yi2 = y2 - ry;

// We want the higher intersection (lower y value)
const intX = yi1 < yi2 ? xi1 : xi2;
const intY = yi1 < yi2 ? yi1 : yi2;

console.log(`Intersection: ${intX}, ${intY}`);

const path = `M 366 396 H 196 A 140 140 0 1 1 ${intX.toFixed(2)} ${intY.toFixed(2)} A 90 90 0 1 1 366 396 Z`;
console.log(path);
