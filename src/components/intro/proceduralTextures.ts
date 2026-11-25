import * as THREE from 'three';

function createSeededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export interface DaylightAsphaltMaps {
  albedoMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  dispose: () => void;
}

export function createDaylightAsphaltMaps(maxAniso = 8): DaylightAsphaltMaps {
  const size = 512;
  const rand = createSeededRandom(4207);

  // 1. Albedo + 2. Roughness + 3. Bump generated in single fast ImageData pass
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const aCtx = albedoCanvas.getContext('2d')!;
  const aImg = aCtx.createImageData(size, size);
  const aData = aImg.data;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;
  const rImg = rCtx.createImageData(size, size);
  const rData = rImg.data;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  const bImg = bCtx.createImageData(size, size);
  const bData = bImg.data;

  const track1 = size * 0.37;
  const track2 = size * 0.63;
  const bandWidth = size * 0.16;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const grain = rand();
      let base = grain < 0.72 ? 52 + Math.floor(rand() * 24) : 44 + Math.floor(rand() * 38);

      // Longitudinal rubber wear tracks
      const d1 = Math.max(0, 1 - Math.abs(x - track1) / bandWidth);
      const d2 = Math.max(0, 1 - Math.abs(x - track2) / bandWidth);
      const wear = Math.max(d1, d2);
      base = Math.max(20, Math.round(base * (1 - wear * 0.28)));

      aData[idx] = base;
      aData[idx + 1] = base + 2;
      aData[idx + 2] = base + 6;
      aData[idx + 3] = 255;

      const rough = Math.round((192 + Math.floor(rand() * 48)) * (1 - wear * 0.22));
      rData[idx] = rough;
      rData[idx + 1] = rough;
      rData[idx + 2] = rough;
      rData[idx + 3] = 255;

      const bump = 76 + Math.floor(rand() * 130);
      bData[idx] = bump;
      bData[idx + 1] = bump;
      bData[idx + 2] = bump;
      bData[idx + 3] = 255;
    }
  }

  aCtx.putImageData(aImg, 0, 0);
  rCtx.putImageData(rImg, 0, 0);
  bCtx.putImageData(bImg, 0, 0);

  // Subtle tar crack veins
  aCtx.strokeStyle = 'rgba(24, 26, 30, 0.45)';
  aCtx.lineWidth = 1.2;
  for (let c = 0; c < 10; c++) {
    let cx = rand() * size;
    let cy = rand() * size;
    aCtx.beginPath();
    aCtx.moveTo(cx, cy);
    for (let s = 0; s < 8; s++) {
      cx += (rand() - 0.5) * 20;
      cy += rand() * 28;
      aCtx.lineTo(cx, cy);
    }
    aCtx.stroke();
  }

  const setup = (canvas: HTMLCanvasElement, isColor: boolean) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 20);
    tex.anisotropy = maxAniso;
    tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.needsUpdate = true;
    return tex;
  };

  const albedoMap = setup(albedoCanvas, true);
  const roughnessMap = setup(roughCanvas, false);
  const bumpMap = setup(bumpCanvas, false);

  return {
    albedoMap,
    roughnessMap,
    bumpMap,
    dispose: () => {
      albedoMap.dispose();
      roughnessMap.dispose();
      bumpMap.dispose();
    },
  };
}

export function createCurbTexture(maxAniso = 8): THREE.CanvasTexture {
  const size = 128;
  const rand = createSeededRandom(1183);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  const data = img.data;

  for (let i = 0; i < size * size; i++) {
    const idx = i * 4;
    const v = 212 + Math.floor(rand() * 34);
    data[idx] = v;
    data[idx + 1] = v - 2;
    data[idx + 2] = v - 6;
    data[idx + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = 'rgba(30, 32, 36, 0.14)';
    ctx.fillRect(rand() * size * 0.7, rand() * size, 16 + rand() * 20, 2 + rand() * 3);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAniso;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createGravelTexture(maxAniso = 8): THREE.CanvasTexture {
  const size = 128;
  const rand = createSeededRandom(7331);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  const data = img.data;

  for (let i = 0; i < size * size; i++) {
    const idx = i * 4;
    const tone = 154 + Math.floor(rand() * 68);
    data[idx] = tone;
    data[idx + 1] = Math.floor(tone * 0.92);
    data[idx + 2] = Math.floor(tone * 0.78);
    data[idx + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 60);
  tex.anisotropy = maxAniso;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createGrassTexture(maxAniso = 8): THREE.CanvasTexture {
  const size = 128;
  const rand = createSeededRandom(9901);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  const data = img.data;

  for (let i = 0; i < size * size; i++) {
    const idx = i * 4;
    const g = 88 + Math.floor(rand() * 40);
    data[idx] = Math.floor(g * 0.68);
    data[idx + 1] = g;
    data[idx + 2] = Math.floor(g * 0.5);
    data[idx + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(42, 42);
  tex.anisotropy = maxAniso;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createPaintFlakeNormalMap(): THREE.DataTexture {
  const size = 128;
  const rand = createSeededRandom(305);
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const idx = i * 4;
    data[idx] = 124 + Math.floor(rand() * 8);
    data[idx + 1] = 124 + Math.floor(rand() * 8);
    data[idx + 2] = 255;
    data[idx + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(24, 24);
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createCarbonFiberMaps(): {
  albedoMap: THREE.CanvasTexture;
  normalMap: THREE.DataTexture;
  dispose: () => void;
} {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#181a1f';
  ctx.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y += 4) {
    for (let x = 0; x < size; x += 4) {
      const diag = ((x + y) / 4) % 2 === 0;
      ctx.fillStyle = diag ? '#252930' : '#121418';
      ctx.fillRect(x, y, 4, 4);
    }
  }
  const albedoMap = new THREE.CanvasTexture(canvas);
  albedoMap.wrapS = THREE.RepeatWrapping;
  albedoMap.wrapT = THREE.RepeatWrapping;
  albedoMap.repeat.set(14, 14);
  albedoMap.colorSpace = THREE.SRGBColorSpace;

  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const diag = (Math.floor(x / 4) + Math.floor(y / 4)) % 2 === 0;
      data[idx] = diag ? 140 : 116;
      data[idx + 1] = diag ? 136 : 120;
      data[idx + 2] = 255;
      data[idx + 3] = 255;
    }
  }
  const normalMap = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(14, 14);
  normalMap.colorSpace = THREE.NoColorSpace;
  normalMap.needsUpdate = true;

  return {
    albedoMap,
    normalMap,
    dispose: () => {
      albedoMap.dispose();
      normalMap.dispose();
    },
  };
}

export function createTireTreadNormalMap(): THREE.DataTexture {
  const w = 128;
  const h = 128;
  const data = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const u = x / w;
      const groove = Math.abs(u - 0.28) < 0.045 || Math.abs(u - 0.5) < 0.04 || Math.abs(u - 0.72) < 0.045;
      const siping = (y % 12) < 2 && (u < 0.25 || u > 0.75);
      data[idx] = 128;
      data[idx + 1] = groove || siping ? 88 : 128;
      data[idx + 2] = groove || siping ? 200 : 255;
      data[idx + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 6);
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}
