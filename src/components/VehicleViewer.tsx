import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CI360Viewer, CI360ViewerRef, AutoplayBehavior } from '@cloudimage/360-view/react';
import '@cloudimage/360-view/css';
import { Compass, Rotate3d } from 'lucide-react';
import { NormalizedView360 } from '../types/view360';

interface VehicleViewerProps {
  view360: NormalizedView360 | null;
  vehicleName: string;
  theme?: string;
  className?: string;
  activeView?: 'exterior' | 'interior';
  onViewChange?: (view: 'exterior' | 'interior') => void;
  showToggle?: boolean;
  isActive?: boolean;
  onLoadError?: () => void;
}

const VALID_AUTOPLAY_BEHAVIORS: AutoplayBehavior[] = ['spin-x', 'spin-y', 'spin-xy', 'spin-yx'];

export const VehicleViewer: React.FC<VehicleViewerProps> = ({
  view360,
  vehicleName,
  theme = 'light',
  className = '',
  activeView,
  onViewChange,
  showToggle = false,
  isActive = true,
  onLoadError,
}) => {
  // Missing-data rule: if neither view exists or data is invalid, render nothing
  if (!view360 || (!view360.exterior && !view360.interior)) {
    return null;
  }

  const { exterior, interior } = view360;
  const hasInterior = Boolean(interior?.panoeeUrl);

  const [exteriorFailed, setExteriorFailed] = useState(false);
  const hasExterior = Boolean(exterior) && !exteriorFailed;
  const hasBoth = hasExterior && hasInterior;

  const [internalTab, setInternalTab] = useState<'exterior' | 'interior'>(
    activeView || (hasExterior ? 'exterior' : 'interior')
  );
  const activeTab = activeView || internalTab;

  // Lazy loading state for interior (Panoee untouched)
  const [interiorMounted, setInteriorMounted] = useState<boolean>(isActive && (!hasExterior || activeTab === 'interior'));
  const [interiorLoaded, setInteriorLoaded] = useState<boolean>(false);

  // Speed fix: Initialize exterior viewer only when scrolled into view
  const rootContainerRef = useRef<HTMLDivElement | null>(null);
  const [isInViewport, setIsInViewport] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return typeof IntersectionObserver === 'undefined';
  });

  // Track reduced-motion preference so autoplay never runs if user prefers reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const viewerRef = useRef<CI360ViewerRef | null>(null);
  const hasLoadedRef = useRef(false);
  const keysAttachedRef = useRef(false);

  // Reset failure/load state when exterior source changes
  useEffect(() => {
    setExteriorFailed(false);
    hasLoadedRef.current = false;
    keysAttachedRef.current = false;
  }, [exterior?.folder, exterior?.elementId]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || isInViewport) return;
    const el = rootContainerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '150px', threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isInViewport, exterior?.folder]);

  const handleTabSwitch = useCallback((tab: 'exterior' | 'interior') => {
    setInternalTab(tab);
    onViewChange?.(tab);
    if (tab === 'interior') {
      setInteriorMounted(true);
    }
  }, [onViewChange]);

  useEffect(() => {
    if (activeTab === 'interior' && isActive) {
      setInteriorMounted(true);
    }
  }, [activeTab, isActive]);

  const prevPanoeeUrlRef = useRef<string | undefined>(interior?.panoeeUrl);

  useEffect(() => {
    if (prevPanoeeUrlRef.current !== interior?.panoeeUrl) {
      prevPanoeeUrlRef.current = interior?.panoeeUrl;
      setInteriorLoaded(false);
      setInteriorMounted(isActive && (!hasExterior || activeView === 'interior'));
    }

    if (activeView) {
      setInternalTab(activeView);
      if (activeView === 'interior' && isActive) {
        setInteriorMounted(true);
      }
    } else if (hasExterior) {
      setInternalTab('exterior');
    } else {
      setInternalTab('interior');
      if (isActive) {
        setInteriorMounted(true);
      }
    }
  }, [activeView, isActive, exterior?.folder, interior?.panoeeUrl, hasExterior]);

  // Sync active/keyboard state when user switches between 360 view and photos
  useEffect(() => {
    const instance = viewerRef.current?.getViewer() as any;
    if (!instance) return;

    const shouldBeActive = isActive && activeTab === 'exterior' && hasLoadedRef.current;
    if (!shouldBeActive) {
      viewerRef.current?.stop();
      if (keysAttachedRef.current && typeof instance.removeKeyboardEvents === 'function') {
        instance.removeKeyboardEvents();
        keysAttachedRef.current = false;
      }
    } else {
      if (exterior?.keys && !keysAttachedRef.current && typeof instance.addKeyboardEvents === 'function') {
        instance.addKeyboardEvents();
        keysAttachedRef.current = true;
      }
    }
  }, [isActive, activeTab, exterior?.keys]);

  const handleExteriorLoad = useCallback((data: { viewerId: string; imagesX: number; imagesY: number }) => {
    if (data.imagesX <= 0 && data.imagesY <= 0) {
      console.warn(`[VehicleViewer] All exterior 360 frames failed to load for ${vehicleName}. Hiding viewer.`);
      setExteriorFailed(true);
      onLoadError?.();
      return;
    }

    hasLoadedRef.current = true;
    const instance = viewerRef.current?.getViewer() as any;
    if (!instance) return;

    keysAttachedRef.current = Boolean(exterior?.keys);
    if ((!isActive || activeTab !== 'exterior') && keysAttachedRef.current && typeof instance.removeKeyboardEvents === 'function') {
      instance.removeKeyboardEvents();
      keysAttachedRef.current = false;
    }

    // Ensure built-in controls (zoom & fullscreen) are visible after load
    if (typeof instance.showAllIcons === 'function') {
      instance.showAllIcons();
    }

    // Autoplay strictly after onLoad and never with prefers-reduced-motion
    if (exterior?.autoplay && !prefersReducedMotion && isActive && activeTab === 'exterior') {
      instance.autoplay = true;
      viewerRef.current?.play();
    }
  }, [vehicleName, onLoadError, exterior?.autoplay, exterior?.keys, prefersReducedMotion, isActive, activeTab]);

  const handleExteriorError = useCallback((errData: { errorCount: number; totalImages: number; error?: { message: string; url?: string } }) => {
    if (errData.totalImages > 0 && errData.errorCount >= errData.totalImages) {
      console.warn(
        `[VehicleViewer] Failed to load exterior 360 frames (${errData.errorCount}/${errData.totalImages}) for ${vehicleName}:`,
        errData.error?.message || 'Network or CORS error'
      );
      setExteriorFailed(true);
      onLoadError?.();
    }
  }, [vehicleName, onLoadError]);

  if (!hasExterior && !hasInterior) {
    return null;
  }

  const safeAutoplayBehavior: AutoplayBehavior = VALID_AUTOPLAY_BEHAVIORS.includes(
    exterior?.autoplayBehavior as AutoplayBehavior
  )
    ? (exterior?.autoplayBehavior as AutoplayBehavior)
    : 'spin-x';

  const viewerClassName = [
    exterior?.className || 'cloudimage-360',
    'w-full h-full',
    theme === 'dark' ? 'ci360-theme-dark' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={rootContainerRef}
      tabIndex={0}
      className={`relative w-full h-full bg-black select-none overflow-hidden outline-none flex items-center justify-center ${className}`}
      aria-label={`${vehicleName} 360 viewer`}
    >
      {/* 2. EXTERIOR 360 VIEW LAYER */}
      {hasExterior && exterior && activeTab === 'exterior' && (
        <div
          className={`absolute inset-0 w-full h-full flex items-center justify-center ${
            isActive ? 'z-10 pointer-events-auto visible' : 'z-0 pointer-events-none invisible'
          }`}
        >
          {typeof window !== 'undefined' && isInViewport && (
            <CI360Viewer
              key={`${exterior.elementId || vehicleName}-${exterior.folder}-${exterior.amount}`}
              ref={viewerRef}
              id={exterior.elementId || `ext360-${vehicleName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              className={viewerClassName}
              style={{ width: '100%', height: '100%' }}
              folder={exterior.folder}
              filenameX={exterior.filename}
              amountX={exterior.amount}
              speed={exterior.speed ?? 100}
              draggable={exterior.draggable ?? true}
              swipeable={exterior.swipeable ?? true}
              dragSpeed={exterior.dragSpeed ?? 100}
              keys={exterior.keys ?? true}
              autoplay={false}
              autoplayBehavior={safeAutoplayBehavior}
              autoplayReverse={exterior.autoplayReverse ?? false}
              fullscreen={exterior.fullscreen ?? true}
              zoomMax={exterior.zoomMax ?? 5}
              zoomControls={exterior.zoomControls ?? true}
              zoomControlsPosition="bottom-left"
              pinchZoom={exterior.pinchZoom ?? true}
              lazyload={false}
              aspectRatio="16/10"
              theme={theme === 'dark' ? 'dark' : 'light'}
              onLoad={handleExteriorLoad}
              onError={handleExteriorError}
            />
          )}
        </div>
      )}

      {/* 3. INTERIOR 360 VIEW LAYER (Panoee Virtual Tour Iframe - Untouched) */}
      {hasInterior && interior && activeTab === 'interior' && interiorMounted && (
        <div
          className={`absolute inset-0 w-full h-full bg-black ${
            isActive ? 'z-10 pointer-events-auto visible' : 'z-0 pointer-events-none invisible'
          }`}
        >
          {!interiorLoaded && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 text-white">
              <div className="w-9 h-9 rounded-full border-2 border-white/20 border-t-[#2B59FF] animate-spin mb-2.5" />
              <span className="text-xs font-mono text-zinc-300">Loading 360° Interior Virtual Tour...</span>
            </div>
          )}
          <iframe
            src={interior.panoeeUrl}
            title={`${vehicleName} 360 Interior Panorama Tour`}
            loading="lazy"
            allowFullScreen
            allow="fullscreen; accelerometer; gyroscope; magnetometer; xr-spatial-tracking"
            onLoad={() => setInteriorLoaded(true)}
            className="w-full h-full border-0"
            style={{ touchAction: 'pan-y', pointerEvents: isActive ? 'auto' : 'none' }}
          />
        </div>
      )}

      {/* 4. EXTERIOR / INTERIOR TOGGLE (Only rendered if showToggle is true) */}
      {showToggle && hasBoth && (
        <div className="absolute top-4 right-4 z-30 flex items-center p-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 shadow-lg text-white">
          <div role="tablist" aria-label="360 view modes" className="flex items-center gap-1">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'exterior'}
              onClick={() => handleTabSwitch('exterior')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'exterior'
                  ? 'bg-[#2B59FF] text-white shadow-md'
                  : 'hover:bg-white/10 text-white/80'
              }`}
            >
              <Rotate3d size={14} />
              <span>Exterior</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'interior'}
              onClick={() => handleTabSwitch('interior')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'interior'
                  ? 'bg-[#2B59FF] text-white shadow-md'
                  : 'hover:bg-white/10 text-white/80'
              }`}
            >
              <Compass size={14} />
              <span>Interior</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleViewer;
