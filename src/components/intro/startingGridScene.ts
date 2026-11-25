import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

import {
  createCurbTexture,
  createDaylightAsphaltMaps,
  createGrassTexture,
  createGravelTexture,
  createPaintFlakeNormalMap,
} from './proceduralTextures';
import { createProceduralCar, type CarLaunchController } from './proceduralCar';
import { startingGridAudio } from './audio';
import type { PreloadedIntroAssets } from './Phase1Preloader';

export type CountdownStep = '3' | '2' | '1' | 'GO' | null;

export interface StartingGridCallbacks {
  onCountdownChange: (step: CountdownStep) => void;
  onLaunchComplete: () => void;
  onContextLost: () => void;
  onFatalError: () => void;
}

interface ViewportFraming {
  distScale: number;
  baseFov: number;
  lookY: number;
}

function computeViewportFraming(width: number, height: number): ViewportFraming {
  const aspect = width / Math.max(1, height);
  if (aspect >= 1.25) {
    return { distScale: 1, baseFov: 50, lookY: 0.72 };
  }
  const t = THREE.MathUtils.clamp((1.25 - aspect) / 0.72, 0, 1);
  return {
    distScale: THREE.MathUtils.lerp(1.0, 1.34, t),
    baseFov: THREE.MathUtils.lerp(50, 63, t),
    lookY: THREE.MathUtils.lerp(0.72, 0.56, t),
  };
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.08,
    size / 2,
    size / 2,
    size * 0.48
  );
  grad.addColorStop(0, 'rgba(8, 10, 14, 0.78)');
  grad.addColorStop(0.55, 'rgba(8, 10, 14, 0.42)');
  grad.addColorStop(1, 'rgba(8, 10, 14, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createCatchFenceTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(180, 190, 200, 0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size, size);
  ctx.moveTo(size, 0);
  ctx.lineTo(0, size);
  ctx.stroke();
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(96, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSponsorBannerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 192;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0e131b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#2B59FF';
  ctx.fillRect(0, 0, 28, canvas.height);
  ctx.fillRect(canvas.width - 28, 0, 28, canvas.height);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '900 84px Orbitron, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LEEAUTOX', canvas.width / 2, canvas.height / 2 + 4);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function normalizeAndUpgradeGlb(
  sceneRoot: THREE.Group,
  maxAniso: number,
  isSoftwareGl: boolean,
  paintColorHex = '#eef2f6'
): {
  root: THREE.Group;
  update: (dt: number, elapsed: number, isGo: boolean, reducedMotion: boolean) => void;
  dispose: () => void;
} {
  const wrapper = new THREE.Group();
  const cloned = sceneRoot;

  const disposableMaterials: THREE.Material[] = [];
  const disposableGeometries: THREE.BufferGeometry[] = [];
  const disposableTextures: THREE.Texture[] = [];
  const wheelMeshes: THREE.Object3D[] = [];

  const flakeMap = isSoftwareGl ? null : createPaintFlakeNormalMap();
  if (flakeMap) disposableTextures.push(flakeMap);

  // Measure initial bounding box to auto-orient longest horizontal dimension along +Z
  cloned.updateMatrixWorld(true);
  const rawBox = new THREE.Box3().setFromObject(cloned);
  const rawSize = new THREE.Vector3();
  rawBox.getSize(rawSize);
  if (rawSize.x > rawSize.z * 1.05) {
    cloned.rotation.y = -Math.PI / 2;
    cloned.updateMatrixWorld(true);
  }

  // Recompute box, uniformly scale largest dimension to 4.5 units, center X/Z, snap min.y = 0
  const alignedBox = new THREE.Box3().setFromObject(cloned);
  const alignedSize = new THREE.Vector3();
  const alignedCenter = new THREE.Vector3();
  alignedBox.getSize(alignedSize);
  alignedBox.getCenter(alignedCenter);

  const maxDim = Math.max(alignedSize.x, alignedSize.y, alignedSize.z, 0.001);
  const uniformScale = 4.5 / maxDim;
  cloned.scale.multiplyScalar(uniformScale);
  cloned.position.set(
    -alignedCenter.x * uniformScale,
    -alignedBox.min.y * uniformScale,
    -alignedCenter.z * uniformScale
  );

  // Track candidate material surface area for paint fallback detection
  const materialAreaMap = new Map<THREE.Material, number>();
  const meshMaterialList: Array<{ mesh: THREE.Mesh; mat: THREE.Material }> = [];

  cloned.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (mesh.geometry) {
        disposableGeometries.push(mesh.geometry);
      }

      if (/wheel|tire|rim|tyre/i.test(mesh.name)) {
        wheelMeshes.push(mesh);
      }

      let approxArea = 0.1;
      if (mesh.geometry) {
        if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
        const bb = mesh.geometry.boundingBox;
        if (bb) {
          const sx = bb.max.x - bb.min.x;
          const sy = bb.max.y - bb.min.y;
          const sz = bb.max.z - bb.min.z;
          approxArea = sx * sy + sy * sz + sx * sz;
        }
      }

      const replaceMat = (mat: THREE.Material): THREE.Material => {
        disposableMaterials.push(mat);

        const std = mat as THREE.MeshStandardMaterial;
        const phys = mat as THREE.MeshPhysicalMaterial;
        std.side = THREE.FrontSide;

        // Apply max anisotropy to textures on the material
        const texKeys: Array<keyof THREE.MeshStandardMaterial> = [
          'map',
          'normalMap',
          'roughnessMap',
          'metalnessMap',
          'aoMap',
        ];
        for (const k of texKeys) {
          const t = std[k] as THREE.Texture | null | undefined;
          if (t && t.isTexture) {
            t.anisotropy = maxAniso;
          }
        }

        if (std.emissiveIntensity && std.emissiveIntensity > 2.2) {
          std.emissiveIntensity = 1.9;
        }

        const matName = mat.name || '';
        const isGlass = /glass|window|windshield|windscreen|headlight_lens|lens/i.test(matName);
        if (isGlass) {
          if ('transmission' in phys) phys.transmission = 0;
          mat.transparent = true;
          mat.opacity = /lens/i.test(matName) ? 0.68 : 0.36;
          std.roughness = 0.08;
          std.metalness = 0.12;
          std.envMapIntensity = 1.2;
        } else {
          materialAreaMap.set(mat, (materialAreaMap.get(mat) || 0) + approxArea);
        }

        meshMaterialList.push({ mesh, mat });
        return mat;
      };

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map(replaceMat);
      } else if (mesh.material) {
        mesh.material = replaceMat(mesh.material);
      }
    }
  });

  // Identify paint materials by name or fallback to largest non-glass material
  let largestFallbackMat: THREE.Material | null = null;
  let largestArea = -1;
  for (const [m, area] of materialAreaMap.entries()) {
    if (!/tire|rubber|wheel|chrome|brake|caliper|interior|leather|grill|plastic|trim|carbon/i.test(m.name)) {
      if (area > largestArea) {
        largestArea = area;
        largestFallbackMat = m;
      }
    }
  }

  const upgradedPaintMats = new Set<THREE.Material>();
  for (const { mesh, mat } of meshMaterialList) {
    const isNamedPaint = /paint|body|carpaint|exterior|chassis_paint/i.test(mat.name);
    if ((isNamedPaint || mat === largestFallbackMat) && !upgradedPaintMats.has(mat)) {
      upgradedPaintMats.add(mat);
      const oldStd = mat as THREE.MeshStandardMaterial;
      const paintPhys = isSoftwareGl
        ? new THREE.MeshStandardMaterial({
            color: new THREE.Color(paintColorHex),
            metalness: 0.45,
            roughness: 0.2,
            envMapIntensity: 1.0,
          })
        : new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(paintColorHex),
            metalness: 0.55,
            roughness: Math.max(0.16, oldStd.roughness ?? 0.2),
            clearcoat: 1.0,
            clearcoatRoughness: 0.06,
            envMapIntensity: 1.05,
            normalMap: oldStd.normalMap || flakeMap || null,
            normalScale: oldStd.normalMap ? oldStd.normalScale : new THREE.Vector2(0.03, 0.03),
          });
      disposableMaterials.push(paintPhys);

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((entry) => (entry === mat ? paintPhys : entry));
      } else if (mesh.material === mat) {
        mesh.material = paintPhys;
      }
    }
  }

  wrapper.add(cloned);

  let launchSurge = 0;
  let launchSquat = 0;

  return {
    root: wrapper,
    update: (dt: number, elapsed: number, isGo: boolean, reducedMotion: boolean) => {
      const targetSurge = isGo && !reducedMotion ? 0.95 : 0;
      const targetSquat = isGo && !reducedMotion ? -0.024 : 0;
      launchSurge = THREE.MathUtils.damp(launchSurge, targetSurge, 4.4, dt);
      launchSquat = THREE.MathUtils.damp(launchSquat, targetSquat, 6.0, dt);

      wrapper.position.z = launchSurge;
      cloned.rotation.x = launchSquat;

      if (!reducedMotion) {
        const rumble = isGo ? 0.004 : 0.001;
        cloned.position.y = Math.sin(elapsed * (isGo ? 66 : 32)) * rumble;
      } else {
        cloned.position.y = 0;
      }

      if (isGo && !reducedMotion && wheelMeshes.length > 0) {
        for (const w of wheelMeshes) {
          w.rotation.x += 34 * dt;
        }
      }
    },
    dispose: () => {
      for (const m of disposableMaterials) m.dispose();
      for (const g of disposableGeometries) g.dispose();
      for (const t of disposableTextures) t.dispose();
    },
  };
}

