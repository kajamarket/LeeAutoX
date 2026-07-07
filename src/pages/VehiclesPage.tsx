import { useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import VehicleCatalogue from '../components/VehicleCatalogue';
import AutoStore from '../components/AutoStore';
import { SEO_DATA } from '../seoData';
import { useTheme } from '../context/ThemeContext';
import { Car, Shield, Compass, Truck } from 'lucide-react';
import { cleanPathname } from '../utils/path';

export default function VehiclesPage() {
  const { theme } = useTheme();
  const { pathname } = useLocation();

  // Standardize trailing slash
  let cleanPath = cleanPathname(pathname);
  if (!cleanPath.endsWith('/')) {
    cleanPath += '/';
  }

  const data = SEO_DATA[cleanPath] || SEO_DATA['/vehicles/'];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={data.heading} 
        subtitle={data.description} 
        breadcrumbs={data.breadcrumbs} 
      />

      {/* Categories Spotlight Cards */}
      <section className={`py-12 px-6 md:px-12 border-b transition-colors duration-500 ${
        theme === 'dark' ? 'bg-zinc-950 border-zinc-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
            <Car className="text-[#2B59FF] mb-3" size={28} />
            <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Luxury Sedans</h4>
            <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
              High-spec executive cars sourced directly from licensed dealer lots.
            </p>
          </div>

          <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
            <Compass className="text-[#2B59FF] mb-3" size={28} />
            <h4 className="font-bold text-sm uppercase tracking-wide mb-1">All-Road SUVs</h4>
            <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
              Spacious and durable crossovers selected for optimal road performance.
            </p>
          </div>

          <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
            <Truck className="text-[#2B59FF] mb-3" size={28} />
            <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Fleet & Trucks</h4>
            <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
              Heavy utility trucks and commercial logistics vans for business owners.
            </p>
          </div>

          <div className={`p-6 border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
            <Shield className="text-[#2B59FF] mb-3" size={28} />
            <h4 className="font-bold text-sm uppercase tracking-wide mb-1 font-sans">Verified Wins</h4>
            <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
              Fully inspectable Copart and IAAI vehicles with historical Carfax checks.
            </p>
          </div>
        </div>
      </section>

      {/* Available Catalogue Component */}
      <VehicleCatalogue />

      {/* Auto Store Component (Parts and Accessories) */}
      <AutoStore />
    </div>
  );
}
