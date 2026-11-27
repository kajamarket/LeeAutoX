import {originalLoaders} from '../gallery/loaders/originals.mjs';
import {fluentWorks} from '../gallery/fluent-ui/catalog.mjs';
import {astryxWorks} from '../gallery/astryx/catalog.mjs';
import {localizedText, translate} from './locale.mjs';
import {escapeHtml as escape} from '../gallery/loaders/snippets.mjs';

export const categories = [
  {id: 'all', name: 'All'},
  {id: 'input', name: 'Controls'},
  {id: 'loading', name: 'Loading'},
  // 色彩鲜艳的作品单独放在最后，图鉴首屏保持单色。
  {id: 'color', name: 'Color'},
];
const categoryNames = new Map(categories.map(({id, name}) => [id, name]));
const searchIndex = new WeakMap();

const typesByTask = {
  input: [
    'Checkbox', 'Color', 'Color picker', 'Combobox', 'Dial', 'Dropdown', 'Field', 'Input', 'Number input',
    'Radio', 'Radio cards', 'Rating', 'Search', 'Segmented control', 'Select', 'Slider', 'Stepper', 'Switch', 'Tags',
  ],
  navigation: [
    'Accordion', 'Carousel', 'Dialog', 'Disclosure', 'Drawer', 'Menu', 'Navigation', 'Pagination', 'Popover',
    'Tab bar', 'Tabs', 'Tooltip', 'Tree',
  ],
  feedback: ['Bookmark button', 'Button', 'Notification', 'Toolbar'],
  progress: ['Loading state', 'Progress'],
  content: ['Card', 'Icon', 'List', 'Text'],
  data: ['Dashboard', 'Table'],
  motion: ['Lighting', 'Pointer effect', 'Rhythm', 'Showcase'],
};
const taskByType = new Map(Object.entries(typesByTask)
  .flatMap(([task, types]) => types.map(type => [type, task])));

// 当控件的用途由具体场景决定时，优先使用作品本身的判定。
const taskById = {
  'domino-row': 'motion', 'elastic-string': 'motion',
  'flip-coin': 'motion', 'jelly-pad': 'motion', 'merge-drops': 'motion',
  'code-shake': 'feedback', 'fluent-dialog': 'feedback', 'strength-meter': 'feedback',
  'swipe-confirm': 'feedback',
  'download-ring': 'progress', 'pull-refresh': 'progress',
  'fluent-card': 'input', 'fluent-list': 'input', 'fluent-toggle-button': 'input', 'snap-grid': 'input',
};

const searchAliases = [
  [/\b(?:calendar|date (?:input|picker|range|time))\b/, 'calendar date picker date range 日历 日期选择 日期选择器'],
  [/\b(?:switch|toggle)\b/, 'toggle switch 开关 切换'],
  [/\b(?:dialog|modal)\b/, 'dialog modal 对话框 弹窗'],
  [/\bskeleton\b/, '骨架屏 内容占位'],
  [/\bdropdown menu\b/, '下拉菜单'],
  [/\bswipe (?:to )?confirm\b/, '滑动确认 滑动解锁'],
  [/\b(?:charts?|data visualization)\b/, '图表 数据可视化'],
  [/\b(?:data grid|data table|table)\b/, '数据表格 表格'],
  [/\b(?:click effects?|press feedback)\b/, '按钮反馈 点击反馈'],
  [/\bempty state\b/, '空状态 空页面'],
];

const shapeFilters = {
  loading: {label: 'All shapes', order: ['Rings', 'Dots', 'Lines', 'Geometry', 'Text', 'Characters', 'Icons', 'States']},
};

const firstExamples = [
  'magnet-grid', 'ink-switch', 'swipe-confirm', 'jelly-pad', 'paper-fold',
  'elastic-string', 'detent-dial', 'merge-drops', 'radial-menu', 'tide-ring',
  'rocker-switch', 'bloom-toggle', 'domino-row', 'like-burst', 'pixel-snake',
  'scrub-wave', 'download-ring', 'snap-grid', 'breath-orb', 'pull-refresh',
  'step-track', 'orbit-pair', 'fluent-drawer', 'astryx-date-range',
  'odometer-stepper', 'ripple-pad', 'leaf-tabs', 'tide-progress', 'bell-toggle',
  'hold-confirm', 'pebble-rating', 'paper-plane', 'copy-morph', 'signal-return',
];

export const initialCardCount = 24;

export function standaloneExamplePath(item) {
  return item.standalone ? `gallery/originals/dist/${item.id}.html` : null;
}

export function categoryMarkup(items) {
  return categories.map(({id,name}) => {
    const count = id === 'all' ? items.length : items.filter(item => item.category === id).length;
    return `<button type="button" data-category="${id}" aria-pressed="${id === 'all'}"><span class="category-label">${escape(translate(name))}</span><span class="category-count">${count}</span></button>`;
  }).join('');
}

export function workHeading(item) {
  const {text, lang} = localizedText(item.en, item.original ? item.title : item.loader?.nameZh);
  return {name: text, lang};
}

// 卡片副标题说明组件类型。Astryx 的类型统一是 Component，改用具体的组件名。
function humanizeIdentifier(name = '') {
  return name.replace(/([a-z\d])([A-Z])/g, '$1 $2');
}

