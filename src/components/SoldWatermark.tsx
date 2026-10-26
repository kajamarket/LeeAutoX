import React from 'react';

interface SoldWatermarkProps {
  size?: 'card' | 'hero';
  className?: string;
}

/**
 * Premium ecommerce-style 'SOLD' watermark overlay.
 * Features:
 * - Text: 'SOLD' in pure white with high-contrast text shadow
 * - Background: Semi-transparent frosted glass (backdrop blur + subtle border) keeping the underlying car image visible
 * - Orientation: Diagonally slanted with right side lower than left (clockwise rotation: rotate-[14deg])
 */
export const SoldWatermark: React.FC<SoldWatermarkProps> = ({ size = 'card', className = '' }) => {
  const isHero = size === 'hero';

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className={`transform rotate-[14deg] font-serif font-black tracking-[0.28em] text-white uppercase select-none transition-all ${
          isHero
            ? 'text-3xl sm:text-5xl md:text-6xl px-10 sm:px-16 py-2.5 sm:py-3.5 bg-black/40 backdrop-blur-[3px] border-y-2 border-white/35 shadow-2xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]'
            : 'text-lg sm:text-2xl px-6 sm:px-8 py-1.5 sm:py-2 bg-black/40 backdrop-blur-[2px] border-y border-white/35 shadow-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]'
        }`}
        style={{
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.85)',
        }}
      >
        SOLD
      </div>
    </div>
  );
};

export default SoldWatermark;
