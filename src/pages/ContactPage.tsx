import PageHeader from '../components/PageHeader';
import Contact from '../components/Contact';
import MapWhatsApp from '../components/MapWhatsApp';
import { SEO_DATA } from '../seoData';
import { useTheme } from '../context/ThemeContext';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

export default function ContactPage() {
  const { theme } = useTheme();
  const data = SEO_DATA['/contact/'];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={data.heading} 
        subtitle={data.description} 
        breadcrumbs={data.breadcrumbs} 
      />

      {/* Main Location Details */}
      <section className={`py-16 px-6 md:px-12 ${
        theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Toronto Office */}
          <div className={`p-8 border ${
            theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold tracking-widest text-[#2B59FF] uppercase block mb-2 font-mono">
              NORTH AMERICA HEADQUARTERS
            </span>
            <h3 className="font-extrabold text-xl uppercase mb-4 tracking-tight">Toronto, Canada</h3>
            
            <div className="space-y-4 text-xs md:text-sm">
              <div className="flex gap-3 items-start">
                <MapPin size={18} className="text-[#2B59FF] shrink-0" />
                <span className={theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}>
                  Greater Toronto Area, Ontario, Canada (Corp: 1761065-3)
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <Phone size={18} className="text-[#2B59FF]" />
                <span className={theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}>
                  {CONTACT_INFO.phone}
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <Mail size={18} className="text-[#2B59FF]" />
                <span className={theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}>
                  {CONTACT_INFO.email1}
                </span>
              </div>
            </div>
          </div>

          {/* Lagos Clearing Hub */}
          <div className={`p-8 border ${
            theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold tracking-widest text-[#2B59FF] uppercase block mb-2 font-mono">
              WEST AFRICA LOGISTICS HUB
            </span>
            <h3 className="font-extrabold text-xl uppercase mb-4 tracking-tight">Lagos, Nigeria</h3>
            
            <div className="space-y-4 text-xs md:text-sm">
              <div className="flex gap-3 items-start">
                <MapPin size={18} className="text-[#2B59FF] shrink-0" />
                <span className={theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}>
                  Apapa Port Clearance Lot, Lagos State, Nigeria
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <Phone size={18} className="text-[#2B59FF]" />
                <span className={theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}>
                  {CONTACT_INFO.phone}
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <Mail size={18} className="text-[#2B59FF]" />
                <span className={theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}>
                  {CONTACT_INFO.email2}
                </span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className={`p-8 border ${
            theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] font-bold tracking-widest text-[#2B59FF] uppercase block mb-2 font-mono">
              DEDICATED COORDINATION
            </span>
            <h3 className="font-extrabold text-xl uppercase mb-4 tracking-tight">Working Hours</h3>
            
            <div className="space-y-4 text-xs md:text-sm">
              <div className="flex gap-3 items-start">
                <Clock size={18} className="text-[#2B59FF] shrink-0" />
                <div className={theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}>
                  <p className="font-bold">Monday - Friday</p>
                  <p>9:00 AM - 6:00 PM (EST / GMT+1)</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Clock size={18} className="text-[#2B59FF] shrink-0" />
                <div className={theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}>
                  <p className="font-bold">Saturday</p>
                  <p>10:00 AM - 3:00 PM (Lagos Office Only)</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Reuse map and WhatsApp float elements */}
      <MapWhatsApp />
      <Contact />
    </div>
  );
}
