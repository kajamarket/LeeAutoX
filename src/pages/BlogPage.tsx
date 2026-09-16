import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { SEO_DATA } from '../seoData';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, Calendar, User, Clock, ArrowLeft, MessageSquare, ChevronRight } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import WhatsAppCTA from '../components/WhatsAppCTA';
import Contact from '../components/Contact';
import { cleanPathname } from '../utils/path';

const BLOG_CONTENT: Record<string, {
  title: string;
  author: string;
  readTime: string;
  date: string;
  category: string;
  summary: string;
  paragraphs: string[];
}> = {
  '/blog/how-to-buy-clean-title-salvage-copart/': {
    title: 'How to Bid & Buy Clean Title or Repairable Cars on Copart',
    author: 'LeeAutoX Procurement Team',
    readTime: '10 min read',
    date: 'June 22, 2026',
    category: 'Auctions',
    summary: 'Master the technicalities of Copart Canada: understanding run-and-drive verification, calculating repair margins, and avoiding uninspected auction pitfalls.',
    paragraphs: [
      'Bidding on North American dealer car auctions like Copart Canada is one of the most effective ways for private buyers and commercial fleet managers to acquire quality automobiles at 25% to 40% below typical Nigerian or Ghanaian market retail values. However, purchasing without physical on-site verification introduces considerable financial risk.',
      'Understanding Copart title classifications is the critical first step. Clean Title (or Ontario Non-Branded) indicates that the vehicle has never been reported as a total loss by an insurer. While these carry higher auction bid ceilings, they require minimal prep before export. Salvage Title vehicles, conversely, were settled by insurance underwriters following accidents, theft recovery, or minor hail. When selected intelligently, salvage vehicles offer unmatched profit margins.',
      'Always inspect the secondary damage category. Often, auction listings describe primary damage as front-end while obscuring damaged undercarriage suspension parts or cracked steering racks. Our licensed team conducts physical on-site lot checks at Copart Cookstown and Bowmanville prior to placing bids, running live OBD2 diagnostic scans and frame alignment assessments.',
      'When calculating your maximum bid ceiling, ensure you include auction buyer fees, domestic flatbed towing from the yard to our Scarborough loading depot, ocean freight, and destination port clearance duties. Never bid with your heart; establish a firm cost matrix and stick to it.'
    ]
  },
  '/blog/shipping-car-canada-nigeria-complete-guide-2026/': {
    title: 'Shipping a car from Canada to Nigeria: 2026 guide',
    author: 'LeeAutoX Logistics Desk',
    readTime: '12 min read',
    date: 'July 14, 2026',
    category: 'Logistics',
    summary: 'A complete operational guide on RoRo versus container freight, port clearances at Apapa and Tin Can Island, current tariff bands, and expected transit schedules from Canadian ports.',
    paragraphs: [
      '### Quick answer box\nShipping a car from Canada to Nigeria costs between $1,850 and $4,200 depending on the vehicle size and chosen shipping method (RoRo vs. consolidated 40-foot container). Ocean transit from Montreal or Halifax ports to Lagos (Apapa or Tin Can Island) averages 25 to 35 days. Customs clearance requires standard import tariffs calculated via the Nigeria Customs VIN valuation system.',
      '### Key takeaways\n- Container shipping offers superior cargo security and allows loading spare parts, while RoRo is the most economical single-vehicle option.\n- Ocean freight transit takes 25 to 35 days from Montreal or Halifax to Apapa or Tin Can Island.\n- Nigeria customs clearance utilizes the automated VIN valuation system under the Common External Tariff (CET).\n- Pre-arrival document preparation prevents terminal storage and shipping line demurrage fees.\n- LeeAutoX provides milestone-based financing and end-to-end logistics from Canadian auction lots to Lagos.',
      'Importing a vehicle from Canada to Nigeria requires a clear understanding of international ocean freight logistics, Canadian export regulations, and Nigerian port clearance processes. Whether you are importing an SUV for personal use in Lagos or managing inventory for an auto dealership, choosing the right shipping method and preparing documentation in advance prevents costly delays and port demurrage.',
      'Canadian vehicle exports depart primarily from the Port of Montreal in Quebec or the Port of Halifax in Nova Scotia. Vehicles sourced from Ontario auction lots in Toronto or Scarborough are moved via bonded auto-haulers to these coastal container terminals for ocean loading.',
      '## RoRo vs. container shipping comparison\nTwo primary ocean freight methods are available for shipping motor vehicles from Canada to West African ports:',
      '### Roll-on/roll-off (RoRo) shipping\nRoRo vessels operate like floating parking garages. Vehicles are driven directly onto specialized cargo decks and lashed down. RoRo is typically the most economical option for single, drivable vehicles with clean titles. However, loose personal effects or spare parts cannot be stored inside the vehicle during transit.',
      '### Consolidated container shipping\nIn containerized shipping, vehicles are safely loaded and braced inside standard 20-foot or 40-foot ocean containers. A 40-foot high-cube container accommodates three to four sedans or compact SUVs using reinforced wooden ramps and industrial wheel straps. Container shipping provides protection from salt air, eliminates port pilferage risks, and allows spare parts or tires to accompany the shipment.',
      '## Freight cost breakdown and transit times\nOcean freight rates vary based on fuel surcharges, vessel availability, and seasonal demand. Transit from Montreal or Halifax to Apapa Port or Tin Can Island typically takes between 25 and 35 days on the water.',
      'Typical freight estimates (in USD):\n- Compact sedan (RoRo): $1,850 - $2,250\n- Mid-size SUV (RoRo): $2,100 - $2,600\n- Full-size SUV / Truck (RoRo): $2,400 - $2,950\n- Shared 40ft container spot (per vehicle): $2,200 - $2,800\n- Exclusive 20ft container (single vehicle): $3,400 - $4,200',
      '## Nigeria customs clearance and port processes\nVehicles arriving at Apapa, Tin Can Island, or PTML terminals undergo mandatory customs valuation under the Nigeria Customs Service Common External Tariff (CET) schedule. Customs duty is calculated based on the Cost, Insurance, and Freight (CIF) value established through the national VIN valuation database.',
      'Standard statutory charges include:\n- Import duty: 20% of CIF value (for passenger vehicles)\n- Port surcharge: 7% on the import duty amount\n- ECOWAS Trade Liberalization Scheme (ETLS): 0.5% on CIF value\n- Value Added Tax (VAT): 7.5% across cumulative CIF and duty charges',
      'Additionally, terminal handling fees (Terminal Delivery Order) and shipping agency local handling charges must be cleared before the gate release is authorized. Working with our accredited clearing desk ensures your Single Goods Declaration (SGD) is lodged prior to vessel discharge to avoid terminal demurrage penalties.',
      '## Required documentation for vehicle export\nTo maintain complete compliance across Canadian and Nigerian maritime authorities, the following documents are generated and transferred:\n- Original vehicle registration / provincial title slip (stamped for export)\n- Bill of Lading (Master B/L or House B/L)\n- Commercial invoice indicating purchase price and VIN\n- Canada Export Declaration (B13A / CERS electronic filing)\n- Packing list (for containerized cargo with spare parts)',
      '## Frequently asked questions',
      '### How long does it take for a car to arrive in Lagos from Canada?\nOcean transit from Montreal or Halifax to Lagos takes 25 to 35 days. Inland towing and container consolidation in Scarborough adds 5 to 7 days, while customs clearance at Apapa or Tin Can Island takes 5 to 8 business days once the vessel discharges.',
      '### Can I pack goods or spare parts inside my car?\nPersonal goods and spare parts are strictly prohibited on RoRo vessels. If you wish to ship spare auto parts, tires, or personal cargo, you must choose consolidated or dedicated container shipping.',
      '### How does LeeAutoX manage the shipping process?\nLeeAutoX manages the entire lifecycle: auction lot pickup in Canada, mechanical verification, container loading at our Scarborough depot, marine documentation, ocean freight, and customs clearance at Lagos ports.'
    ]
  },
  '/blog/how-to-import-car-for-dealers-nigeria/': {
    title: 'How Nigerian Car Dealers Can Import Vehicles from Canada',
    author: 'LeeAutoX Commercial Desk',
    readTime: '11 min read',
    date: 'August 03, 2026',
    category: 'Commercial',
    summary: 'A blueprint for Nigerian commercial car dealers and fleet operators looking to source multi-car inventory from Canadian dealer wholesale auctions.',
    paragraphs: [
      'The traditional Tokunbo car importation model in Nigeria, relying on middlemen or random brokers on the ground in the US and Europe, is fraught with financial leakage. For established auto dealers in Lagos, Abuja, and Port Harcourt, transitioning to a direct Canadian dealer auction sourcing pipeline unlocks significant commercial advantages.',
      'First, the foreign exchange dynamic: vehicles sourced in Canadian Dollars (CAD) often present a 10% to 15% currency arbitrage advantage over US Dollar purchases, even after adjusting for ocean freight. Additionally, Canadian highway vehicles generally exhibit higher scheduled maintenance adherence due to strict provincial safety inspection laws.',
      'Second, multi-car container loading dramatically reduces shipping overhead. By consolidating four sedans or compact crossovers into a single 40ft high-cube container at our Scarborough depot, dealers save up to $600 per unit compared to individual RORO bookings. Furthermore, containers can be packed with high-turnover fast-moving service parts (brake pads, oil filters, suspension arms) at zero additional freight charge.',
      'LeeAutoX acts as your dedicated buying office in Ontario. We provide live auction access, physical lot walk-arounds with real-time video, and handle the entire logistics trail straight through customs release at Apapa or PTML ports.'
    ]
  }
};

