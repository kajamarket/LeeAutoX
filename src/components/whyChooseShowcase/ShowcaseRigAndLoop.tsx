import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface ShowcaseRigAndLoopProps {
  isInView: boolean;
  isModelReady: boolean;
  prefersReducedMotion: boolean;
  isMobile: boolean;
  theme: string;
}

const TOP_DOWN_POS = new THREE.Vector3(0, 9.6, 0.002);
const TOP_DOWN_TARGET = new THREE.Vector3(0, 0.6, -0.15);
const TOP_DOWN_FOV = 38;

const SPLINE_STAGE_1 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 9.6, 0.002),
  new THREE.Vector3(0.75, 6.4, 3.45),
  new THREE.Vector3(2.85, 2.75, 4.95),
  new THREE.Vector3(3.85, 1.48, 4.1),
]);

const SPLINE_STAGE_2 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(3.85, 1.48, 4.1),
  new THREE.Vector3(2.15, 1.12, 4.95),
  new THREE.Vector3(0.55, 1.02, 5.15),
]);

const SPLINE_STAGE_3 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.55, 1.02, 5.15),
  new THREE.Vector3(-2.35, 0.86, 3.85),
  new THREE.Vector3(-3.8, 0.96, 2.0),
  new THREE.Vector3(-5.35, 1.15, 0.1),
]);

const SPLINE_STAGE_4 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-5.35, 1.15, 0.1),
  new THREE.Vector3(-4.55, 1.32, -2.25),
  new THREE.Vector3(-3.45, 1.42, -4.05),
  new THREE.Vector3(-0.75, 1.28, -4.95),
]);

const SPLINE_STAGE_5 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.75, 1.28, -4.95),
  new THREE.Vector3(2.75, 1.48, -4.05),
  new THREE.Vector3(4.75, 2.05, -0.85),
  new THREE.Vector3(3.35, 4.15, 2.45),
  new THREE.Vector3(0.95, 7.35, 1.65),
  new THREE.Vector3(0, 9.6, 0.002),
]);

const TARGET_HERO_34 = new THREE.Vector3(0, 0.78, 0.15);
const TARGET_GRILLE = new THREE.Vector3(0, 0.78, 1.25);
const TARGET_SIDE = new THREE.Vector3(0, 0.78, 0.05);
const TARGET_REAR_34 = new THREE.Vector3(0, 0.78, -0.2);

// Pre-allocated scratch math objects (zero allocations in useFrame)
const _desiredPos = new THREE.Vector3(0, 9.6, 0.002);
const _desiredTarget = new THREE.Vector3(0, 0.6, -0.15);
const _currentTarget = new THREE.Vector3(0, 0.6, -0.15);
const _stagePoint = new THREE.Vector3();

function computeAspectFraming(width: number, height: number) {
  const safeAspect = Math.max(0.55, width / Math.max(1, height));
  const fovBoost = safeAspect < 1.25 ? (safeAspect < 0.85 ? 6 : 4) : 0;
  // Base waypoints target ~1.6:1 framing; scale distance outward on square/portrait viewports so bumpers stay clear
  const horizScale = safeAspect < 1.6 ? Math.min(2.15, 1.56 / safeAspect) : 1.0;
  const topDownScale = safeAspect < 1.15 ? Math.min(1.5, 1.18 / safeAspect) : 1.0;
  return { fovBoost, horizScale, topDownScale };
}

