import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const APIBARA_BASE = 'https://apibara.tech/api/v1/vehicle-auction';

app.use(express.json());

// CORS middleware for authorized origins
const ALLOWED_ORIGIN_PATTERNS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/([a-z0-9-]+\.)*run\.app$/,
  /^https:\/\/([a-z0-9-]+\.)*github\.io$/,
  /^https:\/\/([a-z0-9-]+\.)*leeautox\.com$/,
  /^https:\/\/leeautox\.com$/,
];

app.use((req: Request, res: Response, next) => {
  const origin = req.headers.origin;
  if (origin) {
    const isAllowed = ALLOWED_ORIGIN_PATTERNS.some((p) => p.test(origin));
    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-API-Key, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

// Relay diagnostics / health endpoint (never exposes key)
app.get('/api/auction-status', (_req: Request, res: Response): void => {
  const apiKey = process.env.AUCTION_API_KEY || process.env.APIBARA_API_KEY;
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    ok: true,
    live_relay: true,
    key_configured: Boolean(apiKey && apiKey.trim().length > 0),
    timestamp: new Date().toISOString(),
  });
});

// Proxy endpoint for Apibara Vehicle Auction Data API
// Keeps AUCTION_API_KEY strictly on the server; never exposed to browser
app.all('/api/auction/*', async (req: Request, res: Response): Promise<void> => {
  const subpath = req.url.replace(/^\/api\/auction/, '');
  const targetUrl = `${APIBARA_BASE}${subpath}`;

  const apiKey = process.env.AUCTION_API_KEY || process.env.APIBARA_API_KEY;

  if (!apiKey) {
    // If no key is set on server, send 401 so frontend uses safe fallback
    res.status(401).json({
      error: 'AUCTION_API_KEY is not configured on the server. Falling back to local demonstration data.',
      status: 401,
      fallback: true
    });
    return;
  }

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();

    res.status(response.status);
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('content-type', contentType);
    }
    // Add client-friendly cache headers for successful GETs
    if (req.method === 'GET' && response.status === 200) {
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=180');
    }
    res.send(data);
  } catch (error: any) {
    console.error('Auction API proxy error:', error?.message);
    res.status(502).json({
      error: 'Failed to communicate with Apibara Vehicle Auction API',
      details: error?.message,
    });
  }
});

// Mount Vite in dev mode, or serve static dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
