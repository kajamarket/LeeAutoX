import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, FileCheck, Snowflake, DollarSign, Building2, MapPin, ArrowRight } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

export default function WhyCanada() {
  const { theme } = useTheme();

  return (
    <section className={`py-20 px-6 md:px-12 border-b transition-colors duration-500 ${
      theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-3 py-1.5 inline-block mb-3 font-mono">
              THE CANADIAN ADVANTAGE
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Why Import Vehicles From Canada?
            </h2>
            <p className={`text-sm md:text-base mt-4 leading-relaxed ${
              theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'
            }`}>
              Vehicles sourced through Canadian wholesale auctions and dealer networks offer distinct quality, mechanical verification, and cost advantages over other international import routes.
            </p>
          </div>
          <div className="shrink-0 flex flex-wrap gap-4 items-center">
            <Link
              to="/guides/why-import-cars-from-canada/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2B59FF] hover:underline"
            >
              Read complete Canadian quality guide <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 4 Core Canadian Trust Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200'}`}>
            <ShieldCheck className="text-[#2B59FF] mb-4" size={28} />
            <h3 className="font-extrabold text-base uppercase mb-2">MTO Safety Certification</h3>
            <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
              In Ontario, vehicles changing hands must pass stringent Ministry of Transportation (MTO) Safety Standard inspections by certified technicians covering brakes, suspension, steering linkages, frame integrity, and structural soundness.
            </p>
          </div>

          <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200'}`}>
            <Snowflake className="text-[#2B59FF] mb-4" size={28} />
            <h3 className="font-extrabold text-base uppercase mb-2">Superior Salt Management</h3>
            <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
              Modern Canadian municipal transit departments utilize anti-icing liquid brine solutions and advanced corrosion inhibitors. Canadian car owners routinely apply annual undercarriage rust protection (Krown, Rust Check), keeping vehicle chassis clean and solid.
            </p>
          </div>

          <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200'}`}>
            <FileCheck className="text-[#2B59FF] mb-4" size={28} />
            <h3 className="font-extrabold text-base uppercase mb-2">Transparent Carfax Canada</h3>
            <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
              Provincial databases (such as Ontario's UVIP) and unified Carfax Canada records document true mileage logs at every annual inspection, service record, and insurance appraisal—eliminating the rampant odometer rollback found in unregulated markets.
            </p>
          </div>

          <div className={`p-6 border rounded ${theme === 'dark' ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200'}`}>
            <DollarSign className="text-[#2B59FF] mb-4" size={28} />
            <h3 className="font-extrabold text-base uppercase mb-2">CAD Currency Value</h3>
            <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
              Purchasing wholesale auction inventory denominated in Canadian Dollars (CAD) delivers significantly stronger purchasing power compared to high US Dollar (USD) valuation, saving buyers substantial capital on base acquisition costs.
            </p>
          </div>
        </div>

        {/* Corporate Trust Credentials Banner */}
        <div className={`p-8 border rounded grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
          theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex gap-4 items-start">
            <Building2 className="text-[#2B59FF] shrink-0 mt-1" size={26} />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#2B59FF] block font-bold mb-1">
                REGISTERED CANADIAN CORPORATION
              </span>
              <h4 className="font-bold text-base uppercase tracking-tight text-foreground">
                LeeAutoX Inc. — Corporation No: {CONTACT_INFO.corpNumber}
              </h4>
              <p className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                Incorporated in Ontario, Canada with licensed auction access across Copart Canada, Impact Auto Auctions, and Manheim wholesale rings.
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-foreground">
                <MapPin size={13} className="text-[#2B59FF]" />
                <span>Canadian Depot: {CONTACT_INFO.addressCA}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-start border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
            <MapPin className="text-[#2B59FF] shrink-0 mt-1" size={26} />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#2B59FF] block font-bold mb-1">
                VERIFIED NIGERIAN OPERATIONS HUB
              </span>
              <h4 className="font-bold text-base uppercase tracking-tight text-foreground">
                Lagos Consultation & Handover Hub
              </h4>
              <p className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
                Fully staffed document collection, client consultation, and verified physical vehicle handovers at our Ikeja operations center.
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-foreground">
                <MapPin size={13} className="text-[#2B59FF]" />
                <span>Nigeria Office: {CONTACT_INFO.addressNG} (Computer Village, Ikeja)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