export default function ShowcaseRigAndLoop({
  isInView,
  isModelReady,
  prefersReducedMotion,
  isMobile,
  theme,
}: ShowcaseRigAndLoopProps) {
  const { camera, size } = useThree();

  const animStateRef = useRef({
    stage: 0, // 0 = initial top-down, 1..5 = active spline stages
    t: 0,
    fov: TOP_DOWN_FOV,
    targetX: TOP_DOWN_TARGET.x,
    targetY: TOP_DOWN_TARGET.y,
    targetZ: TOP_DOWN_TARGET.z,
  });

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const startDelayRef = useRef<number | null>(null);
  const initializedCamRef = useRef(false);

  // Snap camera immediately on first mount to exact starting 90-deg top-down frame
  useEffect(() => {
    if (initializedCamRef.current) return;
    initializedCamRef.current = true;
    const persp = camera as THREE.PerspectiveCamera;
    const { fovBoost, topDownScale } = computeAspectFraming(size.width, size.height);
    persp.up.set(0, 1, 0);
    persp.position.set(
      TOP_DOWN_POS.x,
      TOP_DOWN_POS.y * topDownScale,
      TOP_DOWN_POS.z * topDownScale
    );
    persp.fov = TOP_DOWN_FOV + fovBoost;
    _currentTarget.copy(TOP_DOWN_TARGET);
    persp.lookAt(_currentTarget);
    persp.updateProjectionMatrix();
  }, [camera, size.height, size.width]);

  // Trigger automated showcase only when 100% visible + model ready, after 2000ms top-down hold
  useEffect(() => {
    const clearPending = () => {
      if (startDelayRef.current !== null) {
        window.clearTimeout(startDelayRef.current);
        startDelayRef.current = null;
      }
    };

    const resetToTopDown = () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      animStateRef.current.stage = 0;
      animStateRef.current.t = 0;
      animStateRef.current.fov = TOP_DOWN_FOV;
      animStateRef.current.targetX = TOP_DOWN_TARGET.x;
      animStateRef.current.targetY = TOP_DOWN_TARGET.y;
      animStateRef.current.targetZ = TOP_DOWN_TARGET.z;
    };

    if (!isInView || !isModelReady || prefersReducedMotion) {
      clearPending();
      resetToTopDown();
      return () => {
        clearPending();
        resetToTopDown();
      };
    }

    clearPending();
    resetToTopDown();

    startDelayRef.current = window.setTimeout(() => {
      startDelayRef.current = null;
      const state = animStateRef.current;

      const tl = gsap.timeline({ repeat: -1 });

      // 1. Top-Down -> Hero 3/4 (4.5s, power1.inOut), pause 1.1s
      tl.call(() => {
        state.stage = 1;
        state.t = 0;
      })
        .to(state, {
          t: 1,
          fov: 40,
          targetX: TARGET_HERO_34.x,
          targetY: TARGET_HERO_34.y,
          targetZ: TARGET_HERO_34.z,
          duration: 4.5,
          ease: 'power1.inOut',
        })
        .to({}, { duration: 1.1 })

        // 2. Hero 3/4 -> Front Grille Close-Up (3.8s, sine.inOut), pause 0.9s
        .call(() => {
          state.stage = 2;
          state.t = 0;
        })
        .to(state, {
          t: 1,
          fov: 32,
          targetX: TARGET_GRILLE.x,
          targetY: TARGET_GRILLE.y,
          targetZ: TARGET_GRILLE.z,
          duration: 3.8,
          ease: 'sine.inOut',
        })
        .to({}, { duration: 0.9 })

        // 3. Front Grille -> Side Profile (4.8s, sine.inOut), pause 0.9s
        .call(() => {
          state.stage = 3;
          state.t = 0;
        })
        .to(state, {
          t: 1,
          fov: 35,
          targetX: TARGET_SIDE.x,
          targetY: TARGET_SIDE.y,
          targetZ: TARGET_SIDE.z,
          duration: 4.8,
          ease: 'sine.inOut',
        })
        .to({}, { duration: 0.9 })

        // 4. Side Profile -> Rear 3/4 (4.8s, sine.inOut), pause 0.9s
        .call(() => {
          state.stage = 4;
          state.t = 0;
        })
        .to(state, {
          t: 1,
          fov: 39,
          targetX: TARGET_REAR_34.x,
          targetY: TARGET_REAR_34.y,
          targetZ: TARGET_REAR_34.z,
          duration: 4.8,
          ease: 'sine.inOut',
        })
        .to({}, { duration: 0.9 })

        // 5. Rear 3/4 -> Seamless Top-Down Return (5.8s, power1.inOut), pause 1.6s, repeat
        .call(() => {
          state.stage = 5;
          state.t = 0;
        })
        .to(state, {
          t: 1,
          fov: TOP_DOWN_FOV,
          targetX: TOP_DOWN_TARGET.x,
          targetY: TOP_DOWN_TARGET.y,
          targetZ: TOP_DOWN_TARGET.z,
          duration: 5.8,
          ease: 'power1.inOut',
        })
        .to({}, { duration: 1.6 });

      timelineRef.current = tl;
    }, 2000);

    return () => {
      clearPending();
      resetToTopDown();
    };
  }, [isInView, isModelReady, prefersReducedMotion]);

  useFrame((_rootState, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const persp = camera as THREE.PerspectiveCamera;
    const state = animStateRef.current;

    if (state.stage === 1) {
      SPLINE_STAGE_1.getPointAt(THREE.MathUtils.clamp(state.t, 0, 1), _stagePoint);
    } else if (state.stage === 2) {
      SPLINE_STAGE_2.getPointAt(THREE.MathUtils.clamp(state.t, 0, 1), _stagePoint);
    } else if (state.stage === 3) {
      SPLINE_STAGE_3.getPointAt(THREE.MathUtils.clamp(state.t, 0, 1), _stagePoint);
    } else if (state.stage === 4) {
      SPLINE_STAGE_4.getPointAt(THREE.MathUtils.clamp(state.t, 0, 1), _stagePoint);
    } else if (state.stage === 5) {
      SPLINE_STAGE_5.getPointAt(THREE.MathUtils.clamp(state.t, 0, 1), _stagePoint);
    } else {
      _stagePoint.copy(TOP_DOWN_POS);
    }

    const { fovBoost, horizScale, topDownScale } = computeAspectFraming(size.width, size.height);
    // Smoothly blend vertical vs horizontal framing factor so top-down fills ~55% while side/3-4 clears bumpers
    const heightRatio = THREE.MathUtils.clamp(_stagePoint.y / 9.6, 0, 1);
    const distScale = THREE.MathUtils.lerp(horizScale, topDownScale, heightRatio);

    _desiredPos.set(
      _stagePoint.x * distScale,
      _stagePoint.y * distScale,
      _stagePoint.z * distScale
    );
    _desiredTarget.set(state.targetX, state.targetY, state.targetZ);

    persp.up.set(0, 1, 0);
    persp.position.x = THREE.MathUtils.damp(persp.position.x, _desiredPos.x, 6.5, dt);
    persp.position.y = THREE.MathUtils.damp(persp.position.y, _desiredPos.y, 6.5, dt);
    persp.position.z = THREE.MathUtils.damp(persp.position.z, _desiredPos.z, 6.5, dt);

    _currentTarget.x = THREE.MathUtils.damp(_currentTarget.x, _desiredTarget.x, 6.5, dt);
    _currentTarget.y = THREE.MathUtils.damp(_currentTarget.y, _desiredTarget.y, 6.5, dt);
    _currentTarget.z = THREE.MathUtils.damp(_currentTarget.z, _desiredTarget.z, 6.5, dt);

    const targetFov = state.fov + fovBoost;
    if (Math.abs(persp.fov - targetFov) > 0.005) {
      persp.fov = THREE.MathUtils.damp(persp.fov, targetFov, 6.5, dt);
      persp.updateProjectionMatrix();
    }

    persp.lookAt(_currentTarget);
  });

  return (
    <>
      {/* Three-Point Studio Lighting Rig */}
      <hemisphereLight args={['#eef4ff', '#6c727d', 0.85]} />

      <directionalLight
        color="#fff8ee"
        intensity={2.4}
        position={[8, 12, 9]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
      />

      <directionalLight color="#dcecff" intensity={1.1} position={[-9, 6, -4]} />

      <directionalLight color="#ffffff" intensity={1.75} position={[-4, 7, -10]} />

      {/* Invisible Studio IBL Environment with 7 Softbox Lightformers (Zero Background) */}
      <Environment
        resolution={512}
        frames={1}
        environmentIntensity={theme === 'dark' ? 1.18 : 0.95}
      >
        {/* 1. Overhead longitudinal ribbon */}
        <Lightformer
          form="rect"
          intensity={2.8}
          color="#ffffff"
          position={[0, 7.5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[3.2, 12, 1]}
        />
        {/* 2. Angled highlight strip */}
        <Lightformer
          form="rect"
          intensity={2.1}
          color="#f8fbff"
          position={[3.8, 5.4, 2.6]}
          rotation={[Math.PI / 3, -Math.PI / 5, 0]}
          scale={[2.2, 8.5, 1]}
        />
        {/* 3. Warm right key strip */}
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#fff3df"
          position={[7.2, 2.8, 1.5]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[9, 2.4, 1]}
        />
        {/* 4. Cool left fill strip */}
        <Lightformer
          form="rect"
          intensity={1.7}
          color="#cfe3ff"
          position={[-7.2, 2.6, -1.2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[9, 2.4, 1]}
        />
        {/* 5. Front low kicker strip */}
        <Lightformer
          form="rect"
          intensity={1.55}
          color="#eef5ff"
          position={[0, 1.1, 7.8]}
          rotation={[0, Math.PI, 0]}
          scale={[6.5, 1.4, 1]}
        />
        {/* 6. Rear rim strip */}
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#ffffff"
          position={[0, 2.4, -7.8]}
          rotation={[0, 0, 0]}
          scale={[7, 1.8, 1]}
        />
        {/* 7. Soft neutral ground bounce */}
        <Lightformer
          form="rect"
          intensity={0.55}
          color="#9aa3b2"
          position={[0, -4.2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[12, 12, 1]}
        />
      </Environment>

      {/* Alpha-Blended Grounding Contact Shadow (keyed so it re-bakes once GLB mounts) */}
      <ContactShadows
        key={isModelReady ? 'glb-ready' : 'pending'}
        position={[0, 0.002, 0]}
        opacity={theme === 'dark' ? 0.35 : 0.56}
        scale={9.5}
        blur={2.1}
        far={3.5}
        frames={1}
        resolution={isMobile ? 256 : 512}
      />
    </>
  );
}
