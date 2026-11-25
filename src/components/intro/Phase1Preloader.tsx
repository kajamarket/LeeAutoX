import { useEffect, useRef, useState } from 'react';

export interface PreloadedIntroAssets {
  glbBuffer: ArrayBuffer | null;
  hdrBuffer: ArrayBuffer | null;
}

interface Phase1PreloaderProps {
  onComplete: (assets: PreloadedIntroAssets) => void;
  onSkip: () => void;
}

const GLB_URL = '/cars/2021_lexus_lc_500_convertible.glb';
const HDR_URL = '/env/rooitou_park_1k.hdr';
const FALLBACK_TOTAL_BYTES = 16_600_000; // ~15MB GLB + ~1.6MB HDR

async function fetchWithProgress(
  url: string,
  onBytes: (loaded: number, total: number) => void,
  signal: AbortSignal
): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url, { signal, cache: 'force-cache' });
    if (!res.ok) return null;

    const headerLen = Number(res.headers.get('Content-Length') || 0);
    if (!res.body) {
      const buf = await res.arrayBuffer();
      onBytes(buf.byteLength, headerLen || buf.byteLength);
      return buf;
    }

    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.byteLength;
        onBytes(received, headerLen || Math.max(received, FALLBACK_TOTAL_BYTES * 0.5));
      }
    }

    const combined = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.byteLength;
    }
    onBytes(received, received);
    return combined.buffer;
  } catch {
    return null;
  }
}

export default function Phase1Preloader({ onComplete, onSkip }: Phase1PreloaderProps) {
  const [percent, setPercent] = useState(1);
  const completedRef = useRef(false);
  const assetsRef = useRef<PreloadedIntroAssets>({ glbBuffer: null, hdrBuffer: null });

  useEffect(() => {
    const controller = new AbortController();
    let rafId = 0;
    let timerId = 0;
    let realTarget = 0.05; // 5% base initialization
    let displayed = 1;
    let downloadsDone = false;
    const startTime = performance.now();
    const MIN_PACING_MS = 1350;
    const MAX_WAIT_MS = 6500;

    let glbLoaded = 0;
    let glbTotal = 15_000_000;
    let hdrLoaded = 0;
    let hdrTotal = 1_600_000;
    let fontsReady = false;

    const recomputeTarget = () => {
      const byteRatio = Math.min(1, (glbLoaded + hdrLoaded) / Math.max(1, glbTotal + hdrTotal));
      const fontBonus = fontsReady ? 0.08 : 0.02;
      const computed = Math.min(0.99, byteRatio * 0.92 + fontBonus);
      realTarget = Math.max(realTarget, computed);
    };

    const waitFonts =
      typeof document !== 'undefined' && document.fonts?.ready
        ? document.fonts.ready.then(() => {
            fontsReady = true;
            recomputeTarget();
          })
        : Promise.resolve().then(() => {
            fontsReady = true;
          });

    const loadAll = Promise.all([
      waitFonts,
      fetchWithProgress(
        GLB_URL,
        (loaded, total) => {
          glbLoaded = loaded;
          if (total > 0) glbTotal = total;
          recomputeTarget();
        },
        controller.signal
      ).then((buf) => {
        assetsRef.current.glbBuffer = buf;
      }),
      fetchWithProgress(
        HDR_URL,
        (loaded, total) => {
          hdrLoaded = loaded;
          if (total > 0) hdrTotal = total;
          recomputeTarget();
        },
        controller.signal
      ).then((buf) => {
        assetsRef.current.hdrBuffer = buf;
      }),
    ]).finally(() => {
      downloadsDone = true;
      realTarget = 1;
    });

    // Safety ceiling so slow networks never stall on Phase 1 indefinitely
    const maxTimeout = window.setTimeout(() => {
      downloadsDone = true;
      realTarget = 1;
    }, MAX_WAIT_MS);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const minCeiling = Math.min(1, elapsed / MIN_PACING_MS);

      // Smoothly advance toward the real asset progress, capped by minCeiling until assets finish
      const targetFloat = downloadsDone
        ? Math.min(1, Math.max(displayed / 100, minCeiling))
        : Math.min(0.96, realTarget * minCeiling);

      const targetPct = Math.max(1, Math.min(100, Math.round(targetFloat * 100)));
      if (targetPct > displayed) {
        // Step smoothly without ever overshooting 100
        const step = downloadsDone ? Math.max(1, Math.ceil((targetPct - displayed) * 0.24)) : 1;
        displayed = Math.min(100, displayed + step);
        setPercent(displayed);
      }

      if (displayed >= 100 && downloadsDone && elapsed >= MIN_PACING_MS) {
        if (!completedRef.current) {
          completedRef.current = true;
          setPercent(100);
          timerId = window.setTimeout(() => {
            onComplete(assetsRef.current);
          }, 220);
        }
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    void loadAll;
    rafId = requestAnimationFrame(tick);

    return () => {
      controller.abort();
      cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      window.clearTimeout(maxTimeout);
    };
  }, [onComplete]);

  const safePercent = Math.max(1, Math.min(100, Math.round(percent)));

  return (
    <div
      className="fixed inset-0 z-[9999] bg-foreground text-background overflow-hidden flex flex-col items-center justify-center select-none"
      role="status"
      aria-live="polite"
      aria-label={`Loading LeeAutoX ${safePercent} percent`}
    >
      {/* Reproduced Footer Visual Background Identity (excluding links, nav, and contact details) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.03]"
      >
        <div className="absolute top-0 left-0 text-[15vw] font-black leading-none tracking-tighter rotate-[-5deg] whitespace-nowrap">
          LEEAUTOX
        </div>
        <div className="absolute bottom-10 right-0 text-[12vw] font-serif font-bold leading-none rotate-[8deg] whitespace-nowrap">
          VEHICLES
        </div>

        {/* Random Pattern Accents */}
        <div className="absolute top-[20%] left-[20%] flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-10 h-[1px] bg-background" />
          ))}
        </div>
        <div className="absolute bottom-[30%] left-[10%] grid grid-cols-2 gap-2 opacity-30">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-2 h-2 border border-background" />
          ))}
        </div>
        <div className="absolute top-[40%] right-[15%] text-[5vw] font-mono leading-none rotate-[45deg]">
          EST.2024
        </div>
      </div>

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