export class StartingGridSceneController {
  private container: HTMLElement;
  private callbacks: StartingGridCallbacks;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private composer: EffectComposer | null = null;
  private bloomPass: UnrealBloomPass | null = null;
  private isSoftwareGl = false;
  private reducedMotion = false;
  private disposed = false;
  private rafId = 0;
  private resizeObserver: ResizeObserver | null = null;
  private timeline: gsap.core.Timeline | null = null;
  private reducedTimers: number[] = [];
  private launchFinishTimer = 0;

  // Dynamic state
  private currentStep: CountdownStep = null;
  private isGo = false;
  private trackSpeed = 0;
  private trackOffsetZ = 0;
  private elapsed = 0;
  private lastTime = 0;
  private lastDrawTime = 0;
  private framing: ViewportFraming = { distScale: 1, baseFov: 50, lookY: 0.72 };

  // Camera rig state driven by GSAP
  private camRig = {
    x: -2.5,
    y: 0.65,
    z: 3.8,
    lookZ: 0.0,
    fovOffset: 0,
    shakeAmp: 0,
  };
  private _camTargetPos = new THREE.Vector3(-2.5, 0.65, 3.8);
  private _lookTarget = new THREE.Vector3(0, 0.72, 0);
  private _tempMat = new THREE.Matrix4();
  private _tempPos = new THREE.Vector3();
  private _tempQuat = new THREE.Quaternion();
  private _tempScale = new THREE.Vector3();

  // Scene references for animation & disposal
  private trackWorldRef = new THREE.Group();
  private gantryLightMats: THREE.MeshStandardMaterial[] = [];
  private marshalBoardMat!: THREE.MeshStandardMaterial;
  private asphaltMaps!: ReturnType<typeof createDaylightAsphaltMaps>;
  private gravelTex!: THREE.CanvasTexture;
  private grassTex!: THREE.CanvasTexture;
  private windStreaks!: THREE.InstancedMesh;
  private windStreakData: Array<{ x: number; y: number; z: number; speed: number; len: number }> = [];
  private tireDust!: THREE.InstancedMesh;
  private dustParticles: Array<{
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    life: number;
    maxLife: number;
    scale: number;
  }> = [];

  private carController: {
    root: THREE.Group;
    update: (dt: number, elapsed: number, isGo: boolean, reducedMotion: boolean) => void;
    dispose: () => void;
  } | null = null;

  private disposables: Array<{ dispose: () => void }> = [];
  private envRenderTarget: THREE.WebGLRenderTarget | null = null;
  private resizeHandler: (() => void) | null = null;
  private contextLostHandler = (e: Event) => {
    e.preventDefault();
    this.callbacks.onContextLost();
  };

  constructor(
    container: HTMLElement,
    preloadedAssets: PreloadedIntroAssets,
    callbacks: StartingGridCallbacks
  ) {
    this.container = container;
    this.callbacks = callbacks;
    this.reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;

    try {
      this.initRenderer();
      this.initSceneAndLighting(preloadedAssets);
      this.initCircuitWorld();
      this.initParticles();
      this.initResizeHandling();
      this.startRenderLoop();
      void this.loadCarAndStartSequence(preloadedAssets);
    } catch {
      this.callbacks.onFatalError();
    }
  }

