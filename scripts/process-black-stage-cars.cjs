const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const w = 1670, h = 941;
const baseOrig = path.join(__dirname, '../public/media/backup-originals/exterior-polished.png');

console.log('Extracting RGBA from base image...');
execSync(`convert "${baseOrig}" -crop 1670x941+0+0 -depth 8 /tmp/base.rgba`);
const baseBuf = fs.readFileSync('/tmp/base.rgba');

// 2D quadratic background regression
const samples = [];
for (let y = 0; y < h; y += 10) {
  for (let x = 0; x < w; x += 10) {
    if (y < 180 || y > 890 || x < 100 || x > 1580) {
      const idx = (y * w + x) * 4;
      samples.push({ x, y, r: baseBuf[idx], g: baseBuf[idx+1], b: baseBuf[idx+2] });
    }
  }
}

function solve(samples, channel) {
  const m = 6;
  const A = Array.from({length: m}, () => new Float64Array(m));
  const b = new Float64Array(m);
  for (const s of samples) {
    const x = s.x / w, y = s.y / h;
    const feats = [1, x, y, x*x, y*y, x*y];
    const val = s[channel];
    for (let i = 0; i < m; i++) {
      b[i] += feats[i] * val;
      for (let j = 0; j < m; j++) {
        A[i][j] += feats[i] * feats[j];
      }
    }
  }
  for (let i = 0; i < m; i++) {
    let pivot = A[i][i];
    for (let k = i + 1; k < m; k++) {
      const factor = A[k][i] / pivot;
      for (let j = i; j < m; j++) A[k][j] -= factor * A[i][j];
      b[k] -= factor * b[i];
    }
  }
  const res = new Float64Array(m);
  for (let i = m - 1; i >= 0; i--) {
    let sum = b[i];
    for (let j = i + 1; j < m; j++) sum -= A[i][j] * res[j];
    res[i] = sum / A[i][i];
  }
  return res;
}

const betaR = solve(samples, 'r');
const betaG = solve(samples, 'g');
const betaB = solve(samples, 'b');

function pred(x, y) {
  const nx = x / w, ny = y / h;
  return [
    betaR[0] + betaR[1]*nx + betaR[2]*ny + betaR[3]*nx*nx + betaR[4]*ny*ny + betaR[5]*nx*ny,
    betaG[0] + betaG[1]*nx + betaG[2]*ny + betaG[3]*nx*nx + betaG[4]*ny*ny + betaG[5]*nx*ny,
    betaB[0] + betaB[1]*nx + betaB[2]*ny + betaB[3]*nx*nx + betaB[4]*ny*ny + betaB[5]*nx*ny
  ];
}

const dist = new Float32Array(w * h);
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = y * w + x;
    const idx = i * 4;
    const [pr, pg, pb] = pred(x, y);
    dist[i] = Math.hypot(baseBuf[idx] - pr, baseBuf[idx+1] - pg, baseBuf[idx+2] - pb);
  }
}

// Flood fill from boundaries
const bg = new Uint8Array(w * h);
const queue = new Int32Array(w * h);
let head = 0, tail = 0;

function addSeed(x, y) {
  const idx = y * w + x;
  if (!bg[idx]) { bg[idx] = 1; queue[tail++] = idx; }
}

for (let x = 0; x < w; x++) {
  addSeed(x, 0); addSeed(x, h - 1);
}
for (let y = 1; y < h - 1; y++) {
  addSeed(0, y); addSeed(w - 1, y);
}
addSeed(335, 390); // mirror-pillar gap

while (head < tail) {
  const curr = queue[head++];
  const cx = curr % w, cy = (curr / w) | 0;
  const nbrs = [
    cx > 0 ? curr - 1 : -1,
    cx < w - 1 ? curr + 1 : -1,
    cy > 0 ? curr - w : -1,
    cy < h - 1 ? curr + w : -1
  ];
  for (const n of nbrs) {
    if (n >= 0 && !bg[n]) {
      const nx = n % w, ny = (n / w) | 0;
      const isFloor = ny > 680 && (baseBuf[n*4+2] > 60 && baseBuf[n*4+2] > baseBuf[n*4] - 5);
      if (dist[n] < 22 || isFloor) {
        bg[n] = 1;
        queue[tail++] = n;
      }
    }
  }
}

// Build anti-aliased alpha mask: 0 (background) to 1.0 (car)
const alphaMask = new Float32Array(w * h);
for (let i = 0; i < w * h; i++) {
  alphaMask[i] = bg[i] ? 0 : 1;
}

// 1-pixel box filter blur along edge only (where 0 < alpha < 1 or adjacent to bg)
const smoothAlpha = new Float32Array(w * h);
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = y * w + x;
    if (y === 0 || y === h - 1 || x === 0 || x === w - 1) {
      smoothAlpha[i] = 0;
      continue;
    }
    // Check if neighbor is different
    const diff = (bg[i-1] !== bg[i]) || (bg[i+1] !== bg[i]) || (bg[i-w] !== bg[i]) || (bg[i+w] !== bg[i]);
    if (diff) {
      let sum = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          sum += alphaMask[(y + dy) * w + (x + dx)];
        }
      }
      smoothAlpha[i] = sum / 9.0;
    } else {
      smoothAlpha[i] = alphaMask[i];
    }
  }
}

console.log('Background mask ready. Processing 7 car image variants...');

const files = [
  'exterior-polished.png',
  'config/electric-green.png',
  'config/graphite.png',
  'config/lime-green.png',
  'config/sky-blue.png',
  'config/wheels-aero.png',
  'config/wheels-forged.png'
];

for (const relPath of files) {
  const origPath = path.join(__dirname, '../public/media/backup-originals', relPath);
  const destPath = path.join(__dirname, '../public/media', relPath);
  const tmpRgba = `/tmp/process_${path.basename(relPath)}.rgba`;
  
  execSync(`convert "${origPath}" -crop 1670x941+0+0 -depth 8 "${tmpRgba}"`);
  const rawBuf = fs.readFileSync(tmpRgba);
  const outBuf = Buffer.alloc(w * h * 4);
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const idx = i * 4;
      const a = smoothAlpha[i];
      
      if (a <= 0.01) {
        outBuf[idx] = 0;
        outBuf[idx+1] = 0;
        outBuf[idx+2] = 0;
        outBuf[idx+3] = 0;
      } else {
        const r = rawBuf[idx], g = rawBuf[idx+1], b = rawBuf[idx+2];
        if (y > 680 && b > r + 8 && (r < 80 && g < 100)) {
          // Soft ground contact shadow
          const dark = Math.min(r, g);
          outBuf[idx] = Math.round(dark * 0.3 * a);
          outBuf[idx+1] = Math.round(dark * 0.3 * a);
          outBuf[idx+2] = Math.round(dark * 0.3 * a);
          outBuf[idx+3] = Math.round(255 * a);
        } else {
          outBuf[idx] = r;
          outBuf[idx+1] = g;
          outBuf[idx+2] = b;
          outBuf[idx+3] = Math.round(255 * a);
        }
      }
    }
  }
  
  const tmpOutRgba = `/tmp/out_${path.basename(relPath)}.rgba`;
  fs.writeFileSync(tmpOutRgba, outBuf);
  // Write PNG with alpha channel over black stage
  execSync(`convert -size 1670x941 -depth 8 "${tmpOutRgba}" "${destPath}"`);
  console.log(`Saved: ${destPath}`);
}

console.log('All 7 images processed successfully.');
