/**
 * Cloudflare Worker / Edge Serverless Relay for Apibara Vehicle Auction Data API
 * 
 * Deployment Instructions for leeautox.com on GitHub Pages:
 * 1. Log in to your Cloudflare dashboard (free tier includes 100k requests/day).
 * 2. Create a new Worker (e.g. "leeautox-auction-proxy").
 * 3. Paste this code into Worker editor.
 * 4. In Worker Settings -> Variables and Secrets:
 *    Add Secret: AUCTION_API_KEY = your_apibara_api_key_here
 * 5. Deploy the Worker and copy its URL (e.g. https://leeautox-auction-proxy.yoursubdomain.workers.dev).
 * 6. In your GitHub repository:
 *    Settings -> Secrets and variables -> Actions:
 *    Add Variable or Secret: VITE_AUCTION_PROXY_URL = https://leeautox-auction-proxy.yoursubdomain.workers.dev
 * 7. When GitHub Actions runs "deploy.yml", it bakes this relay URL into the static build.
 * 
 * The worker safely keeps your API key hidden on the edge, adds origin checks, and caches responses!
 */

const APIBARA_BASE = 'https://apibara.tech/api/v1/vehicle-auction';

const ALLOWED_ORIGIN_PATTERNS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/([a-z0-9-]+\.)*run\.app$/,
  /^https:\/\/([a-z0-9-]+\.)*github\.io$/,
  /^https:\/\/([a-z0-9-]+\.)*leeautox\.com$/,
  /^https:\/\/leeautox\.com$/,
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    // Verify allowed origin
    const isAllowed = !origin || ALLOWED_ORIGIN_PATTERNS.some((p) => p.test(origin));
    const corsOrigin = isAllowed ? (origin || '*') : 'https://leeautox.com';

    const corsHeaders = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, X-API-Key, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Health / Diagnostics endpoint (never reveals key)
    if (url.pathname === '/health' || url.pathname === '/api/auction-status') {
      const keyExists = Boolean(env.AUCTION_API_KEY && env.AUCTION_API_KEY.trim().length > 0);
      return new Response(
        JSON.stringify({
          ok: true,
          live_relay: true,
          key_configured: keyExists,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    // Strip prefix: handles /api/auction/* or /*
    let subpath = url.pathname;
    if (subpath.startsWith('/api/auction')) {
      subpath = subpath.replace(/^\/api\/auction/, '');
    }
    const targetUrl = `${APIBARA_BASE}${subpath}${url.search}`;

    const apiKey = env.AUCTION_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'AUCTION_API_KEY is not configured in Worker secrets.',
          status: 401,
          fallback: true,
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Cache lookup for GET requests
    const cache = caches.default;
    if (request.method === 'GET') {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        const newHeaders = new Headers(cachedResponse.headers);
        Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));
        newHeaders.set('X-Proxy-Cache', 'HIT');
        return new Response(cachedResponse.body, {
          status: cachedResponse.status,
          headers: newHeaders,
        });
      }
    }

    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      });

      const responseData = await response.text();
      const responseHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([k, v]) => responseHeaders.set(k, v));
      responseHeaders.set('X-Proxy-Cache', 'MISS');

      // Cache successful vehicle listing and filter queries
      if (request.method === 'GET' && response.status === 200) {
        responseHeaders.set('Cache-Control', 'public, max-age=120, s-maxage=300');
        const resToCache = new Response(responseData, {
          status: response.status,
          headers: responseHeaders,
        });
        ctx.waitUntil(cache.put(request, resToCache.clone()));
        return resToCache;
      }

      return new Response(responseData, {
        status: response.status,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: 'Failed to communicate with Apibara Vehicle Auction API',
          details: err?.message,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
