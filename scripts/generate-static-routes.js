import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const DIST_DIR = path.resolve('dist');
const BASE_URL = 'https://leeautox.com';

const NOINDEX_NOFOLLOW_ROUTES = new Set(['/bkend/', '/admin/reviews/']);
const NOINDEX_FOLLOW_ROUTES = new Set(['/auction-search/', '/auction-lot/']);
const NON_CANONICAL_ALIAS_ROUTES = new Set([
  '/cars-for-sale/',
  '/guides/why-import-vehicles-from-canada/'
]);

const moduleCache = new Map();
function loadTsModule(tsFilePath) {
  const absPath = path.resolve(tsFilePath);
  if (moduleCache.has(absPath)) {
    return moduleCache.get(absPath).exports;
  }

  const source = fs.readFileSync(absPath, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      resolveJsonModule: true
    },
    fileName: absPath
  });

  const mod = { exports: {} };
  moduleCache.set(absPath, mod);

  const localRequire = (specifier) => {
    if (specifier.startsWith('.')) {
      const baseTarget = path.resolve(path.dirname(absPath), specifier);
      if (fs.existsSync(baseTarget) && baseTarget.endsWith('.json')) {
        return JSON.parse(fs.readFileSync(baseTarget, 'utf8'));
      }
      if (fs.existsSync(`${baseTarget}.ts`)) {
        return loadTsModule(`${baseTarget}.ts`);
      }
      if (fs.existsSync(`${baseTarget}.json`)) {
        return JSON.parse(fs.readFileSync(`${baseTarget}.json`, 'utf8'));
      }
      if (fs.existsSync(baseTarget)) {
        return require(baseTarget);
      }
      return {};
    }
    return require(specifier);
  };

  const fn = new Function('exports', 'require', 'module', '__filename', '__dirname', outputText);
  fn(mod.exports, localRequire, mod, absPath, path.dirname(absPath));
  return mod.exports;
}

