import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import AutoFitCar from './AutoFitCar';
import CarErrorBoundary from './CarErrorBoundary';
import ProceduralCar from './ProceduralCar';
import ShowcaseRigAndLoop from './ShowcaseRigAndLoop';
import {
  isSoftwareWebGL,
  isWebGLAvailable,
  resolveResilientGlbUrl,
} from './glbLoader';

interface LexusLX700hShowcaseProps {
  theme: string;
}

export default function LexusLX700hShowcase({ theme }: LexusLX700hShowcaseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);

  const [webglAvailable] = useState<boolean>(() => isWebGLAvailable());
  const [degraded, setDegraded] = useState<boolean>(() => isSoftwareWebGL());
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  const [isInView, setIsInView] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [resolvedGlbUrl, setResolvedGlbUrl] = useState<string | null | undefined>(undefined);
  const [useProceduralFallback, setUseProceduralFallback] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024;

  const dprRange = useMemo<[number, number]>(() => {
    if (degraded) return [1, 1.25];
    if (isMobile) return [1, 1.75];
    if (isTablet) return [1, 1.85];
    return [1, 2];
  }, [degraded, isMobile, isTablet]);

  // Track viewport width & reduced motion preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });

    const mq =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq?.addEventListener?.('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      mq?.removeEventListener?.('change', handleMotionChange);
    };
  }, []);

  // Resilient preflight/retry probe for local GLB -> GitHub raw mirror -> silent ProceduralCar
  useEffect(() => {
    if (!webglAvailable) return;
    let cancelled = false;

    void resolveResilientGlbUrl().then((url) => {
      if (cancelled) return;
      if (url) {
        setResolvedGlbUrl(url);
      } else {
        setResolvedGlbUrl(null);
        setUseProceduralFallback(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [webglAvailable]);

  // Observe full container visibility cleanly across desktop, tablet, and compact mobile viewports
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      observer?.disconnect();
      const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;
      const elHeight = el.offsetHeight || 1;
      const requiredRatio =
        elHeight > viewportH * 0.92
          ? Math.max(0.65, Math.min(0.96, (viewportH * 0.88) / elHeight))
          : 0.98;

      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          setIsInView(entry.isIntersecting && entry.intersectionRatio >= requiredRatio);
        },
        {
          threshold: [0, 0.5, 0.65, 0.8, 0.9, 0.98, 1.0],
        }
      );
      observer.observe(el);
    };

    setupObserver();
    window.addEventListener('resize', setupObserver, { passive: true });

    return () => {
      window.removeEventListener('resize', setupObserver);
      observer?.disconnect();
    };
  }, []);

  // Clean up WebGL context listeners on unmount
  useEffect(() => {
    return () => {
      const canvas = canvasElRef.current;
      if (!canvas) return;
      canvas.removeEventListener('webglcontextlost', handleContextLostRef.current);
      canvas.removeEventListener('webglcontextrestored', handleContextRestoredRef.current);
    };
  }, []);

  const handleContextLostRef = useRef((event: Event) => {
    event.preventDefault();
    setContextLost(true);
  });

  const handleContextRestoredRef = useRef(() => {
    setContextLost(false);
  });

  const handleModelReady = useCallback(() => {
    setIsModelReady(true);
  }, []);

  const handleGlbFailure = useCallback(() => {
    setUseProceduralFallback(true);
  }, []);

  if (!webglAvailable) {
    return (
      <div
        ref={containerRef}
        className="relative z-0 w-full aspect-square flex items-center justify-center pointer-events-none select-none touch-auto"
      >
        <img
          src="/cars/Silver%20Supercar%20with%20Open%20Scissor%20Doors.png"
          alt="Silver Supercar with Open Scissor Doors"
          className={`w-full object-contain drop-shadow-2xl transition-opacity duration-200 ${
            theme === 'dark' ? 'hidden' : 'block'
          }`}
          loading="lazy"
          decoding="async"
        />
        <img
          src="https://hercules-cdn.com/file_siaP29l0QmGIt1LzZaBx46SG"
          alt="Silver supercar top view"
          className={`w-full object-contain drop-shadow-2xl transition-opacity duration-200 ${
            theme === 'dark' ? 'block' : 'hidden'
          }`}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative z-0 w-full aspect-square flex items-center justify-center pointer-events-none select-none touch-auto"
      style={{ background: 'transparent', touchAction: 'auto' }}
    >
      <Canvas
        shadows
        dpr={dprRange}
        frameloop={contextLost ? 'never' : 'always'}
        camera={{ position: [0, 9.6, 0.002], fov: 38, near: 0.1, far: 120 }}
        gl={{
          alpha: true,
          antialias: !degraded,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          const dom = gl.domElement;
          if (canvasElRef.current && canvasElRef.current !== dom) {
            canvasElRef.current.removeEventListener('webglcontextlost', handleContextLostRef.current);
            canvasElRef.current.removeEventListener(
              'webglcontextrestored',
              handleContextRestoredRef.current
            );
          }
          canvasElRef.current = dom;
          dom.addEventListener('webglcontextlost', handleContextLostRef.current, false);
          dom.addEventListener('webglcontextrestored', handleContextRestoredRef.current, false);
        }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          pointerEvents: 'none',
          touchAction: 'auto',
        }}
      >
        <PerformanceMonitor
          bounds={() => [40, 60]}
          onDecline={() => setDegraded(true)}
          onIncline={() => setDegraded(false)}
        />
        <AdaptiveDpr pixelated />

        <ShowcaseRigAndLoop
          isInView={isInView}
          isModelReady={isModelReady}
          prefersReducedMotion={prefersReducedMotion}
          isMobile={isMobile}
          theme={theme}
        />

        {useProceduralFallback || resolvedGlbUrl === null ? (
          <ProceduralCar onReady={handleModelReady} />
        ) : resolvedGlbUrl ? (
          <CarErrorBoundary
            onError={handleGlbFailure}
            fallback={<ProceduralCar onReady={handleModelReady} />}
          >
            <Suspense fallback={<ProceduralCar />}>
              <AutoFitCar url={resolvedGlbUrl} onReady={handleModelReady} />
            </Suspense>
          </CarErrorBoundary>
        ) : (
          <ProceduralCar />
        )}
      </Canvas>
    </div>
  );
}
