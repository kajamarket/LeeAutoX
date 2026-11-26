import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface ProceduralCarProps {
  onReady?: () => void;
}

const OBSIDIAN_BLACK = '#14161c';

function createSuvBodyGeometry(): THREE.ExtrudeGeometry {
  // Side profile in 2D (X = along vehicle Z from rear -2.3 to front +2.3, Y = elevation above ground)
  const profile = new THREE.Shape();
  profile.moveTo(-2.22, 0.34);
  profile.lineTo(2.14, 0.34);
  profile.quadraticCurveTo(2.28, 0.36, 2.3, 0.62);
  profile.lineTo(2.26, 0.94);
  profile.quadraticCurveTo(2.18, 1.08, 1.88, 1.12);
  profile.lineTo(1.12, 1.18);
  profile.quadraticCurveTo(0.84, 1.24, 0.42, 1.66);
  profile.lineTo(-1.58, 1.68);
  profile.quadraticCurveTo(-1.98, 1.66, -2.14, 1.22);
  profile.lineTo(-2.24, 0.95);
  profile.quadraticCurveTo(-2.28, 0.56, -2.22, 0.34);

  const geo = new THREE.ExtrudeGeometry(profile, {
    depth: 1.76,
    bevelEnabled: true,
    bevelThickness: 0.11,
    bevelSize: 0.08,
    bevelSegments: 4,
    curveSegments: 20,
  });

  // Center extrusion along local X (width), map shape X -> +Z (front +2.3), shape Y -> +Y
  geo.translate(0, 0, -0.88);
  geo.rotateY(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

function createGreenhouseGeometry(): THREE.ExtrudeGeometry {
  const glassProfile = new THREE.Shape();
  glassProfile.moveTo(-1.82, 1.16);
  glassProfile.lineTo(0.95, 1.16);
  glassProfile.lineTo(0.38, 1.61);
  glassProfile.lineTo(-1.48, 1.62);
  glassProfile.closePath();

  const geo = new THREE.ExtrudeGeometry(glassProfile, {
    depth: 1.54,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 3,
  });
  geo.translate(0, 0, -0.77);
  geo.rotateY(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

export default function ProceduralCar({ onReady }: ProceduralCarProps) {
  const resources = useMemo(() => {
    const bodyGeo = createSuvBodyGeometry();
    const glassGeo = createGreenhouseGeometry();
    const tireGeo = new THREE.CylinderGeometry(0.41, 0.41, 0.28, 32);
    tireGeo.rotateZ(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.295, 20);
    rimGeo.rotateZ(Math.PI / 2);
    const hubGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.31, 16);
    hubGeo.rotateZ(Math.PI / 2);
    const archGeo = new THREE.TorusGeometry(0.45, 0.055, 10, 28, Math.PI);
    archGeo.rotateY(Math.PI / 2);
    const grilleGeo = new THREE.BoxGeometry(1.16, 0.56, 0.1);
    const bumperSkidGeo = new THREE.BoxGeometry(1.42, 0.14, 0.16);
    const headlightGeo = new THREE.BoxGeometry(0.34, 0.085, 0.08);
    const taillightGeo = new THREE.BoxGeometry(1.64, 0.08, 0.08);
    const roofRailGeo = new THREE.BoxGeometry(0.055, 0.045, 1.84);
    const mirrorGeo = new THREE.BoxGeometry(0.2, 0.11, 0.16);

    const paintMat = new THREE.MeshPhysicalMaterial({
      color: OBSIDIAN_BLACK,
      metalness: 0.62,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.35,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#0e131b',
      metalness: 0.05,
      roughness: 0.05,
      transmission: 0,
      transparent: true,
      opacity: 0.42,
      envMapIntensity: 1.4,
      depthWrite: false,
    });

    const claddingMat = new THREE.MeshStandardMaterial({
      color: '#181b22',
      metalness: 0.25,
      roughness: 0.68,
      envMapIntensity: 0.85,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: '#c8d0dc',
      metalness: 0.92,
      roughness: 0.16,
      envMapIntensity: 1.3,
    });

    const rubberMat = new THREE.MeshStandardMaterial({
      color: '#15171c',
      metalness: 0.05,
      roughness: 0.86,
      envMapIntensity: 0.45,
    });

    const headEmissiveMat = new THREE.MeshStandardMaterial({
      color: '#f4f8ff',
      emissive: '#dbeafe',
      emissiveIntensity: 1.4,
      toneMapped: false,
    });

    const tailEmissiveMat = new THREE.MeshStandardMaterial({
      color: '#ef4444',
      emissive: '#dc2626',
      emissiveIntensity: 1.35,
      toneMapped: false,
    });

    return {
      geometries: [
        bodyGeo,
        glassGeo,
        tireGeo,
        rimGeo,
        hubGeo,
        archGeo,
        grilleGeo,
        bumperSkidGeo,
        headlightGeo,
        taillightGeo,
        roofRailGeo,
        mirrorGeo,
      ],
      materials: [
        paintMat,
        glassMat,
        claddingMat,
        chromeMat,
        rubberMat,
        headEmissiveMat,
        tailEmissiveMat,
      ],
      bodyGeo,
      glassGeo,
      tireGeo,
      rimGeo,
      hubGeo,
      archGeo,
      grilleGeo,
      bumperSkidGeo,
      headlightGeo,
      taillightGeo,
      roofRailGeo,
      mirrorGeo,
      paintMat,
      glassMat,
      claddingMat,
      chromeMat,
      rubberMat,
      headEmissiveMat,
      tailEmissiveMat,
    };
  }, []);

  useEffect(() => {
    onReady?.();
    return () => {
      resources.geometries.forEach((g) => g.dispose());
      resources.materials.forEach((m) => m.dispose());
    };
  }, [onReady, resources]);

  const wheelPositions: [number, number, number][] = [
    [-0.9, 0.41, 1.38],
    [0.9, 0.41, 1.38],
    [-0.9, 0.41, -1.38],
    [0.9, 0.41, -1.38],
  ];

  return (
    <group name="ProceduralLexusLX700hFallback">
      {/* Main Sculpted SUV Body */}
      <mesh geometry={resources.bodyGeo} material={resources.paintMat} castShadow receiveShadow />

      {/* Calibrated Cabin Greenhouse */}
      <mesh geometry={resources.glassGeo} material={resources.glassMat} renderOrder={2} />

      {/* Front Spindle Grille & Lower Fascia */}
      <mesh
        geometry={resources.grilleGeo}
        material={resources.chromeMat}
        position={[0, 0.72, 2.26]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={resources.bumperSkidGeo}
        material={resources.claddingMat}
        position={[0, 0.38, 2.23]}
        castShadow
        receiveShadow
      />

      {/* LED Headlights (Front +Z) */}
      <mesh
        geometry={resources.headlightGeo}
        material={resources.headEmissiveMat}
        position={[-0.68, 0.94, 2.23]}
      />
      <mesh
        geometry={resources.headlightGeo}
        material={resources.headEmissiveMat}
        position={[0.68, 0.94, 2.23]}
      />

      {/* Full-Width Rear LED Lightbar (-Z) */}
      <mesh
        geometry={resources.taillightGeo}
        material={resources.tailEmissiveMat}
        position={[0, 1.04, -2.23]}
      />

      {/* Roof Rails & Side Mirrors */}
      <mesh
        geometry={resources.roofRailGeo}
        material={resources.chromeMat}
        position={[-0.64, 1.72, -0.56]}
        castShadow
      />
      <mesh
        geometry={resources.roofRailGeo}
        material={resources.chromeMat}
        position={[0.64, 1.72, -0.56]}
        castShadow
      />
      <mesh
        geometry={resources.mirrorGeo}
        material={resources.paintMat}
        position={[-1.02, 1.21, 0.62]}
        castShadow
      />
      <mesh
        geometry={resources.mirrorGeo}
        material={resources.paintMat}
        position={[1.02, 1.21, 0.62]}
        castShadow
      />

      {/* 4 Grounded Wheels + Flared Wheel Arches */}
      {wheelPositions.map((pos, idx) => (
        <group key={idx}>
          <mesh
            geometry={resources.archGeo}
            material={resources.claddingMat}
            position={[pos[0] > 0 ? 0.95 : -0.95, 0.38, pos[2]]}
            castShadow
          />
          <group position={pos}>
            <mesh geometry={resources.tireGeo} material={resources.rubberMat} castShadow receiveShadow />
            <mesh geometry={resources.rimGeo} material={resources.chromeMat} castShadow />
            <mesh geometry={resources.hubGeo} material={resources.claddingMat} />
          </group>
        </group>
      ))}
    </group>
  );
}
