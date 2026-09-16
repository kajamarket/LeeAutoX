import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ImportDutyCalculator from '../components/ImportDutyCalculator';
import { SEO_DATA } from '../seoData';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, Calendar, User, Clock, ArrowLeft, MessageSquare, ChevronRight } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import WhatsAppCTA from '../components/WhatsAppCTA';
import Contact from '../components/Contact';
import { cleanPathname } from '../utils/path';

const GUIDES_CONTENT: Record<string, {
  title: string;
  author: string;
  readTime: string;
  date: string;
  category: string;
  summary: string;
  paragraphs: string[];
}> = {
  '/guides/import-car-canada-to-nigeria/': {
    title: 'Importing cars from Canada to Nigeria: full guide',
    author: 'LeeAutoX Logistics Desk',
    readTime: '15 min read',
    date: 'August 12, 2026',
    category: 'Logistics Guide',
    summary: 'A definitive 2026 manual covering vehicle selection at Canadian auctions, containerization in Scarborough, RoRo shipping, and navigating port clearing in Apapa or Tin Can.',
    paragraphs: [
      '### Quick answer box\nImporting a car from Canada to Nigeria takes 35 to 50 days from auction win to delivery and costs between $1,850 and $4,200 for ocean freight, plus Nigerian customs duties. The process involves sourcing through licensed dealer auctions, physical lot inspection, Canadian export documentation, containerized or RoRo shipping from Montreal or Halifax, and customs clearance at Lagos ports using the automated VIN valuation system.',
      '### Key takeaways\n- Sourcing directly from Canadian auctions saves 20% to 35% compared to local Nigerian dealership prices.\n- Pre-bidding physical inspections at Ontario auction yards prevent buying vehicles with hidden structural or mechanical defects.\n- Multi-car container consolidation at our Scarborough facility reduces per-vehicle shipping costs and allows spare parts transport.\n- Nigeria customs clearance tariffs are calculated on Cost, Insurance, and Freight (CIF) value under the Common External Tariff.\n- LeeAutoX provides end-to-end management with structured milestone payments from Canadian auction bidding through Lagos delivery.',
      'Importing a car from Canada into Nigeria has become one of the most reliable strategies for securing verified, well-maintained vehicles at wholesale prices. The Canadian used vehicle market offers clear ownership histories through Carfax Canada, honest odometer readings, and stringent provincial safety inspections. However, navigating cross-border auto logistics requires strict adherence to regulatory steps in both Canada and Nigeria.',
      '## The step-by-step import pipeline',
      '### Step 1: Vehicle selection and auction sourcing\nMost high-value imports originate from dealer-only auctions across Ontario, including Copart Canada (Cookstown, Bowmanville), Impact Auto Auctions (Oshawa), and ADESA Toronto. Private individuals cannot bid on these platforms without commercial dealer licenses. LeeAutoX operates as your licensed purchasing broker, granting you direct access to run lists, historical sale prices, and live bidding queues.',
      '### Step 2: On-site physical lot inspection\nOnline photos do not reveal hidden flood lines, frame rail damage, or masked diagnostic trouble codes. Before placing bids, our Ontario technicians physically visit the auction yard to inspect the vehicle. We connect OBD2 diagnostic scanners, inspect engine fluids for cross-contamination, check structural frame points, and confirm that all safety systems remain intact.',
      '### Step 3: Auction bidding and payment settlement\nOnce the inspection report is approved, we establish a maximum bid ceiling based on your target budget. When our bid wins, settlement is processed through transparent escrow or milestone financing. Vehicles are promptly dispatched via flatbed tow truck to avoid auction storage fees.',
      '### Step 4: Consolidation and container loading in Scarborough\nAt our Scarborough logistics facility, vehicles are prepared for ocean transit. Fluids are inspected, batteries safely disconnected, and vehicles loaded into secure 40-foot high-cube containers. Consolidating up to four vehicles per container splits terminal and freight costs, making it significantly more economical than single-car bookings.',
      '### Step 5: Ocean shipping from Canadian ports\nLoaded containers move by rail to marine container terminals in Montreal or Halifax, where they board ocean vessels bound for Lagos. Ocean transit from Eastern Canada to Apapa or Tin Can Island typically takes between 25 and 35 days.',
      '### Step 6: Lagos customs clearance and terminal release\nUpon vessel arrival in Lagos, our accredited customs clearing agents file the Single Goods Declaration (SGD) via the automated VIN valuation portal. Following customs payment verification and terminal handling settlement, your vehicle receives gate release and is handed over at our secure Lagos yard or delivered directly to your doorstep.',
      '## Cost comparison: RoRo vs. 40ft container consolidation',
      'Choosing the appropriate shipping configuration directly affects your landed cost and cargo security:\n- RoRo shipping: Ideal for single drivable vehicles with clean titles. Lower upfront freight cost ($1,850 - $2,950), but no personal goods or spare parts may be packed inside.\n- 40ft High-Cube container consolidation: Multiple vehicles are secured inside a steel shipping container. Per-unit freight cost is competitive ($2,200 - $2,800), with superior security and the ability to pack spare parts.',
      'Read our complete [shipping a car from Canada to Nigeria](/blog/shipping-car-canada-nigeria-complete-guide-2026/) analysis for a detailed breakdown of transit schedules and carrier options.',
      '## Customs duty and clearing costs in Nigeria',
      'Nigeria Customs Service computes import tariffs based on the Cost, Insurance, and Freight (CIF) value of the vehicle, using the electronic VIN valuation benchmark. Statutory duties include a 20% import duty for passenger cars, a 7% port surcharge, a 0.5% ETLS regional levy, and 7.5% VAT.',
      'Older vehicles receive statutory depreciation rebates against base valuation catalogs. To estimate your exact clearance liability, use our live [Nigeria customs car duty calculator](/nigeria/import-duty-calculator/) to compute duties and terminal handling fees before placing bids.',
      '## Frequently asked questions',
      '### Can I import a car older than 15 years into Nigeria?\nNigeria Customs regulations prohibit passenger cars manufactured more than 12 to 15 years prior to the year of importation. Importing vehicles that exceed the age threshold can result in seizure or severe penalty levies. Our staff screens all prospective auction lots to ensure full age compliance.',
      '### How do installment milestone payments work with LeeAutoX?\nOur milestone financing breaks payments into transparent stages: an initial bidding deposit, second payment upon auction win confirmation, third upon container loading at our Scarborough facility, and final settlement upon customs clearance in Lagos.',
      '### What documents will I receive with my imported car?\nYou receive the original Canadian provincial registration ownership slip (stamped for export), the commercial bill of sale, the official ocean Bill of Lading, and the original customs Single Goods Declaration (SGD) confirming that all statutory duties were legally paid.'
    ]
  },
  '/guides/tokunbo-buyers-guide/': {
    title: 'Tokunbo Buyers Guide 2026 for Nigeria',
    author: 'LeeAutoX Nigeria Logistics Desk',
    readTime: '13 min read',
    date: 'June 30, 2026',
    category: 'Market Guide',
    summary: 'The comprehensive Tokunbo vehicle manual for Nigeria: understanding market pricing, identifying tampered odometers, checking flood marks, and avoiding buying stolen or fake-cleared stock.',
    paragraphs: [
      'The Nigerian Tokunbo (used import) vehicle market is vast, vibrant, and filled with both exceptional opportunities and serious traps. While hundreds of car dealerships line Berger, Apapa-Oshodi Expressway, and Victoria Island, buying off a local dealer lot often means paying heavy markups and inheriting hidden defects masked by cosmetic detailing.',
      'A primary danger in buying locally available Tokunbo stock is odometer tampering. Digital and analog odometers are routinely rolled back by unethical middlemen to turn 180,000-mile cars into seemingly low-mileage 60,000-mile bargains. When you procure your car directly from Canada through LeeAutoX, you receive verifiable Carfax history reports confirming genuine mileage from government registry inspection points.',
      'Another critical concern is fake customs papers. Vehicles cleared through illegal unapproved channels or fraudulent Single Goods Declarations (SGD) are subject to seizure by the Federal Operations Unit of the Nigeria Customs Service, even years after purchase. Buying direct ensures your assessment is lodged transparently on the official customs portal.',
      'Inspect before committing: always examine seat rail bolts and seatbelt tags for water line stains indicating flood damage. When sourcing directly from Canadian auctions with LeeAutoX, our Ontario staff physically checks for flood markers before your money is ever committed.'
    ]
  },
  '/guides/copart-bidding-guide/': {
    title: 'Comprehensive Copart Canada Bidding Guide',
    author: 'LeeAutoX Procurement Team',
    readTime: '12 min read',
    date: 'July 25, 2026',
    category: 'Auction Tutorial',
    summary: 'Everything you need to know about navigating Copart Canada auctions: account setup, bidding tiers, understanding run-and-drive symbols, and calculating buyer fees.',
    paragraphs: [
      'Copart Canada represents a premier source of repairable, off-lease, and insurance claim vehicles. However, bidding successfully requires an understanding of auction terminology and fee schedules that can surprise unprepared buyers.',
      'The "Run & Drive" verification badge is frequently misunderstood. It simply means that the auction yard technician was able to start the engine and put the transmission into drive or reverse for a few feet at the time of cataloging. It does not guarantee roadworthiness, transmission health at highway speeds, or cooling system integrity. This is precisely why physical lot inspection is crucial.',
      'Understand the fee schedule: Copart charges tiered buyer fees based on final hammer prices, gate loading fees, and internet bidding fees. Bidding $5,000 on a vehicle often incurs an additional $600 to $900 in auction facility charges. Always compute your total auction settlement price before placing live bids.',
      'With LeeAutoX, you leverage our high-tier commercial broker account. This unlocks lower fee structures, grants access to restricted dealer-only sales, and provides immediate local flatbed dispatch to prevent auction storage accumulation.'
    ]
  },
  '/guides/vehicle-inspection-checklist/': {
    title: 'Vehicle Technical Lot Inspection Checklist',
    author: 'LeeAutoX Inspection Crew',
    readTime: '8 min read',
    date: 'August 01, 2026',
    category: 'Inspection Protocols',
    summary: 'The exact 150-point technical checklist our inspectors utilize when evaluating potential auction purchases on Canadian yards before placing bids.',
    paragraphs: [
      'Visual photos uploaded to auction websites cannot substitute for physical inspection. Our trained technicians visit Copart and ADESA yards with specialized diagnostic tools to execute a thorough 150-point inspection protocol.',
      'Under the hood: We inspect oil filler caps for milky residue (indicating blown head gaskets), check coolant reservoirs for oil contamination, examine serpentine belts for severe cracking, and verify that the engine turns over smoothly without rod knock or timing chain rattle.',
      'Structural and frame: Collision repair facilities often mask frame damage with aftermarket body panels. We inspect the vehicle undercarriage for frame rail bends, pinch weld distortion, and telltale signs of unibody pulling machine clamps.',
      'Diagnostic scanning: Every lot is evaluated with an OBD2 scanner. We check for cleared trouble codes, verify emissions readiness monitors, and inspect airbag sensor status to confirm that deployed safety modules have not simply had their dashboard warning lights disconnected.'
    ]
  },
  '/guides/ghana-customs-duty-guide/': {
    title: 'Ghana Vehicle Customs Duty & Tema Port Clearance Manual',
    author: 'LeeAutoX Ghana Desk',
    readTime: '14 min read',
    date: 'July 18, 2026',
    category: 'Customs Clearance',
    summary: 'A step-by-step breakdown of clearing cars through Tema Port: ICUMS valuation, HS codes, age penalties, VAT, and handling fees for Ghanaian vehicle importers.',
    paragraphs: [
      'Importing motor vehicles into Ghana through Tema Port requires compliance with the Integrated Customs Management System (ICUMS). Understanding how customs assesses Home Delivery Value (HDV) and applies depreciation schedules saves importers thousands of Ghana Cedis.',
      'Vehicle age penalties represent a major consideration in Ghana. Under Ghanaian customs law, vehicles older than 10 years are subject to an graduated over-age penalty calculated on the CIF value. Selecting models between 5 and 9 years old generally provides the optimal balance of purchase price and customs duty exposure.',
      'The ICUMS valuation calculates: Import Duty (ranging from 5% to 20% depending on engine capacity and vehicle classification), Import VAT (15%), National Health Insurance Levy (NHIL), GETFund levy, and ECOWAS levy.',
      'LeeAutoX operates with accredited clearing partners at Tema Port. We generate accurate ICUMS pre-assessment declarations before your container touches the berth, eliminating unnecessary terminal storage and shipping line demurrage.'
    ]
  }
};