function escapeHtmlAttr(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtmlText(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function main() {
  console.log('🚀 Executing post-build Static Page and SEO pre-injection compiler...');
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Build directory dist/ does not exist! Please run "npm run build" first.');
    process.exit(1);
  }

  const baseHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(baseHtmlPath)) {
    console.error('❌ dist/index.html is missing!');
    process.exit(1);
  }
  const baseHtmlContent = fs.readFileSync(baseHtmlPath, 'utf8');

  const { SEO_DATA } = loadTsModule('src/seoData.ts');
  const { INITIAL_INVENTORY, getVehicleUrl } = loadTsModule('src/data/inventory.ts');
  const { getAllPosts } = loadTsModule('src/data/posts.ts');

  const ROUTES_SEO = {};

  // 1. Load all curated routes from src/seoData.ts
  for (const [route, data] of Object.entries(SEO_DATA)) {
    ROUTES_SEO[route] = {
      title: data.title,
      desc: data.description,
      keywords: data.keywords,
      canonical: data.canonical || `${BASE_URL}${route}`,
      image: data.defaultImage || 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/cropped-LeeAutoX-lcon-1-430x260-1.png',
      schema: data.schema,
      priority: route === '/' ? '1.0' : route.startsWith('/blog/') ? '0.9' : '0.8'
    };
  }

  // 2. Load any additional blog posts from src/data/posts.ts + src/generated/posts.json
  const allPosts = getAllPosts();
  for (const p of allPosts) {
    const routePath = `/blog/${p.slug}/`;
    if (!ROUTES_SEO[routePath]) {
      ROUTES_SEO[routePath] = {
        title: `${p.title} | LeeAutoX`,
        desc: p.excerpt || `Read expert guide on ${p.title} by LeeAutoX.`,
        keywords: p.tags?.length ? p.tags.join(', ') : 'car import, shipping canada nigeria',
        canonical: `${BASE_URL}${routePath}`,
        image: p.featuredImage?.url || 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/cropped-LeeAutoX-lcon-1-430x260-1.png',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': p.title,
          'datePublished': p.date,
          'author': { '@type': 'Person', 'name': p.author }
        },
        priority: '0.9'
      };
      console.log(`  ➕ Added blog route to SEO catalog: ${routePath}`);
    }
  }

  // 3. Register all active vehicles directly from src/data/inventory.ts
  for (const v of INITIAL_INVENTORY) {
    const routePath = getVehicleUrl(v);
    const canonicalUrl = `${BASE_URL}${routePath}`;
    const isOverseas = v.location === 'Canada & USA';
    const title = v.seoTitle || (isOverseas
      ? `${v.year} ${v.make} ${v.model} For Sale | Import from Canada & USA | LeeAutoX`
      : `${v.year} ${v.make} ${v.model} For Sale | Lagos Nigeria Import | LeeAutoX`);
    const desc = v.seoDescription || (isOverseas
      ? `Buy verified ${v.year} ${v.make} ${v.model} located in ${v.currentLocation || 'Canada & USA'}. Shipped to Nigeria upon your request once deposit is made.`
      : `Buy verified ${v.year} ${v.make} ${v.model} on ground in Lagos, Nigeria. Fully customs cleared, 100% duty paid, available for physical inspection and test drive.`);

    const uniqueImages = Array.from(new Set([v.image, ...(v.images || [])].filter(Boolean)));
    const availabilityUrl =
      v.status === 'Sold'
        ? 'https://schema.org/OutOfStock'
        : v.status === 'Reserved'
        ? 'https://schema.org/LimitedAvailability'
        : 'https://schema.org/InStock';

    const vehicleSchema = {
      '@type': ['Vehicle', 'Product'],
      '@id': `${canonicalUrl}#vehicle`,
      'name': v.name,
      'description': desc,
      'url': canonicalUrl,
      'image': uniqueImages,
      'brand': {
        '@type': 'Brand',
        'name': v.make
      },
      'model': v.model,
      'vehicleModelDate': String(v.year),
      'offers': {
        '@type': 'Offer',
        'price': v.numericPrice,
        'priceCurrency': 'NGN',
        'availability': availabilityUrl,
        'itemCondition': 'https://schema.org/UsedCondition',
        'url': canonicalUrl,
        'seller': {
          '@id': `${BASE_URL}/#organization`
        }
      }
    };
    if (v.bodyType) vehicleSchema.bodyType = v.bodyType;
    if (v.colour) vehicleSchema.color = v.colour;
    if (v.transmission) vehicleSchema.vehicleTransmission = v.transmission;
    if (v.fuelType) vehicleSchema.fuelType = v.fuelType;
    if (v.vin) vehicleSchema.vehicleIdentificationNumber = v.vin;

    ROUTES_SEO[routePath] = {
      title,
      desc,
      keywords: `${v.make} ${v.model}, ${v.year} ${v.make}, buy car nigeria, verified cars leeautox`,
      canonical: canonicalUrl,
      image: v.image,
      schema: vehicleSchema,
      isVehicleSchema: true,
      priority: '0.8'
    };
    console.log(`  ➕ Added SEO vehicle route: ${routePath}`);
  }

  const STATIC_ORGANIZATION_SCHEMA = {
    '@type': 'AutoDealer',
    '@id': `${BASE_URL}/#organization`,
    'name': 'LeeAutoX',
    'url': `${BASE_URL}/`,
    'logo': 'https://leeplugshub.com/wp-content/uploads/2026/05/LeeAutoX-lcon-1-scaled.png',
    'image': 'https://leeplugshub.com/wp-content/uploads/2026/05/leeautoxhero.png',
    'telephone': '+1-647-389-6162',
    'email': 'info@leeautox.com',
    'priceRange': '$$$$',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Lagos',
      'addressCountry': 'NG'
    }
  };

  function getRobotsDirective(route) {
    if (NOINDEX_NOFOLLOW_ROUTES.has(route)) return 'noindex, nofollow';
    if (NOINDEX_FOLLOW_ROUTES.has(route)) return 'noindex, follow';
    return 'index, follow';
  }

  function stripExistingSeoTags(html) {
    return html
      .replace(/<title>[^<]*<\/title>\s*/gi, '')
      .replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, '')
      .replace(/<meta\s+name=["']keywords["'][^>]*>\s*/gi, '')
      .replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi, '')
      .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '')
      .replace(/<meta\s+property=["']og:(title|description|url|image)["'][^>]*>\s*/gi, '')
      .replace(/<meta\s+name=["']twitter:(title|description|image|site)["'][^>]*>\s*/gi, '')
      .replace(/<script[^>]*id=["']seo-schema-jsonld["'][^>]*>[\s\S]*?<\/script>\s*/gi, '');
  }

  function injectMeta(html, route, data) {
    let modified = stripExistingSeoTags(html);
    const robots = getRobotsDirective(route);
    const canonical = data.canonical || `${BASE_URL}${route}`;
    const ogImage = data.image || 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/cropped-LeeAutoX-lcon-1-430x260-1.png';

    let graphItems = [];
    if (data.isVehicleSchema && data.schema) {
      graphItems = [STATIC_ORGANIZATION_SCHEMA, data.schema];
    } else if (data.schema && Array.isArray(data.schema['@graph'])) {
      graphItems = [
        STATIC_ORGANIZATION_SCHEMA,
        ...data.schema['@graph'].filter(
          (i) => i['@type'] !== 'Organization' && i['@type'] !== 'AutoDealer' && i['@type'] !== 'AutomotiveBusiness'
        )
      ];
    } else if (data.schema) {
      const { aggregateRating, review, ...cleanSchema } = data.schema;
      if (cleanSchema['@type'] === 'Organization' || cleanSchema['@type'] === 'AutoDealer' || cleanSchema['@type'] === 'AutomotiveBusiness') {
        graphItems = [{ ...STATIC_ORGANIZATION_SCHEMA, ...cleanSchema, '@type': 'AutoDealer' }];
      } else {
        const pageNode = {
          ...cleanSchema,
          '@id': `${BASE_URL}${route}#webpage`,
          'isPartOf': { '@id': `${BASE_URL}/#organization` }
        };
        graphItems = [STATIC_ORGANIZATION_SCHEMA, pageNode];
      }
    } else {
      graphItems = [STATIC_ORGANIZATION_SCHEMA];
    }

    const fullSchema = {
      '@context': 'https://schema.org',
      '@graph': graphItems
    };

    const injections = [
      `    <title>${escapeHtmlText(data.title)}</title>`,
      `    <meta name="robots" content="${robots}" />`,
      `    <meta name="description" content="${escapeHtmlAttr(data.desc)}" />`,
      `    <meta name="keywords" content="${escapeHtmlAttr(data.keywords || 'car sourcing, shipping')}" />`,
      `    <link rel="canonical" href="${escapeHtmlAttr(canonical)}" />`,
      `    <meta property="og:title" content="${escapeHtmlAttr(data.title)}" />`,
      `    <meta property="og:description" content="${escapeHtmlAttr(data.desc)}" />`,
      `    <meta property="og:url" content="${escapeHtmlAttr(canonical)}" />`,
      `    <meta property="og:image" content="${escapeHtmlAttr(ogImage)}" />`,
      `    <meta name="twitter:title" content="${escapeHtmlAttr(data.title)}" />`,
      `    <meta name="twitter:description" content="${escapeHtmlAttr(data.desc)}" />`,
      `    <meta name="twitter:image" content="${escapeHtmlAttr(ogImage)}" />`,
      `    <meta name="twitter:site" content="@leeautox" />`,
      `    <script id="seo-schema-jsonld" type="application/ld+json">${JSON.stringify(fullSchema)}</script>`
    ].join('\n');

    modified = modified.replace('</head>', () => `${injections}\n  </head>`);
    return modified;
  }

  const preExistingRoutes = Object.keys(ROUTES_SEO);

  for (const [route, data] of Object.entries(ROUTES_SEO)) {
    const targetFolder = route === '/' ? DIST_DIR : path.join(DIST_DIR, route);
    const targetHtmlFile = path.join(targetFolder, 'index.html');
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }
    const modifiedHtml = injectMeta(baseHtmlContent, route, data);
    fs.writeFileSync(targetHtmlFile, modifiedHtml, 'utf8');
    console.log(`  ✅ Generated: ${route}index.html (${getRobotsDirective(route)})`);

    // Also write flat .html files for /auction-search and /auction-lot
    if (route === '/auction-search/') {
      fs.writeFileSync(path.join(DIST_DIR, 'auction-search.html'), modifiedHtml, 'utf8');
      console.log('  ✅ Generated: auction-search.html (noindex, follow)');
    } else if (route === '/auction-lot/') {
      fs.writeFileSync(path.join(DIST_DIR, 'auction-lot.html'), modifiedHtml, 'utf8');
      console.log('  ✅ Generated: auction-lot.html (noindex, follow)');
    }
  }

  // Generate sitemap.xml containing ONLY indexable, canonical URLs
  console.log('🗺️ Generating sitemap.xml (indexable canonical URLs only)...');
  const today = new Date().toISOString().split('T')[0];
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  let sitemapCount = 0;

  for (const [route, data] of Object.entries(ROUTES_SEO)) {
    const isNoIndex = NOINDEX_NOFOLLOW_ROUTES.has(route) || NOINDEX_FOLLOW_ROUTES.has(route);
    const isAlias = NON_CANONICAL_ALIAS_ROUTES.has(route) || (data.canonical && data.canonical !== `${BASE_URL}${route}`);
    if (isNoIndex || isAlias) {
      console.log(`  ⏭️ Excluded from sitemap.xml (${isNoIndex ? 'noindex' : 'non-canonical alias'}): ${route}`);
      continue;
    }

    sitemapXml += `  <url>\n    <loc>${BASE_URL}${route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${data.priority || '0.8'}</priority>\n  </url>\n`;
    sitemapCount++;
  }
  sitemapXml += `</urlset>\n`;
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  console.log(`  ✅ Generated: sitemap.xml (${sitemapCount} canonical indexable URLs)`);

  // Generate robots.txt — keep noindex URLs crawlable so Googlebot reads noindex and drops them cleanly
  console.log('🤖 Generating robots.txt...');
  const robotsTxt = `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');
  console.log('  ✅ Generated: robots.txt');

  // Verification Check
  console.log('🔍 Running post-build verification check...');
  let missingCount = 0;
  for (const route of preExistingRoutes) {
    const checkFolder = route === '/' ? DIST_DIR : path.join(DIST_DIR, route);
    const checkFile = path.join(checkFolder, 'index.html');
    if (!fs.existsSync(checkFile)) {
      console.error(`❌ Verification failed: Route missing in dist: ${route}`);
      missingCount++;
    }
  }

  if (missingCount > 0) {
    console.error(`❌ Build verification failed with ${missingCount} missing URLs.`);
    process.exit(1);
  }

  console.log(`🎉 Post-build compilation & verification complete! ${preExistingRoutes.length} routes generated, ${sitemapCount} indexable URLs in sitemap.xml.`);
}

main().catch((err) => {
  console.error('❌ Static generator failed:', err);
  process.exit(1);
});
