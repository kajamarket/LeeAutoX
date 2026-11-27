import {officialShowcases} from './showcases.mjs';
import {officialVariants} from './variants.mjs';
import {canary, canaryCommit, canaryStories} from './experimental/stories.mjs';

const source = 'gallery/astryx';
const upstream = 'https://github.com/meta/astryx/blob/0b48882df9c0bf8e49c8f7306737b6972c8dcd15/packages/cli/assets/templates/blocks/components';
const library = {id: 'astryx', name: 'Astryx'};
// 同一上游组件的展示和变体继承同一用途。开发工具仍可在全库中搜索。
const familiesByTask = {
  input: [
    'BaseTypeahead', 'Calendar', 'ChatComposer', 'ChatComposerDrawer', 'ChatComposerInput',
    'ChatDictation', 'ChatDictationButton', 'CheckboxInput', 'CheckboxList', 'CheckboxListItem',
    'CodeEditor', 'ComplexSelector', 'DateInput', 'DateRangeInput', 'DateTimeInput', 'EmojiPicker',
    'Field', 'FieldLabel', 'FileInput', 'FormLayout', 'InputGroup', 'ListInput', 'MultiSelector',
    'NumberInput', 'PowerSearch', 'RadioList', 'RadioListItem', 'SelectableCardGroup', 'Selector',
    'SelectorOption', 'Slider', 'Switch', 'TextArea', 'TextInput', 'TimeInput', 'ToggleButton',
    'ToggleButtonGroup', 'Token', 'Tokenizer', 'TransferList', 'TransferListSelector', 'Typeahead', 'TypeaheadItem',
  ],
  navigation: [
    'BottomSheet', 'BreadcrumbItem', 'Breadcrumbs', 'Carousel', 'ChatLayoutScrollButton',
    'Collapsible', 'CollapsibleGroup', 'CommandPalette', 'CommandPaletteEmpty', 'CommandPaletteFooter',
    'CommandPaletteGroup', 'CommandPaletteInput', 'CommandPaletteItem', 'CommandPaletteList',
    'ContextMenu', 'ContextMenuItem', 'Dialog', 'DialogHeader', 'DialogHeroHeader', 'Drawer', 'DrawerHeader',
    'DropdownMenu', 'DropdownMenuGroup', 'DropdownMenuItem', 'HoverCard', 'InfoTip', 'Lightbox', 'Link',
    'MobileNav', 'MobileNavToggle', 'MoreMenu', 'NavHeadingMenu', 'NavIcon', 'NavigationStack', 'Overlay',
    'PageControl', 'Pagination', 'Popover', 'ScrollableArea', 'SegmentedControl', 'SegmentedControlItem',
    'SideNav', 'SideNavCollapseButton', 'SideNavHeading', 'SideNavItem', 'SideNavSection', 'Tab', 'TabBar',
    'TabBarMoreList', 'TabList', 'TabMenu', 'Tooltip', 'TopNav', 'TopNavHeading', 'TopNavItem', 'TopNavMegaMenu',
    'TopNavMegaMenuFeaturedCard', 'TopNavMegaMenuItem', 'TopNavMenu', 'Tour', 'TreeList',
  ],
  feedback: [
    'AlertDialog', 'AvatarStatusDot', 'Badge', 'Banner', 'Button', 'ButtonGroup', 'ChatMessageMetadata',
    'ChatSendButton', 'ChatSystemMessage', 'ChatToolCalls', 'CircleCheckIndicator', 'EmptyState', 'FieldStatus',
    'IconButton', 'StatusDot', 'Toast', 'Toolbar',
  ],
  progress: ['CircularProgress', 'ProgressBar', 'Skeleton', 'Spinner', 'Step', 'Stepper', 'Timer'],
  content: [
    'AppShell', 'AspectRatio', 'Avatar', 'AvatarGroup', 'AvatarGroupOverflow', 'Blockquote', 'Card', 'Center',
    'ChatLayout', 'ChatMessage', 'ChatMessageBubble', 'ChatMessageList', 'ChatReasoning', 'ChatTokenizedText',
    'Citation', 'Code', 'CodeBlock', 'CommentPin', 'Comments', 'DiffViewer', 'Divider', 'Grid', 'GridSpan',
    'HStack', 'Heading', 'Icon', 'Item', 'Kbd', 'Layout', 'LayoutContent', 'LayoutFooter', 'LayoutHeader',
    'LayoutPanel', 'LineClamp', 'List', 'ListItem', 'Markdown', 'MediaTheme', 'MetadataList',
    'MetadataListItem', 'Outline', 'OverflowList', 'Resizable', 'SVGIcon', 'Section', 'Stack', 'StackItem',
    'SyntaxTheme', 'Text', 'Theme', 'Thumbnail', 'Timestamp', 'VStack',
  ],
  data: ['LogStream', 'Schedule', 'Stat', 'Table'],
};
const taskByFamily = new Map(Object.entries(familiesByTask)
  .flatMap(([task, families]) => families.map(family => [family, task])));
