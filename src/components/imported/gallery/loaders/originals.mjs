import {motifLoaders} from './motifs.mjs';

const originals = [
  {
    key: 'paper-fold',
    name: 'Paper Fold',
    nameZh: '纸张折叠',
    group: 'Geometry',
    description: 'Sheets lift one by one along a diagonal fold, then settle back into place.',
    descriptionZh: '纸片沿对角折痕依次掀起，再落回原位。',
    defaults: {size: 86, color: '#a44333', speed: 2.4},
    darkColor: '#d2d2d7',
    className: 'um-paper-fold',
    parts: ['leaf leaf-back', 'leaf leaf-middle', 'leaf leaf-front'],
    css: `
.um-paper-fold {
  display: grid;
  place-items: center;
  perspective: calc(var(--size) * 1.7);
  transform-style: preserve-3d;
}
.um-paper-fold .leaf {
  grid-area: 1 / 1;
  width: 55%;
  height: 65%;
  border: 1px solid currentColor;
  border-radius: 8% 18% 16% 9%;
  background: color-mix(in srgb, currentColor var(--ink), transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 16%, transparent);
  transform-origin: 8% 88%;
  transform: translate(18%, var(--shift)) rotateZ(-38deg) rotateY(0deg);
  animation: um-open-leaf var(--period) cubic-bezier(.58,.03,.24,.99) var(--delay) infinite;
}
.um-paper-fold .leaf-back { --shift: 14%; --delay: -0.03s; --ink: 20%; }
.um-paper-fold .leaf-middle { --shift: 0%; --delay: calc(var(--period) * -.065); --ink: 37%; }
.um-paper-fold .leaf-front { --shift: -14%; --delay: calc(var(--period) * -.13); --ink: 67%; }
.um-paper-fold .leaf-front::after {
  content: '';
  position: absolute;
  inset: 16% 20% 66%;
  border-block: 1px solid currentColor;
  opacity: .55;
}
@keyframes um-open-leaf {
  0%, 15%, 90%, 100% { transform: translate(18%, var(--shift)) rotateZ(-38deg) rotateY(0deg); }
  49% { transform: translate(22%, calc(var(--shift) * 1.55 - 12%)) rotateZ(-52deg) rotateY(-68deg); }
  72% { transform: translate(18%, var(--shift)) rotateZ(-34deg) rotateY(8deg); }
}
`,
  },
  {
    key: 'signal-return',
    name: 'Signal Return',
    nameZh: '信号回转',
    group: 'Lines',
    description: 'A signal follows the zigzag to the far end and returns along the lower track.',
    descriptionZh: '信号沿折线传到远端，再从下方轨道折返。',
    defaults: {size: 108, color: '#64488c', speed: 2.65},
    darkColor: '#e8e8ed',
    className: 'um-signal-return',
    parts: ['route route-out', 'route route-back', 'terminal terminal-start', 'terminal terminal-end', 'signal'],
    css: `
.um-signal-return .route {
  position: absolute;
  inset: 0;
  background: currentColor;
  clip-path: var(--rail);
  opacity: .28;
}
.um-signal-return .route-out { --rail: polygon(10% 61%, 30.5% 61%, 57.5% 28%, 90% 28%, 90% 30%, 58.5% 30%, 31.5% 63%, 10% 63%); }
.um-signal-return .route-back { --rail: polygon(10% 72%, 39.5% 72%, 66.5% 39%, 90% 39%, 90% 41%, 67.5% 41%, 40.5% 74%, 10% 74%); }
.um-signal-return .terminal {
  position: absolute;
  top: var(--top);
  left: var(--left);
  width: 13%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1px solid currentColor;
  transform: translate(-50%, -50%);
  animation: um-return-ping var(--period) ease-out var(--delay) infinite;
}
.um-signal-return .terminal-start { --top: 67.5%; --left: 10%; --delay: 0s; }
.um-signal-return .terminal-end { --top: 34.5%; --left: 90%; --delay: calc(var(--period) * -.5); }
.um-signal-return .signal {
  position: absolute;
  inset: 0 auto auto 0;
  width: 12%;
  height: 5%;
  border-radius: 50%;
  background: currentColor;
  offset-path: polygon(10% 62%, 31% 62%, 58% 29%, 90% 29%, 90% 40%, 67% 40%, 40% 73%, 10% 73%);
  animation: um-return-trip var(--period) linear infinite;
}
@keyframes um-return-trip {
  0%, 8% { offset-distance: 0%; }
  48%, 58% { offset-distance: 50%; }
  96%, 100% { offset-distance: 100%; }
}
@keyframes um-return-ping {
  0%, 88% { transform: translate(-50%, -50%) scale(.8); opacity: .8; }
  18%, 76% { transform: translate(-50%, -50%) scale(1.6); opacity: .18; }
}
`,
  },
];

export const originalLoaders = [...originals, ...motifLoaders].map(item => ({
  ...item,
  original: true,
  css: `.${item.className} {
  display: block;
  position: relative;
  width: var(--size);
  aspect-ratio: 1;
  color: var(--color);
}
@media (prefers-reduced-motion: reduce) {
  .${item.className} *, .${item.className} *::before, .${item.className} *::after {
    animation-play-state: paused !important;
  }
}
${item.css}`,
}));

export function originalMarkup(item, {size, color, speed}) {
  const parts = item.parts.map(part => `<span class="${part}"></span>`).join('');
  return `<style>${item.css}</style><span class="${item.className}" style="--size:${size}px;--color:${color};--period:${speed}s">${parts}</span>`;
}
