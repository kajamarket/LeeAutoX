import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number; // ms per char (default ~18ms for fast typist)
  delay?: number; // ms delay before typing begins
  showCaret?: boolean;
}

/**
 * TypewriterText reveals text letter-by-letter like a fast typist when entering viewport.
 * Features:
 * - Word-processor style blinking caret that stays blinking indefinitely after typing finishes
 * - Ghost text to reserve exact final height and prevent any layout shift
 * - prefers-reduced-motion check to display immediately
 * - Accessible sr-only text for screen readers
 */
export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  className = '',
  speed = 18,
  delay = 100,
  showCaret = true,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [displayedChars, setDisplayedChars] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setPrefersReducedMotion(true);
      setDisplayedChars(text.length);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    // Trigger once when element enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          observer.disconnect();
          setTimeout(() => {
            setHasStarted(true);
          }, delay);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [text, delay]);

  useEffect(() => {
    if (!hasStarted || prefersReducedMotion) return;

    if (displayedChars < text.length) {
      const timer = setTimeout(() => {
        setDisplayedChars((prev) => prev + 1);
      }, speed + (Math.random() * 8 - 4));
      return () => clearTimeout(timer);
    }
  }, [hasStarted, displayedChars, text.length, speed, prefersReducedMotion]);

  const visibleText = text.slice(0, displayedChars);

  return (
    <span ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {/* Screen Reader Accessible Full Text */}
      <span className="sr-only">{text}</span>

      {/* Ghost text reserving exact final height & line wrapping to prevent layout shift */}
      <span className="invisible select-none pointer-events-none block" aria-hidden="true">
        {text}
        {showCaret && <span className="inline-block w-[2px] ml-1">&#8203;</span>}
      </span>

      {/* Visible Typing Text with Word-Processor Style Blinking Caret */}
      <span className="absolute inset-0 top-0 left-0 block" aria-hidden="true">
        {visibleText}
        {showCaret && (
          <span
            className="inline-block w-[2px] h-[1.15em] bg-[#2B59FF] align-middle ml-0.5 animate-caret-pulse font-normal"
            style={{
              verticalAlign: '-0.15em',
            }}
          />
        )}
      </span>
    </span>
  );
};

export default TypewriterText;
