const source = 'gallery/fluent-ui';
const repository = 'https://github.com/microsoft/fluentui';
const library = {id: 'fluent-ui', name: 'Fluent UI'};
const deprecatedPackages = new Set(['react-alert', 'react-virtualizer']);
const entryDemos = {drawer: 'DrawerDemo', 'teaching-popover': 'TeachingPopoverDemo', toast: 'ToastDemo'};

const controls = [
  ['drawer', 'Drawer', 'Drawer', 'A settings drawer slides in from the right and restores focus when closed.', 'react-drawer'],
  ['teaching-popover', 'Teaching Popover', 'Popover', 'Press to show a short tip next to its trigger.', 'react-teaching-popover', 'wide'],
  ['toast', 'Toast', 'Notification', 'Press repeatedly to stack notifications that dismiss in sequence.', 'react-toast', 'wide'],
  ['accordion', 'Accordion', 'Disclosure', 'Expand a section to read its contents. Opening a new section closes the previous one.', 'react-accordion'],
  ['checkbox', 'Tri-state Checkbox', 'Checkbox', 'Change the child options to see the parent checkbox cycle through its three states.', 'react-checkbox'],
  ['combobox', 'Searchable Combobox', 'Combobox', 'Type to filter swatches, then select one from the list.', 'react-combobox'],
  ['dropdown', 'Multi-select Dropdown', 'Dropdown', 'Select multiple export formats from the same list.', 'react-combobox'],
  ['menu', 'View Menu', 'Menu', 'Switch between grid and list view using radio items in a menu.', 'react-menu'],
  ['dialog', 'Confirmation Dialog', 'Dialog', 'Confirm or cancel an archive action, then restore the example project.', 'react-dialog', 'wide'],
  ['switch', 'Preview Switch', 'Switch', 'Toggle preview mode and watch its label reflect the current state.', 'react-switch'],
  ['slider', 'Zoom Slider', 'Slider', 'Drag or use the arrow keys to adjust the zoom level.', 'react-slider'],
  ['spinbutton', 'Spin Button', 'Number input', 'Enter a copy count or adjust it one step at a time.', 'react-spinbutton'],
  ['tabs', 'Project Tabs', 'Tabs', 'Switch between the design, review, and release panels.', 'react-tabs'],
  ['rating', 'Star Rating', 'Rating', 'Choose a star rating using touch, mouse, or keyboard.', 'react-rating'],
  ['tree', 'File Tree', 'Tree', 'Expand a folder to reveal its children and navigate with the arrow keys.', 'react-tree'],
  ['carousel', 'Swatch Carousel', 'Carousel', 'Drag the swatches or move between them with the arrow buttons or page dots.', 'react-carousel'],
  ['progress', 'Progress Bar', 'Progress', 'Advance the export preview in steps, then reset it.', 'react-progress'],
];

const forms = [
  ['field', 'Form Field', 'Field', 'Enter a three-digit code to change the field validation state.', 'react-field'],
  ['input', 'Text Input', 'Input', 'Edit the draft title and see the preview update as you type.', 'react-input'],
  ['textarea', 'Textarea', 'Input', 'Write a note with an 80-character limit and a live counter.', 'react-textarea'],
  ['info-label', 'Info Label', 'Popover', 'Open the help attached to a label to learn what the field is for.', 'react-infolabel'],
  ['radio-group', 'Radio Group', 'Radio', 'Choose one export quality with the pointer or arrow keys.', 'react-radio'],
  ['searchbox', 'Search Box', 'Search', 'Filter a short list of formats and clear the search to restore it.', 'react-search'],
  ['select', 'Native Select', 'Select', 'Choose a file type in the platform’s native select control.', 'react-select'],
  ['color-picker', 'Color Picker', 'Color', 'Adjust hue, saturation, and brightness in the color controls.', 'react-color-picker'],
  ['swatch-picker', 'Swatch Picker', 'Color', 'Select a preset swatch with the pointer or arrow keys.', 'react-swatch-picker'],
  ['tag-picker', 'Tag Picker', 'Tags', 'Find topics, add them to the field, and remove selected tags.', 'react-tag-picker', 'wide'],
];

