import React from 'react';

interface Icon360Props {
  size?: number;
  className?: string;
}

/**
 * 360° Ring and Arrow Icon
 * Recognizable circular perspective ring with wrap-around arrow.
 */
export default function Icon360({ size = 20, className = '' }: Icon360Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* 360 Ring with Arrowhead */}
      <path d="M21.5 12.5A9.5 9.5 0 1 1 18.7 5.8L21.5 8" />
      <polyline points="21.5 3.5 21.5 8 17 8" />
      {/* Centered 360 Text */}
      <text
        x="11.5"
        y="13.8"
        fontSize="5.8"
        fontWeight="800"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        letterSpacing="-0.02em"
      >
        360°
      </text>
    </svg>
  );
}
