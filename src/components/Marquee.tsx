import { useEffect, useRef } from 'react';
import { MARQUEE_ITEMS } from '../constants';
import { observeOffscreenLoop } from '../motion/scrollEngine';

export default function Marquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    return observeOffscreenLoop(el);
  }, []);

  return (
    <div
      ref={containerRef}
      className="lx-band-dark border-y border-[var(--line)] py-5 overflow-hidden transition-colors duration-500"
    >
      <div className="lx-marquee-mask overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap w-max">
          {items.map((item, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-6 px-8 text-xs sm:text-sm font-mono tracking-[0.22em] uppercase"
            >
              <span>{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
