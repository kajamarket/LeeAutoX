import { useLocation, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Services from '../components/Services';
import Fleet from '../components/Fleet';
import Contact from '../components/Contact';
import { SEO_DATA } from '../seoData';
import {
  Briefcase,
  Settings,
  Landmark,
  ShieldAlert,
  Gavel,
  ShieldCheck,
  Truck,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { cleanPathname } from '../utils/path';
import Reveal from '../components/ui/Reveal';
import AnimatedText from '../components/ui/AnimatedText';
import { RippleLink } from '../components/ui/ImportedControls';

export default function ServicesPage() {
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <PageHeader
        title={data.heading}
        subtitle={data.description}
        breadcrumbs={data.breadcrumbs}
      />

      {/* Tailored Section: Auction Bidding & Proxy Procurement */}
      {isAuctionPage ? (
        <section className="py-16 px-6 md:px-12 border-b border-[var(--line)] bg-[var(--bg)] text-[var(--ink)]">
          <div className="max-w-7xl mx-auto space-y-12">
            <Reveal variant="rise" className="max-w-3xl">
              <span className="text-xs font-mono font-semibold tracking-widest text-[var(--accent)] uppercase bg-[var(--accent-soft)] rounded-full px-3.5 py-1.5 inline-block mb-3">
                LICENSED AUCTION ACCESS
              </span>
              <h2 className="font-serif text-2xl md:text-4xl font-normal tracking-tight mb-4 text-[var(--ink)]">
                <AnimatedText text="Professional Proxy Bidding on Copart Canada, Impact Auto & Manheim" variant="blur-in" />
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-[var(--ink-2)]">
                Buying wholesale auction inventory in Canada doesn't require you to hold individual dealer brokerage licenses or register expensive foreign entities. LeeAutoX operates as your licensed Canadian dealer proxy, providing direct commercial bidding power on <strong className="text-[var(--ink)]">Copart Canada</strong>, <strong className="text-[var(--ink)]">Impact Auto Auctions (IAAI Canada)</strong>, and wholesale dealer-only <strong className="text-[var(--ink)]">Manheim Canada</strong> rings.
              </p>
            </Reveal>

            {/* 4 Core Pillars of Auction Protection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Gavel,
                  title: 'Live Proxy Bidding',
                  desc: 'We represent your ceiling bid in live auction rings, preventing emotional bid wars and securing vehicles at true wholesale book prices.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Run & Drive Verification',
                  desc: 'We audit lot notes and dispatch local inspectors to verify genuine engine ignition, transmission engagement, frame integrity, and flood markers.',
                },
                {
                  icon: ShieldAlert,
                  title: 'Lien & Title Audits',
                  desc: 'Every VIN undergoes Carfax Canada and provincial PPSA searches to guarantee clean ownership transfer, zero bank liens, and CBSA export clearance.',
                },
                {
                  icon: Truck,
                  title: 'Rapid Inland Flatbed',
                  desc: 'Immediate dispatch from Ontario yards (Cookstown, Oshawa, Hamilton) to our Scarborough hub (109 Slan Ave) before auction storage fees accrue.',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} variant="rise" delay={idx * 70}>
                    <div className="lx-card p-6 h-full">
                      <Icon className="text-[var(--accent)] mb-3" size={26} />
                      <h4 className="font-serif text-base font-normal mb-2 text-[var(--ink)]">
                        {item.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-[var(--ink-2)]">
                        {item.desc}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Crucial Age Limit Warning */}
            <Reveal variant="rise">
              <div className="p-6 border border-amber-500/35 border-l-4 border-l-amber-500 rounded-2xl bg-amber-500/10">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={24} />
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm uppercase tracking-wide text-amber-700 dark:text-amber-300">
                      Important: Nigerian Vehicle Age Restriction (12-Year Rule)
                    </h4>
                    <p className="text-xs md:text-sm leading-relaxed text-[var(--ink)]">
                      Under current Nigerian import regulations, vehicles manufactured more than <strong>12 years</strong> prior to the date of arrival are restricted from standard passenger clearance. In 2026, this means eligible vehicles must generally be <strong>2014 models or newer</strong>. Before placing any auction bids, our procurement desk audits the exact manufacturing build month/year stamped on the driver's door jamb VIN plate to guarantee your vehicle is 100% eligible for customs clearance at Lagos ports.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Internal Resources Navigation */}
            <Reveal variant="rise">
              <div className="lx-card p-6 sm:p-8 bg-[var(--surface)]">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--accent)] mb-3">
                  ESSENTIAL IMPORT RESOURCES
                </h4>
                <p className="text-xs md:text-sm mb-4 leading-relaxed text-[var(--ink-2)]">
                  Review our technical guides and calculators to compute total landed costs and ocean freight timelines before you bid:
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-semibold">
                  <Link to="/guides/import-car-canada-to-nigeria/" className="flex items-center gap-1.5 text-[var(--accent)] hover:underline">
                    Complete Canada-to-Nigeria Import Guide <ArrowRight size={14} />
                  </Link>
                  <Link to="/guides/shipping-cost-canada-to-nigeria/" className="flex items-center gap-1.5 text-[var(--accent)] hover:underline">
                    Full Shipping & Duty Cost Breakdown <ArrowRight size={14} />
                  </Link>
                  <Link to="/nigeria/import-duty-calculator/" className="flex items-center gap-1.5 text-[var(--accent)] hover:underline">
                    Nigeria Import Duty Calculator <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : isInstallmentPage ? (
        /* Tailored Section: Installment Plans & Financing */
        <section className="py-16 px-6 md:px-12 border-b border-[var(--line)] bg-[var(--bg)] text-[var(--ink)]">
          <div className="max-w-7xl mx-auto space-y-12">
            <Reveal variant="rise" className="max-w-3xl">
              <span className="text-xs font-mono font-semibold tracking-widest text-[var(--accent)] uppercase bg-[var(--accent-soft)] rounded-full px-3.5 py-1.5 inline-block mb-3">
                FINANCIAL FLEXIBILITY
              </span>
              <h2 className="font-serif text-2xl md:text-4xl font-normal tracking-tight mb-4 text-[var(--ink)]">
                <AnimatedText text="Structured 3-Stage Milestone Financing in Nigerian Naira" variant="blur-in" />
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-[var(--ink-2)]">
                Importing your dream vehicle from Canadian auctions shouldn't require tying up 100% of your capital on day one. LeeAutoX provides an industry-first <strong className="text-[var(--ink)]">50-25-25 milestone structure</strong>, allowing you to lock in rare auction deals while spreading freight and customs clearing charges across verifiable shipping events.
              </p>
            </Reveal>

            {/* The 3 Milestones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  num: '1',
                  tag: 'AUCTION ACQUISITION (50%)',
                  title: 'Lock In The Auction Unit',
                  desc: 'Pay an initial 50% commitment downpayment in Naira. We execute your live bid, pay the Canadian auction house (Copart/Impact Auto), and tow the vehicle to our Scarborough depot. You secure your car without paying full landed costs upfront.',
                },
                {
                  num: '2',
                  tag: 'CONTAINER LOADING (25%)',
                  title: 'Container Staging & Bill of Lading',
                  desc: 'Once your car is inspected, rigged into a steel ocean container, and loaded onto the vessel in Montreal or Halifax, we issue your official Bill of Lading and container tracking number. The second 25% installment is funded here.',
                },
                {
                  num: '3',
                  tag: 'ARRIVAL & HANDOVER (25%)',
                  title: 'Port Discharge & Key Handover',
                  desc: 'When the container arrives at Lagos ports (Apapa or Tin Can Island) and enters customs processing, you remit the final 25% balance prior to gate release and physical vehicle handover at our Ikeja office or directly to your doorstep.',
                },
              ].map((m, idx) => (
                <Reveal key={m.num} variant="rise" delay={idx * 80}>
                  <div className="lx-card p-6 sm:p-7 h-full relative">
                    <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center font-mono font-bold text-sm mb-4">
                      {m.num}
                    </span>
                    <span className="text-[10px] font-mono uppercase font-bold text-[var(--accent)] tracking-wider block mb-1">
                      {m.tag}
                    </span>
                    <h4 className="font-serif text-lg font-normal mb-2 text-[var(--ink)]">
                      {m.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-[var(--ink-2)]">
                      {m.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Why This Matters */}
            <Reveal variant="rise">
              <div className="lx-card p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center justify-between bg-[var(--surface)]">
                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-normal text-[var(--ink)]">
                    Budgeting with Confidence
                  </h4>
                  <p className="text-xs md:text-sm text-[var(--ink-2)]">
                    Milestone payments protect your working capital and give you total visibility at every stage of the 8–12 week transit pipeline.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0 text-xs">
                  <RippleLink to="/guides/shipping-cost-canada-to-nigeria/" variant="outline">
                    View Cost Breakdown
                  </RippleLink>
                  <RippleLink to="/nigeria/import-duty-calculator/" variant="primary">
                    Calculate Import Duty
                  </RippleLink>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : (
        /* Standalone Generic Detail Segment */
        <section className="py-16 px-6 md:px-12 border-b border-[var(--line)] bg-[var(--bg)] text-[var(--ink)]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal variant="rise">
              <span className="text-xs font-mono font-semibold tracking-widest text-[var(--accent)] uppercase bg-[var(--accent-soft)] rounded-full px-3.5 py-1.5 inline-block mb-3">
                PREMIUM STANDARDS
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-normal tracking-tight mb-6 text-[var(--ink)]">
                <AnimatedText text="Professional Grade Auto Brokerage and Logistics" variant="blur-in" />
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-[var(--ink-2)]">
                Our comprehensive services guarantee that your vehicle procurement experience is optimized, secure, and hassle-free. From bid execution on exclusive Canadian dealer networks, to custom customs clearance at Lagos ports, we set the benchmark for global vehicle logistics.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: Briefcase,
                  title: 'Direct Auctions',
                  desc: 'Full access to Copart and IAAI auctions without individual broker licenses.',
                },
                {
                  icon: Settings,
                  title: 'Heavy Strapping',
                  desc: 'Heavy-duty marine container loading utilizing secure steel belts.',
                },
                {
                  icon: Landmark,
                  title: 'Naira Milestones',
                  desc: 'Secure installment plans with milestones matched to transit events.',
                },
                {
                  icon: ShieldAlert,
                  title: 'Customs Escrow',
                  desc: 'Transparent port duty calculations with no hidden fees or vouchers.',
                },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <Reveal key={card.title} variant="rise" delay={idx * 70}>
                    <div className="lx-card p-6 h-full">
                      <Icon className="text-[var(--accent)] mb-3" size={24} />
                      <h4 className="font-serif text-base font-normal mb-1.5 text-[var(--ink)]">
                        {card.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-[var(--ink-2)]">
                        {card.desc}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
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
