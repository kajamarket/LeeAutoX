import { useEffect, useRef, useState } from 'react';
import GraffitiLayer from '../ui/GraffitiLayer';

interface Phase1PreloaderProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function Phase1Preloader({ onComplete, onSkip }: Phase1PreloaderProps) {
  const [percent, setPercent] = useState(1);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let active = true;
    let rafId = 0;
    let timerId = 0;
    let displayed = 1;
    let readyDone = false;
    const startTime = performance.now();
    const MIN_PACING_MS = 1350;
    const MAX_WAIT_MS = 3500;

    const waitFonts =
      typeof document !== 'undefined' && document.fonts?.ready
        ? document.fonts.ready.catch(() => undefined)
        : Promise.resolve();

    void waitFonts.finally(() => {
      if (active) {
        readyDone = true;
      }
    });

    // Safety ceiling so slow font loading never stalls Phase 1
    const maxTimeout = window.setTimeout(() => {
      readyDone = true;
    }, MAX_WAIT_MS);

    const tick = (now: number) => {
      if (!active) return;
      const elapsed = now - startTime;
      const minCeiling = Math.min(1, elapsed / MIN_PACING_MS);

      const targetFloat = readyDone
        ? Math.min(1, Math.max(displayed / 100, minCeiling))
        : Math.min(0.92, minCeiling * 0.92);

      const targetPct = Math.max(1, Math.min(100, Math.round(targetFloat * 100)));
      if (targetPct > displayed) {
        const step = readyDone ? Math.max(1, Math.ceil((targetPct - displayed) * 0.24)) : 1;
        displayed = Math.min(100, displayed + step);
        setPercent(displayed);
      }

      if (displayed >= 100 && readyDone && elapsed >= MIN_PACING_MS) {
        if (!completedRef.current) {
          completedRef.current = true;
          setPercent(100);
          timerId = window.setTimeout(() => {
            if (active) {
              onCompleteRef.current();
            }
          }, 220);
        }
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      window.clearTimeout(maxTimeout);
    };
  }, []);

  const safePercent = Math.max(1, Math.min(100, Math.round(percent)));

  return (
    <div
      className="fixed inset-0 z-[9999] bg-foreground text-background overflow-hidden flex flex-col items-center justify-center select-none"
      role="status"
      aria-live="polite"
      aria-label={`Loading LeeAutoX ${safePercent} percent`}
    >
      {/* Reproduced Footer Visual Background Identity via shared GraffitiLayer */}
      <GraffitiLayer
        variant="footer"
        surface="inverted"
        brand="LEEAUTOX"
        words={['LEEAUTOX', 'VEHICLES']}
        year="2024"
      />

      {/* Subtle atmospheric radial sheen */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 68% 52% at 50% 48%, rgba(43, 89, 255, 0.16), transparent 72%)',
        }}
      />

      {/* Cinematic Centerpiece Lockup */}
      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center text-center">
        <div className="flex items-center gap-3 mb-5 text-[11px] font-mono uppercase tracking-[0.38em] text-background/55">
          <span className="inline-block w-8 h-[1px] bg-[#2B59FF]" />
          <span>Canada &bull; USA &bull; Nigeria</span>
          <span className="inline-block w-8 h-[1px] bg-[#2B59FF]" />
        </div>

        <div className="intro-gta-wordmark text-5xl sm:text-7xl md:text-8xl font-black uppercase leading-none">
          LEEAUTOX
        </div>

        <p className="intro-font-jakarta mt-4 text-xs sm:text-sm uppercase tracking-[0.26em] text-background/70 font-medium max-w-lg">
          Buy in Canada &amp; USA. Collect anywhere in Nigeria.
        </p>

        {/* Synchronized Progress Bar & Exact 1% -> 100% Counter */}
        <div className="w-full max-w-md mt-12 sm:mt-14">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-background/55">
              Vehicle Sourcing &amp; Shipping
            </span>
            <span className="intro-font-orbitron text-2xl sm:text-3xl font-extrabold tabular-nums tracking-wider text-background">
              {safePercent}%
            </span>
          </div>

          <div className="relative h-[3px] w-full bg-background/15 overflow-hidden">
            <div
              className="h-full transition-[width] duration-100 ease-out"
              style={{
                width: `${safePercent}%`,
                background: 'linear-gradient(90deg, #2B59FF 0%, #60A5FA 60%, #F59E0B 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Subtle Skip Intro escape hatch */}
      <button
        type="button"
        onClick={onSkip}
        className="absolute bottom-7 right-6 sm:bottom-9 sm:right-10 z-20 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.22em] text-background/60 hover:text-background border border-background/20 hover:border-background/50 transition-colors cursor-pointer"
      >
        Skip Intro
      </button>
    </div>
  );
}
