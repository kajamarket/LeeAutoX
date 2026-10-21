import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');

const ROUTES_SEO = {
  '/': {
    title: 'Car Import from Canada to Nigeria & Ghana | LeeAutoX',
    desc: 'Source and ship luxury cars, SUVs, and trucks from top Canadian and US auctions directly to Lagos, Nigeria or Accra, Ghana. Installment plans, full port clearance, doorstep delivery.',
    keywords: 'car sourcing, copart cars, shipping cars to nigeria, import cars from canada, luxury car procurement lagos, tokunbo cars',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'LeeAutoX',
      'url': 'https://leeautox.com/',
      'logo': 'https://leeplugshub.com/wp-content/uploads/2026/05/LeeAutoX-lcon-1-scaled.png'
    }
  },
  '/about/': {
    title: 'Vehicle Exporters in Lagos Nigeria & Ontario Canada | About LeeAutoX',
    desc: 'LeeAutoX is a registered Canadian corporation (No: 1761065-3) with operations in Lagos, Nigeria. Specialising in vehicle sourcing, containerisation, and customs clearance for West African buyers.',
    keywords: 'leeautox registered, car exporters canada, buy car from canada to nigeria, professional car procurement, emeka okonkwo car',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'mainEntity': {
        '@type': 'Organization',
        'name': 'LeeAutoX',
        'registrationNumber': '1761065-3'
      }
    }
  },
  '/how-it-works/': {
    title: 'How to Import Cars from Canada to Nigeria | LeeAutoX',
    desc: 'Step-by-step guide to importing a car from Canada or USA to Nigeria. From auction bidding and VIN inspection to container shipping and Lagos port clearance.',
    keywords: 'how to import car, copart bidding process, marine containerization process, apapa port clearance',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': 'How to Sourced and Import a Car with LeeAutoX'
    }
  },
  '/faq/': {
    title: 'Car Import FAQ for Nigeria & Ghana Buyers | LeeAutoX',
    desc: 'Answers to the most common questions about importing vehicles from Canada to Nigeria and Ghana. Shipping times, customs duty, installment plans, and port clearance explained.',
    keywords: 'car import faq, car shipping cost, customs clear cost nigeria, copart auction safety',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage'
    }
  },
  '/contact/': {
    title: 'Contact LeeAutoX | Lagos & Toronto Office Locations',
    desc: 'Get in touch with LeeAutoX. Chat directly with our procurement team in Toronto, Canada, or visit our clearance and support lot coordinators in Lagos, Nigeria.',
    keywords: 'contact leeautox, leeautox phone number, vehicle clearing agency address, buy car in lagos',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage'
    }
  },
  '/testimonials/': {
    title: 'Client Reviews & Delivery Testimonials | LeeAutoX',
    desc: 'Read verified reviews from car dealers and private buyers across Lagos, Abuja, Port Harcourt, and Accra who sourced and shipped their vehicles through LeeAutoX.',
    keywords: 'leeautox reviews, car buyer feedback lagos, verified shipping testimonials nigeria'
  },
  '/review/': {
    title: 'Leave a Verified Customer Review | LeeAutoX',
    desc: 'Share your feedback, vehicle importation experience, star rating, and delivery photos with the LeeAutoX team.',
    keywords: 'leave review leeautox, submit car rating, client feedback, rate vehicle importer'
  },
  '/admin/reviews/': {
    title: 'Admin Reviews Console | LeeAutoX',
    desc: 'Administrator dashboard for managing client reviews and Google Business Profile exports.',
    keywords: 'admin reviews, leeautox admin'
  },
  '/lee-auto/': {
    title: 'Lee Auto Nigeria | Dealer Car Servicing & Inspection in Lagos | LeeAutoX',
    desc: 'Lee Auto is the dealer-facing vehicle servicing division of LeeAutoX in Lagos, Nigeria. Pre-sale inspections, light mechanical prep, cosmetic detailing, and VIN verification for imported vehicles.',
    keywords: 'lee auto nigeria, lee auto lagos, lee autos nigeria, car servicing for dealers lagos, vehicle inspection lagos, imported car servicing nigeria'
  },
  '/vehicles/': {
    title: 'Available Car Catalogue & Sourced Fleet | LeeAutoX',
    desc: 'Browse available SUVs, luxury sedans, and commercial trucks ready for auction bidding and shipping from Canada to Nigeria and Ghana.',
    keywords: 'car catalog canada, buy suv nigeria, luxury sedan shipping'
  },
  '/services/': {
    title: 'Car Sourcing, Shipping & Port Clearance Services | LeeAutoX',
    desc: 'End-to-end car import services including Copart auction bidding, container consolidation, ocean freight, and customs port clearance at Apapa and Tin Can.',
    keywords: 'car shipping services lagos, apapa port clearance agency'
  },
  '/guides/': {
    title: 'Car Import Guides & Customs Duty Manuals | LeeAutoX',
    desc: 'Comprehensive guides on Nigerian customs duty calculation, vehicle inspection checklists, and Tokunbo car buying guides.',
    keywords: 'car import guides nigeria, customs duty calculator guide'
  },
  '/blog/': {
    title: 'Automotive Export & Shipping Journal | LeeAutoX',
    desc: 'Expert insights, Copart auction guides, customs clearing procedures, and container shipping strategies from Canada to West Africa.',
    keywords: 'car import blog, shipping insights nigeria, copart auction tips',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      'name': 'LeeAutoX Journal'
    }
  },
  '/blog/how-to-buy-clean-title-salvage-copart/': {
    title: 'How to Bid & Buy Clean Title or Repairable Cars on Copart | LeeAutoX',
    desc: 'Master the technicalities of Copart Canada: understanding run-and-drive verification, calculating repair margins, and avoiding uninspected auction pitfalls.',
    keywords: 'copart canada bidding, buy salvage cars toronto, auction vehicle inspection',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': 'How to Bid & Buy Clean Title or Repairable Cars on Copart'
    }
  },
  '/blog/shipping-car-canada-nigeria-complete-guide-2026/': {
    title: 'Shipping a Car from Canada to Nigeria in 2026 | Complete Guide | LeeAutoX',
    desc: 'The definitive 2026 guide to shipping a car from Canada to Nigeria. Learn about port-to-port routes, container freight options, documentation, and total shipping costs.',
    keywords: 'shipping car from canada to nigeria, how long does it take to ship car to nigeria, container shipping cost canada nigeria 2026',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': 'Shipping a car from Canada to Nigeria: 2026 guide'
    }
  },
  '/blog/how-to-import-car-for-dealers-nigeria/': {
    title: 'How Nigerian Car Dealers Can Import Vehicles from Canada | LeeAutoX',
    desc: 'Wholesale vehicle sourcing guide for Nigerian car dealers and fleet operators. Volume bidding, light prep at Lee Auto, multi-car container loading, and dealer financing.',
    keywords: 'car dealer import canada nigeria, wholesale car sourcing nigeria, fleet procurement canada africa',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': 'How Nigerian Car Dealers Can Import Vehicles from Canada'
    }
  }
};

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

  // Load any dynamic/WordPress posts from generated posts.json
  const postsJsonPath = path.resolve('src/generated/posts.json');
  if (fs.existsSync(postsJsonPath)) {
    try {
      const posts = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'));
      if (Array.isArray(posts)) {
        for (const p of posts) {
          const routePath = `/blog/${p.slug}/`;
          if (!ROUTES_SEO[routePath]) {
            ROUTES_SEO[routePath] = {
              title: `${p.title} | LeeAutoX`,
              desc: p.excerpt || `Read expert guide on ${p.title} by LeeAutoX.`,
              keywords: `${p.tags ? p.tags.join(', ') : 'car import, shipping canada nigeria'}`,
              schema: {
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                'headline': p.title,
                'datePublished': p.date,
                'author': { '@type': 'Person', 'name': p.author }
              }
            };
            console.log(`  ➕ Dynamically added blog route to SEO catalog: ${routePath}`);
          }
        }
      }
    } catch (e) {
      console.warn('⚠️ Could not parse generated posts.json for static routes:', e.message);
    }
  }

  const STATIC_ORGANIZATION_SCHEMA = {
    '@type': 'AutoDealer',
    '@id': 'https://leeautox.com/#organization',
    'name': 'LeeAutoX',
    'url': 'https://leeautox.com/',
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

  function injectMeta(html, route, data) {
    let modified = html;
    const titleRegex = /<title>[^<]*<\/title>/i;
    const customTitle = `<title>${data.title}</title>`;
    if (titleRegex.test(modified)) {
      modified = modified.replace(titleRegex, customTitle);
    } else {
      modified = modified.replace('</head>', `${customTitle}\n</head>`);
    }

    let injections = `  <meta name="description" content="${data.desc}" />\n  <meta name="keywords" content="${data.keywords || 'car sourcing, shipping'}" />\n  <link rel="canonical" href="https://leeautox.com${route}" />\n`;

    let graphItems = [];
    if (data.schema && Array.isArray(data.schema['@graph'])) {
      graphItems = [STATIC_ORGANIZATION_SCHEMA, ...data.schema['@graph'].filter(i => i['@type'] !== 'Organization' && i['@type'] !== 'AutoDealer')];
    } else if (data.schema) {
      const { aggregateRating, review, ...cleanSchema } = data.schema;
      const pageNode = {
        ...cleanSchema,
        '@id': `https://leeautox.com${route}#webpage`,
        'isPartOf': { '@id': 'https://leeautox.com/#organization' }
      };
      graphItems = [STATIC_ORGANIZATION_SCHEMA, pageNode];
    } else {
      graphItems = [STATIC_ORGANIZATION_SCHEMA];
    }

    const fullSchema = {
      '@context': 'https://schema.org',
      '@graph': graphItems
    };
    injections += `  <script id="seo-schema-jsonld" type="application/ld+json">${JSON.stringify(fullSchema)}</script>\n`;
    modified = modified.replace('</head>', `${injections}\n</head>`);
    return modified;
  }

  // Record list of pre-existing routes for verification check
  const preExistingRoutes = Object.keys(ROUTES_SEO);

  for (const [route, data] of Object.entries(ROUTES_SEO)) {
    const targetFolder = route === '/' ? DIST_DIR : path.join(DIST_DIR, route);
    const targetHtmlFile = path.join(targetFolder, 'index.html');
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }
    const modifiedHtml = injectMeta(baseHtmlContent, route, data);
    fs.writeFileSync(targetHtmlFile, modifiedHtml, 'utf8');
    console.log(`  ✅ Generated: ${route}index.html`);
  }

  // Generate sitemap.xml
  console.log('🗺️ Generating sitemap.xml...');
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const route of Object.keys(ROUTES_SEO)) {
    sitemapXml += `  <url>\n    <loc>https://leeautox.com${route}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${route === '/' ? '1.0' : route.startsWith('/blog/') ? '0.9' : '0.8'}</priority>\n  </url>\n`;
  }
  sitemapXml += `</urlset>`;
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  console.log('  ✅ Generated: sitemap.xml');

  // Generate robots.txt
  console.log('🤖 Generating robots.txt...');
  const robotsTxt = `User-agent: *\nAllow: /\nSitemap: https://leeautox.com/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');
  console.log('  ✅ Generated: robots.txt');

  // Verification Check (Rule: Verify all pre-existing URLs exist in dist)
  console.log('🔍 Running post-build verification check...');
  let missingCount = 0;
  for (const route of preExistingRoutes) {
    const checkFolder = route === '/' ? DIST_DIR : path.join(DIST_DIR, route);
    const checkFile = path.join(checkFolder, 'index.html');
    if (!fs.existsSync(checkFile)) {
      console.error(`❌ Verification failed: Pre-existing route missing in dist: ${route}`);
      missingCount++;
    }
  }

  if (missingCount > 0) {
    console.error(`❌ Build verification failed with ${missingCount} missing pre-existing URLs.`);
    process.exit(1);
  }

  console.log('🎉 Post-build compilation & verification complete! All pre-existing and dynamic routes verified in dist/');
}

main().catch(err => {
  console.error('❌ Static generator failed:', err);
    process.exit(1);
});
