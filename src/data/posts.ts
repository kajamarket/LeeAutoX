import generatedPostsData from '../generated/posts.json';

export interface PostItem {
  slug: string;
  title: string;
  excerpt: string;
  contentHtml?: string;
  paragraphs?: string[];
  date: string;
  modified?: string;
  author: string;
  featuredImage: {
    url: string;
    alt: string;
  };
  categories: Array<{ name: string; slug: string }>;
  tags: string[];
  readingTime: string;
  isLocal?: boolean;
}

const LOCAL_POSTS: PostItem[] = [
  {
    slug: 'how-to-buy-clean-title-salvage-copart',
    title: 'How to Bid & Buy Clean Title or Repairable Cars on Copart',
    excerpt: 'Master the technicalities of Copart Canada: understanding run-and-drive verification, calculating repair margins, and avoiding uninspected auction pitfalls.',
    paragraphs: [
      'Bidding on North American dealer car auctions like Copart Canada is one of the most effective ways for private buyers and commercial fleet managers to acquire quality automobiles at 25% to 40% below typical Nigerian or Ghanaian market retail values. However, purchasing without physical on-site verification introduces considerable financial risk.',
      'Understanding Copart title classifications is the critical first step. Clean Title (or Ontario Non-Branded) indicates that the vehicle has never been reported as a total loss by an insurer. While these carry higher auction bid ceilings, they require minimal prep before export. Salvage Title vehicles, conversely, were settled by insurance underwriters following accidents, theft recovery, or minor hail. When selected intelligently, salvage vehicles offer unmatched profit margins.',
      'Always inspect the secondary damage category. Often, auction listings describe primary damage as front-end while obscuring damaged undercarriage suspension parts or cracked steering racks. Our licensed team conducts physical on-site lot checks at Copart Cookstown and Bowmanville prior to placing bids, running live OBD2 diagnostic scans and frame alignment assessments.',
      'When calculating your maximum bid ceiling, ensure you include auction buyer fees, domestic flatbed towing from the yard to our Scarborough loading depot, ocean freight, and destination port clearance duties. Never bid with your heart; establish a firm cost matrix and stick to it.'
    ],
    date: '2026-06-22T08:00:00Z',
    author: 'LeeAutoX Procurement Team',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200',
      alt: 'Copart auto auction yard in Canada'
    },
    categories: [{ name: 'Auctions', slug: 'auctions' }],
    tags: ['Copart', 'Salvage', 'Bidding', 'Canada Auctions'],
    readingTime: '10 min read',
    isLocal: true
  },
  {
    slug: 'shipping-car-canada-nigeria-complete-guide-2026',
    title: 'Shipping a car from Canada to Nigeria: 2026 guide',
    excerpt: 'A complete operational guide on RoRo versus container freight, port clearances at Apapa and Tin Can Island, current tariff bands, and expected transit schedules from Canadian ports.',
    paragraphs: [
      '### Quick answer box\nShipping a car from Canada to Nigeria costs between $1,850 and $4,200 depending on the vehicle size and chosen shipping method (RoRo vs. consolidated 40-foot container). Ocean transit from Montreal or Halifax ports to Lagos (Apapa or Tin Can Island) averages 25 to 35 days. Customs clearance requires standard import tariffs calculated via the Nigeria Customs VIN valuation system.',
      '### Key takeaways\n- Container shipping offers superior cargo security and allows loading spare parts, while RoRo is the most economical single-vehicle option.\n- Ocean freight transit takes 25 to 35 days from Montreal or Halifax to Apapa or Tin Can Island.\n- Nigeria customs clearance utilizes the automated VIN valuation system under the Common External Tariff (CET).\n- Pre-arrival document preparation prevents terminal storage and shipping line demurrage fees.\n- LeeAutoX provides milestone-based financing and end-to-end logistics from Canadian auction lots to Lagos.',
      'Importing a vehicle from Canada to Nigeria requires a clear understanding of international ocean freight logistics, Canadian export regulations, and Nigerian port clearance processes. Whether you are importing an SUV for personal use in Lagos or managing inventory for an auto dealership, choosing the right shipping method and preparing documentation in advance prevents costly delays and port demurrage.',
      'Canadian vehicle exports depart primarily from the Port of Montreal in Quebec or the Port of Halifax in Nova Scotia. Vehicles sourced from Ontario auction lots in Toronto or Scarborough are moved via bonded auto-haulers to these coastal container terminals for ocean loading.'
    ],
    date: '2026-07-14T09:30:00Z',
    author: 'LeeAutoX Logistics Desk',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200',
      alt: 'Container shipping port handling'
    },
    categories: [{ name: 'Logistics', slug: 'logistics' }],
    tags: ['Shipping', 'Container', 'RoRo', 'Nigeria Ports'],
    readingTime: '12 min read',
    isLocal: true
  },
  {
    slug: 'how-to-import-car-for-dealers-nigeria',
    title: 'How Nigerian Car Dealers Can Import Vehicles from Canada',
    excerpt: 'Wholesale vehicle sourcing guide for Nigerian car dealers and fleet operators. Volume bidding, light prep at Lee Auto, multi-car container loading, and dealer financing.',
    paragraphs: [
      'Commercial car dealerships in Lagos, Abuja, and Port Harcourt require reliable, consistent supply chains to remain competitive. Sourcing directly from Canadian wholesale auctions through LeeAutoX eliminates middleman markups and guarantees verified title documentation.',
      'Our dealer program supports multi-vehicle containerization in our Scarborough, Ontario warehouse. Dealers can load up to 4 vehicles in a single 40-foot high-cube container, drastically reducing per-unit shipping expenses.',
      'Before container loading, our technicians perform comprehensive mechanical checks, fluid flushes, and minor body touch-ups at our Lee Auto prep facility. This ensures vehicles arrive in West Africa ready for immediate showroom display or retail turnover.'
    ],
    date: '2026-08-01T10:15:00Z',
    author: 'LeeAutoX Dealer Services',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200',
      alt: 'Car dealership lot'
    },
    categories: [{ name: 'Dealership', slug: 'dealership' }],
    tags: ['Dealers', 'Wholesale', 'Fleet', 'Imports'],
    readingTime: '8 min read',
    isLocal: true
  },
  {
    slug: 'copart-bidding-guide',
    title: 'Copart Canada Bidding Strategy & Gate Fee Breakdown',
    excerpt: 'Detailed breakdown of Copart member tiers, preliminary bidding tactics, live auction execution, and avoiding auction yard gate fees.',
    paragraphs: [
      'Mastering Copart bidding requires understanding member fee matrices, virtual bidding countdowns, and reserve auction psychology. Sourcing through registered broker channels reduces buyer premiums.',
      'Always calculate total landed cost prior to the auction starting horn. Unbudgeted late pickup fees, storage levies, and title transfer charges can quickly erode margins if logistics are not pre-staged.'
    ],
    date: '2026-05-18T11:00:00Z',
    author: 'LeeAutoX Auction Specialists',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200',
      alt: 'Automotive bidding floor'
    },
    categories: [{ name: 'Auctions', slug: 'auctions' }],
    tags: ['Copart', 'Bidding', 'Canada', 'Gate Fees'],
    readingTime: '9 min read',
    isLocal: true
  },
  {
    slug: 'vehicle-inspection-checklist',
    title: '150-Point Pre-Purchase Auction Inspection Checklist',
    excerpt: 'The rigorous technical checklist our Canadian inspectors run before placing bids: OBD2 scanner protocols, salt corrosion checks, and title branding.',
    paragraphs: [
      'Physical pre-purchase inspection separates profitable imports from financial disasters. Digital auction photos routinely conceal bent control arms, oil pan leaks, and flood waterline stains.',
      'Our Ontario technicians inspect structural frame rails, test transmission fluid smell and clarity, verify VIN match across all vehicle stampings, and perform active OBD2 computer diagnostic scans.'
    ],
    date: '2026-04-30T14:20:00Z',
    author: 'LeeAutoX Technical Inspection Team',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=1200',
      alt: 'Vehicle technical inspection'
    },
    categories: [{ name: 'Inspection', slug: 'inspection' }],
    tags: ['Inspection', 'OBD2', 'Diagnostics', 'Checklist'],
    readingTime: '11 min read',
    isLocal: true
  },
  {
    slug: 'tokunbo-buyers-guide',
    title: "Tokunbo Buyer's Guide: Sourcing Directly from North America",
    excerpt: 'Why direct procurement from Canada and the US beats local dealership markups in Nigeria, with verified mileage and clean accident histories.',
    paragraphs: [
      'Buying a Tokunbo vehicle directly through North American auctions guarantees transparent mileage verification and documented title history. In contrast, locally purchased inventory often carries rolled-back odometers.',
      'Through containerized consolidated shipping, Nigerian buyers can import direct at wholesale auction rates while benefiting from secure milestone installment financing.'
    ],
    date: '2026-04-12T09:00:00Z',
    author: 'LeeAutoX Procurement Desk',
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      alt: 'Highway vehicle transport'
    },
    categories: [{ name: 'Procurement', slug: 'procurement' }],
    tags: ['Tokunbo', 'Direct Import', 'Lagos', 'Nigeria'],
    readingTime: '7 min read',
    isLocal: true
  }
];

