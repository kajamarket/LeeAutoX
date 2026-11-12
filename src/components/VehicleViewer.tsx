import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CI360Viewer, CI360ViewerRef } from '@cloudimage/360-view/react';
import '@cloudimage/360-view/css';
import { 
  Play, 
  Pause, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Rotate3d,
  Sparkles
} from 'lucide-react';
import { NormalizedView360 } from '../types/view360';
import Icon360 from './Icon360';

interface VehicleViewerProps {
  view360: NormalizedView360 | null;
  vehicleName: string;
  theme?: string;
  className?: string;
  activeView?: 'exterior' | 'interior';
  onViewChange?: (view: 'exterior' | 'interior') => void;
  showToggle?: boolean;
}

export const VehicleViewer: React.FC<VehicleViewerProps> = ({
  view360,
  vehicleName,
  theme = 'light',
  className = '',
  activeView,
  onViewChange,
  showToggle = false,
}) => {
  // 1. Missing-data rule: If neither view exists or data is invalid, render nothing!
  if (!view360 || (!view360.exterior && !view360.interior)) {
    return null;
  }

  const { exterior, interior } = view360;
  const hasExterior = Boolean(exterior);
  const hasInterior = Boolean(interior?.panoeeUrl);
  const hasBoth = hasExterior && hasInterior;

  // Active view tab: controlled by activeView prop if provided, else internal state
  const [internalTab, setInternalTab] = useState<'exterior' | 'interior'>(
    activeView || (hasExterior ? 'exterior' : 'interior')
  );

  const activeTab = activeView || internalTab;

  const handleTabSwitch = useCallback((tab: 'exterior' | 'interior') => {
    setInternalTab(tab);
    onViewChange?.(tab);
    if (tab === 'interior') {
      setInteriorMounted(true);
    }
  }, [onViewChange]);

  // Lazy loading state for interior:
  // If only interior exists, or if current tab is interior, mount immediately.
  const [interiorMounted, setInteriorMounted] = useState<boolean>(!hasExterior || activeTab === 'interior');
  const [interiorLoaded, setInteriorLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (activeTab === 'interior') {
      setInteriorMounted(true);
    }
  }, [activeTab]);

  // Exterior viewer states
  const [isExteriorLoading, setIsExteriorLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showDragHint, setShowDragHint] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<CI360ViewerRef | null>(null);

  // Check prefers-reduced-motion to safely disable autoplay
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // When car changes or unmounts, reset view state
  useEffect(() => {
    if (activeView) {
      setInternalTab(activeView);
    } else if (hasExterior) {
      setInternalTab('exterior');
      setInteriorMounted(false);
      setInteriorLoaded(false);
    } else {
      setInternalTab('interior');
      setInteriorMounted(true);
    }
    setIsPlaying(false);
    setShowDragHint(true);
  }, [activeView, exterior?.folder, interior?.panoeeUrl, hasExterior]);

  // Auto-hide drag hint after 3.5s
  useEffect(() => {
    if (showDragHint && activeTab === 'exterior') {
      const timer = setTimeout(() => {
        setShowDragHint(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showDragHint, activeTab]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isDocFs = Boolean(document.fullscreenElement);
      setIsFullscreen(isDocFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Toolbar Actions wired to official CI360ViewerRef methods
  const togglePlay = useCallback(() => {
    if (!viewerRef.current) return;
    if (isPlaying) {
      viewerRef.current.stop();
      setIsPlaying(false);
    } else {
      viewerRef.current.play();
      setIsPlaying(true);
      setShowDragHint(false);
    }
  }, [isPlaying]);

  const handleZoomIn = useCallback(() => {
    viewerRef.current?.zoomIn();
    setShowDragHint(false);
  }, []);

  const handleZoomOut = useCallback(() => {
    viewerRef.current?.zoomOut();
  }, []);

  const handleReset = useCallback(() => {
    viewerRef.current?.resetZoom();
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('[VehicleViewer] Fullscreen toggle failed:', err);
    }
  }, []);

  // Keyboard navigation within the viewer
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (activeTab === 'exterior' && viewerRef.current) {
      if (e.key === 'ArrowLeft') {
        viewerRef.current.moveLeft(1);
        setShowDragHint(false);
      } else if (e.key === 'ArrowRight') {
        viewerRef.current.moveRight(1);
        setShowDragHint(false);
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        togglePlay();
      }
    }
  }, [activeTab, togglePlay]);

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={`relative w-full h-full bg-black select-none overflow-hidden outline-none flex items-center justify-center ${className}`}
      aria-label={`${vehicleName} 360 viewer`}
    >
      {/* 2. EXTERIOR 360 VIEW LAYER */}
      {hasExterior && exterior && (
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
            activeTab === 'exterior' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Loading state indicator */}
          {isExteriorLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm text-white">
              <div className="w-9 h-9 rounded-full border-2 border-white/20 border-t-[#2B59FF] animate-spin mb-2.5" />
              <span className="text-xs font-mono text-zinc-300">Loading 360° Exterior Spin...</span>
            </div>
          )}

          {/* Cloudimage 360 Sequence Viewer */}
          <div className="w-full h-full flex items-center justify-center">
            <CI360Viewer
              ref={viewerRef}
              folder={exterior.folder}
              filenameX={exterior.filename}
              amountX={exterior.amount}
              autoplay={prefersReducedMotion ? false : exterior.autoplay}
              speed={exterior.speed}
              dragSpeed={exterior.dragSpeed}
              zoomMax={exterior.zoomMax}
              zoomControls={false}
              fullscreen={false}
              hints={false}
              lazyload={false}
              theme={theme === 'dark' ? 'dark' : 'light'}
              onLoad={() => {
                setIsExteriorLoading(false);
              }}
              onSpin={() => {
                setShowDragHint(false);
              }}
              onAutoplayStop={() => {
                setIsPlaying(false);
              }}
              onError={(err) => {
                console.warn('[VehicleViewer] Exterior frame error:', err);
                setIsExteriorLoading(false);
              }}
              className="w-full h-full"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Drag to rotate hint */}
          {showDragHint && !isExteriorLoading && (
            <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-2 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-mono flex items-center gap-2 border border-white/20 shadow-lg animate-pulse whitespace-nowrap">
              <Compass size={14} className="text-[#2B59FF]" />
              <span>Drag to rotate 360° • Pinch / double-click to zoom</span>
            </div>
          )}

          {/* Custom Copart-style Toolbar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 shadow-xl text-white">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause Auto-Spin' : 'Play Auto-Spin'}
              title={isPlaying ? 'Pause auto-spin (Space)' : 'Play auto-spin (Space)'}
              className="p-2 rounded-full hover:bg-white/15 active:scale-95 transition-all text-white cursor-pointer"
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
            </button>

            <div className="w-px h-4 bg-white/20" />

            <button
              type="button"
              onClick={handleZoomIn}
              aria-label="Zoom in"
              title="Zoom in (Double click image or pinch)"
              className="p-2 rounded-full hover:bg-white/15 active:scale-95 transition-all text-white cursor-pointer"
            >
              <ZoomIn size={15} />
            </button>

            <button
              type="button"
              onClick={handleZoomOut}
              aria-label="Zoom out"
              title="Zoom out"
              className="p-2 rounded-full hover:bg-white/15 active:scale-95 transition-all text-white cursor-pointer"
            >
              <ZoomOut size={15} />
            </button>

            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset zoom and spin"
              title="Reset view"
              className="p-2 rounded-full hover:bg-white/15 active:scale-95 transition-all text-white cursor-pointer"
            >
              <RotateCcw size={15} />
            </button>

            <div className="w-px h-4 bg-white/20" />

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              className="p-2 rounded-full hover:bg-white/15 active:scale-95 transition-all text-white cursor-pointer"
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </div>
      )}

      {/* 3. INTERIOR 360 VIEW LAYER (Panoee Virtual Tour Iframe) */}
      {hasInterior && interior && interiorMounted && (
        <div
          className={`absolute inset-0 w-full h-full bg-black transition-opacity duration-300 ${
            activeTab === 'interior' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
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
            style={{ touchAction: 'pan-y' }}
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
