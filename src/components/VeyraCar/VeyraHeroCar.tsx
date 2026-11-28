import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { ArrowLeft, ArrowUpRight, Plus, X } from 'lucide-react';
import AppearanceMenu from './AppearanceMenu';
import HoverVideo, { type HoverPhase } from './HoverVideo';
import {
  appearanceOptions,
  baseExterior,
  canUseHotspot,
  type AppearanceMode,
} from './appearance';
import { SYSTEMS, SYSTEM_IDS, type SystemId } from './systems';
import './veyra.css';

const ROOT_IMAGE = '/media/exterior-polished.png';

interface AppearanceHotspotConfig {
  id: AppearanceMode;
  label: string;
  anchor: { x: number; y: number };
}

const APPEARANCE_HOTSPOTS: AppearanceHotspotConfig[] = [
  { id: 'paint', label: 'Body colour', anchor: { x: 55, y: 51 } },
  { id: 'wheels', label: 'Wheel design', anchor: { x: 48, y: 71 } },
];

type ReelStep =
  | { kind: 'rest'; duration: number }
  | { kind: 'paint'; optionId: string; duration: number }
  | { kind: 'wheels'; optionId: string; duration: number }
  | { kind: 'close-appearance'; duration: number }
  | { kind: 'system-hover'; system: SystemId; duration: number }
  | { kind: 'system-detail'; system: SystemId; duration: number }
  | { kind: 'system-return'; system: SystemId; duration: number };

const REEL_SEQUENCE: ReelStep[] = [
  { kind: 'rest', duration: 2400 },
  // Tour Paint finishes smoothly (>=950ms crossfade, unhurried pace)
  { kind: 'paint', optionId: 'electric', duration: 2200 },
  { kind: 'paint', optionId: 'lime', duration: 1900 },
  { kind: 'paint', optionId: 'sky', duration: 1900 },
  { kind: 'paint', optionId: 'graphite', duration: 2100 },
  { kind: 'close-appearance', duration: 1500 },
  // Tour Wheel designs smoothly
  { kind: 'wheels', optionId: 'aero', duration: 2600 },
  { kind: 'wheels', optionId: 'forged', duration: 2600 },
  { kind: 'close-appearance', duration: 1500 },
  // Tour Electric Drive: hood hover video -> cutaway zoom/crossfade -> return
  { kind: 'system-hover', system: 'drive', duration: 1800 },
  { kind: 'system-detail', system: 'drive', duration: 5400 },
  { kind: 'system-return', system: 'drive', duration: 2000 },
  // Tour Battery: battery hover video -> cutaway zoom/crossfade -> return
  { kind: 'system-hover', system: 'battery', duration: 1800 },
  { kind: 'system-detail', system: 'battery', duration: 5400 },
  { kind: 'system-return', system: 'battery', duration: 2000 },
];

const ALL_PRELOAD_IMAGES = Array.from(
  new Set([
    ...appearanceOptions.paint.map((o) => o.image),
    ...appearanceOptions.wheels.map((o) => o.image),
    SYSTEMS.drive.image,
    SYSTEMS.battery.image,
  ])
).filter((src) => src !== baseExterior);

const IDLE_RESUME_MS = 5000;

