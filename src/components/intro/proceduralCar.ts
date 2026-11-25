import * as THREE from 'three';
import {
  createCarbonFiberMaps,
  createPaintFlakeNormalMap,
  createTireTreadNormalMap,
} from './proceduralTextures';

export type ProceduralCarVariant = 'supercar' | 'sedan';

export interface CarLaunchController {
  root: THREE.Group;
  update: (dt: number, elapsed: number, isGo: boolean, reducedMotion: boolean) => void;
  setPaintColor: (hex: string | null) => void;
  dispose: () => void;
}

export function createProceduralCar(
  variant: ProceduralCarVariant = 'supercar',
  paintHex = '#eef2f6'
): CarLaunchController {
  const isSedan = variant === 'sedan';
  const root = new THREE.Group();
  root.name = `procedural-${variant}`;

  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  const flakeMap = createPaintFlakeNormalMap();
  const carbonMaps = createCarbonFiberMaps();
  const tireNormal = createTireTreadNormalMap();

  const disposables: Array<{ dispose: () => void }> = [
    flakeMap,
    carbonMaps,
    tireNormal,
  ];

  const paintMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(paintHex),
    metalness: 0.58,
    roughness: 0.17,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    normalMap: flakeMap,
    normalScale: new THREE.Vector2(0.035, 0.035),
    envMapIntensity: 1.15,
  });

  const carbonMat = new THREE.MeshStandardMaterial({
    map: carbonMaps.albedoMap,
    normalMap: carbonMaps.normalMap,
    roughness: 0.34,
    metalness: 0.25,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: '#101822',
    metalness: 0.15,
    roughness: 0.08,
    transparent: true,
    opacity: 0.42,
    clearcoat: 1,
    envMapIntensity: 1.25,
  });

  const darkTrimMat = new THREE.MeshStandardMaterial({
    color: '#14171d',
    roughness: 0.65,
    metalness: 0.2,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: '#e5e9ef',
    metalness: 0.94,
    roughness: 0.14,
  });

  const headlightMat = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    emissive: new THREE.Color('#eef6ff'),
    emissiveIntensity: 1.4,
    roughness: 0.15,
    toneMapped: false,
  });

  const taillightMat = new THREE.MeshStandardMaterial({
    color: '#99111e',
    emissive: new THREE.Color('#ef1a2d'),
    emissiveIntensity: 1.5,
    roughness: 0.2,
    toneMapped: false,
  });

  const exhaustGlowMat = new THREE.MeshStandardMaterial({
    color: '#3b1c0a',
    emissive: new THREE.Color('#ff6a1a'),
    emissiveIntensity: 0.45,
    roughness: 0.4,
    toneMapped: false,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: '#17191c',
    roughness: 0.78,
    metalness: 0.05,
    normalMap: tireNormal,
    normalScale: new THREE.Vector2(0.45, 0.45),
  });

  const alloyMat = new THREE.MeshStandardMaterial({
    color: '#cfd5dd',
    metalness: 0.88,
    roughness: 0.2,
  });

  const caliperMat = new THREE.MeshStandardMaterial({
    color: isSedan ? '#d4a11c' : '#dc2626',
    metalness: 0.45,
    roughness: 0.32,
  });

  const rotorMat = new THREE.MeshStandardMaterial({
    color: '#717882',
    metalness: 0.82,
    roughness: 0.34,
  });

  disposables.push(
    paintMat,
    carbonMat,
    glassMat,
    darkTrimMat,
    chromeMat,
    headlightMat,
    taillightMat,
    exhaustGlowMat,
    tireMat,
    alloyMat,
    caliperMat,
    rotorMat
  );

  // Main extruded body silhouette (side profile extruded along X, rotated so nose faces +Z)
  const length = 4.45;
  const bodyWidth = isSedan ? 1.84 : 1.94;
  const roofHeight = isSedan ? 1.32 : 1.16;

  const profile = new THREE.Shape();
  profile.moveTo(-2.12, 0.28);
  profile.lineTo(-2.18, 0.68);
  profile.quadraticCurveTo(-2.1, 0.82, -1.62, 0.86);
  profile.lineTo(-1.05, roofHeight);
  profile.quadraticCurveTo(-0.35, roofHeight + 0.05, 0.32, roofHeight);
  profile.lineTo(0.95, 0.84);
  profile.quadraticCurveTo(1.85, 0.76, 2.2, 0.48);
  profile.lineTo(2.22, 0.24);
  profile.lineTo(-2.12, 0.24);

  const bodyGeo = new THREE.ExtrudeGeometry(profile, {
    depth: bodyWidth - 0.14,
    bevelEnabled: true,
    bevelThickness: 0.09,
    bevelSize: 0.07,
    bevelSegments: 4,
    curveSegments: 16,
  });
  bodyGeo.center();
  // Rotate so profile X aligns with +Z (front) and extrusion depth aligns with X
  bodyGeo.rotateY(-Math.PI / 2);
  disposables.push(bodyGeo);

  const mainShell = new THREE.Mesh(bodyGeo, paintMat);
  mainShell.position.y = isSedan ? 0.74 : 0.68;
  mainShell.castShadow = true;
  mainShell.receiveShadow = true;
  bodyGroup.add(mainShell);

  // Sculpted fender flanks
  const flankGeo = new THREE.BoxGeometry(bodyWidth + 0.06, 0.38, length * 0.78);
  disposables.push(flankGeo);
  const flanks = new THREE.Mesh(flankGeo, paintMat);
  flanks.position.set(0, 0.48, 0.02);
  flanks.castShadow = true;
  flanks.receiveShadow = true;
  bodyGroup.add(flanks);

  // Hood power bulge
  const hoodGeo = new THREE.BoxGeometry(bodyWidth * 0.52, 0.08, 1.25);
  disposables.push(hoodGeo);
  const hoodBulge = new THREE.Mesh(hoodGeo, paintMat);
  hoodBulge.position.set(0, 0.77, 1.18);
  hoodBulge.rotation.x = 0.09;
  hoodBulge.castShadow = true;
  bodyGroup.add(hoodBulge);

  // Tinted glass canopy + carbon roof insert
  const canopyGeo = new THREE.BoxGeometry(bodyWidth * 0.76, 0.36, 1.85);
  disposables.push(canopyGeo);
  const canopy = new THREE.Mesh(canopyGeo, glassMat);
  canopy.position.set(0, isSedan ? 1.12 : 1.0, -0.18);
  bodyGroup.add(canopy);

  const roofGeo = new THREE.BoxGeometry(bodyWidth * 0.68, 0.04, 1.05);
  disposables.push(roofGeo);
  const roof = new THREE.Mesh(roofGeo, carbonMat);
  roof.position.set(0, isSedan ? 1.31 : 1.19, -0.22);
  roof.castShadow = true;
  bodyGroup.add(roof);

  // Interior dark tub + sport bucket seats
  const tubGeo = new THREE.BoxGeometry(bodyWidth * 0.66, 0.25, 1.45);
  const seatGeo = new THREE.BoxGeometry(0.42, 0.48, 0.38);
  disposables.push(tubGeo, seatGeo);
  const tub = new THREE.Mesh(tubGeo, darkTrimMat);
  tub.position.set(0, 0.76, -0.15);
  bodyGroup.add(tub);

  for (const sx of [-0.34, 0.34]) {
    const seat = new THREE.Mesh(seatGeo, carbonMat);
    seat.position.set(sx, 0.88, -0.22);
    seat.rotation.x = -0.18;
    bodyGroup.add(seat);
  }

  // Front carbon splitter, grille & DRL headlights (+Z)
  const splitterGeo = new THREE.BoxGeometry(bodyWidth + 0.1, 0.05, 0.42);
  const grilleGeo = new THREE.BoxGeometry(bodyWidth * 0.62, 0.22, 0.08);
  const drlGeo = new THREE.BoxGeometry(0.42, 0.06, 0.08);
  disposables.push(splitterGeo, grilleGeo, drlGeo);

  const splitter = new THREE.Mesh(splitterGeo, carbonMat);
  splitter.position.set(0, 0.22, 2.08);
  splitter.castShadow = true;
  bodyGroup.add(splitter);

  const grille = new THREE.Mesh(grilleGeo, darkTrimMat);
  grille.position.set(0, 0.41, 2.21);
  bodyGroup.add(grille);

  for (const hx of [-0.66, 0.66]) {
    const drl = new THREE.Mesh(drlGeo, headlightMat);
    drl.position.set(hx, 0.56, 2.18);
    drl.rotation.y = hx < 0 ? 0.16 : -0.16;
    bodyGroup.add(drl);
  }

  // Side skirts & wing mirrors
  const skirtGeo = new THREE.BoxGeometry(0.12, 0.08, 2.25);
  const mirrorArmGeo = new THREE.BoxGeometry(0.16, 0.05, 0.12);
  disposables.push(skirtGeo, mirrorArmGeo);
  for (const side of [-1, 1]) {
    const skirt = new THREE.Mesh(skirtGeo, carbonMat);
    skirt.position.set(side * (bodyWidth * 0.5 + 0.02), 0.24, 0);
    bodyGroup.add(skirt);

    const mirror = new THREE.Mesh(mirrorArmGeo, isSedan ? chromeMat : carbonMat);
    mirror.position.set(side * (bodyWidth * 0.52), 0.88, 0.55);
    bodyGroup.add(mirror);
  }

  // Rear diffuser, vertical fins, quad exhausts, taillight bar & rear wing (-Z)
  const diffuserGeo = new THREE.BoxGeometry(bodyWidth * 0.86, 0.2, 0.26);
  const finGeo = new THREE.BoxGeometry(0.03, 0.18, 0.28);
  const exhaustGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.14, 16);
  exhaustGeo.rotateX(Math.PI / 2);
  const tailGeo = new THREE.BoxGeometry(bodyWidth * 0.82, 0.065, 0.06);
  const wingGeo = new THREE.BoxGeometry(bodyWidth * 0.88, 0.045, 0.28);
  const pylonGeo = new THREE.BoxGeometry(0.04, 0.2, 0.18);
  disposables.push(diffuserGeo, finGeo, exhaustGeo, tailGeo, wingGeo, pylonGeo);

  const diffuser = new THREE.Mesh(diffuserGeo, carbonMat);
  diffuser.position.set(0, 0.28, -2.14);
  bodyGroup.add(diffuser);

  for (const fx of [-0.45, -0.15, 0.15, 0.45]) {
    const fin = new THREE.Mesh(finGeo, carbonMat);
    fin.position.set(fx, 0.26, -2.18);
    bodyGroup.add(fin);
  }

  for (const ex of [-0.66, -0.5, 0.5, 0.66]) {
    const pipe = new THREE.Mesh(exhaustGeo, chromeMat);
    pipe.position.set(ex, 0.29, -2.22);
    bodyGroup.add(pipe);

    const inner = new THREE.Mesh(exhaustGeo, exhaustGlowMat);
    inner.scale.set(0.75, 0.75, 0.6);
    inner.position.set(ex, 0.29, -2.23);
    bodyGroup.add(inner);
  }

  const taillight = new THREE.Mesh(tailGeo, taillightMat);
  taillight.position.set(0, 0.74, -2.2);
  bodyGroup.add(taillight);

  const wing = new THREE.Mesh(wingGeo, carbonMat);
  wing.position.set(0, isSedan ? 0.96 : 1.07, -2.02);
  wing.castShadow = true;
  bodyGroup.add(wing);

  if (!isSedan) {
    for (const px of [-0.55, 0.55]) {
      const pylon = new THREE.Mesh(pylonGeo, carbonMat);
      pylon.position.set(px, 0.95, -2.0);
      bodyGroup.add(pylon);
    }
  }

  // 4 Detailed Wheel Assemblies resting at y = 0
  const wheelRadius = 0.34;
  const wheelWidth = 0.26;
  const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 32);
  tireGeo.rotateZ(Math.PI / 2);
  const rimGeo = new THREE.CylinderGeometry(0.23, 0.23, wheelWidth + 0.015, 24);
  rimGeo.rotateZ(Math.PI / 2);
  const rotorGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24);
  rotorGeo.rotateZ(Math.PI / 2);
  const spokeGeo = new THREE.BoxGeometry(wheelWidth + 0.025, 0.42, 0.035);
  const caliperGeo = new THREE.BoxGeometry(0.08, 0.15, 0.09);
  disposables.push(tireGeo, rimGeo, rotorGeo, spokeGeo, caliperGeo);

  const wheelPivots: THREE.Group[] = [];
  const wheelPositions: Array<[number, number, number]> = [
    [-bodyWidth * 0.5 + 0.04, wheelRadius, 1.36],
    [bodyWidth * 0.5 - 0.04, wheelRadius, 1.36],
    [-bodyWidth * 0.5 + 0.04, wheelRadius, -1.36],
    [bodyWidth * 0.5 - 0.04, wheelRadius, -1.36],
  ];

  for (const [wx, wy, wz] of wheelPositions) {
    const hubGroup = new THREE.Group();
    hubGroup.position.set(wx, wy, wz);

    const spinGroup = new THREE.Group();
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.castShadow = true;
    spinGroup.add(tire);

    const rim = new THREE.Mesh(rimGeo, alloyMat);
    spinGroup.add(rim);

    const rotor = new THREE.Mesh(rotorGeo, rotorMat);
    spinGroup.add(rotor);

    for (let s = 0; s < 5; s++) {
      const spoke = new THREE.Mesh(spokeGeo, alloyMat);
      spoke.rotation.x = (s * Math.PI) / 5;
      spinGroup.add(spoke);
    }

    hubGroup.add(spinGroup);

    const caliper = new THREE.Mesh(caliperGeo, caliperMat);
    caliper.position.set(wx < 0 ? -0.05 : 0.05, 0.04, wz > 0 ? -0.13 : 0.13);
    hubGroup.add(caliper);

    root.add(hubGroup);
    wheelPivots.push(spinGroup);
  }

  let launchSurge = 0;
  let launchSquat = 0;

  return {
    root,
    setPaintColor: (hex: string | null) => {
      paintMat.color.set(hex || paintHex);
    },
    update: (dt: number, elapsed: number, isGo: boolean, reducedMotion: boolean) => {
      const targetSurge = isGo && !reducedMotion ? 0.92 : 0;
      const targetSquat = isGo && !reducedMotion ? -0.026 : 0;
      launchSurge = THREE.MathUtils.damp(launchSurge, targetSurge, 4.5, dt);
      launchSquat = THREE.MathUtils.damp(launchSquat, targetSquat, 6.2, dt);

      root.position.z = launchSurge;
      bodyGroup.rotation.x = launchSquat;

      if (!reducedMotion) {
        const rumble = isGo ? 0.0045 : 0.0012;
        bodyGroup.position.y = Math.sin(elapsed * (isGo ? 68 : 34)) * rumble;
      } else {
        bodyGroup.position.y = 0;
      }

      const spinRate = isGo && !reducedMotion ? 38 : 0;
      if (spinRate > 0) {
        for (const w of wheelPivots) {
          w.rotation.x += spinRate * dt;
        }
      }

      headlightMat.emissiveIntensity = isGo ? 2.1 : 1.4;
      taillightMat.emissiveIntensity = isGo ? 2.1 : 1.5;
      exhaustGlowMat.emissiveIntensity = isGo ? 2.2 : 0.45;
    },
    dispose: () => {
      for (const item of disposables) {
        item.dispose();
      }
    },
  };
}

