import PageHeader from '../components/PageHeader';
import WhyChooseUs from '../components/WhyChooseUs';
import { SEO_DATA } from '../seoData';
import { useTheme } from '../context/ThemeContext';
import { Shield, Award, Users, Globe } from 'lucide-react';

export default function AboutPage() {
  const { theme } = useTheme();
  const data = SEO_DATA['/about/'];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={data.heading} 
        subtitle={data.description} 
        breadcrumbs={data.breadcrumbs} 
      />

      {/* Main Content Details */}
      <section className={`py-20 px-6 md:px-12 ${
        theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#2B59FF] uppercase bg-[#2B59FF]/10 px-3 py-1.5 inline-block mb-4">
              WHO WE ARE
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-6">
              A Registered Corporation with a Global Sourcing Reach
            </h2>
            <div className={`space-y-6 text-sm leading-relaxed ${
              theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'
            }`}>
              <p>
                LeeAutoX is a premier global vehicle procurement and shipping corporation, legally registered in Canada (Corporation No: 1761065-3). We are dedicated to bridging the gap between major North American automotive dealer auctions and international buyers across Africa.
              </p>
              <p>
                Founded on the principles of extreme transparency, technical precision, and absolute integrity, we handle the entire vehicle lifecycle. From reviewing historical Carfax files and biding on dealer-only salvage portals, to loading cars into heavy-duty containers and executing customs clearing in Nigeria, our processes are 100% verified.
              </p>
              <p>
                We do not just import cars; we secure valuable investments. By avoiding high retail dealer markups, we empower our clients to acquire dream vehicles at wholesale auction pricing, with clear, uninflated landing costs.
              </p>
            </div>
          </div>

          {/* Visual Grid Accents */}
          <div className="grid grid-cols-2 gap-6">
            <div className={`p-8 border ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Shield className="text-[#2B59FF] mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2 uppercase">Fully Registered</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
                Incorporated in Ontario, Canada. Operates legally with certified auction credentials.
              </p>
            </div>

            <div className={`p-8 border ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Award className="text-[#2B59FF] mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2 uppercase">150-Point Check</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
                Every single car undergoes rigorous physical and record inspections prior to bid placement.
              </p>
            </div>

            <div className={`p-8 border ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Users className="text-[#2B59FF] mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2 uppercase">In-House Clearing</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
                Our direct Lagos clearing agency avoids broker markups and protects you from clearing delays.
              </p>
            </div>

            <div className={`p-8 border ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Globe className="text-[#2B59FF] mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2 uppercase">Last-Mile Freight</h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
                Insured transit routes from North American shipping terminals directly to your African doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reuse the WhyChooseUs Section */}
      <WhyChooseUs />
    </div>
  );
}
