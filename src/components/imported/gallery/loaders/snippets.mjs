const reducedMotion = '@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-play-state: paused !important; } }';

export function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

export function htmlExample(item,props,markup,license,background='#151517'){
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(item.name)} · UI Moments</title>
<style>
body{margin:0;min-height:100svh;display:grid;place-items:center;background:${escapeHtml(background)}}
</style>
</head>
<body>
<div role="status" aria-label="Loading">
  <div>
    <template shadowrootmode="open">
${markup}
<style>${reducedMotion}</style>
    </template>
  </div>
</div>
</body>
<!--
Source and license: Original by UI Moments · MIT

${license.trim()}
-->
</html>
`;
}

export function reactExample(item,props,license){
  return `const defaults = ${JSON.stringify(props,null,2)};
const css = ${JSON.stringify(item.css)};

export default function LoadingIndicator({
  size = defaults.size,
  color = defaults.color,
  speed = defaults.speed,
} = {}) {
  return (
    <div role="status" aria-label="Loading">
      <style>{css}</style>
      <span
        aria-hidden="true"
        className="${item.className}"
        style={{ '--size': size + 'px', '--color': color, '--period': speed + 's' }}
      >
${item.parts.map(part=>`        <span className="${part}" />`).join('\n')}
      </span>
    </div>
  );
}

/*
Source and license: Original by UI Moments · MIT

${license.trim()}
*/
`;
}
