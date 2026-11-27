// Shared singleton rAF + passive scroll engine with dt-smoothed CSS custom properties (--p, --i).
// Batches all DOM reads before DOM writes per frame and pauses offscreen loops via IntersectionObserver.

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface TrackedEntry {
  el: HTMLElement;
  current: number;
  target: number;
  rectTop: number;
  rectHeight: number;
}

const tracked = new Map<HTMLElement, TrackedEntry>();
let listenersAttached = false;
let rafId = 0;
let resizeTimer = 0;
let lastFrameTime = 0;
let viewportHeight = typeof window !== 'undefined' ? window.innerHeight || 900 : 900;

function readAllRects() {
  viewportHeight = window.innerHeight || 900;
  for (const entry of tracked.values()) {
    const rect = entry.el.getBoundingClientRect();
    entry.rectTop = rect.top;
    entry.rectHeight = Math.max(rect.height, 1);
  }
}

function computeTargets() {
  const vh = viewportHeight;
  for (const entry of tracked.values()) {
    // 0..1 normalized progress while element traverses viewport; hero sticky tracks also use 0 when flush at top
    const isHeroTrack = entry.el.hasAttribute('data-hero-scroll');
    let raw: number;
    if (isHeroTrack) {
      const scrollable = Math.max(entry.rectHeight - vh, 1);
      raw = -entry.rectTop / scrollable;
    } else {
      raw = (vh - entry.rectTop) / (vh + entry.rectHeight);
    }
    entry.target = Math.max(0, Math.min(1, raw));
  }
}

function stepFrame(now: number) {
  rafId = 0;
  if (tracked.size === 0) return;

  const dt = lastFrameTime ? Math.min(0.05, Math.max(0.001, (now - lastFrameTime) / 1000)) : 0.016;
  lastFrameTime = now;
  const k = 1 - Math.exp(-dt / 0.35);

  // 1. Batch all DOM reads first
  readAllRects();
  computeTargets();

  // 2. Batch all CSS variable writes
  let needsAnotherFrame = false;
  for (const entry of tracked.values()) {
    const delta = entry.target - entry.current;
    if (Math.abs(delta) < 0.0008) {
      if (entry.current !== entry.target) {
        entry.current = entry.target;
        entry.el.style.setProperty('--p', entry.current.toFixed(4));
        entry.el.style.setProperty('--i', Math.min(1, entry.current / 0.6).toFixed(4));
        entry.el.dataset.scrollActive = entry.current > 0.002 ? 'true' : 'false';
      }
    } else {
      entry.current += delta * k;
      entry.el.style.setProperty('--p', entry.current.toFixed(4));
      entry.el.style.setProperty('--i', Math.min(1, entry.current / 0.6).toFixed(4));
      entry.el.dataset.scrollActive = entry.current > 0.002 ? 'true' : 'false';
      needsAnotherFrame = true;
    }
  }

  if (needsAnotherFrame) {
    rafId = window.requestAnimationFrame(stepFrame);
  } else {
    lastFrameTime = 0;
  }
}

function scheduleTick() {
  if (!rafId && tracked.size > 0 && !prefersReducedMotion()) {
    rafId = window.requestAnimationFrame(stepFrame);
  }
}

function onScroll() {
  scheduleTick();
}

function onResize() {
  if (resizeTimer) window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    viewportHeight = window.innerHeight || 900;
    scheduleTick();
  }, 100);
}

function ensureGlobalListeners() {
  if (listenersAttached || typeof window === 'undefined') return;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  listenersAttached = true;
}

function cleanupGlobalListenersIfEmpty() {
  if (!listenersAttached || tracked.size > 0 || typeof window === 'undefined') return;
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
  if (rafId) {
    window.cancelAnimationFrame(rafId);
    rafId = 0;
  }
  if (resizeTimer) {
    window.clearTimeout(resizeTimer);
    resizeTimer = 0;
  }
  listenersAttached = false;
  lastFrameTime = 0;
}

export function registerScrollTrack(el: HTMLElement): () => void {
  if (typeof window === 'undefined' || prefersReducedMotion()) {
    el.style.setProperty('--p', '0');
    el.style.setProperty('--i', '0');
    el.dataset.scrollActive = 'false';
    return () => {};
  }

  ensureGlobalListeners();

  const entry: TrackedEntry = {
    el,
    current: 0,
    target: 0,
    rectTop: 0,
    rectHeight: 1,
  };
  tracked.set(el, entry);

  // Initial synchronous snapshot read/write without creating extra scroll listeners
  readAllRects();
  computeTargets();
  entry.current = entry.target;
  el.style.setProperty('--p', entry.current.toFixed(4));
  el.style.setProperty('--i', Math.min(1, entry.current / 0.6).toFixed(4));
  el.dataset.scrollActive = entry.current > 0.002 ? 'true' : 'false';

  return () => {
    tracked.delete(el);
    cleanupGlobalListenersIfEmpty();
  };
}

export function observeOffscreenLoop(el: HTMLElement): () => void {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return () => {};
  }
  const obs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        (e.target as HTMLElement).dataset.offscreen = e.isIntersecting ? 'false' : 'true';
      }
    },
    { rootMargin: '120px 0px', threshold: 0.01 }
  );
  obs.observe(el);
  return () => obs.disconnect();
}
