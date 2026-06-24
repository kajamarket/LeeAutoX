import fs from 'fs';
import path from 'path';

// Centralized static definition of our 40+ routes for pre-injection (matching seoData.ts)
const ROUTES_SEO = {
  '/': {
    title: 'LeeAutoX | Premium Car Sourcing & Shipping USA/Canada to Nigeria',
    desc: 'Procure luxury cars, SUVs, and trucks from major auto auctions (Copart, IAAI) in the USA/Canada. Secure container shipping, port clearance, and doorstep delivery in Nigeria.',
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
    title: 'About LeeAutoX | Trusted North American Vehicle Exporters',
    desc: 'Learn about LeeAutoX, a fully registered Canadian corporation (No: 1761065-3) specializing in buying, shipping, and clearing vehicles for clients in Nigeria and across West Africa.',
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
    title: 'How It Works | Sourcing and Shipping Process | LeeAutoX',
    desc: 'Discover our step-by-step vehicle import flow: from custom requests, vehicle verification, and bidding on dealer-only auctions to containerized ocean shipping and customs clearance in Lagos.',
    keywords: 'how to import car, copart bidding process, marine containerization process, apapa port clearance',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': 'How to Sourced and Import a Car with LeeAutoX'
    }
  },
  '/faq/': {
    title: 'FAQ | Vehicle Importation & Customs Clearance Questions',
    desc: 'Frequently asked questions regarding buying vehicles from North American auctions, ocean transit times, customs duty payments in Nigeria, and flexible installment plans.',
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
    title: 'Client Testimonials & Verified Deliveries | LeeAutoX',
    desc: 'Read reviews and track live visual delivery timelines for 2021 Hyundai Sonatas, Toyota SUVs, and luxury pre-orders cleared safely into Lagos, Nigeria.',
    keywords: 'leeautox testimonials, happy clients, copart car delivery photos, verified car importer',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Client Reviews'
    }
  },
  // NIGERIA
  '/nigeria/': {
    title: 'Car Importation to Nigeria | Trusted Sourcing & Clearing | LeeAutoX',
    desc: 'The definitive hub for importing clean Tokunbo cars, luxury sports sedans, and SUVs from USA/Canada auctions to Nigeria. High-efficiency port clearance at Apapa/Tin Can.',
    keywords: 'tokunbo cars lagos, car dealer nigeria, buy car copart nigeria, car clearing lagos'
  },
  '/nigeria/lagos/': {
    title: 'Buy Cars in Lagos | Port Clearing & Handover Specialists | LeeAutoX',
    desc: 'We procure and clear vehicles directly for Lagos clients. Our in-house clearing agency clears cars at Apapa and Tin Can ports with zero delays. Fully verified delivery.',
    keywords: 'cars for sale lagos, apapa port clearing agent, tin can customs duty, tokunbo car lot lagos'
  },
  '/nigeria/abuja/': {
    title: 'Luxury Car Shipping to Abuja | Reliable Auction Sourcing | LeeAutoX',
    desc: 'Secure premier luxury sedans, custom SUVs, and premium hybrids. Premium shipping to Lagos ports with insured carrier transit directly to your Abuja residence.',
    keywords: 'luxury cars abuja, custom SUVs abuja, car transport lagos to abuja, premium cars FCT'
  },
  '/nigeria/port-harcourt/': {
    title: 'Port Harcourt Car Importers | Heavy Trucks & SUVs | LeeAutoX',
    desc: 'Import sturdy off-road SUVs, heavy duty commercial trucks, and executive sedans directly to Port Harcourt. Fully managed logistics, documentation, and safe transit.',
    keywords: 'car dealer port harcourt, heavy trucks PH, off-road SUVs rivers state, import cars to port harcourt'
  },
  '/nigeria/import-duty-calculator/': {
    title: 'Nigeria Custom Car Import Duty Calculator 2026 | LeeAutoX',
    desc: 'Calculate Nigeria port customs duty, levies, clearing agent fees, and total landing costs for sedans, SUVs, and commercial trucks imported from USA or Canada.',
    keywords: 'nigeria customs duty calculator, import levy lagos port, how much to clear 2021 hyundai sonata, clearing rate apapa'
  },
  // GHANA
  '/ghana/': {
    title: 'Car Importation to Ghana | Secure Sourcing & Transit | LeeAutoX',
    desc: 'Procure reliable salvages, clean titles, or brand new vehicles from North American auctions directly to Ghana. Expert container shipping and port clearance in Tema.',
    keywords: 'car import ghana, copart ghana, buy car from canada to ghana, tema port clearing agent'
  },
  '/ghana/accra/': {
    title: 'Buy Cars in Accra | Tema Port Clearing & Delivery | LeeAutoX',
    desc: 'Sourcing, shipping, and clearing premium sedans and SUVs through Tema Port for clients in Accra. Installment plans and verified doorstep deliveries.',
    keywords: 'cars for sale accra, tema port clearance cost, buy car in ghana, canada car shipping accra'
  },
  '/ghana/kumasi/': {
    title: 'Kumasi Car Importers | Direct Auction Pre-Orders | LeeAutoX',
    desc: 'Request, inspect, and order cars from Copart and IAAI with secure shipping and customs transit directly to Kumasi. Transparent pricing and local escrow.',
    keywords: 'kumasi car sourcing, auction preorders kumasi, buy car in ashanti region, secure shipping ghana'
  },
  // CANADA
  '/canada/': {
    title: 'Canadian Car Exporter to Africa | Copart & IAAI Bidding | LeeAutoX',
    desc: 'Export clean-title or salvage cars from Toronto, Ontario, and Canada to West Africa. Licensed bidder on top automotive dealer auctions.',
    keywords: 'canada car exporter, export car to nigeria, toronto auto dealer, copart canada exporter'
  },
  '/canada/toronto/': {
    title: 'Toronto Car Sourcing & Export Operations | LeeAutoX',
    desc: 'Located in the Greater Toronto Area, we procure premium passenger vehicles, luxury sports cars, and salvage rebuildables directly from local Ontario auctions.',
    keywords: 'toronto car sourcing, GTA car export, buy car in toronto for nigeria, gta copart lot inspection'
  },
  '/canada/scarborough/': {
    title: 'Car Auctions in Scarborough, Ontario | LeeAutoX Sourcing Hub',
    desc: 'Buy cars at auction in Canada. Sourcing premium vehicles from Copart Ontario and ADESA Toronto directly to your port in Nigeria or Ghana. Get a quote today.',
    keywords: 'car auction Ontario, buy car at auction Canada, Copart Ontario, ADESA Toronto, car auction near Scarborough'
  },
  '/canada/ontario/': {
    title: 'Ontario Automotive Procurement & Shipping Terminal | LeeAutoX',
    desc: 'Managing comprehensive automotive exports from across Ontario. Direct access to Impact Auto Auctions, Copart lots, and high-volume freight shipping lines.',
    keywords: 'ontario car exporter, impact auctions canada, ontario auto shipping, salvage vehicle transport CA'
  },
  // VEHICLES
  '/vehicles/': {
    title: 'Car Catalogue | Direct Pre-Order & Luxury Imports | LeeAutoX',
    desc: 'Browse our catalogue of verified cars, SUVs, and commercial vehicles. Choose from custom auction pre-orders or on-ground Tokunbo cars cleared in Lagos.',
    keywords: 'imported cars for sale, hyundai sonata price, buy clean car nigeria, tokunbo suv listing'
  },
  '/vehicles/luxury-cars/': {
    title: 'Luxury Sports Cars & Sedans for Import | LeeAutoX',
    desc: 'Procure high-performance executive sedans and sports cars from Mercedes-Benz, Lexus, BMW, and Audi. Direct bidding on premium clean title lots with safe shipping.',
    keywords: 'luxury cars lagos, lexus rx for sale, executive sedan nigeria, import sports car canada'
  },
  '/vehicles/suvs/': {
    title: 'Premium SUVs & All-Wheel Drives for Sale | LeeAutoX',
    desc: 'Sourcing sturdy family crossovers and off-road SUVs like Toyota Prado, Lexus RX, Hyundai Santa Fe, and Honda CR-V directly from major Canadian dealer networks.',
    keywords: 'buy luxury suv lagos, cheap toyota prado, family crossover nigeria, hybrid suv copart'
  },
  '/vehicles/commercial-trucks/': {
    title: 'Heavy Duty Commercial Trucks & Vans for Import | LeeAutoX',
    desc: 'Source rugged logistics trucks, flatbeds, cargo vans, and heavy machinery from North American commercial fleet liquidations. Insured shipping and clearing.',
    keywords: 'commercial trucks lagos, buy cargo van nigeria, heavy machinery import, Ford transit delivery'
  },
  '/vehicles/auction-sourced/': {
    title: 'Direct Auction Sourced Vehicles | Copart & IAAI Wins | LeeAutoX',
    desc: 'Win premium cars directly at wholesale prices on US and Canada dealer-only auctions. Complete pre-bid verification and on-site inspection.',
    keywords: 'copart auction winner, wholesale salvage cars, iaai buying portal africa, verify auction win'
  },
  '/vehicles/pre-order/': {
    title: 'Custom Pre-Orders | Sourcing Made to Order | LeeAutoX',
    desc: 'Can\'t find your dream vehicle? Put down a customized pre-order. Specify your trim, mileage, and price ceiling, and we will source it within 7 days.',
    keywords: 'custom car pre-order, made to order car lagos, buy custom toyota venza, bespoke car sourcing'
  },
  // SERVICES
  '/services/': {
    title: 'Import Services | Sourcing, Shipping & Installments | LeeAutoX',
    desc: 'Explore our multi-channel auto import services. We cover vehicle sourcing, premium containerized ocean shipping, customs clearance, and flexible payment options.',
    keywords: 'car import service, secure shipping, installment cars nigeria, global vehicle logistics'
  },
  '/services/vehicle-sourcing/': {
    title: 'Direct Vehicle Sourcing & Auction Bidding | LeeAutoX',
    desc: 'We are licensed auction buyers. We scout, inspect, and purchase premium vehicles directly from Copart, IAAI, and Canada-wide dealer networks at dealer rates.',
    keywords: 'car bidding service, auction access canada, licensed auto broker toronto, find car copart'
  },
  '/services/shipping-containerization/': {
    title: 'Secure Containerization & Marine Freight Shipping | LeeAutoX',
    desc: 'All vehicles are loaded into specialized steel cargo containers. We handle logistics, tracking, documentation, and port transfers to prevent transit scratches.',
    keywords: 'container shipping cars, marine freight lagos, car container strapping, secure auto logistics'
  },
  '/services/installment-plans/': {
    title: 'Flexible Vehicle Installment Plans | Buy Now, Pay Slower | LeeAutoX',
    desc: 'Premium vehicle pre-orders made accessible. Pay a committed auction downpayment, and spread the shipping and customs clearing costs over time. 0% interest.',
    keywords: 'installment plan cars, pre-order financing naira, hire purchase lagos, secure car finance'
  },
  '/services/import-consulting/': {
    title: 'Auto Import Consulting & Port Customs Advising | LeeAutoX',
    desc: 'Ensure legal customs entry into Nigeria and Ghana. Avoid VIN-duty penalties, fake clearing assessment vouchers, and severe port seizures.',
    keywords: 'import consultancy lagos, customs clearance expert apapa, legal vin assessment, port clearing advice'
  },
  // GUIDES
  '/guides/': {
    title: 'Vehicle Importing Guides | Sourcing & Clearance Tutorials | LeeAutoX',
    desc: 'Expert, highly technical guides on bidding, inspecting, shipping, and clearing passenger and commercial vehicles from North America to West Africa.',
    keywords: 'import tutorials, copart bidding course, clearing vehicles handbook, tokunbo car import guides'
  },
  '/guides/import-car-canada-to-nigeria/': {
    title: 'Ultimate Guide to Importing Cars from Canada to Nigeria | LeeAutoX',
    desc: 'The complete step-by-step masterclass on how to buy, strap, containerize, clear, and deliver a vehicle from Canada to Apapa port. Costs, tips, and risks.',
    keywords: 'how to import car from canada to nigeria, shipping cost toronto to lagos, vehicle clearing steps'
  },
  '/guides/tokunbo-buyers-guide/': {
    title: 'Tokunbo Cars Complete Buyers Guide 2026 | LeeAutoX',
    desc: 'Complete 2026 tokunbo buyers guide for Nigeria. Learn how to buy a clean tokunbo car and import safely with LeeAutoX. Check prices now!',
    keywords: 'tokunbo car guide lagos, check car mileage nigeria, flood damage salvage, buy cheap cars berger'
  },
  '/guides/vehicle-clearing-process-nigeria/': {
    title: 'Vehicle Port Clearance Guide at Lagos Apapa Ports | LeeAutoX',
    desc: 'Navigate the complex port release procedure. Learn the 11 checkpoints from shipping line delivery orders, customs valuation, inspection, and gate exit.',
    keywords: 'clearing process apapa lagos, tin can port exit, custom release assessment, port logistics gate'
  },
  '/guides/car-auction-guide-usa-canada/': {
    title: 'Bidding on Copart & IAAI from Africa | Auction Guide | LeeAutoX',
    desc: 'A step-by-step guide to biding on North American auctions without a broker license. Learn how to read bid records, inspect engine codes, and avoid buyer fees.',
    keywords: 'how to bid copart africa, dealer auction bidding broker, buy car copart no license, iaai auction tips'
  },
  '/guides/financing-naira/': {
    title: 'Car Import Installment Financing in Naira | LeeAutoX Guide',
    desc: 'How to finance your auto pre-order using Naira installment accounts. Put down a minimal auction deposit and offset the balance over 45 days interest-free.',
    keywords: 'naira installment plan car, hire purchase lagos naira, zero interest auto finance nigeria'
  },
  '/guides/financing-cedis/': {
    title: 'Pre-Order Car Financing in Ghanaian Cedis | LeeAutoX Guide',
    desc: 'Step-by-step instructions for Ghanaian auto buyers seeking zero-interest pre-order sourcing with Cedi payments to our registered local partner accounts.',
    keywords: 'cedi installment car buy, custom car pre-order ghana finance, tema clearing finance cedis'
  },
  '/guides/vehicle-inspection-checklist/': {
    title: 'Copart Pre-Purchase 150-Point Inspection Checklist | LeeAutoX',
    desc: 'Never buy a bad car! Download or print our diagnostic lot checklist. Cover mechanical checks, frame inspections, visual tests, and engine fluid diagnostics.',
    keywords: 'lot inspection checklist copart, buy salvage car guide, 150 point inspection auto, engine diagnostics copart'
  },
  '/guides/vehicle-verification-nigeria/': {
    title: 'Chassis VIN and Custom Verification Guide Nigeria | LeeAutoX',
    desc: 'Verify if your clearing custom duty was paid legally. Check how to use the Nigeria Customs portal to confirm VIN registration status and avoid police impounds.',
    keywords: 'custom paper verification nigeria, verify VIN custom duty, check customs code portal, lagos police car check'
  },
  // BLOG
  '/blog/': {
    title: 'Auto Logistics & Auction Bid Blog | LeeAutoX Insights',
    desc: 'Stay updated on automotive import trends, ocean container shipping fee updates, and expert auction tips from the LeeAutoX leadership team.',
    keywords: 'car logistics blog, shipping cost news nigeria, copart bid winning secrets, tokunbo car import trends'
  },
  '/blog/how-to-buy-clean-title-salvage-copart/': {
    title: 'How to Buy Clean Title or Repairable Cars on Copart | LeeAutoX',
    desc: 'A comprehensive guide to bidding on and buying clean-title or repairable salvage cars from Copart. Learn pre-bid verification and technical checks.',
    keywords: 'copart clean title, repairable cars copart, salvage auction bidding, auto import guides'
  },
  '/blog/understanding-shipping-costs-canada-to-lagos/': {
    title: 'Ocean Container Freight Costs from Toronto to Lagos | LeeAutoX',
    desc: 'Demystifying marine logistics fees. Learn about shipping container costs, port handling fees, documentation, and customs clearance charges from Canada to Nigeria.',
    keywords: 'shipping costs to lagos, toronto to lagos shipping, container freight fees, auto logistics'
  },
  '/blog/toyota-vs-hyundai-durability-nigerian-roads/': {
    title: 'Toyota vs. Hyundai: Battle of Durability on Nigerian Roads | LeeAutoX',
    desc: 'An expert comparison of Toyota and Hyundai durability, maintenance, fuel efficiency, and resale value on Nigerian terrain. Find your perfect ride.',
    keywords: 'toyota vs hyundai nigeria, car durability, maintenance costs, resale value nigeria'
  }
};

