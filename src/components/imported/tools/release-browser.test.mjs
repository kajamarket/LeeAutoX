import assert from 'node:assert/strict';
import {mkdir, readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {test} from 'node:test';
import {runInNewContext} from 'node:vm';
import {chromium, webkit} from 'playwright';
import {fluentWorks} from '../gallery/fluent-ui/catalog.mjs';
import {astryxWorks} from '../gallery/astryx/catalog.mjs';
import {originalLoaders} from '../gallery/loaders/originals.mjs';
import {remainingScenarios} from '../gallery/fluent-ui/tools/browser-scenarios.mjs';
import {monitor, startServer} from './browser-site.mjs';

test('图鉴首页默认黑色、收录 884 个示例，支持筛选、试玩和导出', {timeout: 40_000}, async t => {
  const site = await startServer(t);
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const page = await browser.newPage({viewport: {width: 1280, height: 900}, colorScheme: 'light', locale: 'en-US', reducedMotion: 'reduce'});
  const errors = [];
  monitor(page, errors, site);
  await page.goto(site);
  await page.locator('html[data-ready="true"]').waitFor();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert.equal(await page.locator('[data-stat="total"]').textContent(), '884');
  const card = id => page.locator(`[data-ui="${id}"]`);
  assert.ok(await card('magnet-grid').isVisible());
  const ink = card('ink-switch').frameLocator('iframe').getByRole('switch', {name: 'Ink Switch'});
  await ink.press('Space');
  assert.equal(await ink.getAttribute('aria-checked'), 'true');

  assert.equal(await page.locator('#source-filter, #source-details').count(), 0);
  const search = page.getByRole('searchbox', {name: 'Search UI'});
  await search.fill('date picker');
  await card('astryx-date-range').waitFor({state: 'visible'});
  await search.fill('日历');
  await card('astryx-date-range').waitFor({state: 'visible'});

  await page.locator('#work-search').fill('Paper Fold');
  await card('paper-fold').locator('[data-detail]').click();
  await page.locator('#detail[open]').waitFor();
  assert.match(await page.locator('#code').inputValue(), /Original by UI Moments/);
  await page.locator('#close').click();

  await search.fill('fluent drawer');
  const drawer = card('fluent-drawer').frameLocator('iframe');
  await drawer.getByRole('button', {name: 'Open settings'}).click();
  await drawer.getByRole('dialog').waitFor();
  await drawer.getByRole('button', {name: 'Close'}).click();

  await page.goto(site + 'gallery/fluent-ui/dist/index.html?sample=teaching-popover');
  await page.getByRole('button', {name: 'Show tip'}).click();
  await page.getByText('Quick search', {exact: true}).waitFor();
  await page.goto(site + 'gallery/fluent-ui/dist/index.html?sample=toast');
  await page.getByRole('button', {name: 'Save project'}).click();
  await page.locator('.fui-ToastTitle').filter({hasText: /^Saved · 1$/}).waitFor();

  await page.goto(site);
  await page.locator('html[data-ready="true"]').waitFor();

  await page.locator('#work-search').fill('Command Palette');
  await card('astryx-command-palette').locator('[data-detail]').click();
  await page.locator('#component-detail[open]').waitFor();
  assert.equal(await page.locator('#component-credit').count(), 0);
  const notices = await page.request.get(site + 'gallery/astryx/vendor/astryx/LICENSE');
  assert.match(await notices.text(), /Copyright.*Meta Platforms/);
  await page.locator('#component-detail summary').filter({hasText: 'View prompt'}).click();
  await page.waitForFunction(() => document.querySelector('#component-detail textarea').value.includes('npm run setup'));
  const prompt = await page.locator('#component-detail textarea').inputValue();
  assert.match(prompt, /npm run setup/);
  assert.match(prompt, /npm run package:site/);
  assert.doesNotMatch(prompt, /npm run dev/);
  assert.ok(prompt.includes('astryx-command-palette') || prompt.includes('sample=command-palette'));
  await page.locator('#component-close').click();

  await page.goto(site + 'gallery/originals/index.html');
  assert.equal(await page.locator('section.sample').count(), 6);
  for (const href of await page.locator('nav.sets a').evaluateAll(links => links.map(link => link.href))) {
    assert.ok((await page.request.get(href)).ok(), href);
  }
  assert.deepEqual(errors, []);
});

test('Astryx 发布包记录实际打包的正式版和 canary 依赖', async () => {
  for (const directory of ['astryx', 'astryx/experimental']) {
    const notices = await readFile(new URL(`../_site/gallery/${directory}/dist/THIRD_PARTY_LICENSES.txt`, import.meta.url), 'utf8');
    const packages = directory === 'astryx'
      ? ['@astryxdesign/cli@0.7.17']
      : ['charts', 'lab', 'vega'].map(name => `@astryxdesign/${name}@0.7.17-canary.g72f2d7c`);
    packages.push('@astryxdesign/core@0.7.17', '@astryxdesign/theme-neutral@0.7.17', 'lucide-react@1.78.0');
    const lines = new Set(notices.split('\n'));
    for (const id of packages) assert.ok(lines.has(id), id);
  }
});

test('原创控件和加载动效随图鉴切换语言，上游示例保留英文', {timeout: 35_000}, async t => {
  const window = {};
  runInNewContext(await readFile(new URL('../gallery/works.js', import.meta.url), 'utf8'), {window});
  assert.equal(window.WORKS.length, 36);
  for (const work of window.WORKS) {
    assert.match(work.summaryZh, /\p{Script=Han}/u, work.id);
    assert.equal(work.notesZh?.length, work.notes?.length, work.id);
    for (const note of work.notesZh ?? []) assert.match(note, /\p{Script=Han}/u, work.id);
  }
  assert.equal(originalLoaders.length, 18);
  for (const loader of originalLoaders) {
    assert.match(loader.nameZh, /\p{Script=Han}/u, loader.key);
    assert.match(loader.descriptionZh, /\p{Script=Han}/u, loader.key);
  }

  const base = await startServer(t);
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const page = await browser.newPage({locale: 'zh-CN', reducedMotion: 'reduce'});
  await page.goto(base);
  const search = page.locator('#work-search');
  const card = id => page.locator(`[data-ui="${id}"]`);
  const open = async (id, dialog = 'component-detail') => {
    await card(id).locator('[data-detail]').click();
    await page.locator(`#${dialog}[open]`).waitFor();
  };
  const description = page.locator('#component-description');
  const prompt = page.locator('#component-detail textarea');

  await search.fill('墨色从滑块');
  await open('ink-switch');
  assert.match(await description.textContent(), /墨色从滑块/);
  assert.equal(await description.getAttribute('lang'), 'zh-CN');
  await page.locator('#component-detail summary').click();
  await page.waitForFunction(() => document.querySelector('#component-detail textarea').value.includes('支持用空格键'));
  assert.match(await prompt.inputValue(), /圆形裁剪区域/);
  await page.locator('#component-close').click();

  await search.fill('纸张折叠');
  assert.equal(await card('paper-fold').locator('h2').textContent(), '纸张折叠');
  assert.equal(await card('paper-fold').locator('.ui-caption p').textContent(), '几何');
  assert.match(await card('paper-fold').locator('.ui-playback').getAttribute('aria-label'), /纸张折叠/);
  await open('paper-fold', 'detail');
  assert.equal(await page.locator('#detail-title').textContent(), '纸张折叠');
  assert.match(await page.locator('#detail-group').textContent(), /几何/);
  assert.match(await page.locator('#detail-description').textContent(), /对角折痕/);
  assert.equal(await page.locator('#detail-description').getAttribute('lang'), 'zh-CN');
  assert.equal(await page.getByRole('link', {name: '查看许可证'}).getAttribute('href'), 'https://github.com/guanmo-ai/ui-moments/blob/main/LICENSE');
  await page.locator('#close').click();

  for (const item of [fluentWorks[0], astryxWorks.find(work => work.id === 'astryx-date-range')]) {
    await search.fill(item.en);
    await open(item.id);
    assert.equal(await description.textContent(), item.summary);
    assert.equal(await description.getAttribute('lang'), 'en');
    await page.locator('#component-close').click();
  }

  await page.locator('#language').click();
  await search.fill('Paper Fold');
  await open('paper-fold', 'detail');
  assert.match(await page.locator('#detail-description').textContent(), /diagonal fold/);
  assert.equal(await page.locator('#detail-description').getAttribute('lang'), 'en');
});

test('小屏能看到首批卡片，键盘能退出详情，空态能恢复浏览', {timeout: 25_000}, async t => {
  const site = await startServer(t);
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const page = await browser.newPage({viewport: {width: 320, height: 568}, colorScheme: 'dark', locale: 'en-US'});
  await page.goto(site);
  const first = page.locator('#ui-grid article').first();
  await first.waitFor();
  assert.ok((await first.boundingBox()).y < 543, '320 × 568 初始屏应能看到示例');
  const search = page.getByRole('searchbox', {name: 'Search UI'});
  assert.ok((await search.boundingBox()).width >= 140);
  await page.locator('#categories [data-category="loading"]').click();
  await search.fill('Ink Switch');
  const reset = page.locator('#reset-filters');
  await reset.waitFor();
  await reset.click();
  await page.waitForFunction(() => document.querySelector('#ui-count').textContent.includes('884'));
  assert.equal(await search.inputValue(), '');
  assert.equal(await search.evaluate(node => node === document.activeElement), true);

  await search.fill('Ink Switch');
  const detail = page.getByRole('button', {name: 'Details Ink Switch'});
  await detail.press('Enter');
  const dialog = page.locator('#component-detail');
  await dialog.waitFor();
  const ink = page.frameLocator('#component-frame').getByRole('switch', {name: 'Ink Switch'});
  await ink.press('Escape');
  await dialog.waitFor({state: 'hidden'});
  assert.equal(await detail.evaluate(node => node === document.activeElement), true);
});

test('卡片和详情的临时预览故障可以重试', {timeout: 25_000}, async t => {
  const site = await startServer(t);
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const page = await browser.newPage({viewport: {width: 1180, height: 860}, locale: 'en-US'});
  let broken = true;
  await page.route(url => url.pathname.endsWith('/gallery/originals/index.html') && url.searchParams.get('sample') === 'ink-switch', route =>
    broken ? route.fulfill({status: 404, body: 'preview unavailable'}) : route.continue());
  await page.goto(site + '?q=Ink%20Switch');
  const card = page.locator('[data-ui="ink-switch"]');
  const retryCard = card.locator('.ui-preview-retry');
  await retryCard.waitFor();
  assert.equal(await card.locator('iframe[data-loaded]').count(), 0);
  broken = false;
  await retryCard.click();
  await card.frameLocator('iframe').getByRole('switch', {name: 'Ink Switch'}).waitFor();

  broken = true;
  await card.getByRole('button', {name: 'Details Ink Switch'}).click();
  const retryDetail = page.locator('#component-retry');
  await retryDetail.waitFor();
  broken = false;
  await retryDetail.click();
  await page.frameLocator('#component-frame').getByRole('switch', {name: 'Ink Switch'}).waitFor();
  assert.equal(await retryDetail.isHidden(), true);
});

test('迟到的 HTML 导出不会写入另一个组件的详情', {timeout: 25_000}, async t => {
  const site = await startServer(t);
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const context = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write'], locale: 'en-US',
  });
  const page = await context.newPage();
  let started, resume;
  const fetchStarted = new Promise(resolve => { started = resolve; });
  const gate = new Promise(resolve => { resume = resolve; });
  t.after(resume);
  await page.route('**/gallery/originals/gestures.html*', async route => {
    if (route.request().resourceType() === 'fetch') {
      started();
      await gate;
    }
    await route.continue();
  });
  await page.goto(site + '?q=Swipe%20to%20Confirm');
  await page.evaluate(() => navigator.clipboard.writeText('unchanged'));
  const dialog = page.locator('#component-detail');
  const copy = dialog.getByRole('button', {name: 'Copy HTML'});
  await page.getByRole('button', {name: 'Details Swipe to Confirm'}).click();
  await copy.click();
  await fetchStarted;
  await dialog.getByRole('button', {name: 'Close component details'}).click();
  await page.getByRole('searchbox', {name: 'Search UI'}).fill('Bloom Toggle');
  await page.getByRole('button', {name: 'Details Bloom Toggle'}).click();
  assert.equal(await copy.isEnabled(), true);
  const oldFetch = page.waitForResponse(response =>
    response.url().endsWith('/gallery/originals/gestures.html') && response.request().resourceType() === 'fetch');
  resume();
  await (await oldFetch).finished();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'unchanged');
  await copy.click();
  await page.waitForFunction(async () => (await navigator.clipboard.readText()).includes('#bloom-toggle'));
});

