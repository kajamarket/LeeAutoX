import React from 'react';

export type GraffitiVariant =
  | 'heroShowcase'
  | 'whyChooseUs'
  | 'store'
  | 'timeline'
  | 'testimonials'
  | 'social'
  | 'faq'
  | 'footer'
  | 'pageHeader';

export interface GraffitiLayerProps {
  variant: GraffitiVariant;
  /** Surface mode: 'dark' forces white ink, 'adaptive' switches black/slate-900 (light) vs white (dark), 'inverted' uses text-background (e.g. Phase1Preloader) */
  surface?: 'dark' | 'adaptive' | 'inverted';
  /** Optional custom word/phrase overrides */
  words?: string[];
  /** Optional sector label for pageHeader ("LEEAUTOX // [SECTOR]") */
  sector?: string;
  /** Optional brand label for pageHeader/footer */
  brand?: string;
  /** Optional status prefix for timeline stamp ("[STATUS]//W1") */
  statusCode?: string;
  /** Optional topic for timeline light symbol ("++++ [TOPIC] ++++") */
  topic?: string;
  /** Optional year for footer ("EST.[YEAR]") */
  year?: string | number;
  className?: string;
}

const CONTAINER_BASE =
  'absolute inset-0 z-0 pointer-events-none select-none overflow-hidden transition-colors duration-500';

