import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../motion/scrollEngine';

export type TextVariant =
  | 'blur-in'
  | 'mask-rise'
  | 'fade-up'
  | 'zoom-reveal'
  | 'rotating-text'
  | 'typewriter'
  | 'tracking-expanding'
  | 'word-stagger'
  | 'wave'
  | 'outline-fill'
  | 'underline-squiggle'
  | 'scramble'
  | 'counter'
  | 'gradient-shine'
  | 'split-apart'
  | 'letter-flip';

interface AnimatedTextProps {
  text: string;
  variant?: TextVariant;
  trigger?: 'mount' | 'view';
  delay?: number;
  words?: string[];
  className?: string;
}

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export default function AnimatedText({
  text,
  variant = 'blur-in',
  trigger = 'view',
  delay = 0,
  words,
  className = '',
}: AnimatedTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState<boolean>(() => prefersReducedMotion() || trigger === 'mount');
  const [wordIdx, setWordIdx] = useState(0);
  const [typedLen, setTypedLen] = useState(() => (prefersReducedMotion() ? text.length : 0));
  const [scrambled, setScrambled] = useState(text);
  const [countVal, setCountVal] = useState<string>(text);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(true);
      setTypedLen(text.length);
      setScrambled(text);
      setCountVal(text);
      return;
    }

    if (trigger === 'mount') {
      const id = window.setTimeout(() => setShown(true), Math.max(16, delay));
      return () => window.clearTimeout(id);
    }

    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          obs.disconnect();
        }
      },
      { rootMargin: '-6% 0px', threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [trigger, delay, text.length]);

  useEffect(() => {
    if (variant !== 'rotating-text' || !words?.length || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setWordIdx((prev) => (prev + 1) % words.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [variant, words]);

  useEffect(() => {
    if (variant !== 'typewriter' || !shown || prefersReducedMotion()) {
      if (variant === 'typewriter' && prefersReducedMotion()) setTypedLen(text.length);
      return;
    }
    let idx = 0;
    const step = Math.max(18, Math.round(700 / Math.max(text.length, 1)));
    const id = window.setInterval(() => {
      idx += 1;
      setTypedLen(idx);
      if (idx >= text.length) window.clearInterval(id);
    }, step);
    return () => window.clearInterval(id);
  }, [variant, shown, text]);

  useEffect(() => {
    if (variant !== 'scramble' || !shown || prefersReducedMotion()) {
      setScrambled(text);
      return;
    }
    let frame = 0;
    const totalFrames = 14;
    const id = window.setInterval(() => {
      frame += 1;
      const revealCount = Math.floor((frame / totalFrames) * text.length);
      const next = text
        .split('')
        .map((ch, idx) => {
          if (ch === ' ') return ' ';
          if (idx < revealCount) return ch;
          return SCRAMBLE_CHARS[(frame * 7 + idx * 3) % SCRAMBLE_CHARS.length];
        })
        .join('');
      setScrambled(next);
      if (frame >= totalFrames) {
        setScrambled(text);
        window.clearInterval(id);
      }
    }, 45);
    return () => window.clearInterval(id);
  }, [variant, shown, text]);

  useEffect(() => {
    if (variant !== 'counter' || !shown || prefersReducedMotion()) {
      setCountVal(text);
      return;
    }
    const match = text.match(/^([^0-9]*)([0-9,.]+)(.*)$/);
    if (!match) {
      setCountVal(text);
      return;
    }
    const [, prefix, numRaw, suffix] = match;
    const target = Number(numRaw.replace(/,/g, ''));
    if (!Number.isFinite(target)) {
      setCountVal(text);
      return;
    }
    const hasDecimal = numRaw.includes('.');
    const start = performance.now();
    const duration = 750;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      const formatted = hasDecimal
        ? val.toFixed(1)
        : Math.round(val).toLocaleString();
      setCountVal(`${prefix}${formatted}${suffix}`);
      if (p < 1) raf = window.requestAnimationFrame(step);
      else setCountVal(text);
    };
    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [variant, shown, text]);

  const state = shown ? 'shown' : 'hidden';

  if (variant === 'mask-rise') {
    return (
      <span ref={ref} data-state={state} className={`lx-at lx-at-mask-clip ${className}`.trim()}>
        <span className="lx-at-mask-inner" style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
          {text}
        </span>
      </span>
    );
  }

  if (variant === 'blur-in') {
    return (
      <span
        ref={ref}
        data-state={state}
        className={`lx-at lx-at-blur ${className}`.trim()}
        style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      >
        {text}
      </span>
    );
  }

  if (variant === 'fade-up') {
    return (
      <span
        ref={ref}
        data-state={state}
        className={`lx-at lx-at-fade-up ${className}`.trim()}
        style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      >
        {text}
      </span>
    );
  }

  if (variant === 'zoom-reveal') {
    return (
      <span
        ref={ref}
        data-state={state}
        className={`lx-at lx-at-zoom ${className}`.trim()}
        style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      >
        {text}
      </span>
    );
  }

  if (variant === 'tracking-expanding') {
    return (
      <span ref={ref} data-state={state} className={`lx-at lx-at-tracking ${className}`.trim()}>
        {text}
      </span>
    );
  }

  if (variant === 'rotating-text') {
    const activeWord = words?.length ? words[wordIdx] : text;
    return (
      <span ref={ref} data-state="shown" className={`lx-at transition-opacity duration-300 ${className}`.trim()}>
        {activeWord}
      </span>
    );
  }

  if (variant === 'typewriter') {
    return (
      <span ref={ref} data-state={state} className={`lx-at ${className}`.trim()}>
        {text.slice(0, typedLen)}
      </span>
    );
  }

  if (variant === 'word-stagger') {
    const tokens = text.split(' ');
    return (
      <span ref={ref} data-state={state} className={`lx-at ${className}`.trim()}>
        {tokens.map((w, idx) => (
          <React.Fragment key={idx}>
            <span
              className="lx-at-word"
              style={{ transitionDelay: `${delay + idx * 42}ms` }}
            >
              {w}
            </span>
            {idx < tokens.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </span>
    );
  }

  if (variant === 'wave') {
    return (
      <span ref={ref} data-state={state} className={`lx-at ${className}`.trim()}>
        {text.split('').map((ch, idx) => (
          <span
            key={idx}
            className="lx-at-wave-char"
            style={{ animationDelay: `${delay + idx * 24}ms` }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </span>
    );
  }

  if (variant === 'letter-flip') {
    return (
      <span ref={ref} data-state={state} className={`lx-at ${className}`.trim()}>
        {text.split('').map((ch, idx) => (
          <span
            key={idx}
            className="lx-at-flip-char"
            style={{ transitionDelay: `${delay + idx * 20}ms` }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </span>
    );
  }

  if (variant === 'outline-fill') {
    return (
      <span ref={ref} data-state={state} className={`lx-at lx-at-outline-wrap ${className}`.trim()}>
        <span aria-hidden="true">{text}</span>
        <span className="lx-at-outline-fill">{text}</span>
      </span>
    );
  }

  if (variant === 'underline-squiggle') {
    return (
      <span ref={ref} data-state={state} className={`lx-at lx-at-squiggle-wrap ${className}`.trim()}>
        <span>{text}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 220 12"
          fill="none"
          className="absolute left-0 right-0 -bottom-0.5 w-full h-2.5 text-[var(--accent)]"
          preserveAspectRatio="none"
        >
          <path
            d="M2 7 C40 2, 75 11, 112 6 C148 1, 185 10, 218 5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="lx-at-squiggle-path"
          />
        </svg>
      </span>
    );
  }

  if (variant === 'split-apart') {
    const mid = Math.ceil(text.length / 2);
    return (
      <span ref={ref} data-state={state} className={`lx-at ${className}`.trim()}>
        <span className="lx-at-split-left">{text.slice(0, mid)}</span>
        <span className="lx-at-split-right">{text.slice(mid)}</span>
      </span>
    );
  }

  if (variant === 'gradient-shine') {
    return (
      <span ref={ref} data-state={state} className={`lx-at lx-at-gradient-shine ${className}`.trim()}>
        {text}
      </span>
    );
  }

  if (variant === 'counter') {
    return (
      <span ref={ref} data-state={state} className={`lx-at tabular-nums ${className}`.trim()}>
        {countVal}
      </span>
    );
  }

  return (
    <span ref={ref} data-state={state} className={`lx-at ${className}`.trim()}>
      {scrambled}
    </span>
  );
}
