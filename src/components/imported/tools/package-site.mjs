import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { build } from 'esbuild';
import { buildCatalog, cardMarkup, categoryMarkup, initialCardCount, standaloneExamplePath } from '../assets/catalog.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, '_site');
const defaultRepository = 'https://github.com/guanmo-ai/ui-moments';
const repository = (process.env.UI_MOMENTS_REPOSITORY || defaultRepository).replace(/\/$/, '');
const ref = process.env.UI_MOMENTS_REF || 'main';
if (!/^https:\/\/github\.com\/[a-z\d-]+\/[a-z\d_.-]+$/i.test(repository)) {
  throw new Error('UI_MOMENTS_REPOSITORY 应为 GitHub 仓库地址');
}
if (!/^[a-z\d_./-]+$/i.test(ref) || ref.includes('..')) {
  throw new Error('UI_MOMENTS_REF 应为 Git 分支、标签或提交');
}

function projectLinks(html) {
  const repositoryPage = ref === 'main' ? repository : `${repository}/tree/${ref}`;
  return html
    .replaceAll(defaultRepository + '/blob/main/', repository + '/blob/' + ref + '/')
    .replaceAll(defaultRepository + '/issues/', repository + '/issues/')
    .replaceAll(`href="${defaultRepository}"`, `href="${repositoryPage}"`)
    .replace(/(<meta name="ui-moments:repository" content=")[^"]*/, `$1${repository}`)
    .replace(/(<meta name="ui-moments:ref" content=")[^"]*/, `$1${ref}`);
}

const publicFiles = new Set([
  'index.html', 'LICENSE', 'CREDITS.md', '.nojekyll',
]);
const pages = [
  {html: 'index.html', entry: 'assets/gallery.mjs', tag: 'assets/gallery.mjs'},
];
const scripts = await build({
  absWorkingDir: root,
  entryPoints: pages.map(({entry}) => entry),
  outbase: root,
  outdir: output,
  outExtension: {'.js': '.mjs'},
  entryNames: '[dir]/[name]-[hash]',
  chunkNames: 'assets/modules/[name]-[hash]',
  bundle: true,
  splitting: true,
  format: 'esm',
  target: 'es2022',
  minify: true,
  legalComments: 'inline',
  metafile: true,
  write: false,
});
const moduleFiles = new Map(Object.entries(scripts.metafile.outputs));
const window = {};
runInNewContext(readFileSync(join(root, 'gallery/works.js'), 'utf8'), {window});
const items = buildCatalog(window.WORKS);

function pageHtml({html, entry, tag}) {
  const [main] = [...moduleFiles].find(([, file]) => file.entryPoint === entry);
  const preload = new Set();
  function addImports(path) {
    for (const item of moduleFiles.get(path).imports) {
      if (item.kind !== 'import-statement' || item.external || preload.has(item.path)) continue;
      preload.add(item.path);
      addImports(item.path);
    }
  }
  const href = path => './' + relative(dirname(join(output, html)), resolve(root, path)).split(sep).join('/');
  addImports(main);
  const original = `<script type="module" src="${tag}"></script>`;
  const source = projectLinks(readFileSync(join(root, html), 'utf8'));
  if (!source.includes(original)) throw new Error(`找不到页面入口：${html}`);
  const head = [...preload].map(path => `<link rel="modulepreload" href="${href(path)}">`);
  head.push(`<script type="module" src="${href(main)}"></script>`);
  const page = source.replace(original, '').replace('</head>', head.join('\n') + '\n</head>');
  if (html !== 'index.html') return page;
  const cards = items.slice(0, initialCardCount).map(item => cardMarkup(item)).join('\n');
  return page.replace('<!-- initial gallery cards -->', () => cards)
    .replace('<!-- gallery categories -->', () => categoryMarkup(items))
    .replace('<span data-stat="total"></span>', `<span data-stat="total">${items.length}</span>`);
}

const htmlOutputs = pages.map(page => [page.html, pageHtml(page)]);
const manifest = join(root, 'private/release-files.txt');
const tracked = existsSync(manifest)
  ? readFileSync(manifest, 'utf8').trimEnd().split('\n')
  : execFileSync('git', ['ls-files', '-z'], {cwd: root, encoding: 'utf8'}).split('\0');
const buildSources = /^gallery\/(?:astryx(?:\/experimental)?|fluent-ui)\/(?:src|tools)\//;
const siteFiles = tracked.filter(path => publicFiles.has(path) || (
  /^(assets|gallery)\//.test(path) &&
  !buildSources.test(path) &&
  (!path.includes('/vendor/') || /(?:^|\/)LICENSE$/.test(path) || path.endsWith('/UPSTREAM-LICENSE')) &&
  !/(?:^|\/)package(?:-lock)?\.json$/.test(path) &&
  !path.split('/').some(part => part.startsWith('.'))
));
const astryxAssets = ['gallery/astryx/dist', 'gallery/astryx/experimental/dist'].flatMap(directory =>
  JSON.parse(readFileSync(join(root, directory, 'assets.json'), 'utf8')).map(file => join(directory, file)));
const generated = [
  ...astryxAssets,
  'gallery/fluent-ui/dist',
  ...items.map(standaloneExamplePath).filter(Boolean),
];

function copy(path) {
  const source = join(root, path);
  const destination = join(output, path);
  mkdirSync(dirname(destination), {recursive: true});
  cpSync(source, destination, {
    recursive: true,
    filter: file => {
      const entry = lstatSync(file);
      if (!entry.isFile() && !entry.isDirectory()) throw new Error(`发布文件不是普通文件或目录：${file}`);
      return true;
    },
  });
}

rmSync(output, {recursive: true, force: true});
for (const path of [...siteFiles, ...generated]) copy(path);
for (const file of scripts.outputFiles) {
  mkdirSync(dirname(file.path), {recursive: true});
  writeFileSync(file.path, file.contents);
}
for (const [path, html] of htmlOutputs) writeFileSync(join(output, path), html);
console.log('已准备 GitHub Pages 站点：_site/');
