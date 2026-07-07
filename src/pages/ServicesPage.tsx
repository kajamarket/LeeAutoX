import { useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Services from '../components/Services';
import Fleet from '../components/Fleet';
import { SEO_DATA } from '../seoData';
import { useTheme } from '../context/ThemeContext';
import { Briefcase, Settings, Landmark, ShieldAlert } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={data.heading} 
        subtitle={data.description} 
        breadcrumbs={data.breadcrumbs} 
      />

      {/* Standalone Detail Segment */}
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

      {/* Services Component */}
      <Services />

      {/* Fleet Component */}
      <Fleet />
    </div>
  );
}
