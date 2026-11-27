import {readFile} from 'node:fs/promises';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {transformSync} from '@babel/core';
import stylexPlugin from '@stylexjs/babel-plugin';
import {build} from 'esbuild';
import {fillTemplatePlaceholders} from '../node_modules/@astryxdesign/cli/foundation/discovery/template-placeholders.mjs';
import {officialShowcases} from '../showcases.mjs';
import {officialVariants} from '../variants.mjs';
import {writeBundle} from './write-bundle.mjs';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const templates = 'node_modules/@astryxdesign/cli/assets/templates/blocks/components';
const templateRoot = join(root, templates) + sep;
const styleRules = new Map();
const localImages = new Map([
  ['light-home-square-1.png', 'jelly-pad.jpg'],
  ['illustrative-horizontal-1.png', 'tide-progress.jpg'],
  ['light-scene-horizontal-1.png', 'magnet-grid.jpg'],
  ['moody-scene-horizontal-1.png', 'tide-progress.jpg'],
  ['light-working-horizontal-1.png', 'jelly-pad.jpg'],
  ['light-product-1.png', 'jelly-pad.jpg'],
  ['building.png', 'magnet-grid.jpg'],
]);
const posters = ['magnet-grid.jpg', 'tide-progress.jpg', 'jelly-pad.jpg', 'hue-orbit.jpg', 'magnet-grid.jpg'];
const appShellCopy = new Map([
  ['AppShellShowcase.tsx', ['Design library', 'Browse shared components, check their states, and see where each pattern is used.']],
  ['AppShellContentOnly.tsx', ['Preview collection', 'Play with a control and open its details when you want to inspect the source.']],
  ['AppShellSideNavOnly.tsx', ['Workspace files', 'Use the sidebar to switch between reports, documents, and the people who maintain them.']],
  ['AppShellTopNavOnly.tsx', ['Release notes', 'See the latest changes to the gallery and the examples you can reuse.']],
  ['AppShellTopNavWithSideNav.tsx', ['Component overview', 'Pick a category in the sidebar to compare related controls and interactions.']],
  ['AppShellWithBanner.tsx', ['Workspace updates', 'Review new examples as your team adds them to the shared library.']],
]);

function replaceAppShellCopy(contents, path) {
  const [folder, file] = relative(templateRoot, path).split(sep);
  const copy = folder === 'AppShell' && appShellCopy.get(file);
  if (!copy) return contents;
  const placeholder = /(<Text type="body">)\s*Lorem ipsum[\s\S]*?(<\/Text>)/;
  if (!placeholder.test(contents)) throw new Error(`找不到 App Shell 的上游占位文案：${file}`);
  return contents.replace('>Page Content</Heading>', `>${copy[0]}</Heading>`)
    .replace(placeholder, (_match, open, close) => `${open}${copy[1]}${close}`);
}

function localMedia(file) {
  if (file === 'Nature-1.mp4') return '../media/ink-switch.mp4';
  if (file.startsWith('does-not-exist-')) return 'data:image/png;base64,';
  if (file.startsWith('DATA-')) {
    const initials = file.replace(/^DATA-|-|\.png$/g, ' ').trim().split(/\s+/).map(word => word[0]).slice(0, 2).join('');
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#dcd9ec"/><text x="32" y="39" text-anchor="middle" fill="#30264d" font-family="system-ui,sans-serif" font-size="22">${initials}</text></svg>`)}`;
  }
  const vertical = file.match(/^illustrative-vertical-([1-5])\.png$/);
  const image = localImages.get(file) || (vertical && posters[Number(vertical[1]) - 1]) || (file.startsWith('Neutral-') && 'jelly-pad.jpg');
  if (!image) throw new Error(`未提供本地演示素材：${file}`);
  return `../media/${image}`;
}
const showcasePlugin = {
  name: 'astryx-official-showcases',
  setup(builder) {
    builder.onResolve({filter: /^\.\/official-demos$/}, () => ({path: 'official-demos', namespace: 'astryx'}));
    builder.onResolve({filter: /^@astryx-docs\/demo-content$/}, () => ({path: join(root, 'src/template-support.jsx')}));
    builder.onLoad({filter: /.*/, namespace: 'astryx'}, () => ({
      contents: `export default new Map([${[...officialShowcases, ...officialVariants].map(([key, , file]) =>
        `[${JSON.stringify(key)}, () => import(${JSON.stringify(`./${templates}/${file}`)})]`).join(',')}]);`,
      resolveDir: root,
    }));
    builder.onLoad({filter: /\.tsx$/}, async ({path}) => {
      if (!path.startsWith(templateRoot)) return;
      const upstream = await readFile(path, 'utf8');
      let contents = replaceAppShellCopy(upstream, path)
        .replace(/\/template-assets\/([a-z0-9-]+\.(?:png|jpg|mp4))/gi, (_, file) => localMedia(file))
        .replace(/(\bplaceholder="[^"\s@]+@)company\.com(?=")/g, '$1example.com')
        .replace(/^\s*icon: 'https:\/\/[^']*favicon[^']*',\s*$/gm, '');
      contents = fillTemplatePlaceholders(contents).source;
      if (contents.includes("from '@stylexjs/stylex'")) {
        const compiled = transformSync(contents, {
          filename: path, babelrc: false, configFile: false, parserOpts: {plugins: ['jsx', 'typescript']},
          plugins: [[stylexPlugin, {
            dev: false, runtimeInjection: false, classNamePrefix: 'umx',
            unstable_moduleResolution: {type: 'commonJS', rootDir: root},
          }]],
        });
        contents = compiled.code;
        styleRules.set(path, compiled.metadata.stylex || []);
      }
      return {contents, loader: 'tsx', resolveDir: dirname(path)};
    });
  },
};
const result = await build({
  absWorkingDir: root,
  entryPoints: ['src/demo.jsx'],
  outdir: dist,
  bundle: true,
  format: 'esm',
  splitting: true,
  chunkNames: 'chunks/[name]-[hash]',
  target: 'es2022',
  jsx: 'automatic',
  minify: true,
  define: {'process.env.NODE_ENV': '"production"'},
  legalComments: 'inline',
  metafile: true,
  write: false,
  plugins: [showcasePlugin],
});

await writeBundle({
  root, dist, result,
  fallbackLicenses: new Map([
    ['@astryxdesign/core@0.7.17', 'vendor/astryx/LICENSE'],
    ['@astryxdesign/theme-neutral@0.7.17', 'vendor/astryx/LICENSE'],
    ['@stylexjs/stylex@0.19.2', 'vendor/stylex/LICENSE'],
  ]),
  extraCss: stylexPlugin.processStylexRules([...styleRules].sort().flatMap(([, rules]) => rules), false),
});
