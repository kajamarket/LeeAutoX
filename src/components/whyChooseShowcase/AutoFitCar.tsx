import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface AutoFitCarProps {
  url: string;
  onReady?: () => void;
}

const OBSIDIAN_BLACK = new THREE.Color('#14161c');
const PRIMARY_PAINT_RE = /paint|body|carpaint|exterior/i;
const SECONDARY_TRIM_RE = /d_car_paint|trim_paint|cladding/i;
const GLASS_RE = /glass|window|windshield/i;
const LENS_RE = /light_glass|red_glass|headlight|taillight|lens/i;

const _box = new THREE.Box3();
const _size = new THREE.Vector3();
const _center = new THREE.Vector3();

function applyAnisotropy(mat: THREE.Material, maxAnisotropy: number) {
  const std = mat as THREE.MeshStandardMaterial;
  const maps = [
    std.map,
    std.normalMap,
    std.roughnessMap,
    std.metalnessMap,
    std.emissiveMap,
    std.aoMap,
  ];
  for (const tex of maps) {
    if (tex && tex.anisotropy !== maxAnisotropy) {
      tex.anisotropy = maxAnisotropy;
      tex.needsUpdate = true;
    }
  }
}

export default function AutoFitCar({ url, onReady }: AutoFitCarProps) {
  const { scene: gltfScene } = useGLTF(url);
  const { gl, scene: rootScene, camera } = useThree();

  const { fittedScene, clonedMaterials } = useMemo(() => {
    const maxAnisotropy = Math.min(16, Math.max(1, gl.capabilities.getMaxAnisotropy()));
    const cloned = gltfScene.clone(true);
    const createdMats: THREE.Material[] = [];

    // First pass: detect if dedicated primary paint material exists (so dark trim stays distinct)
    let hasDedicatedPrimaryPaint = false;
    cloned.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        const name = m?.name || '';
        if (PRIMARY_PAINT_RE.test(name) && !SECONDARY_TRIM_RE.test(name)) {
          hasDedicatedPrimaryPaint = true;
          break;
        }
      }
    });

    const materialCache = new Map<THREE.Material, THREE.Material>();

    const upgradeMaterial = (srcMat: THREE.Material): THREE.Material => {
      const cached = materialCache.get(srcMat);
      if (cached) return cached;

      const matName = srcMat.name || '';
      const isSecondaryTrim = SECONDARY_TRIM_RE.test(matName);
      const isPrimaryPaint =
        PRIMARY_PAINT_RE.test(matName) && (!hasDedicatedPrimaryPaint || !isSecondaryTrim);
      const isGlass = GLASS_RE.test(matName);

      let targetMat: THREE.Material;

      if (isPrimaryPaint) {
        const base = srcMat as THREE.MeshStandardMaterial;
        targetMat = new THREE.MeshPhysicalMaterial({
          name: matName,
          color: OBSIDIAN_BLACK.clone(),
          metalness: 0.62,
          roughness: 0.2,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          envMapIntensity: 1.35,
          normalMap: base.normalMap ?? null,
          aoMap: base.aoMap ?? null,
          aoMapIntensity: base.aoMapIntensity ?? 1,
        });
      } else {
        targetMat = srcMat.clone();
      }

      if (isGlass) {
        const glassMat = targetMat as THREE.MeshPhysicalMaterial;
        const isLens = LENS_RE.test(matName);
        if ('transmission' in glassMat) {
          glassMat.transmission = 0;
        }
        glassMat.transparent = true;
        glassMat.opacity = isLens ? 0.68 : 0.38;
        glassMat.roughness = 0.05;
        glassMat.envMapIntensity = 1.4;
        glassMat.depthWrite = false;
        glassMat.needsUpdate = true;
      } else {
        const std = targetMat as THREE.MeshStandardMaterial;
        if ('transmission' in std && (std as THREE.MeshPhysicalMaterial).transmission > 0) {
          (std as THREE.MeshPhysicalMaterial).transmission = 0;
          std.transparent = true;
          std.opacity = Math.min(std.opacity || 1, 0.5);
        }
        if (std.emissive && std.emissiveIntensity > 1.8) {
          std.emissiveIntensity = 1.55;
          std.toneMapped = false;
        }
        if (std.emissive && (std.emissive.r > 0.1 || std.emissive.g > 0.1 || std.emissive.b > 0.1)) {
          std.toneMapped = false;
        }
        if (typeof std.envMapIntensity === 'number' && !isPrimaryPaint) {
          std.envMapIntensity = Math.max(std.envMapIntensity, 1.0);
        }
      }

      applyAnisotropy(targetMat, maxAnisotropy);
      materialCache.set(srcMat, targetMat);
      createdMats.push(targetMat);
      return targetMat;
    };

    cloned.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (!mesh.material) return;
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map(upgradeMaterial);
      } else {
        mesh.material = upgradeMaterial(mesh.material);
      }
    });

    // Normalize orientation & dimensions: longest axis = 4.6 along +Z, centered X/Z, box.min.y = 0
    cloned.updateMatrixWorld(true);
    _box.setFromObject(cloned);
    _box.getSize(_size);

    if (_size.x > _size.z) {
      cloned.rotation.y += Math.PI / 2;
      cloned.updateMatrixWorld(true);
      _box.setFromObject(cloned);
      _box.getSize(_size);
    }

    const longestAxis = Math.max(_size.x, _size.y, _size.z, 0.001);
    const scaleFactor = 4.6 / longestAxis;
    cloned.scale.multiplyScalar(scaleFactor);
    cloned.updateMatrixWorld(true);

    _box.setFromObject(cloned);
    _box.getCenter(_center);

    cloned.position.x -= _center.x;
    cloned.position.z -= _center.z;
    cloned.position.y -= _box.min.y;
    cloned.updateMatrixWorld(true);

    return { fittedScene: cloned, clonedMaterials: createdMats };
  }, [gl, gltfScene]);

  useEffect(() => {
    // Pre-warm shader programs once to avoid frame stutter when camera choreography begins
    try {
      gl.compile(rootScene, camera);
    } catch {
      // Ignore compile warm-up errors on constrained contexts
    }
    onReady?.();

    return () => {
      for (const mat of clonedMaterials) {
        mat.dispose();
      }
    };
  }, [camera, clonedMaterials, gl, onReady, rootScene]);

  return <primitive object={fittedScene} />;
}