const navigation = [
  ['avatar-group', 'Avatar Group', 'Popover', 'Open the overflow avatar to reveal the other members of the team.', 'react-avatar'],
  ['breadcrumb', 'Breadcrumb', 'Navigation', 'Go back one level in the project path and reopen the draft.', 'react-breadcrumb'],
  ['split-button', 'Split Button', 'Button', 'Run the default export or select a format from the adjacent menu.', 'react-button'],
  ['link', 'Link', 'Navigation', 'Follow an in-page link to reveal and jump to a shortcut.', 'react-link'],
  ['list', 'Selectable List', 'List', 'Select multiple entries using the list’s built-in selection.', 'react-list'],
  ['nav', 'Navigation Rail', 'Navigation', 'Switch between destinations and see the selected one update.', 'react-nav'],
  ['overflow', 'Overflow Menu', 'Menu', 'Open actions that do not fit in the toolbar and run one.', 'react-overflow'],
  ['data-grid', 'Sortable Data Grid', 'Table', 'Sort files by name or version by activating a column header.', 'react-table', 'wide'],
  ['toolbar', 'Formatting Toolbar', 'Toolbar', 'Toggle bold and italic independently and see the text change.', 'react-toolbar'],
  ['virtualizer', 'Virtualized List', 'List', 'Scroll through 200 rows as the visible items are rendered on demand.', 'react-virtualizer'],
];

const feedback = [
  ['button', 'Action Button', 'Button', 'Save a draft and see the action label change.', 'react-button'],
  ['compound-button', 'Compound Button', 'Button', 'Trigger an action with a label and a short supporting description.', 'react-button'],
  ['toggle-button', 'Toggle Button', 'Button', 'Pin or unpin an item using a button with a pressed state.', 'react-button'],
  ['card', 'Selectable Card', 'Card', 'Select and deselect a card using its built-in checkbox.', 'react-card'],
  ['info-button', 'Info Button', 'Popover', 'Press the information button to see the file size limit.', 'react-infolabel'],
  ['message-bar', 'Message Bar', 'Notification', 'Dismiss a status message and bring it back to replay the interaction.', 'react-message-bar'],
  ['alert', 'Alert', 'Notification', 'Dismiss and replay a notification using the legacy Alert component.', 'react-alert'],
  ['popover', 'Interactive Popover', 'Popover', 'Open a settings popover and toggle grid lines inside it.', 'react-popover'],
  ['skeleton', 'Skeleton Loading State', 'Loading state', 'Switch between a skeleton preview and its loaded content.', 'react-skeleton'],
  ['spinner', 'Spinner Loading State', 'Loading state', 'Start or complete an export to show or remove its spinner.', 'react-spinner'],
  ['tag', 'Dismissible Tags', 'Tags', 'Remove individual topics and restore them when the group is empty.', 'react-tags'],
  ['interaction-tag', 'Interaction Tag', 'Tags', 'Use separate buttons to select a tag or remove it.', 'react-tags'],
  ['tooltip', 'Tooltip', 'Tooltip', 'Hover over the action or focus it with the keyboard to see its tooltip.', 'react-tooltip'],
  ['inline-drawer', 'Inline Drawer', 'Drawer', 'Open a drawer within the layout and close it from the same trigger.', 'react-drawer'],
];

function catalogEntries(group, samples) {
  return samples.map(([sample, title, type, summary, upstream, previewSize]) => ({
    id: `fluent-${sample}`,
    title,
    en: title,
    type,
    summary,
    category: 'input',
    previewSize,
    group,
    autoplay: sample === 'spinner' || sample === 'skeleton',
    tags: ['Microsoft', 'Open-source integration'],
    library,
    source,
    sourcePath: `${source}/${Object.hasOwn(entryDemos, sample) ? 'main' : group}.jsx`,
    sourceEntry: Object.hasOwn(entryDemos, sample) ? entryDemos[sample] : `default export key "${sample}"`,
    demo: `${source}/dist/index.html?sample=${sample}`,
    credit: {
      name: 'Fluent UI · Microsoft',
      url: `${repository}/tree/4846275a92419b2dd0440a432df755dcdcd427c3/packages/react-components/${deprecatedPackages.has(upstream) ? 'deprecated/' : ''}${upstream}`,
      licensePath: `${source}/vendor/LICENSE`,
      note: 'Components from Fluent UI React 9.75.2. Demo content, gallery integration, and light and dark themes by UI Moments.',
    },
  }));
}

export const fluentWorks = Object.entries({controls, forms, navigation, feedback})
  .flatMap(([group, samples]) => catalogEntries(group, samples));
