import { useLocation, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Services from '../components/Services';
import Fleet from '../components/Fleet';
import Contact from '../components/Contact';
import { SEO_DATA } from '../seoData';
import { useTheme } from '../context/ThemeContext';
import { Briefcase, Settings, Landmark, ShieldAlert, Gavel, ShieldCheck, Truck, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { cleanPathname } from '../utils/path';

export default function ServicesPage() {
  const { theme } = useTheme();
  const { pathname } = useLocation();

  // Standardize trailing slash
  let cleanPath = cleanPathname(pathname);
  if (!cleanPath.endsWith('/')) {
    cleanPath += '/';
  }

  const data = SEO_DATA[cleanPath] || SEO_DATA['/services/'];

  const isAuctionPage = cleanPath.includes('auction') || cleanPath.includes('vehicle-sourcing');
  const isInstallmentPage = cleanPath.includes('installment-plans') || cleanPath.includes('financing');

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={data.heading} 
        subtitle={data.description} 
        breadcrumbs={data.breadcrumbs} 
      />

      {/* Tailored Section: Auction Bidding & Proxy Procurement */}
      {isAuctionPage ? (
        <section className={`py-16 px-6 md:px-12 border-b transition-colors duration-500 ${
          theme === 'dark' ? 'bg-zinc-950 border-zinc-900 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="max-w-3xl">
              <span className="text-xs font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-3 py-1.5 inline-block mb-3">
                LICENSED AUCTION ACCESS
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight mb-4">
                Professional Proxy Bidding on Copart Canada, Impact Auto & Manheim
              </h2>
              <p className={`text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-600'}`}>
                Buying wholesale auction inventory in Canada doesn't require you to hold individual dealer brokerage licenses or register expensive foreign entities. LeeAutoX operates as your licensed Canadian dealer proxy, providing direct commercial bidding power on <strong>Copart Canada</strong>, <strong>Impact Auto Auctions (IAAI Canada)</strong>, and wholesale dealer-only <strong>Manheim Canada</strong> rings.
              </p>
            </div>

            {/* 4 Core Pillars of Auction Protection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <Gavel className="text-[#2B59FF] mb-3" size={26} />
                <h4 className="font-bold text-sm uppercase tracking-wider mb-2">Live Proxy Bidding</h4>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  We represent your ceiling bid in live auction rings, preventing emotional bid wars and securing vehicles at true wholesale book prices.
                </p>
              </div>

              <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <ShieldCheck className="text-[#2B59FF] mb-3" size={26} />
                <h4 className="font-bold text-sm uppercase tracking-wider mb-2">Run & Drive Verification</h4>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  We audit lot notes and dispatch local inspectors to verify genuine engine ignition, transmission engagement, frame integrity, and flood markers.
                </p>
              </div>

              <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <ShieldAlert className="text-[#2B59FF] mb-3" size={26} />
                <h4 className="font-bold text-sm uppercase tracking-wider mb-2">Lien & Title Audits</h4>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Every VIN undergoes Carfax Canada and provincial PPSA searches to guarantee clean ownership transfer, zero bank liens, and CBSA export clearance.
                </p>
              </div>

              <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <Truck className="text-[#2B59FF] mb-3" size={26} />
                <h4 className="font-bold text-sm uppercase tracking-wider mb-2">Rapid Inland Flatbed</h4>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Immediate dispatch from Ontario yards (Cookstown, Oshawa, Hamilton) to our Scarborough hub (109 Slan Ave) before auction storage fees accrue.
                </p>
              </div>
            </div>

            {/* Crucial Age Limit Warning */}
            <div className={`p-6 border-l-4 border-amber-500 rounded-r ${
              theme === 'dark' ? 'bg-amber-950/20 border-zinc-800' : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-start gap-4">
                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={24} />
                <div className="space-y-2">
                  <h4 className={`font-bold text-sm uppercase tracking-wide ${theme === 'dark' ? 'text-amber-400' : 'text-amber-900'}`}>
                    Important: Nigerian Vehicle Age Restriction (12-Year Rule)
                  </h4>
                  <p className={`text-xs md:text-sm leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>
                    Under current Nigerian import regulations, vehicles manufactured more than <strong>12 years</strong> prior to the date of arrival are restricted from standard passenger clearance. In 2026, this means eligible vehicles must generally be <strong>2014 models or newer</strong>. Before placing any auction bids, our procurement desk audits the exact manufacturing build month/year stamped on the driver's door jamb VIN plate to guarantee your vehicle is 100% eligible for customs clearance at Lagos ports.
                  </p>
                </div>
              </div>
            </div>

            {/* Internal Resources Navigation */}
            <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#2B59FF] mb-3">
                ESSENTIAL IMPORT RESOURCES
              </h4>
              <p className={`text-xs md:text-sm mb-4 leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                Review our technical guides and calculators to compute total landed costs and ocean freight timelines before you bid:
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold">
                <Link to="/guides/import-car-canada-to-nigeria/" className="flex items-center gap-1.5 text-[#2B59FF] hover:underline">
                  Complete Canada-to-Nigeria Import Guide <ArrowRight size={14} />
                </Link>
                <Link to="/guides/shipping-cost-canada-to-nigeria/" className="flex items-center gap-1.5 text-[#2B59FF] hover:underline">
                  Full Shipping & Duty Cost Breakdown <ArrowRight size={14} />
                </Link>
                <Link to="/nigeria/import-duty-calculator/" className="flex items-center gap-1.5 text-[#2B59FF] hover:underline">
                  Nigeria Import Duty Calculator <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : isInstallmentPage ? (
        /* Tailored Section: Installment Plans & Financing */
        <section className={`py-16 px-6 md:px-12 border-b transition-colors duration-500 ${
          theme === 'dark' ? 'bg-zinc-950 border-zinc-900 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="max-w-3xl">
              <span className="text-xs font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-3 py-1.5 inline-block mb-3">
                FINANCIAL FLEXIBILITY
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight mb-4">
                Structured 3-Stage Milestone Financing in Nigerian Naira
              </h2>
              <p className={`text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-600'}`}>
                Importing your dream vehicle from Canadian auctions shouldn't require tying up 100% of your capital on day one. LeeAutoX provides an industry-first <strong>50-25-25 milestone structure</strong>, allowing you to lock in rare auction deals while spreading freight and customs clearing charges across verifiable shipping events.
              </p>
            </div>

            {/* The 3 Milestones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 border rounded relative ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="w-8 h-8 rounded-full bg-[#2B59FF] text-white flex items-center justify-center font-bold text-sm mb-4">
                  1
                </span>
                <span className="text-[10px] font-mono uppercase font-bold text-[#2B59FF] tracking-wider block mb-1">
                  AUCTION ACQUISITION (50%)
                </span>
                <h4 className="font-extrabold text-base mb-2 text-foreground">
                  Lock In The Auction Unit
                </h4>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Pay an initial 50% commitment downpayment in Naira. We execute your live bid, pay the Canadian auction house (Copart/Impact Auto), and tow the vehicle to our Scarborough depot. You secure your car without paying full landed costs upfront.
                </p>
              </div>

              <div className={`p-6 border rounded relative ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="w-8 h-8 rounded-full bg-[#2B59FF] text-white flex items-center justify-center font-bold text-sm mb-4">
                  2
                </span>
                <span className="text-[10px] font-mono uppercase font-bold text-[#2B59FF] tracking-wider block mb-1">
                  CONTAINER LOADING (25%)
                </span>
                <h4 className="font-extrabold text-base mb-2 text-foreground">
                  Container Staging & Bill of Lading
                </h4>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Once your car is inspected, rigged into a steel ocean container, and loaded onto the vessel in Montreal or Halifax, we issue your official Bill of Lading and container tracking number. The second 25% installment is funded here.
                </p>
              </div>

              <div className={`p-6 border rounded relative ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="w-8 h-8 rounded-full bg-[#2B59FF] text-white flex items-center justify-center font-bold text-sm mb-4">
                  3
                </span>
                <span className="text-[10px] font-mono uppercase font-bold text-[#2B59FF] tracking-wider block mb-1">
                  ARRIVAL & HANDOVER (25%)
                </span>
                <h4 className="font-extrabold text-base mb-2 text-foreground">
                  Port Discharge & Key Handover
                </h4>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  When the container arrives at Lagos ports (Apapa or Tin Can Island) and enters customs processing, you remit the final 25% balance prior to gate release and physical vehicle handover at our Ikeja office or directly to your doorstep.
                </p>
              </div>
            </div>

            {/* Why This Matters */}
            <div className={`p-6 border rounded flex flex-col md:flex-row gap-6 items-center justify-between ${
              theme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="space-y-1">
                <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">
                  Budgeting with Confidence
                </h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Milestone payments protect your working capital and give you total visibility at every stage of the 8–12 week transit pipeline.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0 text-xs">
                <Link to="/guides/shipping-cost-canada-to-nigeria/" className="px-4 py-2 border border-[#2B59FF] text-[#2B59FF] font-bold rounded hover:bg-[#2B59FF] hover:text-white transition-colors">
                  View Cost Breakdown
                </Link>
                <Link to="/nigeria/import-duty-calculator/" className="px-4 py-2 bg-[#2B59FF] text-white font-bold rounded hover:bg-[#1a41cc] transition-colors">
                  Calculate Import Duty
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Standalone Generic Detail Segment */
        <section className={`py-16 px-6 md:px-12 border-b transition-colors duration-500 ${
          theme === 'dark' ? 'bg-zinc-950 border-zinc-900 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-3 py-1.5 inline-block mb-3">
                PREMIUM STANDARDS
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-6">
                Professional Grade Auto Brokerage and Logistics
              </h2>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                Our comprehensive services guarantee that your vehicle procurement experience is optimized, secure, and hassle-free. From bid execution on exclusive Canadian dealer networks, to custom customs clearance at Lagos ports, we set the benchmark for global vehicle logistics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <Briefcase className="text-[#2B59FF] mb-3" size={24} />
                <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Direct Auctions</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
                  Full access to Copart and IAAI auctions without individual broker licenses.
                </p>
              </div>

              <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <Settings className="text-[#2B59FF] mb-3" size={24} />
                <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Heavy Strapping</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
                  Heavy-duty marine container loading utilizing secure steel belts.
                </p>
              </div>

              <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <Landmark className="text-[#2B59FF] mb-3" size={24} />
                <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Naira Milestones</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
                  Secure installment plans with milestones matched to transit events.
                </p>
              </div>

              <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <ShieldAlert className="text-[#2B59FF] mb-3" size={24} />
                <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Customs Escrow</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
                  Transparent port duty calculations with no hidden fees or vouchers.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Component */}
      <Services />

      {/* Fleet Component */}
      <Fleet />

      <Contact />
    </div>
  );
}
