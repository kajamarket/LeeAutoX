import PageHeader from '../components/PageHeader';
import Process from '../components/Process';
import Contact from '../components/Contact';
import { SEO_DATA } from '../seoData';
import { useTheme } from '../context/ThemeContext';
import { Compass, Ship, FileText, CheckCircle } from 'lucide-react';

export default function HowItWorksPage() {
  const { theme } = useTheme();
  const data = SEO_DATA['/how-it-works/'];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={data.heading} 
        subtitle={data.description} 
        breadcrumbs={data.breadcrumbs} 
      />

      <section className={`py-16 px-6 md:px-12 ${
        theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'
      }`}>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-3 py-1.5 inline-block mb-3">
            LOGISTICS ROADMAP
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">
            How We Get Your Vehicle Safely to You
          </h2>
          <p className={`mt-4 text-sm leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>
            Importing a vehicle from Canada or the USA shouldn't be an opaque black box. We have designed a transparent, milestone-driven framework that guarantees peace of mind and constant tracking.
          </p>
        </div>

        {/* Detailed Logistics Steps */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-[#2B59FF]/10 flex items-center justify-center text-[#2B59FF] shrink-0 border border-[#2B59FF]/20">
              <Compass size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg uppercase mb-2">1. Request & Bidding Strategy</h3>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-600'}`}>
                You specify the car, make, year, and target auction lot. Our licensed Canada brokers review historical data (Carfax, Autocheck, Copart records) to build a smart, risk-free bidding ceiling.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-12 h-12 bg-[#2B59FF]/10 flex items-center justify-center text-[#2B59FF] shrink-0 border border-[#2B59FF]/20">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg uppercase mb-2">2. Sourcing & On-site Verification</h3>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-600'}`}>
                Once our bid wins, we inspect the car directly at the yard. We verify that there are no hidden structural issues, engine compression failures, or title-brand mismatch errors before cleared for export.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-12 h-12 bg-[#2B59FF]/10 flex items-center justify-center text-[#2B59FF] shrink-0 border border-[#2B59FF]/20">
              <Ship size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg uppercase mb-2">3. Container Shipping & Tracking</h3>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-600'}`}>
                We load your vehicle in heavy-duty steel shipping containers out of our Scarborough depot. Each vehicle is securely strapped to prevent shifting, and global container tracking numbers are issued immediately.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-12 h-12 bg-[#2B59FF]/10 flex items-center justify-center text-[#2B59FF] shrink-0 border border-[#2B59FF]/20">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg uppercase mb-2">4. Lagos Customs Clearing & Handover</h3>
              <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-600'}`}>
                Upon arrival at Apapa or Tin Can port, our clearing coordinators prepare full documentation, handle valuations, pay duty levies, and clear the car safely. We coordinate the direct, fully washed handover on our lot or at your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reuse the interactive Process flow */}
      <Process />

      <Contact />
    </div>
  );
}