test('同页切换分享链接时，详情和源码都跟随当前作品', {timeout: 25_000}, async t => {
  const site = await startServer(t);
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const page = await browser.newPage({locale: 'en-US'});
  await page.goto(site + '#ink-switch');
  const dialog = page.locator('#component-detail');
  await dialog.getByRole('heading', {name: 'Ink Switch'}).waitFor();
  await page.goto(site + '#bloom-toggle');
  await dialog.getByRole('heading', {name: 'Bloom Toggle'}).waitFor();
  assert.match(await dialog.locator('#component-source').getAttribute('href'), /gallery\/originals\/visual\.html$/);
});

test('WebKit 快速输入后仍更新结果及可分享的搜索链接', {timeout: 25_000}, async t => {
  const site = await startServer(t);
  const browser = await webkit.launch();
  t.after(() => browser.close());
  const page = await browser.newPage({viewport: {width: 390, height: 844}, locale: 'en-US'});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(site);
  await page.locator('html[data-ready="true"]').waitFor();
  const search = page.getByRole('searchbox', {name: 'Search UI'});
  await search.evaluate(input => {
    for(let index = 0; index < 120; index++) {
      input.value = 'unmatched' + index;
      input.dispatchEvent(new InputEvent('input', {bubbles: true}));
    }
  });
  await search.fill('Ink Switch');
  await page.locator('[data-ui="ink-switch"]').waitFor();
  await page.waitForFunction(() => new URL(location.href).searchParams.get('q') === 'Ink Switch');
  assert.deepEqual(errors, []);
});

