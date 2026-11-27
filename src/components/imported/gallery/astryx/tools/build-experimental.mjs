import {readFile} from 'node:fs/promises';
import {dirname, join, resolve, sep} from 'node:path';
import {transformSync} from '@babel/core';
import stylexPlugin from '@stylexjs/babel-plugin';
import {build} from 'esbuild';
import {canaryStories} from '../experimental/stories.mjs';
import {writeBundle} from './write-bundle.mjs';

const root = resolve(import.meta.dirname, '../experimental');
const dist = join(root, 'dist');
const vendor = join(root, 'vendor/astryx') + sep;
const styleRules = new Map();

function pauseStockTicker(contents) {
  const stockTimer = /(export const StockPrice: StoryObj = \{[\s\S]*?)const id = setInterval\(\(\) => \{([\s\S]*?)\}, 50\);\s*return \(\) => clearInterval\(id\);/;
  if (!stockTimer.test(contents)) throw new Error('找不到 Astryx StockPrice 的上游计时器');
  return contents.replace(stockTimer, (_match, before, body) => `${before}const tick = () => {${body}};
      const root = document.documentElement;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)');
      let timer: number | undefined;
      function sync() {
        const active = !document.hidden && (root.dataset.embedded === 'true'
          ? root.dataset.galleryActive !== 'false' : !reduced.matches);
        if (active) timer ??= window.setInterval(tick, 50);
        else {
          window.clearInterval(timer);
          timer = undefined;
        }
      }
      const observer = new MutationObserver(sync);
      observer.observe(root, {attributes: true, attributeFilter: ['data-gallery-active']});
      reduced.addEventListener('change', sync);
      document.addEventListener('visibilitychange', sync);
      sync();
      return () => {
        window.clearInterval(timer);
        observer.disconnect();
        reduced.removeEventListener('change', sync);
        document.removeEventListener('visibilitychange', sync);
      };`);
}

const stories = {
  name: 'astryx-canary-stories',
  setup(builder) {
    builder.onResolve({filter: /^\.\/canary-stories$/}, () => ({path: 'canary-stories', namespace: 'astryx'}));
    builder.onLoad({filter: /.*/, namespace: 'astryx'}, () => ({
      contents: `export default new Map([${canaryStories.map(([key, , file, story]) =>
        `[${JSON.stringify(key)}, () => import(${JSON.stringify(`./vendor/astryx/apps/storybook/stories/${file}.stories.tsx`)}).then(m => ({meta: m.default, story: m[${JSON.stringify(story)}]}))]`).join(',')}]);`,
      resolveDir: root,
    }));
    builder.onResolve({filter: /^\.\/useDataset$/}, () => ({path: join(root, 'src/local-dataset.mjs')}));
    builder.onLoad({filter: /\.tsx$/}, async ({path}) => {
      if (!path.startsWith(vendor)) return;
      const raw = await readFile(path, 'utf8');
      let contents = raw
        .replace(/from ('|")@astryxdesign\/lab\/[^'"]+\1/g, "from '@astryxdesign/lab'")
        .replace(/from ('|")@astryxdesign\/theme-neutral\1/g, "from '@astryxdesign/theme-neutral/built'")
        .replace(/^\s*avatarSrc: 'https:\/\/i\.pravatar\.cc\/[^']+',\s*$/gm, '')
        .replace(/https:\/\/images\.unsplash\.com\/[^'"\s]+/g, '../../media/magnet-grid.jpg');
      if (path.endsWith(`${sep}ChartInteractions.stories.tsx`)) {
        // ChartBrush can invert a linear axis. Keep the original month labels in the line example.
        contents = contents.replace(/export const BrushLine:[\s\S]*?(?=export const Brush2D:)/, line => line
          .replace('data={monthlyData}', 'data={monthlyData.map((point, index) => ({...point, month: index + 1}))}')
          .replace('<ChartAxis position="bottom" />', '<ChartAxis position="bottom" tickFormat={tick => monthlyData[Number(tick) - 1]?.month ?? ""} />'));
      }
      if (path.endsWith(`${sep}ChartStreamGL.stories.tsx`)) {
        contents = pauseStockTicker(contents);
      }
      if (contents.includes("from '@stylexjs/stylex'")) {
        const compiled = transformSync(contents, {
          filename: path, babelrc: false, configFile: false, parserOpts: {plugins: ['jsx', 'typescript']},
          plugins: [[stylexPlugin, {
            dev: false, runtimeInjection: false, classNamePrefix: 'umc',
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
  plugins: [stories],
});
await writeBundle({
  root, dist, result,
  fallbackLicenses: new Map([
    ['@astryxdesign/core@0.7.17', 'vendor/astryx/LICENSE'],
    ['@astryxdesign/theme-neutral@0.7.17', 'vendor/astryx/LICENSE'],
    ['@stylexjs/stylex@0.19.2', '../vendor/stylex/LICENSE'],
  ]),
  extraCss: stylexPlugin.processStylexRules([...styleRules].sort().flatMap(([, rules]) => rules), false),
});