export default function GraffitiLayer({
  variant,
  surface = 'adaptive',
  words,
  sector = 'MOTORS',
  brand = 'LEEAUTOX',
  statusCode = 'CLEARED',
  topic = 'LOGISTICS',
  year = '2024',
  className = '',
}: GraffitiLayerProps) {
  const isDarkForced = surface === 'dark';
  const isInverted = surface === 'inverted';

  const standardInk = isInverted
    ? 'text-background'
    : isDarkForced
      ? 'text-white'
      : 'text-black dark:text-white';

  const standardBarBg = isInverted
    ? 'bg-background'
    : isDarkForced
      ? 'bg-white'
      : 'bg-black dark:bg-white';

  const standardBorder = isInverted
    ? 'border-background'
    : isDarkForced
      ? 'border-white'
      : 'border-black dark:border-white';

  const ringBorder = isInverted
    ? 'border-background/40'
    : isDarkForced
      ? 'border-white/40'
      : 'border-black/40 dark:border-white/40';

  if (variant === 'heroShowcase') {
    const topWord = words?.[0] || 'AUCTIONS';
    const bottomWord = words?.[1] || 'EXPORTS';
    return (
      <div
        aria-hidden="true"
        className={`${CONTAINER_BASE} opacity-[0.03] text-white ${className}`.trim()}
      >
        <div className="absolute top-10 -left-20 text-[20vw] font-black leading-none tracking-tighter rotate-[-10deg] whitespace-nowrap">
          {topWord}
        </div>
        <div className="absolute bottom-10 -right-40 text-[18vw] font-serif font-bold leading-none rotate-[8deg] whitespace-nowrap">
          {bottomWord}
        </div>
      </div>
    );
  }

  if (variant === 'whyChooseUs' || variant === 'testimonials') {
    const isTestimonials = variant === 'testimonials';
    const word1 = words?.[0] || (isTestimonials ? 'TRUSTED' : 'VERIFIED');
    const word2 = words?.[1] || (isTestimonials ? 'CLIENTS' : 'DIRECT');
    const word3 = words?.[2] || (isTestimonials ? 'DELIVERED' : 'LOGISTICS');
    const serial = isTestimonials ? '002//X' : '001//X';

    return (
      <div
        aria-hidden="true"
        className={`${CONTAINER_BASE} opacity-[0.03] ${standardInk} ${className}`.trim()}
      >
        {/* 3-tier diagonal typography */}
        <div className="absolute -top-10 -left-20 text-[20vw] font-black leading-none tracking-tighter rotate-[-15deg] whitespace-nowrap">
          {word1}
        </div>
        <div className="absolute top-1/2 -right-40 text-[18vw] font-serif font-bold leading-none rotate-[12deg] whitespace-nowrap">
          {word2}
        </div>
        <div className="absolute -bottom-20 -left-10 text-[25vw] font-black leading-none tracking-tighter rotate-[-5deg] whitespace-nowrap">
          {word3}
        </div>

        {/* 5 micro-geometry blueprint accents */}
        <div className="absolute top-[10%] left-[30%] rotate-[45deg] flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`w-[1px] h-32 ${standardBarBg}`} />
          ))}
        </div>

        <div className="absolute bottom-[20%] right-[20%] grid grid-cols-4 gap-4 opacity-50">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full ${standardBarBg}`} />
          ))}
        </div>

        <div className="absolute top-[40%] left-[5%] text-[10vw] font-light leading-none rotate-[-10deg] whitespace-nowrap">
          ++++++
        </div>

        <div
          className={`absolute top-[60%] right-[10%] text-[8vw] font-light leading-none rotate-[20deg] border-t pt-2 whitespace-nowrap ${standardBorder}`}
        >
          {serial}
        </div>

        <div
          className={`absolute bottom-[10%] left-[45%] w-40 h-40 border rounded-full rotate-[30deg] ${ringBorder}`}
        />
      </div>
    );
  }

  if (variant === 'store') {
    const word1 = words?.[0] || 'GENUINE';
    const word2 = words?.[1] || 'OEM PARTS';
    return (
      <div
        aria-hidden="true"
        className={`${CONTAINER_BASE} opacity-[0.03] ${standardInk} ${className}`.trim()}
      >
        <div className="absolute top-1/4 -right-20 text-[20vw] font-black leading-none tracking-tighter rotate-[15deg] whitespace-nowrap">
          {word1}
        </div>
        <div className="absolute -bottom-10 -left-20 text-[18vw] font-serif font-bold leading-none rotate-[-10deg] whitespace-nowrap">
          {word2}
        </div>

        {/* Single accent: 5 parallel hatch lines */}
        <div className="absolute top-[10%] left-[20%] rotate-[-45deg] flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`w-[1px] h-32 ${standardBarBg}`} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'timeline') {
    const phrase1 = words?.[0] || 'PORT CLEAR';
    const phrase2 = words?.[1] || 'TRANSIT';
    const phrase3 = words?.[2] || 'ROAD READY';

    const timelineInk = isDarkForced
      ? 'text-white opacity-[0.015]'
      : 'text-slate-900 opacity-[0.018] dark:text-white dark:opacity-[0.015]';

    const timelineHatchBg = isDarkForced
      ? 'bg-white/20'
      : 'bg-slate-900 dark:bg-white/20';

    const timelineDotBg = isDarkForced
      ? 'bg-white'
      : 'bg-slate-900 dark:bg-white';

    const timelineBorder = isDarkForced
      ? 'border-white'
      : 'border-slate-900 dark:border-white';

    const timelineRing = isDarkForced
      ? 'border-white/40'
      : 'border-slate-900/40 dark:border-white/40';

    return (
      <div
        aria-hidden="true"
        className={`${CONTAINER_BASE} ${timelineInk} ${className}`.trim()}
      >
        <div className="absolute top-10 -left-10 text-[15vw] font-black leading-none tracking-tighter rotate-[-10deg] whitespace-nowrap">
          {phrase1}
        </div>
        <div className="absolute top-1/3 -right-20 text-[18vw] font-serif font-bold leading-none rotate-[8deg] whitespace-nowrap">
          {phrase2}
        </div>
        <div className="absolute -bottom-10 -left-5 text-[22vw] font-black leading-none tracking-tighter rotate-[-3deg] whitespace-nowrap">
          {phrase3}
        </div>

        {/* Scaled accents */}
        <div className="absolute top-[20%] left-[25%] rotate-[30deg] flex gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`w-[1px] h-36 ${timelineHatchBg}`} />
          ))}
        </div>

        <div className="absolute bottom-[30%] right-[15%] grid grid-cols-5 gap-3 opacity-50">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${timelineDotBg}`} />
          ))}
        </div>

        <div className="absolute top-[50%] left-[6%] text-[8vw] font-light leading-none tracking-widest rotate-[15deg] whitespace-nowrap">
          {`++++ ${topic} ++++`}
        </div>

        <div
          className={`absolute top-[70%] right-[5%] text-[7vw] font-light leading-none rotate-[-12deg] border-t pt-3 whitespace-nowrap ${timelineBorder}`}
        >
          {`${statusCode}//W1`}
        </div>

        <div
          className={`absolute bottom-[5%] left-[40%] w-48 h-48 border rounded-full rotate-[15deg] ${timelineRing}`}
        />
      </div>
    );
  }

  if (variant === 'social') {
    const singleWord = words?.[0] || 'ARRIVALS';
    return (
      <div
        aria-hidden="true"
        className={`${CONTAINER_BASE} opacity-[0.03] ${standardInk} ${className}`.trim()}
      >
        <div className="absolute top-1/4 left-1/4 font-serif text-[20rem] font-black leading-none -rotate-12 whitespace-nowrap">
          {singleWord}
        </div>
      </div>
    );
  }

  if (variant === 'faq') {
    const word1 = words?.[0] || 'ANSWERS';
    const word2 = words?.[1] || 'CLARITY';
    const word3 = words?.[2] || 'GUIDANCE';
    return (
      <div
        aria-hidden="true"
        className={`${CONTAINER_BASE} opacity-[0.03] ${standardInk} ${className}`.trim()}
      >
        {/* Mirrored 3-tier diagonal typography */}
        <div className="absolute -top-10 -left-20 text-[20vw] font-black leading-none tracking-tighter rotate-[15deg] whitespace-nowrap">
          {word1}
        </div>
        <div className="absolute top-1/2 -right-40 text-[18vw] font-serif font-bold leading-none rotate-[-12deg] whitespace-nowrap">
          {word2}
        </div>
        <div className="absolute -bottom-20 -left-10 text-[25vw] font-black leading-none tracking-tighter rotate-[5deg] whitespace-nowrap">
          {word3}
        </div>

        {/* Mirrored micro-geometry accents (no orbital ring) */}
        <div className="absolute top-[10%] right-[30%] rotate-[-45deg] flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`w-[1px] h-32 ${standardBarBg}`} />
          ))}
        </div>

        <div className="absolute bottom-[40%] left-[20%] grid grid-cols-4 gap-4 opacity-50">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full ${standardBarBg}`} />
          ))}
        </div>

        <div className="absolute top-[20%] right-[5%] text-[10vw] font-light leading-none rotate-[10deg] whitespace-nowrap">
          //////
        </div>

        <div
          className={`absolute bottom-[60%] left-[10%] text-[8vw] font-light leading-none rotate-[-20deg] border-b pb-2 whitespace-nowrap ${standardBorder}`}
        >
          003//X
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    const brandName = words?.[0] || brand;
    const categoryWord = words?.[1] || 'VEHICLES';
    return (
      <div
        aria-hidden="true"
        className={`${CONTAINER_BASE} opacity-[0.03] ${standardInk} ${className}`.trim()}
      >
        <div className="absolute top-0 left-0 text-[15vw] font-black leading-none tracking-tighter rotate-[-5deg] whitespace-nowrap">
          {brandName}
        </div>
        <div className="absolute bottom-10 right-0 text-[12vw] font-serif font-bold leading-none rotate-[8deg] whitespace-nowrap">
          {categoryWord}
        </div>

        {/* Footer accents */}
        <div className="absolute top-[20%] left-[20%] flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`w-10 h-[1px] ${standardBarBg}`} />
          ))}
        </div>

        <div className="absolute bottom-[30%] left-[10%] grid grid-cols-2 gap-2 opacity-30">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`w-2 h-2 border ${standardBorder}`} />
          ))}
        </div>

        <div className="absolute top-[40%] right-[15%] text-[5vw] font-mono leading-none rotate-[45deg] whitespace-nowrap">
          {`EST.${year}`}
        </div>
      </div>
    );
  }

  // variant === 'pageHeader'
  const headerInk = isDarkForced
    ? 'text-white opacity-[0.02]'
    : 'text-slate-900 dark:text-white opacity-[0.02]';

  return (
    <div
      aria-hidden="true"
      className={`${CONTAINER_BASE} ${headerInk} ${className}`.trim()}
    >
      <div className="absolute top-1/2 -left-10 text-[12vw] font-black leading-none tracking-tight rotate-[-5deg] whitespace-nowrap">
        {`${brand} // ${sector}`}
      </div>
    </div>
  );
}