export function kindLabel(item, t = translate) {
  const generic = /^(?:Component|Component variant|Experimental component)$/.test(item.type ?? '');
  const family = item.family && humanizeIdentifier(item.family);
  // 标题里已经有组件名时不再重复，改用类型。
  const repeats = family && item.en?.toLowerCase().startsWith(family.toLowerCase());
  return !item.shape && generic && family && !repeats ? family : t(item.shape || item.type);
}

export function cardMarkup(item, t = translate) {
  const titleId = `work-title-${item.id}`, actionId = `work-action-${item.id}`;
  const {name, lang} = workHeading(item);
  return `<article class="ui-item" data-ui="${escape(item.id)}" data-category="${escape(item.category)}"${item.previewSize ? ` data-preview-size="${escape(item.previewSize)}"` : ''}>
    ${item.loader
      ? `<button type="button" class="ui-stage ui-playback" aria-pressed="false" aria-label="${escape(t('Pause {name} preview', {name}))}"></button>`
      : '<div class="ui-stage"></div>'}
    <div class="ui-caption">
      <div><h2 lang="${lang}" id="${titleId}">${escape(name)}</h2><p>${escape(kindLabel(item, t))}</p></div>
      <button type="button" class="ui-expand" data-detail aria-labelledby="${actionId} ${titleId}" aria-haspopup="dialog">
        <span class="ui-detail-label" id="${actionId}">${escape(t('Details'))}</span>
        <span class="ui-expand-icon" aria-hidden="true"></span>
      </button>
    </div></article>`;
}

export function buildCatalog(works = []) {
  const effects = originalLoaders.map(loader => ({
    id: loader.key, title: loader.name, en: loader.name, category: 'loading', type: 'Loader', task: 'progress',
    shape: loader.group, summary: loader.description, summaryZh: loader.descriptionZh,
    tags: ['Original', 'loading'],
    loader,
  }));
  const controls = works.map(work => ({
    ...work, category: work.vivid ? 'color' : 'input',
  }));
  const typedControls = [...controls, ...fluentWorks].map(work => ({
    ...work, task: taskById[work.id] ?? taskByType.get(work.type) ?? null,
  }));

  // 目录开头先展示可操作的控件，并穿插不同用途的案例。
  const byId = new Map([...typedControls, ...astryxWorks, ...effects].map(item => [item.id, item]));
  const result = [];
  for (const id of firstExamples) {
    if (!byId.has(id)) continue;
    result.push(byId.get(id));
    byId.delete(id);
  }

  // 剩余示例轮流取自各形态和来源，减少相近作品连续出现。
  const groups = new Map();
  for (const item of byId.values()) {
    const {loader} = item;
    const group = loader ? `${item.shape}` : item.category;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(item);
  }
  const longestGroup = Math.max(0, ...Array.from(groups.values(), group => group.length));
  for (let index = 0; index < longestGroup; index++) {
    for (const group of groups.values()) {
      if (group[index]) result.push(group[index]);
    }
  }
  // 「All」里多彩作品统一排在最后。
  return [...result.filter(item => item.category !== 'color'), ...result.filter(item => item.category === 'color')];
}

export function getCategoryFilters(items, category) {
  const filter = shapeFilters[category];
  if (!filter) return [];

  const inCategory = items.filter(item => item.category === category);
  const counts = new Map();
  for (const {shape} of inCategory) {
    if (shape) counts.set(shape, (counts.get(shape) || 0) + 1);
  }
  const shapes = [...new Set([...filter.order, ...counts.keys()])].filter(shape => counts.has(shape));
  if (shapes.length === 0) return [];
  return [
    {id: 'all', name: filter.label, count: inCategory.length},
    ...shapes.map(shape => ({id: shape, name: shape, count: counts.get(shape)})),
  ];
}

function normalizeSearch(text) {
  return text.normalize('NFKC').replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/[\s_‐‑–—-]+/g, ' ').trim().toLowerCase();
}

export function matches(item, {task = 'all', category = 'all', shape = 'all', motion = 'all', query = ''} = {}) {
  const previewMotion = item.loader || item.autoplay ? 'dynamic' : 'static';
  if ((task !== 'all' && item.task !== task) ||
      (category !== 'all' && item.category !== category) ||
      (shape !== 'all' && item.shape !== shape) ||
      (motion !== 'all' && motion !== previewMotion)) return false;
  const term = normalizeSearch(query);
  if (!term) return true;
  let text = searchIndex.get(item);
  if (!text) {
    const labels = [categoryNames.get(item.category), item.type, item.shape].filter(Boolean);
    const keywords = [item.title, item.en, item.loader?.nameZh, item.id, item.family, ...(item.tags || []), ...labels]
      .filter(Boolean).map(normalizeSearch);
    const aliases = searchAliases.filter(([pattern]) => keywords.some(keyword => pattern.test(keyword)))
      .map(([, value]) => value);
    const descriptions = [item.summary, item.summaryZh, item.library?.name, ...labels.map(label => translate(label, undefined, 'zh-CN'))]
      .filter(Boolean).map(normalizeSearch);
    text = [...keywords, ...aliases, ...descriptions].join('\n');
    searchIndex.set(item, text);
  }
  if (!/^[a-z0-9]/.test(term)) return text.includes(term);
  // 保留按字首搜索的体验，避免 table 匹配 selectable 之类的词。
  for (let index = text.indexOf(term); index !== -1; index = text.indexOf(term, index + 1)) {
    if (!/[a-z0-9]/.test(text.charAt(index - 1))) return true;
  }
  return false;
}