  private initRenderer(): void {
    const width = Math.max(1, this.container.clientWidth || window.innerWidth);
    const height = Math.max(1, this.container.clientHeight || window.innerHeight);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });

    const gl = this.renderer.getContext();
    let rendererStr = '';
    try {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (dbg) {
        rendererStr = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
      }
      if (!rendererStr) {
        rendererStr = String(gl.getParameter(gl.RENDERER) || '');
      }
    } catch {
      rendererStr = '';
    }

    this.isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererStr);

    const maxDpr = this.isSoftwareGl ? 0.7 : width < 640 ? 1.75 : width < 1024 ? 1.85 : 2;
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? maxDpr : Math.min(window.devicePixelRatio || 1, maxDpr)
    );
    this.renderer.setSize(width, height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.addEventListener('webglcontextlost', this.contextLostHandler);
    this.container.appendChild(this.renderer.domElement);

    this.framing = computeViewportFraming(width, height);
    this.camera = new THREE.PerspectiveCamera(this.framing.baseFov, width / height, 0.1, 260);
    this.camera.position.set(
      this.camRig.x * this.framing.distScale,
      this.camRig.y,
      this.camRig.z * this.framing.distScale
    );
    this.camera.lookAt(0, this.framing.lookY, 0);

    if (!this.isSoftwareGl) {
      this.composer = new EffectComposer(this.renderer);
      const renderPass = new RenderPass(this.scenePlaceholder(), this.camera);
      this.bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        width < 640 ? 0.18 : 0.25,
        0.25,
        1.5
      );
      const outputPass = new OutputPass();
      this.composer.addPass(renderPass);
      this.composer.addPass(this.bloomPass);
      this.composer.addPass(outputPass);
    }
  }

  private scenePlaceholder(): THREE.Scene {
    this.scene = new THREE.Scene();
    return this.scene;
  }

  private initSceneAndLighting(preloadedAssets: PreloadedIntroAssets): void {
    if (!this.scene) {
      this.scene = new THREE.Scene();
    }
    this.scene.background = new THREE.Color('#cfdbe6');
    this.scene.fog = new THREE.Fog('#cfdbe6', 45, 180);

    // Daylight Sky
    const sky = new Sky();
    sky.scale.setScalar(4500);
    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 6;
    skyUniforms['rayleigh'].value = 1.2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;
    skyUniforms['sunPosition'].value.set(60, 28, -40);
    this.scene.add(sky);
    this.disposables.push(sky.geometry, sky.material);

    // Lighting rig
    const hemi = new THREE.HemisphereLight('#b9d8f5', '#4a463f', 0.9);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight('#fff5e4', 2.8);
    sun.position.set(30, 42, -25);
    sun.castShadow = !this.isSoftwareGl;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -18;
    sun.shadow.camera.right = 18;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 120;
    sun.shadow.bias = -0.0003;
    sun.shadow.normalBias = 0.02;
    this.scene.add(sun);

    // Contact shadow plane under pole vehicle
    const contactTex = createContactShadowTexture();
    const contactGeo = new THREE.PlaneGeometry(5.6, 8.2);
    const contactMat = new THREE.MeshBasicMaterial({
      map: contactTex,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
    });
    const contactMesh = new THREE.Mesh(contactGeo, contactMat);
    contactMesh.rotation.x = -Math.PI / 2;
    contactMesh.position.set(0, 0.004, 0);
    this.scene.add(contactMesh);
    this.disposables.push(contactTex, contactGeo, contactMat);

    // Environment reflections (local HDR with RoomEnvironment fallback)
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    pmrem.compileEquirectangularShader();

    const applyFallbackEnv = () => {
      if (this.disposed) return;
      const roomEnv = new RoomEnvironment();
      this.envRenderTarget?.dispose();
      this.envRenderTarget = pmrem.fromScene(roomEnv, 0.04);
      this.scene.environment = this.envRenderTarget.texture;
      roomEnv.dispose();
    };

    const rgbeLoader = new RGBELoader();
    if (preloadedAssets.hdrBuffer && preloadedAssets.hdrBuffer.byteLength > 0) {
      try {
        const hdrTex = rgbeLoader.parse(preloadedAssets.hdrBuffer.slice(0));
        if (hdrTex) {
          const tex = new THREE.DataTexture(
            hdrTex.data,
            hdrTex.width,
            hdrTex.height,
            THREE.RGBAFormat,
            hdrTex.type
          );
          tex.mapping = THREE.EquirectangularReflectionMapping;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.needsUpdate = true;
          this.envRenderTarget?.dispose();
          this.envRenderTarget = pmrem.fromEquirectangular(tex);
          this.scene.environment = this.envRenderTarget.texture;
          tex.dispose();
        } else {
          applyFallbackEnv();
        }
      } catch {
        applyFallbackEnv();
      }
      pmrem.dispose();
    } else {
      rgbeLoader
        .loadAsync('/env/rooitou_park_1k.hdr')
        .then((hdrTex) => {
          if (this.disposed) {
            hdrTex.dispose();
            pmrem.dispose();
            return;
          }
          hdrTex.mapping = THREE.EquirectangularReflectionMapping;
          this.envRenderTarget?.dispose();
          this.envRenderTarget = pmrem.fromEquirectangular(hdrTex);
          this.scene.environment = this.envRenderTarget.texture;
          hdrTex.dispose();
          pmrem.dispose();
        })
        .catch(() => {
          applyFallbackEnv();
          pmrem.dispose();
        });
    }
  }

  private initCircuitWorld(): void {
    const maxAniso = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    this.asphaltMaps = createDaylightAsphaltMaps(maxAniso);
    const curbTex = createCurbTexture(maxAniso);
    this.gravelTex = createGravelTexture(maxAniso);
    this.grassTex = createGrassTexture(maxAniso);
    const fenceTex = createCatchFenceTexture();
    const sponsorTex = createSponsorBannerTexture();

    this.disposables.push(
      this.asphaltMaps,
      curbTex,
      this.gravelTex,
      this.grassTex,
      fenceTex,
      sponsorTex
    );

    // 1. Static ground layers (grass, horizon hills, dry asphalt straightaway, gravel trap, astroturf verges)
    const grassGeo = new THREE.PlaneGeometry(520, 520);
    const grassMat = new THREE.MeshStandardMaterial({
      map: this.grassTex,
      roughness: 0.92,
      metalness: 0.0,
    });
    const grassPlane = new THREE.Mesh(grassGeo, grassMat);
    grassPlane.rotation.x = -Math.PI / 2;
    grassPlane.position.y = -0.04;
    grassPlane.receiveShadow = true;
    this.scene.add(grassPlane);

    const hillGeo = new THREE.CylinderGeometry(142, 165, 22, 48, 1, true);
    const hillMat = new THREE.MeshStandardMaterial({
      color: '#677c58',
      roughness: 0.95,
      side: THREE.BackSide,
    });
    const hills = new THREE.Mesh(hillGeo, hillMat);
    hills.position.y = 8;
    this.scene.add(hills);

    const trackGeo = new THREE.PlaneGeometry(14, 360);
    const trackMat = new THREE.MeshStandardMaterial({
      map: this.asphaltMaps.albedoMap,
      roughnessMap: this.asphaltMaps.roughnessMap,
      bumpMap: this.asphaltMaps.bumpMap,
      bumpScale: 0.025,
      roughness: 0.68,
      metalness: 0.05,
    });
    const asphalt = new THREE.Mesh(trackGeo, trackMat);
    asphalt.rotation.x = -Math.PI / 2;
    asphalt.position.y = 0;
    asphalt.receiveShadow = true;
    this.scene.add(asphalt);

    const gravelGeo = new THREE.PlaneGeometry(5.4, 360);
    const gravelMat = new THREE.MeshStandardMaterial({
      map: this.gravelTex,
      roughness: 0.95,
    });
    const gravel = new THREE.Mesh(gravelGeo, gravelMat);
    gravel.rotation.x = -Math.PI / 2;
    gravel.position.set(-10.8, -0.018, 0);
    gravel.receiveShadow = true;
    this.scene.add(gravel);

    const vergeGeo = new THREE.PlaneGeometry(1.1, 360);
    const vergeMat = new THREE.MeshStandardMaterial({
      color: '#3c6632',
      roughness: 0.88,
    });
    for (const vx of [-8.05, 8.05]) {
      const verge = new THREE.Mesh(vergeGeo, vergeMat);
      verge.rotation.x = -Math.PI / 2;
      verge.position.set(vx, -0.01, 0);
      verge.receiveShadow = true;
      this.scene.add(verge);
    }

    this.disposables.push(
      grassGeo,
      grassMat,
      hillGeo,
      hillMat,
      trackGeo,
      trackMat,
      gravelGeo,
      gravelMat,
      vergeGeo,
      vergeMat
    );

    // 2. Scrolling Track World (trackWorldRef)
    this.scene.add(this.trackWorldRef);

    // Checkered Start/Finish Stripe (28 x 2) at z = +3.3
    const checkGeo = new THREE.PlaneGeometry(0.5, 0.5);
    const whitePaintMat = new THREE.MeshStandardMaterial({
      color: '#f1f5f9',
      roughness: 0.72,
    });
    const darkCheckMat = new THREE.MeshStandardMaterial({
      color: '#181a1f',
      roughness: 0.78,
    });
    const checkInstWhite = new THREE.InstancedMesh(checkGeo, whitePaintMat, 28);
    const checkInstBlack = new THREE.InstancedMesh(checkGeo, darkCheckMat, 28);
    let wi = 0;
    let bi = 0;
    for (let col = 0; col < 28; col++) {
      for (let row = 0; row < 2; row++) {
        this._tempPos.set(-6.75 + col * 0.5, 0.003, 3.05 + row * 0.5);
        this._tempQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
        this._tempScale.set(1, 1, 1);
        this._tempMat.compose(this._tempPos, this._tempQuat, this._tempScale);
        if ((col + row) % 2 === 0) {
          checkInstWhite.setMatrixAt(wi++, this._tempMat);
        } else {
          checkInstBlack.setMatrixAt(bi++, this._tempMat);
        }
      }
    }
    checkInstWhite.computeBoundingSphere();
    checkInstBlack.computeBoundingSphere();
    this.trackWorldRef.add(checkInstWhite, checkInstBlack);

    // White edge boundary lines at x = ±6.85
    const lineGeo = new THREE.PlaneGeometry(0.16, 360);
    for (const lx of [-6.85, 6.85]) {
      const line = new THREE.Mesh(lineGeo, whitePaintMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(lx, 0.003, 0);
      this.trackWorldRef.add(line);
    }

    // 6 Staggered Starting-Grid Boxes (Pole slot at [0, 0, 0])
    const boxSideGeo = new THREE.PlaneGeometry(0.12, 2.8);
    const boxFrontGeo = new THREE.PlaneGeometry(2.5, 0.14);
    const gridSlots: Array<[number, number]> = [
      [0, 0],
      [-3.4, -7.5],
      [3.4, -13.5],
      [-3.4, -20.5],
      [3.4, -27.5],
      [-3.4, -34.5],
    ];
    for (const [gx, gz] of gridSlots) {
      const frontBar = new THREE.Mesh(boxFrontGeo, whitePaintMat);
      frontBar.rotation.x = -Math.PI / 2;
      frontBar.position.set(gx, 0.0035, gz + 2.45);
      const leftBar = new THREE.Mesh(boxSideGeo, whitePaintMat);
      leftBar.rotation.x = -Math.PI / 2;
      leftBar.position.set(gx - 1.2, 0.0035, gz + 1.1);
      const rightBar = new THREE.Mesh(boxSideGeo, whitePaintMat);
      rightBar.rotation.x = -Math.PI / 2;
      rightBar.position.set(gx + 1.2, 0.0035, gz + 1.1);
      this.trackWorldRef.add(frontBar, leftBar, rightBar);
    }

    this.disposables.push(checkGeo, whitePaintMat, darkCheckMat, lineGeo, boxSideGeo, boxFrontGeo);

    // Rumble Curbs (200 per side at x = ±7.32, alternating red #c8232c & off-white #ebe8e0)
    const curbGeo = new THREE.BoxGeometry(0.65, 0.08, 1.55);
    const redCurbMat = new THREE.MeshStandardMaterial({
      map: curbTex,
      color: '#c8232c',
      roughness: 0.72,
    });
    const whiteCurbMat = new THREE.MeshStandardMaterial({
      map: curbTex,
      color: '#ebe8e0',
      roughness: 0.72,
    });
    const redCurbs = new THREE.InstancedMesh(curbGeo, redCurbMat, 200);
    const whiteCurbs = new THREE.InstancedMesh(curbGeo, whiteCurbMat, 200);
    let rci = 0;
    let wci = 0;
    this._tempQuat.identity();
    this._tempScale.set(1, 1, 1);
    for (let i = 0; i < 200; i++) {
      const cz = -155 + i * 1.6;
      for (const side of [-1, 1]) {
        this._tempPos.set(side * 7.32, 0.025, cz);
        this._tempMat.compose(this._tempPos, this._tempQuat, this._tempScale);
        if ((i + (side > 0 ? 1 : 0)) % 2 === 0) {
          redCurbs.setMatrixAt(rci++, this._tempMat);
        } else {
          whiteCurbs.setMatrixAt(wci++, this._tempMat);
        }
      }
    }
    redCurbs.computeBoundingSphere();
    whiteCurbs.computeBoundingSphere();
    this.trackWorldRef.add(redCurbs, whiteCurbs);
    this.disposables.push(curbGeo, redCurbMat, whiteCurbMat);

    // Safety Armco Guardrails & Support Posts
    const railGeo = new THREE.BoxGeometry(0.18, 0.42, 340);
    const steelMat = new THREE.MeshStandardMaterial({
      color: '#9ca3af',
      metalness: 0.72,
      roughness: 0.36,
    });
    const postGeo = new THREE.BoxGeometry(0.12, 0.88, 0.12);
    const posts = new THREE.InstancedMesh(postGeo, steelMat, 160);
    let pi = 0;
    for (const rx of [-14.1, 17.7]) {
      const rail = new THREE.Mesh(railGeo, steelMat);
      rail.position.set(rx, 0.62, 0);
      this.trackWorldRef.add(rail);
      for (let i = 0; i < 80; i++) {
        this._tempPos.set(rx + (rx < 0 ? -0.14 : 0.14), 0.44, -158 + i * 4);
        this._tempMat.compose(this._tempPos, this._tempQuat, this._tempScale);
        posts.setMatrixAt(pi++, this._tempMat);
      }
    }
    posts.computeBoundingSphere();
    this.trackWorldRef.add(posts);
    this.disposables.push(railGeo, steelMat, postGeo);

    // 3 Clusters of Stacked Red/Black Tire Walls along Left Gravel Edge
    const tireWallGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.28, 16);
    const blackTireMat = new THREE.MeshStandardMaterial({ color: '#181a1f', roughness: 0.85 });
    const redTireMat = new THREE.MeshStandardMaterial({ color: '#b91c1c', roughness: 0.75 });
    for (const clusterZ of [-18, 14, 48]) {
      for (let t = 0; t < 12; t++) {
        for (let stack = 0; stack < 3; stack++) {
          const tire = new THREE.Mesh(
            tireWallGeo,
            (t + stack) % 2 === 0 ? redTireMat : blackTireMat
          );
          tire.position.set(-13.45, 0.14 + stack * 0.28, clusterZ + t * 0.76);
          this.trackWorldRef.add(tire);
        }
      }
    }
    this.disposables.push(tireWallGeo, blackTireMat, redTireMat);

    // Pit Wall (x = 8.85), Fence Posts (70), Catch Fence, Pit Lane & 6 Pit Garages
    const pitWallGeo = new THREE.BoxGeometry(0.55, 1.05, 340);
    const concreteMat = new THREE.MeshStandardMaterial({ color: '#c4c7cc', roughness: 0.88 });
    const pitWall = new THREE.Mesh(pitWallGeo, concreteMat);
    pitWall.position.set(8.85, 0.52, 0);
    pitWall.receiveShadow = true;
    this.trackWorldRef.add(pitWall);

    const fencePostGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.4, 8);
    const fencePosts = new THREE.InstancedMesh(fencePostGeo, steelMat, 70);
    for (let i = 0; i < 70; i++) {
      this._tempPos.set(8.85, 2.2, -140 + i * 4);
      this._tempMat.compose(this._tempPos, this._tempQuat, this._tempScale);
      fencePosts.setMatrixAt(i, this._tempMat);
    }
    fencePosts.computeBoundingSphere();
    this.trackWorldRef.add(fencePosts);

    const catchFenceGeo = new THREE.PlaneGeometry(320, 2.2);
    const catchFenceMat = new THREE.MeshBasicMaterial({
      map: fenceTex,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const catchFence = new THREE.Mesh(catchFenceGeo, catchFenceMat);
    catchFence.rotation.y = Math.PI / 2;
    catchFence.position.set(8.85, 2.15, 0);
    this.trackWorldRef.add(catchFence);

    // Digital Marshal Flag Board on Pit Wall
    const boardFrameGeo = new THREE.BoxGeometry(0.25, 1.4, 1.6);
    const boardScreenGeo = new THREE.PlaneGeometry(1.3, 1.05);
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: '#1b2029',
      metalness: 0.5,
      roughness: 0.45,
    });
    this.marshalBoardMat = new THREE.MeshStandardMaterial({
      color: '#ef4444',
      emissive: new THREE.Color('#dc2626'),
      emissiveIntensity: 1.4,
      toneMapped: false,
    });
    const boardFrame = new THREE.Mesh(boardFrameGeo, darkMetalMat);
    boardFrame.position.set(8.7, 2.4, 5.2);
    const boardScreen = new THREE.Mesh(boardScreenGeo, this.marshalBoardMat);
    boardScreen.rotation.y = -Math.PI / 2;
    boardScreen.position.set(8.56, 2.4, 5.2);
    this.trackWorldRef.add(boardFrame, boardScreen);

    // Pit-Lane Asphalt Strip & 6 Pit Garages
    const pitLaneGeo = new THREE.PlaneGeometry(7.2, 340);
    const pitLaneMat = new THREE.MeshStandardMaterial({ color: '#42464e', roughness: 0.76 });
    const pitLane = new THREE.Mesh(pitLaneGeo, pitLaneMat);
    pitLane.rotation.x = -Math.PI / 2;
    pitLane.position.set(13.2, -0.008, 0);
    pitLane.receiveShadow = true;
    this.trackWorldRef.add(pitLane);

    const garageBodyGeo = new THREE.BoxGeometry(5.8, 4.4, 9.2);
    const canopyGeo = new THREE.BoxGeometry(3.2, 0.25, 9.4);
    const garageMat = new THREE.MeshStandardMaterial({ color: '#e2e6ec', roughness: 0.6 });
    const accentStripeMat = new THREE.MeshStandardMaterial({ color: '#2B59FF', roughness: 0.5 });
    for (let g = 0; g < 6; g++) {
      const gz = -22 + g * 11;
      const gBody = new THREE.Mesh(garageBodyGeo, garageMat);
      gBody.position.set(19.6, 2.2, gz);
      const canopy = new THREE.Mesh(canopyGeo, darkMetalMat);
      canopy.position.set(15.6, 3.85, gz);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.35, 9.4), accentStripeMat);
      stripe.position.set(14.0, 3.85, gz);
      this.trackWorldRef.add(gBody, canopy, stripe);
      this.disposables.push(stripe.geometry);
    }

    this.disposables.push(
      pitWallGeo,
      concreteMat,
      fencePostGeo,
      catchFenceGeo,
      catchFenceMat,
      boardFrameGeo,
      boardScreenGeo,
      darkMetalMat,
      this.marshalBoardMat,
      pitLaneGeo,
      pitLaneMat,
      garageBodyGeo,
      canopyGeo,
      garageMat,
      accentStripeMat
    );

    // Left Tiered Spectator Grandstand (6 stepped tiers at x = -20.5, z = 18)
    const tierMat = new THREE.MeshStandardMaterial({ color: '#7d8590', roughness: 0.85 });
    const seatRowMat = new THREE.MeshStandardMaterial({ color: '#1d4ed8', roughness: 0.55 });
    for (let tier = 0; tier < 6; tier++) {
      const stepGeo = new THREE.BoxGeometry(1.1, 0.55, 34);
      const seatGeo = new THREE.BoxGeometry(0.6, 0.22, 33.4);
      const step = new THREE.Mesh(stepGeo, tierMat);
      step.position.set(-18.2 - tier * 1.05, 0.4 + tier * 0.55, 18);
      const seat = new THREE.Mesh(seatGeo, seatRowMat);
      seat.position.set(-18.1 - tier * 1.05, 0.76 + tier * 0.55, 18);
      this.trackWorldRef.add(step, seat);
      this.disposables.push(stepGeo, seatGeo);
    }
    const roofStandGeo = new THREE.BoxGeometry(8.4, 0.28, 35);
    const roofStand = new THREE.Mesh(roofStandGeo, darkMetalMat);
    roofStand.position.set(-20.8, 6.2, 18);
    roofStand.rotation.z = -0.14;
    const standRailGeo = new THREE.BoxGeometry(0.14, 0.85, 34);
    const standRail = new THREE.Mesh(standRailGeo, steelMat);
    standRail.position.set(-17.5, 0.8, 18);
    this.trackWorldRef.add(roofStand, standRail);
    this.disposables.push(tierMat, seatRowMat, roofStandGeo, standRailGeo);

    // Overhead Start/Finish Gantry at z = +9.5 with 5 Dual-Faced Light Pods
    const gantryDeckGeo = new THREE.BoxGeometry(19.2, 1.45, 1.35);
    const gantryDeckMat = new THREE.MeshStandardMaterial({
      map: sponsorTex,
      roughness: 0.45,
      metalness: 0.2,
    });
    const gantryDeck = new THREE.Mesh(gantryDeckGeo, gantryDeckMat);
    gantryDeck.position.set(0, 6.1, 9.5);
    this.trackWorldRef.add(gantryDeck);

    const gantryLegGeo = new THREE.BoxGeometry(0.65, 6.8, 0.9);
    for (const gx of [-9.4, 9.4]) {
      const leg = new THREE.Mesh(gantryLegGeo, darkMetalMat);
      leg.position.set(gx, 3.4, 9.5);
      this.trackWorldRef.add(leg);
    }

    const podHousingGeo = new THREE.BoxGeometry(0.68, 0.72, 0.42);
    const podLampGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.46, 18);
    podLampGeo.rotateX(Math.PI / 2);

    this.gantryLightMats = [];
    for (let p = 0; p < 5; p++) {
      const px = -2.4 + p * 1.2;
      const housing = new THREE.Mesh(podHousingGeo, darkMetalMat);
      housing.position.set(px, 5.02, 9.5);
      this.trackWorldRef.add(housing);

      const lampMat = new THREE.MeshStandardMaterial({
        color: '#20242c',
        emissive: new THREE.Color('#000000'),
        emissiveIntensity: 0,
        toneMapped: false,
      });
      const lamp = new THREE.Mesh(podLampGeo, lampMat);
      lamp.position.set(px, 5.02, 9.5);
      this.trackWorldRef.add(lamp);
      this.gantryLightMats.push(lampMat);
      this.disposables.push(lampMat);
    }
    this.disposables.push(gantryDeckGeo, gantryDeckMat, gantryLegGeo, podHousingGeo, podLampGeo);

    // 64 Instanced Perimeter Trees
    const trunkGeo = new THREE.CylinderGeometry(0.22, 0.34, 2.8, 7);
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#5b4330', roughness: 0.9 });
    const crownGeo = new THREE.IcosahedronGeometry(2.1, 1);
    const crownMat = new THREE.MeshStandardMaterial({ color: '#4d733e', roughness: 0.85 });

    const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, 64);
    const crowns = new THREE.InstancedMesh(crownGeo, crownMat, 64);
    const tint = new THREE.Color();

    for (let i = 0; i < 64; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const tx = side < 0 ? -28 - ((i * 7) % 24) : 27 + ((i * 11) % 24);
      const tz = -150 + i * 5.2;
      const sc = 0.85 + ((i * 17) % 10) * 0.06;

      this._tempPos.set(tx, 1.3 * sc, tz);
      this._tempQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), i * 1.1);
      this._tempScale.set(sc, sc, sc);
      this._tempMat.compose(this._tempPos, this._tempQuat, this._tempScale);
      trunks.setMatrixAt(i, this._tempMat);

      this._tempPos.set(tx, 3.6 * sc, tz);
      this._tempScale.set(sc, sc * 1.15, sc);
      this._tempMat.compose(this._tempPos, this._tempQuat, this._tempScale);
      crowns.setMatrixAt(i, this._tempMat);

      tint.setHSL(0.28 + ((i % 5) - 2) * 0.015, 0.36, 0.32 + (i % 4) * 0.04);
      crowns.setColorAt(i, tint);
    }
    trunks.computeBoundingSphere();
    crowns.computeBoundingSphere();
    this.trackWorldRef.add(trunks, crowns);
    this.disposables.push(trunkGeo, trunkMat, crownGeo, crownMat);
  }

  private initParticles(): void {
    // 48 Instanced Peripheral White WindSpeedStreaks
    const streakGeo = new THREE.BoxGeometry(0.035, 0.035, 2.2);
    const streakMat = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    this.windStreaks = new THREE.InstancedMesh(streakGeo, streakMat, 48);
    this.windStreaks.visible = false;
    this.windStreaks.frustumCulled = false;

    for (let i = 0; i < 48; i++) {
      const angle = (i / 48) * Math.PI * 2;
      const rad = 2.6 + (i % 4) * 0.85;
      this.windStreakData.push({
        x: Math.cos(angle) * rad,
        y: 0.4 + Math.abs(Math.sin(angle)) * 2.4,
        z: -8 + (i % 12) * 2.6,
        speed: 32 + (i % 5) * 6,
        len: 0.8 + (i % 3) * 0.55,
      });
      this._tempMat.makeTranslation(0, -50, 0);
      this.windStreaks.setMatrixAt(i, this._tempMat);
    }
    this.windStreaks.computeBoundingSphere();
    this.scene.add(this.windStreaks);

    // 28 Instanced LaunchTireDust puffs behind rear tires
    const dustGeo = new THREE.SphereGeometry(0.28, 10, 8);
    const dustMat = new THREE.MeshBasicMaterial({
      color: '#d9dde2',
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
    });
    this.tireDust = new THREE.InstancedMesh(dustGeo, dustMat, 28);
    this.tireDust.visible = false;
    this.tireDust.frustumCulled = false;

    for (let i = 0; i < 28; i++) {
      const side = i % 2 === 0 ? -0.82 : 0.82;
      this.dustParticles.push({
        x: side + (Math.random() - 0.5) * 0.25,
        y: 0.12 + Math.random() * 0.14,
        z: -1.45 - (i % 7) * 0.35,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 0.55 + Math.random() * 0.65,
        vz: -7.5 - Math.random() * 5,
        life: (i / 28) * 0.85,
        maxLife: 0.85,
        scale: 0.65 + Math.random() * 0.6,
      });
      this._tempMat.makeTranslation(0, -50, 0);
      this.tireDust.setMatrixAt(i, this._tempMat);
    }
    this.tireDust.computeBoundingSphere();
    this.scene.add(this.tireDust);

    this.disposables.push(streakGeo, streakMat, dustGeo, dustMat);
  }

  private async loadCarAndStartSequence(preloadedAssets: PreloadedIntroAssets): Promise<void> {
    const maxAniso = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    let loaded = false;

    const useFallbackCar = () => {
      if (loaded || this.disposed) return;
      loaded = true;
      const proc = createProceduralCar('supercar', '#eef2f6');
      this.carController = proc;
      this.scene.add(proc.root);
      this.renderer.compile(this.scene, this.camera);
      requestAnimationFrame(() => {
        if (!this.disposed) this.startChoreography();
      });
    };

    // Guard against slow GLB parsing/downloading blocking the intro
    const timeoutId = window.setTimeout(() => {
      useFallbackCar();
    }, 5500);

    try {
      const gltfLoader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
      gltfLoader.setDRACOLoader(dracoLoader);

      let gltfScene: THREE.Group | null = null;

      if (preloadedAssets.glbBuffer && preloadedAssets.glbBuffer.byteLength > 0) {
        const gltf = await gltfLoader.parseAsync(preloadedAssets.glbBuffer, '/cars/');
        preloadedAssets.glbBuffer = null;
        gltfScene = gltf.scene;
      } else {
        const gltf = await gltfLoader.loadAsync('/cars/2021_lexus_lc_500_convertible.glb');
        gltfScene = gltf.scene;
      }

      dracoLoader.dispose();
      window.clearTimeout(timeoutId);

      if (this.disposed || loaded || !gltfScene) return;
      loaded = true;

      const normalized = normalizeAndUpgradeGlb(
        gltfScene,
        maxAniso,
        this.isSoftwareGl,
        '#eef2f6'
      );
      this.carController = normalized;
      this.scene.add(normalized.root);
      this.renderer.compile(this.scene, this.camera);
      requestAnimationFrame(() => {
        if (!this.disposed) this.startChoreography();
      });
    } catch {
      window.clearTimeout(timeoutId);
      useFallbackCar();
    }
  }

  private updateGantryLights(step: CountdownStep): void {
    const redColor = new THREE.Color('#ff1f2d');
    const greenColor = new THREE.Color('#22e644');
    const offColor = new THREE.Color('#000000');

    const redCount = step === '3' ? 2 : step === '2' ? 4 : step === '1' ? 5 : 0;

    for (let i = 0; i < this.gantryLightMats.length; i++) {
      const m = this.gantryLightMats[i];
      if (step === 'GO') {
        m.color.copy(greenColor);
        m.emissive.copy(greenColor);
        m.emissiveIntensity = 2.1;
      } else if (i < redCount) {
        m.color.copy(redColor);
        m.emissive.copy(redColor);
        m.emissiveIntensity = 2.0;
      } else {
        m.color.set('#20242c');
        m.emissive.copy(offColor);
        m.emissiveIntensity = 0;
      }
    }

    if (this.marshalBoardMat) {
      if (step === 'GO') {
        this.marshalBoardMat.color.copy(greenColor);
        this.marshalBoardMat.emissive.copy(greenColor);
      } else {
        this.marshalBoardMat.color.set('#ef4444');
        this.marshalBoardMat.emissive.set('#dc2626');
      }
    }
  }

  private setStep(step: CountdownStep): void {
    if (this.disposed) return;
    this.currentStep = step;
    this.updateGantryLights(step);
    this.callbacks.onCountdownChange(step);

    if (step === '3' || step === '2' || step === '1') {
      startingGridAudio.playCountdownBeep(false);
    } else if (step === 'GO') {
      this.isGo = true;
      startingGridAudio.playCountdownBeep(true);
      startingGridAudio.playEngineRev();
      this.launchFinishTimer = window.setTimeout(() => {
        if (!this.disposed) {
          this.callbacks.onLaunchComplete();
        }
      }, 1350);
    }
  }

  private startChoreography(): void {
    if (this.disposed) return;

    if (this.reducedMotion) {
      // Static clean 3/4 view while preserving the 3-2-1-GO countdown & homepage reveal
      this.camRig.x = -2.4;
      this.camRig.y = 1.28;
      this.camRig.z = 3.6;
      this.setStep('3');
      this.reducedTimers.push(
        window.setTimeout(() => this.setStep('2'), 700),
        window.setTimeout(() => this.setStep('1'), 1400),
        window.setTimeout(() => this.setStep('GO'), 2100)
      );
      return;
    }

    const curve3 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.5, 0.65, 3.8),
      new THREE.Vector3(-0.25, 0.74, 4.05),
      new THREE.Vector3(2.2, 0.92, 2.6),
    ]);

    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.2, 0.92, 2.6),
      new THREE.Vector3(2.7, 2.5, 1.0),
      new THREE.Vector3(0.65, 2.32, -1.5),
      new THREE.Vector3(-1.8, 1.8, -2.8),
    ]);

    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.8, 1.8, -2.8),
      new THREE.Vector3(-1.05, 1.56, -3.85),
      new THREE.Vector3(0, 1.42, -4.4),
    ]);

    const prog = { t3: 0, t2: 0, t1: 0 };
    const pt = new THREE.Vector3();

    gsap.ticker.lagSmoothing(this.isSoftwareGl ? 350 : 500, this.isSoftwareGl ? 180 : 33);
    this.timeline = gsap.timeline();

    // Phase "3" (1.0s)
    this.timeline.call(() => this.setStep('3'));
    this.timeline.to(prog, {
      t3: 1,
      duration: 1.0,
      ease: 'power2.inOut',
      onUpdate: () => {
        curve3.getPoint(prog.t3, pt);
        this.camRig.x = pt.x;
        this.camRig.y = pt.y;
        this.camRig.z = pt.z;
      },
    });

    // Phase "2" (1.0s)
    this.timeline.call(() => this.setStep('2'));
    this.timeline.to(prog, {
      t2: 1,
      duration: 1.0,
      ease: 'power2.inOut',
      onUpdate: () => {
        curve2.getPoint(prog.t2, pt);
        this.camRig.x = pt.x;
        this.camRig.y = pt.y;
        this.camRig.z = pt.z;
      },
    });

    // Phase "1" (0.95s)
    this.timeline.call(() => this.setStep('1'));
    this.timeline.to(prog, {
      t1: 1,
      duration: 0.95,
      ease: 'power3.inOut',
      onUpdate: () => {
        curve1.getPoint(prog.t1, pt);
        this.camRig.x = pt.x;
        this.camRig.y = pt.y;
        this.camRig.z = pt.z;
      },
    });

    // "GO" Rapid Acceleration Sequence
    this.timeline.call(() => this.setStep('GO'));
    this.timeline.to(
      this.camRig,
      {
        x: 0,
        y: 1.24,
        z: -5.1,
        lookZ: 0.55,
        shakeAmp: 1,
        duration: 0.42,
        ease: 'expo.out',
      },
      'go'
    );
    this.timeline.to(
      this.camRig,
      {
        fovOffset: 16,
        duration: 0.38,
        ease: 'expo.out',
      },
      'go'
    );
    this.timeline.to(
      this.camRig,
      {
        x: 0,
        y: 1.42,
        z: -4.4,
        fovOffset: 4,
        shakeAmp: 0.35,
        duration: 0.85,
        ease: 'power2.out',
      },
      'go+=0.48'
    );
  }

  private initResizeHandling(): void {
    const onResize = () => {
      if (this.disposed) return;
      const w = Math.max(1, this.container.clientWidth || window.innerWidth);
      const h = Math.max(1, this.container.clientHeight || window.innerHeight);
      this.framing = computeViewportFraming(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();

      const maxDpr = this.isSoftwareGl ? 1 : w < 640 ? 1.75 : w < 1024 ? 1.85 : 2;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
      this.renderer.setSize(w, h);
      this.composer?.setSize(w, h);
      this.bloomPass?.setSize(w, h);
    };

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(onResize);
      this.resizeObserver.observe(this.container);
    } else {
      this.resizeHandler = onResize;
      window.addEventListener('resize', onResize);
    }
  }

  private startRenderLoop(): void {
    this.lastTime = performance.now();
    this.lastDrawTime = this.lastTime;

    const tick = (now: number) => {
      if (this.disposed) return;
      this.rafId = requestAnimationFrame(tick);

      // Software WebGL pacing (~30 fps max so CPU rendering never locks the main thread)
      if (this.isSoftwareGl && now - this.lastDrawTime < 33) {
        return;
      }
      this.lastDrawTime = now;

      const dt = Math.min(0.05, Math.max(0.001, (now - this.lastTime) / 1000));
      this.lastTime = now;
      this.elapsed += dt;

      // 1. Update Vehicle
      if (this.carController) {
        this.carController.update(dt, this.elapsed, this.isGo, this.reducedMotion);
      }

      // 2. Update Camera Rig (smooth exponential damp + optional launch shake)
      const targetX =
        this.camRig.x * this.framing.distScale +
        (this.camRig.shakeAmp > 0 && !this.reducedMotion
          ? Math.sin(this.elapsed * 54) * 0.014 * this.camRig.shakeAmp
          : 0);
      const targetY =
        this.camRig.y +
        (this.camRig.shakeAmp > 0 && !this.reducedMotion
          ? Math.cos(this.elapsed * 67) * 0.01 * this.camRig.shakeAmp
          : 0);
      const targetZ = this.camRig.z * this.framing.distScale;

      this._camTargetPos.set(targetX, targetY, targetZ);
      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, this._camTargetPos.x, 12, dt);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, this._camTargetPos.y, 12, dt);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, this._camTargetPos.z, 12, dt);

      const targetFov = this.framing.baseFov + this.camRig.fovOffset;
      if (Math.abs(this.camera.fov - targetFov) > 0.01) {
        this.camera.fov = THREE.MathUtils.damp(this.camera.fov, targetFov, 10, dt);
        this.camera.updateProjectionMatrix();
      }

      this._lookTarget.set(0, this.framing.lookY, this.camRig.lookZ);
      this.camera.lookAt(this._lookTarget);

      // 3. Rushing Track & Particles during GO
      if (this.isGo && !this.reducedMotion) {
        this.trackSpeed = THREE.MathUtils.damp(this.trackSpeed, 46, 3.2, dt);
        const dz = this.trackSpeed * dt;
        this.trackOffsetZ += dz;

        // Scroll ground UV offsets cleanly
        const uvShift = dz * (20 / 360);
        this.asphaltMaps.albedoMap.offset.y += uvShift;
        this.asphaltMaps.roughnessMap.offset.y += uvShift;
        this.asphaltMaps.bumpMap.offset.y += uvShift;
        this.gravelTex.offset.y += dz * (60 / 360);
        this.grassTex.offset.y += dz * (42 / 520);

        // Scroll entire trackWorldRef backwards cleanly
        this.trackWorldRef.position.z = -this.trackOffsetZ;

        // Peripheral white wind speed streaks
        this.windStreaks.visible = true;
        this._tempQuat.identity();
        for (let i = 0; i < this.windStreakData.length; i++) {
          const s = this.windStreakData[i];
          s.z -= s.speed * dt;
          if (s.z < -12) {
            s.z = 18;
          }
          this._tempPos.set(s.x, s.y, s.z);
          this._tempScale.set(1, 1, s.len);
          this._tempMat.compose(this._tempPos, this._tempQuat, this._tempScale);
          this.windStreaks.setMatrixAt(i, this._tempMat);
        }
        this.windStreaks.instanceMatrix.needsUpdate = true;

        // Rear tire launch dust
        this.tireDust.visible = true;
        for (let i = 0; i < this.dustParticles.length; i++) {
          const p = this.dustParticles[i];
          p.life += dt;
          if (p.life >= p.maxLife) {
            p.life = 0;
            p.x = (i % 2 === 0 ? -0.82 : 0.82) + (Math.random() - 0.5) * 0.22;
            p.y = 0.14;
            p.z = -1.3 + (Math.random() - 0.5) * 0.25;
          }
          const t = p.life / p.maxLife;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;
          const sc = p.scale * (0.6 + t * 1.8) * (1 - t * 0.55);
          this._tempPos.set(p.x, p.y, p.z);
          this._tempScale.set(sc, sc, sc);
          this._tempMat.compose(this._tempPos, this._tempQuat, this._tempScale);
          this.tireDust.setMatrixAt(i, this._tempMat);
        }
        this.tireDust.instanceMatrix.needsUpdate = true;
      }

      // 4. Render frame
      if (this.composer) {
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
    };

    this.rafId = requestAnimationFrame(tick);
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    cancelAnimationFrame(this.rafId);
    window.clearTimeout(this.launchFinishTimer);
    for (const id of this.reducedTimers) {
      window.clearTimeout(id);
    }
    this.reducedTimers = [];

    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }

    if (this.carController) {
      this.carController.dispose();
      this.carController = null;
    }

    for (const item of this.disposables) {
      item.dispose();
    }
    this.disposables = [];

    this.envRenderTarget?.dispose();
    this.envRenderTarget = null;

    this.composer?.dispose();
    this.composer = null;

    if (this.renderer) {
      this.renderer.domElement.removeEventListener('webglcontextlost', this.contextLostHandler);
      if (this.renderer.domElement.parentNode === this.container) {
        this.container.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
    }

    startingGridAudio.dispose();
  }
}
