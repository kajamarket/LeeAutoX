import { useLocation, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { SEO_DATA } from '../seoData';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, Calendar, User, Clock, ArrowLeft, MessageSquare, ChevronRight } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

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
    summary: 'A step-by-step masterclass on how to bid, win, and secure clean-title or salvage rebuilds from Copart without broker overheads.',
    paragraphs: [
      'Bidding on global auto auctions can feel overwhelming, but with the right guidelines, you can buy high-quality cars at wholesale pricing. This technical post covers the complete checklist for winning clean-title and salvage rebuilds from Copart.',
      'Understanding Copart Inventory. Copart registers vehicles under different title brands: Clean Title, Salvage Rebuild, and Parts Only. Clean titles are ready for direct registration. Salvage rebuilds have had minor or major cosmetic damage, meaning they must undergo certified reconstruction inspections before being certified for public roads.',
      'Executing Pre-Bid Audits. Never bid on visual parameters alone. Obtain a complete historical verification via Carfax or Autocheck. Verify the chassis frame status, actual odometer records, airbag deployments, and current title brand histories. This eliminates severe hidden frame cracks and transmission failure risks.',
      'Bidding and Hammer Price Math. Set a strict bidding ceiling. Remember that online bidding comes with Copart Buyer Fees, loading terminal fees, and gate clearance tariffs. These surcharges can add 10% to 15% on top of your bid hammer price, which should be budgeted in advance.'
    ]
  },
  '/blog/understanding-shipping-costs-canada-to-lagos/': {
    title: 'Understanding Ocean Container Freight Costs from Toronto to Lagos',
    author: 'LeeAutoX Logistics Desk',
    readTime: '8 min read',
    date: 'June 15, 2026',
    category: 'Shipping',
    summary: 'An honest, transparent look at ocean container shipping rates, terminal port charges, and custom duty fees to prevent hidden fee shock.',
    paragraphs: [
      'The biggest stress of vehicle importing is opaque transit costs. We believe in 100% transparency. This post demystifies ocean container cargo costs from Toronto directly to Lagos ports.',
      'The Components of Marine Freight. Freight is not a single flat line. It is divided into: 1. Inland Towing (hauling the vehicle from the Copart yard to our Scarborough loading lot). 2. Containerization (securing the cars using heavy straps inside steel cargo units). 3. Shipping Ocean Line Cargo fees (ocean freight tariff across the Atlantic).',
      'Port Handlings and Clearing. Upon docking in Lagos, Apapa, or Tin Can port, shipping line agents charge Terminal Handling Fees, customs inspection releases, and port terminal rents. These are standard and must be compiled into your total landing cost estimates.'
    ]
  },
  '/blog/toyota-vs-hyundai-durability-nigerian-roads/': {
    title: 'Toyota vs. Hyundai: Battle of Durability on Nigerian Roads',
    author: 'LeeAutoX Technical Review Desk',
    readTime: '9 min read',
    date: 'May 10, 2026',
    category: 'Reviews',
    summary: 'Which brand reigns supreme on Nigerian highways? An objective look at suspension resilience, fuel efficiency, spare part availability, and resale value.',
    paragraphs: [
      'Selecting the right car model is crucial for Nigerian road durability. In this review, we compare the two giants of Nigerian passenger traffic: Toyota and Hyundai.',
      'Suspension and Ground Clearance: Toyota models (like Corolla, Camry, and Prado) feature robust suspension architectures engineered to absorb rugged off-road impacts. Hyundai (like Sonata and Elantra) offers advanced cabin technology and sportier handling but has a slightly lower clearance height, requiring cautious navigation over large Nigerian speedbumps.',
      'Maintenance and Spare Part Availability: Both brands are highly supported in West Africa. Toyota spare parts are universal, sold in every major market across Lagos (from Ladipo to Berger). Hyundai parts are equally accessible and often represent more affordable purchase pricing, giving Hyundai excellent secondary cost-to-benefit ratios.',
      'Resale Value: Toyota holds its value tenaciously in the local used car market. However, Hyundai Sonatas (specifically 2011 to 2021) are closing the gap, offering high-spec cabins (panoramic sunroofs, 360-degree cameras) at millions of Naira less than corresponding Toyotas, representing excellent initial value for modern buyers.'
    ]
  }
};

