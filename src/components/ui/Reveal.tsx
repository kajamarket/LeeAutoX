import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../motion/scrollEngine';

export type RevealVariant =
  | 'rise'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'clip-x'
  | 'clip-y'
  | 'isometric'
  | 'opacity'
  | 'blur';

interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  col?: number;
  row?: number;
  immediate?: boolean;
  className?: string;
}

export default function Reveal({
  children,
  variant = 'rise',
  delay = 0,
  col,
  row,
  immediate = false,
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState<boolean>(() => immediate || prefersReducedMotion());

  useEffect(() => {
    if (shown) return;
    if (prefersReducedMotion()) {
      setShown(true);
      return;
    }

    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-6% 0px', threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  // Diagonal stagger (col + row) * 70ms when provided, capped strictly at 700ms max cumulative delay
  const rawDelay =
    col !== undefined || row !== undefined ? ((col ?? 0) + (row ?? 0)) * 70 : delay;
  const effectiveDelay = prefersReducedMotion() ? 0 : Math.min(Math.max(0, rawDelay), 700);

  return (
    <div
      ref={ref}
      data-state={shown ? 'shown' : 'hidden'}
      data-variant={variant}
      className={`lx-reveal ${className}`.trim()}
      style={effectiveDelay > 0 ? { transitionDelay: `${effectiveDelay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