test('其余 48 个 Fluent UI 示例在手机卡片尺寸下可交互', { timeout: 120_000 }, async t => {
  const site = await startServer(t);
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 168, height: 108 }, hasTouch: true, reducedMotion: 'reduce' });
  t.after(() => page.close());
  page.setDefaultTimeout(2_500);
  const errors = [];
  monitor(page, errors, site);

  const scenarios = {
    accordion: async () => {
      const layout = page.getByRole('button', { name: 'Layout' });
      await layout.tap();
      await page.getByText('12-column grid').waitFor();
      await page.getByRole('button', { name: 'Spacing' }).tap();
      await page.getByText('8 px base unit').waitFor();
      assert.equal(await layout.getAttribute('aria-expanded'), 'false');
    },
    checkbox: async () => {
      const all = page.getByRole('checkbox', { name: 'Select all' });
      assert.ok(await all.evaluate(input => input.indeterminate));
      await all.press('Space');
      assert.ok(await page.getByRole('checkbox', { name: 'Typography' }).isChecked());
    },
    combobox: async () => {
      const picker = page.getByRole('combobox', { name: 'Search colors' });
      await picker.fill('Lil');
      await page.getByRole('option', { name: 'Lilac' }).tap();
      assert.equal(await picker.inputValue(), 'Lilac');
    },
    dropdown: async () => {
      await page.getByRole('combobox', { name: 'Choose formats' }).tap();
      for (const format of ['PNG', 'SVG']) {
        const option = page.getByRole('menuitemcheckbox', { name: format });
        await option.tap();
        assert.equal(await option.getAttribute('aria-checked'), 'true');
      }
    },
    menu: async () => {
      await page.getByRole('button', { name: 'View: Grid' }).tap();
      await page.getByRole('menuitemradio', { name: 'List' }).tap();
      await page.getByRole('button', { name: 'View: List' }).waitFor();
    },
    dialog: async () => {
      await page.getByRole('button', { name: 'Archive', exact: true }).tap();
      await page.getByRole('dialog').getByRole('button', { name: 'Confirm' }).tap();
      await page.getByRole('button', { name: 'Restore', exact: true }).waitFor();
    },
    switch: async () => {
      const preview = page.getByRole('switch', { name: 'Preview mode' });
      await preview.press('Space');
      assert.ok(await preview.isChecked());
    },
    slider: async () => {
      await page.getByRole('slider', { name: 'Zoom' }).press('ArrowRight');
      assert.equal(await page.locator('output').innerText(), '55%');
    },
    spinbutton: async () => {
      const copies = page.getByRole('spinbutton', { name: 'Copies' });
      await page.getByRole('button', {name: 'Increment value'}).tap();
      assert.equal(await copies.inputValue(), '3');
      await page.getByRole('button', {name: 'Decrement value'}).tap();
      assert.equal(await copies.inputValue(), '2');
      await copies.press('ArrowUp');
      assert.equal(await copies.inputValue(), '3');
    },
    tabs: async () => {
      await page.getByRole('tab', { name: 'Review' }).tap();
      assert.equal(await page.getByRole('tabpanel').innerText(), '2 comments');
    },
    rating: async () => {
      const stars = page.getByRole('radio', { name: '5 of 5 stars' });
      await stars.press('Space');
      assert.ok(await stars.isChecked());
    },
    tree: async () => {
      await page.getByRole('treeitem', { name: 'Assets' }).press('ArrowRight');
      await page.getByText('Icons', { exact: true }).waitFor();
    },
    carousel: async () => {
      await page.getByRole('button', { name: 'Next swatch' }).tap();
      await page.getByRole('tab', { name: 'Show Lilac', selected: true }).waitFor();
    },
    progress: async () => {
      await page.getByRole('button', { name: 'Advance · 0%' }).tap();
      assert.equal(await page.getByRole('progressbar', { name: 'Export progress' }).getAttribute('aria-valuenow'), '0.25');
    },
  };

  const exercises = {...scenarios, ...remainingScenarios};
  const coveredInGallery = new Set(['drawer', 'teaching-popover', 'toast']);
  const expected = fluentWorks.map(work => new URL(work.demo, site).searchParams.get('sample'))
    .filter(sample => !coveredInGallery.has(sample));
  assert.deepEqual(new Set(Object.keys(exercises)), new Set(expected));
  for (const [sample, exercise] of Object.entries(exercises)) {
    await t.test(sample, async () => {
      await page.goto(new URL(`gallery/fluent-ui/dist/index.html?sample=${sample}`, site).href);
      await exercise(page);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 168);
    });
  }
  assert.deepEqual(errors, []);
});

