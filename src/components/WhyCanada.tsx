import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileCheck, Snowflake, DollarSign, Building2, MapPin, ArrowRight } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import AnimatedText from './ui/AnimatedText';
import Reveal from './ui/Reveal';

export default function WhyCanada() {
  return (
    <section className="py-16 px-4 sm:px-6 md:px-12 bg-[var(--surface)] text-[var(--ink)] border-b border-[var(--line)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-12">
        <Reveal variant="rise">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold tracking-widest text-[var(--accent)] uppercase bg-[var(--accent-soft)] border border-[var(--accent)]/25 px-3 py-1 rounded-full inline-block mb-3 font-mono">
                The Canadian Advantage
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-[var(--ink)]">
                <AnimatedText text="Why Import Cars With LeeAutoX?" variant="blur-in" />
              </h2>
              <p className="text-sm md:text-base mt-4 leading-relaxed text-[var(--ink-2)]">
                Vehicles sourced through Canadian wholesale auctions and dealer networks offer distinct quality, mechanical verification, and cost advantages over other international import routes.
              </p>
            </div>
            <div className="shrink-0 flex flex-wrap gap-4 items-center">
              <Link
                to="/guides/why-import-cars-from-canada/"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] hover:underline"
              >
                Read complete Canadian quality guide <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Reveal variant="scale" delay={0}>
            <div className="lx-card p-6 h-full">
              <ShieldCheck className="text-[var(--accent)] mb-4" size={26} />
              <h3 className="font-serif text-lg font-normal mb-2 text-[var(--ink)]">MTO Safety Certification</h3>
              <p className="text-xs leading-relaxed text-[var(--ink-2)]">
                In Ontario, vehicles changing hands must pass stringent Ministry of Transportation (MTO) Safety Standard inspections by certified technicians covering brakes, suspension, steering linkages, frame integrity, and structural soundness.
              </p>
            </div>
          </Reveal>

          <Reveal variant="scale" delay={50}>
            <div className="lx-card p-6 h-full">
              <Snowflake className="text-[var(--accent)] mb-4" size={26} />
              <h3 className="font-serif text-lg font-normal mb-2 text-[var(--ink)]">Superior Salt Management</h3>
              <p className="text-xs leading-relaxed text-[var(--ink-2)]">
                Modern Canadian municipal transit departments utilize anti-icing liquid brine solutions and advanced corrosion inhibitors. Canadian car owners routinely apply annual undercarriage rust protection, keeping vehicle chassis clean and solid.
              </p>
            </div>
          </Reveal>

          <Reveal variant="scale" delay={100}>
            <div className="lx-card p-6 h-full">
              <FileCheck className="text-[var(--accent)] mb-4" size={26} />
              <h3 className="font-serif text-lg font-normal mb-2 text-[var(--ink)]">Transparent Carfax Canada</h3>
              <p className="text-xs leading-relaxed text-[var(--ink-2)]">
                Provincial databases (such as Ontario&apos;s UVIP) and unified Carfax Canada records document true mileage logs at every annual inspection, service record, and insurance appraisal—eliminating odometer rollback risk.
              </p>
            </div>
          </Reveal>

          <Reveal variant="scale" delay={150}>
            <div className="lx-card p-6 h-full">
              <DollarSign className="text-[var(--accent)] mb-4" size={26} />
              <h3 className="font-serif text-lg font-normal mb-2 text-[var(--ink)]">CAD Currency Value</h3>
              <p className="text-xs leading-relaxed text-[var(--ink-2)]">
                Purchasing wholesale auction inventory denominated in Canadian Dollars (CAD) delivers stronger purchasing power compared to high US Dollar (USD) valuation, saving buyers substantial capital on base acquisition costs.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal variant="rise">
          <div className="lx-card p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex gap-4 items-start">
              <Building2 className="text-[var(--accent)] shrink-0 mt-1" size={24} />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] block font-bold mb-1">
                  REGISTERED CANADIAN CORPORATION
                </span>
                <h4 className="font-serif text-lg font-normal tracking-tight text-[var(--ink)]">
                  LeeAutoX Inc. — Corporation No: {CONTACT_INFO.corpNumber}
                </h4>
                <p className="text-xs mt-1 leading-relaxed text-[var(--ink-2)]">
                  Incorporated in Ontario, Canada with licensed auction access across Copart Canada, Impact Auto Auctions, and Manheim wholesale rings.
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-[var(--ink)]">
                  <MapPin size={13} className="text-[var(--accent)]" />
                  <span>Canadian Depot: {CONTACT_INFO.addressCA}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-start border-t md:border-t-0 md:border-l border-[var(--line)] pt-6 md:pt-0 md:pl-8">
              <MapPin className="text-[var(--accent)] shrink-0 mt-1" size={24} />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] block font-bold mb-1">
                  VERIFIED NIGERIAN OPERATIONS HUB
                </span>
                <h4 className="font-serif text-lg font-normal tracking-tight text-[var(--ink)]">
                  Lagos Consultation &amp; Handover Hub
                </h4>
                <p className="text-xs mt-1 leading-relaxed text-[var(--ink-2)]">
                  Fully staffed document collection, client consultation, and verified physical vehicle handovers at our Ikeja operations center.
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-[var(--ink)]">
                  <MapPin size={13} className="text-[var(--accent)]" />
                  <span>Nigeria Office: {CONTACT_INFO.addressNG} (Computer Village, Ikeja)</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
