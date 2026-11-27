import React, { useEffect, useRef, useState } from 'react';
import { Star, ArrowDownRight } from 'lucide-react';
import { useReviews } from '../context/ReviewsContext';
import HeroSearchWidget from './HeroSearchWidget';
import VeyraHeroCar from './VeyraCar/VeyraHeroCar';
import AnimatedText from './ui/AnimatedText';
import Reveal from './ui/Reveal';
import GraffitiLayer from './ui/GraffitiLayer';
import { BreathOrb } from './ui/ImportedControls';
import { prefersReducedMotion, registerScrollTrack } from '../motion/scrollEngine';

const HERO_CAR_SRC = '/media/exterior-polished.png';

function decodeHeroImg(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    const img = new Image();
    img.onload = () => {
      if (typeof img.decode === 'function') {
        img.decode().then(() => resolve()).catch(() => resolve());
      } else {
        resolve();
      }
    };
    img.onerror = () => resolve();
    img.src = src;
  });
}

export default function Hero() {
  const { averageRating, totalCount } = useReviews();
  const trackRef = useRef<HTMLDivElement>(null);
  const [heroReady, setHeroReady] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    return registerScrollTrack(el);
  }, []);

  useEffect(() => {
    if (heroReady) return;
    let cancelled = false;
    const fontsReady =
      typeof document !== 'undefined' && document.fonts?.ready
        ? document.fonts.ready.catch(() => {})
        : Promise.resolve();

    const timer = window.setTimeout(() => {
      if (!cancelled) setHeroReady(true);
    }, 900);

    Promise.all([decodeHeroImg(HERO_CAR_SRC), fontsReady]).then(() => {
      if (!cancelled) {
        window.clearTimeout(timer);
        setHeroReady(true);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [heroReady]);

  const readyAttr = heroReady ? 'true' : 'false';

  return (
    <section className="lx-band-dark relative overflow-x-clip transition-colors duration-500">
      <GraffitiLayer variant="heroShowcase" surface="dark" words={['AUCTIONS', 'EXPORTS']} />

      {/* Studio Backdrop & Radial Spotlight */}
      <div
        data-ready={readyAttr}
        className="lx-hero-bg pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 68% 54% at 68% 32%, rgba(0, 0, 0, 0.96) 0%, rgba(9, 9, 11, 0.45) 58%, transparent 100%)',
          }}
        />
        <BreathOrb className="absolute -top-24 right-[-8%] h-[48vw] w-[48vw] max-h-[620px] max-w-[620px] opacity-40" />
        <BreathOrb className="absolute top-[22%] left-[-12%] h-[34vw] w-[34vw] max-h-[460px] max-w-[460px] opacity-30" />
      </div>

      {/* Sticky Scroll Scene Track */}
      <div
        ref={trackRef}
        data-hero-scroll
        data-scroll-active="false"
        className="lx-scroll-track relative z-10 min-h-[160svh] md:min-h-[205svh]"
      >
        <div className="sticky top-0 min-h-[100svh] flex items-center pt-20 sm:pt-24 md:pt-[108px] pb-8 md:pb-12 px-5 sm:px-8 md:px-12">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-10 lg:items-center gap-y-4 sm:gap-y-5">
              {/* Eyebrow & Verified Rating Pill */}
              <div className="lx-hero-scroll-copy order-1 lg:col-span-5 lg:col-start-1 lg:row-start-1 flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono tracking-[0.26em] text-[var(--accent)] font-semibold uppercase">
                  <AnimatedText text="BUY — BID — EXPORT" variant="tracking-expanding" trigger="mount" />
                </span>

                <a
                  href="#testimonials"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[var(--line)] bg-[var(--card)]/90 text-[var(--ink)] text-xs font-medium shadow-xs hover:border-[var(--accent)] transition-colors"
                >
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold tabular-nums">{averageRating}</span>
                  <span className="text-[var(--ink-2)] tabular-nums">/ 5.0</span>
                  <span className="text-[var(--line)] hidden sm:inline">·</span>
                  <span className="text-[var(--ink-2)] text-[11px] underline decoration-[var(--accent)]/60 underline-offset-2">
                    {totalCount} Verified Reviews
                  </span>
                </a>
              </div>

              {/* Editorial Young Serif Display Headline */}
              <h1 className="lx-hero-scroll-copy order-2 lg:col-span-5 lg:col-start-1 lg:row-start-2 font-serif text-[clamp(2.1rem,4.7vw,4.35rem)] leading-[1.04] font-normal tracking-tight text-[var(--ink)]">
                <span className="block">
                  <AnimatedText text="Buy in Canada & USA." variant="mask-rise" trigger="mount" />
                </span>
                <span className="block mt-1 italic text-[var(--ink-2)]">
                  <AnimatedText text="Collect in Nigeria." variant="blur-in" trigger="mount" delay={120} />
                </span>
                <span className="mt-3 inline-flex items-center gap-2 font-sans text-xs sm:text-sm font-medium tracking-wide text-[var(--ink-2)]">
                  <span>Direct procurement for{' '}</span>
                  <span className="rounded-full bg-[var(--accent-soft)] px-3 py-0.5 text-[var(--accent)] font-semibold">
                    <AnimatedText
                      text="SUVs"
                      variant="rotating-text"
                      words={['SUVs', 'Sedans', 'Trucks', 'Luxury']}
                      trigger="mount"
                    />
                  </span>
                </span>
              </h1>

              {/* Seamless Borderless Interactive Car Showcase */}
              <div className="order-3 lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:row-span-4 w-full relative z-[2]">
                <div className="lx-hero-scroll-car relative">
                  {/* Soft floor contact shadow expanding on arrival */}
                  <div
                    data-ready={readyAttr}
                    aria-hidden="true"
                    className="lx-hero-shadow pointer-events-none absolute inset-x-[12%] bottom-[6%] h-10 rounded-full blur-2xl"
                    style={{
                      background:
                        'radial-gradient(ellipse at center, rgba(77, 116, 255, 0.22) 0%, rgba(0, 0, 0, 0.72) 65%, transparent 100%)',
                    }}
                  />

                  <div data-ready={readyAttr} className="lx-hero-car-enter relative">
                    <VeyraHeroCar />

                    {/* Single subtle studio light sweep across car on arrival */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                      <div data-ready={readyAttr} className="lx-car-sweep" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Concise Measure Subtitle */}
              <p className="lx-hero-scroll-copy order-4 lg:col-span-5 lg:col-start-1 lg:row-start-3 text-[var(--ink-2)] text-base md:text-lg leading-relaxed lx-prose">
                <AnimatedText
                  text="We buy from Copart, IAA, all USA and Canadian auctions & dealerships, ship to Nigeria or anywhere in West Africa, and clear customs. Pay in installments, track every step, then collect."
                  variant="blur-in"
                  trigger="mount"
                  delay={160}
                />
              </p>

              {/* Pill CTAs */}
              <div className="lx-hero-scroll-copy order-5 lg:col-span-5 lg:col-start-1 lg:row-start-4 flex flex-wrap items-center gap-3.5 pt-1">
                <a
                  href="#contact"
                  className="lx-pill-btn bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_14px_34px_-12px_rgba(43,89,255,0.55)] hover:opacity-92"
                >
                  Get a Free Quote
                </a>
                <a
                  href="#auction-search"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('auction-search')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="lx-pill-btn border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)]"
                >
                  <span>Search Auction Cars</span>
                  <ArrowDownRight size={16} className="text-[var(--accent)]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Search Widget cleanly anchored below sticky upper stage */}
      <div className="max-w-7xl mx-auto w-full relative z-[20] px-5 sm:px-8 md:px-12 pb-14 md:pb-20 pt-2">
        <Reveal variant="rise" immediate delay={160} className="w-full relative scroll-mt-24">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <h3 className="font-serif text-lg md:text-xl text-[var(--ink)]">
                Live Copart &amp; IAAI Auction Search
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[var(--ink-2)] uppercase tracking-widest hidden sm:inline">
              Real-time North American Inventory Feeds
            </span>
          </div>

          <HeroSearchWidget />
        </Reveal>
      </div>
    </section>
  );
}
