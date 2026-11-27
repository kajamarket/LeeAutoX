import assert from 'node:assert/strict';

export const remainingScenarios = {
  field: async page => {
    await page.getByRole('textbox', {name: '3-digit code'}).fill('123');
    await page.getByText('Valid code', {exact: true}).waitFor();
  },
  input: async page => {
    await page.getByRole('textbox', {name: 'Draft title'}).fill('Palette');
    assert.equal(await page.locator('output').innerText(), 'Palette');
  },
  textarea: async page => {
    await page.getByRole('textbox', {name: 'Note'}).fill('Hello');
    assert.equal(await page.locator('output').innerText(), '5 / 80');
  },
  'info-label': async page => {
    await page.getByRole('button', {name: 'About names'}).tap();
    await page.getByText('Names can be edited later.').waitFor();
  },
  'radio-group': async page => {
    const high = page.getByRole('radio', {name: 'High quality'});
    await high.tap();
    assert.ok(await high.isChecked());
  },
  searchbox: async page => {
    await page.getByRole('searchbox', {name: 'Find format'}).fill('png');
    assert.equal(await page.locator('output').innerText(), 'PNG');
  },
  select: async page => {
    const select = page.getByRole('combobox', {name: 'File type'});
    await select.selectOption('PDF');
    assert.equal(await select.inputValue(), 'PDF');
  },
  'color-picker': async page => {
    const hue = page.getByRole('slider', {name: 'Hue'});
    const before = Number(await hue.inputValue());
    await hue.press('ArrowRight');
    assert.ok(Number(await hue.inputValue()) > before);
  },
  'swatch-picker': async page => {
    const lilac = page.getByRole('radio', {name: 'Lilac'});
    await lilac.tap();
    assert.equal(await lilac.getAttribute('aria-checked'), 'true');
  },
  'tag-picker': async page => {
    const input = page.getByRole('combobox', {name: 'Add topic'});
    await input.press('ArrowDown');
    await page.getByRole('option', {name: 'Motion'}).tap();
    await page.locator('.fui-TagPickerGroup').getByText('Motion').waitFor();
    await page.locator('.fui-TagPickerGroup .fui-Tag__dismissIcon').tap();
    await page.locator('.fui-TagPickerGroup').getByText('Motion').waitFor({state: 'hidden'});
  },
  'avatar-group': async page => {
    await page.getByRole('button', {name: 'Show team'}).tap();
    await page.getByText('Leo', {exact: true}).waitFor();
    assert.ok(await page.getByRole('dialog', {name: 'Overflow'}).evaluate(el => {
      const {right, bottom} = el.getBoundingClientRect();
      return right <= innerWidth && bottom <= innerHeight;
    }));
  },
  breadcrumb: async page => {
    await page.getByRole('button', {name: 'Files'}).tap();
    await page.getByRole('button', {name: 'Open draft'}).tap();
    await page.getByText('Draft', {exact: true}).waitFor();
  },
  'split-button': async page => {
    await page.getByRole('button', {name: 'Export', exact: true}).tap();
    await page.getByText('SVG ready').waitFor();
    await page.getByRole('button', {name: 'Export formats'}).tap();
    await page.getByRole('menuitem', {name: 'PNG'}).tap();
    await page.getByText('PNG ready').waitFor();
  },
  link: async page => {
    await page.getByRole('link', {name: 'Show shortcut'}).tap();
    await page.locator('#shortcut').waitFor();
    assert.equal(new URL(page.url()).hash, '#shortcut');
  },
  list: async page => {
    const option = page.getByRole('checkbox', {name: 'Select colors'});
    await option.tap();
    assert.ok(await option.isChecked());
  },
  nav: async page => {
    const archive = page.getByText('Archive', {exact: true});
    await archive.tap();
    assert.equal(await page.locator('.fui-NavItem').filter({hasText: 'Archive'}).getAttribute('aria-current'), 'page');
  },
  overflow: async page => {
    await page.getByRole('button', {name: 'More actions'}).tap();
    const action = page.getByRole('menuitem').last();
    const name = await action.innerText();
    await action.tap();
    assert.equal(await page.locator('output').innerText(), `Ran ${name}`);
  },
  'data-grid': async page => {
    const name = page.getByRole('columnheader', {name: 'Name'});
    await name.tap();
    assert.equal(await name.getAttribute('aria-sort'), 'ascending');
    assert.equal(await page.getByRole('gridcell').first().innerText(), 'Color');
  },
  toolbar: async page => {
    await page.getByRole('button', {name: 'Bold'}).tap();
    const weight = await page.getByText('Sample text').evaluate(node => getComputedStyle(node).fontWeight);
    assert.equal(weight, '700');
  },
  virtualizer: async page => {
    await page.getByText('Row 1', {exact: true}).waitFor();
    await page.locator('.virtual-viewport').evaluate(node => {node.scrollTop = 58 * 24;});
    await page.getByText('Row 60', {exact: true}).waitFor();
    assert.ok(await page.locator('.virtual-row').count() < 200);
  },
  button: async page => {
    await page.getByRole('button', {name: 'Save draft'}).tap();
    await page.getByRole('button', {name: 'Save again'}).waitFor();
  },
  'compound-button': async page => {
    await page.getByRole('button', {name: /Export draft/}).tap();
    await page.getByRole('button', {name: /Draft ready/}).waitFor();
  },
  'toggle-button': async page => {
    await page.getByRole('button', {name: 'Pin item'}).tap();
    await page.getByRole('button', {name: 'Pinned', pressed: true}).waitFor();
  },
  card: async page => {
    const card = page.getByRole('checkbox');
    await card.press('Space');
    assert.ok(await card.isChecked());
  },
  'info-button': async page => {
    await page.getByRole('button', {name: 'About file size'}).tap();
    await page.getByText('Up to 10 MB').waitFor();
  },
  'message-bar': async page => {
    await page.getByRole('button', {name: 'Dismiss'}).tap();
    await page.getByRole('button', {name: 'Show message'}).tap();
    await page.getByText('Draft saved').waitFor();
  },
  alert: async page => {
    await page.getByRole('button', {name: 'Dismiss'}).tap();
    await page.getByRole('button', {name: 'Show alert'}).tap();
    await page.getByText('Export paused').waitFor();
  },
  popover: async page => {
    await page.getByRole('button', {name: 'Display'}).tap();
    const grid = page.getByRole('switch', {name: 'Grid lines'});
    await grid.tap();
    assert.ok(await grid.isChecked());
  },
  skeleton: async page => {
    await page.getByRole('button', {name: 'Show result'}).tap();
    await page.getByText('Draft available').waitFor();
    assert.equal(await page.locator('.fui-Skeleton').count(), 0);
  },
  spinner: async page => {
    await page.getByRole('button', {name: 'Complete'}).tap();
    await page.getByText('Export ready').waitFor();
    assert.equal(await page.locator('.fui-Spinner').count(), 0);
  },
  tag: async page => {
    await page.getByRole('button', {name: 'Remove UI'}).tap();
    await page.getByRole('button', {name: 'Remove Type'}).tap();
    await page.getByRole('button', {name: 'Restore topics'}).waitFor();
  },
  'interaction-tag': async page => {
    await page.getByRole('button', {name: 'Motion', exact: true}).tap();
    await page.getByRole('button', {name: 'Motion', exact: true, pressed: true}).waitFor();
    await page.getByRole('button', {name: 'Remove Motion'}).tap();
    await page.getByRole('button', {name: 'Restore tag'}).waitFor();
  },
  tooltip: async page => {
    await page.getByRole('button', {name: 'Export'}).press('Tab');
    await page.getByRole('button', {name: 'Export'}).press('Shift+Tab');
    await page.getByRole('button', {name: 'Export'}).hover();
    await page.getByRole('tooltip').waitFor();
  },
  'inline-drawer': async page => {
    await page.getByRole('button', {name: 'Show'}).tap();
    await page.getByText('Drafts', {exact: true}).waitFor();
    await page.getByRole('button', {name: 'Hide'}).tap();
    await page.getByText('Drafts', {exact: true}).waitFor({state: 'hidden'});
  },
};
