import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Plus, X } from 'lucide-react';
import AppearanceMenu from './AppearanceMenu';
import {
  appearanceOptions,
  baseExterior,
  canUseHotspot,
  type AppearanceMode,
} from './appearance';
import './veyra.css';

const ROOT_IMAGE = '/media/exterior-polished.png';

interface HotspotConfig {
  id: AppearanceMode;
  label: string;
  anchor: { x: number; y: number };
}

const HOTSPOTS: HotspotConfig[] = [
  { id: 'paint', label: 'Body colour', anchor: { x: 55, y: 51 } },
  { id: 'wheels', label: 'Wheel design', anchor: { x: 48, y: 71 } },
];

export default function VeyraHeroCar() {
  const [ready, setReady] = useState(false);
  const [appearance, setAppearance] = useState<AppearanceMode | null>(null);
  const [appearancePinned, setAppearancePinned] = useState(false);
  const [appearanceClosing, setAppearanceClosing] = useState(false);
  const [optionId, setOptionId] = useState('silver');
  const [appearanceImage, setAppearanceImage] = useState(baseExterior);
  const [reduced, setReduced] = useState(false);
  const [loadedOptions, setLoadedOptions] = useState<Set<string>>(() => new Set([baseExterior]));
  const [failedOptions, setFailedOptions] = useState<Set<string>>(() => new Set());

  const optionLoads = useRef<Set<string>>(new Set());
  const appearanceTimer = useRef<number | undefined>(undefined);
  const leaveTimer = useRef<number | undefined>(undefined);
  const appearanceButtons = useRef<Partial<Record<AppearanceMode, HTMLButtonElement | null>>>({});
  const suppressFocus = useRef(false);

  // Prefers reduced motion detection
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => {
      media.removeEventListener('change', update);
      clearTimeout(appearanceTimer.current);
      clearTimeout(leaveTimer.current);
    };
  }, []);

  // Preload initial root image with decode gate
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      img
        .decode()
        .then(() => {
          if (!cancelled) setReady(true);
        })
        .catch(() => {
          if (!cancelled) setReady(true);
        });
    };
    img.onerror = () => {
      if (!cancelled) setReady(true);
    };
    img.src = ROOT_IMAGE;

    return () => {
      cancelled = true;
    };
  }, []);

  // Preload options when appearance mode opens
  useEffect(() => {
    if (!appearance) return;
    let cancelled = false;
    const pending = appearanceOptions[appearance].filter(
      (option) => !optionLoads.current.has(option.image)
    );

    pending.forEach((option) => {
      optionLoads.current.add(option.image);
      const image = new Image();
      image.onload = () => {
        image
          .decode()
          .then(() => {
            if (!cancelled) {
              setLoadedOptions((prev) => new Set(prev).add(option.image));
              setFailedOptions((prev) => {
                const next = new Set(prev);
                next.delete(option.image);
                return next;
              });
            }
          })
          .catch(() => {
            if (!cancelled) {
              setFailedOptions((prev) => new Set(prev).add(option.image));
            }
          });
      };
      image.onerror = () => {
        if (!cancelled) {
          setFailedOptions((prev) => new Set(prev).add(option.image));
        }
      };
      image.src = option.image;
    });

    return () => {
      cancelled = true;
      pending.forEach((option) => optionLoads.current.delete(option.image));
    };
  }, [appearance]);

  function openAppearance(mode: AppearanceMode) {
    if (!canUseHotspot(appearance, mode, appearanceClosing)) return;
    window.clearTimeout(leaveTimer.current);
    if (appearance === mode) return;

    setAppearance(mode);
    setAppearancePinned(false);
    const defaultOption = appearanceOptions[mode][0];
    setOptionId(defaultOption.id);
    setAppearanceImage(baseExterior);
  }

  function closeAppearance(restoreFocus = true) {
    if (!appearance || appearanceClosing) return;
    const previousMode = appearance;
    window.clearTimeout(leaveTimer.current);
    setAppearanceClosing(true);

    appearanceTimer.current = window.setTimeout(
      () => {
        setAppearance(null);
        setAppearancePinned(false);
        setAppearanceClosing(false);
        setAppearanceImage(baseExterior);
        if (restoreFocus) {
          suppressFocus.current = true;
          appearanceButtons.current[previousMode]?.focus({ preventScroll: true });
          suppressFocus.current = false;
        }
      },
      reduced ? 0 : 260
    );
  }

  function chooseAppearance(id: string) {
    if (!appearance || appearanceClosing) return;
    const option = appearanceOptions[appearance].find((item) => item.id === id);
    if (!option || !loadedOptions.has(option.image)) return;

    setAppearancePinned(true);
    setOptionId(id);
    setAppearanceImage(option.image);
  }

  // Keyboard Escape handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && appearance) {
        closeAppearance();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appearance, appearanceClosing]);

  return (
    <div
      className={`veyra-scope transition-all duration-300 ${appearance ? 'pb-32 sm:pb-36' : 'pb-0'}`}
      role="region"
      aria-label="Interactive concept car visualizer"
    >
      <div className="veyra-stage">
        <div className="image-plane">
          {/* Framed Media Envelope */}
          <div className="media-envelope">
            <div className="exterior-envelope">
              <div className="car-visual">
                <img
                  className="car-image"
                  src={ROOT_IMAGE}
                  alt="Silver electric concept coupe in studio lighting"
                  draggable={false}
                />
                <div
                  className={`appearance-visual ${appearance && !appearanceClosing ? 'shown' : ''}`}
                  aria-hidden="true"
                >
                  <img src={appearanceImage} alt="" draggable={false} />
                </div>
              </div>
            </div>
          </div>

          {/* Hotspots: Paint & Wheels */}
          {ready &&
            HOTSPOTS.map((item) => {
              const { id, label, anchor } = item;
              const enabled = canUseHotspot(appearance, id, appearanceClosing);
              const isExpanded = appearance === id;

              return (
                <div
                  key={id}
                  className={`appearance-hotspot ${isExpanded ? 'expanded' : ''}`}
                  style={
                    {
                      '--anchor-x': `${anchor.x}%`,
                      '--anchor-y': `${anchor.y}%`,
                    } as CSSProperties
                  }
                  onPointerEnter={() => openAppearance(id)}
                  onPointerLeave={(event) => {
                    if (
                      !appearancePinned &&
                      !event.currentTarget.contains(document.activeElement)
                    ) {
                      leaveTimer.current = window.setTimeout(
                        () => closeAppearance(false),
                        140
                      );
                    }
                  }}
                  onBlur={(event) => {
                    if (
                      !appearancePinned &&
                      !event.currentTarget.contains(event.relatedTarget as Node | null)
                    ) {
                      closeAppearance(false);
                    }
                  }}
                >
                  <button
                    ref={(node) => {
                      appearanceButtons.current[id] = node;
                    }}
                    type="button"
                    className={`hotspot ${isExpanded ? 'active' : ''}`}
                    disabled={!enabled}
                    onFocus={() => {
                      if (!suppressFocus.current) openAppearance(id);
                    }}
                    onClick={() => {
                      if (isExpanded && appearancePinned) {
                        closeAppearance();
                      } else {
                        openAppearance(id);
                        setAppearancePinned(true);
                      }
                    }}
                    aria-expanded={isExpanded && !appearanceClosing}
                    aria-controls={`appearance-${id}`}
                    aria-label={label}
                  >
                    <span className="hotspot-ring">
                      {isExpanded && appearancePinned ? (
                        <X size={14} strokeWidth={1.5} />
                      ) : (
                        <Plus size={14} strokeWidth={1.5} />
                      )}
                    </span>
                    <span className="hotspot-label">
                      {id === 'paint' ? 'Paint' : 'Wheels'}
                    </span>
                  </button>

                  {/* Pointer Corridor between hotspot and docked menu */}
                  {isExpanded && !appearanceClosing && (
                    <span className="menu-bridge" aria-hidden="true" />
                  )}

                  {/* Docked Appearance Menu */}
                  {isExpanded && !appearanceClosing && (
                    <AppearanceMenu
                      mode={id}
                      selected={optionId}
                      loaded={loadedOptions}
                      unavailable={failedOptions}
                      waiting={false}
                      onSelect={chooseAppearance}
                      onClose={() => closeAppearance()}
                    />
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Screen-reader announcement */}
      <p className="sr-only" role="status" aria-live="polite">
        {appearance
          ? `${appearance === 'paint' ? 'Body colour' : 'Wheel design'} customization menu open. Current selection: ${optionId}. Press Escape to close.`
          : 'Interactive car overview. Choose Paint or Wheels to customize.'}
      </p>
    </div>
  );
}