const credit = {
  name: 'Astryx · Meta Platforms, Inc.',
  url: 'https://github.com/meta/astryx',
  licensePath: `${source}/vendor/astryx/LICENSE`,
  note: 'MIT components from Astryx 0.7.17. Demo content, gallery integration, and theming by UI Moments.',
};

const adapted = [
  ['date-range', 'Date Range Input', 'Date Range Input', 'Date range', 'DateRangeInput', 'Pick start and end dates in the calendar or clear the range.', ['calendar', 'form'], 'large', 'DateRangeDemo'],
  ['bottom-sheet', 'Bottom Sheet', 'Bottom Sheet', 'Overlay', 'BottomSheet', 'Open the sheet from the bottom. Drag it down or press Escape to close it.', ['Overlay', 'drag'], 'wide', 'BottomSheetDemo'],
  ['command-palette', 'Command Palette', 'Command Palette', 'Search panel', 'CommandPalette', 'Type to filter commands, then use the arrow keys and Enter to select one.', ['search', 'keyboard'], 'wide', 'CommandPaletteDemo'],
].map(([key, title, en, type, family, summary, tags, previewSize, sourceEntry]) => ({
  id: `astryx-${key}`,
  title,
  en,
  type,
  family,
  task: taskByFamily.get(family) ?? null,
  category: 'input',
  previewSize,
  summary,
  tags: [...tags, 'Astryx', 'Open-source integration'],
  demo: `${source}/dist/index.html#${key}`,
  source,
  sourcePath: `${source}/src/demo.jsx`,
  sourceEntry,
  library,
  credit,
}));

const showcasePreviewSizes = {
  'app-shell': 'wide',
  'bottom-sheet-switcher': 'large',
  calendar: 'large',
  'chat-layout': 'large',
  'chat-message-list': 'large',
  'date-input': 'large',
  'date-time-input': 'large',
  drawer: 'wide',
  'layout-panel': 'large',
  table: 'wide',
};

// 上游变体标题形如「Alert Dialog · AlertDialog — Loading」，卡片只保留组件名和变体名；
// 原标题仍放进标签，搜索结果不变。
function variantTitle(title) {
  const rest = title.split(' · ').at(-1);
  const [name, ...label] = rest.split(/\s+—\s+|:\s+/);
  const display = /^use[A-Z]/.test(name) ? name : name.replace(/([a-z\d])([A-Z])/g, '$1 $2');
  return label.length ? `${display} — ${label.join(' — ')}` : display;
}

const coreWorks = [...officialShowcases, ...officialVariants].map(([key, rawTitle, template, summary]) => {
  const [family] = template.split('/');
  const variant = key.startsWith('variant-');
  const title = variant ? variantTitle(rawTitle) : rawTitle;
  const sourceHref = `${upstream}/${template}`;
  return {
    id: `astryx-${key}`,
    title,
    en: title,
    type: variant ? 'Component variant' : 'Component',
    family,
    task: taskByFamily.get(family) ?? null,
    category: 'input',
    previewSize: showcasePreviewSizes[key],
    summary,
    tags: ['Astryx', 'Open-source integration', ...(variant ? ['Variant', rawTitle] : [])],
    demo: `${source}/dist/index.html#${key}`,
    source,
    sourcePath: `${source}/node_modules/@astryxdesign/cli/assets/templates/blocks/components/${template}`,
    sourceHref,
    sourceEntry: 'default export',
    sourceAdapter: `${source}/tools/build.mjs`,
    library,
    fitPreview: true,
    credit: {...credit, url: sourceHref, note: 'Official Astryx 0.7.17 example, embedded by UI Moments. MIT.'},
  };
});

const experimentalSource = `${source}/experimental`;
const canaryWorks = canaryStories.map(([key, title, story, sourceEntry, kind]) => {
  const family = story.split('/').at(-1);
  const storyPath = `apps/storybook/stories/${story}.stories.tsx`;
  return {
    id: `astryx-${key}`,
    title,
    en: title,
    type: kind === 'chart' ? 'Data visualization' : 'Experimental component',
    family,
    task: kind === 'chart' ? 'data' : taskByFamily.get(family) ?? null,
    category: 'input',
    previewSize: key === 'lab-transfer-list' || key.startsWith('lab-schedule-') ? 'large' : 'wide',
    summary: `Official Astryx Storybook example from the ${canary} release.`,
    tags: ['Astryx', 'Open-source integration', kind === 'chart' ? 'Chart' : 'Experimental'],
    demo: `${experimentalSource}/dist/index.html#${key}`,
    source: experimentalSource,
    sourcePath: `${experimentalSource}/vendor/astryx/${storyPath}`,
    sourceEntry,
    sourceAdapter: `${source}/tools/build-experimental.mjs`,
    library,
    fitPreview: true,
    credit: {
      ...credit,
      url: `https://github.com/meta/astryx/blob/${canaryCommit}/${storyPath}`,
      licensePath: `${experimentalSource}/vendor/astryx/LICENSE`,
      note: `Official Astryx ${canary} Storybook example, embedded by UI Moments. MIT.`,
    },
  };
});

export const astryxWorks = [...adapted, ...coreWorks, ...canaryWorks];
