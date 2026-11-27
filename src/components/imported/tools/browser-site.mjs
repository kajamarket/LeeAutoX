import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {extname} from 'node:path';

const site = new URL('../_site/', import.meta.url);
const prefix = '/ui-moments/';
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
};

export async function startServer(t, {cacheAssets = false} = {}) {
  const server = createServer(async (req, res) => {
    const path = new URL(req.url, 'http://127.0.0.1').pathname;
    const relative = path.slice(prefix.length);
    if (!path.startsWith(prefix) || relative.includes('..')) {
      res.writeHead(404).end();
      return;
    }
    if (relative === 'card-preview-test') {
      res.writeHead(200, {'Content-Type': types['.html']}).end('<iframe style="display:block;border:0"></iframe>');
      return;
    }
    const file = path.endsWith('/') ? relative + 'index.html' : relative;
    try {
      const data = await readFile(new URL(file, site));
      const headers = {'Content-Type': types[extname(file)] ?? 'text/plain'};
      if (cacheAssets && /\/(?:dist|media)\//.test(file) && !file.endsWith('.html')) {
        headers['Cache-Control'] = 'public, max-age=3600';
      }
      res.writeHead(200, headers).end(data);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());
  return `http://127.0.0.1:${server.address().port}${prefix}`;
}

export function monitor(page, issues, base) {
  page.on('pageerror', error => issues.push(error.message));
  page.on('requestfailed', request => {
    if (request.failure()?.errorText !== 'net::ERR_ABORTED') issues.push(request.url());
  });
  page.on('request', request => {
    if (/^https?:/.test(request.url()) && !request.url().startsWith(base)) issues.push(request.url());
  });
  page.on('response', response => {
    if (response.status() >= 400) issues.push(`${response.status()} ${response.url()}`);
  });
}