export default function BlogPage() {
  const { theme } = useTheme();
  const { pathname } = useLocation();

  let cleanPath = cleanPathname(pathname);
  if (!cleanPath.endsWith('/')) {
    cleanPath += '/';
  }

  const isArticle = cleanPath !== '/blog/';
  const article = BLOG_CONTENT[cleanPath];

  if (isArticle && !article) {
    return (
      <div className="min-h-screen bg-background py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-black uppercase mb-4">Article Under Review</h1>
          <p className="text-zinc-500 mb-8">
            This briefing is currently undergoing final editorial verification by our logistics engineering team.
          </p>
          <Link
            to="/blog/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B59FF] text-white font-bold uppercase text-xs tracking-wider"
          >
            <ArrowLeft size={16} /> Return to Blog Archive
          </Link>
        </div>
      </div>
    );
  }

  const seoData = SEO_DATA[cleanPath] || SEO_DATA['/blog/'];

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
        title={isArticle ? article.title : (seoData.heading || 'Auto Import & Logistics Blog')}
        subtitle={isArticle ? article.summary : (seoData.description || 'Verified industry guides, import tutorials, and cost analyses.')}
        breadcrumbs={seoData.breadcrumbs}
      />

      {isArticle ? (
        <article className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-border text-xs text-zinc-500 font-mono mb-10">
            <div className="flex items-center gap-2">
              <User size={14} className="text-[#2B59FF]" />
              <span className="text-foreground font-semibold">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#2B59FF]" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#2B59FF]" />
              <span>{article.readTime}</span>
            </div>
            <span className="px-2.5 py-0.5 bg-[#2B59FF]/10 text-[#2B59FF] font-bold uppercase rounded text-[10px]">
              {article.category}
            </span>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-sm md:text-base leading-relaxed font-sans">
            {article.paragraphs.map((p, idx) => {
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
              to="/blog/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2B59FF] hover:underline"
            >
              <ArrowLeft size={14} /> Back to All Articles
            </Link>
          </div>
        </article>
      ) : (
        <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(BLOG_CONTENT).map(([path, post]) => (
              <Link
                key={path}
                to={path}
                className={`group flex flex-col justify-between p-8 border transition-all duration-300 hover:border-[#2B59FF] ${
                  theme === 'dark' ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4 text-xs text-zinc-500 font-mono">
                    <span className="text-[#2B59FF] font-bold uppercase">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-lg font-bold uppercase tracking-tight text-foreground group-hover:text-[#2B59FF] transition-colors mb-3 leading-snug">
                    {post.title}
                  </h2>
                  <p className={`text-xs leading-relaxed line-clamp-3 mb-6 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {post.summary}
                  </p>
                </div>
                <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2B59FF]">
                  <span>Read Briefing</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <WhatsAppCTA 
          message="Hello LeeAutoX, I just finished reading your auto import blog and would like to discuss logistics options for my vehicle."
          title="Turn Industry Insights into a Verified Delivery"
          subtitle="Do not navigate auction bids or cross-border maritime shipping blindly. Our verified teams in Canada and Nigeria handle every step."
        />
      </section>

      <Contact />
    </div>
  );
}
