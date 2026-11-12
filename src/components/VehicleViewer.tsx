import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  // Lazy loading state for interior
  const [interiorMounted, setInteriorMounted] = useState<boolean>(!hasExterior || activeTab === 'interior');
  const [interiorLoaded, setInteriorLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (activeTab === 'interior') {
      setInteriorMounted(true);
    }
  }, [activeTab]);

  // When car changes or unmounts, sync tab state
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
  }, [activeView, exterior?.folder, interior?.panoeeUrl, hasExterior]);

  // Dedicated container ref for safe DOM mounting of the Cloudimage 360 element
  const exteriorMountRef = useRef<HTMLDivElement | null>(null);
  const ciInstanceRef = useRef<any>(null);

  // Mount, initialise, re-initialise on car change, and safely destroy on unmount
  useEffect(() => {
    // Constraint: Never run during server-side rendering
    if (typeof window === 'undefined') return;

    // Only initialise exterior viewer if current active tab is exterior
    if (activeTab !== 'exterior') return;

    const mountEl = exteriorMountRef.current;
    if (!mountEl || !exterior) return;

    // STEP 3: Render SAFELY:
    // Build the element with createElement and setAttribute.
    // NEVER use innerHTML, v-html or dangerouslySetInnerHTML with raw snippet string.
    const div = document.createElement('div');
    div.className = exterior.className || 'cloudimage-360';
    div.id = exterior.elementId || `cloudimage-360-${vehicleName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    div.style.width = '100%';
    div.style.height = '100%';

    if (exterior.attributes && Object.keys(exterior.attributes).length > 0) {
      for (const [key, value] of Object.entries(exterior.attributes)) {
        div.setAttribute(key, String(value));
      }
    } else {
      // Structured fallback
      div.setAttribute('data-folder', exterior.folder);
      div.setAttribute('data-filename-x', exterior.filename);
      div.setAttribute('data-amount-x', String(exterior.amount));
      div.setAttribute('data-speed', String(exterior.speed || 100));
      div.setAttribute('data-drag-speed', String(exterior.dragSpeed || 100));
      div.setAttribute('data-draggable', String(exterior.draggable ?? true));
      div.setAttribute('data-swipeable', String(exterior.swipeable ?? true));
      div.setAttribute('data-keys', String(exterior.keys ?? true));
      div.setAttribute('data-autoplay', String(exterior.autoplay ?? true));
      div.setAttribute('data-autoplay-behavior', exterior.autoplayBehavior || 'spin-x');
      div.setAttribute('data-autoplay-reverse', String(exterior.autoplayReverse ?? true));
      div.setAttribute('data-fullscreen', String(exterior.fullscreen ?? true));
      div.setAttribute('data-zoom-max', String(exterior.zoomMax || 5));
      div.setAttribute('data-zoom-controls', String(exterior.zoomControls ?? true));
      div.setAttribute('data-pinch-zoom', String(exterior.pinchZoom ?? true));
    }

    // Set theme class on the element if provided
    if (theme === 'dark') {
      div.classList.add('ci360-theme-dark');
    } else {
      div.classList.remove('ci360-theme-dark');
    }

    // Clear previous children and mount the safely constructed element
    mountEl.innerHTML = '';
    mountEl.appendChild(div);

    let isDisposed = false;

    // Dynamic import to avoid running during server rendering or module evaluation
    import('@cloudimage/360-view')
      .then((mod) => {
        if (isDisposed) return;
        const CI360Class = mod.default || (mod as any).CI360;
        const ci = typeof CI360Class === 'function' ? new CI360Class() : (window as any).CI360;

        if (ci && typeof ci.init === 'function') {
          ciInstanceRef.current = ci.init(div);
        } else if (typeof (window as any).CI360?.init === 'function') {
          ciInstanceRef.current = (window as any).CI360.init(div);
        } else if (typeof (window as any).CI360?.initAll === 'function') {
          (window as any).CI360.initAll();
        }
      })
      .catch((err) => {
        console.warn('[VehicleViewer] Failed to initialize CI360 viewer:', err);
      });

    // Cleanup on unmount or when car changes: destroy instance to prevent duplicate viewers
    return () => {
      isDisposed = true;
      if (ciInstanceRef.current) {
        try {
          if (typeof ciInstanceRef.current.destroy === 'function') {
            ciInstanceRef.current.destroy();
          }
        } catch {
          // Ignore destruction exceptions
        }
        ciInstanceRef.current = null;
      }
      if (typeof (window as any).CI360?.destroy === 'function') {
        try {
          (window as any).CI360.destroy(div.id);
        } catch {
          // Ignore destruction exceptions
        }
      }
      if (mountEl.contains(div)) {
        mountEl.removeChild(div);
      }
    };
  }, [
    activeTab,
    exterior?.folder,
    exterior?.filename,
    exterior?.amount,
    exterior?.elementId,
    vehicleName,
    theme,
  ]);

  return (
    <div
      tabIndex={0}
      className={`relative w-full h-full bg-black select-none overflow-hidden outline-none flex items-center justify-center ${className}`}
      aria-label={`${vehicleName} 360 viewer`}
    >
      {/* 2. EXTERIOR 360 VIEW LAYER */}
      {hasExterior && exterior && activeTab === 'exterior' && (
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
          {/* Reserved aspect-ratio container for Cloudimage 360 View */}
          <div
            ref={exteriorMountRef}
            className="w-full h-full relative flex items-center justify-center"
            style={{ minHeight: '100%', width: '100%' }}
          />
        </div>
      )}

      {/* 3. INTERIOR 360 VIEW LAYER (Panoee Virtual Tour Iframe - Untouched) */}
      {hasInterior && interior && activeTab === 'interior' && interiorMounted && (
        <div className="absolute inset-0 w-full h-full bg-black z-10 pointer-events-auto">
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