test('宽卡片预览展开状态，详情仍能触发原交互', {timeout: 90_000}, async t => {
  const base = await startServer(t);
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const page = await browser.newPage({viewport: {width: 1440, height: 900}, locale: 'en-US', reducedMotion: 'reduce'});
  await page.goto(base);
  await page.locator('html[data-ready="true"]').waitFor();
  assert.equal(await page.locator('#ui-grid').evaluate(grid =>
    Number(getComputedStyle(grid).getPropertyValue('--columns'))), 5);
  const screenshots = process.env.UI_MOMENTS_CARD_SCREENSHOTS;
  if (screenshots) await mkdir(screenshots, {recursive: true});
  const examples = [
    ['fluent-dialog', 'Archive', frame => frame.getByRole('dialog').getByText('Archive project?')],
    ['fluent-teaching-popover', 'Show tip', frame => frame.getByText('Quick search', {exact: true})],
    ['fluent-toast', 'Save project', frame => frame.locator('.fui-ToastTitle').filter({hasText: /^Saved · 1$/})],
    ['astryx-command-palette', 'Open command palette', frame => frame.getByPlaceholder('Search commands')],
    ['astryx-bottom-sheet', 'Open bottom sheet', frame => frame.getByRole('button', {name: 'Apply'})],
    ['astryx-bottom-sheet-switcher', 'Set up notifications', frame => frame.getByText('Important activity')],
    ['astryx-drawer', 'Open drawer', frame => frame.getByText('Close with Escape, the scrim, or the close button.')],
  ];
  for (const [id, trigger, result] of examples) {
    const card = page.locator(`[data-ui="${id}"]`);
    await card.evaluate(node => node.scrollIntoView({block: 'center'}));
    const snapshot = card.frameLocator('iframe[data-loaded]').locator('[data-preview-snapshot]');
    await snapshot.waitFor();
    assert.ok(await snapshot.evaluate(node => {
      const rect = node.getBoundingClientRect();
      return rect.width >= innerWidth * .55 && rect.height >= innerHeight * .30;
    }), id);
    if (screenshots) await card.screenshot({path: join(screenshots, `${id}.png`), animations: 'disabled'});

    await card.locator('[data-detail]').click();
    const detail = page.frameLocator('#component-frame');
    await detail.getByRole('button', {name: trigger, exact: true}).click();
    await result(detail).waitFor();
    await page.locator('#component-close').click();
  }
});