export default function GuidesPage() {
  const { theme } = useTheme();
  const { pathname } = useLocation();

  let cleanPath = cleanPathname(pathname);
  if (!cleanPath.endsWith('/')) {
    cleanPath += '/';
  }

  const isGuideArticle = cleanPath !== '/guides/';
  const guide = GUIDES_CONTENT[cleanPath];

  if (isGuideArticle && !guide) {
    return (
      <div className="min-h-screen bg-background py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-black uppercase mb-4">Guide Under Compilation</h1>
          <p className="text-zinc-500 mb-8">
            This technical import manual is being updated with the latest port clearance guidelines.
          </p>
          <Link
            to="/guides/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B59FF] text-white font-bold uppercase text-xs tracking-wider"
          >
            <ArrowLeft size={16} /> Return to Guides Directory
          </Link>
        </div>
      </div>
    );
  }

  const seoData = SEO_DATA[cleanPath] || SEO_DATA['/guides/'];

  const renderParagraphText = (text: string) => {
    const parseBold = (subStr: string, keyPrefix: string): React.ReactNode[] => {
      const subParts: React.ReactNode[] = [];
      let subLastIndex = 0;
      let subMatch;
      const subBoldRegex = /\*\*([^*]+)\*\*/g;
      
      while ((subMatch = subBoldRegex.exec(subStr)) !== null) {
        const subMatchIndex = subMatch.index;
        if (subMatchIndex > subLastIndex) {
          subParts.push(subStr.substring(subLastIndex, subMatchIndex));
        }
        subParts.push(
          <strong key={`${keyPrefix}-b-${subMatchIndex}`} className="font-bold text-foreground">
            {subMatch[1]}
          </strong>
        );
        subLastIndex = subBoldRegex.lastIndex;
      }
      if (subLastIndex < subStr.length) {
        subParts.push(subStr.substring(subLastIndex));
      }
      return subParts;
    };

    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        elements.push(...parseBold(text.substring(lastIndex, matchIndex), `txt-${lastIndex}`));
      }
      elements.push(
        <Link 
          key={`link-${matchIndex}`} 
          to={match[2]} 
          className="text-[#2B59FF] font-semibold underline hover:text-[#1a41cc] transition-colors"
        >
          {match[1]}
        </Link>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      elements.push(...parseBold(text.substring(lastIndex), `txt-${lastIndex}`));
    }

    return elements;
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={isGuideArticle ? guide.title : (seoData.heading || 'Car Import & Customs Guides')}
        subtitle={isGuideArticle ? guide.summary : (seoData.description || 'Step-by-step manuals for auction sourcing, maritime logistics, and customs clearance.')}
        breadcrumbs={seoData.breadcrumbs}
      />

      {isGuideArticle ? (
        <article className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-border text-xs text-zinc-500 font-mono mb-10">
            <div className="flex items-center gap-2">
              <User size={14} className="text-[#2B59FF]" />
              <span className="text-foreground font-semibold">{guide.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#2B59FF]" />
              <span>{guide.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#2B59FF]" />
              <span>{guide.readTime}</span>
            </div>
            <span className="px-2.5 py-0.5 bg-[#2B59FF]/10 text-[#2B59FF] font-bold uppercase rounded text-[10px]">
              {guide.category}
            </span>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-sm md:text-base leading-relaxed font-sans">
            {guide.paragraphs.map((p, idx) => {
              if (p.startsWith('### Quick answer box')) {
                const body = p.replace('### Quick answer box\n', '').trim();
                return (
                  <div key={idx} className={`p-6 border-l-4 border-[#2B59FF] my-6 rounded-r ${theme === 'dark' ? 'bg-zinc-900/90 text-zinc-200' : 'bg-blue-50/70 text-slate-800'}`}>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#2B59FF] block mb-2">QUICK ANSWER</span>
                    <p className="text-sm md:text-base leading-relaxed">{renderParagraphText(body)}</p>
                  </div>
                );
              }

              if (p.startsWith('### Key takeaways')) {
                const lines = p.replace('### Key takeaways\n', '').split('\n');
                return (
                  <aside key={idx} aria-label="summary" className={`p-6 border my-6 rounded ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#2B59FF] block mb-3">KEY TAKEAWAYS</span>
                    <ul className="space-y-2 text-xs md:text-sm">
                      {lines.map((line, lIdx) => {
                        const cleanLine = line.replace(/^[-\*\•]\s*/, '');
                        return (
                          <li key={lIdx} className="flex items-start gap-2">
                            <span className="text-[#2B59FF] font-bold">•</span>
                            <span>{renderParagraphText(cleanLine)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </aside>
                );
              }

              if (p.startsWith('## ')) {
                return (
                  <h2 key={idx} className={`text-2xl font-extrabold uppercase mt-12 mb-4 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {p.replace('## ', '')}
                  </h2>
                );
              }

              if (p.startsWith('### ')) {
                return (
                  <h3 key={idx} className={`text-xl font-bold uppercase mt-8 mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {p.replace('### ', '')}
                  </h3>
                );
              }

              if (p.includes('\n- ')) {
                const parts = p.split('\n');
                const intro = parts[0];
                const listItems = parts.slice(1);
                return (
                  <div key={idx} className="my-4">
                    {intro && <p className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>{renderParagraphText(intro)}</p>}
                    <ul className={`list-disc list-inside pl-4 space-y-2 my-2 ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
                      {listItems.map((li, lIdx) => (
                        <li key={lIdx} className="leading-relaxed">
                          {renderParagraphText(li.replace(/^[-\*\•]\s*/, ''))}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              return (
                <p key={idx} className={`text-base leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}`}>
                  {renderParagraphText(p)}
                </p>
              );
            })}
          </div>

          <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
            <Link
              to="/guides/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2B59FF] hover:underline"
            >
              <ArrowLeft size={14} /> Back to All Guides
            </Link>
          </div>
        </article>
      ) : (
        <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(GUIDES_CONTENT).map(([path, g]) => (
              <Link
                key={path}
                to={path}
                className={`group flex flex-col justify-between p-8 border transition-all duration-300 hover:border-[#2B59FF] ${
                  theme === 'dark' ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4 text-xs text-zinc-500 font-mono">
                    <span className="text-[#2B59FF] font-bold uppercase">{g.category}</span>
                    <span>{g.readTime}</span>
                  </div>
                  <h2 className="text-lg font-bold uppercase tracking-tight text-foreground group-hover:text-[#2B59FF] transition-colors mb-3 leading-snug">
                    {g.title}
                  </h2>
                  <p className={`text-xs leading-relaxed line-clamp-3 mb-6 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {g.summary}
                  </p>
                </div>
                <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2B59FF]">
                  <span>Explore Guide</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <WhatsAppCTA 
          message="Hello LeeAutoX, I would like to inquire about sourcing and importing a car based on your logistics guides."
          title="Ready to Import from Canada with Confidence?"
          subtitle="Get an itemized quote covering auction purchase, physical inspection, ocean freight, and customs clearance."
        />
      </section>

      <Contact />
    </div>
  );
}
