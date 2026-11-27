// UI Moments 原创加载动效（第二批）。图形、路径与 CSS 均由本项目设计，MIT 许可。
const ink = {color: '#434eaa', darkColor: '#bcc4ff'};
const warm = {color: '#a4492f', darkColor: '#ffbd99'};
const sea = {color: '#2f6f86', darkColor: '#9fdcf0'};
const mono = {color: '#18181b', darkColor: '#fafafa'};

export const motifLoaders = [
  {
    key: 'tide-ring',
    name: 'Tide Ring',
    nameZh: '潮环',
    group: 'Rings',
    ...ink,
    speed: 1.6,
    description: 'A rotating arc swells and recedes like the tide.',
    descriptionZh: '旋转的圆弧像潮水一样涨落。',
    parts: ['track', 'arc'],
    css: `
@property --um-sweep { syntax: '<percentage>'; inherits: false; initial-value: 10%; }
.um-tide-ring .track, .um-tide-ring .arc {
  position: absolute;
  inset: 12%;
  border-radius: 50%;
  border: calc(var(--size) * .08) solid currentColor;
}
.um-tide-ring .track { opacity: .16; }
.um-tide-ring .arc {
  -webkit-mask: conic-gradient(#000 var(--um-sweep), transparent 0);
  mask: conic-gradient(#000 var(--um-sweep), transparent 0);
  animation: um-tide-sweep var(--period) cubic-bezier(.55,.1,.35,.95) infinite, um-tide-turn calc(var(--period) * 1.5) linear infinite;
}
@keyframes um-tide-sweep { 0%, 100% { --um-sweep: 8%; } 50% { --um-sweep: 72%; } }
@keyframes um-tide-turn { to { transform: rotate(1turn); } }
`,
  },
  {
    key: 'stack-blocks',
    name: 'Stack Blocks',
    nameZh: '叠块',
    group: 'Geometry',
    ...warm,
    speed: 2.2,
    description: 'Three tiles drop into a stack, then slide out together.',
    descriptionZh: '三块薄片依次落下叠起，再一起滑出。',
    parts: ['block block-1', 'block block-2', 'block block-3'],
    css: `
.um-stack-blocks .block {
  position: absolute;
  left: 32%;
  width: 36%;
  height: 18%;
  border-radius: 12%;
  background: currentColor;
  bottom: var(--rest);
  animation: um-stack-drop var(--period) cubic-bezier(.5,0,.3,1) infinite;
  animation-delay: var(--delay);
  opacity: 0;
}
.um-stack-blocks .block-1 { --rest: 18%; --delay: 0s; }
.um-stack-blocks .block-2 { --rest: 40%; --delay: calc(var(--period) * .12); }
.um-stack-blocks .block-3 { --rest: 62%; --delay: calc(var(--period) * .24); }
.um-stack-blocks .block-2 { filter: opacity(.72); }
.um-stack-blocks .block-3 { filter: opacity(.48); }
@keyframes um-stack-drop {
  0% { transform: translateY(-120%); opacity: 0; }
  10% { opacity: 1; }
  22% { transform: translateY(0) scale(1.08, .86); opacity: 1; }
  30%, 66% { transform: translateY(0); opacity: 1; }
  86%, 100% { transform: translateX(160%); opacity: 0; }
}
`,
  },
  {
    key: 'metronome-dot',
    name: 'Beat Bounce',
    nameZh: '节拍弹跳',
    group: 'Dots',
    ...sea,
    speed: 1.1,
    description: 'A dot bounces between two bars and squashes on contact.',
    descriptionZh: '圆点在两条竖线之间来回弹跳，撞到时会压扁。',
    parts: ['wall wall-left', 'wall wall-right', 'dot'],
    css: `
.um-metronome-dot .wall {
  position: absolute;
  top: 30%;
  width: 5%;
  height: 40%;
  border-radius: 100px;
  background: currentColor;
  opacity: .35;
}
.um-metronome-dot .wall-left { left: 14%; animation: um-meter-hit var(--period) ease-out infinite; }
.um-metronome-dot .wall-right { right: 14%; animation: um-meter-hit var(--period) ease-out calc(var(--period) * -.5) infinite; }
.um-metronome-dot .dot {
  position: absolute;
  top: 41%;
  left: 21%;
  width: 18%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: currentColor;
  animation: um-meter-swing var(--period) cubic-bezier(.45,0,.55,1) infinite;
}
@keyframes um-meter-swing {
  0% { transform: translateX(0) scale(.78, 1.16); transform-origin: left; }
  8% { transform: translateX(0) scale(1); }
  42% { transform: translateX(255%) scale(1); }
  50% { transform: translateX(255%) scale(.78, 1.16); }
  58% { transform: translateX(255%) scale(1); }
  92% { transform: translateX(0) scale(1); }
  100% { transform: translateX(0) scale(.78, 1.16); }
}
@keyframes um-meter-hit { 0%, 12% { opacity: .9; transform: scaleY(1.15); } 30%, 100% { opacity: .35; transform: none; } }
`,
  },
  {
    key: 'rising-words',
    name: 'Floating Text',
    nameZh: '浮字',
    group: 'Text',
    ...mono,
    speed: 1.8,
    description: 'The letters in “Loading” rise and fall from left to right.',
    descriptionZh: '「Loading」的字母从左向右依次升起、落下。',
    parts: Array.from({length: 7}, (_, index) => `ch ch-${index}`),
    css: `
.um-rising-words {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--size) * 1.5);
  font: 600 calc(var(--size) * .22) / 1 system-ui, -apple-system, 'Segoe UI', sans-serif;
  letter-spacing: .01em;
}
.um-rising-words .ch { animation: um-words-rise var(--period) cubic-bezier(.3,.7,.3,1) infinite; }
${'Loading'.split('').map((letter, index) => `.um-rising-words .ch-${index} { animation-delay: calc(var(--period) * ${(index * .07).toFixed(2)}); }\n.um-rising-words .ch-${index}::before { content: '${letter}'; }`).join('\n')}
@keyframes um-words-rise {
  0%, 50%, 100% { transform: translateY(0); opacity: .4; }
  20% { transform: translateY(-22%); opacity: 1; }
  32% { transform: translateY(4%); opacity: .85; }
}
`,
  },
  {
    key: 'dot-field',
    name: 'Dot Field',
    nameZh: '点阵波',
    group: 'Dots',
    ...sea,
    speed: 1.4,
    description: 'Nine dots swell along a diagonal, like wind crossing a field.',
    descriptionZh: '九个点沿对角线依次变大，像风掠过田地。',
    parts: Array.from({length: 9}, (_, index) => `cell cell-${(index % 3) + Math.floor(index / 3)}`),
    css: `
.um-dot-field {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9%;
  padding: 20%;
}
.um-dot-field .cell {
  border-radius: 50%;
  background: currentColor;
  aspect-ratio: 1;
  animation: um-field-wave var(--period) ease-in-out infinite;
}
.um-dot-field .cell-1 { animation-delay: calc(var(--period) * .1); }
.um-dot-field .cell-2 { animation-delay: calc(var(--period) * .2); }
.um-dot-field .cell-3 { animation-delay: calc(var(--period) * .3); }
.um-dot-field .cell-4 { animation-delay: calc(var(--period) * .4); }
@keyframes um-field-wave { 0%, 60%, 100% { transform: scale(.45); opacity: .35; } 25% { transform: scale(1); opacity: 1; } }
`,
  },
  {
    key: 'sand-turn',
    name: 'Sand Turn',
    nameZh: '翻转沙漏',
    group: 'Icons',
    ...warm,
    speed: 2.6,
    description: 'Sand runs into the lower half, then the hourglass flips.',
    descriptionZh: '沙子流到下半部，沙漏随后翻转。',
    parts: ['cap cap-top', 'cap cap-bottom', 'bulb bulb-top', 'bulb bulb-bottom', 'sand sand-top', 'sand sand-bottom', 'stream'],
    css: `
.um-sand-turn { animation: um-sand-flip var(--period) cubic-bezier(.6,0,.3,1) infinite; }
.um-sand-turn .cap { position: absolute; left: 24%; right: 24%; height: 7%; border-radius: 100px; background: currentColor; }
.um-sand-turn .cap-top { top: 14%; }
.um-sand-turn .cap-bottom { bottom: 14%; }
.um-sand-turn .bulb { position: absolute; left: 29%; right: 29%; height: 29%; background: currentColor; opacity: .2; }
.um-sand-turn .bulb-top { top: 21%; clip-path: polygon(0 0, 100% 0, 58% 100%, 42% 100%); }
.um-sand-turn .bulb-bottom { bottom: 21%; clip-path: polygon(42% 0, 58% 0, 100% 100%, 0 100%); }
.um-sand-turn .sand { position: absolute; left: 33%; right: 33%; background: currentColor; }
.um-sand-turn .sand-top {
  top: 23%;
  height: 25%;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transform-origin: bottom;
  animation: um-sand-drain var(--period) linear infinite;
}
.um-sand-turn .sand-bottom {
  bottom: 21%;
  height: 25%;
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
  transform-origin: bottom;
  animation: um-sand-fill var(--period) linear infinite;
}
.um-sand-turn .stream { position: absolute; left: 49%; width: 2%; top: 49%; height: 28%; background: currentColor; animation: um-sand-stream var(--period) linear infinite; }
@keyframes um-sand-drain { 0% { transform: scale(1); } 70%, 100% { transform: scale(0); } }
@keyframes um-sand-fill { 0% { transform: scale(0); } 70%, 100% { transform: scale(1); } }
@keyframes um-sand-stream { 0%, 68% { opacity: .8; } 70%, 100% { opacity: 0; } }
@keyframes um-sand-flip { 0%, 72% { transform: rotate(0); } 100% { transform: rotate(.5turn); } }
`,
  },
  {
    key: 'draft-card',
    name: 'Article Skeleton',
    nameZh: '文稿骨架',
    group: 'States',
    ...ink,
    speed: 1.6,
    description: 'A highlight sweeps across an avatar and three placeholder lines.',
    descriptionZh: '一束高光扫过头像和三行占位线。',
    parts: ['avatar', 'line line-1', 'line line-2', 'line line-3'],
    css: `
.um-draft-card { width: calc(var(--size) * 1.6); }
.um-draft-card > * {
  position: absolute;
  background: linear-gradient(90deg, color-mix(in srgb, currentColor 18%, transparent) 30%, color-mix(in srgb, currentColor 42%, transparent) 50%, color-mix(in srgb, currentColor 18%, transparent) 70%) 0 0 / 300% 100%;
  animation: um-draft-shine var(--period) ease-in-out infinite;
}
.um-draft-card .avatar { left: 10%; top: 24%; width: 18%; aspect-ratio: 1; border-radius: 50%; }
.um-draft-card .line { left: 36%; height: 9%; border-radius: 100px; }
.um-draft-card .line-1 { top: 26%; width: 40%; }
.um-draft-card .line-2 { top: 46%; width: 54%; left: 10%; animation-delay: calc(var(--period) * .08); }
.um-draft-card .line-3 { top: 63%; width: 38%; left: 10%; animation-delay: calc(var(--period) * .16); }
@keyframes um-draft-shine { from { background-position: 100% 0; } to { background-position: 0 0; } }
`,
  },
  {
    key: 'clock-hands',
    name: 'Clock Hands',
    nameZh: '时针',
    group: 'Lines',
    ...sea,
    speed: 2,
    description: 'The long hand turns once as the short hand advances and the ticks light up.',
    descriptionZh: '长针转一圈，短针向前移动，刻度随之亮起。',
    parts: ['face', 'tick tick-1', 'tick tick-2', 'tick tick-3', 'tick tick-4', 'hand hand-hour', 'hand hand-minute', 'pin'],
    css: `
.um-clock-hands .face { position: absolute; inset: 14%; border-radius: 50%; border: calc(var(--size) * .045) solid currentColor; opacity: .3; }
.um-clock-hands .tick { position: absolute; left: 48.5%; top: 20%; width: 3%; height: 8%; border-radius: 100px; background: currentColor; transform-origin: 50% 375%; transform: rotate(var(--r)); animation: um-clock-tick calc(var(--period) * 4) steps(1) var(--d) infinite; opacity: .3; }
.um-clock-hands .tick-1 { --r: 0deg; --d: 0s; }
.um-clock-hands .tick-2 { --r: 90deg; --d: calc(var(--period) * -3); }
.um-clock-hands .tick-3 { --r: 180deg; --d: calc(var(--period) * -2); }
.um-clock-hands .tick-4 { --r: 270deg; --d: calc(var(--period) * -1); }
.um-clock-hands .hand { position: absolute; left: 48%; bottom: 50%; width: 4%; border-radius: 100px; background: currentColor; transform-origin: 50% 100%; }
.um-clock-hands .hand-minute { height: 30%; animation: um-clock-spin var(--period) linear infinite; }
.um-clock-hands .hand-hour { height: 20%; opacity: .7; animation: um-clock-spin calc(var(--period) * 4) steps(4) infinite; }
.um-clock-hands .pin { position: absolute; inset: 46%; border-radius: 50%; background: currentColor; }
@keyframes um-clock-spin { to { transform: rotate(1turn); } }
@keyframes um-clock-tick { 0% { opacity: 1; } 25%, 100% { opacity: .3; } }
`,
  },
  {
    key: 'orbit-pair',
    name: 'Orbit Pair',
    nameZh: '双星绕行',
    group: 'Rings',
    ...mono,
    speed: 1.4,
    description: 'Two dots orbit in opposite directions and shrink as they meet.',
    descriptionZh: '两个点沿相反方向绕行，相遇时会缩小。',
    parts: ['path', 'star star-a', 'star star-b'],
    css: `
.um-orbit-pair .path { position: absolute; inset: 18%; border-radius: 50%; border: calc(var(--size) * .03) solid currentColor; opacity: .2; }
.um-orbit-pair .star { position: absolute; inset: 0; animation: um-pair-turn var(--period) cubic-bezier(.45,.05,.55,.95) infinite; }
.um-orbit-pair .star::before { position: absolute; top: 12%; left: 50%; width: 16%; aspect-ratio: 1; margin-left: -8%; content: ''; border-radius: 50%; background: currentColor; animation: um-pair-size calc(var(--period) / 2) ease-in-out infinite; }
.um-orbit-pair .star-b { animation-direction: reverse; }
@keyframes um-pair-turn { to { transform: rotate(1turn); } }
@keyframes um-pair-size { 0%, 100% { transform: scale(1); } 50% { transform: scale(.55); } }
`,
  },
  {
    key: 'level-bars',
    name: 'Level Bars',
    nameZh: '电平',
    group: 'Lines',
    ...mono,
    speed: 1.2,
    description: 'Five bars rise and fall like an audio level meter.',
    descriptionZh: '五根竖条像音量电平表一样起伏。',
    parts: Array.from({length: 5}, (_, index) => `bar bar-${index}`),
    css: `
.um-level-bars { display: flex; align-items: center; justify-content: center; gap: 7%; }
.um-level-bars .bar { width: 9%; height: 60%; border-radius: 100px; background: currentColor; transform-origin: center; animation: um-level var(--period) ease-in-out infinite; }
.um-level-bars .bar-0 { animation-delay: calc(var(--period) * -.5); }
.um-level-bars .bar-1 { animation-delay: calc(var(--period) * -.2); }
.um-level-bars .bar-2 { animation-delay: calc(var(--period) * -.7); }
.um-level-bars .bar-3 { animation-delay: calc(var(--period) * -.35); }
.um-level-bars .bar-4 { animation-delay: calc(var(--period) * -.9); }
@keyframes um-level { 0%, 100% { transform: scaleY(.25); } 30% { transform: scaleY(1); } 60% { transform: scaleY(.5); } }
`,
  },
  {
    key: 'square-lap',
    name: 'Square Track',
    nameZh: '绕方',
    group: 'Geometry',
    ...mono,
    speed: 1.8,
    description: 'A square travels around a frame, pausing at each corner.',
    descriptionZh: '一个方块沿方框绕行，在每个角停顿片刻。',
    parts: ['frame', 'runner'],
    css: `
.um-square-lap .frame { position: absolute; inset: 22%; border: calc(var(--size) * .035) solid currentColor; border-radius: 12%; opacity: .25; }
.um-square-lap .runner { position: absolute; top: 15%; left: 15%; width: 14%; aspect-ratio: 1; border-radius: 22%; background: currentColor; animation: um-lap var(--period) cubic-bezier(.6,0,.4,1) infinite; }
@keyframes um-lap {
  0%, 6% { transform: translate(0, 0); }
  25%, 31% { transform: translate(400%, 0) rotate(90deg); }
  50%, 56% { transform: translate(400%, 400%) rotate(180deg); }
  75%, 81% { transform: translate(0, 400%) rotate(270deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
}
`,
  },
  {
    key: 'pendulum',
    name: 'Pendulum',
    nameZh: '摆锤',
    group: 'Lines',
    ...mono,
    speed: 1.6,
    description: 'A pendulum swings side to side and slows at the top of each swing.',
    descriptionZh: '摆锤左右摆动，接近两端时放慢。',
    parts: ['pivot', 'arm'],
    css: `
.um-pendulum .pivot { position: absolute; top: 14%; left: 30%; right: 30%; height: 4%; border-radius: 100px; background: currentColor; opacity: .35; }
.um-pendulum .arm { position: absolute; top: 16%; left: 49%; width: 2%; height: 48%; background: currentColor; transform-origin: 50% 0; animation: um-swing var(--period) ease-in-out infinite alternate; }
.um-pendulum .arm::after { position: absolute; bottom: -9%; left: 50%; width: calc(var(--size) * .17); aspect-ratio: 1; margin-left: calc(var(--size) * -.085); content: ''; border-radius: 50%; background: currentColor; }
@keyframes um-swing { from { transform: rotate(38deg); } to { transform: rotate(-38deg); } }
`,
  },
  {
    key: 'nested-squares',
    name: 'Nested Squares',
    nameZh: '回字',
    group: 'Geometry',
    ...mono,
    speed: 2,
    description: 'Three square outlines expand from the center, with the outer one fading away.',
    descriptionZh: '三道方框从中心向外扩张，最外层逐渐淡去。',
    parts: ['box box-1', 'box box-2', 'box box-3'],
    css: `
.um-nested-squares .box { position: absolute; inset: 0; margin: auto; width: 70%; aspect-ratio: 1; border: calc(var(--size) * .035) solid currentColor; border-radius: 14%; animation: um-nest var(--period) cubic-bezier(.3,.6,.4,1) infinite; }
.um-nested-squares .box-2 { animation-delay: calc(var(--period) * -.33); }
.um-nested-squares .box-3 { animation-delay: calc(var(--period) * -.66); }
@keyframes um-nest { 0% { transform: scale(.15) rotate(0deg); opacity: 0; } 20% { opacity: 1; } 100% { transform: scale(1) rotate(90deg); opacity: 0; } }
`,
  },
  {
    key: 'gap-ring',
    name: 'Broken Ring',
    nameZh: '缺环',
    group: 'Rings',
    ...mono,
    speed: 1.3,
    description: 'A dashed ring spins as its gap opens and closes.',
    descriptionZh: '断续的圆环持续转动，缺口时开时合。',
    parts: ['ring'],
    css: `
.um-gap-ring .ring { position: absolute; inset: 14%; border-radius: 50%; border: calc(var(--size) * .07) dashed currentColor; animation: um-gap-spin var(--period) linear infinite, um-gap-breathe calc(var(--period) * 2) ease-in-out infinite; }
@keyframes um-gap-spin { to { rotate: 1turn; } }
@keyframes um-gap-breathe { 0%, 100% { scale: 1; opacity: 1; } 50% { scale: .82; opacity: .55; } }
`,
  },
  {
    key: 'pixel-snake',
    name: 'Pixel Snake',
    nameZh: '方阵蛇',
    group: 'Geometry',
    ...mono,
    speed: 1.8,
    description: 'A lit snake winds through a four-by-four grid.',
    descriptionZh: '一串亮点在 4×4 方阵中蜿蜒穿行。',
    parts: Array.from({length: 16}, (_, index) => {
      const row = Math.floor(index / 4), col = index % 4;
      return `px px-${row * 4 + (row % 2 ? 3 - col : col)}`;
    }),
    css: `
.um-pixel-snake { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6%; padding: 18%; }
.um-pixel-snake .px { border-radius: 22%; background: currentColor; opacity: .14; animation: um-snake var(--period) linear infinite; }
${Array.from({length: 16}, (_, index) => `.um-pixel-snake .px-${index} { animation-delay: calc(var(--period) * ${(index / 16 - 1).toFixed(4)}); }`).join('\n')}
@keyframes um-snake { 0% { opacity: 1; } 22% { opacity: .14; } 100% { opacity: .14; } }
`,
  },
  {
    key: 'flip-tile',
    name: 'Flip Tile',
    nameZh: '翻块',
    group: 'Geometry',
    ...mono,
    speed: 1.6,
    description: 'A square flips horizontally, then vertically, as if rolling across a page.',
    descriptionZh: '方块先横向翻转，再纵向翻转，像沿纸面滚动。',
    parts: ['tile'],
    css: `
.um-flip-tile { perspective: calc(var(--size) * 3); }
.um-flip-tile .tile { position: absolute; inset: 26%; border-radius: 12%; background: currentColor; animation: um-flip var(--period) cubic-bezier(.45,0,.55,1) infinite; }
@keyframes um-flip {
  0% { transform: rotateX(0) rotateY(0); }
  50% { transform: rotateX(-180deg) rotateY(0); }
  100% { transform: rotateX(-180deg) rotateY(-180deg); }
}
`,
  },
].map(({speed, color, darkColor, ...item}) => ({
  ...item,
  collection: 'Original loaders',
  className: 'um-' + item.key,
  defaults: {size: 72, color, speed},
  darkColor,
}));