test('Astryx 新示例可全选表单、拖选图表和进入实验导航的下一层', { timeout: 30_000 }, async t => {
  const site = await startServer(t);
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const page = await browser.newPage({viewport: {width: 680, height: 540}, reducedMotion: 'reduce'});
  t.after(() => page.close());
  page.setDefaultTimeout(5_000);
  const open = key => {
    const sample = astryxWorks.find(item => item.id === `astryx-${key}`);
    assert.ok(sample, key);
    return page.goto(new URL(sample.demo, site).href);
  };

  await open('variant-checkbox-list-checkbox-list-select-all-pattern');
  const all = page.getByRole('checkbox', {name: 'Select all'});
  await all.press('Space');
  assert.ok(await page.getByRole('checkbox', {name: 'Invoices'}).isChecked());

  await open('chart-brush-line');
  const brush = page.locator('svg rect[style*="crosshair"]');
  await brush.waitFor();
  const {x, y, width, height} = await brush.boundingBox();
  await page.mouse.move(x + width * .2, y + height * .42);
  await page.mouse.down();
  await page.mouse.move(x + width * .63, y + height * .42, {steps: 10});
  await page.mouse.up();
  await page.getByText(/\d+ months selected/).waitFor();

  await open('lab-navigation-stack');
  await page.getByText('General', {exact: true}).click();
  await page.getByText('Software Update', {exact: true}).waitFor();
});
