import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {test} from 'node:test';
import {chromium, firefox, webkit} from 'playwright';

const examples = new URL('../_site/gallery/originals/dist/', import.meta.url);

for (const engine of [chromium, firefox, webkit]) {
  test(`${engine.name()} 离线运行三种独立控件，支持键盘、主题和减少动态效果`, {timeout: 25_000}, async t => {
    const browser = await engine.launch();
    t.after(() => browser.close());
    const page = await browser.newPage({
      viewport: {width: 320, height: 700},
      colorScheme: 'dark',
      reducedMotion: 'reduce',
      offline: true,
    });
    const errors = [], network = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (/^https?:/.test(request.url())) network.push(request.url());
    });

    async function open(id) {
      const file = new URL(`${id}.html`, examples);
      const html = await readFile(file, 'utf8');
      assert.match(html, /Permission is hereby granted/);
      assert.ok(Buffer.byteLength(html) < 16 * 1024, `${id} 独立示例体积`);
      await page.goto(file.href);
      assert.equal(await page.locator('.sample').count(), 1);
      assert.equal(await page.locator('.sample').getAttribute('id'), id);
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320);
    }

    await open('ink-switch');
    const ink = page.getByRole('switch', {name: 'Ink Switch'});
    await page.evaluate(() => {
      document.body.dataset.changes = '';
      document.body.addEventListener('change', event => {
        document.body.dataset.changes += `${event.target.getAttribute('aria-checked')} `;
      });
    });
    await ink.press('Space');
    assert.equal(await ink.getAttribute('aria-checked'), 'true');
    assert.ok(await ink.evaluate(element => element.matches(':focus-visible')));
    assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
    await ink.press('Enter');
    assert.equal(await ink.getAttribute('aria-checked'), 'false');
    assert.equal(await page.locator('body').getAttribute('data-changes'), 'true false ');
    const theme = page.getByRole('button', {name: 'Dark theme'});
    await theme.press('Space');
    assert.equal(await theme.getAttribute('aria-pressed'), 'false');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');

    await open('detent-dial');
    const dial = page.getByRole('slider', {name: 'Detent Dial'});
    for (const [key, value] of [['Home', '0'], ['PageUp', '2'], ['ArrowRight', '3'], ['End', '10'], ['PageDown', '8']]) {
      await dial.press(key);
      assert.equal(await dial.getAttribute('aria-valuenow'), value);
      assert.equal(await page.locator('.dial-value').textContent(), value);
    }
    assert.equal(await page.evaluate(() => document.getAnimations().length), 0);

    await open('jelly-pad');
    const jelly = page.getByRole('button', {name: 'Jelly Cube'});
    // Capture the static nudge in the key event, before its reset timer can run.
    await jelly.evaluate(button => button.addEventListener('keydown', () => {
      button.dataset.nudge = getComputedStyle(button.firstElementChild).transform;
    }, {once: true}));
    await jelly.press('ArrowRight');
    assert.match(await jelly.getAttribute('data-nudge'), /^matrix\(1, 0, 0, 1, [1-9]\d*, 0\)$/);
    const box = await jelly.boundingBox();
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 28, y + 8);
    assert.match(await page.locator('.jelly-cube').evaluate(element => getComputedStyle(element).transform), /^matrix\(1, 0, 0, 1, [1-9]/);
    await page.mouse.up();
    assert.match(await page.locator('.jelly-cube').evaluate(element => getComputedStyle(element).transform), /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);

    assert.deepEqual(errors, []);
    assert.deepEqual(network, []);
  });
}
