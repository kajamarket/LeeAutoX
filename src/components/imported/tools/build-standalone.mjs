import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const gallery = new URL('../gallery/originals/', import.meta.url);
const destination = new URL('dist/', gallery);
const license = readFileSync(new URL('../LICENSE', import.meta.url), 'utf8').trimEnd();
const sourcePages = new Map(['index.html', 'visual.html'].map(name => [
  name, readFileSync(new URL(name, gallery), 'utf8').replaceAll('\r\n', '\n'),
]));
const samples = [
  { id: 'ink-switch', title: 'Ink Switch', page: 'index.html' },
  { id: 'detent-dial', title: 'Detent Dial', page: 'index.html' },
  { id: 'jelly-pad', title: 'Jelly Cube', page: 'visual.html', css: ['pad'], js: ['spring'] },
];

// Whole-line comments delimit the parts shared by the gallery and each downloadable page.
function section(page, name, markup = false) {
  const [left, right] = markup ? ['<!--', '-->'] : ['/*', '*/'];
  const marker = `${left} standalone:${name} ${right}`;
  const endMarker = `${left} /standalone:${name} ${right}`;
  const [before, rest, duplicateStart] = sourcePages.get(page).split(marker);
  const [content, after, duplicateEnd] = rest?.split(endMarker) ?? [];
  if (duplicateStart !== undefined || duplicateEnd !== undefined || after === undefined || !content.trim()) {
    throw new Error(`gallery/originals/${page} 中应有一组非空的 standalone:${name} 标记`);
  }
  const padding = before.slice(before.lastIndexOf('\n') + 1);
  return content.trimEnd().split('\n').slice(1)
    .map(line => line.startsWith(padding) ? line.slice(padding.length) : line)
    .join('\n');
}

function indent(source, spaces) {
  return source.split('\n').map(line => line ? ' '.repeat(spaces) + line : line).join('\n');
}

function standalone({ id, title, page, css = [], js = [] }) {
  const style = ['theme', 'stage', 'widget', ...css, `${id}-style`, 'reduced-motion']
    .map(name => section(page, name)).join('\n\n');
  const script = ['helpers', ...js, `${id}-script`]
    .map(name => section(page, name)).join('\n\n');
  return `<!doctype html>
<!--
Generated from gallery/originals/${page} by tools/build-standalone.mjs.

${license}
-->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} · UI Moments</title>
  <link rel="icon" href="data:,">
  <style>
${indent(style, 4)}

    *, *::before, *::after { box-sizing: border-box; }
    body { min-height: 100vh; min-height: 100svh; display: grid; place-items: center; margin: 0; background: var(--page); color: var(--ink); font: 400 14px/1.6 system-ui, sans-serif; }
    main { width: min(100%, 450px); padding: 20px; }
    button, output { font: inherit; color: inherit; }
    button { cursor: pointer; -webkit-tap-highlight-color: transparent; }
    :focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
    .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; font-size: 12px; }
    .theme { min-height: 40px; padding: 4px 12px; border: 1px solid var(--line); border-radius: 10px; background: none; }
    .theme[aria-pressed="true"] { background: var(--surface); }
    footer { margin-top: 14px; }
  </style>
</head>
<body>
  <main>
    <header class="toolbar">
      <span>UI Moments</span>
      <button type="button" class="theme" id="theme" aria-pressed="false">Dark theme</button>
    </header>
${indent(section(page, id, true), 4)}
    <footer><small class="credit">guanmo-ai · MIT</small></footer>
  </main>
  <script>
    (() => {
${indent(script, 6)}

      const theme = $('#theme');
      const systemTheme = matchMedia('(prefers-color-scheme: dark)');
      function setTheme(dark) {
        root.dataset.theme = dark ? 'dark' : 'light';
        theme.setAttribute('aria-pressed', String(dark));
      }
      function followSystemTheme() { setTheme(systemTheme.matches); }
      followSystemTheme();
      systemTheme.addEventListener('change', followSystemTheme);
      theme.addEventListener('click', () => {
        systemTheme.removeEventListener('change', followSystemTheme);
        setTheme(root.dataset.theme !== 'dark');
      });
    })();
  </script>
</body>
</html>
`;
}

const pages = samples.map(sample => [`${sample.id}.html`, standalone(sample)]);
mkdirSync(destination, { recursive: true });
for (const [name, html] of pages) writeFileSync(new URL(name, destination), html);
console.log(`已生成 ${pages.length} 个独立示例（gallery/originals/dist/）`);
