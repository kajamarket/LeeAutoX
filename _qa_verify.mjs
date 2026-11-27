import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME_BIN = '/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell';
const BASE_URL = 'http://localhost:3000';
const USER_DATA_DIR = '/tmp/qa_chrome_profile_' + Date.now();

function startChrome() {
  return spawn(CHROME_BIN, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--remote-debugging-port=9223',
    `--user-data-dir=${USER_DATA_DIR}`,
    'about:blank',
  ], { stdio: 'ignore' });
}

async function waitForCdp(port = 9223) {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (res.ok) return await res.json();
    } catch {}
    await new Promise(r => setTimeout(r, 150));
  }
  throw new Error('CDP did not become ready');
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    this.ready = new Promise((res, rej) => {
      this.ws.onopen = res;
      this.ws.onerror = rej;
    });
    this.ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
      }
    };
  }
  async send(method, params = {}) {
    await this.ready;
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expr) {
    const res = await this.send('Runtime.evaluate', {
      expression: expr,
      awaitPromise: true,
      returnByValue: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || JSON.stringify(res.exceptionDetails));
    }
    return res.result?.value;
  }
  close() {
    try { this.ws.close(); } catch {}
  }
}

async function main() {
  const chrome = startChrome();
  try {
    const targets = await waitForCdp(9223);
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const cdp = new CdpClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    const consoleErrors = [];
    cdp.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(msg.params?.exceptionDetails?.text || 'Runtime exception');
      }
    });

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280, height: 800, deviceScaleFactor: 1, mobile: false,
    });

    await cdp.send('Page.navigate', { url: BASE_URL });
    await new Promise(r => setTimeout(r, 2600));

    // Skip intro preloader if active
    await cdp.eval(`(() => {
      sessionStorage.setItem('leeautox_intro_seen', '1');
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => /skip/i.test(b.textContent || ''));
      if (skipBtn) skipBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1200));

    const desktopReport = await cdp.eval(`(() => {
      const bodyText = document.body.innerText || '';
      const hasOldShowcaseLabel = bodyText.includes('Interactive Showcase') || bodyText.includes('Tap Paint or Wheels');
      const heroImgPreload = !!document.querySelector('link[rel="preload"][href="/media/exterior-polished.png"]');
      const fonts = Array.from(document.fonts).map(f => f.family + ':' + f.status);

      const getPadTop = (sel) => {
        const el = document.querySelector(sel);
        return el ? parseFloat(getComputedStyle(el).paddingTop) : -1;
      };
      const getBg = (sel) => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el).backgroundColor : 'missing';
      };

      const veyra = document.querySelector('.veyra-scope');
      let veyraAncestorTransforms = [];
      let p = veyra?.parentElement;
      while (p && p !== document.body) {
        const cs = getComputedStyle(p);
        if ((cs.transform && cs.transform !== 'none') || (cs.filter && cs.filter !== 'none')) {
          veyraAncestorTransforms.push({ tag: p.tagName, cls: p.className, transform: cs.transform, filter: cs.filter });
        }
        p = p.parentElement;
      }

      const miniCards = Array.from(document.querySelectorAll('#testimonials [aria-label="Client testimonials marquee"] article'));
      const firstMini = miniCards[0];
      const miniRect = firstMini ? firstMini.getBoundingClientRect() : null;

      const carouselSection = document.querySelector('#testimonials [aria-roledescription="carousel"]');
      const quoteBefore = carouselSection?.querySelector('blockquote')?.textContent || '';
      const nextBtn = carouselSection?.querySelector('button[aria-label="Next testimonial"]');
      nextBtn?.click();
      const quoteAfter = carouselSection?.querySelector('blockquote')?.textContent || '';

      const contactLeft = document.querySelector('#contact');
      const contactInfoHasCard = !!contactLeft?.querySelector('.lx-card a[href^="mailto:"]');
      const hasMailto = !!contactLeft?.querySelector('a[href^="mailto:"]');
      const hasTel = !!contactLeft?.querySelector('a[href^="tel:"]');
      const hasWa = !!contactLeft?.querySelector('a[href*="wa.me"]');

      return {
        hasOldShowcaseLabel,
        heroImgPreload,
        padAuction: getPadTop('#auction-listings'),
        padTestimonials: getPadTop('#testimonials'),
        padContact: getPadTop('#contact'),
        bgs: {
          hero: getBg('section.lx-band-dark'),
          auction: getBg('#auction-listings'),
          whatWeDo: getBg('#what-we-do'),
          catalogue: getBg('#catalogue'),
          store: getBg('#store'),
          whyUs: getBg('#why-us'),
          deliveries: getBg('#deliveries'),
          testimonials: getBg('#testimonials'),
          faq: getBg('#faq'),
          location: getBg('#location'),
          contact: getBg('#contact'),
          footer: getBg('footer'),
        },
        veyraAncestorTransforms,
        miniCardSize: miniRect ? { w: Math.round(miniRect.width), h: Math.round(miniRect.height) } : null,
        carouselManualAdvanceWorked: quoteBefore.length > 0 && quoteAfter.length > 0 && quoteBefore !== quoteAfter,
        contactInfoHasCard,
        hasMailto,
        hasTel,
        hasWa,
        overflowX: document.documentElement.scrollWidth - window.innerWidth,
        fontsCount: fonts.length,
      };
    })()`);

    // Test Hero Paint Hotspot interaction
    const hotspotOk = await cdp.eval(`(() => {
      const btn = document.querySelector('.veyra-scope button[aria-label="Body colour"]');
      if (!btn) return { found: false };
      btn.click();
      return { found: true, expanded: btn.getAttribute('aria-expanded') };
    })()`);
    await new Promise(r => setTimeout(r, 200));
    const menuVisible = await cdp.eval(`!!document.querySelector('.veyra-scope .appearance-menu')`);

    // Test Marquee pause logic: NO hover pause, YES hold (pointerdown), YES Spacebar
    const marqueePauseCheck = await cdp.eval(`(() => {
      const region = document.querySelector('#testimonials [aria-label="Client testimonials marquee"]');
      if (!region) return { found: false };
      region.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      const afterHover = region.getAttribute('data-paused');
      region.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      return { found: true, afterHover, duringHold: region.getAttribute('data-paused') };
    })()`);
    await new Promise(r => setTimeout(r, 80));
    const marqueeAfterHoldAndSpace = await cdp.eval(`(() => {
      const region = document.querySelector('#testimonials [aria-label="Client testimonials marquee"]');
      const duringHold = region.getAttribute('data-paused');
      region.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      return duringHold;
    })()`);
    await new Promise(r => setTimeout(r, 80));
    const afterRelease = await cdp.eval(`(() => {
      const region = document.querySelector('#testimonials [aria-label="Client testimonials marquee"]');
      const released = region.getAttribute('data-paused');
      region.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
      return { released };
    })()`);
    await new Promise(r => setTimeout(r, 80));
    const afterSpace = await cdp.eval(`document.querySelector('#testimonials [aria-label="Client testimonials marquee"]')?.getAttribute('data-paused')`);

    // Scroll down page to trigger all isometric reveals & sticky hero check
    await cdp.eval(`window.scrollTo(0, 420)`);
    await new Promise(r => setTimeout(r, 450));
    const heroScrollActive = await cdp.eval(`document.querySelector('[data-hero-scroll]')?.getAttribute('data-scroll-active')`);

    for (let y = 1000; y <= 9500; y += 900) {
      await cdp.eval(`window.scrollTo(0, ${y})`);
      await new Promise(r => setTimeout(r, 120));
    }
    await new Promise(r => setTimeout(r, 1400));

    const isometricSettled = await cdp.eval(`(() => {
      const iso = Array.from(document.querySelectorAll('.lx-reveal[data-variant="isometric"][data-state="shown"]'));
      const nonFlat = iso.filter(el => {
        const t = getComputedStyle(el).transform;
        return t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)';
      });
      return { totalShown: iso.length, nonFlatCount: nonFlat.length };
    })()`);

    // Check dark mode toggle
    await cdp.eval(`document.documentElement.classList.add('dark')`);
    await new Promise(r => setTimeout(r, 350));
    const darkBgs = await cdp.eval(`(() => {
      const getBg = (sel) => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el).backgroundColor : 'missing';
      };
      return {
        body: getComputedStyle(document.body).backgroundColor,
        auction: getBg('#auction-listings'),
        whyUs: getBg('#why-us'),
        testimonials: getBg('#testimonials'),
        contact: getBg('#contact'),
      };
    })()`);
    await cdp.eval(`document.documentElement.classList.remove('dark')`);

    // Viewport overflow sweep across 320, 390, 768, 1280, 1600, 1920
    await cdp.eval(`window.scrollTo(0, 0)`);
    const viewports = [320, 390, 768, 1280, 1600, 1920];
    const vpResults = {};
    for (const w of viewports) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: w, height: w < 768 ? 760 : 900, deviceScaleFactor: 1, mobile: w < 768,
      });
      await new Promise(r => setTimeout(r, 250));
      vpResults[w] = await cdp.eval(`(() => {
        const mini = document.querySelector('#testimonials [aria-label="Client testimonials marquee"] article')?.getBoundingClientRect();
        return {
          overflowX: document.documentElement.scrollWidth - window.innerWidth,
          miniW: mini ? Math.round(mini.width) : 0,
          miniH: mini ? Math.round(mini.height) : 0,
        };
      })()`);
    }

    // Secondary route check: VehicleDetailPage 360 viewer opacity-only ancestor check
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280, height: 800, deviceScaleFactor: 1, mobile: false,
    });
    await cdp.send('Page.navigate', { url: `${BASE_URL}/vehicle/2_2021hyundaisonata/` });
    await new Promise(r => setTimeout(r, 1500));
    const viewerAncestors = await cdp.eval(`(() => {
      const viewer = document.querySelector('.cloudimage-360') || document.querySelector('[data-has-mode-toggle]');
      if (!viewer) return { found: false };
      const bad = [];
      let p = viewer.parentElement;
      while (p && p !== document.body) {
        const cs = getComputedStyle(p);
        if ((cs.transform && cs.transform !== 'none') || (cs.filter && cs.filter !== 'none')) {
          bad.push({ cls: p.className, transform: cs.transform, filter: cs.filter });
        }
        p = p.parentElement;
      }
      return { found: true, bad };
    })()`);

    console.log(JSON.stringify({
      desktopReport,
      hotspotOk,
      menuVisible,
      marqueePauseCheck: { ...marqueePauseCheck, duringHoldConfirmed: marqueeAfterHoldAndSpace, ...afterRelease, afterSpace },
      heroScrollActive,
      isometricSettled,
      darkBgs,
      vpResults,
      viewerAncestors,
      consoleErrors,
    }, null, 2));

    cdp.close();
  } finally {
    chrome.kill('SIGKILL');
    try { fs.rmSync(USER_DATA_DIR, { recursive: true, force: true }); } catch {}
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
