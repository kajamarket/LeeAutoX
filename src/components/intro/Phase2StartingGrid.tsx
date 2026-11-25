import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';
import {
  StartingGridSceneController,
  type CountdownStep,
} from './startingGridScene';
import { startingGridAudio } from './audio';
import type { PreloadedIntroAssets } from './Phase1Preloader';

interface Phase2StartingGridProps {
  preloadedAssets: PreloadedIntroAssets;
  onRevealComplete: () => void;
}

export default function Phase2StartingGrid({
  preloadedAssets,
  onRevealComplete,
}: Phase2StartingGridProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<StartingGridSceneController | null>(null);
  const revealedRef = useRef(false);

  const [countdownStep, setCountdownStep] = useState<CountdownStep>(null);
  const [muted, setMuted] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const triggerSmoothExit = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setIsFadingOut(true);
    window.setTimeout(() => {
      onRevealComplete();
    }, 680);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    startingGridAudio.setMuted(true);

    const controller = new StartingGridSceneController(container, preloadedAssets, {
      onCountdownChange: (step) => {
        setCountdownStep(step);
      },
      onLaunchComplete: () => {
        triggerSmoothExit();
      },
      onContextLost: () => {
        setContextLost(true);
        window.setTimeout(() => {
          triggerSmoothExit();
        }, 1000);
      },
      onFatalError: () => {
        triggerSmoothExit();
      },
    });

    controllerRef.current = controller;

    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    startingGridAudio.setMuted(nextMuted);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden select-none bg-[#cfdbe6] transition-opacity duration-700 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="LeeAutoX 3D Starting Grid Showcase"
    >
      {/* Isolated WebGL Viewport */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Radial Speed Lines Overlay on GO */}
      {countdownStep === 'GO' && (
        <div className="intro-speed-lines absolute inset-0 z-10 pointer-events-none" />
      )}

      {/* Subtle Brand Wordmark Corner Tag (Daylight-Legible, No POS Badge) */}
      <div className="absolute top-5 left-5 sm:top-7 sm:left-8 z-20 pointer-events-none">
        <div
          className="inline-flex items-center gap-2.5 px-3.5 py-2 border border-amber-500/40"
          style={{ backgroundColor: 'rgba(12, 16, 22, 0.82)' }}
        >
          <span className="intro-font-orbitron text-xs sm:text-sm font-extrabold tracking-[0.22em] text-white uppercase">
            LEEAUTOX
          </span>
          <span className="w-[1px] h-3.5 bg-white/25" />
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-amber-400">
            Grid Ignition
          </span>
        </div>
      </div>

      {/* WebGL Context Lost Banner Fallback */}
      {contextLost && (
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2 border border-amber-500/60 text-white text-xs font-mono uppercase tracking-wider"
          style={{ backgroundColor: 'rgba(12, 16, 22, 0.9)' }}
        >
          Graphics context paused &mdash; entering homepage
        </div>
      )}

      {/* Center Daylight-Legible Countdown Numeral / GO */}
      {countdownStep && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          <div
            key={countdownStep}
            className={
              countdownStep === 'GO'
                ? 'intro-countdown-go text-[22vw] sm:text-[150px] md:text-[184px] leading-none tracking-tight'
                : 'intro-countdown-numeral text-[24vw] sm:text-[160px] md:text-[196px] leading-none'
            }
          >
            {countdownStep === 'GO' ? 'GO!' : countdownStep}
          </div>
        </div>
      )}

      {/* Compact Non-Obstructive Bottom Controls */}
      <div
        className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-20 flex items-center gap-3"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <button
          type="button"
          onClick={handleToggleSound}
          className="intro-skew-btn inline-flex items-center gap-2 px-4 py-2.5 border border-amber-500/50 text-white text-xs font-mono uppercase tracking-[0.16em] hover:border-amber-400 transition-colors cursor-pointer"
          style={{ backgroundColor: 'rgba(12, 16, 22, 0.82)' }}
          aria-label={muted ? 'Enable engine sound' : 'Mute engine sound'}
        >
          {muted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-amber-400" />
              <span>Sound Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-lime-400" />
              <span>Sound On</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={triggerSmoothExit}
          className="intro-skew-btn inline-flex items-center gap-2 px-4 py-2.5 border border-white/25 text-white text-xs font-mono uppercase tracking-[0.16em] hover:border-white/70 transition-colors cursor-pointer"
          style={{ backgroundColor: 'rgba(12, 16, 22, 0.82)' }}
        >
          <span>Enter Site</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>
    </div>
  );
}