export default function VeyraHeroCar() {
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible'
  );

  // State machine: overview -> entering -> detail -> returning -> overview
  const [phase, setPhase] = useState<HoverPhase>('overview');
  const [selectedSystem, setSelectedSystem] = useState<SystemId>('drive');
  const [detailVisible, setDetailVisible] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);

  // Hover & keyboard preview state for Drive / Battery
  const [hoveredSystem, setHoveredSystem] = useState<SystemId | null>(null);
  const [neutral, setNeutral] = useState(true);
  const [videoFallback, setVideoFallback] = useState(false);

  // Paint & Wheels appearance state
  const [appearance, setAppearance] = useState<AppearanceMode | null>(null);
  const [appearancePinned, setAppearancePinned] = useState(false);
  const [appearanceClosing, setAppearanceClosing] = useState(false);
  const [optionId, setOptionId] = useState('silver');
  const [appearanceImage, setAppearanceImage] = useState(baseExterior);
  const [previousImage, setPreviousImage] = useState(baseExterior);
  const [swapTick, setSwapTick] = useState(0);
  const [loadedOptions, setLoadedOptions] = useState<Set<string>>(() => new Set([baseExterior]));
  const [failedOptions, setFailedOptions] = useState<Set<string>>(() => new Set());

  // User interaction & autoplay state
  const [userInteracting, setUserInteracting] = useState(false);
  const [autoplayVisualSystem, setAutoplayVisualSystem] = useState<SystemId | null>(null);
  const [autoplayHighlightHotspot, setAutoplayHighlightHotspot] = useState<
    AppearanceMode | SystemId | null
  >(null);

  const scopeRef = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef<HoverPhase>(phase);
  const phaseLockRef = useRef(false);
  const transitionTokenRef = useRef(0);
  const selectedSystemRef = useRef<SystemId>(selectedSystem);
  const neutralRef = useRef(neutral);
  const appearanceRef = useRef<AppearanceMode | null>(appearance);
  const appearancePinnedRef = useRef(appearancePinned);
  const appearanceClosingRef = useRef(appearanceClosing);
  const appearanceImageRef = useRef(appearanceImage);
  const autoplayOwnedAppearanceRef = useRef(false);
  const loadedOptionsRef = useRef<Set<string>>(loadedOptions);
  const failedOptionsRef = useRef<Set<string>>(failedOptions);
  const optionLoadsRef = useRef<Set<string>>(new Set());

  const revealTimerRef = useRef<number | undefined>(undefined);
  const phaseTimerRef = useRef<number | undefined>(undefined);
  const appearanceTimerRef = useRef<number | undefined>(undefined);
  const leaveTimerRef = useRef<number | undefined>(undefined);
  const reelTimerRef = useRef<number | undefined>(undefined);
  const idleTimerRef = useRef<number | undefined>(undefined);

  const reelIndexRef = useRef(0);
  const pointerInsideScopeRef = useRef(false);
  const focusInsideScopeRef = useRef(false);
  const lastTouchActionRef = useRef(0);
  const suppressFocusRef = useRef(false);

  const appearanceButtonsRef = useRef<Partial<Record<AppearanceMode, HTMLButtonElement | null>>>({});
  const systemButtonsRef = useRef<Partial<Record<SystemId, HTMLButtonElement | null>>>({});
  const backButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    selectedSystemRef.current = selectedSystem;
  }, [selectedSystem]);

  useEffect(() => {
    neutralRef.current = neutral;
  }, [neutral]);

  useEffect(() => {
    appearanceRef.current = appearance;
  }, [appearance]);

  useEffect(() => {
    appearancePinnedRef.current = appearancePinned;
  }, [appearancePinned]);

  useEffect(() => {
    appearanceClosingRef.current = appearanceClosing;
  }, [appearanceClosing]);

  useEffect(() => {
    appearanceImageRef.current = appearanceImage;
  }, [appearanceImage]);

  useEffect(() => {
    loadedOptionsRef.current = loadedOptions;
  }, [loadedOptions]);

  useEffect(() => {
    failedOptionsRef.current = failedOptions;
  }, [failedOptions]);

  const clearAllTimers = useCallback(() => {
    window.clearTimeout(revealTimerRef.current);
    window.clearTimeout(phaseTimerRef.current);
    window.clearTimeout(appearanceTimerRef.current);
    window.clearTimeout(leaveTimerRef.current);
    window.clearTimeout(reelTimerRef.current);
    window.clearTimeout(idleTimerRef.current);
  }, []);

  // Reduced motion preference & unmount cleanup
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => {
      media.removeEventListener('change', update);
      clearAllTimers();
      transitionTokenRef.current += 1;
    };
  }, [clearAllTimers]);

  // Tab visibility listener
  useEffect(() => {
    const onVisibility = () => {
      setIsPageVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Viewport IntersectionObserver
  useEffect(() => {
    const node = scopeRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) setIsInView(entries[0].isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Preload initial studio car
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      const done = () => {
        if (!cancelled) setReady(true);
      };
      if (typeof img.decode === 'function') {
        img.decode().then(done).catch(done);
      } else {
        done();
      }
    };
    img.onerror = (err) => {
      console.error('[VeyraHeroCar] Base exterior image failed to load:', err);
      if (!cancelled) setReady(true);
    };
    img.src = ROOT_IMAGE;
    return () => {
      cancelled = true;
    };
  }, []);

  // Background-preload Paint, Wheels, and Drive/Battery cutaway stills once ready
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const pending = ALL_PRELOAD_IMAGES.filter((src) => !optionLoadsRef.current.has(src));

    pending.forEach((src) => {
      optionLoadsRef.current.add(src);
      const image = new Image();
      image.onload = () => {
        const markLoaded = () => {
          if (cancelled) return;
          setLoadedOptions((prev) => {
            const next = new Set(prev).add(src);
            loadedOptionsRef.current = next;
            return next;
          });
          setFailedOptions((prev) => {
            const next = new Set(prev);
            next.delete(src);
            failedOptionsRef.current = next;
            return next;
          });
        };
        if (typeof image.decode === 'function') {
          image
            .decode()
            .then(markLoaded)
            .catch((err) => {
              console.error(`[VeyraHeroCar] Failed to decode ${src}:`, err);
              if (!cancelled) {
                setFailedOptions((prev) => {
                  const next = new Set(prev).add(src);
                  failedOptionsRef.current = next;
                  return next;
                });
              }
            });
        } else {
          markLoaded();
        }
      };
      image.onerror = (err) => {
        console.error(`[VeyraHeroCar] Failed to load ${src}:`, err);
        if (!cancelled) {
          setFailedOptions((prev) => {
            const next = new Set(prev).add(src);
            failedOptionsRef.current = next;
            return next;
          });
        }
      };
      image.src = src;
    });

    return () => {
      cancelled = true;
      pending.forEach((src) => optionLoadsRef.current.delete(src));
    };
  }, [ready]);

  const setActiveImageSmooth = useCallback((nextSrc: string) => {
    const currentSrc = appearanceImageRef.current;
    if (currentSrc === nextSrc) return;
    setPreviousImage(currentSrc);
    setAppearanceImage(nextSrc);
    setSwapTick((tick) => tick + 1);
  }, []);

  const scheduleIdleResume = useCallback(() => {
    window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      const hasKeyboardFocus = Boolean(scopeRef.current?.querySelector(':focus-visible'));
      // Never resume while pointer/keyboard focus is inside, in detail, or with a user-opened menu
      if (
        pointerInsideScopeRef.current ||
        hasKeyboardFocus ||
        phaseRef.current !== 'overview' ||
        appearancePinnedRef.current ||
        (appearanceRef.current !== null && !autoplayOwnedAppearanceRef.current) ||
        appearanceClosingRef.current
      ) {
        return;
      }
      if (appearanceRef.current && autoplayOwnedAppearanceRef.current) {
        closeAppearanceState(false);
      }
      focusInsideScopeRef.current = false;
      setHoveredSystem(null);
      setActiveAnnotation(null);
      setUserInteracting(false);
    }, IDLE_RESUME_MS);
  }, []);

  const engageUserControl = useCallback(
    (scheduleIdleAfter = false) => {
      window.clearTimeout(reelTimerRef.current);
      window.clearTimeout(idleTimerRef.current);
      setAutoplayVisualSystem(null);
      setAutoplayHighlightHotspot(null);
      setUserInteracting(true);
      if (scheduleIdleAfter) {
        scheduleIdleResume();
      }
    },
    [scheduleIdleResume]
  );

  // Open Paint or Wheels (blocks & disables Drive/Battery)
  const openAppearanceState = useCallback(
    (mode: AppearanceMode, options?: { fromAutoplay?: boolean; forceSwitch?: boolean }) => {
      const fromAutoplay = options?.fromAutoplay ?? false;
      const forceSwitch = options?.forceSwitch ?? false;

      if (phaseRef.current !== 'overview' || phaseLockRef.current) return;
      if (!forceSwitch && !canUseHotspot(appearanceRef.current, mode, appearanceClosingRef.current)) {
        return;
      }

      window.clearTimeout(leaveTimerRef.current);
      window.clearTimeout(appearanceTimerRef.current);
      setAppearanceClosing(false);
      setHoveredSystem(null);
      setAutoplayVisualSystem(null);
      autoplayOwnedAppearanceRef.current = fromAutoplay;

      if (appearanceRef.current === mode && !appearanceClosingRef.current) return;

      const defaultOption = appearanceOptions[mode][0];
      setAppearance(mode);
      setOptionId(defaultOption.id);
      setPreviousImage(baseExterior);
      setAppearanceImage(baseExterior);
      setSwapTick(0);
    },
    []
  );

  const closeAppearanceState = useCallback(
    (restoreFocus = false) => {
      const currentMode = appearanceRef.current;
      if (!currentMode || appearanceClosingRef.current) return;

      window.clearTimeout(leaveTimerRef.current);
      window.clearTimeout(appearanceTimerRef.current);
      setAppearanceClosing(true);
      setHoveredSystem(null);
      autoplayOwnedAppearanceRef.current = false;

      appearanceTimerRef.current = window.setTimeout(
        () => {
          setAppearance(null);
          setAppearancePinned(false);
          setAppearanceClosing(false);
          setPreviousImage(baseExterior);
          setAppearanceImage(baseExterior);
          setSwapTick(0);

          if (restoreFocus) {
            suppressFocusRef.current = true;
            appearanceButtonsRef.current[currentMode]?.focus({ preventScroll: true });
            suppressFocusRef.current = false;
          }
          if (!pointerInsideScopeRef.current && !focusInsideScopeRef.current) {
            scheduleIdleResume();
          }
        },
        reduced ? 0 : 260
      );
    },
    [reduced, scheduleIdleResume]
  );

  const selectAppearanceOption = useCallback(
    (mode: AppearanceMode, id: string, pinByUser: boolean) => {
      const option = appearanceOptions[mode].find((item) => item.id === id);
      if (!option || !loadedOptionsRef.current.has(option.image)) return;

      if (pinByUser) {
        if (!neutralRef.current) return;
        autoplayOwnedAppearanceRef.current = false;
        setAppearancePinned(true);
      }
      setOptionId(id);
      setActiveImageSmooth(option.image);
    },
    [setActiveImageSmooth]
  );

  // State machine transition: overview -> entering -> detail -> returning -> overview
  const transitionSystem = useCallback(
    (id: SystemId, returning = false, fromAutoplay = false) => {
      if (appearanceRef.current || appearanceClosingRef.current) return;
      if (phaseLockRef.current || !ready) return;
      if (!returning && phaseRef.current !== 'overview') return;
      if (returning && phaseRef.current !== 'detail') return;

      phaseLockRef.current = true;
      const token = ++transitionTokenRef.current;

      setSelectedSystem(id);
      setHoveredSystem(null);
      setAutoplayVisualSystem(null);
      setActiveAnnotation(null);
      setPhase(returning ? 'returning' : 'entering');

      const revealDelay = reduced ? 0 : 350;
      const settleDelay = reduced ? 0 : 1350;

      window.clearTimeout(revealTimerRef.current);
      window.clearTimeout(phaseTimerRef.current);

      revealTimerRef.current = window.setTimeout(() => {
        if (transitionTokenRef.current !== token) return;
        setDetailVisible(!returning);
      }, revealDelay);

      phaseTimerRef.current = window.setTimeout(() => {
        if (transitionTokenRef.current !== token) return;
        phaseLockRef.current = false;
        setPhase(returning ? 'overview' : 'detail');
        setDetailVisible(!returning);

        if (!fromAutoplay) {
          window.setTimeout(() => {
            if (transitionTokenRef.current !== token) return;
            if (returning) {
              const isRecentTouch = Date.now() - lastTouchActionRef.current < 1500;
              if (!isRecentTouch) {
                suppressFocusRef.current = true;
                systemButtonsRef.current[id]?.focus({ preventScroll: true });
                suppressFocusRef.current = false;
              } else {
                focusInsideScopeRef.current = false;
              }
              scheduleIdleResume();
            } else {
              backButtonRef.current?.focus({ preventScroll: true });
            }
          }, 0);
        }
      }, settleDelay);
    },
    [ready, reduced, scheduleIdleResume]
  );

  const returnToOverview = useCallback(
    (fromUser = true) => {
      if (phaseRef.current !== 'detail') return;
      if (fromUser) {
        engageUserControl(false);
      }
      transitionSystem(selectedSystemRef.current, true, !fromUser);
    },
    [engageUserControl, transitionSystem]
  );

  // Escape returns from detail view or closes appearance menu
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (appearanceRef.current) {
        engageUserControl(false);
        setAppearancePinned(false);
        closeAppearanceState(true);
      } else if (phaseRef.current === 'detail') {
        returnToOverview(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeAppearanceState, engageUserControl, returnToOverview]);

  // Autoplay eligibility (never runs during user detail state or while a user menu is open)
  const canRunAutoplaySession =
    ready && !reduced && isInView && isPageVisible && !userInteracting && !appearancePinned;

  const isAutoplayActive = canRunAutoplaySession;
  const showControls = !isAutoplayActive;

  // Continuous unhurried tour across Paint, Wheels, Electric Drive, and Battery
  useEffect(() => {
    if (!canRunAutoplaySession) {
      window.clearTimeout(reelTimerRef.current);
      return;
    }

    // Never start or resume autoplay while a user-opened menu is open
    if (appearanceRef.current && !autoplayOwnedAppearanceRef.current) {
      return;
    }

    // If an automated detail view was interrupted by scroll/tab hide, return smoothly to overview first
    if (phaseRef.current === 'detail' && !phaseLockRef.current) {
      transitionSystem(selectedSystemRef.current, true, true);
    }

    let cancelled = false;

    const runStep = () => {
      if (cancelled) return;

      const idx = reelIndexRef.current % REEL_SEQUENCE.length;
      const step = REEL_SEQUENCE[idx];
      reelIndexRef.current = (idx + 1) % REEL_SEQUENCE.length;

      if (step.kind === 'rest') {
        setAutoplayHighlightHotspot(null);
        setAutoplayVisualSystem(null);
        if (appearanceRef.current) {
          closeAppearanceState(false);
        }
        reelTimerRef.current = window.setTimeout(runStep, step.duration);
        return;
      }

      if (step.kind === 'paint' || step.kind === 'wheels') {
        const mode: AppearanceMode = step.kind;
        const option = appearanceOptions[mode].find((o) => o.id === step.optionId);
        if (!option || failedOptionsRef.current.has(option.image)) {
          reelTimerRef.current = window.setTimeout(runStep, 120);
          return;
        }
        if (!loadedOptionsRef.current.has(option.image)) {
          reelIndexRef.current = idx;
          reelTimerRef.current = window.setTimeout(runStep, 250);
          return;
        }
        if (appearanceRef.current !== mode || appearanceClosingRef.current) {
          openAppearanceState(mode, { fromAutoplay: true, forceSwitch: true });
        }
        setAutoplayHighlightHotspot(mode);
        selectAppearanceOption(mode, step.optionId, false);
        reelTimerRef.current = window.setTimeout(runStep, step.duration);
        return;
      }

      if (step.kind === 'close-appearance') {
        setAutoplayHighlightHotspot(null);
        closeAppearanceState(false);
        reelTimerRef.current = window.setTimeout(runStep, step.duration);
        return;
      }

      if (step.kind === 'system-hover') {
        if (appearanceRef.current) {
          closeAppearanceState(false);
        }
        setAutoplayHighlightHotspot(step.system);
        setAutoplayVisualSystem(step.system);
        reelTimerRef.current = window.setTimeout(runStep, step.duration);
        return;
      }

      if (step.kind === 'system-detail') {
        setAutoplayHighlightHotspot(step.system);
        transitionSystem(step.system, false, true);
        reelTimerRef.current = window.setTimeout(runStep, step.duration);
        return;
      }

      if (step.kind === 'system-return') {
        setAutoplayHighlightHotspot(null);
        transitionSystem(step.system, true, true);
        reelTimerRef.current = window.setTimeout(runStep, step.duration);
      }
    };

    reelTimerRef.current = window.setTimeout(runStep, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(reelTimerRef.current);
    };
  }, [
    canRunAutoplaySession,
    closeAppearanceState,
    openAppearanceState,
    selectAppearanceOption,
    transitionSystem,
  ]);

  // If user resumes from detail/menu pause later, never leave reel mid-detail
  useEffect(() => {
    if (isInView && isPageVisible && !userInteracting && phase !== 'overview' && !phaseLockRef.current) {
      // No-op while autoplay owns detail; handled inside reel loop
    }
  }, [isInView, isPageVisible, phase, userInteracting]);

  const currentSystem = SYSTEMS[selectedSystem];
  const systemControlDisabled =
    phase !== 'overview' || Boolean(appearance) || appearanceClosing;

  // Decide which system HoverVideo should seek toward:
  // Manual hover/focus preview OR autoplay system-hover OR fallback still preview
  const desiredHoverSystem: SystemId | null =
    appearance || appearanceClosing
      ? null
      : hoveredSystem || (!userInteracting ? autoplayVisualSystem : null);

  // Paint & Wheels hotspots are blocked/disabled while user previews or inspects Drive/Battery
  const systemBlockingAppearance =
    phase !== 'overview' || Boolean(hoveredSystem) || !neutral;

  const showAppearanceVisual = Boolean(appearance && neutral && !appearanceClosing);
  const reserveMobileSpace = showControls && Boolean(appearance);

  // Scope pointer/focus/key handlers pause autoplay immediately and show controls
  function handleScopePointerEnter(event: ReactPointerEvent<HTMLDivElement>) {
    pointerInsideScopeRef.current = true;
    if (event.pointerType !== 'touch') {
      engageUserControl(false);
    }
  }

  function handleScopePointerLeave(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch') return;
    pointerInsideScopeRef.current = false;
    setHoveredSystem(null);

    if (appearanceRef.current && !appearancePinnedRef.current) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = window.setTimeout(() => {
        closeAppearanceState(false);
      }, 140);
    }

    if (phaseRef.current === 'overview' && !appearancePinnedRef.current) {
      scheduleIdleResume();
    }
  }

  function handleScopePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch') {
      lastTouchActionRef.current = Date.now();
    }
    engageUserControl(event.pointerType === 'touch');
  }

  function handleScopeFocusCapture() {
    focusInsideScopeRef.current = true;
    if (!suppressFocusRef.current) {
      engageUserControl(false);
    }
  }

  function handleScopeBlurCapture(event: React.FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      focusInsideScopeRef.current = false;
      setHoveredSystem(null);
      if (appearanceRef.current && !appearancePinnedRef.current) {
        closeAppearanceState(false);
      }
      if (phaseRef.current === 'overview' && !appearancePinnedRef.current) {
        scheduleIdleResume();
      }
    }
  }

  function handleScopeKeyDownCapture() {
    engageUserControl(false);
  }

  function handleSystemHotspotKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    id: SystemId
  ) {
    if (event.key === ' ') {
      event.preventDefault();
      engageUserControl(false);
      if (!systemControlDisabled) {
        setHoveredSystem((prev) => (prev === id ? null : id));
      }
    }
  }

  function handleSystemHotspotClick(
    _event: React.MouseEvent<HTMLButtonElement>,
    id: SystemId
  ) {
    if (systemControlDisabled) return;
    const isTouchTap = Date.now() - lastTouchActionRef.current < 800;

    engageUserControl(isTouchTap);

    // Touch behavior: first tap acts as hover preview, second tap on same hotspot opens detail
    if (isTouchTap && hoveredSystem !== id) {
      setHoveredSystem(id);
      return;
    }

    transitionSystem(id, false, false);
  }

  return (
    <div
      ref={scopeRef}
      className={`veyra-scope phase-${phase} ${isAutoplayActive ? 'is-autoplaying' : ''} ${
        reserveMobileSpace ? 'pb-[156px] lg:pb-0' : 'pb-0'
      }`}
      role="region"
      aria-label="Interactive concept car visualizer"
      onPointerEnter={handleScopePointerEnter}
      onPointerLeave={handleScopePointerLeave}
      onPointerDown={handleScopePointerDown}
      onFocusCapture={handleScopeFocusCapture}
      onBlurCapture={handleScopeBlurCapture}
      onKeyDownCapture={handleScopeKeyDownCapture}
    >
      <div className="veyra-stage">
        <div className="image-plane">
          {/* Framed Media Envelope */}
          <div className="media-envelope">
            <div className="exterior-envelope">
              <div
                className="car-visual"
                style={
                  {
                    '--focus-x': `${currentSystem.anchor.x}%`,
                    '--focus-y': `${currentSystem.anchor.y}%`,
                  } as CSSProperties
                }
              >
                <img
                  className="car-image"
                  src={ROOT_IMAGE}
                  alt="Silver electric concept coupe in studio lighting"
                  draggable={false}
                />

                {/* Single shared canvas decoding the 4 off-DOM hover videos */}
                <HoverVideo
                  desired={desiredHoverSystem}
                  mode={phase}
                  reduced={reduced}
                  onNeutral={setNeutral}
                  onFallbackChange={setVideoFallback}
                />

                {/* Still-image crossfade fallback if video decoding fails */}
                {videoFallback && desiredHoverSystem && (
                  <img
                    className="fallback-still shown"
                    src={SYSTEMS[desiredHoverSystem].image}
                    alt=""
                    draggable={false}
                  />
                )}

                {/* Dual-layer smooth Paint & Wheels variant overlay */}
                <div
                  className={`appearance-visual ${showAppearanceVisual ? 'shown' : ''}`}
                  aria-hidden="true"
                >
                  {previousImage !== appearanceImage && (
                    <img
                      className="appearance-layer-base"
                      src={previousImage}
                      alt=""
                      draggable={false}
                    />
                  )}
                  <img
                    key={`${appearanceImage}-${swapTick}`}
                    className={`appearance-layer-active ${swapTick > 0 ? 'crossfade' : ''}`}
                    src={appearanceImage}
                    alt=""
                    draggable={false}
                  />
                </div>
              </div>

              {/* Detail cutaway destination */}
              <div className={`detail-visual ${detailVisible ? 'shown' : ''}`}>
                <img
                  className="detail-image"
                  src={currentSystem.image}
                  alt={`Illustrative cutaway of the ${currentSystem.label.toLowerCase()}`}
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* Overview Hotspots */}
          {phase === 'overview' && ready && (
            <>
              {/* Paint & Wheels Hotspots */}
              {APPEARANCE_HOTSPOTS.map((item) => {
                const { id, label, anchor } = item;
                const enabled =
                  !systemBlockingAppearance &&
                  (isAutoplayActive || canUseHotspot(appearance, id, appearanceClosing));
                const isExpanded = appearance === id;
                const isAutoHighlight = isAutoplayActive && autoplayHighlightHotspot === id;

                return (
                  <div
                    key={id}
                    className={`appearance-hotspot ${isExpanded && showControls ? 'expanded' : ''}`}
                    style={
                      {
                        '--anchor-x': `${anchor.x}%`,
                        '--anchor-y': `${anchor.y}%`,
                      } as CSSProperties
                    }
                    onPointerEnter={() => {
                      if (systemBlockingAppearance) return;
                      engageUserControl(false);
                      if (appearancePinned && appearance === id) return;
                      if (!appearancePinned) {
                        openAppearanceState(id, { fromAutoplay: false, forceSwitch: isAutoplayActive });
                      }
                    }}
                    onPointerLeave={(event) => {
                      if (appearancePinned) return;
                      if (!event.currentTarget.contains(document.activeElement)) {
                        leaveTimerRef.current = window.setTimeout(
                          () => closeAppearanceState(false),
                          140
                        );
                      }
                    }}
                    onBlur={(event) => {
                      if (
                        !appearancePinned &&
                        !event.currentTarget.contains(event.relatedTarget as Node | null)
                      ) {
                        closeAppearanceState(false);
                      }
                    }}
                  >
                    <button
                      ref={(node) => {
                        appearanceButtonsRef.current[id] = node;
                      }}
                      type="button"
                      className={`hotspot ${(isExpanded && showControls) || isAutoHighlight ? 'active' : ''}`}
                      disabled={!enabled}
                      onFocus={() => {
                        if (!suppressFocusRef.current && !systemBlockingAppearance) {
                          engageUserControl(false);
                          openAppearanceState(id, { fromAutoplay: false });
                        }
                      }}
                      onClick={() => {
                        if (systemBlockingAppearance) return;
                        engageUserControl(false);
                        if (isExpanded && appearancePinned) {
                          setAppearancePinned(false);
                          closeAppearanceState(true);
                        } else {
                          openAppearanceState(id, { fromAutoplay: false, forceSwitch: true });
                          setAppearancePinned(true);
                        }
                      }}
                      aria-expanded={isExpanded && showControls && !appearanceClosing}
                      aria-controls={`appearance-${id}`}
                      aria-label={label}
                    >
                      <span className="hotspot-ring">
                        {isExpanded && appearancePinned && showControls ? (
                          <X size={14} strokeWidth={1.5} />
                        ) : (
                          <Plus size={14} strokeWidth={1.5} />
                        )}
                      </span>
                      <span className="hotspot-label">
                        {id === 'paint' ? 'Paint' : 'Wheels'}
                      </span>
                    </button>

                    {/* Pointer Corridor & Docked Menu (hidden during autoplay) */}
                    {isExpanded && showControls && !appearanceClosing && (
                      <>
                        <span className="menu-bridge" aria-hidden="true" />
                        <AppearanceMenu
                          mode={id}
                          selected={optionId}
                          loaded={loadedOptions}
                          unavailable={failedOptions}
                          waiting={!neutral}
                          isAutoPlaying={false}
                          onSelect={(choiceId) => {
                            engageUserControl(false);
                            selectAppearanceOption(id, choiceId, true);
                          }}
                          onClose={() => {
                            engageUserControl(false);
                            setAppearancePinned(false);
                            closeAppearanceState(true);
                          }}
                        />
                      </>
                    )}
                  </div>
                );
              })}

              {/* Electric Drive & Battery Hotspots (hidden & disabled while Paint/Wheels open or closing) */}
              {SYSTEM_IDS.map((id) => {
                const sys = SYSTEMS[id];
                const hiddenByAppearance = Boolean(appearance) || appearanceClosing;
                const enabled = !hiddenByAppearance && !isAutoplayActive ? true : !hiddenByAppearance;
                const isActive =
                  hoveredSystem === id ||
                  (isAutoplayActive && autoplayHighlightHotspot === id);

                return (
                  <button
                    key={id}
                    ref={(node) => {
                      systemButtonsRef.current[id] = node;
                    }}
                    type="button"
                    className={`hotspot ${isActive ? 'active' : ''} ${
                      hiddenByAppearance ? 'hotspot-hidden' : ''
                    }`}
                    style={{ left: `${sys.anchor.x}%`, top: `${sys.anchor.y}%` }}
                    disabled={hiddenByAppearance || !enabled}
                    aria-hidden={hiddenByAppearance}
                    tabIndex={hiddenByAppearance ? -1 : 0}
                    aria-label={sys.label}
                    onPointerEnter={(event) => {
                      if (hiddenByAppearance || event.pointerType === 'touch') return;
                      engageUserControl(false);
                      setHoveredSystem(id);
                    }}
                    onPointerLeave={(event) => {
                      if (event.pointerType === 'touch') return;
                      setHoveredSystem((prev) => (prev === id ? null : prev));
                    }}
                    onFocus={() => {
                      if (suppressFocusRef.current || hiddenByAppearance) return;
                      engageUserControl(false);
                      setHoveredSystem(id);
                    }}
                    onBlur={() => {
                      setHoveredSystem((prev) => (prev === id ? null : prev));
                    }}
                    onKeyDown={(event) => handleSystemHotspotKeyDown(event, id)}
                    onClick={(event) => handleSystemHotspotClick(event, id)}
                  >
                    <span className="hotspot-ring">
                      <Plus size={14} strokeWidth={1.5} />
                    </span>
                    <span className="hotspot-label">
                      <span>{sys.label}</span>
                      <ArrowUpRight size={14} strokeWidth={1.5} />
                    </span>
                  </button>
                );
              })}
            </>
          )}

          {/* Interactive Detail View Controls (hidden during autoplay) */}
          {showControls && (phase === 'entering' || phase === 'detail' || phase === 'returning') && (
            <button
              ref={backButtonRef}
              type="button"
              className="detail-back"
              disabled={phase !== 'detail'}
              onClick={() => returnToOverview(true)}
              aria-label="Back to vehicle"
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
              <span>{phase === 'returning' ? 'Returning' : 'Back'}</span>
              <kbd>Esc</kbd>
            </button>
          )}

          {showControls &&
            phase === 'detail' &&
            currentSystem.points.map((point, index) => {
              const isOpen = activeAnnotation === index;
              return (
                <button
                  key={point.id}
                  type="button"
                  className={`annotation ${isOpen ? 'open' : ''}`}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  aria-label={`${point.label} — toggle description`}
                  aria-expanded={isOpen}
                  onClick={() => {
                    engageUserControl(false);
                    setActiveAnnotation(isOpen ? null : index);
                  }}
                >
                  <span className="annotation-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="annotation-label">{point.label}</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Technical Detail Panel & Component List (hidden during autoplay) */}
      {showControls && phase === 'detail' && (
        <aside className="veyra-detail-panel" aria-label={`${currentSystem.label} details`}>
          <div className="detail-panel-header">
            <span className="detail-kicker">{currentSystem.category}</span>
            <h2 className="detail-title">{currentSystem.title}</h2>
            <p className="detail-summary">{currentSystem.description}</p>
            <p className="detail-benefit">{currentSystem.benefit}</p>
          </div>

          <div className="part-list" role="list" aria-label={`${currentSystem.label} components`}>
            {currentSystem.points.map((point, index) => {
              const isSelected = activeAnnotation === index;
              return (
                <div key={point.id} role="listitem">
                  <button
                    type="button"
                    className={`part-item-btn ${isSelected ? 'selected' : ''}`}
                    aria-expanded={isSelected}
                    onClick={() => {
                      engageUserControl(false);
                      setActiveAnnotation(isSelected ? null : index);
                    }}
                  >
                    <span className="part-row">
                      <small>{String(index + 1).padStart(2, '0')}</small>
                      <span>{point.label}</span>
                      <Plus size={14} strokeWidth={1.5} />
                    </span>
                    {isSelected && <span className="part-description">{point.text}</span>}
                  </button>
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* Screen-reader status (silent during passive autoplay) */}
      <p className="sr-only" role="status" aria-live={isAutoplayActive ? 'off' : 'polite'}>
        {!isAutoplayActive && phase === 'detail'
          ? `${currentSystem.label} detail view. Press Escape to return.`
          : !isAutoplayActive && appearance
            ? `${appearance === 'paint' ? 'Body colour' : 'Wheel design'} menu open. Selection: ${optionId}.`
            : 'Interactive vehicle overview. Explore Electric Drive, Battery, Paint, or Wheels.'}
      </p>
    </div>
  );
}