export function getAllPosts(): PostItem[] {
  const wpPosts: PostItem[] = Array.isArray(generatedPostsData) ? (generatedPostsData as any[]).map(p => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    contentHtml: p.contentHtml,
    date: p.date,
    modified: p.modified,
    author: p.author,
    featuredImage: p.featuredImage,
    categories: p.categories || [{ name: 'Logistics', slug: 'logistics' }],
    tags: p.tags || [],
    readingTime: p.readingTime || '5 min read',
    isLocal: false
  })) : [];

  const localSlugs = new Set(LOCAL_POSTS.map(p => p.slug));
  const mergedMap = new Map<string, PostItem>();

  // Local posts first (local wins on collision)
  for (const lp of LOCAL_POSTS) {
    mergedMap.set(lp.slug, lp);
  }

  // Add WP posts if slug not already present
  for (const wp of wpPosts) {
    if (mergedMap.has(wp.slug)) {
      console.warn(`⚠️ Slug collision skipped for WordPress post: "${wp.slug}" (Local post wins).`);
    } else {
      mergedMap.set(wp.slug, wp);
    }
  }

  const combined = Array.from(mergedMap.values());
  // Sort newest first by date
  combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return combined;
}

export function getPostBySlug(slug: string): PostItem | undefined {
  const posts = getAllPosts();
  return posts.find(p => p.slug === slug);
}