export default function BlogPage() {
  const { theme } = useTheme();
  const { pathname } = useLocation();

  // Standardize trailing slash
  let cleanPath = pathname;
  if (!cleanPath.endsWith('/')) {
    cleanPath += '/';
  }

  const isMainHub = cleanPath === '/blog/';
  const postData = BLOG_CONTENT[cleanPath];

  // WhatsApp custom coordination link
  const whatsappMsg = encodeURIComponent(
    `Hello LeeAutoX! I am reading your blog post on "${postData?.title || 'Auto Sourcing Insights'}" and would like to proceed with an inquiry.`
  );
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${whatsappMsg}`;

  // If viewing the main Blog listings
  if (isMainHub) {
    const mainData = SEO_DATA['/blog/'];
    return (
      <div className="min-h-screen bg-background text-foreground">
        <PageHeader 
          title={mainData.heading} 
          subtitle={mainData.description} 
          breadcrumbs={mainData.breadcrumbs} 
        />

        {/* Blog Post Grid */}
        <section className={`py-16 px-6 md:px-12 ${
          theme === 'dark' ? 'bg-zinc-950' : 'bg-white'
        }`}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(BLOG_CONTENT).map(([route, content]) => (
                <div 
                  key={route}
                  className={`p-6 border flex flex-col justify-between transition-all duration-300 hover:border-[#2B59FF]/50 hover:shadow-2xl ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#2B59FF] uppercase font-mono block mb-3">
                      {content.category}
                    </span>
                    <h3 className="font-extrabold text-lg uppercase tracking-tight mb-3 line-clamp-2">
                      {content.title}
                    </h3>
                    <p className={`text-xs mb-6 line-clamp-3 leading-relaxed ${
                      theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'
                    }`}>
                      {content.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-800/10 pt-4">
                    <span className="text-[10px] font-mono text-zinc-500">
                      {content.readTime}
                    </span>
                    <Link 
                      to={route}
                      className="text-xs font-extrabold text-[#2B59FF] uppercase tracking-wider flex items-center gap-1 hover:underline"
                    >
                      Read Post
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // If viewing a specific Blog post details
  if (!postData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <h2 className="text-3xl font-black uppercase mb-4">Post Not Found</h2>
        <Link to="/blog/" className="px-6 py-3 bg-[#2B59FF] text-white font-bold uppercase text-xs tracking-wider">
          Return to Blog
        </Link>
      </div>
    );
  }

  const seoData = SEO_DATA[cleanPath] || SEO_DATA['/blog/'];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={postData.title} 
        subtitle={`Written by ${postData.author} | ${postData.date}`} 
        breadcrumbs={seoData.breadcrumbs} 
      />

      <section className={`py-16 px-6 md:px-12 ${
        theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'
      }`}>
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/blog/" 
            className="inline-flex items-center gap-2 mb-8 text-xs font-bold uppercase tracking-wider text-[#2B59FF] hover:underline"
          >
            <ArrowLeft size={14} />
            Back to Blog
          </Link>

          {/* Post Meta Details */}
          <div className="flex flex-wrap items-center gap-6 mb-10 text-xs font-mono text-zinc-500 border-b pb-6 border-zinc-800/10">
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-[#2B59FF]" />
              <span>{postData.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#2B59FF]" />
              <span>{postData.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#2B59FF]" />
              <span>{postData.readTime}</span>
            </div>
            <span className="bg-[#2B59FF]/10 text-[#2B59FF] px-2 py-1 uppercase text-[9px] font-bold font-mono">
              {postData.category}
            </span>
          </div>

          {/* Post Body */}
          <div className="prose prose-invert max-w-none space-y-6 text-sm md:text-base leading-relaxed font-sans">
            {postData.paragraphs.map((p, index) => (
              <p key={index} className={theme === 'dark' ? 'text-zinc-300' : 'text-slate-800'}>
                {p}
              </p>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 border-t pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-bold text-lg uppercase mb-1">Interested in these Sourcing Surcharges?</h4>
              <p className="text-xs text-zinc-500 font-sans">Connect directly with our logistics authors via WhatsApp for an immediate quotation.</p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#2B59FF] hover:bg-[#1a41cc] text-[#FAFBFD] font-bold uppercase text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(43,89,255,0.3)]"
            >
              <MessageSquare size={14} />
              Inquire via WhatsApp
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}
