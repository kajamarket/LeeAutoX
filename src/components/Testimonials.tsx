import React, { useState, useRef, useEffect } from 'react';
import {
  Star,
  PlusCircle,
  Image as ImageIcon,
  Video,
  ShieldCheck,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useReviews, ReviewItem } from '../context/ReviewsContext';
import LeaveReviewModal from './LeaveReviewModal';
import AnimatedText from './ui/AnimatedText';
import Reveal from './ui/Reveal';
import GraffitiLayer from './ui/GraffitiLayer';
import { RippleButton } from './ui/ImportedControls';
import { observeOffscreenLoop, prefersReducedMotion } from '../motion/scrollEngine';

function truncateAtWord(text: string, maxChars: number): string {
  const clean = text.trim().replace(/\s+/g, ' ');
  if (clean.length <= maxChars) return clean;
  const slice = clean.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > Math.floor(maxChars * 0.5) ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[.,;:!?-]+$/, '')}…`;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mq.matches);
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, []);

  return reduced;
}

interface MarqueeRowProps {
  items: ReviewItem[];
  direction: 'left' | 'right';
  speedPxPerSecDesktop: number;
  speedPxPerSecMobile: number;
  paused: boolean;
  reducedMotion: boolean;
}

function ReviewMarqueeRow({
  items,
  direction,
  speedPxPerSecDesktop,
  speedPxPerSecMobile,
  paused,
  reducedMotion,
}: MarqueeRowProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstCopyRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<Animation | null>(null);
  const [durationMs, setDurationMs] = useState<number>(38000);

  useEffect(() => {
    const el = firstCopyRef.current;
    if (!el || reducedMotion) return;

    const recalc = () => {
      const width = el.offsetWidth;
      if (width > 0) {
        const isMobile = window.innerWidth < 768;
        const speed = isMobile ? speedPxPerSecMobile : speedPxPerSecDesktop;
        setDurationMs(Math.max(8000, Math.round((width / speed) * 1000)));
      }
    };

    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    window.addEventListener('resize', recalc, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recalc);
    };
  }, [items.length, reducedMotion, speedPxPerSecDesktop, speedPxPerSecMobile]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || reducedMotion || typeof el.animate !== 'function') {
      animRef.current?.cancel();
      animRef.current = null;
      return;
    }

    const fromX = direction === 'left' ? '0%' : '-33.3333%';
    const toX = direction === 'left' ? '-33.3333%' : '0%';

    const anim = el.animate(
      [{ transform: `translate3d(${fromX}, 0, 0)` }, { transform: `translate3d(${toX}, 0, 0)` }],
      {
        duration: durationMs,
        iterations: Infinity,
        easing: 'linear',
      }
    );
    animRef.current = anim;

    return () => {
      anim.cancel();
      animRef.current = null;
    };
  }, [direction, durationMs, reducedMotion, items.length]);

  useEffect(() => {
    const anim = animRef.current;
    if (!anim) return;
    if (paused) anim.pause();
    else anim.play();
  }, [paused]);

  const copies = reducedMotion ? [0] : [0, 1, 2];

  return (
    <div className={reducedMotion ? 'lx-marquee-snap-fallback pb-2' : 'overflow-hidden'}>
      <div
        ref={trackRef}
        className={`flex gap-[14px] ${reducedMotion ? 'w-max px-4' : 'w-max'}`}
        style={{ willChange: reducedMotion ? 'auto' : 'transform' }}
      >
        {copies.map((copyIdx) => (
          <div
            key={copyIdx}
            ref={copyIdx === 0 ? firstCopyRef : undefined}
            className="flex gap-[14px] shrink-0"
            aria-hidden={copyIdx > 0}
          >
            {items.map((review, idx) => (
              <article
                key={`${review.id || idx}-${copyIdx}`}
                className="w-[220px] h-[104px] md:w-[280px] md:h-[116px] shrink-0 rounded-[20px] border border-[var(--line)] bg-[var(--card)] px-3.5 py-2.5 md:px-4 md:py-3 shadow-xs text-left flex flex-col justify-between"
              >
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(review.rating || 5)].map((_, sIdx) => (
                    <Star key={sIdx} size={11} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-[11px] md:text-xs leading-snug text-[var(--ink-2)] line-clamp-2">
                  &ldquo;{truncateAtWord(review.quote, 92)}&rdquo;
                </p>

                <div className="text-[11px] md:text-xs font-semibold text-[var(--ink)] truncate">
                  {review.author}
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { reviews, averageRating, totalCount } = useReviews();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeMediaPreview, setActiveMediaPreview] = useState<{
    url: string;
    type: 'image' | 'video';
  } | null>(null);
  const [holdPaused, setHoldPaused] = useState(false);
  const [spacePaused, setSpacePaused] = useState(false);
  const [isOffscreen, setIsOffscreen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const marqueeRegionRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (activeIndex >= reviews.length && reviews.length > 0) {
      setActiveIndex(0);
    }
  }, [reviews.length, activeIndex]);

  useEffect(() => {
    const el = marqueeRegionRef.current;
    if (!el) return;
    const cleanup = observeOffscreenLoop(el);
    const mo = new MutationObserver(() => {
      setIsOffscreen(el.dataset.offscreen === 'true');
    });
    mo.observe(el, { attributes: true, attributeFilter: ['data-offscreen'] });
    return () => {
      cleanup();
      mo.disconnect();
    };
  }, []);

  const handleOpenPreview = (
    e: React.MouseEvent<HTMLButtonElement>,
    media: { url: string; type: 'image' | 'video' }
  ) => {
    triggerElementRef.current = e.currentTarget;
    setActiveMediaPreview(media);
  };

  const handleClosePreview = () => {
    setActiveMediaPreview(null);
    setTimeout(() => {
      triggerElementRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    if (!activeMediaPreview) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimeout = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClosePreview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(focusTimeout);
    };
  }, [activeMediaPreview]);

  const totalReviews = reviews.length;
  const activeReview = reviews[activeIndex] || reviews[0];
  const prevReview = () => {
    if (totalReviews <= 1) return;
    setActiveIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };
  const nextReview = () => {
    if (totalReviews <= 1) return;
    setActiveIndex((prev) => (prev + 1) % totalReviews);
  };

  const rowTwoItems = reviews.length > 1 ? [...reviews.slice(1), reviews[0]] : reviews;
  const isMarqueePaused = holdPaused || spacePaused || isOffscreen;

  return (
    <section
      id="testimonials"
      className="lx-band-white relative overflow-hidden border-t border-[var(--line)] transition-colors duration-500 pt-6 pb-16"
    >
      <GraffitiLayer
        variant="testimonials"
        surface="adaptive"
        words={['TRUSTED', 'CLIENTS', 'DELIVERED']}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <Reveal variant="rise">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[var(--line)]">
            <div>
              <span className="inline-block text-[11px] font-mono uppercase tracking-[0.22em] text-[var(--accent)] font-bold mb-2">
                Verified Client Proof
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--ink)]">
                <AnimatedText text="Trusted by Drivers Nationwide" variant="blur-in" />
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--line)] bg-[var(--card)]">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-serif text-base font-normal tabular-nums text-[var(--ink)]">
                  {averageRating} / 5.0
                </span>
                <span className="text-xs font-mono text-[var(--ink-2)] tabular-nums">
                  ({totalCount} reviews)
                </span>
              </div>

              <RippleButton
                type="button"
                variant="primary"
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 text-xs font-mono uppercase tracking-wider"
              >
                <PlusCircle size={14} />
                <span>Leave a Review</span>
              </RippleButton>
            </div>
          </div>
        </Reveal>

        {/* Static Manual Testimonial Carousel (No Auto-Play) */}
        {activeReview && (
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured client testimonials"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevReview();
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextReview();
              }
            }}
            className="max-w-4xl mx-auto mb-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-[24px]"
          >
            <article className="lx-card p-6 sm:p-8 flex flex-col justify-between gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(activeReview.rating || 5)].map((_, sIdx) => (
                    <Star key={sIdx} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {activeReview.verified && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 rounded-full">
                    <ShieldCheck size={12} /> Verified Delivery
                  </span>
                )}
              </div>

              <blockquote className="font-serif text-lg sm:text-xl md:text-2xl font-normal leading-relaxed text-[var(--ink)]">
                &ldquo;{activeReview.quote}&rdquo;
              </blockquote>

              <div className="pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-sm sm:text-base text-[var(--ink)]">
                    {activeReview.author}
                  </div>
                  <div className="text-xs text-[var(--ink-2)]">{activeReview.role}</div>
                  {activeReview.service && (
                    <div className="text-[11px] font-mono text-[var(--accent)] mt-0.5">
                      {activeReview.service}
                    </div>
                  )}
                </div>

                {activeReview.mediaUrl && (
                  <button
                    type="button"
                    onClick={(e) =>
                      handleOpenPreview(e, {
                        url: activeReview.mediaUrl!,
                        type: activeReview.mediaType === 'video' ? 'video' : 'image',
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] rounded-full transition-colors cursor-pointer text-[var(--ink)] self-start sm:self-auto"
                  >
                    {activeReview.mediaType === 'video' ? (
                      <Video size={13} className="text-[var(--accent)]" />
                    ) : (
                      <ImageIcon size={13} className="text-[var(--accent)]" />
                    )}
                    <span>
                      View Client Proof ({activeReview.mediaType === 'video' ? 'Video' : 'Photo'})
                    </span>
                  </button>
                )}
              </div>
            </article>

            {totalReviews > 1 && (
              <div className="flex items-center justify-between gap-4 mt-4 px-1">
                <button
                  type="button"
                  onClick={prevReview}
                  aria-label="Previous testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-2 overflow-x-auto max-w-[65%] py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {reviews.map((rev, idx) => (
                    <button
                      key={rev.id || idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`View review ${idx + 1} of ${totalReviews}`}
                      aria-current={idx === activeIndex ? 'true' : undefined}
                      className={`h-2.5 shrink-0 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeIndex
                          ? 'w-7 bg-[var(--accent)]'
                          : 'w-2.5 bg-[var(--line)] hover:bg-[var(--ink-2)]'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={nextReview}
                  aria-label="Next testimonial"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dual-row opposite-direction WAAPI mini-card marquee (Hold to pause; Spacebar toggles pause) */}
      <div
        ref={marqueeRegionRef}
        role="region"
        aria-label="Client testimonials marquee"
        tabIndex={0}
        data-paused={isMarqueePaused ? 'true' : 'false'}
        onPointerDown={() => setHoldPaused(true)}
        onPointerUp={() => setHoldPaused(false)}
        onPointerCancel={() => setHoldPaused(false)}
        onPointerLeave={() => setHoldPaused(false)}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.code === 'Space' || e.key === ' ') {
            e.preventDefault();
            setSpacePaused((prev) => !prev);
          }
        }}
        className={`lx-marquee-touch relative z-10 space-y-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
          reducedMotion ? '' : 'lx-marquee-mask'
        }`}
      >
        <ReviewMarqueeRow
          items={reviews}
          direction="left"
          speedPxPerSecDesktop={45}
          speedPxPerSecMobile={35}
          paused={isMarqueePaused}
          reducedMotion={reducedMotion}
        />

        {reviews.length > 1 && (
          <ReviewMarqueeRow
            items={rowTwoItems}
            direction="right"
            speedPxPerSecDesktop={45}
            speedPxPerSecMobile={35}
            paused={isMarqueePaused}
            reducedMotion={reducedMotion}
          />
        )}
      </div>

      {/* Media Lightbox Modal */}
      {activeMediaPreview && (
        <div
          onClick={handleClosePreview}
          role="dialog"
          aria-modal="true"
          aria-label="Client review media proof"
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClosePreview();
            }}
            aria-label="Close image"
            style={{
              top: 'max(16px, env(safe-area-inset-top, 16px))',
              right: 'max(16px, env(safe-area-inset-right, 16px))',
            }}
            className="fixed z-[65] w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/75 hover:bg-black text-white border border-white/25 flex items-center justify-center transition-all cursor-pointer shadow-xl"
          >
            <X size={20} className="text-white" />
          </button>

          <div
            className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {activeMediaPreview.type === 'video' ? (
              <video
                src={activeMediaPreview.url}
                controls
                autoPlay
                className="max-h-[80vh] w-auto rounded-2xl"
              />
            ) : (
              <img
                src={activeMediaPreview.url}
                alt="Client Review Photo"
                className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl"
              />
            )}
          </div>
        </div>
      )}

      <LeaveReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