const DIST_DIR = path.resolve('dist');

async function main() {
  console.log('🚀 Executing post-build Static Page and SEO pre-injection compiler...');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Build directory dist/ does not exist! Please run "npm run build" first.');
    process.exit(1);
  }

  // 1. Read base index.html
  const baseHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(baseHtmlPath)) {
    console.error('❌ dist/index.html is missing!');
    process.exit(1);
  }

  const baseHtmlContent = fs.readFileSync(baseHtmlPath, 'utf8');

  // Helper to pre-render headers inside HTML
  function injectMeta(html, route, data) {
    let modified = html;
    
    // Replace default Title
    const titleRegex = /<title>[^<]*<\/title>/i;
    const customTitle = `<title>${data.title}</title>`;
    if (titleRegex.test(modified)) {
      modified = modified.replace(titleRegex, customTitle);
    } else {
      modified = modified.replace('</head>', `${customTitle}\n</head>`);
    }

    // Prepare header injections
    let injections = `
  <meta name="description" content="${data.desc}" />
  <meta name="keywords" content="${data.keywords || 'car sourcing, shipping'}" />
  <link rel="canonical" href="https://leeautox.com${route}" />
`;

    if (data.schema) {
      injections += `  <script id="seo-schema-jsonld" type="application/ld+json">${JSON.stringify(data.schema)}</script>\n`;
    }

    modified = modified.replace('</head>', `${injections}\n</head>`);
    return modified;
  }

  // 2. Duplicate static files for all routes
  for (const [route, data] of Object.entries(ROUTES_SEO)) {
    // Determine target output folder path
    const targetFolder = route === '/' ? DIST_DIR : path.join(DIST_DIR, route);
    const targetHtmlFile = path.join(targetFolder, 'index.html');

    // Create folder if missing
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const modifiedHtml = injectMeta(baseHtmlContent, route, data);
    fs.writeFileSync(targetHtmlFile, modifiedHtml, 'utf8');
    console.log(`  ✅ Generated: ${route}index.html`);
  }

  // 3. Generate sitemap.xml
  console.log('🗺️ Generating sitemap.xml...');
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const route of Object.keys(ROUTES_SEO)) {
    sitemapXml += `  <url>
    <loc>https://leeautox.com${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>\n`;
  }

  sitemapXml += '</urlset>';
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  console.log('  ✅ Generated: sitemap.xml');

  // 4. Generate robots.txt
  console.log('🤖 Generating robots.txt...');
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://leeautox.com/sitemap.xml
`;
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');
  console.log('  ✅ Generated: robots.txt');

  console.log('🎉 Post-build compilation complete! All files generated in dist/');
}

main().catch(err => {
  console.error('❌ Static generator failed:', err);
  process.exit(1);
});
