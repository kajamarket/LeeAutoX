import { useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import VehicleCatalogue from '../components/VehicleCatalogue';
import AutoStore from '../components/AutoStore';
import Contact from '../components/Contact';
import { SEO_DATA } from '../seoData';
import { Car, Shield, Compass, Truck } from 'lucide-react';
import { cleanPathname } from '../utils/path';
import Reveal from '../components/ui/Reveal';

const SPOTLIGHT_CATEGORIES = [
  {
    icon: Car,
    title: 'Luxury Sedans',
    desc: 'High-spec executive cars sourced directly from licensed dealer lots.',
  },
  {
    icon: Compass,
    title: 'All-Road SUVs',
    desc: 'Spacious and durable crossovers selected for optimal road performance.',
  },
  {
    icon: Truck,
    title: 'Fleet & Trucks',
    desc: 'Heavy utility trucks and commercial logistics vans for business owners.',
  },
  {
    icon: Shield,
    title: 'Verified Wins',
    desc: 'Fully inspectable Copart and IAAI vehicles with historical Carfax checks.',
  },
];

export default function VehiclesPage() {
  const { pathname } = useLocation();

  // Standardize trailing slash
  let cleanPath = cleanPathname(pathname);
  if (!cleanPath.endsWith('/')) {
    cleanPath += '/';
  }

  const data = SEO_DATA[cleanPath] || SEO_DATA['/vehicles/'];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] transition-colors duration-300">
      <PageHeader
        title={data.heading}
        subtitle={data.description}
        breadcrumbs={data.breadcrumbs}
      />

      {/* Categories Spotlight Cards */}
      <section className="py-12 px-6 md:px-12 border-b border-[var(--line)] bg-[var(--surface)]/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPOTLIGHT_CATEGORIES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} variant="rise" immediate delay={idx * 55}>
                <div className="lx-card p-6 h-full">
                  <div className="w-11 h-11 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center mb-4">
                    <Icon size={22} />
                  </div>
                  <h4 className="font-serif text-lg font-normal text-[var(--ink)] mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Available Catalogue Component */}
      <VehicleCatalogue />

      {/* Auto Store Component (Parts and Accessories) */}
      <AutoStore />

      <Contact />
    </div>
  );
}

